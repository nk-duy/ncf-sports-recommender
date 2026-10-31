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
from app.models.menu import MegaMenu
from app.models.attribute import ProductAttributes
from app.models.recommendation_impression import RecommendationImpression
from app.models.notification import Notification

_client = None
_db = None

def get_db():
    return _db

def get_client():
    return _client

async def init_db():
    """Initialize MongoDB connection and Beanie ODM"""
    global _client, _db
    try:
        _client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=5000)
        # Test connection with ping to fail fast if MongoDB is down
        await _client.admin.command('ping')
        _db = _client[settings.MONGODB_DB_NAME]
        
        # Initialize Beanie with all document models here
        await init_beanie(
            database=_db,
            document_models=[
                Product,
                User,
                Interaction,
                Order,
                Voucher,
                Review,
                Banner,
                MegaMenu,
                ProductAttributes,
                RecommendationImpression,
                Notification
            ]
        )
    except Exception as e:
        print(f"\n=======================================================")
        print(f"[LỖI KẾT NỐI MONGODB] Không thể kết nối tới: {settings.MONGODB_URI}")
        print(f"Chi tiết: {e}")
        print("Cách khắc phục:")
        print("1. Kiểm tra tiến trình MongoDB đã được khởi động chưa:")
        print("   mongod --dbpath D:\\MongoDB\\data")
        print("   hoặc bật service MongoDB trong Windows Services: Start-Service MongoDB")
        print("2. Đảm bảo cổng 27017 không bị tường lửa chặn hoặc xung đột")
        print(f"=======================================================\n")
        raise e


