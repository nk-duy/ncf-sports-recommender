import uuid
from datetime import datetime
from typing import Optional
from beanie import Document, Indexed
from pydantic import Field

class Notification(Document):
    notification_id: Indexed(str, unique=True) = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str  # user_id or email / username of recipient, or "all"
    title: str
    message: str
    type: str = "admin_message"  # "order" | "promotion" | "ai_recommend" | "admin_message"
    voucher_code: Optional[str] = ""
    link: Optional[str] = ""
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "notifications"
        indexes = [
            [("user_id", 1), ("created_at", -1)],
            "notification_id",
            [("is_read", 1)],
            [("created_at", -1)]
        ]
