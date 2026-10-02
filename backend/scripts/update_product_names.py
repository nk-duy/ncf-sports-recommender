import sys
import os
import asyncio
import random

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

NAMES = {
    "shoes": [
        "Giày Chạy Bộ Nam Siêu Nhẹ", "Giày Tập Gym Đa Năng", "Giày Chạy Địa Hình Trail",
        "Giày Sneaker Thời Trang", "Giày Bóng Rổ Cổ Cao", "Giày Cầu Lông Chuyên Nghiệp",
        "Giày Đá Bóng Đinh Dăm", "Giày Đi Bộ Êm Ái", "Giày Thể Thao Nữ Bền Bỉ",
        "Giày Tennis Chống Trượt"
    ],
    "clothing": [
        "Áo Thun Thể Thao Cổ Tròn", "Quần Short Tập Gym", "Bộ Đồ Tập Yoga Nữ",
        "Áo Khoác Gió Chống Nước", "Quần Jogger Thể Thao", "Áo Bra Tập Gym Nữ",
        "Áo Polo Thể Thao Nam", "Bộ Quần Áo Bóng Đá", "Quần Legging Tập Thể Dục",
        "Áo Giữ Nhiệt Mùa Đông"
    ],
    "outdoor": [
        "Lều Cắm Trại 2-3 Người Chống Nước", "Balo Leo Núi Trekking 50L",
        "Bếp Ga Dã Ngoại Gấp Gọn", "Túi Ngủ Cắm Trại Chịu Lạnh",
        "Đèn Pin Đội Đầu Siêu Sáng", "Bộ Nồi Nhôm Dã Ngoại Siêu Nhẹ",
        "Ghế Xếp Câu Cá Nhỏ Gọn", "Thảm Trải Cắm Trại Chống Thấm",
        "Gậy Leo Núi Hợp Kim Nhôm", "Bình Nước Thể Thao Giữ Nhiệt 1L"
    ]
}

ADJECTIVES = ["Cao Cấp", "Siêu Bền", "Chính Hãng", "Mẫu Mới", "Thế Hệ Mới", "Phiên Bản Giới Hạn", "PRO", "Elite", "Siêu Nhẹ", "Kháng Nước"]

async def update_names():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])

    products = await Product.find_all().to_list()
    updated = 0

    for product in products:
        # Determine product type from category
        cat_str = " ".join(product.category).lower() if product.category else ""
        
        if "giày" in cat_str or "chạy bộ" in cat_str or "sneaker" in cat_str:
            base_name = random.choice(NAMES["shoes"])
        elif "quần áo" in cat_str or "clothing" in cat_str or "áo" in cat_str or "quần" in cat_str:
            base_name = random.choice(NAMES["clothing"])
        elif "ngoài trời" in cat_str or "dụng cụ" in cat_str or "camping" in cat_str:
            base_name = random.choice(NAMES["outdoor"])
        else:
            base_name = random.choice(NAMES["clothing"] + NAMES["shoes"])
            
        adj = random.choice(ADJECTIVES)
        brand = product.brand if product.brand and product.brand.upper() != "UNKNOWN" else "PRO SPORTS"
        
        # Format: [Brand] [Base Name] [Adjective]
        new_name = f"{brand} {base_name} {adj}"
        
        # Try to make sure it's not identical to others by adding a random model string
        model_num = random.randint(100, 9999)
        new_name += f" - V{model_num}"
        
        if product.name.startswith("Trang phục thể thao") or product.name.startswith("Product "):
            product.name = new_name
            await product.save()
            updated += 1

    print(f"Successfully updated {updated} product names out of {len(products)}.")

if __name__ == "__main__":
    asyncio.run(update_names())
