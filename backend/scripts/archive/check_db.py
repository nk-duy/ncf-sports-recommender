import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

async def check_db():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    products = await Product.find({"sport_type": "Dã ngoại"}).to_list(10)
    for p in products:
        print(p.name)

if __name__ == '__main__':
    asyncio.run(check_db())
