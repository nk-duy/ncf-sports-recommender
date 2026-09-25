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
        
    def _load_model(self):
        if not os.path.exists(self.model_path) or not os.path.exists(self.mappings_path):
            return False
            
        if self.model is None or self.mappings is None:
            with open(self.mappings_path, "r") as f:
                self.mappings = json.load(f)
                
            self.model = NCF(
                num_users=self.mappings["num_users"], 
                num_items=self.mappings["num_items"], 
                embedding_dim=16, 
                hidden_layers=[32, 16, 8]
            )
            self.model.load_state_dict(torch.load(self.model_path))
            self.model.eval()
            
        return True

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
            product = await Product.find_one(Product.product_id == p_id)
            if product:
                recommended_products.append(product)
                
        return recommended_products

    async def _get_fallback_recommendations(self, top_k: int) -> List[Product]:
        # Logic dự phòng (fallback) nếu không có model hoặc cold start
        products = await Product.find({"rating": {"$gte": 4.0}}).limit(top_k * 2).to_list()
        import random
        if products:
            random.shuffle(products)
        return products[:top_k]

recommendation_service = RecommendationService()
