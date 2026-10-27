import uuid
from typing import List, Optional
from datetime import datetime
from beanie import Document, Indexed
from pydantic import Field

class RecommendationImpression(Document):
    impression_id: Indexed(str, unique=True) = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    source: str = "homepage"  # "homepage", "cart_cross_sell", "product_detail", "dedicated_page"
    recommended_product_ids: List[str] = Field(default_factory=list)
    clicked_product_ids: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "recommendation_impressions"
