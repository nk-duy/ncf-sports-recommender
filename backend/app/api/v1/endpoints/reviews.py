from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.review import ReviewCreate, ReviewResponse
from app.services.review_service import review_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=ReviewResponse)
async def create_review(
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user)
):
    """Tạo đánh giá mới cho sản phẩm"""
    review = await review_service.create_review(review_in, current_user)
    
    # Optional: Update product rating logic could go here or in a background task
    
    return ReviewResponse(
        id=str(review.id),
        user_id=review.user_id,
        product_id=review.product_id,
        rating=review.rating,
        comment=review.comment,
        timestamp=review.timestamp
    )

@router.get("/product/{product_id}", response_model=List[ReviewResponse])
async def get_product_reviews(product_id: str):
    """Lấy danh sách đánh giá của một sản phẩm"""
    reviews = await review_service.get_reviews_by_product(product_id)
    return [
        ReviewResponse(
            id=str(r.id),
            user_id=r.user_id,
            product_id=r.product_id,
            rating=r.rating,
            comment=r.comment,
            timestamp=r.timestamp
        )
        for r in reviews
    ]

@router.get("/me", response_model=List[ReviewResponse])
async def get_my_reviews(current_user: User = Depends(get_current_user)):
    """Lấy danh sách đánh giá của user hiện tại"""
    reviews = await review_service.get_user_reviews(current_user)
    return [
        ReviewResponse(
            id=str(r.id),
            user_id=r.user_id,
            product_id=r.product_id,
            rating=r.rating,
            comment=r.comment,
            timestamp=r.timestamp
        )
        for r in reviews
    ]
