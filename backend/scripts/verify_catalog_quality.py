import sys
import pymongo
from collections import Counter

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

client = pymongo.MongoClient('mongodb://localhost:27017/')
db = client['ncf_recommender_db']

products = list(db.products.find())
print("==================================================")
print(f"TỔNG SỐ SẢN PHẨM TRONG DATABASE: {len(products)}")
print("==================================================")

# 1. Phân bố theo Môn thể thao (sport_type) & Loại sản phẩm (product_type)
sport_counts = Counter(p.get('sport_type') for p in products)
type_counts = Counter(p.get('product_type') for p in products)
print("\n--- PHÂN BỐ THEO MÔN THỂ THAO ---")
for s, c in sport_counts.most_common():
    print(f"  {s}: {c} sản phẩm")

print("\n--- PHÂN BỐ THEO LOẠI SẢN PHẨM ---")
for t, c in type_counts.most_common():
    print(f"  {t}: {c} sản phẩm")

# 2. Kiểm tra giá bán (price) theo phân khúc
print("\n--- KIỂM TRA PHÂN KHÚC GIÁ BÁN ---")
price_100k = sum(1 for p in products if p.get('price') == 100000.0)
print(f"  Số sản phẩm có giá cứng 100.000đ: {price_100k}")

clothing_prices = [p.get('price', 0) for p in products if p.get('product_type') == 'Quần áo']
shoes_equip_prices = [p.get('price', 0) for p in products if p.get('product_type') in ['Giày dép', 'Thiết bị']]
accessory_prices = [p.get('price', 0) for p in products if p.get('product_type') == 'Phụ kiện']

print(f"  Quần áo (Yêu cầu 290k-590k)          : min={min(clothing_prices):,.0f}đ, max={max(clothing_prices):,.0f}đ")
print(f"  Giày & Thiết bị (Yêu cầu 850k-2950k) : min={min(shoes_equip_prices):,.0f}đ, max={max(shoes_equip_prices):,.0f}đ")
print(f"  Phụ kiện (Yêu cầu 95k-250k)          : min={min(accessory_prices):,.0f}đ, max={max(accessory_prices):,.0f}đ")

# 3. Kiểm tra Đánh giá sao & Lượt đánh giá
print("\n--- KIỂM TRA ĐÁNH GIÁ VÀ XẾP HẠNG ---")
ratings = [p.get('rating', 0) for p in products]
reviews_counts = [p.get('reviews_count', 0) for p in products]
zero_ratings = sum(1 for r in ratings if r <= 0)
zero_reviews = sum(1 for c in reviews_counts if c <= 0)
print(f"  Sản phẩm có rating <= 0: {zero_ratings}")
print(f"  Sản phẩm có reviews <= 0: {zero_reviews}")
print(f"  Rating min={min(ratings):.1f}, max={max(ratings):.1f}, avg={sum(ratings)/len(ratings):.1f}")
print(f"  Reviews min={min(reviews_counts)}, max={max(reviews_counts)}, avg={sum(reviews_counts)/len(reviews_counts):.1f}")

# 4. Kiểm tra mảng ảnh phụ (images)
print("\n--- KIỂM TRA MẢNG ẢNH PHỤ (IMAGES) ---")
suspicious_images = 0
for p in products:
    for img in p.get('images', []):
        if 'photo-1535713875002' in img or 'photo-1494790108377' in img: # avatar photos
            suspicious_images += 1
print(f"  Số ảnh chân dung người/avatar bị lẫn vào ảnh sản phẩm: {suspicious_images}")

# 5. In mẫu 10 sản phẩm thực tế
print("\n--- MẪU 10 SẢN PHẨM THỰC TẾ TRONG DATABASE ---")
for i, p in enumerate(products[:10]):
    print(f"[{i+1}] {p['product_id']}")
    print(f"    Tên      : {p['name']}")
    print(f"    Danh mục : {p['sport_type']} > {p['product_type']} > {p.get('sub_category')}")
    print(f"    Giá      : {p['price']:,.0f}đ | Rating: {p['rating']}★ ({p['reviews_count']} đánh giá) | Đã bán: {p.get('sold', 0)}")
    print(f"    Ảnh chính: {p['image_url'][:70]}")
    print(f"    Ảnh phụ  : {len(p.get('images', []))} ảnh")
