from fastapi import APIRouter, Depends, Query
from typing import List
from app.models.user import User
from app.schemas.product import ProductResponse
from app.api.deps import get_current_user
from app.services.recommendation_service import recommendation_service

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_recommendations(
    top_k: int = Query(5, ge=1, le=20, description="Số lượng gợi ý"),
    current_user: User = Depends(get_current_user)
):
    """Lấy danh sách sản phẩm gợi ý cá nhân hóa dựa trên NCF Model"""
    products = await recommendation_service.get_recommendations_for_user(str(current_user.id), top_k)
    return products
