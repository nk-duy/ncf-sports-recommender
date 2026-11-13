import torch
import torch.nn as nn

class NCF(nn.Module):
    """
    Kiến trúc Neural Collaborative Filtering (NeuMF - He et al., 2017):
    - Nhánh GMF: User Embedding (16D) ⊙ Item Embedding (16D) -> Vector tuyến tính 16D.
    - Nhánh MLP: [User Embedding (16D) || Item Embedding (16D)] (32D) -> MLP [32, 16, 8] (ReLU) -> Vector phi tuyến 8D.
    - Tầng NeuMF: [GMF (16D) || MLP (8D)] (24D) -> Linear(24, 1) -> Sigmoid -> Xác suất tương tác ŷ_ui ∈ [0, 1].
    - Vector nhúng sản phẩm kết hợp (phục vụ Cosine Similarity & Cross-sell): 16D (GMF) + 16D (MLP) = 32D.
    """
    def __init__(self, num_users: int, num_items: int, embedding_dim: int = 16, hidden_layers: list = None):
        super(NCF, self).__init__()
        if hidden_layers is None:
            hidden_layers = [32, 16, 8]
        
        self.num_users = int(num_users)
        self.num_items = int(num_items)
        self.embedding_dim = int(embedding_dim)
        self.hidden_layers = list(hidden_layers)
        
        self.embedding_user_mf = nn.Embedding(num_embeddings=self.num_users, embedding_dim=self.embedding_dim)
        self.embedding_item_mf = nn.Embedding(num_embeddings=self.num_items, embedding_dim=self.embedding_dim)
        
        self.embedding_user_mlp = nn.Embedding(num_embeddings=self.num_users, embedding_dim=self.embedding_dim)
        self.embedding_item_mlp = nn.Embedding(num_embeddings=self.num_items, embedding_dim=self.embedding_dim)
        
        mlp_modules = []
        input_size = self.embedding_dim * 2
        for layer_size in self.hidden_layers:
            mlp_modules.append(nn.Linear(input_size, layer_size))
            mlp_modules.append(nn.ReLU())
            input_size = layer_size
            
        self.mlp_layers = nn.Sequential(*mlp_modules)

        predict_size = self.embedding_dim + self.hidden_layers[-1]
        self.predict_layer = nn.Linear(predict_size, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, user_indices, item_indices):
        user_embedding_mf = self.embedding_user_mf(user_indices)
        item_embedding_mf = self.embedding_item_mf(item_indices)
        mf_vector = torch.mul(user_embedding_mf, item_embedding_mf)
        
        user_embedding_mlp = self.embedding_user_mlp(user_indices)
        item_embedding_mlp = self.embedding_item_mlp(item_indices)
        mlp_vector = torch.cat([user_embedding_mlp, item_embedding_mlp], dim=-1)
        mlp_vector = self.mlp_layers(mlp_vector)
        
        predict_vector = torch.cat([mf_vector, mlp_vector], dim=-1)
        prediction = self.predict_layer(predict_vector)
        
        return self.sigmoid(prediction).squeeze()

    def get_combined_item_embeddings(self) -> torch.Tensor:
        """Trích xuất ma trận Vector nhúng sản phẩm 32D (16D GMF + 16D MLP) đã chuẩn hóa L2"""
        with torch.no_grad():
            raw_embeds = torch.cat(
                [self.embedding_item_mf.weight.data, self.embedding_item_mlp.weight.data],
                dim=-1
            )
            return torch.nn.functional.normalize(raw_embeds + 1e-8, p=2, dim=1)


