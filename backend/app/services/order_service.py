from typing import List, Optional
from beanie import PydanticObjectId
from fastapi import HTTPException
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.voucher import Voucher
from app.schemas.order import OrderCreate
from app.core.database import get_client, get_db

class OrderService:
    @staticmethod
    async def create_order(order_data: OrderCreate, user_id: Optional[str] = None) -> Order:
        client = get_client()

        async def _execute_order_creation(session=None):
            # 1. Validate and decrement product stock
            for item in order_data.items:
                product = await Product.find_one(Product.product_id == item.product_id, session=session)
                if not product:
                    raise HTTPException(
                        status_code=404,
                        detail=f"Sản phẩm có mã '{item.product_id}' không tồn tại hoặc đã ngừng kinh doanh."
                    )

                current_stock = product.stock if product.stock is not None else 100
                if current_stock < item.quantity:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Sản phẩm '{product.name}' chỉ còn {current_stock} sản phẩm trong kho (bạn đặt {item.quantity})."
                    )

                product.stock = current_stock - item.quantity

                # Deduct specific variant stock if exists
                if product.variants:
                    for v in product.variants:
                        size_match = not v.size or not item.size or v.size.strip().lower() == item.size.strip().lower()
                        color_match = not v.color or not item.color or v.color.strip().lower() == item.color.strip().lower()
                        if size_match and color_match:
                            if v.stock < item.quantity:
                                raise HTTPException(
                                    status_code=400,
                                    detail=f"Phân loại {v.color} - {v.size} của '{product.name}' chỉ còn {v.stock} sản phẩm."
                                )
                            v.stock = v.stock - item.quantity

                await product.save(session=session)

            # 2. Validate & Update voucher usage if applied
            if order_data.voucher_code:
                code_upper = order_data.voucher_code.strip().upper()
                voucher = await Voucher.find_one(Voucher.code == code_upper, session=session)
                if not voucher:
                    raise HTTPException(status_code=400, detail=f"Mã voucher '{code_upper}' không tồn tại.")
                if not voucher.is_active:
                    raise HTTPException(status_code=400, detail=f"Mã voucher '{code_upper}' hiện không còn hiệu lực.")
                if voucher.usage_limit is not None and voucher.used_count >= voucher.usage_limit:
                    raise HTTPException(status_code=400, detail=f"Mã voucher '{code_upper}' đã hết lượt sử dụng.")

                voucher.used_count += 1
                await voucher.save(session=session)

            # 3. Calculate subtotal if not provided
            calculated_subtotal = order_data.subtotal
            if not calculated_subtotal or calculated_subtotal <= 0:
                calculated_subtotal = sum(item.price * item.quantity for item in order_data.items)

            # 4. Insert new Order
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
            await new_order.insert(session=session)
            return new_order

        # Execute inside MongoDB ACID Transaction if client is available
        if client:
            try:
                async with await client.start_session() as session:
                    async with session.start_transaction():
                        return await _execute_order_creation(session=session)
            except HTTPException:
                raise
            except Exception as e:
                # If transactions fail due to standalone config, gracefully fallback to direct execution
                print(f"[OrderService] Transaction failed or unsupported, fallback: {e}")
                return await _execute_order_creation(session=None)
        else:
            return await _execute_order_creation(session=None)

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

    @staticmethod
    async def cancel_order(order_id: PydanticObjectId, user_id: str, is_admin: bool = False) -> Order:
        order = await Order.get(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại")
        
        if order.user_id != user_id and not is_admin:
            raise HTTPException(status_code=403, detail="Bạn không có quyền thao tác trên đơn hàng này")
        
        if order.status.lower() not in ["pending", "chờ duyệt"]:
            raise HTTPException(status_code=400, detail="Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ duyệt")
            
        order.status = "rejected"
        order.rejection_reason = "Khách hàng yêu cầu hủy đơn"
        await order.save()
        return order

order_service = OrderService()
