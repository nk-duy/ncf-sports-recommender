from beanie import Document, Indexed
from pydantic import Field
from typing import Optional, List
from datetime import datetime

class Review(Document):
    user_id: Indexed(str)
    product_id: Indexed(str)
    rating: int = Field(..., ge=1, le=5, description="Điểm đánh giá (1-5)")
    comment: Optional[str] = Field(None, description="Nội dung đánh giá")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    # Optional detailed fields
    user_name: Optional[str] = Field(None, description="Tên người dùng (cache)")
    avatar_url: Optional[str] = Field(None, description="Ảnh đại diện người dùng (cache)")
    size_bought: Optional[str] = Field(None, description="Size đã mua")
    color_bought: Optional[str] = Field(None, description="Màu đã mua")
    verified_purchase: bool = Field(False, description="Đã xác thực mua hàng")
    images: List[str] = Field(default_factory=list, description="Hình ảnh đính kèm của người dùng")

    class Settings:
        name = "reviews"
