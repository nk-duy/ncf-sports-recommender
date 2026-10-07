from datetime import datetime
from typing import Optional
from pydantic import Field
from beanie import Document

class Banner(Document):
    title: str
    image_url: str
    link: Optional[str] = None
    position: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "banners"
