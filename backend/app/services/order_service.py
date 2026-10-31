import logging
import re
from datetime import datetime
from typing import List, Optional, Any
from bson import ObjectId
from beanie import PydanticObjectId
from fastapi import HTTPException

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.voucher import Voucher
from app.schemas.order import OrderCreate
from app.core.database import get_client
from app.services.admin_service import admin_service

logger = logging.getLogger(__name__)

CANCELLED_STATUSES = {"cancelled", "rejected", "đã hủy", "từ chối"}


class OrderService:
    @staticmethod
    async def _validate_and_deduct_inventory(items: List[Any], session=None) -> None:
        """Kiểm tra và trừ tồn kho sản phẩm & biến thể an toàn (Defensive Check chống âm kho)"""
        for item in items:
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

            product.stock = max(0, current_stock - item.quantity)

            # Khấu trừ phân loại SKU cụ thể (Xử lý an toàn nếu mảng variants rỗng hoặc None)
            variants = product.variants or []
            if variants and (item.size or item.color):
                for v in variants:
                    size_match = not v.size or not item.size or v.size.strip().lower() == item.size.strip().lower()
                    color_match = not v.color or not item.color or v.color.strip().lower() == item.color.strip().lower()
                    if size_match and color_match:
                        v_stock = v.stock if v.stock is not None else 0
                        if v_stock < item.quantity:
                            raise HTTPException(
                                status_code=400,
                                detail=f"Phân loại {v.color or ''} - {v.size or ''} của '{product.name}' chỉ còn {v_stock} sản phẩm."
                            )
                        v.stock = max(0, v_stock - item.quantity)

            await product.save(session=session)

    @staticmethod
    async def _validate_and_apply_voucher(voucher_code: Optional[str], session=None) -> None:
        """Kiểm tra tính hợp lệ và ghi nhận lượt sử dụng mã giảm giá"""
        if not voucher_code or not voucher_code.strip():
            return

        code_upper = voucher_code.strip().upper()
        voucher = await Voucher.find_one(Voucher.code == code_upper, session=session)
        if not voucher:
            raise HTTPException(status_code=400, detail=f"Mã voucher '{code_upper}' không tồn tại.")
        if not voucher.is_active:
            raise HTTPException(status_code=400, detail=f"Mã voucher '{code_upper}' hiện không còn hiệu lực.")
        if voucher.usage_limit is not None and (voucher.used_count or 0) >= voucher.usage_limit:
            raise HTTPException(status_code=400, detail=f"Mã voucher '{code_upper}' đã hết lượt sử dụng.")

        voucher.used_count = (voucher.used_count or 0) + 1
        await voucher.save(session=session)

    @staticmethod
    def _build_order_document(order_data: OrderCreate, user_id: Optional[str]) -> Order:
        """Khởi tạo đối tượng Document Order với tính toán tổng tiền chuẩn xác"""
        calculated_subtotal = order_data.subtotal
        if not calculated_subtotal or calculated_subtotal <= 0:
            calculated_subtotal = sum(item.price * item.quantity for item in order_data.items)

        return Order(
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
            shipping_method=order_data.shipping_method,
            payment_status=getattr(order_data, "payment_status", None) or "unpaid",
            user_id=user_id
        )

    @staticmethod
    async def _post_order_creation_actions(order: Order) -> None:
        """Hủy bộ đệm thống kê và phát thông báo xác nhận đặt hàng thành công"""
        try:
            await admin_service.invalidate_dashboard_cache()
        except Exception:
            pass

        try:
            from app.services.notification_service import notification_service
            await notification_service.notify_order_placed(order)
        except Exception as e:
            logger.warning(f"[OrderService] Notification trigger error: {e}")

    @staticmethod
    async def create_order(order_data: OrderCreate, user_id: Optional[str] = None) -> Order:
        """Tạo đơn hàng mới (Hỗ trợ MongoDB Transaction với fallback an toàn)"""
        client = get_client()

        async def _execute_order_creation(session=None) -> Order:
            await OrderService._validate_and_deduct_inventory(order_data.items, session=session)
            await OrderService._validate_and_apply_voucher(order_data.voucher_code, session=session)
            new_order = OrderService._build_order_document(order_data, user_id)
            await new_order.insert(session=session)
            return new_order

        result_order: Optional[Order] = None
        if client:
            try:
                async with await client.start_session() as session:
                    async with session.start_transaction():
                        result_order = await _execute_order_creation(session=session)
            except HTTPException:
                raise
            except Exception as e:
                logger.info(f"[OrderService] Standalone session fallback: {e}")
                result_order = await _execute_order_creation(session=None)
        else:
            result_order = await _execute_order_creation(session=None)

        if result_order:
            await OrderService._post_order_creation_actions(result_order)

        return result_order

    @staticmethod
    async def get_orders(skip: int = 0, limit: int = 20, search: Optional[str] = None) -> List[Order]:
        """Truy vấn danh sách đơn hàng có tìm kiếm linh hoạt theo mã, tên, SĐT, mã vận đơn"""
        if search and search.strip():
            raw = search.strip()
            clean = raw.lstrip('#').upper()
            if clean.startswith(('ORD-', 'ORD_', 'DH-', 'DH_')):
                clean = clean.split('-', 1)[-1].split('_', 1)[-1]
            elif clean.startswith('ORD'):
                clean = clean[3:]

            query_conds = [
                {"customer_name": {"$regex": re.escape(raw), "$options": "i"}},
                {"customer_phone": {"$regex": re.escape(raw), "$options": "i"}},
                {"tracking_code": {"$regex": re.escape(raw), "$options": "i"}}
            ]
            if clean:
                query_conds.append({
                    "$expr": {
                        "$regexMatch": {
                            "input": {"$toString": "$_id"},
                            "regex": re.escape(clean.lower())
                        }
                    }
                })
            return await Order.find({"$or": query_conds}).sort("-created_at").skip(skip).limit(limit).to_list()

        orders = await Order.find_all().sort("-created_at").skip(skip).limit(limit).to_list()
        return await OrderService._enrich_orders(orders)

    @staticmethod
    async def _enrich_orders(orders: List[Order]) -> List[Order]:
        """Bổ sung ảnh sản phẩm hiển thị vào Order items nếu thiếu"""
        if not orders:
            return orders

        missing_ids = set()
        for o in orders:
            for item in o.items:
                if not getattr(item, 'image_url', None) or not item.image_url.strip():
                    missing_ids.add(item.product_id)

        if not missing_ids:
            return orders

        try:
            products = await Product.find({"product_id": {"$in": list(missing_ids)}}).to_list()
            prod_map = {p.product_id: p.image_url for p in products if p.image_url}
            for o in orders:
                for item in o.items:
                    if not getattr(item, 'image_url', None) or not item.image_url.strip():
                        img = prod_map.get(item.product_id)
                        if img:
                            item.image_url = img
        except Exception as e:
            logger.warning(f"[OrderService] Failed to enrich product images: {e}")
        return orders

    @staticmethod
    async def get_my_orders(user_id: str, skip: int = 0, limit: int = 20) -> List[Order]:
        """Lấy lịch sử đơn hàng của người dùng"""
        orders = await Order.find(Order.user_id == user_id).sort("-created_at").skip(skip).limit(limit).to_list()
        return await OrderService._enrich_orders(orders)

    @staticmethod
    async def get_order_by_id(order_id: str) -> Optional[Order]:
        """
        Tìm kiếm đơn hàng an toàn (Crash-proof) hỗ trợ:
        - Chuỗi ObjectId 24 ký tự hợp lệ
        - Mã đơn hàng ORD-XXXX, #ORD-XXXX, hoặc hậu tố ID
        """
        raw = str(order_id).strip()
        if not raw:
            return None

        # 1. Kiểm tra tính hợp lệ trước khi ép kiểu PydanticObjectId
        if ObjectId.is_valid(raw):
            try:
                order = await Order.get(PydanticObjectId(raw))
                if order:
                    enriched = await OrderService._enrich_orders([order])
                    return enriched[0]
            except Exception:
                pass

        # 2. Xử lý mã hiển thị ORD-... / #ORD-...
        clean = raw.lstrip('#').upper()
        if clean.startswith(('ORD-', 'ORD_', 'DH-', 'DH_')):
            clean = clean.split('-', 1)[-1].split('_', 1)[-1]
        elif clean.startswith('ORD'):
            clean = clean[3:]

        if clean:
            # Khớp hậu tố mã đơn hàng
            order = await Order.find_one({
                "$expr": {
                    "$regexMatch": {
                        "input": {"$toString": "$_id"},
                        "regex": re.escape(clean.lower()) + "$"
                    }
                }
            })
            if order:
                enriched = await OrderService._enrich_orders([order])
                return enriched[0]

            # Khớp chuỗi con
            order = await Order.find_one({
                "$expr": {
                    "$regexMatch": {
                        "input": {"$toString": "$_id"},
                        "regex": re.escape(clean.lower())
                    }
                }
            })
            if order:
                enriched = await OrderService._enrich_orders([order])
                return enriched[0]

        return None

    @staticmethod
    async def _restore_order_inventory_and_voucher(order: Order, session=None) -> None:
        """
        Hoàn trả tồn kho sản phẩm, biến thể SKU và lượt dùng voucher khi đơn hàng bị hủy/từ chối.
        Bảo vệ chống số âm (stock >= 0, used_count >= 0).
        """
        # 1. Hoàn trả tồn kho sản phẩm & biến thể
        if order.items:
            for item in order.items:
                try:
                    product = await Product.find_one(Product.product_id == item.product_id, session=session)
                    if not product:
                        continue

                    product.stock = max(0, (product.stock or 0) + item.quantity)

                    # Hoàn trả biến thể cụ thể nếu có
                    variants = product.variants or []
                    if variants:
                        for v in variants:
                            size_match = not v.size or not item.size or v.size.strip().lower() == item.size.strip().lower()
                            color_match = not v.color or not item.color or v.color.strip().lower() == item.color.strip().lower()
                            if size_match and color_match:
                                v.stock = max(0, (v.stock or 0) + item.quantity)

                    await product.save(session=session)
                    logger.info(f"[OrderService] Restocked {item.quantity} for product {item.product_id}")
                except Exception as ex:
                    logger.error(f"[OrderService] Error restocking item {item.product_id}: {ex}")

        # 2. Hoàn trả lượt dùng voucher nếu có sử dụng
        if order.voucher_code:
            try:
                code_upper = order.voucher_code.strip().upper()
                voucher = await Voucher.find_one(Voucher.code == code_upper, session=session)
                if voucher and voucher.used_count is not None:
                    voucher.used_count = max(0, voucher.used_count - 1)
                    await voucher.save(session=session)
                    logger.info(f"[OrderService] Restored voucher {code_upper} used_count to {voucher.used_count}")
            except Exception as ex:
                logger.error(f"[OrderService] Error restoring voucher usage: {ex}")

    @staticmethod
    async def update_order_status(
        order_id: Any,
        status: str,
        rejection_reason: Optional[str] = None,
        tracking_code: Optional[str] = None,
        carrier: Optional[str] = None
    ) -> Optional[Order]:
        """Cập nhật trạng thái đơn hàng kèm tự động hoàn kho khi hủy và cập nhật thanh toán khi giao"""
        order = await OrderService.get_order_by_id(str(order_id))
        if not order:
            return None

        old_status = (order.status or "").lower()
        is_transition_to_cancelled = (old_status not in CANCELLED_STATUSES) and (status.lower() in CANCELLED_STATUSES)

        order.status = status
        if rejection_reason is not None:
            order.rejection_reason = rejection_reason
        if tracking_code is not None:
            order.tracking_code = tracking_code
        if carrier is not None:
            order.carrier = carrier

        # Tự động chuyển sang 'paid' khi đơn giao thành công
        if status.lower() in ["delivered", "đã giao", "hoàn thành"]:
            order.payment_status = "paid"
            if not order.paid_at:
                order.paid_at = datetime.utcnow()

        await order.save()

        # Hoàn trả tồn kho và lượt dùng voucher khi đơn hàng bị hủy hoặc từ chối
        if is_transition_to_cancelled:
            await OrderService._restore_order_inventory_and_voucher(order)

        try:
            await admin_service.invalidate_dashboard_cache()
        except Exception:
            pass

        # Trigger customer notification on status update
        try:
            from app.services.notification_service import notification_service
            await notification_service.notify_order_status_change(order, status, tracking_code=tracking_code)
        except Exception as e:
            logger.warning(f"[OrderService] Notification status change error: {e}")

        return order

    @staticmethod
    async def update_payment_status(
        order_id: Any,
        payment_status: str
    ) -> Optional[Order]:
        """Cập nhật trạng thái thanh toán đơn hàng (unpaid, paid, refunded)"""
        order = await OrderService.get_order_by_id(str(order_id))
        if not order:
            return None

        order.payment_status = payment_status
        if payment_status == "paid":
            order.paid_at = datetime.utcnow()
        elif payment_status == "unpaid":
            order.paid_at = None

        await order.save()
        try:
            await admin_service.invalidate_dashboard_cache()
        except Exception:
            pass
        return order

    @staticmethod
    async def cancel_order(order_id: Any, user_id: str, is_admin: bool = False) -> Order:
        """Hủy đơn hàng an toàn bởi khách hàng hoặc quản trị viên"""
        order = await OrderService.get_order_by_id(str(order_id))
        if not order:
            raise HTTPException(status_code=404, detail="Đơn hàng không tồn tại hoặc mã đơn không hợp lệ")

        if order.user_id and order.user_id != user_id and not is_admin:
            raise HTTPException(status_code=403, detail="Bạn không có quyền thao tác trên đơn hàng này")

        old_status = (order.status or "").lower()
        if old_status not in ["pending", "chờ duyệt", "chờ xác nhận"]:
            raise HTTPException(status_code=400, detail="Chỉ có thể hủy đơn hàng khi đang ở trạng thái Chờ duyệt")

        order.status = "cancelled"
        order.rejection_reason = "Khách hàng yêu cầu hủy đơn"
        await order.save()

        # Hoàn trả tồn kho biến thể SKU và voucher an toàn
        await OrderService._restore_order_inventory_and_voucher(order)

        # Tạo thông báo xác nhận hủy đơn
        try:
            from app.services.notification_service import notification_service
            ord_code = str(order.id)[-8:].upper()
            price_formatted = notification_service.format_currency(order.total_amount)
            target_uid = order.user_id or user_id
            await notification_service.send_notification(
                user_id=target_uid,
                title=f"Đơn hàng #{ord_code} đã được hủy",
                message=f"Đơn hàng #{ord_code} trị giá {price_formatted} của bạn đã được hủy thành công. Số lượng sản phẩm đã được hoàn trả lại hệ thống.",
                notification_type="order",
                link="/tai-khoan/orders"
            )
        except Exception as e:
            logger.warning(f"[OrderService] Error sending cancellation notification: {e}")

        try:
            await admin_service.invalidate_dashboard_cache()
        except Exception:
            pass

        return order


order_service = OrderService()
