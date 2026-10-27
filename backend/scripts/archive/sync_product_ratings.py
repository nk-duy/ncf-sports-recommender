import sys
import asyncio

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.product import Product
from app.models.user import User
from app.models.review import Review

async def sync_ratings():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product, User, Review])
    
    products = await Product.find_all().to_list()
    print(f"Bắt đầu đồng bộ đánh giá thực tế cho {len(products)} sản phẩm...")
    
    updated_count = 0
    for product in products:
        reviews = await Review.find(Review.product_id == str(product.product_id)).to_list()
        if not reviews:
            # Nếu chưa có reviews
            if product.rating != 0.0 or product.reviews_count != 0:
                product.rating = 0.0
                product.reviews_count = 0
                await product.save()
                updated_count += 1
        else:
            avg_rating = round(sum(r.rating for r in reviews) / len(reviews), 1)
            count = len(reviews)
            if product.rating != avg_rating or product.reviews_count != count:
                product.rating = avg_rating
                product.reviews_count = count
                await product.save()
                updated_count += 1
                
    print(f"Hoàn thành! Đã cập nhật số liệu đánh giá cho {updated_count} sản phẩm.")

if __name__ == "__main__":
    asyncio.run(sync_ratings())
