from fastapi import APIRouter, HTTPException, Depends, Query, status
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.api.deps import get_current_user_optional, get_current_active_user, get_current_admin_user
from app.models.user import User
from app.models.notification import Notification
from app.services.notification_service import notification_service

router = APIRouter()

class NotificationSendRequest(BaseModel):
    user_id: Optional[str] = None
    user_ids: Optional[List[str]] = None
    title: str
    message: str
    type: str = "admin_message"  # "order" | "promotion" | "ai_recommend" | "admin_message"
    voucher_code: Optional[str] = ""
    link: Optional[str] = ""

class NotificationItem(BaseModel):
    id: str
    notification_id: str
    user_id: str
    title: str
    message: str
    type: str
    voucher_code: Optional[str] = ""
    link: Optional[str] = ""
    is_read: bool
    created_at: datetime

@router.post("/send")
async def send_notification(
    req: NotificationSendRequest,
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Cho phép Admin gửi thông báo trực tiếp hoặc tặng Voucher cho 1 khách hàng cụ thể
    (hoặc tất cả khách hàng) và lưu vào bảng notifications.
    """
    if not req.title.strip() or not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tiêu đề và nội dung thông báo không được để trống"
        )

    # Nếu gửi cho nhiều người dùng (bulk)
    if req.user_ids and len(req.user_ids) > 0:
        notifs = await notification_service.send_bulk_notifications(
            user_ids=req.user_ids,
            title=req.title,
            message=req.message,
            notification_type=req.type,
            voucher_code=req.voucher_code or "",
            link=req.link or ""
        )
        return {
            "status": "success",
            "message": f"Đã gửi thông báo thành công tới {len(notifs)} khách hàng",
            "sent_count": len(notifs)
        }

    # Nếu gửi cho 1 người dùng cụ thể hoặc "all"
    target_id = (req.user_id or "all").strip()
    notif = await notification_service.send_notification(
        user_id=target_id,
        title=req.title,
        message=req.message,
        notification_type=req.type,
        voucher_code=req.voucher_code or "",
        link=req.link or ""
    )

    return {
        "status": "success",
        "message": "Đã gửi thông báo thành công",
        "notification_id": notif.notification_id,
        "notification": {
            "id": str(notif.id),
            "notification_id": notif.notification_id,
            "user_id": notif.user_id,
            "title": notif.title,
            "message": notif.message,
            "type": notif.type,
            "voucher_code": notif.voucher_code,
            "link": notif.link,
            "is_read": notif.is_read,
            "created_at": notif.created_at
        }
    }

@router.get("")
@router.get("/")
async def get_notifications(
    user_id: Optional[str] = Query(None, description="Lọc theo user_id hoặc email"),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Lấy danh sách thông báo và unread_count của người dùng đang đăng nhập
    (khớp theo user_id, username hoặc email). Tự động đồng bộ thông báo từ đơn hàng
    thực tế nếu chưa tồn tại trong bảng notifications.
    Nếu chưa đăng nhập và không truyền user_id hợp lệ, trả về rỗng ngay lập tức.
    """
    if not current_user and not user_id:
        return {
            "notifications": [],
            "items": [],
            "unread_count": 0,
            "total": 0
        }

    notifs = await notification_service.get_user_notifications(
        user=current_user,
        user_id_param=user_id
    )

    formatted = []
    unread_count = 0
    for n in notifs:
        if not n.is_read:
            unread_count += 1
        formatted.append({
            "id": str(n.id),
            "notification_id": n.notification_id,
            "user_id": n.user_id,
            "title": n.title,
            "message": n.message,
            "type": n.type,
            "voucher_code": n.voucher_code or "",
            "link": n.link or "",
            "is_read": n.is_read,
            "created_at": n.created_at.isoformat() if n.created_at else None
        })

    return {
        "notifications": formatted,
        "items": formatted,
        "unread_count": unread_count,
        "total": len(formatted)
    }

@router.put("/read-all")
async def mark_all_as_read(
    user_id: Optional[str] = Query(None),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Đánh dấu tất cả thông báo của người dùng là đã đọc"""
    if not current_user and not user_id:
        return {
            "status": "success",
            "message": "Không có thông tin người dùng",
            "marked_count": 0
        }

    count = await notification_service.mark_all_as_read(
        user=current_user,
        user_id_param=user_id
    )
    return {
        "status": "success",
        "message": f"Đã đánh dấu đã đọc cho {count} thông báo",
        "marked_count": count
    }

@router.put("/{notification_id}/read")
async def mark_single_as_read(notification_id: str):
    """Đánh dấu 1 thông báo cụ thể là đã đọc"""
    success = await notification_service.mark_as_read(notification_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Không tìm thấy thông báo hoặc ID không hợp lệ"
        )
    return {
        "status": "success",
        "notification_id": notification_id,
        "is_read": True
    }
