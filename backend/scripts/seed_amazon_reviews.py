import asyncio
import gzip
import json
import random
import sys
import os
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.product import Product
from app.models.review import Review
from app.models.user import User
from app.core.config import settings

async def seed_amazon_reviews(filepath: str):
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product, Review, User])

    # Get valid ASINs
    products = await Product.find_all().to_list()
    valid_asins = {p.product_id for p in products}
    print(f"Loaded {len(valid_asins)} products from DB.")
    
    if not valid_asins:
        print("No products found to review!")
        return

    # Delete existing reviews for these products (optional, but good for a fresh start)
    await Review.find({"product_id": {"$in": list(valid_asins)}}).delete()
    print("Cleared existing reviews for current products.")

    # Get users or create 100 dummy users
    users = await User.find_all().to_list()
    if len(users) < 100:
        print("Creating dummy users...")
        for i in range(100):
            dummy = User(
                username=f"amazon_user_{i}",
                email=f"amazon_{i}@example.com",
                full_name=f"Amazon Shopper {i}",
                hashed_password="fake"
            )
            await dummy.insert()
            users.append(dummy)
            
    user_ids = [str(u.id) for u in users]
    
    print(f"Reading reviews from {filepath}...")
    batch = []
    total_inserted = 0
    product_stats = {} # product_id -> {'total_rating': 0, 'count': 0}
    
    with gzip.open(filepath, 'rt', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                asin = data.get('asin')
                
                if asin in valid_asins:
                    rating = data.get('overall', 5)
                    reviewText = data.get('reviewText', '')
                    if not reviewText:
                        continue
                        
                    unix_time = data.get('unixReviewTime')
                    review_time = datetime.utcfromtimestamp(unix_time) if unix_time else datetime.utcnow()
                    
                    review = Review(
                        user_id=random.choice(user_ids),
                        product_id=asin,
                        rating=rating,
                        comment=reviewText,
                        timestamp=review_time
                    )
                    batch.append(review)
                    
                    if asin not in product_stats:
                        product_stats[asin] = {'total_rating': 0, 'count': 0}
                    product_stats[asin]['total_rating'] += rating
                    product_stats[asin]['count'] += 1
                    
                    if len(batch) >= 1000:
                        await Review.insert_many(batch)
                        total_inserted += len(batch)
                        print(f"Inserted {total_inserted} real Amazon reviews...")
                        batch = []
                        
            except json.JSONDecodeError:
                pass
                
    if batch:
        await Review.insert_many(batch)
        total_inserted += len(batch)
        print(f"Inserted {total_inserted} real Amazon reviews...")

    # Update product ratings
    print("Updating product rating averages...")
    for product in products:
        stats = product_stats.get(product.product_id)
        if stats and stats['count'] > 0:
            product.rating = round(stats['total_rating'] / stats['count'], 1)
            product.reviews_count = stats['count']
        else:
            product.rating = 0
            product.reviews_count = 0
        await product.save()

    print(f"DONE! Successfully seeded {total_inserted} authentic reviews from Amazon.")

if __name__ == "__main__":
    file_path = r"D:\Dataset Amazon\Sports_and_Outdoors_5.json.gz"
    asyncio.run(seed_amazon_reviews(file_path))
