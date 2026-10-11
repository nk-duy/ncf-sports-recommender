from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ContactCreate(BaseModel):
    name: str = Field(..., description="Họ và tên")
    email: str = Field(..., description="Email liên hệ")
    phone: Optional[str] = Field(default=None, description="Số điện thoại")
    message: str = Field(..., description="Nội dung liên hệ")

class ContactResponse(ContactCreate):
    id: str
    is_resolved: bool
    created_at: datetime

    class Config:
        from_attributes = True
