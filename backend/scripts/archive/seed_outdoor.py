import asyncio
import sys
import os
import random

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

outdoor_products = [
    # Tents (Lều)
    {
        "product_id": "OUT-TENT-001",
        "name": "Lều Cắm Trại Tự Bung 4 Người Cao Cấp NatureHike",
        "price": 1450000,
        "image_url": "https://images.unsplash.com/photo-1525811902-f2342640856e?w=500&q=80",
        "category": ["Ngoài trời", "Lều", "Camping Cắm Trại"],
        "brand": "NatureHike",
        "rating": 4.8,
        "reviews_count": 215,
        "sizes": ["4 Người"],
        "colors": ["Xanh Rêu", "Cam"],
        "stock": 45,
        "description": "Lều tự bung chỉ trong 3 giây. Chống mưa tốt với lớp phủ PU3000mm. Kích thước rộng rãi cho cả gia đình."
    },
    {
        "product_id": "OUT-TENT-002",
        "name": "Lều Cắm Trại Dã Ngoại Siêu Nhẹ 2 Người",
        "price": 850000,
        "image_url": "https://images.unsplash.com/photo-1504280390227-331ef29b4cb6?w=500&q=80",
        "category": ["Ngoài trời", "Lều", "Leo Núi / Trek"],
        "brand": "Coleman",
        "rating": 4.6,
        "reviews_count": 132,
        "sizes": ["2 Người"],
        "colors": ["Xanh Dương", "Xám"],
        "stock": 30,
        "description": "Lều siêu nhẹ dành cho các chuyến trekking đường dài. Khung hợp kim nhôm chắc chắn, trọng lượng chỉ 1.5kg."
    },
    
    # Backpacks (Balo)
    {
        "product_id": "OUT-BAG-001",
        "name": "Balo Trekking Leo Núi Deuter 50L+10",
        "price": 2550000,
        "image_url": "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=500&q=80",
        "category": ["Ngoài trời", "Balo", "Leo Núi / Trek"],
        "brand": "Deuter",
        "rating": 4.9,
        "reviews_count": 340,
        "sizes": ["50L", "65L"],
        "colors": ["Đen", "Đỏ"],
        "stock": 20,
        "description": "Balo trợ lực xuất sắc của Deuter. Có ngăn đựng túi nước chuyên dụng và áo trùm mưa đi kèm."
    },
    {
        "product_id": "OUT-BAG-002",
        "name": "Balo Dã Ngoại Chống Nước Osprey 30L",
        "price": 1850000,
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
        "category": ["Ngoài trời", "Balo", "Du Lịch Phượt"],
        "brand": "Osprey",
        "rating": 4.7,
        "reviews_count": 189,
        "sizes": ["30L"],
        "colors": ["Xanh Lục", "Xanh Dương"],
        "stock": 55,
        "description": "Phù hợp cho các chuyến đi ngắn ngày hoặc chạy trail. Kháng nước hoàn toàn với khóa kéo YKK."
    },

    # Hiking Shoes (Giày Leo Núi)
    {
        "product_id": "OUT-SHOE-001",
        "name": "Giày Leo Núi Cổ Thấp Chống Nước Salomon",
        "price": 3100000,
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        "category": ["Ngoài trời", "Giày Leo Núi", "Leo Núi / Trek"],
        "brand": "Salomon",
        "rating": 4.9,
        "reviews_count": 512,
        "sizes": ["39", "40", "41", "42", "43"],
        "colors": ["Đen Xám", "Nâu"],
        "stock": 80,
        "description": "Sử dụng công nghệ màng Gore-Tex chống nước. Đế cao su Contagrip bám đường cực tốt trên mọi địa hình."
    },
    {
        "product_id": "OUT-SHOE-002",
        "name": "Giày Chạy Trail Siêu Trọng Hoka Speedgoat 5",
        "price": 3800000,
        "image_url": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80",
        "category": ["Ngoài trời", "Giày Leo Núi", "Chạy Trail"],
        "brand": "Hoka",
        "rating": 4.8,
        "reviews_count": 290,
        "sizes": ["40", "41", "42", "43", "44"],
        "colors": ["Cam neon", "Xanh dương"],
        "stock": 42,
        "description": "Vua của các giải chạy trail đường dài. Bộ đệm êm ái tối đa giúp giảm mỏi cơ hiệu quả."
    },

    # Equipments (Dụng cụ)
    {
        "product_id": "OUT-EQ-001",
        "name": "Bếp Ga Dã Ngoại Gấp Gọn Mini Fire-Maple",
        "price": 450000,
        "image_url": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500&q=80",
        "category": ["Ngoài trời", "Dụng cụ", "Camping Cắm Trại"],
        "brand": "Fire-Maple",
        "rating": 4.5,
        "reviews_count": 87,
        "sizes": ["One Size"],
        "colors": ["Bạc"],
        "stock": 100,
        "description": "Bếp ga mini siêu nhẹ chỉ 120g, gấp gọn vừa lòng bàn tay. Công suất 3000W đun sôi 1L nước trong 3 phút."
    },
    {
        "product_id": "OUT-EQ-002",
        "name": "Đèn Pin Cắm Trại Năng Lượng Mặt Trời",
        "price": 280000,
        "image_url": "https://images.unsplash.com/photo-1522047867202-60144f0b2f90?w=500&q=80",
        "category": ["Ngoài trời", "Dụng cụ", "Camping Cắm Trại"],
        "brand": "Black Diamond",
        "rating": 4.4,
        "reviews_count": 156,
        "sizes": ["One Size"],
        "colors": ["Vàng", "Đen"],
        "stock": 150,
        "description": "Đèn đa năng có thể sạc bằng năng lượng mặt trời. Hỗ trợ cổng USB sạc ngược cho điện thoại."
    },
    {
        "product_id": "OUT-EQ-003",
        "name": "Bộ Nồi Nhôm Dã Ngoại 4 Món",
        "price": 320000,
        "image_url": "https://images.unsplash.com/photo-1549495379-37f2bd8fc964?w=500&q=80",
        "category": ["Ngoài trời", "Dụng cụ", "Camping Cắm Trại"],
        "brand": "NatureHike",
        "rating": 4.7,
        "reviews_count": 210,
        "sizes": ["One Size"],
        "colors": ["Ghi xám"],
        "stock": 85,
        "description": "Hợp kim nhôm Anodized siêu nhẹ, chống dính tốt, dễ dàng làm sạch, đóng gói gọn gàng."
    }
]

async def seed_outdoor_products():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    
    await init_beanie(database=db, document_models=[Product])
    
    # Optional: Xóa dữ liệu cũ nếu muốn (chỉ xóa các product id bắt đầu bằng OUT-)
    # Tuy nhiên ta dùng upsert qua lặp từng item để update or insert
    inserted = 0
    updated = 0
    
    for prod_data in outdoor_products:
        existing = await Product.find_one({"product_id": prod_data["product_id"]})
        if existing:
            # Update
            for k, v in prod_data.items():
                setattr(existing, k, v)
            await existing.save()
            updated += 1
        else:
            # Insert
            new_prod = Product(**prod_data)
            await new_prod.insert()
            inserted += 1
            
    print(f"✅ Outdoor Seeding Complete! Inserted: {inserted}, Updated: {updated}")

if __name__ == "__main__":
    asyncio.run(seed_outdoor_products())
