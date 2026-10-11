import asyncio
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

from app.core.database import init_db
from app.models.store import Store

INITIAL_STORES = [
    {
        "name": "KADY Cầu Giấy",
        "address": "123 Đường Cầu Giấy, Q. Cầu Giấy, Hà Nội",
        "city": "hanoi",
        "phone": "024 3888 9999",
        "hours": "08:00 - 22:00",
        "is_active": True
    },
    {
        "name": "KADY Ba Đình",
        "address": "45 Đường Kim Mã, Q. Ba Đình, Hà Nội",
        "city": "hanoi",
        "phone": "024 3777 6666",
        "hours": "08:30 - 21:30",
        "is_active": True
    },
    {
        "name": "KADY Đống Đa",
        "address": "88 Đường Chùa Bộc, Q. Đống Đa, Hà Nội",
        "city": "hanoi",
        "phone": "024 3555 4444",
        "hours": "08:00 - 22:00",
        "is_active": True
    },
    {
        "name": "KADY Quận 1",
        "address": "254 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh",
        "city": "hcm",
        "phone": "028 3999 1111",
        "hours": "08:00 - 22:00",
        "is_active": True
    },
    {
        "name": "KADY Tân Bình",
        "address": "112 Đường Lê Văn Sỹ, Q. Tân Bình, TP. Hồ Chí Minh",
        "city": "hcm",
        "phone": "028 3888 2222",
        "hours": "08:30 - 21:30",
        "is_active": True
    },
    {
        "name": "KADY Bình Thạnh",
        "address": "69 Đường Điện Biên Phủ, Q. Bình Thạnh, TP. HCM",
        "city": "hcm",
        "phone": "028 3777 3333",
        "hours": "08:00 - 22:00",
        "is_active": True
    },
    {
        "name": "KADY Hải Châu",
        "address": "56 Đường Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng",
        "city": "danang",
        "phone": "0236 3666 888",
        "hours": "08:00 - 21:30",
        "is_active": True
    },
    {
        "name": "KADY Thanh Khê",
        "address": "142 Đường Hùng Vương, Q. Thanh Khê, Đà Nẵng",
        "city": "danang",
        "phone": "0236 3555 777",
        "hours": "08:30 - 21:30",
        "is_active": True
    }
]

async def seed_stores():
    print("Connecting to database...")
    await init_db()
    
    print("Seeding stores...")
    for s_data in INITIAL_STORES:
        existing = await Store.find_one(Store.name == s_data["name"])
        if not existing:
            store = Store(**s_data)
            await store.insert()
            print(f"Added store: {store.id}")

    print("Store seeding completed successfully!")



if __name__ == "__main__":
    asyncio.run(seed_stores())
