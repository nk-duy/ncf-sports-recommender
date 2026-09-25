from beanie import Document, Indexed
from pydantic import Field
from typing import Optional
from datetime import datetime

class Interaction(Document):
    user_id: Indexed(str)
    product_id: Indexed(str)
    interaction_type: str = Field(..., description="Loại tương tác (view, click, add_to_cart, purchase)")
    rating: Optional[float] = None # Dành cho trường hợp rating
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "interactions"
