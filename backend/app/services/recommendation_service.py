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
        if not self._load_model():
            # Fallback nếu model chưa train: trả về featured products
            return await self._get_fallback_recommendations(top_k)
            
        user_to_index = self.mappings["user_to_index"]
        item_to_index = self.mappings["item_to_index"]
        index_to_item = self.mappings["index_to_item"]
        
        if user_id not in user_to_index:
            # User mới (Cold start), trả về fallback
            return await self._get_fallback_recommendations(top_k)
            
        u_idx = user_to_index[user_id]
        
        # Dự đoán cho tất cả các items
        all_item_indices = list(item_to_index.values())
        u_tensor = torch.tensor([u_idx] * len(all_item_indices), dtype=torch.long)
        i_tensor = torch.tensor(all_item_indices, dtype=torch.long)
        
        with torch.no_grad():
            predictions = self.model(u_tensor, i_tensor)
            
        # Lấy top_k items có prediction score cao nhất
        top_indices = torch.topk(predictions, k=min(top_k, len(all_item_indices))).indices.tolist()
        
        recommended_product_ids = [index_to_item[str(all_item_indices[idx])] for idx in top_indices]
        
        # Query DB lấy product models
        recommended_products = []
        for p_id in recommended_product_ids:
            product = await Product.find_one({"product_id": p_id, "is_hidden": {"$ne": True}, "is_deleted": {"$ne": True}})
            if product:
                recommended_products.append(product)
                
        # Nếu model trả về thiếu do các sản phẩm bị ẩn hoặc xoá, bù thêm bằng fallback
        if len(recommended_products) < top_k:
            needed = top_k - len(recommended_products)
            existing_ids = [p.product_id for p in recommended_products]
            fallback_items = await Product.find({
                "product_id": {"$nin": existing_ids},
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True},
                "rating": {"$gte": 4.0}
            }).limit(needed).to_list()
            recommended_products.extend(fallback_items)
                
        return recommended_products[:top_k]

    async def _get_fallback_recommendations(self, top_k: int) -> List[Product]:
        try:
            products = await Product.find({
                "rating": {"$gte": 4.0},
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True}
            }).limit(top_k).to_list()
            if not products:
                products = await Product.find({
                    "is_hidden": {"$ne": True},
                    "is_deleted": {"$ne": True}
                }).limit(top_k).to_list()
            return products
        except Exception as e:
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail=str(e))

    async def get_cross_sell_recommendations(self, cart_item_ids: List[str], top_k: int = 3) -> List[Product]:
        """Gợi ý cross-sell dựa trên độ tương đồng Cosine của Item Embeddings trong NCF"""
        if not self._load_model() or not cart_item_ids:
            return await self._get_fallback_cross_sell(cart_item_ids, top_k)
            
        item_to_index = self.mappings["item_to_index"]
        index_to_item = self.mappings["index_to_item"]
        
        cart_indices = [item_to_index[i_id] for i_id in cart_item_ids if i_id in item_to_index]
        if not cart_indices:
            return await self._get_fallback_cross_sell(cart_item_ids, top_k)
            
        with torch.no_grad():
            all_item_embeds = self.model.item_embedding.weight
            cart_tensor = torch.tensor(cart_indices, dtype=torch.long)
            cart_embeds = self.model.item_embedding(cart_tensor)
            
            # Đại diện giỏ hàng là trung bình các embeddings của các sản phẩm bên trong
            basket_embed = cart_embeds.mean(dim=0, keepdim=True)
            
            from torch.nn.functional import cosine_similarity
            similarities = cosine_similarity(basket_embed, all_item_embeds)
            
            # Loại trừ các sản phẩm đã có trong giỏ hàng
            similarities[cart_indices] = -1.0
            
            top_indices = torch.topk(similarities, k=top_k * 2).indices.tolist()
            
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
                
        # Nếu model gợi ý không đủ số lượng do database thiếu data, fallback
        if len(recommended_products) < top_k:
            fallback = await self._get_fallback_cross_sell(cart_item_ids + [p.product_id for p in recommended_products], top_k - len(recommended_products))
            recommended_products.extend(fallback)
            
        return recommended_products[:top_k]

    async def _get_fallback_cross_sell(self, cart_item_ids: List[str], top_k: int) -> List[Product]:
        try:
            # Fallback đơn giản lấy phụ kiện hoặc rating cao
            products = await Product.find({
                "product_id": {"$nin": cart_item_ids},
                "is_hidden": {"$ne": True},
                "is_deleted": {"$ne": True}
            }).limit(top_k).to_list()
            return products
        except:
            return []

recommendation_service = RecommendationService()
