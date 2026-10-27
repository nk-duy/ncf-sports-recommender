from typing import Dict, Any
from app.models.order import Order
from app.models.user import User
from app.models.product import Product
from app.core.cache import cache_response, fast_cache

class AdminService:
    @staticmethod
    @cache_response(ttl=300, prefix="dashboard_stats:summary")
    async def get_dashboard_stats() -> Dict[str, Any]:
        """Thống kê tổng quan quản trị (Được lưu Cache 5 phút để bảo vệ database)"""
        total_users = await User.count()
        total_products = await Product.count()
        total_orders = await Order.count()
        
        # Calculate total revenue
        orders = await Order.find_all().to_list()
        total_revenue = sum(order.total_amount for order in orders)
        
        # Calculate pending orders
        pending_orders = len([o for o in orders if o.status == "pending"])
        
        return {
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "pending_orders": pending_orders
        }

    @staticmethod
    async def invalidate_dashboard_cache():
        """Xóa cache thống kê dashboard khi có đơn hàng mới hoặc cập nhật trạng thái"""
        await fast_cache.invalidate_prefix("dashboard_stats:")

admin_service = AdminService()
