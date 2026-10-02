from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewBase(BaseModel):
    product_id: str
    rating: int = Field(..., ge=1, le=5, description="Điểm đánh giá (1-5)")
    comment: Optional[str] = Field(None, description="Nội dung đánh giá")

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: str
    user_id: str
    timestamp: datetime
