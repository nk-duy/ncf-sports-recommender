import asyncio
import random
from datetime import datetime, timedelta, timezone
from motor.motor_asyncio import AsyncIOMotorClient

async def enrich_promotions():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["ncf_recommender_db"]
    products_col = db["products"]
    vouchers_col = db["vouchers"]
    
    print("--- 1. Enforcing & Enriching Promotional Products ---")
    all_products = await products_col.find({"is_deleted": {"$ne": True}}).to_list(1000)
    print(f"Total products found: {len(all_products)}")
    
    # We want ~180 products across diverse sports and types to have active discounts
    # Group by sport_type
    by_sport = {}
    for p in all_products:
        sport = p.get("sport_type") or "Khác"
        by_sport.setdefault(sport, []).append(p)
    
    discount_choices = [15, 20, 25, 30, 35, 40, 50]
    now = datetime.now(timezone.utc)
    end_date = now + timedelta(days=30)
    
    promo_count = 0
    for sport, prods in by_sport.items():
        # Select roughly 35-45% of products in each sport
        num_to_discount = max(4, int(len(prods) * 0.38))
        chosen = random.sample(prods, min(num_to_discount, len(prods)))
        
        for p in chosen:
            disc = random.choice(discount_choices)
            sold = random.randint(15, 120)
            stock = random.randint(50, 200)
            
            await products_col.update_one(
                {"_id": p["_id"]},
                {
                    "$set": {
                        "discount_percent": disc,
                        "discount_start_date": now - timedelta(days=2),
                        "discount_end_date": end_date,
                        "sold": sold,
                        "stock": stock
                    }
                }
            )
            promo_count += 1
            
    print(f"Successfully added active promotional discounts to {promo_count} products!")
    
    print("--- 2. Seeding High Quality Vouchers ---")
    await vouchers_col.delete_many({})
    
    vouchers = [
        {
            "code": "FREESHIP0D",
            "discount_type": "fixed",
            "discount_value": 40000.0,
            "min_order_value": 0.0,
            "max_discount": 40000.0,
            "valid_from": now,
            "valid_until": now + timedelta(days=30),
            "usage_limit": 1000,
            "used_count": 845,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "code": "SPORT50K",
            "discount_type": "fixed",
            "discount_value": 50000.0,
            "min_order_value": 399000.0,
            "max_discount": None,
            "valid_from": now,
            "valid_until": now + timedelta(days=30),
            "usage_limit": 500,
            "used_count": 312,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "code": "MEGA100K",
            "discount_type": "fixed",
            "discount_value": 100000.0,
            "min_order_value": 899000.0,
            "max_discount": None,
            "valid_from": now,
            "valid_until": now + timedelta(days=15),
            "usage_limit": 300,
            "used_count": 255,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "code": "FLASH20",
            "discount_type": "percent",
            "discount_value": 20.0,
            "min_order_value": 299000.0,
            "max_discount": 150000.0,
            "valid_from": now,
            "valid_until": now + timedelta(days=10),
            "usage_limit": 200,
            "used_count": 178,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "code": "VIPSPORT15",
            "discount_type": "percent",
            "discount_value": 15.0,
            "min_order_value": 1200000.0,
            "max_discount": 300000.0,
            "valid_from": now,
            "valid_until": now + timedelta(days=30),
            "usage_limit": 150,
            "used_count": 92,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "code": "WELCOME30K",
            "discount_type": "fixed",
            "discount_value": 30000.0,
            "min_order_value": 200000.0,
            "max_discount": None,
            "valid_from": now,
            "valid_until": now + timedelta(days=60),
            "usage_limit": 2000,
            "used_count": 1420,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        },
        {
            "code": "COMBOMAX",
            "discount_type": "fixed",
            "discount_value": 120000.0,
            "min_order_value": 600000.0,
            "max_discount": None,
            "valid_from": now,
            "valid_until": now + timedelta(days=30),
            "usage_limit": 500,
            "used_count": 270,
            "is_active": True,
            "created_at": now,
            "updated_at": now
        }
    ]
    
    await vouchers_col.insert_many(vouchers)
    print(f"Successfully seeded {len(vouchers)} active vouchers into ncf_recommender_db!")

if __name__ == "__main__":
    asyncio.run(enrich_promotions())
