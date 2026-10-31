import uuid
from datetime import datetime
from typing import List, Optional
from beanie import PydanticObjectId
from app.models.notification import Notification
from app.models.user import User
from app.models.order import Order

STATUS_TEXT_MAP = {
    "pending": "Chờ xác nhận",
    "confirmed": "Đã xác nhận",
    "shipping": "Đang vận chuyển",
    "delivered": "Giao hàng thành công",
    "completed": "Hoàn tất đơn hàng",
    "rejected": "Đã bị hủy",
    "cancelled": "Đã bị hủy"
}

class NotificationService:
    @staticmethod
    def format_currency(amount: float) -> str:
        try:
            return f"{int(amount):,} đ".replace(",", ".")
        except Exception:
            return f"{amount} đ"

    @staticmethod
    async def send_notification(
        user_id: str,
        title: str,
        message: str,
        notification_type: str = "admin_message",
        voucher_code: str = "",
        link: str = ""
    ) -> Notification:
        """Tạo và lưu 1 thông báo mới vào MongoDB"""
        notif = Notification(
            notification_id=str(uuid.uuid4()),
            user_id=str(user_id),
            title=title.strip(),
            message=message.strip(),
            type=notification_type,
            voucher_code=(voucher_code or "").strip(),
            link=(link or "").strip(),
            is_read=False,
            created_at=datetime.utcnow()
        )
        await notif.insert()
        return notif

    @staticmethod
    async def send_bulk_notifications(
        user_ids: List[str],
        title: str,
        message: str,
        notification_type: str = "admin_message",
        voucher_code: str = "",
        link: str = ""
    ) -> List[Notification]:
        """Gửi thông báo tới nhiều khách hàng"""
        results = []
        for uid in user_ids:
            if uid:
                n = await NotificationService.send_notification(
                    user_id=uid,
                    title=title,
                    message=message,
                    notification_type=notification_type,
                    voucher_code=voucher_code,
                    link=link
                )
                results.append(n)
        return results

    @staticmethod
    async def ensure_order_notifications(user: Optional[User], user_id_param: Optional[str] = None):
        """
        Nếu khách hàng đã có đơn hàng thực tế (ví dụ đơn #0BB52404 trị giá 1.320.000 đ)
        mà chưa có thông báo đơn hàng trong DB thì tự động khởi tạo thông báo thực từ đơn hàng đó.
        """
        query_conditions = []
        target_uid = None

        if user:
            target_uid = str(user.id)
            query_conditions.append({"user_id": target_uid})
            if user.phone:
                query_conditions.append({"customer_phone": user.phone})
            if user.full_name:
                query_conditions.append({"customer_name": user.full_name})
        elif user_id_param and user_id_param != "all":
            target_uid = user_id_param
            query_conditions.append({"user_id": user_id_param})
            # Thử tìm user tương ứng nếu user_id_param là email hoặc ObjectId
            found_user = None
            try:
                found_user = await User.get(PydanticObjectId(user_id_param))
            except Exception:
                pass
            if not found_user:
                found_user = await User.find_one(User.email == user_id_param)
            if not found_user:
                found_user = await User.find_one(User.username == user_id_param)

            if found_user:
                target_uid = str(found_user.id)
                query_conditions.append({"user_id": target_uid})
                if found_user.phone:
                    query_conditions.append({"customer_phone": found_user.phone})
                if found_user.full_name:
                    query_conditions.append({"customer_name": found_user.full_name})

        if not query_conditions:
            return

        orders = await Order.find({"$or": query_conditions}).to_list()
        if not orders:
            return

        # Lấy các thông báo loại 'order' hiện có của khách hàng này
        existing_notifs = await Notification.find(
            {"user_id": target_uid, "type": "order"}
        ).to_list()

        for ord_obj in orders:
            ord_id_str = str(ord_obj.id)
            ord_code = ord_id_str[-8:].upper()

            # Kiểm tra xem đã có thông báo cho đơn này chưa
            already_notified = any(
                (ord_code in n.title or ord_code in n.message or ord_id_str in (n.link or ""))
                for n in existing_notifs
            )

            if not already_notified:
                status_label = STATUS_TEXT_MAP.get(ord_obj.status.lower(), ord_obj.status)
                price_formatted = NotificationService.format_currency(ord_obj.total_amount)
                item_count = len(ord_obj.items) if ord_obj.items else 1

                title = f"Đơn hàng #{ord_code} - {status_label}"
                message = (
                    f"Đơn hàng #{ord_code} trị giá {price_formatted} ({item_count} sản phẩm) "
                    f"của bạn đang ở trạng thái: {status_label}. Cảm ơn bạn đã tin tưởng Kady Sport!"
                )

                created_at = ord_obj.created_at or datetime.utcnow()
                notif = Notification(
                    notification_id=str(uuid.uuid4()),
                    user_id=target_uid,
                    title=title,
                    message=message,
                    type="order",
                    link="/tai-khoan/orders",
                    is_read=False,
                    created_at=created_at
                )
                await notif.insert()

    @staticmethod
    async def get_user_notifications(
        user: Optional[User] = None,
        user_id_param: Optional[str] = None
    ) -> List[Notification]:
        """
        Lấy tất cả thông báo thuộc về người dùng (theo id, email, username hoặc 'all').
        Khách vãng lai (chưa đăng nhập) trả về danh sách rỗng [].
        Thông báo nội bộ dành riêng cho Quản trị viên (user_id='admin') chỉ được nạp nếu người dùng có role='admin'.
        """
        if not user and not user_id_param:
            return []

        targets = ["all"]
        is_admin = False
        
        if user:
            targets.append(str(user.id))
            if user.email:
                targets.append(user.email)
            if user.username:
                targets.append(user.username)
            if user.role == "admin" or user.username == "admin":
                is_admin = True
        elif user_id_param:
            if user_id_param != "all":
                targets.append(user_id_param)
            # Thử tìm user tương ứng để thêm email/username và kiểm tra quyền admin
            found = None
            try:
                found = await User.get(PydanticObjectId(user_id_param))
            except Exception:
                pass
            if not found:
                found = await User.find_one(User.email == user_id_param)
            if not found:
                found = await User.find_one(User.username == user_id_param)
            if found:
                targets.extend([str(found.id), found.email, found.username])
                if found.role == "admin" or found.username == "admin":
                    is_admin = True

        if is_admin:
            targets.append("admin")

        # Đảm bảo tự động đồng bộ thông báo từ đơn hàng nếu có
        await NotificationService.ensure_order_notifications(user, user_id_param)

        notifs = await Notification.find(
            {"user_id": {"$in": list(set(targets))}}
        ).sort("-created_at").to_list()

        return notifs

    @staticmethod
    async def mark_as_read(notification_id: str) -> bool:
        """Đánh dấu đã đọc cho 1 thông báo"""
        notif = await Notification.find_one(Notification.notification_id == notification_id)
        if not notif:
            # Thử tìm theo MongoDB ObjectId nếu truyền id
            try:
                notif = await Notification.get(PydanticObjectId(notification_id))
            except Exception:
                pass

        if not notif:
            return False

        notif.is_read = True
        await notif.save()
        return True

    @staticmethod
    async def mark_all_as_read(user: Optional[User] = None, user_id_param: Optional[str] = None) -> int:
        """Đánh dấu tất cả thông báo của người dùng là đã đọc"""
        if not user and not user_id_param:
            return 0

        targets = ["all"]
        is_admin = False
        if user:
            targets.extend([str(user.id), user.email, user.username])
            if user.role == "admin" or user.username == "admin":
                is_admin = True
        elif user_id_param:
            if user_id_param != "all":
                targets.append(user_id_param)
            try:
                found = await User.get(PydanticObjectId(user_id_param))
                if not found:
                    found = await User.find_one(User.email == user_id_param)
                if not found:
                    found = await User.find_one(User.username == user_id_param)
                if found:
                    targets.extend([str(found.id), found.email, found.username])
                    if found.role == "admin" or found.username == "admin":
                        is_admin = True
            except Exception:
                pass

        if is_admin:
            targets.append("admin")

        notifs = await Notification.find(
            {"user_id": {"$in": list(set(targets))}, "is_read": False}
        ).to_list()

        for n in notifs:
            n.is_read = True
            await n.save()

        return len(notifs)

    @staticmethod
    async def notify_order_status_change(order: Order, new_status: str, tracking_code: Optional[str] = None):
        """Tự động gửi thông báo khi Admin đổi trạng thái đơn hàng"""
        if not order.user_id:
            # Thử tìm user qua số điện thoại nếu user_id là None
            u = await User.find_one(User.phone == order.customer_phone)
            if u:
                order.user_id = str(u.id)

        target_uid = order.user_id or "all"
        ord_code = str(order.id)[-8:].upper()
        status_label = STATUS_TEXT_MAP.get(new_status.lower(), new_status)
        price_formatted = NotificationService.format_currency(order.total_amount)

        tracking_msg = f" Mã vận đơn: {tracking_code}." if tracking_code else ""
        title = f"Cập nhật đơn hàng #{ord_code}: {status_label}"
        message = (
            f"Đơn hàng #{ord_code} (Trị giá {price_formatted}) của bạn đã được cập nhật: "
            f"{status_label}.{tracking_msg} Bấm để xem chi tiết tiến trình đơn hàng."
        )

        return await NotificationService.send_notification(
            user_id=target_uid,
            title=title,
            message=message,
            notification_type="order",
            link="/tai-khoan/orders"
        )

    @staticmethod
    async def notify_order_placed(order: Order):
        """Tự động gửi thông báo khi khách hàng đặt hàng mới thành công"""
        target_uid = order.user_id
        if not target_uid:
            u = await User.find_one(User.phone == order.customer_phone)
            if u:
                target_uid = str(u.id)

        target_uid = target_uid or "all"
        ord_code = str(order.id)[-8:].upper()
        price_formatted = NotificationService.format_currency(order.total_amount)
        item_count = len(order.items) if order.items else 1

        title = f"Đặt hàng thành công #{ord_code}"
        message = (
            f"Kady Sport đã tiếp nhận đơn hàng #{ord_code} gồm {item_count} sản phẩm "
            f"với tổng thanh toán {price_formatted}. Đơn hàng đang được chuẩn bị để đóng gói."
        )

        return await NotificationService.send_notification(
            user_id=target_uid,
            title=title,
            message=message,
            notification_type="order",
            link="/tai-khoan/orders"
        )

notification_service = NotificationService()
