import json
import os
import shutil
import socket
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from types import SimpleNamespace
from typing import Any, Dict, List, Optional, Tuple

os.environ.setdefault("OMP_NUM_THREADS", "1")
os.environ.setdefault("MKL_NUM_THREADS", "1")
os.environ.setdefault("OPENBLAS_NUM_THREADS", "1")

import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if sys.stderr and hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from app.ml.visual_encoder import (
    VISUAL_FEATURE_DIM,
    encode_image_input,
    expand_48d_to_512d,
    get_encoder_backend_name,
    warm_load_visual_encoder,
)

SAVED_MODELS_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "app", "ml", "saved_models")
)
VISUAL_FEATURES_PATH = os.path.join(SAVED_MODELS_DIR, "visual_features.json")
VISUAL_FEATURES_48D_BACKUP_PATH = os.path.join(SAVED_MODELS_DIR, "visual_features_48d_backup.json")
MAPPINGS_PATH = os.path.join(SAVED_MODELS_DIR, "mappings.json")
AMAZON_CACHE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "data_cache", "amazon_extracted_cache.json")
)


def ensure_48d_backup() -> None:
    """Sao lưu visual_features.json (48D) sang visual_features_48d_backup.json trước khi chạy trích xuất mới."""
    if os.path.exists(VISUAL_FEATURES_48D_BACKUP_PATH):
        return
    if os.path.exists(VISUAL_FEATURES_PATH):
        shutil.copy2(VISUAL_FEATURES_PATH, VISUAL_FEATURES_48D_BACKUP_PATH)
        print(f"[Backup] Đã sao lưu bản 48D sang: {VISUAL_FEATURES_48D_BACKUP_PATH}", flush=True)


def is_external_network_available() -> bool:
    """Kiểm tra nhanh kết nối HTTP ngoài (timeout 0.6s) để tránh treo khi chạy trong môi trường offline/sandbox."""
    if os.environ.get("KADY_OFFLINE_EXTRACT") == "1":
        return False
    try:
        with socket.create_connection(("1.1.1.1", 443), timeout=0.6):
            return True
    except Exception:
        return False


def is_local_mongodb_listening() -> bool:
    """Kiểm tra nhanh cổng 27017 trong 0.3s để không chờ timeout 5s khi MongoDB đang tắt."""
    if os.environ.get("KADY_OFFLINE_EXTRACT") == "1":
        return False
    try:
        with socket.create_connection(("127.0.0.1", 27017), timeout=0.3):
            return True
    except Exception:
        return False


def load_products_with_fallback() -> List[Any]:
    """
    Đọc danh sách đủ 633 sản phẩm:
    - Nếu MongoDB đang chạy trên 127.0.0.1:27017 -> đọc trực tiếp collection products.
    - Bổ sung và fallback từ mappings.json + amazon_extracted_cache.json để đảm bảo đủ 100% 633 sản phẩm.
    """
    target_pids: List[str] = []
    if os.path.exists(MAPPINGS_PATH):
        with open(MAPPINGS_PATH, "r", encoding="utf-8") as f:
            mp = json.load(f)
            target_pids = list(mp.get("item_to_index", {}).keys())

    prod_by_id: Dict[str, Any] = {}

    if is_local_mongodb_listening():
        try:
            import asyncio
            from app.core.database import init_db
            from app.models.product import Product

            async def _fetch_mongo() -> List[Any]:
                await init_db()
                return await Product.find({"is_deleted": {"$ne": True}}).to_list()

            db_products = asyncio.run(_fetch_mongo())
            for p in db_products:
                prod_by_id[p.product_id] = p
            print(f"[MongoDB] Đã kết nối và tải {len(db_products)} sản phẩm từ database.", flush=True)
        except Exception as e:
            print(f"[MongoDB Warning] Không thể đọc từ MongoDB ({e}). Dùng nguồn cache cục bộ.", flush=True)
    else:
        print(
            "[MongoDB Info] Dịch vụ MongoDB (127.0.0.1:27017) đang dừng -> Dùng mappings.json & cache cục bộ (633 sản phẩm).",
            flush=True,
        )

    amz_cache: Dict[str, Any] = {}
    if os.path.exists(AMAZON_CACHE_PATH):
        try:
            with open(AMAZON_CACHE_PATH, "r", encoding="utf-8") as f:
                amz_cache = json.load(f)
        except Exception:
            amz_cache = {}

    for pid in target_pids:
        if pid not in prod_by_id:
            entry = amz_cache.get(pid, {})
            high_res = entry.get("highRes") or []
            regular = entry.get("regular") or []
            img_url = high_res[0] if high_res else (regular[0] if regular else "")
            prod_by_id[pid] = SimpleNamespace(
                product_id=pid,
                name=entry.get("title") or f"Product {pid}",
                image_url=img_url,
                sport_type="",
                rating=4.5,
                reviews_count=10,
            )

    return list(prod_by_id.values())


def extract_single_sync(
    product: Any,
    existing_url_cache: Dict[str, List[float]],
    net_online: bool,
    http_client: Any = None,
) -> Tuple[str, Optional[List[float]]]:
    pid = product.product_id
    img_url = (getattr(product, "image_url", "") or getattr(product, "main_image", "") or "").strip()
    if not img_url:
        return pid, None

    if img_url in existing_url_cache:
        return pid, existing_url_cache[img_url]

    try:
        if img_url.startswith("/uploads/") or img_url.startswith("uploads/"):
            local_path = os.path.join(os.path.dirname(__file__), "..", img_url.lstrip("/"))
            if os.path.exists(local_path):
                with open(local_path, "rb") as f:
                    img_bytes = f.read()
                feat_vec = encode_image_input(img_bytes)
                vec_list = [round(float(x), 5) for x in feat_vec]
                existing_url_cache[img_url] = vec_list
                return pid, vec_list

        if net_online and http_client is not None and (img_url.startswith("http://") or img_url.startswith("https://")):
            resp = http_client.get(img_url, timeout=4.0, follow_redirects=True)
            if resp.status_code == 200 and resp.content:
                feat_vec = encode_image_input(resp.content)
                vec_list = [round(float(x), 5) for x in feat_vec]
                existing_url_cache[img_url] = vec_list
                return pid, vec_list
    except Exception:
        pass

    return pid, None


def main() -> None:
    t0 = time.perf_counter()
    ensure_48d_backup()
    warm_load_visual_encoder()

    print("=" * 78, flush=True)
    print(
        f"  TRÍCH XUẤT VECTOR ĐẶC TRƯNG HÌNH ẢNH {VISUAL_FEATURE_DIM} CHIỀU "
        f"({get_encoder_backend_name()})",
        flush=True,
    )
    print("=" * 78, flush=True)

    products = load_products_with_fallback()
    net_online = is_external_network_available()
    print(
        f"Tổng số sản phẩm cần trích xuất: {len(products)} | Mạng tải ảnh trực tuyến: {'ONLINE' if net_online else 'OFFLINE'}",
        flush=True,
    )

    url_cache: Dict[str, List[float]] = {}
    visual_features_map: Dict[str, List[float]] = {}
    pixel_extracted_count = 0

    if net_online:
        import httpx

        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        with httpx.Client(headers=headers, verify=False) as client:
            with ThreadPoolExecutor(max_workers=16) as pool:
                results = list(
                    pool.map(
                        lambda p: extract_single_sync(p, url_cache, True, client),
                        products,
                    )
                )
    else:
        results = [extract_single_sync(p, url_cache, False, None) for p in products]

    backup_48d: Dict[str, np.ndarray] = {}
    if os.path.exists(VISUAL_FEATURES_48D_BACKUP_PATH):
        with open(VISUAL_FEATURES_48D_BACKUP_PATH, "r", encoding="utf-8") as bf:
            raw_48 = json.load(bf)
        for k, v in raw_48.items():
            if isinstance(v, list) and len(v) > 0:
                arr = np.array(v, dtype=np.float32)
                backup_48d[k] = arr / (np.linalg.norm(arr) + 1e-8)

    missing_pids: List[str] = []
    for pid, vec_list in results:
        if vec_list is not None and len(vec_list) == VISUAL_FEATURE_DIM:
            visual_features_map[pid] = vec_list
            pixel_extracted_count += 1
        else:
            missing_pids.append(pid)

    proj_count = 0
    global_default = np.ones(VISUAL_FEATURE_DIM, dtype=np.float32)
    global_default = global_default / (float(np.linalg.norm(global_default)) + 1e-8)

    for pid in missing_pids:
        if pid in backup_48d:
            vec512 = expand_48d_to_512d(backup_48d[pid])
            visual_features_map[pid] = [round(float(x), 5) for x in vec512]
            proj_count += 1
        else:
            visual_features_map[pid] = [round(float(x), 5) for x in global_default]

    os.makedirs(os.path.dirname(VISUAL_FEATURES_PATH), exist_ok=True)
    with open(VISUAL_FEATURES_PATH, "w", encoding="utf-8") as f:
        json.dump(visual_features_map, f, ensure_ascii=False, separators=(",", ":"))

    elapsed = round(time.perf_counter() - t0, 2)
    print(
        f"Hoàn tất trong {elapsed}s | Pixel trực tiếp: {pixel_extracted_count} | "
        f"Chiếu bảo toàn tương đồng 512D: {proj_count} | Tổng cộng: {len(visual_features_map)}/{len(products)}",
        flush=True,
    )
    print(
        f"Đã lưu cố định {len(visual_features_map)} vector {VISUAL_FEATURE_DIM}D tại: {VISUAL_FEATURES_PATH}",
        flush=True,
    )


if __name__ == "__main__":
    main()
