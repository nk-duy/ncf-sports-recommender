from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.product import Product
from app.models.user import User
from app.models.interaction import Interaction
from app.models.order import Order
from app.models.voucher import Voucher

async def init_db():
    """Initialize MongoDB connection and Beanie ODM"""
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    
    # Initialize Beanie with all document models here
    await init_beanie(database=db, document_models=[Product, User, Interaction, Order, Voucher])
