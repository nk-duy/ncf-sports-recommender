from fastapi import APIRouter, Depends, Query, Body
from typing import List, Optional
from app.models.user import User
from app.schemas.product import ProductResponse
from app.api.deps import get_current_user_optional
from app.services.recommendation_service import recommendation_service
from app.services.product_service import ProductService

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_recommendations(
    top_k: int = Query(5, ge=1, le=20, description="Số lượng gợi ý"),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Lấy danh sách sản phẩm gợi ý cá nhân hóa dựa trên NCF Model"""
    user_id_str = str(current_user.id) if current_user else ""
    products = await recommendation_service.get_recommendations_for_user(user_id_str, top_k)
    for p in products:
        ProductService._enforce_discount(p)
    return products

@router.post("/cross-sell", response_model=List[ProductResponse])
async def get_cross_sell(
    cart_item_ids: List[str] = Body(..., description="Danh sách ID sản phẩm trong giỏ hàng"),
    top_k: int = Query(3, ge=1, le=10)
):
    """Lấy danh sách gợi ý bán chéo dựa trên giỏ hàng hiện tại (Sử dụng Item Embeddings)"""
    products = await recommendation_service.get_cross_sell_recommendations(cart_item_ids, top_k)
    for p in products:
        ProductService._enforce_discount(p)
    return products
