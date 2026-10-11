from typing import Optional
from beanie import Document
from pydantic import Field, ConfigDict
from datetime import datetime, timezone

class Store(Document):
    name: str
    address: str
    city: str  # 'hanoi', 'hcm', 'danang'
    phone: str
    hours: str
    is_active: bool = True
    google_maps_url: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "KADY Cầu Giấy",
                "address": "123 Đường Cầu Giấy, Q. Cầu Giấy, Hà Nội",
                "city": "hanoi",
                "phone": "024 3888 9999",
                "hours": "08:00 - 22:00",
                "is_active": True
            }
        }
    )

    class Settings:
        name = "stores"
