import asyncio
import gzip
import json
import random
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import sys
import os

# Đảm bảo import được module app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.product import Product
from app.core.config import settings

async def init_db():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(database=client[settings.MONGODB_DB_NAME], document_models=[Product])

async def seed_data(filepath: str):
    await init_db()
    
    print("Deleting old data...")
    await Product.find_all().delete()
    
    print(f"Reading from {filepath}...")
    batch_size = 5000
    batch = []
    total_inserted = 0
    
    with gzip.open(filepath, 'rt', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                
                image_urls = data.get('imageURLHighRes', [])
                if not image_urls or not data.get('title'):
                    continue
                    
                image_url = image_urls[0] if isinstance(image_urls, list) and len(image_urls) > 0 else ""
                if not image_url:
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
                
                category = data.get('category', [])
                title_lower = data.get('title', '').lower()
                
                # Ưu tiên giày thể thao
                is_shoe = any(keyword in title_lower or any(keyword in c.lower() for c in category) 
                              for keyword in ['shoe', 'sneaker', 'boot', 'running', 'footwear', 'sandal', 'cleat'])
                
                if not is_shoe and total_inserted < 15000:
                    # Bỏ qua nếu không phải giày, trừ khi đã chèn đủ giày và muốn đa dạng
                    if random.random() > 0.1: # 90% bỏ qua các món không phải giày
                        continue
                        
                # Extract colors
                available_colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 'Navy']
                product_colors = []
                for c in available_colors:
                    if c.lower() in title_lower:
                        product_colors.append(c)
                
                details = data.get('details', {})
                if isinstance(details, dict):
                    details_str = json.dumps(details).lower()
                    for c in available_colors:
                        if c.lower() in details_str and c not in product_colors:
                            product_colors.append(c)
                
                if not product_colors:
                    product_colors = random.sample(['Black', 'White', 'Grey', 'Navy'], k=random.randint(1, 2))
                    
                # Extract sizes (EU sizes approx 36-45)
                product_sizes = []
                size_keywords = [str(i) for i in range(36, 46)]
                for s in size_keywords:
                    # Check if 'size 40' or similar is in title
                    if f"size {s}" in title_lower or f"{s} eu" in title_lower or f"{s} m eu" in title_lower:
                        product_sizes.append(s)
                
                if not product_sizes:
                    # Randomize some standard shoe sizes if not found
                    base_size = random.randint(38, 42)
                    product_sizes = [str(s) for s in range(base_size, base_size + random.randint(2, 4))]

                
                product = Product(
                    product_id=data.get('asin', ''),
                    name=data.get('title', '')[:200],
                    price=price_val * 25000,
                    image_url=image_url,
                    category=category,
                    brand=data.get('brand', 'Unknown') or 'Unknown',
                    rating=round(rating, 1),
                    reviews_count=reviews_count,
                    sizes=product_sizes,
                    colors=product_colors
                )
                batch.append(product)
                
                if len(batch) >= batch_size:
                    await Product.insert_many(batch)
                    total_inserted += len(batch)
                    print(f"Inserted {total_inserted} products...")
                    batch = []
                    
                    if total_inserted >= 30000:
                        break
                        
            except json.JSONDecodeError:
                continue
                
    if batch:
        await Product.insert_many(batch)
        total_inserted += len(batch)
        
    print(f"DONE! Seeded {total_inserted} products.")

if __name__ == "__main__":
    file_path = r"D:\Dataset Amazon\meta_Sports_and_Outdoors.json.gz"
    asyncio.run(seed_data(file_path))
