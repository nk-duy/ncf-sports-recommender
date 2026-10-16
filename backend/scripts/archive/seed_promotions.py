import asyncio
import random
import os
import sys

# Ensure backend directory is in sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from beanie import init_beanie
from app.models.product import Product

async def seed_promotions():
    print("Connecting to DB...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    print("Fetching products...")
    all_products = await Product.find_all().to_list()
    
    if not all_products:
        print("No products found to seed promotions.")
        return

    # Choose random 20% of products to be on sale
    num_promotions = max(10, int(len(all_products) * 0.2))
    promo_products = random.sample(all_products, num_promotions)
    
    print(f"Adding discount to {num_promotions} products...")
    
    discounts = [10, 15, 20, 25, 30, 40, 50, 60]
    updated_count = 0
    
    # First, reset all discounts
    await Product.find_all().update({"$set": {"discount_percent": 0}})
    
    for p in promo_products:
        discount = random.choice(discounts)
        p.discount_percent = discount
        await p.save()
        updated_count += 1
        
    print(f"Successfully applied discounts to {updated_count} products.")
    
if __name__ == "__main__":
    asyncio.run(seed_promotions())
