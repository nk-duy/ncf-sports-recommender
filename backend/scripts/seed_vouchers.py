import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta

async def seed_vouchers():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.ncf_sports
    vouchers_collection = db.vouchers
    
    await vouchers_collection.delete_many({})
    
    now = datetime.utcnow()
    vouchers = [
        {
            "code": "GIAM100K",
            "discount_type": "fixed",
            "discount_value": 100000.0,
            "min_order_value": 999000.0,
            "max_discount": None,
            "valid_from": now,
            "valid_until": now + timedelta(days=30),
            "usage_limit": 1000,
            "used_count": 0,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "code": "FREESHIP0D",
            "discount_type": "fixed",
            "discount_value": 40000.0,
            "min_order_value": 0.0,
            "max_discount": 40000.0,
            "valid_from": now,
            "valid_until": now + timedelta(days=15),
            "usage_limit": 500,
            "used_count": 420,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "code": "SUPER99",
            "discount_type": "percent",
            "discount_value": 15.0,
            "min_order_value": 1500000.0,
            "max_discount": 300000.0,
            "valid_from": now,
            "valid_until": now + timedelta(days=7),
            "usage_limit": 100,
            "used_count": 98,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "code": "WELCOME50K",
            "discount_type": "fixed",
            "discount_value": 50000.0,
            "min_order_value": 300000.0,
            "max_discount": None,
            "valid_from": now,
            "valid_until": now + timedelta(days=365),
            "usage_limit": 5000,
            "used_count": 1500,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
    ]
    
    result = await vouchers_collection.insert_many(vouchers)
    print(f"Inserted {len(result.inserted_ids)} vouchers")

if __name__ == "__main__":
    asyncio.run(seed_vouchers())
