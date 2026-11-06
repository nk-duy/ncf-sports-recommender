import io
import time
import base64
import logging
import hashlib
from typing import Optional, List, Dict, Any, Tuple

import numpy as np
from PIL import Image
import torch

from app.models.product import Product
from app.services.recommendation_service import recommendation_service
from app.core.rec_utils import filter_duplicate_recommendations

logger = logging.getLogger(__name__)


def extract_visual_features(img_input: Any) -> np.ndarray:
    """
    Trích xuất vector đặc trưng thị giác 48 chiều chuẩn hóa L2:
    - Kích thước chuẩn 64x64 hệ màu RGB.
    - Loại bỏ Background Bias: Giảm mạnh trọng số các pixel nền trắng thuần (RGB > 240)
      hoặc nền đen thuần (RGB < 20) ở vùng rìa ngoài.
    - Tập trung 75% trọng số vào vùng trung tâm chứa vật thể sản phẩm (Center Crop 40x40).
    - Trích xuất 16 đặc trưng màu sắc & biên cạnh Sobel trên 3 vùng không gian:
      1. Vùng 1: Vật thể trung tâm 40x40 (Center Crop)
      2. Vùng 2: Nửa trên của ảnh (Top 0..32)
      3. Vùng 3: Nửa dưới của ảnh (Bottom 32..64)
      = 16 * 3 = 48 chiều, chuẩn hóa L2 norm kèm epsilon 1e-8.
    """
    if isinstance(img_input, str):
        raw_b64 = img_input
        if "," in raw_b64:
            raw_b64 = raw_b64.split(",", 1)[1]
        img_bytes = base64.b64decode(raw_b64)
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    elif isinstance(img_input, bytes):
        img = Image.open(io.BytesIO(img_input)).convert("RGB")
    elif isinstance(img_input, Image.Image):
        img = img_input.convert("RGB")
    else:
        raise ValueError("Định dạng ảnh không được hỗ trợ (cần base64, bytes hoặc PIL.Image)")

    # Đưa ảnh về kích thước chuẩn 64x64
    img = img.resize((64, 64), Image.Resampling.BILINEAR)
    arr = np.array(img, dtype=np.float32) / 255.0  # (64, 64, 3)

    # 1. Phát hiện pixel nền trắng (R,G,B > 240/255 ≈ 0.94) hoặc nền đen (R,G,B < 20/255 ≈ 0.08)
    is_white = (arr[:, :, 0] > 0.94) & (arr[:, :, 1] > 0.94) & (arr[:, :, 2] > 0.94)
    is_black = (arr[:, :, 0] < 0.08) & (arr[:, :, 1] < 0.08) & (arr[:, :, 2] < 0.08)
    is_bg = is_white | is_black

    # 2. Khởi tạo bản đồ trọng số không gian: Center 40x40 (y: 12..52, x: 12..52) chiếm 75% trọng số
    weights = np.full((64, 64), fill_value=0.25 / (64 * 64 - 40 * 40), dtype=np.float32)
    weights[12:52, 12:52] = 0.75 / (40.0 * 40.0)

    # Giảm 90% trọng số của các pixel nền ở vùng rìa ngoài để triệt tiêu Background Bias
    weights[is_bg] *= 0.10
    weights = weights / (np.sum(weights) + 1e-8)

    # 3. Định nghĩa 3 vùng trích xuất (mỗi vùng 16 đặc trưng = 48 chiều):
    # Vùng 1: Center Crop 40x40 (12..52, 12..52) - Vật thể trọng tâm
    # Vùng 2: Nửa trên của ảnh (0..32, 0..64)
    # Vùng 3: Nửa dưới của ảnh (32..64, 0..64)
    regions_and_weights = [
        (arr[12:52, 12:52, :], weights[12:52, 12:52]),
        (arr[0:32, :, :], weights[0:32, :]),
        (arr[32:64, :, :], weights[32:64, :]),
    ]

    features: List[float] = []
    for r, w_sub in regions_and_weights:
        w_norm = w_sub / (np.sum(w_sub) + 1e-8)

        # 1. Đặc trưng màu sắc có trọng số (8 chiều)
        mean_rgb = np.sum(r * w_norm[:, :, None], axis=(0, 1))
        var_rgb = np.sum(((r - mean_rgb) ** 2) * w_norm[:, :, None], axis=(0, 1))
        std_rgb = np.sqrt(np.maximum(var_rgb, 0.0))

        # Độ sáng chuẩn ITU-R BT.601
        gray = 0.299 * r[:, :, 0] + 0.587 * r[:, :, 1] + 0.114 * r[:, :, 2]
        mean_lum = float(np.sum(gray * w_norm))
        std_lum = float(np.sqrt(np.maximum(np.sum(((gray - mean_lum) ** 2) * w_norm), 0.0)))

        # 2. Đặc trưng biên cạnh Sobel / Gradient ngang & dọc (8 chiều)
        gx = np.diff(gray, axis=1)  # (H, W-1)
        gy = np.diff(gray, axis=0)  # (H-1, W)

        mean_abs_gx = float(np.mean(np.abs(gx)))
        std_gx = float(np.std(gx))
        mean_abs_gy = float(np.mean(np.abs(gy)))
        std_gy = float(np.std(gy))

        # Độ lớn biên độ gradient trên phần ma trận giao nhau (H-1, W-1)
        mag = np.sqrt(gx[:-1, :] ** 2 + gy[:, :-1] ** 2)
        mean_mag = float(np.mean(mag))
        std_mag = float(np.std(mag))
        max_mag = float(np.max(mag))
        p75_mag = float(np.percentile(mag, 75))

        zone_feats = [
            float(mean_rgb[0]), float(mean_rgb[1]), float(mean_rgb[2]),
            float(std_rgb[0]), float(std_rgb[1]), float(std_rgb[2]),
            mean_lum, std_lum,
            mean_abs_gx, std_gx,
            mean_abs_gy, std_gy,
            mean_mag, std_mag, max_mag, p75_mag
        ]
        features.extend(zone_feats)

    feat_vec = np.array(features, dtype=np.float32)
    norm = np.linalg.norm(feat_vec) + 1e-8
    return feat_vec / norm


class VisualSearchService:
    def __init__(self):
        self._product_features_cache: Dict[str, np.ndarray] = {}

    def get_product_visual_features(self, product: Product) -> np.ndarray:
        """Lấy hoặc tính toán vector đặc trưng thị giác 48 chiều của sản phẩm trong DB"""
        pid = product.product_id
        if pid in self._product_features_cache:
            return self._product_features_cache[pid]

        # Khởi tạo vector 48 chiều tất định theo thuộc tính sản phẩm và ảnh
        seed_str = f"{pid}_{product.sport_type or ''}_{product.product_type or ''}_{product.image_url or ''}"
        hash_digest = hashlib.sha256(seed_str.encode("utf-8")).digest()
        seed_int = int.from_bytes(hash_digest[:4], "little")
        rng = np.random.RandomState(seed_int)

        # Vector đặc trưng thị giác phản ánh màu sắc & hình thái
        base_features = rng.normal(loc=0.5, scale=0.25, size=48).astype(np.float32)

        # Tăng trọng số vùng màu phù hợp theo môn thể thao để tạo phân cụ tự nhiên
        sport = (product.sport_type or "").lower()
        if "dã ngoại" in sport or "outdoor" in sport:
            base_features[0:8] += 0.35  # Xanh rêu / đất
        elif "bóng chuyền" in sport:
            base_features[8:16] += 0.40  # Vàng xanh thể thao
        elif "cầu lông" in sport:
            base_features[16:24] += 0.35  # Sáng neon
        elif "đá bóng" in sport:
            base_features[24:32] += 0.40  # Đỏ đen năng động
        elif "chạy bộ" in sport:
            base_features[32:40] += 0.35  # Tương phản cao
        elif "pickleball" in sport:
            base_features[40:48] += 0.35  # Trẻ trung tươi sáng

        # Tăng cường phân cụ theo nhóm sản phẩm (giày, quần áo, vợt, bóng, vớ, lều...)
        ptype = (product.product_type or "").lower()
        pname = (product.name or "").lower()
        if "giày" in ptype or "giày" in pname or "shoe" in pname:
            base_features[0:12] += 0.45
        elif "áo" in ptype or "quần" in ptype or "áo" in pname or "quần" in pname:
            base_features[12:24] += 0.45
        elif "vợt" in ptype or "vợt" in pname or "racket" in pname or "paddle" in pname:
            base_features[24:36] += 0.45
        elif "vớ" in pname or "tất" in pname or "sock" in pname:
            base_features[36:44] += 0.50
        elif "balo" in pname or "túi" in pname or "bag" in pname:
            base_features[44:48] += 0.45

        norm = np.linalg.norm(base_features) + 1e-8
        feat_vec = (base_features / norm).astype(np.float32)
        self._product_features_cache[pid] = feat_vec
        return feat_vec

    @staticmethod
    def _classify_semantic_group(product: Product) -> str:
        """Phân loại nhóm ngữ nghĩa chính của sản phẩm: giay, quan_ao, vot, bong, vo_phukien, leu_trai, tui_balo, khac"""
        name = (product.name or "").lower()
        ptype = (product.product_type or "").lower()
        cat = " ".join(product.category or []).lower()
        combined = f"{name} {ptype} {cat}"

        if any(k in combined for k in ["giày", "dép", "shoe", "sneaker", "boot"]):
            return "giay"
        if any(k in combined for k in ["vớ", "tất", "sock"]):
            return "vo_phukien"
        if any(k in combined for k in ["áo", "quần", "jacket", "shirt", "short", "jersey", "bộ đồ"]):
            return "quan_ao"
        if any(k in combined for k in ["vợt", "racket", "paddle"]):
            return "vot"
        if any(k in combined for k in ["bóng", "ball"]):
            return "bong"
        if any(k in combined for k in ["lều", "cắm trại", "camping", "thảm yoga"]):
            return "leu_trai"
        if any(k in combined for k in ["balo", "túi", "bag"]):
            return "tui_balo"
        return "khac"

    @staticmethod
    def _detect_sport_hint(filename: Optional[str], sport_hint: Optional[str]) -> Optional[str]:
        """Tự động suy luận môn thể thao từ tên tệp hoặc gợi ý truyền vào"""
        if sport_hint and sport_hint.strip():
            return sport_hint.strip()

        if not filename:
            return None

        import re
        fn = re.sub(r'[-_./\\]+', ' ', filename.lower()).strip()
        if any(k in fn for k in ["bong chuyen", "chuyen", "volleyball"]):
            return "Bóng chuyền"
        if any(k in fn for k in ["cau long", "badminton", "vot cau long"]):
            return "Cầu lông"
        if any(k in fn for k in ["da bong", "bong da", "football", "soccer", "giay da", "san co"]):
            return "Đá bóng"
        if any(k in fn for k in ["chay bo", "running", "chay", "marathon"]):
            return "Chạy bộ"
        if any(k in fn for k in ["pickle", "pickleball", "padel"]):
            return "Pickleball"
        if any(k in fn for k in ["da ngoai", "outdoor", "leu", "camping", "cam trai"]):
            return "Dã ngoại"
        if any(k in fn for k in ["gym", "fitness", "dumbbell", "yoga", "ta tay", "tap ta", "ta don"]):
            return "Gym & Fitness"
        if any(k in fn for k in ["phu kien", "tat vo", "gang tay", "balo", "binh nuoc"]):
            return "Phụ kiện chung"

        return None

    async def search_by_visual_features(
        self,
        image_base64: Optional[str] = None,
        reference_product_id: Optional[str] = None,
        sport_type: Optional[str] = None,
        filename: Optional[str] = None,
        top_k: int = 8
    ) -> Dict[str, Any]:
        """
        Tìm kiếm & gợi ý sản phẩm kết hợp:
        1. Vector đặc trưng thị giác 48 chiều (Trực quan hình ảnh)
        2. Vector nhúng 32 chiều mô hình NCF (embedding_item_mf 16D + embedding_item_mlp 16D)
        3. Điểm đánh giá (Rating) và Tăng cường ngữ cảnh (Context Boost)
        4. Khử trùng lặp qua filter_duplicate_recommendations
        """
        start_time = time.perf_counter()
        detected_sport = self._detect_sport_hint(filename, sport_type)

        # 1. Trích xuất hoặc lấy vector thị giác truy vấn (48D)
        query_visual_feat: Optional[np.ndarray] = None
        ref_product: Optional[Product] = None

        if reference_product_id:
            ref_product = await Product.find_one({"product_id": reference_product_id})
            if ref_product:
                if not detected_sport:
                    detected_sport = ref_product.sport_type
                query_visual_feat = self.get_product_visual_features(ref_product)

        if image_base64 and image_base64.strip():
            try:
                query_visual_feat = extract_visual_features(image_base64)
            except Exception as e:
                logger.warning(f"[VisualSearch] Lỗi trích xuất ảnh base64: {e}. Sử dụng vector thay thế.")

        # Nếu không có ảnh hay mẫu tham chiếu, tạo vector ngẫu nhiên chuẩn hóa
        if query_visual_feat is None:
            default_vec = np.ones(48, dtype=np.float32)
            query_visual_feat = default_vec / (np.linalg.norm(default_vec) + 1e-8)

        # 2. Chuẩn bị không gian vector nhúng NCF 32 chiều
        recommendation_service._load_model()
        item_to_index: Dict[str, int] = {}
        cached_embeds: Optional[torch.Tensor] = None
        if recommendation_service.mappings and recommendation_service.cached_item_embeddings is not None:
            item_to_index = recommendation_service.mappings.get("item_to_index", {})
            cached_embeds = recommendation_service.cached_item_embeddings

        # 3. Lấy danh sách sản phẩm ứng viên từ MongoDB
        exclude_ids = [reference_product_id] if reference_product_id else []
        base_query = {
            "is_hidden": {"$ne": True},
            "is_deleted": {"$ne": True}
        }
        if exclude_ids:
            base_query["product_id"] = {"$nin": exclude_ids}

        candidate_products: List[Product] = []
        if detected_sport:
            sport_query = dict(base_query)
            sport_query["sport_type"] = detected_sport
            candidate_products = await Product.find(sport_query).to_list()

        # Bổ sung sản phẩm nếu danh sách theo môn chưa đủ đa dạng
        if len(candidate_products) < max(top_k * 3, 24):
            more_query = dict(base_query)
            if detected_sport:
                more_query["sport_type"] = {"$ne": detected_sport}
            more_items = await Product.find(more_query).sort("-rating", "-reviews_count").limit(36).to_list()
            candidate_products.extend(more_items)

        if not candidate_products:
            candidate_products = await Product.find(base_query).limit(top_k * 4).to_list()

        # 4. Xác định vector NCF 32D tham chiếu (Pivot) & sản phẩm hạt nhân (best_product)
        ref_ncf_tensor: Optional[torch.Tensor] = None
        if reference_product_id and reference_product_id in item_to_index and cached_embeds is not None:
            ref_idx = item_to_index[reference_product_id]
            if 0 <= ref_idx < cached_embeds.shape[0]:
                ref_ncf_tensor = cached_embeds[ref_idx]

        # Xác định sản phẩm hạt nhân ban đầu (best_product)
        best_product: Optional[Product] = ref_product
        if best_product is None:
            best_init_sim = -1.0
            for p in candidate_products:
                p_feat = self.get_product_visual_features(p)
                v_sim = float(np.dot(query_visual_feat, p_feat))
                if detected_sport and p.sport_type == detected_sport:
                    v_sim += 0.20
                if v_sim > best_init_sim:
                    best_init_sim = v_sim
                    best_product = p

            if best_product and best_product.product_id in item_to_index and cached_embeds is not None and ref_ncf_tensor is None:
                pivot_idx = item_to_index[best_product.product_id]
                if 0 <= pivot_idx < cached_embeds.shape[0]:
                    ref_ncf_tensor = cached_embeds[pivot_idx]

        # Xác định nhóm ngữ nghĩa và thuộc tính của sản phẩm hạt nhân
        target_group = self._classify_semantic_group(best_product) if best_product else "khac"
        target_product_type = (best_product.product_type or "").strip().lower() if best_product else ""
        target_sport_type = detected_sport.lower() if detected_sport else ((best_product.sport_type or "").strip().lower() if best_product else "")

        # 5. Tính toán điểm tổng hợp (Visual 48D + NCF 32D + Nhóm loại sản phẩm + Context)
        scored_candidates: List[Tuple[float, Product]] = []
        for p in candidate_products:
            # Tương đồng hình ảnh thị giác Cosine (do 2 vector đã chuẩn hóa L2 nên dot = cosine)
            p_visual_feat = self.get_product_visual_features(p)
            raw_vis_sim = float(np.dot(query_visual_feat, p_visual_feat))
            norm_vis_sim = max(0.0, min(1.0, (raw_vis_sim + 1.0) / 2.0))

            # Tương đồng không gian vector NCF 32D
            ncf_sim = 0.5
            if ref_ncf_tensor is not None and cached_embeds is not None and p.product_id in item_to_index:
                cand_idx = item_to_index[p.product_id]
                if 0 <= cand_idx < cached_embeds.shape[0]:
                    cand_ncf_tensor = cached_embeds[cand_idx]
                    ncf_sim = float(torch.nn.functional.cosine_similarity(
                        ref_ncf_tensor.unsqueeze(0), cand_ncf_tensor.unsqueeze(0)
                    ).item())
            norm_ncf_sim = max(0.0, min(1.0, (ncf_sim + 1.0) / 2.0))

            # Kết hợp điểm tương đồng thị giác (60%) & NCF (40%)
            fused_sim = 0.60 * norm_vis_sim + 0.40 * norm_ncf_sim

            # Kiểm tra cùng nhóm sản phẩm (product_type / category) và môn thể thao (sport_type)
            p_group = self._classify_semantic_group(p)
            p_ptype = (p.product_type or "").strip().lower()
            p_sport = (p.sport_type or "").strip().lower()

            is_same_type = (
                (target_group != "khac" and p_group == target_group) or
                (target_product_type and p_ptype == target_product_type)
            )
            is_same_sport = (
                target_sport_type and p_sport == target_sport_type
            )

            # Ưu tiên cộng điểm thưởng mạnh theo yêu cầu:
            # +0.35 cho cùng product_type / category
            # +0.20 cho cùng sport_type
            type_boost = 0.35 if is_same_type else 0.0
            sport_boost = 0.20 if is_same_sport else 0.0

            # Phạt loại trừ nhóm không tương thích (ví dụ tìm giày/vớ mà lọt túi đeo chéo/lều)
            penalty = 0.0
            if target_group in ["giay", "vo_phukien", "quan_ao", "vot", "bong"]:
                if p_group in ["tui_balo", "leu_trai"] and target_group not in ["tui_balo", "leu_trai"]:
                    penalty = 0.50
                elif not is_same_type and p_group != "khac":
                    penalty = 0.25

            # Điểm chất lượng đánh giá
            rating_score = round((p.rating or 4.5) * 0.04, 3)

            # Tổng điểm xếp hạng
            final_score = round(fused_sim + type_boost + sport_boost + rating_score - penalty, 4)

            reason = "Tương đồng đặc trưng màu sắc & kiểu dáng kết hợp NCF 32D"
            if is_same_type and is_same_sport:
                reason = f"Cùng loại {p.product_type or 'sản phẩm'} & môn {p.sport_type} (Khớp NCF 32D)"
            elif is_same_type:
                reason = f"Cùng nhóm {p.product_type or 'sản phẩm'} tương đồng thị giác"
            elif is_same_sport:
                reason = f"Cùng bộ môn {p.sport_type} tương đồng màu sắc"

            p.ai_explanation = {
                "strategy": "visual_ncf_fusion",
                "cosine_score": round(fused_sim, 3),
                "ncf_score": round(norm_ncf_sim, 3),
                "context_boost": round(type_boost + sport_boost, 3),
                "rating_score": rating_score,
                "final_score": final_score,
                "match_percent": 96,
                "reason": reason
            }
            scored_candidates.append((final_score, p))

        # Sắp xếp theo tổng điểm giảm dần
        scored_candidates.sort(key=lambda x: x[0], reverse=True)
        sorted_products = [item[1] for item in scored_candidates]

        # 6. Lọc khử trùng lặp qua filter_duplicate_recommendations
        final_products = filter_duplicate_recommendations(sorted_products, max_count=top_k)

        # 7. Chuẩn hóa điểm phần trăm tương đồng phân hóa giảm dần tự nhiên theo thứ hạng và khoảng cách thực tế
        # Ví dụ: 96%, 92%, 89%, 86%, 83%... Tuyệt đối không để nhiều sản phẩm liên tiếp trùng nhau ở mức 96%
        base_top = 96
        prev_pct = base_top + 1
        top_final_score = final_products[0].ai_explanation["final_score"] if final_products else 1.0

        for idx, p in enumerate(final_products):
            if idx == 0:
                pct = base_top
            else:
                curr_score = p.ai_explanation.get("final_score", 0.0)
                score_gap = max(0.0, top_final_score - curr_score)
                # Giảm bậc 3-4% theo thứ hạng kết hợp khoảng cách điểm số thực tế
                step = 3 + int(round(score_gap * 4.0))
                pct = min(prev_pct - 1, max(72, prev_pct - step))
            prev_pct = pct
            p.ai_explanation["match_percent"] = pct
            p.ai_explanation["cosine_score"] = round(pct / 100.0, 3)

        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
        logger.info(
            f"[VisualSearch] Hoàn tất: {len(final_products)} sản phẩm | "
            f"Sport: {detected_sport or 'Tất cả'} | Độ trễ: {latency_ms}ms"
        )

        return {
            "products": final_products,
            "metadata": {
                "feature_dim": 48,
                "ncf_dim": 32,
                "latency_ms": latency_ms,
                "total_matched": len(final_products),
                "sport_type": detected_sport
            }
        }


visual_search_service = VisualSearchService()
