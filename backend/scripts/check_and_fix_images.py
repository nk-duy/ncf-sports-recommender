import asyncio
import sys
import httpx
from motor.motor_asyncio import AsyncIOMotorClient

sys.stdout.reconfigure(encoding='utf-8')

# Verified working Unsplash photos (200 OK verified) for each category
VERIFIED_POOLS = {
    "Đá bóng": [
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
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1582966772680-860e37c85b4c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1587384474964-3a06ce1ce699?auto=format&fit=crop&w=800&q=80",
    ],
    "Cầu lông": [
        "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1521537634581-0dced2fedc42?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1617083934555-563d63351978?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=800&q=80",
    ],
    "Bóng chuyền": [
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    ],
    "Chạy bộ": [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    ],
    "Pickleball": [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    ],
    "Dã ngoại": [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80",
    ],
    "Đa dụng": [
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    ]
}

async def main():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["ncf_recommender_db"]

    # 1. First, verify all candidate URLs in VERIFIED_POOLS
    print("Verifying candidate pool URLs...")
    async with httpx.AsyncClient(headers={"User-Agent": "Mozilla/5.0"}, follow_redirects=True, timeout=5.0) as http_client:
        verified_by_sport = {}
        for sport, urls in VERIFIED_POOLS.items():
            verified_by_sport[sport] = []
            for u in urls:
                try:
                    res = await http_client.get(u)
                    if res.status_code == 200:
                        verified_by_sport[sport].append(u)
                except Exception as e:
                    print(f"Pool URL failed: {u} -> {e}")
            print(f"Sport '{sport}': {len(verified_by_sport[sport])} working URLs")

        # 2. Get all products from DB
        products = await db["products"].find({}, {"product_id": 1, "name": 1, "image_url": 1, "sport_type": 1}).to_list(1000)
        print(f"\nChecking {len(products)} products in DB...")

        unique_urls = list({p.get("image_url") for p in products if p.get("image_url")})
        url_status = {}

        # Concurrently test all unique URLs with semaphore
        sem = asyncio.Semaphore(25)
        async def test_url(url):
            async with sem:
                try:
                    res = await http_client.get(url)
                    url_status[url] = (res.status_code == 200)
                except Exception:
                    url_status[url] = False

        await asyncio.gather(*(test_url(u) for u in unique_urls))

        broken_urls = {u for u, ok in url_status.items() if not ok}
        print(f"Total checked: {len(unique_urls)} | Broken URLs: {len(broken_urls)}")

        # 3. Fix broken products in DB
        fixed_count = 0
        sport_indices = {s: 0 for s in verified_by_sport}

        for p in products:
            img = p.get("image_url")
            if not img or img in broken_urls:
                sport = p.get("sport_type") or "Đa dụng"
                pool = verified_by_sport.get(sport) or verified_by_sport["Đa dụng"]
                idx = sport_indices[sport] % len(pool)
                new_img = pool[idx]
                sport_indices[sport] += 1

                await db["products"].update_one(
                    {"product_id": p["product_id"]},
                    {"$set": {
                        "image_url": new_img,
                        "images": [new_img]
                    }}
                )
                fixed_count += 1

        print(f"Fixed {fixed_count} products with verified working images!")

        # Check target product specifically
        target = await db["products"].find_one({"product_id": "9292b489-81b7-4313-9a8a-5c4676d8b121"})
        if target:
            print("Target product 9292b489 new image:", target.get("image_url"))

if __name__ == "__main__":
    asyncio.run(main())
