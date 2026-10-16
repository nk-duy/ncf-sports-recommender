import os
import json
import torch
from typing import List, Dict, Any, Optional
from app.ml.ncf_model import NCF
from app.models.product import Product

class RecommendationService:
    def __init__(self):
        self.models_dir = os.path.join(os.path.dirname(__file__), "..", "ml", "saved_models")
        self.model_path = os.path.join(self.models_dir, "ncf_weights.pth")
        self.mappings_path = os.path.join(self.models_dir, "mappings.json")
        
        self.model = None
        self.mappings = None
        
    def _load_model(self, force_reload: bool = False):
        if not os.path.exists(self.model_path) or not os.path.exists(self.mappings_path):
            return False
            
        if self.model is None or self.mappings is None or force_reload:
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
            
        return True

    def get_model_info(self) -> Dict[str, Any]:
        """Lấy thông tin siêu dữ liệu hiện tại của mô hình NCF"""
        has_model = os.path.exists(self.model_path) and os.path.exists(self.mappings_path)
        last_trained = None
        num_users = 0
        num_items = 0
        if has_model:
            mtime = os.path.getmtime(self.model_path)
            from datetime import datetime
            last_trained = datetime.fromtimestamp(mtime).strftime("%d/%m/%Y %H:%M:%S")
            try:
                with open(self.mappings_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    num_users = data.get("num_users", 0)
                    num_items = data.get("num_items", 0)
            except Exception:
                pass
        return {
            "has_model": has_model,
            "last_trained": last_trained,
            "num_users": num_users,
            "num_items": num_items,
            "architecture": "Neural Collaborative Filtering (Embedding 16D + MLP [32, 16, 8])"
        }

    async def train_model(self) -> Dict[str, Any]:
        """Huấn luyện lại mô hình NCF từ toàn bộ tương tác thực tế trong DB"""
        import torch.nn as nn
        import torch.optim as optim
        from torch.utils.data import Dataset, DataLoader
        import pandas as pd
        from app.models.interaction import Interaction

        interactions = await Interaction.find_all().to_list()
        if not interactions:
            return {"status": "error", "message": "Chưa có dữ liệu tương tác người dùng nào để huấn luyện"}

        data = []
        for inter in interactions:
            score = 1.0
            if inter.interaction_type == "view": score = 1.0
            elif inter.interaction_type == "click": score = 2.0
            elif inter.interaction_type == "add_to_cart": score = 3.5
            elif inter.interaction_type == "purchase": score = 5.0

            if inter.rating is not None and inter.rating > 0:
                score = float(inter.rating)

            data.append({
                "user_id": inter.user_id,
                "product_id": inter.product_id,
                "score": score / 5.0
            })

        df = pd.DataFrame(data)
        df = df.groupby(['user_id', 'product_id']).score.mean().reset_index()

        unique_users = df['user_id'].unique()
        unique_items = df['product_id'].unique()

        user_to_index = {u: i for i, u in enumerate(unique_users)}
        item_to_index = {item: i for i, item in enumerate(unique_items)}

        num_users = len(unique_users)
        num_items = len(unique_items)

        df['user_index'] = df['user_id'].map(user_to_index)
        df['item_index'] = df['product_id'].map(item_to_index)

        class FastInteractionDataset(Dataset):
            def __init__(self, u_idx, i_idx, lbls):
                self.u = torch.tensor(u_idx, dtype=torch.long)
                self.i = torch.tensor(i_idx, dtype=torch.long)
                self.l = torch.tensor(lbls, dtype=torch.float32)
            def __len__(self): return len(self.u)
            def __getitem__(self, idx): return self.u[idx], self.i[idx], self.l[idx]

        dataset = FastInteractionDataset(df['user_index'].values, df['item_index'].values, df['score'].values)
        dataloader = DataLoader(dataset, batch_size=64, shuffle=True)

        new_model = NCF(num_users=num_users, num_items=num_items, embedding_dim=16, hidden_layers=[32, 16, 8])
        criterion = nn.BCELoss()
        optimizer = optim.Adam(new_model.parameters(), lr=0.001)

        epochs = 10
        final_loss = 0.0
        new_model.train()
        for epoch in range(epochs):
            total_loss = 0.0
            for batch_users, batch_items, batch_labels in dataloader:
                optimizer.zero_grad()
                preds = new_model(batch_users, batch_items)
                loss = criterion(preds, batch_labels)
                loss.backward()
                optimizer.step()
                total_loss += loss.item()
            final_loss = total_loss / max(1, len(dataloader))

        # Lưu weights & mappings
        os.makedirs(self.models_dir, exist_ok=True)
        torch.save(new_model.state_dict(), self.model_path)

        mappings = {
            "user_to_index": user_to_index,
            "item_to_index": item_to_index,
            "index_to_user": {i: u for u, i in user_to_index.items()},
            "index_to_item": {i: item for item, i in item_to_index.items()},
            "num_users": num_users,
            "num_items": num_items
        }

        with open(self.mappings_path, "w", encoding="utf-8") as f:
            json.dump(mappings, f, ensure_ascii=False)

        # Nạp lại model nóng vào RAM ngay lập tức
        self._load_model(force_reload=True)

        from datetime import datetime
        return {
            "status": "success",
            "message": "Huấn luyện mô hình NCF thành công!",
            "epochs": epochs,
            "loss": round(final_loss, 4),
            "num_users": num_users,
            "num_items": num_items,
            "interactions_count": len(df),
            "last_trained": datetime.now().strftime("%d/%m/%Y %H:%M:%S")
        }

    async def get_recommendations_for_user(self, user_id: str, top_k: int = 5) -> List[Product]:
        """
        Hybrid Recommendation Pipeline:
        1. Nếu user_id tồn tại và đã có trong NCF mapping -> Dự đoán bằng Neural Collaborative Filtering
        2. Nếu user mới (Cold-start) nhưng có lịch sử tương tác hoặc profile sở thích (interested_sports) -> Content-based / Preference recommendation
        3. Fallback tổng thể -> Top trending & best-seller có rating cao nhất
        """
        model_loaded = self._load_model()
        
        # 1. NCF Collaborative Filtering nếu user đã có trong embedding weights
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
                    predictions = self.model(u_tensor, i_tensor)
                    
                top_indices = torch.topk(predictions, k=min(top_k * 2, len(all_item_indices))).indices.tolist()
                recommended_product_ids = [index_to_item[str(all_item_indices[idx])] for idx in top_indices]
                
                recommended_products = []
                for p_id in recommended_product_ids:
                    product = await Product.find_one({"product_id": p_id, "is_hidden": {"$ne": True}, "is_deleted": {"$ne": True}})
                    if product:
                        recommended_products.append(product)
                        if len(recommended_products) >= top_k:
                            break
                            
                if len(recommended_products) >= top_k:
                    return recommended_products[:top_k]
            except Exception as e:
                print(f"[NCF] Error predicting for user {user_id}: {e}")

        # 2. Cold-Start Level 1: Dựa trên Profile người dùng (interested_sports) & Lịch sử tương tác gần nhất
        hybrid_recs = await self._get_cold_start_preference_recommendations(user_id, top_k)
        if len(hybrid_recs) >= top_k:
            return hybrid_recs[:top_k]

        # 3. Cold-Start Level 2: Bù thêm các sản phẩm Best-Seller / Rating cao nhất
        needed = top_k - len(hybrid_recs)
        existing_ids = [p.product_id for p in hybrid_recs]
        fallback_items = await self._get_fallback_recommendations(needed, exclude_ids=existing_ids)
        hybrid_recs.extend(fallback_items)
        return hybrid_recs[:top_k]

    async def _get_cold_start_preference_recommendations(self, user_id: str, top_k: int) -> List[Product]:
        """Gợi ý thông minh cho khách hàng mới dựa trên môn thể thao quan tâm hoặc sản phẩm vừa tương tác"""
        from app.models.user import User
        from app.models.interaction import Interaction
        
        target_sports = []
        exclude_ids = []

        # 2.1 Kiểm tra profile người dùng
        if user_id:
            try:
                from beanie import PydanticObjectId
                user = await User.get(PydanticObjectId(user_id)) if PydanticObjectId.is_valid(user_id) else await User.find_one(User.username == user_id)
                if user and user.interested_sports:
                    target_sports.extend(user.interested_sports)
            except Exception:
                pass

        # 2.2 Kiểm tra các tương tác gần nhất của user (Click, View, Add to cart)
        if user_id:
            try:
                recent_interactions = await Interaction.find(Interaction.user_id == user_id).sort("-timestamp").limit(5).to_list()
                interacted_ids = [i.product_id for i in recent_interactions]
                exclude_ids.extend(interacted_ids)
                
                if interacted_ids:
                    interacted_prods = await Product.find({"product_id": {"$in": interacted_ids}}).to_list()
                    for p in interacted_prods:
                        if p.sport_type and p.sport_type not in target_sports:
                            target_sports.append(p.sport_type)
            except Exception:
                pass

        # 2.3 Query sản phẩm theo môn thể thao quan tâm
        if target_sports:
            query = {
                "sport_type": {"$in": target_sports},
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True}
            }
            if exclude_ids:
                query["product_id"] = {"$nin": exclude_ids}

            recs = await Product.find(query).sort("-rating", "-reviews_count").limit(top_k).to_list()
            return recs

        return []

    async def _get_fallback_recommendations(self, top_k: int, exclude_ids: Optional[List[str]] = None) -> List[Product]:
        """Gợi ý Fallback toàn diện: Lấy các sản phẩm có đánh giá cao nhất và bán chạy nhất"""
        try:
            query = {
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True}
            }
            if exclude_ids:
                query["product_id"] = {"$nin": exclude_ids}

            # Ưu tiên sản phẩm rating >= 4.5 và nhiều review
            products = await Product.find(query).sort("-rating", "-reviews_count", "-sold").limit(top_k).to_list()
            if not products:
                products = await Product.find({
                    "is_hidden": {"$ne": True},
                    "is_deleted": {"$ne": True}
                }).limit(top_k).to_list()
            return products
        except Exception as e:
            print(f"[Recommendation] Fallback error: {e}")
            return []

    async def get_cross_sell_recommendations(self, cart_item_ids: List[str], top_k: int = 3) -> List[Product]:
        """
        Gợi ý cross-sell (bán chéo kèm giỏ hàng):
        1. Sử dụng kết hợp GMF + MLP Item Embeddings từ mô hình NCF
        2. Dựa trên độ tương đồng Cosine giữa vector giỏ hàng và toàn bộ sản phẩm
        3. Fallback sang phụ kiện thể thao cùng môn nếu thiếu
        """
        if not self._load_model() or not cart_item_ids:
            return await self._get_fallback_cross_sell(cart_item_ids, top_k)
            
        try:
            item_to_index = self.mappings["item_to_index"]
            index_to_item = self.mappings["index_to_item"]
            
            cart_indices = [item_to_index[i_id] for i_id in cart_item_ids if i_id in item_to_index]
            if not cart_indices:
                return await self._get_fallback_cross_sell(cart_item_ids, top_k)
                
            with torch.no_grad():
                # Trích xuất trọng số embedding của cả GMF và MLP
                all_embed_mf = self.model.embedding_item_mf.weight   # [num_items, 16]
                all_embed_mlp = self.model.embedding_item_mlp.weight # [num_items, 16]
                all_item_embeds = torch.cat([all_embed_mf, all_embed_mlp], dim=-1) # [num_items, 32]
                
                cart_tensor = torch.tensor(cart_indices, dtype=torch.long)
                cart_embeds = all_item_embeds[cart_tensor]
                
                # Vector đại diện giỏ hàng (mean embedding)
                basket_embed = cart_embeds.mean(dim=0, keepdim=True)
                
                from torch.nn.functional import cosine_similarity
                similarities = cosine_similarity(basket_embed, all_item_embeds)
                
                # Không gợi ý lại các món đã có trong giỏ hàng
                similarities[cart_indices] = -1.0
                
                top_indices = torch.topk(similarities, k=min(top_k * 3, len(similarities))).indices.tolist()
                
            recommended_product_ids = [index_to_item[str(idx)] for idx in top_indices]
            
            recommended_products = []
            for p_id in recommended_product_ids:
                product = await Product.find_one({
                    "product_id": p_id,
                    "is_hidden": {"$ne": True},
                    "is_deleted": {"$ne": True}
                })
                if product:
                    recommended_products.append(product)
                    if len(recommended_products) >= top_k:
                        break
                    
            if len(recommended_products) < top_k:
                needed = top_k - len(recommended_products)
                already_ids = cart_item_ids + [p.product_id for p in recommended_products]
                fallback = await self._get_fallback_cross_sell(already_ids, needed)
                recommended_products.extend(fallback)
                
            return recommended_products[:top_k]
        except Exception as e:
            print(f"[NCF Cross-sell] Error: {e}")
            return await self._get_fallback_cross_sell(cart_item_ids, top_k)

    async def _get_fallback_cross_sell(self, cart_item_ids: List[str], top_k: int) -> List[Product]:
        """Gợi ý bán kèm thông minh: Phụ kiện thể thao (tất, túi, bình nước) cùng môn của các món trong giỏ"""
        try:
            cart_products = await Product.find({"product_id": {"$in": cart_item_ids}}).to_list()
            cart_sports = list({p.sport_type for p in cart_products if p.sport_type})
            
            # Ưu tiên gợi ý Phụ kiện cùng môn thể thao trong giỏ
            query = {
                "product_id": {"$nin": cart_item_ids},
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True}
            }
            if cart_sports:
                query["sport_type"] = {"$in": cart_sports}
                query["product_type"] = "Phụ kiện"

            accessories = await Product.find(query).sort("-rating").limit(top_k).to_list()
            if len(accessories) >= top_k:
                return accessories[:top_k]
                
            # Nếu không đủ phụ kiện cùng môn, lấy phụ kiện bán chạy chung
            general_query = {
                "product_id": {"$nin": cart_item_ids + [p.product_id for p in accessories]},
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True}
            }
            more_items = await Product.find(general_query).sort("-rating", "-reviews_count").limit(top_k - len(accessories)).to_list()
            accessories.extend(more_items)
            return accessories[:top_k]
        except Exception as e:
            print(f"[Cross-sell Fallback] Error: {e}")
            return []

recommendation_service = RecommendationService()
