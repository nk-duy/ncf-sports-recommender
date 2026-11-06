"""
Chuẩn hóa mảng `variants` / `sizes` / `stock` của collection `products` (MongoDB: ncf_recommender_db)
theo từng nhóm sản phẩm:

  1. Giày dép             -> 38..44 (EU)
  2. Quần áo & trang phục -> S, M, L, XL, 2XL
  3. Vợt / bóng / thiết bị / phụ kiện:
       - Vợt Pickleball       -> "14mm (Công thủ)", "16mm (Kiểm soát)"
       - Vợt Cầu lông         -> "3U (85-89g)", "4U (80-84g)"
       - Vớ / Tất / Găng tay / Băng bảo vệ -> M, L, XL
       - Còn lại              -> "Tiêu chuẩn", "Bản Pro"

Lưu ý dữ liệu: trường `product_type` trong DB có nhiều bản ghi gán sai (vd. "Quả Bóng Chuyền" = "Giày dép",
"Giày Tập Gym" = "Quần áo"), nên bộ phân loại ưu tiên TÊN sản phẩm, sau đó mới dùng
sub_category / category / product_type làm dự phòng.

Cách dùng (chạy từ thư mục gốc dự án):
    backend/venv/Scripts/python.exe backend/scripts/normalize_product_variants.py            # dry-run (chỉ in báo cáo)
    backend/venv/Scripts/python.exe backend/scripts/normalize_product_variants.py --apply    # backup rồi ghi vào MongoDB

Script KHÔNG xóa / seed lại dữ liệu; chỉ cập nhật `variants`, `sizes`, `stock` (giữ nguyên `colors`).
Trước khi ghi, giá trị cũ được sao lưu ra backend/scripts/data_cache/variants_backup_<timestamp>.json.
"""
import argparse
import json
import os
import re
import sys
from collections import Counter
from datetime import datetime, timezone

from pymongo import MongoClient, UpdateOne

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017")
DB_NAME = os.getenv("MONGODB_DB_NAME", "ncf_recommender_db")

SHOE_SIZES = ["38", "39", "40", "41", "42", "43", "44"]
APPAREL_SIZES = ["S", "M", "L", "XL", "2XL"]
PICKLEBALL_SIZES = ["14mm (Công thủ)", "16mm (Kiểm soát)"]
BADMINTON_SIZES = ["3U (85-89g)", "4U (80-84g)"]
SMALL_GEAR_SIZES = ["M", "L", "XL"]
STANDARD_SIZES = ["Tiêu chuẩn", "Bản Pro"]

GROUP_SIZES = {
    "shoes": SHOE_SIZES,
    "apparel": APPAREL_SIZES,
    "pickleball_paddle": PICKLEBALL_SIZES,
    "badminton_racket": BADMINTON_SIZES,
    "small_gear": SMALL_GEAR_SIZES,
    "equipment": STANDARD_SIZES,
}


def _rx(words: str) -> "re.Pattern[str]":
    return re.compile(r"(?<!\w)(" + words + r")(?!\w)", re.IGNORECASE)


SHOE_RE = _rx(r"giày|ủng|dép|sandal|shoes?|sneakers?|boots?")
SHOE_START_RE = re.compile(r"^\s*(giày|ủng|dép|sandal|shoes?|sneakers?|boots?)(?!\w)", re.IGNORECASE)
APPAREL_RE = _rx(r"áo|quần|váy|bộ đồ|trang phục|shirts?|shorts?|jackets?|jerseys?|leggings?")
SMALL_GEAR_RE = _rx(r"vớ|tất|găng|băng|ống đồng|bảo vệ|gloves?|socks?")
# Phụ kiện đi kèm (không phải trang phục / giày / vợt dù tên có chữ giày, vợt...)
ACCESSORY_RE = _rx(
    r"túi|balo|ba lô|bình|bọc|quấn|chì dán|lót|đai|vòng tay|dây|mũ|nón|khăn|kính|đồng hồ|còi|kẹp|hộp"
)
EQUIPMENT_NAME_RE = _rx(r"quả bóng|bóng|lều|thảm|xe đạp|tạ|dây kháng lực|lưới|cột|gậy|ván")


def _text(*parts) -> str:
    out = []
    for p in parts:
        if isinstance(p, (list, tuple)):
            out.extend(str(x) for x in p if x)
        elif p:
            out.append(str(p))
    return " ".join(out)


def _racket_kind(name_l: str, sub_l: str, sport: str):
    if "pickleball" in name_l or "pickleball" in sub_l or sport == "Pickleball":
        return "pickleball_paddle"
    if "cầu lông" in name_l or "cầu lông" in sub_l or sport == "Cầu lông":
        return "badminton_racket"
    return None


def classify_product(doc: dict) -> str:
    """shoes | apparel | pickleball_paddle | badminton_racket | small_gear | equipment"""
    name = (doc.get("name") or "").strip()
    ptype = (doc.get("product_type") or "").strip()
    sport = (doc.get("sport_type") or "").strip()
    sub = (doc.get("sub_category") or "").strip()
    cats = doc.get("category") or []
    name_l, sub_l = name.lower(), sub.lower()
    meta = _text(sub, cats)  # sub_category + category

    # ---------- A. Theo TÊN sản phẩm (độ tin cậy cao nhất) ----------
    if name_l.startswith("vợt"):
        kind = _racket_kind(name_l, sub_l, sport)
        if kind:
            return kind
    if SHOE_START_RE.match(name):
        return "shoes"
    if APPAREL_RE.search(name):
        return "apparel"
    if SMALL_GEAR_RE.search(name):
        return "small_gear"
    if ACCESSORY_RE.search(name) or EQUIPMENT_NAME_RE.search(name):
        return "equipment"
    if SHOE_RE.search(name):
        return "shoes"

    # ---------- B. Tên chung chung (vd. "Phụ Kiện Thể Thao Cầu lông Yonex") -> dùng sub_category / category ----------
    if sub_l.startswith("vợt"):
        kind = _racket_kind(name_l, sub_l, sport)
        if kind:
            return kind
    if SMALL_GEAR_RE.search(meta):
        return "small_gear"
    if ACCESSORY_RE.search(sub) or EQUIPMENT_NAME_RE.search(sub):
        return "equipment"
    if SHOE_RE.search(meta):
        return "shoes"
    if APPAREL_RE.search(meta):
        return "apparel"

    # ---------- C. Dự phòng theo product_type ----------
    if ptype == "Giày dép":
        return "shoes"
    if ptype == "Quần áo":
        return "apparel"
    return "equipment"


def build_variants(doc: dict, group: str):
    sizes = GROUP_SIZES[group]
    colors = [c for c in (doc.get("colors") or []) if c] or [""]
    pid = doc.get("product_id", "SKU")
    base_stock = doc.get("stock")
    base_stock = base_stock if isinstance(base_stock, int) and base_stock > 0 else 100
    per_variant = max(5, base_stock // max(1, len(sizes) * len(colors)))

    def slug(s: str) -> str:
        s = re.sub(r"\s*\(.*?\)", "", s).strip()
        s = re.sub(r"[^0-9A-Za-z]+", "", s.upper())
        return s or "STD"

    variants = []
    for ci, color in enumerate(colors):
        for size in sizes:
            sku = f"{pid}-{slug(size)}" if color == "" else f"{pid}-C{ci + 1}-{slug(size)}"
            variants.append({"color": color, "size": size, "stock": per_variant, "sku": sku})
    return variants


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="Ghi thay đổi vào MongoDB (mặc định chỉ dry-run)")
    args = ap.parse_args()

    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
    col = client[DB_NAME]["products"]
    docs = list(col.find({}))
    print(f"[i] Đã đọc {len(docs)} sản phẩm từ {DB_NAME}.products")

    groups = Counter()
    cross = Counter()
    samples = {}
    ops, backup = [], []
    for d in docs:
        g = classify_product(d)
        groups[g] += 1
        cross[(d.get("product_type"), g)] += 1
        samples.setdefault(g, []).append(
            f"{d.get('product_id')} | {d.get('product_type')} | {d.get('sub_category')} | {d.get('name')}"
        )
        variants = build_variants(d, g)
        backup.append({
            "_id": str(d["_id"]), "product_id": d.get("product_id"),
            "sizes": d.get("sizes"), "variants": d.get("variants"), "stock": d.get("stock"),
        })
        ops.append(UpdateOne(
            {"_id": d["_id"]},
            {"$set": {"variants": variants, "sizes": list(GROUP_SIZES[g]),
                      "stock": sum(v["stock"] for v in variants),
                      "updated_at": datetime.now(timezone.utc).replace(tzinfo=None)}},
        ))

    print("[i] Phân nhóm:", dict(groups))
    print("[i] Đối chiếu product_type (DB) -> nhóm size:")
    for (pt, g), n in sorted(cross.items(), key=lambda x: (str(x[0][0]), x[0][1])):
        print(f"     {pt!s:10} -> {g:18} {n}")
    for g, items in samples.items():
        print(f"\n--- {g} ({len(items)}) — mẫu ---")
        step = max(1, len(items) // 8)
        for s in items[::step][:8]:
            print("   ", s)

    if not args.apply:
        print("\n[DRY-RUN] Chưa ghi gì vào MongoDB. Thêm --apply để thực thi.")
        return

    cache_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data_cache")
    os.makedirs(cache_dir, exist_ok=True)
    backup_path = os.path.join(cache_dir, f"variants_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    with open(backup_path, "w", encoding="utf-8") as f:
        json.dump(backup, f, ensure_ascii=False, default=str)
    print(f"[i] Đã sao lưu dữ liệu cũ -> {backup_path}")

    res = col.bulk_write(ops, ordered=False)
    print(f"[OK] Đã cập nhật {res.modified_count}/{len(ops)} sản phẩm.")


if __name__ == "__main__":
    main()
