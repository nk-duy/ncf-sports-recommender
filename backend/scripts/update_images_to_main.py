import pymongo
import json

def update_images():
    client = pymongo.MongoClient("mongodb://localhost:27017")
    db = client["ncf_recommender_db"]

    products = list(db.products.find({}, {"_id": 1, "product_id": 1, "image_url": 1}))
    print(f"Total products found: {len(products)}")

    updated = 0
    for p in products:
        main_img = p.get("image_url") or ""
        if not main_img:
            continue
        sep = "&" if "?" in main_img else "?"
        four_images = [
            f"{main_img}{sep}view=1",
            f"{main_img}{sep}view=2",
            f"{main_img}{sep}view=3",
            f"{main_img}{sep}view=4"
        ]
        db.products.update_one(
            {"_id": p["_id"]},
            {"$set": {"images": four_images}}
        )
        updated += 1

    print(f"Successfully updated {updated} products.")

    # Verify
    sample = db.products.find_one({}, {"product_id": 1, "name": 1, "image_url": 1, "images": 1})
    if sample:
        sample["_id"] = str(sample["_id"])
        print("Sample after update:")
        print(json.dumps(sample, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    update_images()
