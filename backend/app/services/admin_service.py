from typing import Dict, Any
from app.models.order import Order
from app.models.user import User
from app.models.product import Product

class AdminService:
    @staticmethod
    async def get_dashboard_stats() -> Dict[str, Any]:
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

admin_service = AdminService()
