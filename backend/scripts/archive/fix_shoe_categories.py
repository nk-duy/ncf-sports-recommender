import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.models.product import Product
from beanie import init_beanie

async def update_shoes():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    products = await Product.find_all().to_list()
    count = 0
    for p in products:
        if p.product_id in ['OUT-SHOE-001', 'OUT-SHOE-002'] or ('Giày Leo Núi' in (p.category or [])):
            p.category = ['Giày thể thao', 'Chạy Trail & Dã Ngoại']
            await p.save()
            count += 1
            
    print(f"Updated {count} shoes.")

if __name__ == '__main__':
    asyncio.run(update_shoes())
