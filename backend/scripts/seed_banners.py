import asyncio
import os
import sys

# Add the backend directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import init_db
from app.models.banner import Banner

async def seed():
    await init_db()
    
    existing = await Banner.find_all().to_list()
    if not existing:
        banner = Banner(
            title="SIÊU SALE 9.9",
            image_url="/images/hero-shoe.png",
            link="#featured-products",
            position=1,
            is_active=True
        )
        await banner.insert()
        print("Default banner created.")
    else:
        print("Banners already exist.")

if __name__ == "__main__":
    asyncio.run(seed())
