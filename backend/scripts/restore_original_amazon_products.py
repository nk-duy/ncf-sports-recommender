import gzip
import json
import os
import sys
import pymongo

# Configure UTF-8 for Windows PowerShell output
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8')

GZIP_PATH = r"D:\Dataset Amazon\meta_Sports_and_Outdoors.json.gz"

def restore_products():
    if not os.path.exists(GZIP_PATH):
        print(f"Error: Dataset file not found at {GZIP_PATH}")
        return

    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["ncf_recommender_db"]
    products_col = db["products"]

    # Lấy danh sách product_id hiện có trong DB
    existing_products = list(products_col.find({}, {"product_id": 1}))
    asin_to_id = {str(p["product_id"]): p["_id"] for p in existing_products}
    print(f"Tổng số sản phẩm trong DB cần kiểm tra/khôi phục: {len(asin_to_id)}")

    found_count = 0
    updated_count = 0

    print("Đang quét dataset Amazon meta_Sports_and_Outdoors.json.gz để lấy lại tên và ảnh gốc...")
    with gzip.open(GZIP_PATH, "rt", encoding="utf-8") as f:
        for line_num, line in enumerate(f):
            try:
                data = json.loads(line)
                asin = data.get("asin")
                if asin in asin_to_id:
                    doc_id = asin_to_id[asin]
                    raw_title = data.get("title")
                    raw_images = data.get("imageURLHighRes") or data.get("imageURL") or []
                    
                    update_fields = {}
                    if raw_title:
                        # Decode HTML entities if any
                        clean_title = raw_title.replace("&amp;", "&").replace("&quot;", '"').replace("&#39;", "'")
                        update_fields["name"] = clean_title
                    
                    if raw_images:
                        update_fields["image_url"] = raw_images[0]
                        update_fields["images"] = raw_images
                    
                    if update_fields:
                        products_col.update_one({"_id": doc_id}, {"$set": update_fields})
                        updated_count += 1
                    
                    found_count += 1
                    if found_count % 50 == 0 or found_count == len(asin_to_id):
                        print(f"-> Đã tìm thấy và khôi phục {found_count}/{len(asin_to_id)} sản phẩm...")
            except Exception:
                continue

    print("\n" + "=" * 50)
    print(f"Hoàn thành khôi phục dữ liệu gốc!")
    print(f"- Tìm thấy trong dataset Amazon: {found_count}")
    print(f"- Đã cập nhật lại tên và ảnh gốc: {updated_count}")
    print("=" * 50)

if __name__ == "__main__":
    restore_products()
