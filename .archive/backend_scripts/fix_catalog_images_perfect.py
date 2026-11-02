import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# KHO ẢNH CHUẨN XÁC 100% THEO ĐÚNG CẤU TRÚC 8 NHÓM MENU CỦA KADY SPORTS
MENU_IMAGE_POOLS = {
    "quan_ao": [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    ],
    "giay": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    ],
    "vot": [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1617083934555-5fc3dc25434d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
    ],
    "bong": [
        "https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
    ],
    "balo_tui": [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=800&q=80",
    ],
    "leu_outdoor": [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=800&q=80",
    ],
    "phu_kien": [
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&w=800&q=80",
    ]
}

def resolve_pool_key(p):
    name = (p.get("name") or "").lower()
    sub_cat = (p.get("sub_category") or "").lower()
    ptype = (p.get("product_type") or "").lower()
    text = f"{name} {sub_cat} {ptype}"

    if any(k in text for k in ["giày", "sandal", "dép", "shoe", "boot"]):
        return "giay"
    if any(k in text for k in ["vợt", "racket", "paddle"]):
        return "vot"
    if any(k in text for k in ["áo", "quần", "short", "jersey", "polo", "trang phục", "đồ"]):
        return "quan_ao"
    if any(k in text for k in ["bóng", "cầu", "ball", "shuttlecock"]):
        return "bong"
    if any(k in text for k in ["balo", "túi", "bag", "đai", "bottle", "bình nước"]):
        return "balo_tui"
    if any(k in text for k in ["lều", "tent", "trekking", "camping", "dã ngoại", "outdoor"]):
        return "leu_outdoor"
    return "phu_kien"

async def main():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["ncf_recommender_db"]
    
    products = await db.products.find({}).to_list(2000)
    counters = {k: 0 for k in MENU_IMAGE_POOLS.keys()}
    
    print(f"Đang tiến hành chuẩn hóa hình ảnh cho {len(products)} sản phẩm theo đúng danh mục...")

    for prod in products:
        pool_key = resolve_pool_key(prod)
        pool = MENU_IMAGE_POOLS[pool_key]
        idx = counters[pool_key]
        counters[pool_key] += 1

        pid = str(prod.get("product_id") or prod["_id"])
        
        main_img = f"{pool[idx % len(pool)]}&pid={pid}"
        gallery = [
            f"{pool[(idx + j) % len(pool)]}&pid={pid}_sub{j}"
            for j in range(len(pool))
        ]

        await db.products.update_one(
            {"_id": prod["_id"]},
            {"$set": {
                "image_url": main_img,
                "images": gallery
            }}
        )

    print("\n" + "="*50)
    print("HOÀN TẤT ĐỒNG BỘ HÌNH ẢNH DANH MỤC:")
    for k, count in counters.items():
        print(f" - Nhóm [{k}]: {count} sản phẩm")
    print("="*50)

if __name__ == "__main__":
    asyncio.run(main())