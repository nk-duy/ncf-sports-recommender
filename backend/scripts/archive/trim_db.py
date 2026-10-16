import asyncio
import sys
import os
import random

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

async def trim_db():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    # Get all products
    all_products = await Product.find_all().to_list()
    print(f"Total products before trim: {len(all_products)}")
    
    # Group by sport_type
    grouped = {}
    for p in all_products:
        st = p.sport_type or "Unknown"
        if st not in grouped:
            grouped[st] = []
        grouped[st].append(p)
        
    keep_list = []
    
    # We want ~200 total.
    # Distribute them across available sport_types
    if len(grouped) > 0:
        per_sport = 200 // len(grouped)
        for st, items in grouped.items():
            # Pick 'per_sport' items, or all if we have less
            picked = random.sample(items, min(len(items), per_sport))
            keep_list.extend(picked)
            
    # If we have less than 200 (due to some groups being small), fill with random remaining
    if len(keep_list) < 200:
        kept_ids = {p.id for p in keep_list}
        remaining = [p for p in all_products if p.id not in kept_ids]
        needed = 200 - len(keep_list)
        extra = random.sample(remaining, min(len(remaining), needed))
        keep_list.extend(extra)
        
    keep_ids = {p.id for p in keep_list}
    print(f"Keeping {len(keep_ids)} products...")
    
    # Delete the ones not in keep_ids
    # We can do this efficiently by querying the inverse
    delete_query = {"_id": {"$nin": list(keep_ids)}}
    result = await Product.find(delete_query).delete()
    
    print(f"Deleted {result.deleted_count} products.")
    
if __name__ == '__main__':
    asyncio.run(trim_db())
