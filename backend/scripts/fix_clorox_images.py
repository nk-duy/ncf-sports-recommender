import pymongo

def fix_bad_images():
    client = pymongo.MongoClient("mongodb://localhost:27017")
    db = client["ncf_recommender_db"]

    bad_patterns = ["1583947215259", "1584308666744", "1584017911766"]
    replacement_pool = [
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
        "https://images.unsplash.com/photo-1587384474964-3a06ce1ce699",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd",
        "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a",
        "https://images.unsplash.com/photo-1563299796-17596ed6b017",
        "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e"
    ]

    rep_idx = 0
    updated = 0
    for p in db.products.find({}):
        img = p.get("image_url") or ""
        imgs = p.get("images") or []
        is_bad = any(bp in img for bp in bad_patterns) or any(bp in i for i in imgs for bp in bad_patterns)
        if is_bad:
            cand = replacement_pool[rep_idx % len(replacement_pool)]
            rep_idx += 1
            new_main = f"{cand}?auto=format&fit=crop&w=800&q=80"
            new_images = [
                f"{new_main}&view=1",
                f"{new_main}&view=2",
                f"{new_main}&view=3",
                f"{new_main}&view=4"
            ]
            db.products.update_one(
                {"_id": p["_id"]},
                {"$set": {
                    "image_url": new_main,
                    "images": new_images
                }}
            )
            updated += 1
            print(f"Replaced: {p['product_id']} | {p.get('name')}")

    print(f"Successfully replaced {updated} products.")

if __name__ == "__main__":
    fix_bad_images()
