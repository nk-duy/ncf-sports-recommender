from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    phone: Optional[str] = None
    address: Optional[str] = None
    tier: Optional[str] = "Đồng"
    interested_sports: list[str] = []
    is_active: bool
    role: str
    created_at: datetime

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    interested_sports: Optional[list[str]] = None
    shoe_size: Optional[str] = None
    preferred_colors: Optional[list[str]] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class SocialLoginRequest(BaseModel):
    provider: str
    token: str
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
