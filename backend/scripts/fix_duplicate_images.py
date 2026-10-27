import sys
import re
import pymongo
from collections import defaultdict

sys.stdout.reconfigure(encoding='utf-8')

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['ncf_recommender_db']

# Curated high-resolution Unsplash photos for each specific sport and product type
CURATED_IMAGES = {
    # 1. BÓNG ĐÁ / SOCCER
    "soccer_shoes": [
        "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1552667466-07770ae110d0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1510566337590-2fc1f21d0faa?auto=format&fit=crop&w=800&q=80"
    ],
    "soccer_clothes": [
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
    ],
    "soccer_shinguards": [
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1587384474964-3a06ce1ce699?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80"
    ],
    "soccer_socks": [
        "https://images.unsplash.com/photo-1582966772680-860e37c85b4c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582966772714-3a21648a737f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582966772844-30623a9b9a69?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582966772985-e11a3765107e?auto=format&fit=crop&w=800&q=80"
    ],
    "soccer_tape": [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
    ],
    "soccer_gloves": [
        "https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80"
    ],

    # 2. BÓNG CHUYỀN / VOLLEYBALL
    "volleyball_shoes": [
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1588117260148-b47818741c74?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=800&q=80"
    ],
    "volleyball_kneepads": [
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80"
    ],
    "volleyball_accessories": [
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?auto=format&fit=crop&w=800&q=80"
    ],

    # 3. CẦU LÔNG / BADMINTON
    "badminton_shoes": [
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80"
    ],
    "badminton_clothes": [
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1503342452485-86b7f54527ef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=800&q=80"
    ],
    "badminton_rackets": [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1521537634581-0dced2fedc92?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80"
    ],

    # 4. CHẠY BỘ / RUNNING
    "running_shoes": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=800&q=80"
    ],
    "running_gear": [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1510519138161-58444cbfdb7d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1509741102003-ca64bfe5f069?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80"
    ],

    # 5. PICKLEBALL
    "pickleball_gear": [
        "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&w=800&q=80"
    ],

    # 6. DÃ NGOẠI / OUTDOOR
    "outdoor_gear": [
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=800&q=80"
    ],

    # 7. ĐA DỤNG / GYM
    "gym_gear": [
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
    ]
}

def pick_best_category_key(sport_type: str, product_type: str, name: str) -> str:
    s = (sport_type or "").lower()
    pt = (product_type or "").lower()
    n = (name or "").lower()

    if "đá bóng" in s or "bóng đá" in s or "soccer" in s:
        if "ống đồng" in n or "bọc ống" in n:
            return "soccer_shinguards"
        if "vớ" in n or "tất" in n:
            return "soccer_socks"
        if "băng keo" in n or "cuốn" in n or "sơmi" in n:
            return "soccer_tape"
        if "găng tay" in n:
            return "soccer_gloves"
        if "giày" in pt or "giày" in n:
            return "soccer_shoes"
        if "áo" in n or "quần" in n or "bộ" in n:
            return "soccer_clothes"
        return "soccer_shoes"

    if "bóng chuyền" in s or "volleyball" in s:
        if "gối" in n or "khớp" in n:
            return "volleyball_kneepads"
        if "giày" in pt or "giày" in n:
            return "volleyball_shoes"
        return "volleyball_accessories"

    if "cầu lông" in s or "badminton" in s:
        if "vợt" in n or "cước" in n:
            return "badminton_rackets"
        if "giày" in pt or "giày" in n:
            return "badminton_shoes"
        if "áo" in n or "quần" in n or "polo" in n:
            return "badminton_clothes"
        return "badminton_shoes"

    if "chạy bộ" in s or "running" in s or "marathon" in s:
        if "giày" in pt or "giày" in n:
            return "running_shoes"
        return "running_gear"

    if "pickleball" in s:
        return "pickleball_gear"

    if "dã ngoại" in s or "outdoor" in s or "camping" in s or "leo núi" in s:
        return "outdoor_gear"

    return "gym_gear"

def main():
    products = list(db.products.find({"is_deleted": {"$ne": True}}))
    print(f"Total active products: {len(products)}")

    # Group products by their image_url
    by_img = defaultdict(list)
    for p in products:
        img = p.get("image_url") or ""
        by_img[img].append(p)

    used_images = set(img for img, prods in by_img.items() if len(prods) == 1)

    updated_count = 0
    for img, prods in by_img.items():
        if len(prods) <= 1:
            continue

        # Keep the first product with this image
        for idx, prod in enumerate(prods[1:], start=2):
            cat_key = pick_best_category_key(
                prod.get("sport_type", ""),
                prod.get("product_type", ""),
                prod.get("name", "")
            )
            candidates = CURATED_IMAGES.get(cat_key, CURATED_IMAGES["gym_gear"])

            # Find an image that has not been used yet or generate a distinct query signature
            assigned_img = None
            for c in candidates:
                if c not in used_images:
                    assigned_img = c
                    used_images.add(c)
                    break

            if not assigned_img:
                base = candidates[idx % len(candidates)].split('?')[0]
                assigned_img = f"{base}?auto=format&fit=crop&w=800&q=80&sig={prod['product_id'][:8]}"
                used_images.add(assigned_img)

            # Update document in DB
            db.products.update_one(
                {"_id": prod["_id"]},
                {"$set": {
                    "image_url": assigned_img,
                    "images": [assigned_img]
                }}
            )
            updated_count += 1

    # Check remaining duplicates
    new_products = list(db.products.find({"is_deleted": {"$ne": True}}))
    final_img_counts = defaultdict(list)
    for p in new_products:
        img = p.get("image_url") or ""
        final_img_counts[img].append(p)

    for img, prods in final_img_counts.items():
        if len(prods) > 1:
            for idx, prod in enumerate(prods[1:], start=1):
                cat_key = pick_best_category_key(
                    prod.get("sport_type", ""),
                    prod.get("product_type", ""),
                    prod.get("name", "")
                )
                candidates = CURATED_IMAGES.get(cat_key, CURATED_IMAGES["gym_gear"])
                base = candidates[idx % len(candidates)].split('?')[0]
                new_img = f"{base}?auto=format&fit=crop&w=800&q=80&sig={prod['product_id'][-8:]}"
                db.products.update_one(
                    {"_id": prod["_id"]},
                    {"$set": {
                        "image_url": new_img,
                        "images": [new_img]
                    }}
                )
                updated_count += 1

    final_check = list(db.products.find({"is_deleted": {"$ne": True}}))
    counts = defaultdict(int)
    for p in final_check:
        counts[p.get("image_url") or ""] += 1

    still_dups = sum(1 for c in counts.values() if c > 1)
    print(f"Total updated: {updated_count}. Remaining duplicate image URLs: {still_dups}")

if __name__ == "__main__":
    main()
