from fastapi import APIRouter, HTTPException, Query
from app.schemas.order import OrderCreate
from beanie import PydanticObjectId
from typing import List, Optional
from pydantic import BaseModel
from app.services.order_service import order_service
from app.api.deps import get_current_user_optional, get_current_active_user
from app.models.user import User
from fastapi import Depends

router = APIRouter()

class OrderStatusUpdate(BaseModel):
    status: str
    rejection_reason: Optional[str] = None
    tracking_code: Optional[str] = None
    carrier: Optional[str] = None

@router.post("/", response_model=dict)
async def create_order(
    order_data: OrderCreate, 
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    try:
        user_id = str(current_user.id) if current_user else None
        new_order = await order_service.create_order(order_data, user_id=user_id)
        return {"status": "success", "order_id": str(new_order.id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=1000)
):
    orders = await order_service.get_orders(skip=skip, limit=limit)
    return orders

@router.get("/my-orders")
async def get_my_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=1000),
    current_user: User = Depends(get_current_active_user)
):
    orders = await order_service.get_my_orders(user_id=str(current_user.id), skip=skip, limit=limit)
    return orders

@router.get("/{order_id}")
async def get_order(order_id: PydanticObjectId):
    order = await order_service.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/cancel")
async def cancel_my_order(
    order_id: PydanticObjectId,
    current_user: User = Depends(get_current_active_user)
):
    order = await order_service.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check if order belongs to user or user is admin
    if order.user_id != str(current_user.id) and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to cancel this order")
    
    if order.status.lower() not in ["pending", "chờ duyệt"]:
        raise HTTPException(status_code=400, detail="Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ duyệt")
    
    order = await order_service.update_order_status(order_id, "rejected", rejection_reason="Khách hàng yêu cầu hủy đơn")
    return {"status": "success", "order_id": str(order.id), "new_status": "rejected", "rejection_reason": order.rejection_reason}

@router.put("/{order_id}/status")
async def update_order_status(order_id: PydanticObjectId, status_update: OrderStatusUpdate):
    order = await order_service.update_order_status(
        order_id, 
        status_update.status,
        rejection_reason=status_update.rejection_reason,
        tracking_code=status_update.tracking_code,
        carrier=status_update.carrier
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "status": "success", 
        "order_id": str(order.id), 
        "new_status": order.status,
        "rejection_reason": order.rejection_reason,
        "tracking_code": order.tracking_code,
        "carrier": order.carrier
    }

