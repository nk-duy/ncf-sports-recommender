from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query, Depends, Request
from pydantic import BaseModel

from app.schemas.order import OrderCreate, OrderPaymentStatusUpdate
from app.services.order_service import order_service
from app.api.deps import get_current_user_optional, get_current_active_user, get_current_admin_user
from app.models.user import User
from app.core.limiter import limiter

router = APIRouter()


class OrderStatusUpdate(BaseModel):
    status: str
    rejection_reason: Optional[str] = None
    tracking_code: Optional[str] = None
    carrier: Optional[str] = None


@router.post("/", response_model=dict)
@limiter.limit("15/minute")
async def create_order(
    request: Request,
    order_data: OrderCreate,
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Tạo đơn hàng mới (Giới hạn 15 req/phút chống bot spam checkout)"""
    try:
        user_id = str(current_user.id) if current_user else None
        new_order = await order_service.create_order(order_data, user_id=user_id)
        return {"status": "success", "order_id": str(new_order.id)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=1000),
    search: Optional[str] = Query(None, description="Tìm theo mã đơn (ORD-...), tên khách, SĐT, mã vận đơn"),
    current_admin: User = Depends(get_current_admin_user)
):
    """Lấy danh sách tất cả đơn hàng (Quản trị viên) kèm tìm kiếm"""
    return await order_service.get_orders(skip=skip, limit=limit, search=search)


@router.get("/my-orders")
async def get_my_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=1000),
    current_user: User = Depends(get_current_active_user)
):
    """Lấy lịch sử đơn hàng của người dùng hiện tại"""
    return await order_service.get_my_orders(user_id=str(current_user.id), skip=skip, limit=limit)


@router.get("/{order_id}")
async def get_order(order_id: str):
    """Lấy chi tiết đơn hàng theo ID (hỗ trợ cả ObjectId và mã ORD-...)"""
    order = await order_service.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại hoặc mã đơn không hợp lệ")
    return order


@router.put("/{order_id}/cancel")
async def cancel_my_order(
    order_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Hủy đơn hàng của khách hàng nếu còn ở trạng thái Chờ duyệt"""
    is_admin = current_user.role == "admin"
    order = await order_service.cancel_order(order_id, user_id=str(current_user.id), is_admin=is_admin)
    return {
        "status": "success",
        "order_id": str(order.id),
        "new_status": order.status,
        "rejection_reason": order.rejection_reason
    }


@router.put("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Cập nhật trạng thái xử lý đơn hàng và mã vận đơn (Quản trị viên)"""
    order = await order_service.update_order_status(
        order_id,
        status_update.status,
        rejection_reason=status_update.rejection_reason,
        tracking_code=status_update.tracking_code,
        carrier=status_update.carrier
    )
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại hoặc mã đơn không hợp lệ")

    return {
        "status": "success",
        "order_id": str(order.id),
        "new_status": order.status,
        "rejection_reason": order.rejection_reason,
        "tracking_code": order.tracking_code,
        "carrier": order.carrier
    }


@router.put("/{order_id}/payment-status")
async def update_payment_status(
    order_id: str,
    payment_update: OrderPaymentStatusUpdate,
    current_admin: User = Depends(get_current_admin_user)
):
    """Cập nhật trạng thái thanh toán (unpaid, paid, refunded) - Dành cho Quản trị viên"""
    order = await order_service.update_payment_status(order_id, payment_update.payment_status)
    if not order:
        raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại hoặc mã đơn không hợp lệ")

    return {
        "status": "success",
        "order_id": str(order.id),
        "payment_status": order.payment_status,
        "paid_at": order.paid_at
    }
