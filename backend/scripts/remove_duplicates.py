import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

async def remove_duplicates():
    print("Connecting to DB...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    print("Fetching all products...")
    all_products = await Product.find_all().to_list()
    seen_ids = set()
    duplicates_to_delete = []
    
    for product in all_products:
        if product.product_id in seen_ids:
            duplicates_to_delete.append(product)
        else:
            seen_ids.add(product.product_id)
            
    print(f"Found {len(duplicates_to_delete)} duplicate products out of {len(all_products)} total.")
    
    if duplicates_to_delete:
        print("Deleting duplicates...")
        for dup in duplicates_to_delete:
            await dup.delete()
        print("Duplicates deleted successfully.")
    else:
        print("No duplicates found.")

if __name__ == '__main__':
    asyncio.run(remove_duplicates())
