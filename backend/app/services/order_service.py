from typing import List, Optional
from beanie import PydanticObjectId
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.voucher import Voucher
from app.schemas.order import OrderCreate

class OrderService:
    @staticmethod
    async def create_order(order_data: OrderCreate, user_id: Optional[str] = None) -> Order:
        # Decrement product stock
        for item in order_data.items:
            product = await Product.find_one(Product.product_id == item.product_id)
            if product:
                current_stock = product.stock if product.stock is not None else 100
                product.stock = max(0, current_stock - item.quantity)
                if product.variants:
                    for v in product.variants:
                        size_match = not v.size or not item.size or v.size.strip().lower() == item.size.strip().lower()
                        color_match = not v.color or not item.color or v.color.strip().lower() == item.color.strip().lower()
                        if size_match and color_match:
                            v.stock = max(0, v.stock - item.quantity)
                await product.save()

        # Update voucher usage if applied
        if order_data.voucher_code:
            code_upper = order_data.voucher_code.strip().upper()
            voucher = await Voucher.find_one(Voucher.code == code_upper)
            if voucher:
                voucher.used_count += 1
                await voucher.save()

        # Calculate subtotal if not provided
        calculated_subtotal = order_data.subtotal
        if not calculated_subtotal or calculated_subtotal <= 0:
            calculated_subtotal = sum(item.price * item.quantity for item in order_data.items)

        new_order = Order(
            customer_name=order_data.customer_name,
            customer_phone=order_data.customer_phone,
            customer_address=order_data.customer_address,
            payment_method=order_data.payment_method,
            items=[OrderItem(**item.dict()) for item in order_data.items],
            total_amount=order_data.total_amount,
            shipping_fee=order_data.shipping_fee,
            subtotal=calculated_subtotal,
            voucher_code=order_data.voucher_code,
            discount_amount=order_data.discount_amount,
            user_id=user_id
        )
        await new_order.insert()
        return new_order

    @staticmethod
    async def get_orders(skip: int = 0, limit: int = 20) -> List[Order]:
        orders = await Order.find_all().sort("-created_at").skip(skip).limit(limit).to_list()
        return orders

    @staticmethod
    async def get_my_orders(user_id: str, skip: int = 0, limit: int = 20) -> List[Order]:
        orders = await Order.find(Order.user_id == user_id).sort("-created_at").skip(skip).limit(limit).to_list()
        return orders

    @staticmethod
    async def get_order_by_id(order_id: PydanticObjectId) -> Optional[Order]:
        return await Order.get(order_id)

    @staticmethod
    async def update_order_status(
        order_id: PydanticObjectId, 
        status: str, 
        rejection_reason: Optional[str] = None,
        tracking_code: Optional[str] = None,
        carrier: Optional[str] = None
    ) -> Optional[Order]:
        order = await Order.get(order_id)
        if not order:
            return None
        
        order.status = status
        if rejection_reason is not None:
            order.rejection_reason = rejection_reason
        if tracking_code is not None:
            order.tracking_code = tracking_code
        if carrier is not None:
            order.carrier = carrier
        await order.save()
        return order

order_service = OrderService()
