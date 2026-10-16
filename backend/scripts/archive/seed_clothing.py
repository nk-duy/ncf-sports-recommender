import asyncio
import sys
import os

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

clothing_products = [
    {
        "product_id": "CLOTH-001",
        "name": "Áo Thun Thể Thao Nam Dry-Fit",
        "price": 350000,
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
        "category": ["Clothing", "Áo thun"],
        "brand": "SportsAI",
        "rating": 4.8,
        "reviews_count": 120,
        "sizes": ["M", "L", "XL"],
        "colors": ["Đen", "Xanh", "Trắng"],
        "gender": "Nam"
    },
    {
        "product_id": "CLOTH-002",
        "name": "Quần Short Tập Gym Nam Kháng Khuẩn",
        "price": 250000,
        "image_url": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
        "category": ["Clothing", "Quần short"],
        "brand": "SportsAI",
        "rating": 4.5,
        "reviews_count": 85,
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["Đen", "Xám"],
        "gender": "Nam"
    },
    {
        "product_id": "CLOTH-003",
        "name": "Áo Khoác Gió Chống Nước Phản Quang",
        "price": 850000,
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        "category": ["Clothing", "Áo khoác"],
        "brand": "Nike",
        "rating": 4.9,
        "reviews_count": 230,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Đen", "Neon"],
        "gender": "Unisex"
    },
    {
        "product_id": "CLOTH-004",
        "name": "Bộ Đồ Yoga Nữ Cao Cấp Co Giãn 4 Chiều",
        "price": 550000,
        "image_url": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80",
        "category": ["Clothing", "Đồ tập"],
        "brand": "Adidas",
        "rating": 4.7,
        "reviews_count": 310,
        "sizes": ["S", "M", "L"],
        "colors": ["Hồng", "Tím", "Đen"],
        "gender": "Nữ"
    },
    {
        "product_id": "CLOTH-005",
        "name": "Áo Bra Thể Thao Nữ Nâng Đỡ Tối Đa",
        "price": 320000,
        "image_url": "https://images.unsplash.com/photo-1583496661160-c588c4c1d6b0?w=500&q=80",
        "category": ["Clothing", "Đồ tập"],
        "brand": "Puma",
        "rating": 4.6,
        "reviews_count": 150,
        "sizes": ["S", "M", "L"],
        "colors": ["Đen", "Trắng"],
        "gender": "Nữ"
    },
    {
        "product_id": "CLOTH-006",
        "name": "Quần Dài Chạy Bộ Nam Thoáng Khí",
        "price": 480000,
        "image_url": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80",
        "category": ["Clothing", "Quần dài"],
        "brand": "Under Armour",
        "rating": 4.4,
        "reviews_count": 90,
        "sizes": ["M", "L", "XL"],
        "colors": ["Đen", "Xanh đen"],
        "gender": "Nam"
    },
    {
        "product_id": "CLOTH-007",
        "name": "Áo Thun Polo Thể Thao Thấm Hút",
        "price": 420000,
        "image_url": "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80",
        "category": ["Clothing", "Áo thun"],
        "brand": "Lacoste",
        "rating": 4.8,
        "reviews_count": 420,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Trắng", "Xanh navy"],
        "gender": "Nam"
    },
    {
        "product_id": "CLOTH-008",
        "name": "Áo Croptop Thể Thao Nữ Tay Dài",
        "price": 390000,
        "image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80",
        "category": ["Clothing", "Áo thun"],
        "brand": "Nike",
        "rating": 4.5,
        "reviews_count": 115,
        "sizes": ["S", "M"],
        "colors": ["Xám", "Hồng"],
        "gender": "Nữ"
    }
]

async def seed_clothing():
    # Khởi tạo DB connection
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    inserted = 0
    for item in clothing_products:
        existing = await Product.find_one(Product.product_id == item["product_id"])
        if not existing:
            new_product = Product(**item)
            await new_product.insert()
            inserted += 1
            
    print(f"Seeding completed. Inserted {inserted} clothing products.")

if __name__ == "__main__":
    asyncio.run(seed_clothing())
