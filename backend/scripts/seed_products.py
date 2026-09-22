import sys
import os
import asyncio
import json

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

async def seed_data():
    # Khởi tạo DB connection
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    # Đọc dữ liệu từ frontend
    json_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "frontend", "src", "data", "products.json"
    )
    
    print(f"Reading data from: {json_path}")
    if not os.path.exists(json_path):
        print(f"Error: File not found {json_path}")
        return
        
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    inserted = 0
    print(f"Found {len(data)} products in JSON file.")
    for item in data:
        # Kiểm tra sản phẩm đã tồn tại chưa
        existing = await Product.find_one(Product.product_id == item["id"])
        if not existing:
            new_product = Product(
                product_id=item["id"],
                name=item["name"],
                price=float(item["price"]),
                image_url=item["image_url"]
            )
            await new_product.insert()
            inserted += 1
            
    print(f"Seeding completed. Inserted {inserted} new products.")

if __name__ == "__main__":
    asyncio.run(seed_data())
