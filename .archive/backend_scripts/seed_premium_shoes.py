import asyncio
import os
import sys

# Thêm đường dẫn backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

shoes_data = [
    {
        "product_id": "NIKE-RED-01",
        "name": "Nike Air Max 270 Đỏ Nổi Bật",
        "price": 3200000,
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
        "category": ["Giày Chạy Bộ (Running)", "Sneaker Thể Thao / Lifestyle"],
        "brand": "Nike",
        "rating": 4.8,
        "reviews_count": 1250,
        "sizes": ["39", "40", "41", "42"],
        "colors": ["Red"]
    },
    {
        "product_id": "NIKE-AF1-WH",
        "name": "Nike Air Force 1 '07 Classic Trắng",
        "price": 2700000,
        "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Nike",
        "rating": 4.9,
        "reviews_count": 3400,
        "sizes": ["36", "37", "38", "39", "40", "41", "42", "43"],
        "colors": ["White"]
    },
    {
        "product_id": "NIKE-RUN-BLK",
        "name": "Nike Revolution 6 Next Nature",
        "price": 1500000,
        "image_url": "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=800&auto=format&fit=crop",
        "category": ["Giày Chạy Bộ (Running)", "Tập Gym & Fitness"],
        "brand": "Nike",
        "rating": 4.5,
        "reviews_count": 890,
        "sizes": ["40", "41", "42", "43", "44"],
        "colors": ["Black", "Grey"]
    },
    {
        "product_id": "ADI-UB-BLU",
        "name": "Adidas Ultraboost Light 2024",
        "price": 4500000,
        "image_url": "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=800&auto=format&fit=crop",
        "category": ["Giày Chạy Bộ (Running)"],
        "brand": "Adidas",
        "rating": 4.9,
        "reviews_count": 2100,
        "sizes": ["39", "40", "41", "42", "43"],
        "colors": ["Blue", "White"]
    },
    {
        "product_id": "PUMA-RSX-01",
        "name": "Puma RS-X Toys Đa Sắc",
        "price": 2800000,
        "image_url": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Puma",
        "rating": 4.6,
        "reviews_count": 650,
        "sizes": ["37", "38", "39", "40", "41"],
        "colors": ["White", "Red", "Blue"]
    },
    {
        "product_id": "NB-574-GRY",
        "name": "New Balance 574 Core Xám Truyền Thống",
        "price": 2200000,
        "image_url": "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle", "Tập Gym & Fitness"],
        "brand": "New Balance",
        "rating": 4.7,
        "reviews_count": 1420,
        "sizes": ["38", "39", "40", "41", "42"],
        "colors": ["Grey", "White"]
    },
    {
        "product_id": "VANS-OLD-BLK",
        "name": "Vans Old Skool Classic Black/White",
        "price": 1800000,
        "image_url": "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Vans",
        "rating": 4.8,
        "reviews_count": 5200,
        "sizes": ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
        "colors": ["Black", "White"]
    },
    {
        "product_id": "CONV-1970-BLK",
        "name": "Converse Chuck Taylor All Star 1970s",
        "price": 1900000,
        "image_url": "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Converse",
        "rating": 4.7,
        "reviews_count": 3100,
        "sizes": ["36", "37", "38", "39", "40", "41", "42"],
        "colors": ["Black", "White"]
    },
    {
        "product_id": "ADI-YEEZY-350",
        "name": "Adidas Yeezy Boost 350 V2 Zebra",
        "price": 6500000,
        "image_url": "https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Adidas",
        "rating": 4.9,
        "reviews_count": 4800,
        "sizes": ["40", "41", "42", "43", "44"],
        "colors": ["White", "Black"]
    },
    {
        "product_id": "ASICS-GEL-BLU",
        "name": "Asics GEL-Kayano 29 Chạy Bộ Đường Dài",
        "price": 3800000,
        "image_url": "https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop",
        "category": ["Giày Chạy Bộ (Running)", "Chạy Trail & Dã Ngoại"],
        "brand": "Asics",
        "rating": 4.8,
        "reviews_count": 950,
        "sizes": ["39", "40", "41", "42", "43", "44"],
        "colors": ["Blue", "Yellow"]
    },
    {
        "product_id": "NIKE-JD1-CH",
        "name": "Air Jordan 1 Retro High OG Chicago",
        "price": 8500000,
        "image_url": "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Nike",
        "rating": 5.0,
        "reviews_count": 8900,
        "sizes": ["41", "42", "43", "44", "45"],
        "colors": ["Red", "White", "Black"]
    },
    {
        "product_id": "NIKE-DUNK-GRN",
        "name": "Nike Dunk Low Retro Spartan Green",
        "price": 3500000,
        "image_url": "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Nike",
        "rating": 4.8,
        "reviews_count": 2200,
        "sizes": ["36", "37", "38", "39", "40", "41"],
        "colors": ["Green", "White"]
    },
    {
        "product_id": "ADI-NMD-YEL",
        "name": "Adidas NMD R1 Vàng Đen",
        "price": 2900000,
        "image_url": "https://images.unsplash.com/photo-1520256862855-398228c41684?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle", "Tập Gym & Fitness"],
        "brand": "Adidas",
        "rating": 4.6,
        "reviews_count": 1150,
        "sizes": ["38", "39", "40", "41", "42"],
        "colors": ["Yellow", "Black"]
    },
    {
        "product_id": "NIKE-AIR-PNK",
        "name": "Nike Air Max 97 Hồng Nhạt",
        "price": 3800000,
        "image_url": "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Nike",
        "rating": 4.7,
        "reviews_count": 870,
        "sizes": ["36", "37", "38", "39"],
        "colors": ["Pink"]
    },
    {
        "product_id": "NIKE-JOY-GRN",
        "name": "Nike Joyride Run Flyknit Xanh Neon",
        "price": 3100000,
        "image_url": "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&auto=format&fit=crop",
        "category": ["Giày Chạy Bộ (Running)", "Tập Gym & Fitness"],
        "brand": "Nike",
        "rating": 4.5,
        "reviews_count": 640,
        "sizes": ["39", "40", "41", "42", "43"],
        "colors": ["Green"]
    },
    {
        "product_id": "NB-327-WHT",
        "name": "New Balance 327 Trắng Xám Thanh Lịch",
        "price": 2500000,
        "image_url": "https://images.unsplash.com/photo-1595461135849-bf08893fdc2c?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "New Balance",
        "rating": 4.8,
        "reviews_count": 1340,
        "sizes": ["36", "37", "38", "39", "40"],
        "colors": ["White", "Grey"]
    },
    {
        "product_id": "ADI-STAN-BLK",
        "name": "Adidas Stan Smith All Black",
        "price": 2100000,
        "image_url": "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Adidas",
        "rating": 4.7,
        "reviews_count": 2500,
        "sizes": ["38", "39", "40", "41", "42", "43", "44"],
        "colors": ["Black"]
    },
    {
        "product_id": "NIKE-PEG-BLU",
        "name": "Nike Air Zoom Pegasus 39 Xanh Navy",
        "price": 2800000,
        "image_url": "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=800&auto=format&fit=crop",
        "category": ["Giày Chạy Bộ (Running)"],
        "brand": "Nike",
        "rating": 4.9,
        "reviews_count": 1850,
        "sizes": ["40", "41", "42", "43", "44"],
        "colors": ["Blue", "Navy"]
    },
    {
        "product_id": "SALO-SPEED-BLK",
        "name": "Salomon Speedcross 6 Chạy Trail Siêu Đỉnh",
        "price": 3600000,
        "image_url": "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=800&auto=format&fit=crop",
        "category": ["Chạy Trail & Dã Ngoại"],
        "brand": "Salomon",
        "rating": 4.8,
        "reviews_count": 520,
        "sizes": ["40", "41", "42", "43", "44"],
        "colors": ["Black"]
    },
    {
        "product_id": "PUMA-SUEDE-RED",
        "name": "Puma Suede Classic Đỏ Phong Cách",
        "price": 1800000,
        "image_url": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop",
        "category": ["Sneaker Thể Thao / Lifestyle"],
        "brand": "Puma",
        "rating": 4.5,
        "reviews_count": 780,
        "sizes": ["37", "38", "39", "40", "41", "42"],
        "colors": ["Red", "White"]
    }
]

async def seed_data():
    print("Initializing DB...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(database=client[settings.MONGODB_DB_NAME], document_models=[Product])
    
    print("Deleting old data...")
    await Product.find_all().delete()
    
    print("Inserting premium shoes...")
    products = [Product(**data) for data in shoes_data]
    await Product.insert_many(products)
    
    print("DONE! Website is ready.")

if __name__ == "__main__":
    asyncio.run(seed_data())
