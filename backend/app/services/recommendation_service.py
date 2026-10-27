import os
import json
import torch
import random
from typing import List, Dict, Any, Optional

from app.ml.ncf_model import NCF
from app.ml.trainer import NCFTrainer
from app.services.analytics_service import AnalyticsService
from app.core.rec_utils import filter_duplicate_recommendations
from app.models.product import Product

class RecommendationService:
    def __init__(self):
        self.models_dir = os.path.join(os.path.dirname(__file__), "..", "ml", "saved_models")
        self.model_path = os.path.join(self.models_dir, "ncf_weights.pth")
        self.mappings_path = os.path.join(self.models_dir, "mappings.json")

        self.model: Optional[NCF] = None
        self.mappings: Optional[Dict[str, Any]] = None
        self.cached_item_embeddings: Optional[torch.Tensor] = None

        # Tích hợp Sub-services
        self.trainer = NCFTrainer(
            models_dir=self.models_dir,
            model_path=self.model_path,
            mappings_path=self.mappings_path,
            on_model_updated=lambda: self._load_model(force_reload=True)
        )
        self.analytics = AnalyticsService(mappings_path=self.mappings_path)

    def _load_model(self, force_reload: bool = False) -> bool:
        """Nạp nóng mô hình NCF và Pre-computed Item Embeddings vào bộ nhớ RAM"""
        if not os.path.exists(self.model_path) or not os.path.exists(self.mappings_path):
            return False

        if self.model is None or self.mappings is None or force_reload:
            try:
                with open(self.mappings_path, "r", encoding="utf-8") as f:
                    self.mappings = json.load(f)

                self.model = NCF(
                    num_users=self.mappings["num_users"],
                    num_items=self.mappings["num_items"],
                    embedding_dim=16,
                    hidden_layers=[32, 16, 8]
                )
                self.model.load_state_dict(torch.load(self.model_path, map_location=torch.device('cpu')))
                self.model.eval()

                # Tiền tính toán & L2-normalize ma trận Embeddings sản phẩm trong RAM
                with torch.no_grad():
                    all_embed_mf = self.model.embedding_item_mf.weight.data
                    all_embed_mlp = self.model.embedding_item_mlp.weight.data
                    raw_embeds = torch.cat([all_embed_mf, all_embed_mlp], dim=-1) # [num_items, 32]
                    self.cached_item_embeddings = torch.nn.functional.normalize(raw_embeds, p=2, dim=1)
                return True
            except Exception as e:
                print(f"[NCF Model Load Error] {e}")
                return False
        return True

    # --- Ủy nhiệm các hàm quản lý Model & Analytics (Giữ nguyên API Contract) ---
    def get_model_info(self) -> Dict[str, Any]:
        return self.trainer.get_model_info()

    def get_training_status(self) -> Dict[str, Any]:
        return self.trainer.get_training_status()

    async def start_background_training(self) -> Dict[str, Any]:
        return await self.trainer.start_background_training()

    async def log_impression(self, recommended_product_ids: List[str], source: str = "homepage", user_id: Optional[str] = None) -> str:
        return await self.analytics.log_impression(recommended_product_ids, source, user_id)

    async def track_click(self, impression_id: str, product_id: str, user_id: Optional[str] = None) -> Dict[str, Any]:
        return await self.analytics.track_click(impression_id, product_id, user_id)

    async def get_online_metrics(self) -> Dict[str, Any]:
        return await self.analytics.get_online_metrics()

    @staticmethod
    def _filter_duplicate_recs(products: List[Product], max_count: int) -> List[Product]:
        return filter_duplicate_recommendations(products, max_count)

    # --- Pipeline Gợi ý cá nhân hóa chính (Hybrid Context-Aware Recommender) ---
    async def get_recommendations_for_user(
        self,
        user_id: str = "",
        top_k: int = 8,
        current_product_id: Optional[str] = None,
        sport_type: Optional[str] = None
    ) -> List[Product]:
        """
        Hybrid Context-Aware Recommendation:
        - NeuMF In-Memory Inference
        - Context Boost (Sport, Category, Rating)
        - Cold-Start & Diverse Fallbacks
        - 3-Tier Deduplication
        """
        model_loaded = self._load_model()
        exclude_ids = [current_product_id] if current_product_id else []

        target_sport = sport_type
        target_type = None
        target_categories = []

        if current_product_id:
            try:
                curr_prod = await Product.find_one({"product_id": current_product_id})
                if curr_prod:
                    if not target_sport:
                        target_sport = curr_prod.sport_type
                    target_type = curr_prod.product_type
                    target_categories = curr_prod.category or []
            except Exception as e:
                print(f"[Recommendation] Context error: {e}")

        # 1. Người dùng đã đăng nhập & đã có trong bảng ánh xạ NCF
        if model_loaded and user_id and user_id in self.mappings.get("user_to_index", {}):
            try:
                user_to_index = self.mappings["user_to_index"]
                item_to_index = self.mappings["item_to_index"]
                index_to_item = self.mappings["index_to_item"]

                u_idx = user_to_index[user_id]
                all_item_indices = list(item_to_index.values())
                u_tensor = torch.tensor([u_idx] * len(all_item_indices), dtype=torch.long)
                i_tensor = torch.tensor(all_item_indices, dtype=torch.long)

                with torch.no_grad():
                    predictions = self.model(u_tensor, i_tensor).squeeze().tolist()

                item_scores = {
                    index_to_item[str(idx)]: float(score)
                    for idx, score in zip(all_item_indices, predictions)
                    if index_to_item.get(str(idx)) and index_to_item.get(str(idx)) not in exclude_ids
                }

                candidate_prods = await Product.find({
                    "product_id": {"$in": list(item_scores.keys())},
                    "is_hidden": {"$ne": True},
                    "is_deleted": {"$ne": True}
                }).to_list()

                scored_prods = []
                for p in candidate_prods:
                    base_score = item_scores.get(p.product_id, 0.5)
                    if target_sport and p.sport_type == target_sport:
                        base_score += 0.45
                    if target_type and p.product_type == target_type:
                        base_score += 0.15
                    if target_categories and any(c in (p.category or []) for c in target_categories):
                        base_score += 0.15
                    base_score += (p.rating or 4.0) * 0.05
                    base_score += random.uniform(-0.04, 0.04)
                    scored_prods.append((base_score, p))

                scored_prods.sort(key=lambda x: x[0], reverse=True)
                top_candidates = [p for _, p in scored_prods[:max(top_k * 3, 24)]]

                if len(top_candidates) >= top_k:
                    guaranteed = top_candidates[:2]
                    pool = top_candidates[2:]
                    random.shuffle(pool)
                    return filter_duplicate_recommendations(guaranteed + pool, top_k)

                needed = top_k - len(top_candidates)
                more_recs = await self._get_context_or_cold_start_recommendations(
                    needed * 3,
                    current_product_id=current_product_id,
                    target_sport=target_sport,
                    target_type=target_type,
                    target_categories=target_categories,
                    exclude_ids=exclude_ids + [p.product_id for p in top_candidates]
                )
                top_candidates.extend(more_recs)
                return filter_duplicate_recommendations(top_candidates, top_k)

            except Exception as e:
                print(f"[NCF] Error predicting for user {user_id}: {e}")

        # 2. Khách vãng lai có ngữ cảnh sản phẩm đang xem
        if current_product_id or target_sport:
            recs = await self._get_context_or_cold_start_recommendations(
                top_k * 3,
                current_product_id=current_product_id,
                target_sport=target_sport,
                target_type=target_type,
                target_categories=target_categories,
                exclude_ids=exclude_ids
            )
            return filter_duplicate_recommendations(recs, top_k)

        # 3. Khách vãng lai ở Trang Chủ: Đề xuất thịnh hành đa dạng qua các môn
        recs = await self._get_diverse_trending_recommendations(top_k * 3, exclude_ids=exclude_ids)
        return filter_duplicate_recommendations(recs, top_k)

    async def _get_context_or_cold_start_recommendations(
        self,
        top_k: int,
        current_product_id: Optional[str] = None,
        target_sport: Optional[str] = None,
        target_type: Optional[str] = None,
        target_categories: Optional[List[str]] = None,
        exclude_ids: Optional[List[str]] = None
    ) -> List[Product]:
        """Gợi ý ngữ cảnh kết hợp độ tương đồng Item Embeddings từ mô hình NCF"""
        exclude_list = list(exclude_ids or [])
        if current_product_id and current_product_id not in exclude_list:
            exclude_list.append(current_product_id)

        ncf_similarity_map = {}
        if self._load_model() and current_product_id and current_product_id in self.mappings.get("item_to_index", {}):
            try:
                item_to_index = self.mappings["item_to_index"]
                index_to_item = self.mappings["index_to_item"]
                curr_idx = item_to_index[current_product_id]

                with torch.no_grad():
                    all_embed_mf = self.model.embedding_item_mf.weight
                    all_embed_mlp = self.model.embedding_item_mlp.weight
                    all_item_embeds = torch.cat([all_embed_mf, all_embed_mlp], dim=-1)

                    curr_tensor = torch.tensor([curr_idx], dtype=torch.long)
                    curr_embed = all_item_embeds[curr_tensor]

                    from torch.nn.functional import cosine_similarity
                    sims = cosine_similarity(curr_embed, all_item_embeds).squeeze().tolist()

                    for idx, sim in enumerate(sims):
                        pid = index_to_item.get(str(idx))
                        if pid and pid not in exclude_list:
                            ncf_similarity_map[pid] = float(sim)
            except Exception as e:
                print(f"[NCF Embedding Sim Error] {e}")

        query = {"is_hidden": {"$ne": True}, "is_deleted": {"$ne": True}}
        if exclude_list:
            query["product_id"] = {"$nin": exclude_list}

        sport_query = dict(query)
        if target_sport:
            sport_query["sport_type"] = target_sport

        candidates = await Product.find(sport_query).to_list()
        if len(candidates) < max(top_k * 2, 16):
            fallback_query = dict(query)
            if target_sport:
                fallback_query["sport_type"] = {"$ne": target_sport}
            more_candidates = await Product.find(fallback_query).sort("-rating", "-reviews_count").limit(16).to_list()
            candidates.extend(more_candidates)

        if not candidates:
            candidates = await Product.find(query).sort("-rating", "-reviews_count").limit(top_k * 3).to_list()

        scored_candidates = []
        for p in candidates:
            score = (p.rating or 4.0) * 0.6 + min(1.0, (p.reviews_count or 0) / 20.0) * 0.8
            if target_sport and p.sport_type == target_sport:
                score += 3.0
            if target_categories and any(c in (p.category or []) for c in target_categories):
                score += 1.2
            elif target_type and p.product_type != target_type:
                score += 0.8
            if p.product_id in ncf_similarity_map:
                score += ncf_similarity_map[p.product_id] * 2.0
            score += random.uniform(-0.25, 0.25)
            scored_candidates.append((score, p))

        scored_candidates.sort(key=lambda x: x[0], reverse=True)
        top_pool = [p for _, p in scored_candidates[:max(top_k * 3, 16)]]

        guaranteed = top_pool[:2]
        variable_pool = top_pool[2:]
        random.shuffle(variable_pool)
        return filter_duplicate_recommendations(guaranteed + variable_pool, top_k)

    async def _get_diverse_trending_recommendations(self, top_k: int, exclude_ids: Optional[List[str]] = None) -> List[Product]:
        """Gợi ý đa dạng và cân bằng giữa các môn thể thao cho Trang chủ"""
        exclude_list = list(exclude_ids or [])
        query = {"is_hidden": {"$ne": True}, "is_deleted": {"$ne": True}}
        if exclude_list:
            query["product_id"] = {"$nin": exclude_list}

        main_sports = ["Đá bóng", "Cầu lông", "Bóng chuyền", "Pickleball", "Chạy bộ", "Dã ngoại", "Đa dụng"]
        collected = []
        for sport in main_sports:
            sq = dict(query)
            sq["sport_type"] = sport
            prods = await Product.find(sq).sort("-rating", "-reviews_count").limit(6).to_list()
            if prods:
                random.shuffle(prods)
                collected.extend(prods[:3])

        if len(collected) < top_k * 2:
            more = await Product.find(query).sort("-rating", "-reviews_count").limit(top_k * 3).to_list()
            for m in more:
                if m.product_id not in [p.product_id for p in collected]:
                    collected.append(m)

        random.shuffle(collected)
        return filter_duplicate_recommendations(collected, top_k)

    # --- Gợi ý bán kèm tại Giỏ hàng (Basket Cross-sell) ---
    async def get_cross_sell_recommendations(self, cart_item_ids: List[str], top_k: int = 3) -> List[Product]:
        """Gợi ý cross-sell dựa trên tích ma trận BLAS với Vector nhúng giỏ hàng"""
        if not self._load_model() or not cart_item_ids:
            return await self._get_fallback_cross_sell(cart_item_ids, top_k)

        try:
            item_to_index = self.mappings["item_to_index"]
            index_to_item = self.mappings["index_to_item"]

            cart_indices = [item_to_index[i_id] for i_id in cart_item_ids if i_id in item_to_index]
            if not cart_indices:
                return await self._get_fallback_cross_sell(cart_item_ids, top_k)

            with torch.no_grad():
                if self.cached_item_embeddings is None:
                    all_embed_mf = self.model.embedding_item_mf.weight.data
                    all_embed_mlp = self.model.embedding_item_mlp.weight.data
                    self.cached_item_embeddings = torch.nn.functional.normalize(
                        torch.cat([all_embed_mf, all_embed_mlp], dim=-1), p=2, dim=1
                    )

                cart_tensor = torch.tensor(cart_indices, dtype=torch.long)
                basket_embed = self.cached_item_embeddings[cart_tensor].mean(dim=0, keepdim=True)
                basket_embed_norm = torch.nn.functional.normalize(basket_embed, p=2, dim=1)

                similarities = torch.mm(basket_embed_norm, self.cached_item_embeddings.t()).squeeze(0)
                similarities[cart_indices] = -1.0 # Loại bỏ các món đã có trong giỏ

                top_indices = torch.topk(similarities, k=min(top_k * 5, len(similarities))).indices.tolist()

            recommended_pids = [index_to_item[str(idx)] for idx in top_indices if str(idx) in index_to_item]
            prods = await Product.find({
                "product_id": {"$in": recommended_pids},
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True}
            }).to_list()

            deduped = filter_duplicate_recommendations(prods, top_k)
            if len(deduped) < top_k:
                needed = top_k - len(deduped)
                fallback = await self._get_fallback_cross_sell(cart_item_ids + [p.product_id for p in deduped], needed)
                deduped.extend(fallback)

            return filter_duplicate_recommendations(deduped, top_k)
        except Exception as e:
            print(f"[NCF Cross-sell Error] {e}")
            return await self._get_fallback_cross_sell(cart_item_ids, top_k)

    async def _get_fallback_cross_sell(self, cart_item_ids: List[str], top_k: int) -> List[Product]:
        """Gợi ý bán kèm dự phòng: Phụ kiện thể thao cùng môn"""
        try:
            cart_products = await Product.find({"product_id": {"$in": cart_item_ids}}).to_list()
            cart_sports = list({p.sport_type for p in cart_products if p.sport_type})

            query = {
                "product_id": {"$nin": cart_item_ids},
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True}
            }
            if cart_sports:
                query["sport_type"] = {"$in": cart_sports}
                query["product_type"] = "Phụ kiện"

            accessories = await Product.find(query).sort("-rating").limit(top_k * 5).to_list()
            unique_acc = filter_duplicate_recommendations(accessories, top_k)
            if len(unique_acc) >= top_k:
                return unique_acc[:top_k]

            general_query = {
                "product_id": {"$nin": cart_item_ids + [p.product_id for p in unique_acc]},
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True}
            }
            more_items = await Product.find(general_query).sort("-rating", "-reviews_count").limit(top_k * 5).to_list()
            return filter_duplicate_recommendations(unique_acc + more_items, top_k)
        except Exception as e:
            print(f"[Cross-sell Fallback Error] {e}")
            return []

recommendation_service = RecommendationService()
