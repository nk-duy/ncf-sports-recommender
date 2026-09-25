import asyncio
import os
import sys
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import pandas as pd
from collections import defaultdict

# Thêm đường dẫn backend vào sys.path để có thể import từ app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import init_db
from app.models.interaction import Interaction
from app.ml.ncf_model import NCF

class InteractionDataset(Dataset):
    def __init__(self, user_indices, item_indices, labels):
        self.user_indices = torch.tensor(user_indices, dtype=torch.long)
        self.item_indices = torch.tensor(item_indices, dtype=torch.long)
        self.labels = torch.tensor(labels, dtype=torch.float32)
        
    def __len__(self):
        return len(self.user_indices)
        
    def __getitem__(self, idx):
        return self.user_indices[idx], self.item_indices[idx], self.labels[idx]

async def extract_data():
    print("Khởi tạo kết nối DB...")
    await init_db()
    
    print("Lấy dữ liệu Interactions...")
    interactions = await Interaction.find_all().to_list()
    
    if not interactions:
        print("Không có dữ liệu tương tác nào trong DB.")
        return None
    
    data = []
    for inter in interactions:
        # Chuyển đổi tương tác thành điểm số giả lập
        # view: 1, click: 2, add_to_cart: 3, purchase: 4
        score = 0
        if inter.interaction_type == "view": score = 1
        elif inter.interaction_type == "click": score = 2
        elif inter.interaction_type == "add_to_cart": score = 3
        elif inter.interaction_type == "purchase": score = 4
        
        # Nếu có rating, lấy rating làm chuẩn
        if inter.rating is not None:
            score = inter.rating
            
        # Chuẩn hóa về [0, 1] cho Sigmoid output của model
        normalized_score = score / 5.0
        
        data.append({
            "user_id": inter.user_id,
            "product_id": inter.product_id,
            "score": normalized_score
        })
        
    df = pd.DataFrame(data)
    
    # Xử lý các tương tác trùng lặp bằng cách lấy score trung bình
    df = df.groupby(['user_id', 'product_id']).score.mean().reset_index()
    return df

async def train():
    df = await extract_data()
    if df is None or len(df) == 0:
        return
        
    print(f"Tổng số tương tác (sau khi gộp): {len(df)}")
    
    # Tạo mappings: ID thực -> index từ 0 -> N
    unique_users = df['user_id'].unique()
    unique_items = df['product_id'].unique()
    
    user_to_index = {u: i for i, u in enumerate(unique_users)}
    item_to_index = {item: i for i, item in enumerate(unique_items)}
    
    num_users = len(unique_users)
    num_items = len(unique_items)
    print(f"Số lượng users: {num_users}, Số lượng items: {num_items}")
    
    df['user_index'] = df['user_id'].map(user_to_index)
    df['item_index'] = df['product_id'].map(item_to_index)
    
    # Tạo Dataset và DataLoader
    dataset = InteractionDataset(
        df['user_index'].values,
        df['item_index'].values,
        df['score'].values
    )
    dataloader = DataLoader(dataset, batch_size=64, shuffle=True)
    
    # Khởi tạo mô hình
    model = NCF(num_users=num_users, num_items=num_items, embedding_dim=16, hidden_layers=[32, 16, 8])
    criterion = nn.BCELoss() # Binary Cross Entropy Loss do có Sigmoid
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    epochs = 10
    print("Bắt đầu huấn luyện...")
    for epoch in range(epochs):
        total_loss = 0
        model.train()
        for batch_users, batch_items, batch_labels in dataloader:
            optimizer.zero_grad()
            predictions = model(batch_users, batch_items)
            loss = criterion(predictions, batch_labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
            
        print(f"Epoch {epoch+1}/{epochs} | Loss: {total_loss/len(dataloader):.4f}")
        
    print("Huấn luyện xong! Đang lưu mô hình...")
    
    # Lưu Model & Mappings
    models_dir = os.path.join(os.path.dirname(__file__), "..", "app", "ml", "saved_models")
    os.makedirs(models_dir, exist_ok=True)
    
    torch.save(model.state_dict(), os.path.join(models_dir, "ncf_weights.pth"))
    
    mappings = {
        "user_to_index": user_to_index,
        "item_to_index": item_to_index,
        "index_to_user": {i: u for u, i in user_to_index.items()},
        "index_to_item": {i: item for item, i in item_to_index.items()},
        "num_users": num_users,
        "num_items": num_items
    }
    
    with open(os.path.join(models_dir, "mappings.json"), "w") as f:
        json.dump(mappings, f)
        
    print(f"Mô hình và Mappings đã được lưu tại: {models_dir}")

if __name__ == "__main__":
    asyncio.run(train())
