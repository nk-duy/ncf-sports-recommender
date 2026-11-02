import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings

async def main():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    bad_names = [
        "Bếp Ga Gấp Gọn",
        "Găng Tay Tập Gym",
        "Lều Cắm Trại 2-4 Người",
        "Thảm Trải Lều",
        "Trekking Pro Bếp Ga",
        "Lululemon Găng Tay",
        "Coleman Lều Cắm Trại",
        "Trekking Pro Thảm Trải Lều"
    ]
    
    # 1. Find the bad images
    bad_image_urls = set()
    for name in bad_names:
        # Regex search for partial names
        products = await Product.find({"name": {"$regex": name, "$options": "i"}}).to_list()
        for p in products:
            if p.image_url:
                bad_image_urls.add(p.image_url)
    
    print(f"Found {len(bad_image_urls)} bad image URLs.")
    
    # 2. Delete all products using these images
    if bad_image_urls:
        deleted_count = 0
        for img_url in bad_image_urls:
            result = await Product.find({"image_url": img_url}).delete()
            deleted_count += result.deleted_count
        
        print(f"Deleted {deleted_count} products with bad images.")
    else:
        print("No bad images found to delete.")

if __name__ == "__main__":
    asyncio.run(main())
