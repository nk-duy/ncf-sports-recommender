import asyncio
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from app.models.product import Product
from beanie import init_beanie

def categorize_item(name: str, categories: list):
    name_lower = name.lower()
    cat_str = " ".join(categories).lower()
    combined = name_lower + " " + cat_str
    
    product_type = "Thiết bị"
    sport_type = "Đa dụng"

    # Determine Product Type
    if any(k in combined for k in ["giày", "shoe", "boot", "sneaker", "dép", "sandal"]):
        product_type = "Giày dép"
    elif any(k in combined for k in ["áo", "quần", "clothing", "apparel", "thun", "khoác", "short", "jogger", "bra", "váy"]):
        product_type = "Quần áo"
    elif any(k in combined for k in ["balo", "túi", "vớ", "tất", "mũ", "nón", "băng", "phụ kiện", "vợt", "bóng"]):
        product_type = "Phụ kiện"
    
    # Determine Sport Type
    if any(k in combined for k in ["bóng chuyền", "volleyball"]):
        sport_type = "Bóng chuyền"
    elif any(k in combined for k in ["cầu lông", "badminton"]):
        sport_type = "Cầu lông"
    elif any(k in combined for k in ["bóng đá", "đá bóng", "football", "soccer"]):
        sport_type = "Đá bóng"
    elif any(k in combined for k in ["chạy bộ", "running", "trail"]):
        sport_type = "Chạy bộ"
    elif any(k in combined for k in ["pickleball"]):
        sport_type = "Pickleball"
    elif any(k in combined for k in ["ngoài trời", "dã ngoại", "lều", "cắm trại", "camping", "trekking", "leo núi", "outdoor"]):
        sport_type = "Dã ngoại"
    elif any(k in combined for k in ["gym", "yoga", "training", "đồ tập"]):
        sport_type = "Đa dụng"

    return product_type, sport_type

async def sync_categories():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    products = await Product.find_all().to_list()
    count = 0
    for p in products:
        p_type, s_type = categorize_item(p.name, p.category or [])
        p.product_type = p_type
        p.sport_type = s_type
        
        # Optionally cleanup raw category array to make UI cleaner
        # We can leave category as is for backwards compatibility with some sidebars, or clear it
        
        await p.save()
        count += 1
            
    print(f"Synced {count} products with new Matrix Category Structure.")

if __name__ == '__main__':
    asyncio.run(sync_categories())
