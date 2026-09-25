from fastapi import APIRouter, HTTPException, Query
from app.schemas.order import OrderCreate
from beanie import PydanticObjectId
from typing import List
from pydantic import BaseModel
from app.services.order_service import order_service

router = APIRouter()

class OrderStatusUpdate(BaseModel):
    status: str

@router.post("/", response_model=dict)
async def create_order(order_data: OrderCreate):
    try:
        new_order = await order_service.create_order(order_data)
        return {"status": "success", "order_id": str(new_order.id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    orders = await order_service.get_orders(skip=skip, limit=limit)
    return orders

@router.get("/{order_id}")
async def get_order(order_id: PydanticObjectId):
    order = await order_service.get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/{order_id}/status")
async def update_order_status(order_id: PydanticObjectId, status_update: OrderStatusUpdate):
    order = await order_service.update_order_status(order_id, status_update.status)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {"status": "success", "order_id": str(order.id), "new_status": order.status}
