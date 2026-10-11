from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ReviewBase(BaseModel):
    product_id: str
    rating: int = Field(..., ge=1, le=5, description="Điểm đánh giá (1-5)")
    comment: Optional[str] = Field(None, description="Nội dung đánh giá")
    size_bought: Optional[str] = Field(None, description="Size đã mua")
    color_bought: Optional[str] = Field(None, description="Màu đã mua")
    images: Optional[List[str]] = Field(default_factory=list, description="Hình ảnh đính kèm của người dùng")

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: str
    user_id: str
    user_name: Optional[str] = None
    avatar_url: Optional[str] = None
    verified_purchase: bool = False
    timestamp: datetime

class FeaturedReviewResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    avatar_url: Optional[str] = None
    product_id: str
    product_name: str
    product_image: Optional[str] = None
    brand: Optional[str] = None
    rating: int
    comment: str
    size_bought: Optional[str] = None
    color_bought: Optional[str] = None
    verified_purchase: bool = True
    timestamp: datetime

