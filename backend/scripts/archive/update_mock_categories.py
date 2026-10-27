import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.product import Product

async def update_categories():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    products = await Product.find_all().to_list()
    count = 0
    for p in products:
        new_cats = []
        if p.sport_type == "Pickleball":
            if p.product_type == "Quần áo": new_cats.append("Quần Áo Pickleball")
            elif p.product_type == "Giày dép": new_cats.append("Giày Pickleball")
            elif p.product_type == "Thiết bị": new_cats.append("Vợt Pickleball")
            elif p.product_type == "Phụ kiện": new_cats.append("Phụ Kiện Pickleball")
        elif p.sport_type == "Bóng chuyền":
            if p.product_type == "Quần áo": new_cats.append("Quần Áo Bóng Chuyền")
            elif p.product_type == "Giày dép": new_cats.append("Giày Bóng Chuyền")
            elif p.product_type == "Thiết bị": new_cats.append("Quả Bóng Chuyền")
        elif p.sport_type == "Cầu lông":
            if p.product_type == "Quần áo": new_cats.append("Quần Áo Cầu Lông")
            elif p.product_type == "Giày dép": new_cats.append("Giày Cầu Lông")
            elif p.product_type == "Thiết bị": new_cats.append("Vợt Cầu Lông")
        elif p.sport_type == "Chạy bộ": new_cats.append("Đồ Chạy Bộ")
        elif p.sport_type == "Đá bóng": new_cats.append("Đồ Bóng Đá")
        elif p.sport_type == "Đa dụng": new_cats.append("Đồ Tập Gym / Yoga")
        elif p.sport_type == "Dã ngoại": new_cats.append("Dã Ngoại / Cắm Trại")
        
        # Also preserve existing categories
        if p.category:
            for c in p.category:
                if c not in new_cats:
                    new_cats.append(c)
        
        if new_cats:
            p.category = new_cats
            await p.save()
            count += 1
            
    print(f"Updated {count} products with new categories!")

if __name__ == "__main__":
    asyncio.run(update_categories())
