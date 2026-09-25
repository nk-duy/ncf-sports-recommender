import asyncio
import os
import sys
import random

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

async def add_genders():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(database=client[settings.MONGODB_DB_NAME], document_models=[Product])
    
    genders = ["Nam", "Nữ", "Unisex"]
    
    products = await Product.find_all().to_list()
    for p in products:
        p.gender = random.choice(genders)
        await p.save()
    print("Thêm gender xong!")

asyncio.run(add_genders())
