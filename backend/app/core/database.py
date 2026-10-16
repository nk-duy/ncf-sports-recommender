from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.product import Product
from app.models.user import User
from app.models.interaction import Interaction
from app.models.order import Order
from app.models.voucher import Voucher
from app.models.review import Review
from app.models.banner import Banner
from app.models.store import Store
from app.models.contact import Contact
from app.models.menu import MegaMenu
from app.models.attribute import ProductAttributes

_client = None
_db = None

def get_db():
    return _db

def get_client():
    return _client

async def init_db():
    """Initialize MongoDB connection and Beanie ODM"""
    global _client, _db
    _client = AsyncIOMotorClient(settings.MONGODB_URI)
    _db = _client[settings.MONGODB_DB_NAME]
    
    # Initialize Beanie with all document models here
    await init_beanie(database=_db, document_models=[Product, User, Interaction, Order, Voucher, Review, Banner, Store, Contact, MegaMenu, ProductAttributes])


