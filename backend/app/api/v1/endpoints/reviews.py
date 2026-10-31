from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from app.schemas.review import ReviewCreate, ReviewResponse, FeaturedReviewResponse, AdminReviewListResponse
from app.services.review_service import review_service
from app.api.deps import get_current_user, get_current_admin_user
from app.models.user import User

router = APIRouter()

class VisibilityUpdateRequest(BaseModel):
    is_hidden: Optional[bool] = None

@router.post("/", response_model=ReviewResponse)
async def create_review(
    review_in: ReviewCreate,
    current_user: User = Depends(get_current_user)
):
    """Tạo đánh giá mới cho sản phẩm"""
    review = await review_service.create_review(review_in, current_user)
    
    return ReviewResponse(
        id=str(review.id),
        user_id=review.user_id,
        user_name=review.user_name,
        avatar_url=review.avatar_url,
        product_id=review.product_id,
        rating=review.rating,
        comment=review.comment,
        size_bought=review.size_bought,
        color_bought=review.color_bought,
        verified_purchase=review.verified_purchase,
        is_hidden=getattr(review, 'is_hidden', False),
        images=review.images,
        timestamp=review.timestamp
    )

@router.get("/featured", response_model=List[FeaturedReviewResponse])
async def get_featured_reviews(limit: int = 8):
    """Lấy danh sách đánh giá tiêu biểu có chọn lọc cho trang chủ"""
    featured = await review_service.get_featured_reviews(limit=limit)
    return [FeaturedReviewResponse(**item) for item in featured]

@router.get("/product/{product_id}", response_model=List[ReviewResponse])
async def get_product_reviews(product_id: str):
    """Lấy danh sách đánh giá của một sản phẩm"""
    reviews = await review_service.get_reviews_by_product(product_id)
    return [
        ReviewResponse(
            id=str(r.id),
            user_id=r.user_id,
            user_name=r.user_name,
            avatar_url=r.avatar_url,
            product_id=r.product_id,
            rating=r.rating,
            comment=r.comment,
            size_bought=r.size_bought,
            color_bought=r.color_bought,
            verified_purchase=r.verified_purchase,
            is_hidden=getattr(r, 'is_hidden', False),
            images=r.images,
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
            user_name=r.user_name,
            avatar_url=r.avatar_url,
            product_id=r.product_id,
            rating=r.rating,
            comment=r.comment,
            size_bought=r.size_bought,
            color_bought=r.color_bought,
            verified_purchase=r.verified_purchase,
            is_hidden=getattr(r, 'is_hidden', False),
            images=r.images,
            timestamp=r.timestamp
        )
        for r in reviews
    ]

# ====================================================================
# ADMIN ENDPOINTS: Quản trị đánh giá & Phê duyệt vi phạm
# ====================================================================

@router.get("/admin", response_model=AdminReviewListResponse)
async def get_admin_reviews(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    rating: Optional[int] = Query(None, ge=1, le=5, description="Lọc theo số sao"),
    search: Optional[str] = Query(None, description="Tìm theo nội dung, tên khách, mã SP"),
    is_hidden: Optional[bool] = Query(None, description="Lọc theo trạng thái ẩn/hiện"),
    current_admin: User = Depends(get_current_admin_user)
):
    """Lấy danh sách đánh giá có phân trang, lọc sao & từ khóa (Dành cho Quản trị viên)"""
    return await review_service.get_admin_reviews(
        skip=skip,
        limit=limit,
        rating=rating,
        search=search,
        is_hidden=is_hidden
    )

@router.patch("/admin/{review_id}/visibility")
async def toggle_review_visibility(
    review_id: str,
    body: Optional[VisibilityUpdateRequest] = None,
    current_admin: User = Depends(get_current_admin_user)
):
    """Bật/tắt trạng thái ẩn đánh giá vi phạm (Dành cho Quản trị viên)"""
    new_hidden = body.is_hidden if body else None
    updated = await review_service.toggle_review_visibility(review_id, is_hidden=new_hidden)
    if not updated:
        raise HTTPException(status_code=404, detail="Không tìm thấy đánh giá")
    return {
        "status": "success",
        "review_id": str(updated.id),
        "is_hidden": getattr(updated, 'is_hidden', False),
        "message": "Đã ẩn đánh giá khỏi giao diện người dùng" if getattr(updated, 'is_hidden', False) else "Đã khôi phục hiển thị đánh giá"
    }

@router.delete("/admin/{review_id}")
async def delete_admin_review(
    review_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Xóa vĩnh viễn đánh giá vi phạm và tính lại rating SP (Dành cho Quản trị viên)"""
    success = await review_service.delete_review(review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy đánh giá")
    return {"status": "success", "message": "Đã xóa vĩnh viễn đánh giá và cập nhật lại điểm sản phẩm"}
