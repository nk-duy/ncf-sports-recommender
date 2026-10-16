import asyncio
import sys
import os
import random
import uuid

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from scripts.seed_curated_200 import NAMES_MAP, BRAND_MAP

SPORTS = ["Bóng chuyền", "Cầu lông", "Chạy bộ", "Đá bóng", "Pickleball", "Đa dụng", "Dã ngoại"]
TYPES = ["Quần áo", "Giày dép", "Thiết bị", "Phụ kiện"]
MIN_COUNT = 15

async def main():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    # Get all image URLs to reuse randomly
    all_prods = await Product.find_all().to_list()
    images_by_sport = {}
    for p in all_prods:
        if p.sport_type not in images_by_sport:
            images_by_sport[p.sport_type] = []
        if p.image_url:
            images_by_sport[p.sport_type].append(p.image_url)

    total_inserted = 0

    for sport in SPORTS:
        for ptype in TYPES:
            count = await Product.find(Product.sport_type == sport, Product.product_type == ptype).count()
            if count < MIN_COUNT:
                missing = MIN_COUNT - count
                print(f"Missing {missing} for {sport.encode('utf-8', 'ignore')} - {ptype.encode('utf-8', 'ignore')}")
                
                batch = []
                for _ in range(missing):
                    base_names = NAMES_MAP.get(ptype, {}).get(sport, [])
                    brands = BRAND_MAP.get(sport, ['KADY'])
                    brand = random.choice(brands)
                    
                    if base_names:
                        name = f"{brand} {random.choice(base_names)} Mới - V{random.randint(100, 999)}"
                    else:
                        name = f"{brand} {ptype} {sport} Siêu Cấp - V{random.randint(100, 999)}"
                        
                    img_pool = images_by_sport.get(sport, [])
                    img_url = random.choice(img_pool) if img_pool else "https://via.placeholder.com/600x600.png?text=Image+Coming+Soon"
                    
                    product = Product(
                        product_id=str(uuid.uuid4()),
                        name=name,
                        price=random.randint(2, 20) * 100000,
                        image_url=img_url,
                        category=[sport, ptype],
                        product_type=ptype,
                        sport_type=sport,
                        brand=brand,
                        rating=round(random.uniform(4.0, 5.0), 1),
                        reviews_count=random.randint(10, 200),
                        sizes=['S', 'M', 'L'] if ptype == 'Quần áo' else (['39', '40', '41'] if ptype == 'Giày dép' else []),
                        colors=['Đen', 'Đỏ']
                    )
                    batch.append(product)
                
                if batch:
                    await Product.insert_many(batch)
                    total_inserted += len(batch)

    print(f"Filled {total_inserted} gaps in the database to ensure all categories have products.")

if __name__ == "__main__":
    asyncio.run(main())
