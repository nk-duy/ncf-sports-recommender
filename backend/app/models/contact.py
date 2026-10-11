from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime

class Contact(Document):
    name: str = Field(..., description="Họ và tên")
    email: str = Field(..., description="Email liên hệ")
    phone: Optional[str] = Field(default=None, description="Số điện thoại")
    message: str = Field(..., description="Nội dung liên hệ")
    is_resolved: Optional[bool] = Field(default=False, description="Đã xử lý hay chưa")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Thời gian gửi")

    class Settings:
        name = "contacts"
