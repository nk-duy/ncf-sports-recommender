import asyncio
import gzip
import json
import random
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.product import Product
from app.core.config import settings

def categorize_outdoor_item(title, categories):
    title_lower = title.lower()
    cat_str = " ".join(categories).lower() if isinstance(categories, list) else str(categories).lower()
    combined = title_lower + " " + cat_str
    
    if "tent" in combined:
        return ["Ngoài trời", "Lều", "Camping Cắm Trại"]
    elif "backpack" in combined or "daypack" in combined or "rucksack" in combined:
        return ["Ngoài trời", "Balo", "Leo Núi / Trek"]
    elif "hiking shoe" in combined or "trail running" in combined or "trekking shoe" in combined or "hiking boot" in combined:
        return ["Ngoài trời", "Giày Leo Núi", "Leo Núi / Trek"]
    elif "camping" in combined or "outdoor" in combined or "survival" in combined or "lantern" in combined or "stove" in combined:
        return ["Ngoài trời", "Dụng cụ", "Camping Cắm Trại"]
    return None

async def seed_amazon_outdoor(filepath: str, max_items: int = 50):
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    print(f"Reading from {filepath}...")
    batch = []
    total_inserted = 0
    seen_asin = set()
    
    with gzip.open(filepath, 'rt', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                asin = data.get('asin')
                if asin in seen_asin:
                    continue
                
                title = data.get('title', '')
                image_urls = data.get('imageURLHighRes', [])
                
                if not title or not image_urls:
                    continue
                
                image_url = image_urls[0] if isinstance(image_urls, list) and len(image_urls) > 0 else ""
                if not image_url:
                    continue
                
                mapped_categories = categorize_outdoor_item(title, data.get('category', []))
                if not mapped_categories:
                    continue
                    
                price = data.get('price', '')
                price_val = 0.0
                if isinstance(price, str) and price:
                    price_str = price.replace('$', '').replace(',', '')
                    try:
                        price_val = float(price_str.split('-')[0].strip())
                    except ValueError:
                        pass
                
                if price_val == 0.0:
                    price_val = random.uniform(20.0, 150.0)
                    
                # Convert price to VND roughly (1 USD = 24,000 VND)
                price_vnd = int(price_val * 24000)
                # Round to nearest 10k
                price_vnd = round(price_vnd / 10000) * 10000
                
                brand = data.get('brand', 'Unknown')
                if not brand or brand.isspace():
                    brand = "OutdoorPro"
                    
                product = Product(
                    product_id=asin,
                    name=title[:100] + ('...' if len(title) > 100 else ''),
                    price=price_vnd,
                    image_url=image_url,
                    category=mapped_categories,
                    brand=brand,
                    rating=round(random.uniform(3.5, 5.0), 1),
                    reviews_count=random.randint(10, 500),
                    stock=random.randint(10, 100),
                    description=data.get('description', [''])[0] if isinstance(data.get('description'), list) and data.get('description') else "Sản phẩm dã ngoại nhập khẩu chính hãng."
                )
                
                batch.append(product)
                seen_asin.add(asin)
                
                if len(batch) >= 10:
                    # Update or Insert
                    for p in batch:
                        existing = await Product.find_one({"product_id": p.product_id})
                        if existing:
                            pass # skip existing
                        else:
                            await p.insert()
                            total_inserted += 1
                    batch = []
                    print(f"Seeded {total_inserted} outdoor items...")
                    
                    if total_inserted >= max_items:
                        break
                        
            except Exception as e:
                pass
                
    if batch and total_inserted < max_items:
        for p in batch:
            existing = await Product.find_one({"product_id": p.product_id})
            if not existing:
                await p.insert()
                total_inserted += 1
                
    print(f"DONE! Seeded {total_inserted} authentic Amazon outdoor products.")

if __name__ == "__main__":
    file_path = r"D:\Dataset Amazon\meta_Sports_and_Outdoors.json.gz"
    asyncio.run(seed_amazon_outdoor(file_path, 100))
