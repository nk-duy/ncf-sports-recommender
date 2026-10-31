from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.models.notification import Notification

router = APIRouter()

class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED)
async def submit_contact(req: ContactRequest):
    """
    Tiếp nhận thông tin liên hệ và phản hồi của khách hàng,
    tự động lưu vào hệ thống thông báo hai chiều để quản trị viên xử lý.
    """
    if not req.name.strip() or not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Họ tên và nội dung liên hệ không được để trống."
        )

    # Lưu thông báo quản trị viên vào collection notifications (chỉ Admin nhận được)
    admin_notif = Notification(
        user_id="admin",
        title=f"Khách hàng liên hệ mới: {req.name.strip()}",
        message=f"Họ tên: {req.name.strip()}\nEmail: {req.email}\nSố điện thoại: {req.phone or 'Không cung cấp'}\nNội dung: {req.message.strip()}",
        type="admin_message",
        link="/admin/khach-hang"
    )
    await admin_notif.insert()

    return {
        "status": "success",
        "message": "Cảm ơn bạn đã liên hệ với KADY Sports! Yêu cầu của bạn đã được chuyển tới ban quản trị và chúng tôi sẽ phản hồi sớm nhất qua email.",
        "contact_id": str(admin_notif.id)
    }
