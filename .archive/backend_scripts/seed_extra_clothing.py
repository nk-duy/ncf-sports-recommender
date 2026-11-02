import asyncio
import sys
import os

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

extra_clothing_products = [
    {
        "product_id": "CLOTH-009",
        "name": "Áo Thun Thể Thao Nữ Cổ Tim",
        "price": 280000,
        "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500&q=80",
        "category": ["Clothing", "Áo thun"],
        "brand": "Nike",
        "rating": 4.5,
        "reviews_count": 65,
        "sizes": ["S", "M", "L"],
        "colors": ["Trắng", "Hồng", "Vàng"],
        "gender": "Nữ"
    },
    {
        "product_id": "CLOTH-010",
        "name": "Quần Short Thể Thao Nữ Năng Động",
        "price": 220000,
        "image_url": "https://images.unsplash.com/photo-1599058945522-28d584b6f4ff?w=500&q=80",
        "category": ["Clothing", "Quần short"],
        "brand": "Adidas",
        "rating": 4.2,
        "reviews_count": 92,
        "sizes": ["S", "M", "L"],
        "colors": ["Đen", "Trắng"],
        "gender": "Nữ"
    },
    {
        "product_id": "CLOTH-011",
        "name": "Áo Khoác Nỉ Thể Thao Nam Mùa Đông",
        "price": 750000,
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        "category": ["Clothing", "Áo khoác"],
        "brand": "Puma",
        "rating": 4.8,
        "reviews_count": 140,
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["Xám", "Đen"],
        "gender": "Nam"
    },
    {
        "product_id": "CLOTH-012",
        "name": "Bộ Đồ Thể Thao Nam Chạy Bộ",
        "price": 620000,
        "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
        "category": ["Clothing", "Đồ tập"],
        "brand": "Under Armour",
        "rating": 4.6,
        "reviews_count": 110,
        "sizes": ["M", "L", "XL"],
        "colors": ["Xanh đen", "Xám"],
        "gender": "Nam"
    },
    {
        "product_id": "CLOTH-013",
        "name": "Quần Dài Legging Nữ Tập Gym",
        "price": 350000,
        "image_url": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&q=80",
        "category": ["Clothing", "Quần dài"],
        "brand": "Lululemon",
        "rating": 4.9,
        "reviews_count": 280,
        "sizes": ["XS", "S", "M", "L"],
        "colors": ["Đen", "Xanh navy"],
        "gender": "Nữ"
    },
    {
        "product_id": "CLOTH-014",
        "name": "Áo Thun Nam Sát Nách Thể Thao",
        "price": 180000,
        "image_url": "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&q=80",
        "category": ["Clothing", "Áo thun"],
        "brand": "SportsAI",
        "rating": 4.1,
        "reviews_count": 45,
        "sizes": ["M", "L", "XL"],
        "colors": ["Trắng", "Xám"],
        "gender": "Nam"
    },
    {
        "product_id": "CLOTH-015",
        "name": "Quần Jogger Nam Vải Nỉ",
        "price": 420000,
        "image_url": "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80",
        "category": ["Clothing", "Quần dài"],
        "brand": "Nike",
        "rating": 4.7,
        "reviews_count": 190,
        "sizes": ["M", "L", "XL", "XXL"],
        "colors": ["Đen", "Xám đậm"],
        "gender": "Nam"
    },
    {
        "product_id": "CLOTH-016",
        "name": "Áo Khoác Chống Nắng UV Thể Thao Nữ",
        "price": 550000,
        "image_url": "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500&q=80",
        "category": ["Clothing", "Áo khoác"],
        "brand": "Uniqlo",
        "rating": 4.9,
        "reviews_count": 315,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Xanh dương", "Hồng nhạt"],
        "gender": "Nữ"
    },
    {
        "product_id": "CLOTH-017",
        "name": "Áo Lót Thể Thao Nữ Medium Support",
        "price": 450000,
        "image_url": "https://images.unsplash.com/photo-1583496661160-c588c4c1d6b0?w=500&q=80",
        "category": ["Clothing", "Đồ tập"],
        "brand": "Nike",
        "rating": 4.6,
        "reviews_count": 150,
        "sizes": ["S", "M", "L"],
        "colors": ["Đen", "Trắng", "Đỏ"],
        "gender": "Nữ"
    },
    {
        "product_id": "CLOTH-018",
        "name": "Quần Bơi Thể Thao Nam",
        "price": 250000,
        "image_url": "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
        "category": ["Clothing", "Quần short"],
        "brand": "Speedo",
        "rating": 4.5,
        "reviews_count": 80,
        "sizes": ["S", "M", "L", "XL"],
        "colors": ["Đen", "Xanh navy"],
        "gender": "Nam"
    },
    {
        "product_id": "CLOTH-019",
        "name": "Áo Hoodie Thể Thao Unisex",
        "price": 850000,
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        "category": ["Clothing", "Áo khoác"],
        "brand": "Champion",
        "rating": 4.8,
        "reviews_count": 420,
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Xám", "Đen", "Trắng"],
        "gender": "Unisex"
    },
    {
        "product_id": "CLOTH-020",
        "name": "Tất Thể Thao Chống Trượt (Set 3 Đôi)",
        "price": 150000,
        "image_url": "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&q=80",
        "category": ["Clothing", "Phụ kiện"],
        "brand": "Adidas",
        "rating": 4.9,
        "reviews_count": 550,
        "sizes": ["Free Size"],
        "colors": ["Trắng", "Đen", "Xám"],
        "gender": "Unisex"
    }
]

async def seed_extra_clothing():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    inserted = 0
    for item in extra_clothing_products:
        existing = await Product.find_one(Product.product_id == item["product_id"])
        if not existing:
            new_product = Product(**item)
            await new_product.insert()
            inserted += 1
            
    print(f"Seeding completed. Inserted {inserted} EXTRA clothing products.")

if __name__ == "__main__":
    asyncio.run(seed_extra_clothing())
