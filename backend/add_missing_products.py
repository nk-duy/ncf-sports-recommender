import asyncio
import uuid
import random
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.product import Product

async def add_missing_products():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    missing_categories = [
        ("Vớ Thể Thao", "Phụ kiện", "Phụ kiện chung", "https://vn-test-11.slatic.net/p/3b127ffc64032d91bb261eb891ed123c.jpg"),
        ("Balo / Túi Xách", "Phụ kiện", "Phụ kiện chung", "https://vn-test-11.slatic.net/p/0df06c0fa1a7a0033cc178f56477e6f8.jpg"),
        ("Mũ / Nón", "Phụ kiện", "Phụ kiện chung", "https://vn-test-11.slatic.net/p/e3bc64b85c13e648c66a4bc2c8a1cfd5.jpg"),
        ("Băng Gối / Lót Giày", "Phụ kiện", "Phụ kiện chung", "https://vn-test-11.slatic.net/p/436399c0ce40ce733cf6a3b2b7a42bb6.jpg"),
        ("Ao dai", "Quần áo", "Pickleball", "https://vn-test-11.slatic.net/p/73397f3b497c26df5d3550e50f3801f9.jpg")
    ]
    
    count = 0
    for cat_name, p_type, s_type, img in missing_categories:
        # check if we already have it
        existing = await Product.find({"category": cat_name}).to_list()
        if len(existing) == 0:
            # Create 3 products for each
            for i in range(1, 4):
                pid = f"PROD-{str(uuid.uuid4())[:8].upper()}"
                new_p = Product(
                    product_id=pid,
                    name=f"{cat_name} Cao Cấp Chính Hãng Mẫu {i}",
                    price=random.randint(15, 85) * 10000.0,
                    image_url=img,
                    images=[img],
                    product_type=p_type,
                    sport_type=s_type,
                    category=[cat_name],
                    brand=random.choice(["Nike", "Adidas", "Puma", "Lining", "Yonex"]),
                    rating=round(random.uniform(4.0, 5.0), 1),
                    reviews_count=random.randint(10, 200),
                    stock=100,
                    description=f"Sản phẩm {cat_name} chất lượng cao, thiết kế hiện đại, độ bền vượt trội.",
                    is_hidden=False,
                    is_deleted=False
                )
                await new_p.insert()
                count += 1
                
    print(f"Added {count} new missing products!")

if __name__ == "__main__":
    asyncio.run(add_missing_products())
