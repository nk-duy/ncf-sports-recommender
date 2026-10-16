import math
import re
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from beanie import PydanticObjectId
from app.models.user import User
from app.models.order import Order
from app.core.security import get_password_hash

class CustomerService:
    @staticmethod
    async def get_customers_with_stats(
        search: Optional[str] = None,
        tier: Optional[str] = None,
        sport: Optional[str] = None,
        region: Optional[str] = None,
        tab: Optional[str] = "all",
        page: int = 1,
        limit: int = 10
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {"role": "user"}
        now = datetime.utcnow()
        
        # 1. Search Filter
        if search and search.strip():
            s = search.strip()
            regex_pattern = re.compile(re.escape(s), re.IGNORECASE)
            query["$or"] = [
                {"full_name": regex_pattern},
                {"email": regex_pattern},
                {"phone": regex_pattern}
            ]
            
        # 2. Tier Filter
        tier_map = {
            "diamond": "Kim Cương",
            "gold": "Vàng",
            "silver": "Bạc",
            "bronze": "Đồng",
            "all": None
        }
        resolved_tier = tier_map.get(tier, tier)
        if resolved_tier:
            query["tier"] = resolved_tier

        # 3. Sport Filter
        sport_map = {
            "running": "Chạy bộ",
            "gym": "Gym",
            "camping": "Camping",
            "football": "Bóng đá"
        }
        resolved_sport = sport_map.get(sport, sport)
        if resolved_sport:
            query["interested_sports"] = {"$regex": resolved_sport, "$options": "i"}

        # 4. Region Filter
        region_map = {
            "hanoi": "Hà Nội",
            "hcm": "Hồ Chí Minh",
            "danang": "Đà Nẵng"
        }
        resolved_region = region_map.get(region, region)
        if resolved_region:
            query["address"] = {"$regex": resolved_region, "$options": "i"}

        # 5. Tab Filter
        thirty_days_ago = now - timedelta(days=30)
        if tab == "vip":
            query["tier"] = {"$in": ["Kim Cương", "Vàng", "Platinum", "VIP"]}
        elif tab == "new":
            query["created_at"] = {"$gte": thirty_days_ago}
        elif tab == "potential":
            query["tier"] = {"$in": ["Vàng", "Bạc"]}
        elif tab == "churn_risk":
            query["tier"] = "Đồng"

        total_customers = await User.find(query).count()
        skip = (page - 1) * limit
        users = await User.find(query).sort("-created_at").skip(skip).limit(limit).to_list()
        
        # Global stats across all users
        all_users = await User.find({"role": "user"}).to_list()
        global_total = len(all_users)
        global_active = 0
        global_vip = 0
        global_new = 0
        global_potential = 0
        global_churn = 0
        global_revenue = 0

        for u in all_users:
            if u.tier in ["Kim Cương", "Vàng", "Platinum", "VIP"]:
                global_vip += 1
            if u.tier in ["Vàng", "Bạc"]:
                global_potential += 1
            if u.created_at and u.created_at >= thirty_days_ago:
                global_new += 1
                
            user_orders = await Order.find(Order.user_id == str(u.id)).to_list()
            user_spent = sum(o.total_amount for o in user_orders)
            global_revenue += user_spent
            
            if user_orders:
                last_order = sorted(user_orders, key=lambda x: x.created_at, reverse=True)[0]
                if (now - last_order.created_at).days <= 30:
                    global_active += 1
                elif (now - last_order.created_at).days >= 60 and u.tier == "Đồng":
                    global_churn += 1
            else:
                if u.tier == "Đồng":
                    global_churn += 1
                    
        clv = global_revenue / global_total if global_total > 0 else 0
        
        # Format customer rows
        customers_data = []
        for u in users:
            user_orders = await Order.find(Order.user_id == str(u.id)).to_list()
            orders_count = len(user_orders)
            spent = sum(o.total_amount for o in user_orders)
            
            last_purchase = "Chưa mua"
            if user_orders:
                last_order = sorted(user_orders, key=lambda x: x.created_at, reverse=True)[0]
                days_ago = (now - last_order.created_at).days
                if days_ago == 0:
                    last_purchase = "Hôm nay"
                elif days_ago == 1:
                    last_purchase = "Hôm qua"
                else:
                    last_purchase = f"{days_ago} ngày trước"
                    
            initials = ""
            name_parts = u.full_name.split() if u.full_name else []
            if len(name_parts) >= 2:
                initials = name_parts[0][0] + name_parts[-1][0]
            elif len(name_parts) == 1:
                initials = name_parts[0][0]
            else:
                initials = u.email[0].upper()
                
            c_tier = u.tier or "Đồng"
            
            customers_data.append({
                "id": str(u.id),
                "name": u.full_name or "Khách hàng",
                "phone": u.phone or "Chưa cập nhật",
                "code": f"#KH-{str(u.id)[-4:].upper()}",
                "email": u.email,
                "address": u.address or "Chưa cập nhật",
                "joinDate": u.created_at.strftime("%d/%m/%Y") if u.created_at else "01/01/2024",
                "initials": initials.upper(),
                "tier": c_tier,
                "sports": u.interested_sports or ["Thể thao chung"],
                "orders": orders_count,
                "spent": spent,
                "lastPurchase": last_purchase,
                "returnRate": "0%",
                "aiProfile": u.ai_profile or "Chưa xác định",
                "aiScore": u.ai_score or 85,
                "shoeSize": u.shoe_size or "41 EU",
                "colors": u.preferred_colors or ["bg-blue-600", "bg-gray-900"],
                "colorNames": "Đen, Xanh dương"
            })

        return {
            "customers": customers_data,
            "pagination": {
                "total": total_customers,
                "page": page,
                "limit": limit,
                "total_pages": math.ceil(total_customers / limit) if limit else 1
            },
            "stats": {
                "total": global_total,
                "active": global_active,
                "vip": global_vip,
                "new": global_new,
                "potential": global_potential,
                "churn_risk": global_churn,
                "clv": clv
            }
        }

    @staticmethod
    async def get_customer_orders(customer_id: str) -> List[Dict[str, Any]]:
        orders = await Order.find(Order.user_id == customer_id).sort("-created_at").to_list()
        result = []
        for o in orders:
            result.append({
                "id": str(o.id),
                "code": f"#ORD-{str(o.id)[-5:].upper()}",
                "created_at": o.created_at.strftime("%d/%m/%Y %H:%M"),
                "items_count": len(o.items),
                "first_item_name": o.items[0].product_name if o.items else "Sản phẩm",
                "total_amount": o.total_amount,
                "status": o.status,
                "payment_method": o.payment_method
            })
        return result

    @staticmethod
    async def create_customer(data: Any) -> User:
        username = data.email.split("@")[0]
        count = 1
        base_username = username
        while await User.find_one(User.username == username):
            username = f"{base_username}{count}"
            count += 1
            
        new_user = User(
            username=username,
            email=data.email,
            hashed_password=get_password_hash("123456"),
            full_name=data.full_name,
            phone=data.phone,
            address=data.address,
            tier=data.tier or "Đồng",
            interested_sports=data.interested_sports or ["Thể thao chung"],
            shoe_size=data.shoe_size or "41 EU",
            preferred_colors=data.preferred_colors or ["bg-blue-600"],
            ai_profile=data.ai_profile or (f"{data.interested_sports[0]} cơ bản" if data.interested_sports else "Thể thao cơ bản"),
            ai_score=85,
            role="user",
            created_at=datetime.utcnow(),
            is_active=True
        )
        await new_user.insert()
        return new_user

    @staticmethod
    async def update_customer(customer_id: str, data: Any) -> Optional[User]:
        try:
            user = await User.get(PydanticObjectId(customer_id))
        except Exception:
            return None
        if not user:
            return None
            
        if data.full_name is not None:
            user.full_name = data.full_name
        if data.phone is not None:
            user.phone = data.phone
        if data.address is not None:
            user.address = data.address
        if data.tier is not None:
            user.tier = data.tier
        if data.interested_sports is not None:
            user.interested_sports = data.interested_sports
        if data.shoe_size is not None:
            user.shoe_size = data.shoe_size
        if data.preferred_colors is not None:
            user.preferred_colors = data.preferred_colors
        if data.ai_profile is not None:
            user.ai_profile = data.ai_profile
            
        await user.save()
        return user

    @staticmethod
    async def delete_customer(customer_id: str) -> bool:
        try:
            user = await User.get(PydanticObjectId(customer_id))
        except Exception:
            return False
        if not user:
            return False
        await user.delete()
        return True

customer_service = CustomerService()
