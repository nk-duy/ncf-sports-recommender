import re
from typing import List
from app.models.product import Product

def filter_duplicate_recommendations(products: List[Product], max_count: int) -> List[Product]:
    """
    Bộ lọc khử trùng lặp 3 tầng khắt khe cho danh sách gợi ý:
    - Tầng 1: Không trùng product_id
    - Tầng 2: Không trùng tên gốc (chuẩn hóa cắt bỏ hậu tố Mẫu X, V123, màu, size...)
    - Tầng 3: Không trùng URL ảnh đại diện (image_url / main_image)
    """
    seen_ids = set()
    seen_images = set()
    seen_base_names = set()
    unique_products = []

    for p in products:
        if not p or p.product_id in seen_ids:
            continue

        name_str = p.name or ""
        base_name = re.sub(r'\s*-\s*Mẫu\s+\d+', '', name_str, flags=re.IGNORECASE).strip().lower()
        base_name = re.sub(r'\s*-\s*V\d+', '', base_name).strip()
        base_name = re.sub(r'\(.*?\)|\[.*?\]', '', base_name)
        base_name = re.sub(r'\s+', ' ', base_name).strip()[:35]

        img = (getattr(p, 'image_url', None) or getattr(p, 'main_image', None) or "").strip()

        if img and img in seen_images:
            continue
        if base_name and base_name in seen_base_names:
            continue

        seen_ids.add(p.product_id)
        if img:
            seen_images.add(img)
        if base_name:
            seen_base_names.add(base_name)

        unique_products.append(p)
        if len(unique_products) >= max_count:
            break

    return unique_products
