from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Depends
from pydantic import BaseModel, EmailStr
from bson import ObjectId

from app.models.user import User
from app.services.customer_service import customer_service
from app.api.deps import get_current_admin_user

router = APIRouter()


class CustomerCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    tier: Optional[str] = "Đồng"
    interested_sports: Optional[List[str]] = []
    shoe_size: Optional[str] = "41 EU"
    preferred_colors: Optional[List[str]] = []
    ai_profile: Optional[str] = None


class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    tier: Optional[str] = None
    interested_sports: Optional[List[str]] = None
    shoe_size: Optional[str] = None
    preferred_colors: Optional[List[str]] = None
    ai_profile: Optional[str] = None


class SendVoucherRequest(BaseModel):
    customer_ids: List[str]
    voucher_code: str
    title: Optional[str] = "Ưu đãi đặc biệt từ Kady Sport"
    message: Optional[str] = None


@router.get("/", response_model=Dict[str, Any])
async def get_customers(
    search: Optional[str] = None,
    tier: Optional[str] = None,
    sport: Optional[str] = None,
    region: Optional[str] = None,
    tab: Optional[str] = "all",
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_admin: User = Depends(get_current_admin_user)
):
    """Lấy danh sách khách hàng phân trang kèm bộ lọc và các chỉ số thống kê RFM/CLV (Quản trị viên)"""
    return await customer_service.get_customers_with_stats(
        search=search,
        tier=tier,
        sport=sport,
        region=region,
        tab=tab,
        page=page,
        limit=limit
    )


@router.get("/{customer_id}/orders")
async def get_customer_orders(
    customer_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Lấy lịch sử đơn hàng của một khách hàng cụ thể (Quản trị viên)"""
    clean_id = customer_id.strip()
    if clean_id and not ObjectId.is_valid(clean_id):
        # Kiểm tra nếu truyền username
        user = await User.find_one(User.username == clean_id)
        if not user:
            return []
        clean_id = str(user.id)
    return await customer_service.get_customer_orders(clean_id)


@router.post("/")
async def create_customer(
    data: CustomerCreate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Tạo mới hồ sơ khách hàng (Quản trị viên)"""
    existing = await User.find_one(User.email == data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email này đã được sử dụng")
    new_user = await customer_service.create_customer(data)
    return {"message": "Tạo khách hàng thành công", "id": str(new_user.id)}


@router.put("/{customer_id}")
async def update_customer(
    customer_id: str,
    data: CustomerUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Cập nhật thông tin phân hạng và hồ sơ của khách hàng (Quản trị viên)"""
    clean_id = customer_id.strip()
    if not ObjectId.is_valid(clean_id):
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng hoặc ID không hợp lệ")

    user = await customer_service.update_customer(clean_id, data)
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng hoặc ID không hợp lệ")
    return {"message": "Cập nhật thông tin khách hàng thành công"}


@router.delete("/{customer_id}")
async def delete_customer(
    customer_id: str,
    current_admin: User = Depends(get_current_admin_user)
):
    """Xóa hồ sơ khách hàng (Quản trị viên)"""
    clean_id = customer_id.strip()
    if not ObjectId.is_valid(clean_id):
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng hoặc ID không hợp lệ")

    success = await customer_service.delete_customer(clean_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng hoặc ID không hợp lệ")
    return {"message": "Đã xóa khách hàng"}


@router.post("/send-voucher")
async def send_voucher_to_customers(
    req: SendVoucherRequest,
    current_admin: User = Depends(get_current_admin_user)
):
    """Gửi voucher ưu đãi cá nhân hóa đến danh sách khách hàng được chọn (Quản trị viên)"""
    if not req.customer_ids:
        raise HTTPException(status_code=400, detail="Chưa chọn khách hàng nào")

    from app.services.notification_service import notification_service
    title = req.title or f"🎁 Quà tặng Voucher {req.voucher_code} từ Kady Sport"
    message = req.message or f"Kady Sport gửi tặng bạn mã giảm giá {req.voucher_code} độc quyền. Áp dụng ngay cho đơn hàng kế tiếp!"

    if "all_target" in req.customer_ids or "all" in req.customer_ids:
        await notification_service.send_notification(
            user_id="all",
            title=title,
            message=message,
            notification_type="promotion",
            voucher_code=req.voucher_code,
            link="/tai-khoan"
        )
    else:
        await notification_service.send_bulk_notifications(
            user_ids=req.customer_ids,
            title=title,
            message=message,
            notification_type="promotion",
            voucher_code=req.voucher_code,
            link="/tai-khoan"
        )

    return {
        "message": f"Đã gửi voucher {req.voucher_code} thành công đến {len(req.customer_ids)} khách hàng",
        "sent_count": len(req.customer_ids),
        "voucher_code": req.voucher_code
    }
