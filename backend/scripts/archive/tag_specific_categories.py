import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.product import Product

async def tag_specific_categories():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product])
    
    products = await Product.find_all().to_list()
    count = 0
    for p in products:
        name_lower = p.name.lower()
        new_cats = []
        
        if 'vớ' in name_lower or 'tất' in name_lower:
            new_cats.append("Vớ Thể Thao")
        if 'balo' in name_lower or 'túi' in name_lower:
            new_cats.append("Balo / Túi Xách")
        if 'mũ' in name_lower or 'nón' in name_lower:
            new_cats.append("Mũ / Nón")
        if 'băng' in name_lower or 'lót' in name_lower or 'bảo vệ' in name_lower:
            new_cats.append("Băng Gối / Lót Giày")
            
        if new_cats:
            # ensure no duplicates
            existing = set(p.category) if p.category else set()
            added = False
            for c in new_cats:
                if c not in existing:
                    existing.add(c)
                    added = True
            
            if added:
                p.category = list(existing)
                # also make sure product_type is Phụ kiện
                p.product_type = "Phụ kiện"
                await p.save()
                count += 1
                
    print(f"Tagged {count} specific products!")

if __name__ == "__main__":
    asyncio.run(tag_specific_categories())
