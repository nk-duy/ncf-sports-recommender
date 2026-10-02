from beanie import Document, Indexed
from pydantic import Field
from typing import Optional
from datetime import datetime

class Review(Document):
    user_id: Indexed(str)
    product_id: Indexed(str)
    rating: int = Field(..., ge=1, le=5, description="Điểm đánh giá (1-5)")
    comment: Optional[str] = Field(None, description="Nội dung đánh giá")
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "reviews"
