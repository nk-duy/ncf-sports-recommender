from beanie import Document, Indexed
from pydantic import Field, EmailStr
from typing import Optional
from datetime import datetime

class User(Document):
    username: Indexed(str, unique=True)
    email: Indexed(EmailStr, unique=True)
    hashed_password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    tier: str = "Đồng"
    interested_sports: list[str] = Field(default_factory=list)
    shoe_size: Optional[str] = None
    preferred_colors: list[str] = Field(default_factory=list)
    ai_profile: Optional[str] = None
    ai_score: int = 0
    role: str = "user"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

    class Settings:
        name = "users"
