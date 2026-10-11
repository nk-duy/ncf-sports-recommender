from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional, Dict, Any
from app.api.deps import get_current_user
from app.models.user import User
from app.models.order import Order
from pydantic import BaseModel
from datetime import datetime
import math

router = APIRouter()

class CustomerResponse(BaseModel):
    id: str
    name: str
    phone: Optional[str] = None
    code: str
    email: str
    address: Optional[str] = None
    joinDate: str
    initials: str
    tier: str
    sports: List[str]
    orders: int
    spent: float
    lastPurchase: Optional[str] = None
    returnRate: str
    aiProfile: str
    aiScore: int
    shoeSize: Optional[str] = None
    colors: List[str]
    colorNames: str

@router.get("/", response_model=Dict[str, Any])
async def get_customers(
    current_user: Optional[Any] = None,
    search: Optional[str] = None,
    tier: Optional[str] = None,
    sport: Optional[str] = None,
    region: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100)
):
    # if current_user.role != "admin":
    #     raise HTTPException(status_code=403, detail="Not enough permissions")

    query = {"role": "user"}
    
    if search:
        query["$or"] = [
            {"full_name": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"phone": {"$regex": search, "$options": "i"}}
        ]
        
    if tier:
        query["tier"] = tier

    # TODO: Handle sport and region filters more robustly if needed
    
    total_customers = await User.find(query).count()
    skip = (page - 1) * limit
    
    users = await User.find(query).skip(skip).limit(limit).to_list()
    
    customers_data = []
    total_vip = 0
    active_count = 0
    
    # Calculate global stats (simple version)
    all_users = await User.find(query).to_list()
    global_active = 0
    global_vip = 0
    global_revenue = 0
    
    for u in all_users:
        if u.tier in ["Kim Cương", "Vàng", "Platinum", "VIP"]:
            global_vip += 1
            
        user_orders = await Order.find(Order.user_id == str(u.id)).to_list()
        global_revenue += sum(o.total_amount for o in user_orders)
        
        if user_orders:
            last_order = sorted(user_orders, key=lambda x: x.created_at, reverse=True)[0]
            if (datetime.utcnow() - last_order.created_at).days <= 30:
                global_active += 1
                
    clv = global_revenue / total_customers if total_customers > 0 else 0
    
    for u in users:
        user_orders = await Order.find(Order.user_id == str(u.id)).to_list()
        orders_count = len(user_orders)
        spent = sum(o.total_amount for o in user_orders)
        
        last_purchase = "Chưa mua"
        if user_orders:
            last_order = sorted(user_orders, key=lambda x: x.created_at, reverse=True)[0]
            days_ago = (datetime.utcnow() - last_order.created_at).days
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
            "joinDate": u.created_at.strftime("%d/%m/%Y"),
            "initials": initials.upper(),
            "tier": c_tier,
            "sports": u.interested_sports or ["Thể thao chung"],
            "orders": orders_count,
            "spent": spent,
            "lastPurchase": last_purchase,
            "returnRate": "0%",
            "aiProfile": u.ai_profile or "Chưa xác định",
            "aiScore": u.ai_score or 50,
            "shoeSize": u.shoe_size or "40 EU",
            "colors": u.preferred_colors or ["bg-gray-900"],
            "colorNames": "Đen"
        })

    return {
        "customers": customers_data,
        "pagination": {
            "total": total_customers,
            "page": page,
            "limit": limit,
            "total_pages": math.ceil(total_customers / limit) if limit else 0
        },
        "stats": {
            "total": total_customers,
            "active": global_active,
            "vip": global_vip,
            "clv": clv
        }
    }
