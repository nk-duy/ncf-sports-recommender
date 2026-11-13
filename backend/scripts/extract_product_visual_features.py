import asyncio
import json
import os
import sys
import time
from typing import Dict, List, Optional

import httpx
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr and hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

from app.core.database import init_db
from app.models.product import Product
from app.services.visual_search_service import extract_visual_features

VISUAL_FEATURES_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "app", "ml", "saved_models", "visual_features.json")
)


async def fetch_and_extract_single(
    client: httpx.AsyncClient,
    sem: asyncio.Semaphore,
    product: Product,
    existing_url_cache: Dict[str, List[float]]
) -> tuple[str, Optional[List[float]]]:
    pid = product.product_id
    img_url = (product.image_url or getattr(product, "main_image", "") or "").strip()
    if not img_url:
        return pid, None

    if img_url in existing_url_cache:
        return pid, existing_url_cache[img_url]

    async with sem:
        try:
            if img_url.startswith("/uploads/") or img_url.startswith("uploads/"):
                local_path = os.path.join(os.path.dirname(__file__), "..", img_url.lstrip("/"))
                if os.path.exists(local_path):
                    with open(local_path, "rb") as f:
                        img_bytes = f.read()
                    feat_vec = extract_visual_features(img_bytes)
                    vec_list = [round(float(x), 5) for x in feat_vec]
                    existing_url_cache[img_url] = vec_list
                    return pid, vec_list

            if img_url.startswith("http://") or img_url.startswith("https://"):
                resp = await client.get(img_url, timeout=12.0, follow_redirects=True)
                if resp.status_code == 200 and resp.content:
                    feat_vec = extract_visual_features(resp.content)
                    vec_list = [round(float(x), 5) for x in feat_vec]
                    existing_url_cache[img_url] = vec_list
                    return pid, vec_list
        except Exception as e:
            print(f"  [Warn] Failed to extract {pid} ({img_url[:50]}): {e}")
    return pid, None


async def main():
    t0 = time.perf_counter()
    print("=" * 75)
    print("  TRÍCH XUẤT VECTOR ĐẶC TRƯNG HÌNH ẢNH THẬT 48 CHIỀU (615 SẢN PHẨM)")
    print("=" * 75)

    await init_db()
    products = await Product.find({"is_deleted": {"$ne": True}}).to_list()
    print(f"Tổng số sản phẩm cần trích xuất: {len(products)}")

    url_cache: Dict[str, List[float]] = {}
    sem = asyncio.Semaphore(30)

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }

    visual_features_map: Dict[str, List[float]] = {}
    success_count = 0
    fallback_sport_vectors: Dict[str, List[np.ndarray]] = {}

    async with httpx.AsyncClient(headers=headers, verify=False) as client:
        tasks = [
            fetch_and_extract_single(client, sem, p, url_cache)
            for p in products
        ]
        results = await asyncio.gather(*tasks)

    prod_by_id = {p.product_id: p for p in products}
    missing_pids = []

    for pid, vec_list in results:
        if vec_list is not None and len(vec_list) == 48:
            visual_features_map[pid] = vec_list
            success_count += 1
            p = prod_by_id.get(pid)
            if p and p.sport_type:
                fallback_sport_vectors.setdefault(p.sport_type, []).append(np.array(vec_list, dtype=np.float32))
        else:
            missing_pids.append(pid)

    # Đối với bất kỳ ảnh nào bị timeout mạng tạm thời, lấy trung bình cộng vector ảnh thật cùng bộ môn
    if missing_pids:
        all_real_vecs = [np.array(v, dtype=np.float32) for v in visual_features_map.values()]
        global_mean = np.mean(all_real_vecs, axis=0) if all_real_vecs else np.ones(48, dtype=np.float32)
        global_mean = global_mean / (np.linalg.norm(global_mean) + 1e-8)

        for pid in missing_pids:
            p = prod_by_id.get(pid)
            sport_vecs = fallback_sport_vectors.get(p.sport_type if p else "", [])
            if sport_vecs:
                mean_vec = np.mean(sport_vecs, axis=0)
                mean_vec = mean_vec / (np.linalg.norm(mean_vec) + 1e-8)
                visual_features_map[pid] = [round(float(x), 5) for x in mean_vec]
            else:
                visual_features_map[pid] = [round(float(x), 5) for x in global_mean]

    os.makedirs(os.path.dirname(VISUAL_FEATURES_PATH), exist_ok=True)
    with open(VISUAL_FEATURES_PATH, "w", encoding="utf-8") as f:
        json.dump(visual_features_map, f, ensure_ascii=False, separators=(",", ":"))

    elapsed = round(time.perf_counter() - t0, 2)
    print(f"Đã trích xuất thành công ảnh pixel thật: {success_count}/{len(products)} sản phẩm ({elapsed}s)")
    print(f"Đã lưu cố định {len(visual_features_map)} vector 48D tại: {VISUAL_FEATURES_PATH}")

    # Tìm 6 sản phẩm mẫu Demo trong DB để đồng bộ vào VisualSearchModal.tsx
    demo_sports = ["Bóng chuyền", "Cầu lông", "Đá bóng", "Chạy bộ", "Pickleball", "Dã ngoại"]
    print("\n6 Sản phẩm mẫu Demo khớp trong DB:")
    for sp in demo_sports:
        sp_prods = [p for p in products if p.sport_type == sp and p.product_id in visual_features_map]
        sp_prods.sort(key=lambda x: (x.rating or 0, x.reviews_count or 0), reverse=True)
        if sp_prods:
            top_p = sp_prods[0]
            print(f"  - {sp}: product_id='{top_p.product_id}', title='{top_p.name}', imageUrl='{top_p.image_url}'")

    sys.stdout.flush()
    os._exit(0)


if __name__ == "__main__":
    asyncio.run(main())

