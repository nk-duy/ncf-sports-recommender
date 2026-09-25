from typing import List, Optional
from beanie import PydanticObjectId
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate

class OrderService:
    @staticmethod
    async def create_order(order_data: OrderCreate) -> Order:
        new_order = Order(
            customer_name=order_data.customer_name,
            customer_phone=order_data.customer_phone,
            customer_address=order_data.customer_address,
            payment_method=order_data.payment_method,
            items=[OrderItem(**item.dict()) for item in order_data.items],
            total_amount=order_data.total_amount
        )
        await new_order.insert()
        return new_order

    @staticmethod
    async def get_orders(skip: int = 0, limit: int = 20) -> List[Order]:
        orders = await Order.find_all().sort("-created_at").skip(skip).limit(limit).to_list()
        return orders

    @staticmethod
    async def get_order_by_id(order_id: PydanticObjectId) -> Optional[Order]:
        return await Order.get(order_id)

    @staticmethod
    async def update_order_status(order_id: PydanticObjectId, status: str) -> Optional[Order]:
        order = await Order.get(order_id)
        if not order:
            return None
        
        order.status = status
        await order.save()
        return order

order_service = OrderService()
