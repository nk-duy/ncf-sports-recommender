import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.user import User
from app.models.order import Order
from app.core.security import get_password_hash
import random

async def seed_customers():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client[settings.MONGODB_DB_NAME]
    
    await init_beanie(database=database, document_models=[User, Order])
    
    print("Seeding customers...")
    
    existing_users = await User.find({"role": "user"}).to_list()
    
    mock_data = [
      {
        "full_name": "Nguyễn Văn An",
        "phone": "0912.345.456",
        "email": "an.nguyen@gmail.com",
        "address": "Tầng 12, Tòa Keangnam Landmark 72, Nam Từ Liêm, Hà Nội",
        "tier": "Kim Cương",
        "interested_sports": ["Chạy bộ", "Marathon"],
        "ai_profile": "Chạy bộ Marathon",
        "ai_score": 98,
        "shoe_size": "42 EU / 8.5 US",
        "preferred_colors": ["bg-blue-600", "bg-white", "bg-gray-900"],
      },
      {
        "full_name": "Trần Thị Mai",
        "phone": "0988.112.233",
        "email": "mai.tran@gmail.com",
        "address": "Quận 1, TP. Hồ Chí Minh",
        "tier": "Vàng",
        "interested_sports": ["Yoga", "Gym"],
        "ai_profile": "Yoga Cơ bản",
        "ai_score": 95,
        "shoe_size": "38 EU / 7 US",
        "preferred_colors": ["bg-pink-500", "bg-gray-900"],
      },
      {
        "full_name": "Lê Hoàng Nam",
        "phone": "0903.789.012",
        "email": "nam.le@gmail.com",
        "address": "Hải Châu, Đà Nẵng",
        "tier": "Vàng",
        "interested_sports": ["Camping", "Dã ngoại"],
        "ai_profile": "Dã ngoại Gia đình",
        "ai_score": 92,
        "shoe_size": "43 EU / 9.5 US",
        "preferred_colors": ["bg-green-600", "bg-gray-900"],
      },
      {
        "full_name": "Phạm Minh Đức",
        "phone": "0934.321.654",
        "email": "duc.pham@gmail.com",
        "address": "Thanh Xuân, Hà Nội",
        "tier": "Bạc",
        "interested_sports": ["Gym", "Kháng lực"],
        "ai_profile": "Thể hình Cơ bản",
        "ai_score": 88,
        "shoe_size": "41 EU / 8 US",
        "preferred_colors": ["bg-gray-900", "bg-white"],
      },
      {
        "full_name": "Vũ Hoàng Yến",
        "phone": "0971.654.987",
        "email": "yen.vu@gmail.com",
        "address": "Quận 7, TP. Hồ Chí Minh",
        "tier": "Kim Cương",
        "interested_sports": ["Trail Running", "Giày"],
        "ai_profile": "Trail Running Nâng cao",
        "ai_score": 96,
        "shoe_size": "39 EU / 7.5 US",
        "preferred_colors": ["bg-orange-500", "bg-gray-500"],
      },
      {
        "full_name": "Đặng Quốc Bảo",
        "phone": "0918.999.321",
        "email": "bao.dang@gmail.com",
        "address": "Gò Vấp, TP. Hồ Chí Minh",
        "tier": "Đồng",
        "interested_sports": ["Quần áo"],
        "ai_profile": "Thể thao Chung",
        "ai_score": 75,
        "shoe_size": "40 EU / 7.5 US",
        "preferred_colors": ["bg-blue-500", "bg-gray-900"],
      }
    ]

    if not existing_users:
        # Create these exactly
        for d in mock_data:
            user = User(
                username=d["email"].split('@')[0],
                email=d["email"],
                hashed_password=get_password_hash("password123"),
                full_name=d["full_name"],
                phone=d["phone"],
                address=d["address"],
                tier=d["tier"],
                interested_sports=d["interested_sports"],
                ai_profile=d["ai_profile"],
                ai_score=d["ai_score"],
                shoe_size=d["shoe_size"],
                preferred_colors=d["preferred_colors"],
                role="user"
            )
            await user.insert()
            existing_users.append(user)

    VN_NAMES = [
        "Nguyễn Văn An", "Trần Thị Mai", "Lê Hoàng Nam", "Phạm Minh Đức", "Vũ Hoàng Yến",
        "Đặng Quốc Bảo", "Bùi Thành Long", "Hoàng Thị Thu", "Nguyễn Tiến Dũng", "Trịnh Như Quỳnh",
        "Đỗ Trường Sơn", "Dương Thanh Tùng", "Hồ Ngọc Hà", "Phạm Hải Đăng", "Lê Ngọc Linh",
        "Vũ Đức Anh", "Trần Việt Hoàng", "Nguyễn Thu Hương", "Bùi Duy Khánh", "Đặng Thùy Trang"
    ]

    print(f"Updating {len(existing_users)} users with mock customer data...")
    for idx, user in enumerate(existing_users):
        # Pick a random mock data template
        template = random.choice(mock_data)
        
        if not user.full_name or "Amazon Shopper" in user.full_name or "khachhang" in user.full_name.lower():
            user.full_name = VN_NAMES[idx % len(VN_NAMES)]
            
        user.phone = template["phone"]
        user.address = template["address"]
        user.tier = template["tier"]
        user.interested_sports = template["interested_sports"]
        user.ai_profile = template["ai_profile"]
        user.ai_score = template["ai_score"]
        user.shoe_size = template["shoe_size"]
        user.preferred_colors = template["preferred_colors"]
        
        await user.save()
        
        # Ensure they have some orders
        user_orders_count = await Order.find({"user_id": str(user.id)}).count()
        if user_orders_count < 2:
            num_orders = random.randint(2, 6)
            for _ in range(num_orders):
                amount = random.randint(500000, 3000000)
                order = Order(
                    customer_name=user.full_name or "Khách hàng",
                    customer_phone=user.phone or "",
                    customer_address=user.address or "",
                    payment_method="COD",
                    items=[],
                    total_amount=amount,
                    status="completed",
                    user_id=str(user.id)
                )
                await order.insert()
                
    print("Seeded successfully!")

if __name__ == "__main__":
    import sys
    if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    asyncio.run(seed_customers())
