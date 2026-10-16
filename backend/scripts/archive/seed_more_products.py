import asyncio
import gzip
import json
import random
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.product import Product
from app.core.config import settings

def categorize_item(name: str, categories: list):
    name_lower = name.lower()
    cat_str = " ".join(categories).lower()
    combined = name_lower + " " + cat_str
    
    product_type = None
    sport_type = None

    # Determine Product Type
    if any(k in combined for k in ["giày", "shoe", "boot", "sneaker", "dép", "sandal", "cleat", "footwear"]):
        product_type = "Giày dép"
    elif any(k in combined for k in ["áo", "quần", "clothing", "apparel", "thun", "khoác", "short", "jogger", "bra", "váy", "shirt", "pant", "jersey", "jacket", "sock"]):
        product_type = "Quần áo"
    elif any(k in combined for k in ["balo", "túi", "vớ", "tất", "mũ", "nón", "băng", "phụ kiện", "bag", "hat", "cap", "sock"]):
        product_type = "Phụ kiện"
    elif any(k in combined for k in ["vợt", "bóng", "racket", "ball", "net", "equipment"]):
        product_type = "Thiết bị"
    
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
    elif any(k in combined for k in ["ngoài trời", "dã ngoại", "lều", "cắm trại", "camping", "trekking", "leo núi", "outdoor", "tent", "sleeping bag"]):
        sport_type = "Dã ngoại"
    elif any(k in combined for k in ["gym", "yoga", "training", "đồ tập", "fitness", "workout"]):
        sport_type = "Đa dụng"

    return product_type, sport_type

async def seed_more_data(filepath: str):
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(database=client[settings.MONGODB_DB_NAME], document_models=[Product])
    
    print(f"Reading from {filepath} to append more matched products...")
    batch_size = 500
    batch = []
    total_inserted = 0
    
    # We will track existing IDs to avoid duplicates if possible, or just insert
    existing_ids = set()
    try:
        docs = await Product.find_all().project({"product_id": 1}).to_list()
        for doc in docs:
            existing_ids.add(doc["product_id"])
    except Exception as e:
        print("Could not fetch existing IDs, will proceed blindly.")

    with gzip.open(filepath, 'rt', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                
                pid = data.get('asin', '')
                if pid in existing_ids:
                    continue
                    
                image_urls = data.get('imageURLHighRes', [])
                if not image_urls or not data.get('title'):
                    continue
                    
                image_url = image_urls[0] if isinstance(image_urls, list) and len(image_urls) > 0 else ""
                if not image_url:
                    continue
                
                p_type, s_type = categorize_item(data.get('title', ''), data.get('category', []))
                
                # STRICT FILTER: Only insert if we found BOTH sport and product type
                if not p_type or not s_type:
                    continue
                    
                price = data.get('price', '')
                price_val = 0.0
                if isinstance(price, str) and price:
                    price_str = price.replace('$', '').replace(',', '')
                    try:
                        price_val = float(price_str.split('-')[0].strip())
                    except ValueError:
                        price_val = random.uniform(15.0, 200.0)
                elif isinstance(price, (int, float)):
                    price_val = float(price)
                else:
                    price_val = random.uniform(15.0, 200.0)
                    
                rating = random.uniform(3.5, 5.0)
                reviews_count = random.randint(10, 5000)
                
                title_lower = data.get('title', '').lower()
                
                available_colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Navy']
                product_colors = []
                for c in available_colors:
                    if c.lower() in title_lower:
                        product_colors.append(c)
                
                if not product_colors:
                    product_colors = random.sample(['Black', 'White', 'Grey', 'Navy'], k=random.randint(1, 2))
                    
                product_sizes = []
                size_keywords = [str(i) for i in range(36, 46)]
                for s in size_keywords:
                    if f"size {s}" in title_lower or f"{s} eu" in title_lower or f"{s} m eu" in title_lower:
                        product_sizes.append(s)
                
                if not product_sizes:
                    base_size = random.randint(38, 42)
                    product_sizes = [str(s) for s in range(base_size, base_size + random.randint(2, 4))]
                
                # Make names cleaner for the UI if possible, or just keep them
                product = Product(
                    product_id=pid,
                    name=data.get('title', '')[:200],
                    price=price_val * 25000,
                    image_url=image_url,
                    category=data.get('category', []),
                    product_type=p_type,
                    sport_type=s_type,
                    brand=data.get('brand', 'Unknown') or 'Unknown',
                    rating=round(rating, 1),
                    reviews_count=reviews_count,
                    sizes=product_sizes,
                    colors=product_colors
                )
                batch.append(product)
                existing_ids.add(pid)
                
                if len(batch) >= batch_size:
                    await Product.insert_many(batch)
                    total_inserted += len(batch)
                    print(f"Appended {total_inserted} high-quality matching products...")
                    batch = []
                    
                    if total_inserted >= 5000:  # Add 5000 items
                        break
                        
            except json.JSONDecodeError:
                continue
                
    if batch:
        await Product.insert_many(batch)
        total_inserted += len(batch)
        
    print(f"DONE! Appended {total_inserted} matching products.")

if __name__ == "__main__":
    file_path = r"D:\Dataset Amazon\meta_Sports_and_Outdoors.json.gz"
    asyncio.run(seed_more_data(file_path))
