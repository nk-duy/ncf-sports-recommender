from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None
    interested_sports: Optional[list[str]] = []

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    phone: Optional[str] = None
    address: Optional[str] = None
    tier: Optional[str] = "Đồng"
    interested_sports: list[str] = []
    shoe_size: Optional[str] = None
    apparel_size: Optional[str] = None
    preferred_colors: list[str] = []
    wishlist: list[str] = []
    is_2fa_enabled: bool = False
    email_notifications: bool = True
    is_active: bool
    role: str
    total_spent: Optional[float] = 0.0
    loyalty_points: Optional[int] = 0
    created_at: datetime

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    interested_sports: Optional[list[str]] = None
    shoe_size: Optional[str] = None
    apparel_size: Optional[str] = None
    preferred_colors: Optional[list[str]] = None
    wishlist: Optional[list[str]] = None
    is_2fa_enabled: Optional[bool] = None
    email_notifications: Optional[bool] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class SocialLoginRequest(BaseModel):
    provider: str
    token: Optional[str] = ""
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    interested_sports: Optional[list[str]] = []
