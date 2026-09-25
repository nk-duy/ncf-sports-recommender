import torch
import torch.nn as nn

class NCF(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=32, hidden_layers=[64, 32, 16, 8]):
        super(NCF, self).__init__()
        
        # Embedding cho phần GMF (Generalized Matrix Factorization)
        self.embedding_user_mf = nn.Embedding(num_embeddings=num_users, embedding_dim=embedding_dim)
        self.embedding_item_mf = nn.Embedding(num_embeddings=num_items, embedding_dim=embedding_dim)
        
        # Embedding cho phần MLP (Multi-Layer Perceptron)
        self.embedding_user_mlp = nn.Embedding(num_embeddings=num_users, embedding_dim=embedding_dim)
        self.embedding_item_mlp = nn.Embedding(num_embeddings=num_items, embedding_dim=embedding_dim)
        
        # Khởi tạo các lớp MLP
        mlp_modules = []
        input_size = embedding_dim * 2
        for layer_size in hidden_layers:
            mlp_modules.append(nn.Linear(input_size, layer_size))
            mlp_modules.append(nn.ReLU())
            input_size = layer_size
            
        self.mlp_layers = nn.Sequential(*mlp_modules)
        
        # Lớp dự đoán cuối cùng (Predict Layer)
        # Kết hợp GMF (kích thước embedding_dim) và MLP (kích thước hidden_layers[-1])
        predict_size = embedding_dim + hidden_layers[-1]
        self.predict_layer = nn.Linear(predict_size, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, user_indices, item_indices):
        # --- GMF ---
        user_embedding_mf = self.embedding_user_mf(user_indices)
        item_embedding_mf = self.embedding_item_mf(item_indices)
        mf_vector = torch.mul(user_embedding_mf, item_embedding_mf)
        
        # --- MLP ---
        user_embedding_mlp = self.embedding_user_mlp(user_indices)
        item_embedding_mlp = self.embedding_item_mlp(item_indices)
        mlp_vector = torch.cat([user_embedding_mlp, item_embedding_mlp], dim=-1)
        mlp_vector = self.mlp_layers(mlp_vector)
        
        # --- Nối (Concatenate) & Dự đoán ---
        predict_vector = torch.cat([mf_vector, mlp_vector], dim=-1)
        prediction = self.predict_layer(predict_vector)
        
        return self.sigmoid(prediction).squeeze()
