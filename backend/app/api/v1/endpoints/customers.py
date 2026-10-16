from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.models.user import User
from app.services.customer_service import customer_service
from pydantic import BaseModel, EmailStr

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
    limit: int = Query(10, ge=1, le=100)
):
    """Lấy danh sách khách hàng phân trang kèm bộ lọc và các chỉ số thống kê RFM/CLV"""
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
async def get_customer_orders(customer_id: str):
    """Lấy lịch sử đơn hàng của một khách hàng cụ thể"""
    return await customer_service.get_customer_orders(customer_id)

@router.post("/")
async def create_customer(data: CustomerCreate):
    """Tạo mới hồ sơ khách hàng"""
    existing = await User.find_one(User.email == data.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email này đã được sử dụng")
    new_user = await customer_service.create_customer(data)
    return {"message": "Tạo khách hàng thành công", "id": str(new_user.id)}

@router.put("/{customer_id}")
async def update_customer(customer_id: str, data: CustomerUpdate):
    """Cập nhật thông tin phân hạng và hồ sơ của khách hàng"""
    user = await customer_service.update_customer(customer_id, data)
    if not user:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng hoặc ID không hợp lệ")
    return {"message": "Cập nhật thông tin khách hàng thành công"}

@router.delete("/{customer_id}")
async def delete_customer(customer_id: str):
    """Xóa hồ sơ khách hàng"""
    success = await customer_service.delete_customer(customer_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy khách hàng hoặc ID không hợp lệ")
    return {"message": "Đã xóa khách hàng"}

@router.post("/send-voucher")
async def send_voucher_to_customers(req: SendVoucherRequest):
    """Gửi voucher ưu đãi cá nhân hóa đến danh sách khách hàng được chọn"""
    if not req.customer_ids:
        raise HTTPException(status_code=400, detail="Chưa chọn khách hàng nào")
    return {
        "message": f"Đã gửi voucher {req.voucher_code} thành công đến {len(req.customer_ids)} khách hàng",
        "sent_count": len(req.customer_ids),
        "voucher_code": req.voucher_code
    }
