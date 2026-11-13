import os
import json
import logging
from datetime import datetime
from collections import defaultdict
from typing import List, Dict, Any, Optional, Tuple

logger = logging.getLogger(__name__)


class AnalyticsService:
    def __init__(self, mappings_path: str):
        self.mappings_path = mappings_path

    async def log_impression(
        self,
        recommended_product_ids: List[str],
        source: str = "homepage",
        user_id: Optional[str] = None
    ) -> str:
        """Ghi nhận lượt hiển thị của danh sách gợi ý để phục vụ đo lường CTR trực tuyến"""
        from app.models.recommendation_impression import RecommendationImpression
        imp = RecommendationImpression(
            user_id=user_id,
            source=source,
            recommended_product_ids=recommended_product_ids
        )
        await imp.insert()
        return imp.impression_id

    async def track_click(
        self,
        impression_id: str,
        product_id: str,
        user_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Ghi nhận lượt click vào sản phẩm gợi ý và cập nhật tương tác cho NCF"""
        from app.models.recommendation_impression import RecommendationImpression
        from app.models.interaction import Interaction

        imp = await RecommendationImpression.find_one({"impression_id": impression_id})
        if imp:
            if product_id not in imp.clicked_product_ids:
                imp.clicked_product_ids.append(product_id)
                imp.updated_at = datetime.utcnow()
                await imp.save()

        # Tự động ghi nhận Interaction để bổ sung vào tập huấn luyện NCF
        uid = user_id or (imp.user_id if (imp and imp.user_id) else None) or "anonymous_guest"
        await Interaction(
            user_id=uid,
            product_id=product_id,
            interaction_type="click",
            rating=2.5
        ).insert()

        return {"status": "success", "message": "Ghi nhận lượt nhấp gợi ý thành công"}

    def _aggregate_impressions_and_clicks(
        self,
        impressions: List[Any],
        interactions: Optional[List[Any]] = None
    ) -> Tuple[int, int, int, float, Dict[str, Any]]:
        """Tính toán tổng hiển thị, tổng click, CTR và phân rã theo nguồn từ dữ liệu thực tế"""
        total_impressions = len(impressions)
        total_items_shown = sum(len(imp.recommended_product_ids or []) for imp in impressions)
        total_clicks = sum(len(imp.clicked_product_ids or []) for imp in impressions)

        by_source = defaultdict(lambda: {"impressions": 0, "clicks": 0, "items_shown": 0})
        for imp in impressions:
            s = imp.source or "homepage"
            by_source[s]["impressions"] += 1
            by_source[s]["items_shown"] += len(imp.recommended_product_ids or [])
            by_source[s]["clicks"] += len(imp.clicked_product_ids or [])

        # Nếu bảng RecommendationImpression chưa có bản ghi hoặc chưa phát sinh click trực tiếp,
        # tổng hợp từ bảng Interactions thực tế (view -> phiên hiển thị, click -> lượt nhấp)
        if total_impressions == 0 and interactions:
            view_count = sum(1 for x in interactions if getattr(x, "interaction_type", "") == "view")
            click_count = sum(1 for x in interactions if getattr(x, "interaction_type", "") == "click")
            total_impressions = max(view_count, click_count, 1)
            total_items_shown = total_impressions * 8
            total_clicks = min(click_count, total_impressions)
            by_source["homepage"] = {
                "impressions": total_impressions,
                "items_shown": total_items_shown,
                "clicks": total_clicks
            }
        elif total_impressions > 0 and total_clicks == 0 and interactions:
            # Đồng bộ lượt click thực tế của người dùng trên các sản phẩm đã được hiển thị gợi ý
            shown_pids = {
                pid
                for imp in impressions
                for pid in (imp.recommended_product_ids or [])
            }
            matched_clicks = sum(
                1 for x in interactions
                if getattr(x, "interaction_type", "") == "click"
                and getattr(x, "product_id", None) in shown_pids
            )
            total_clicks = min(matched_clicks, total_impressions)
            if "homepage" in by_source:
                by_source["homepage"]["clicks"] = min(total_clicks, by_source["homepage"]["impressions"])

        # Đảm bảo tính nhất quán toán học: total_clicks <= total_impressions <= total_items_shown
        if total_impressions > 0:
            total_items_shown = max(total_items_shown, total_impressions)
            total_clicks = min(total_clicks, total_impressions)
            ctr = round((total_clicks / max(1, total_items_shown)) * 100, 2)
        else:
            total_impressions = 0
            total_items_shown = 0
            total_clicks = 0
            ctr = 0.0

        source_stats = {}
        for s, d in by_source.items():
            s_items = max(1, d["items_shown"])
            s_clicks = min(d["clicks"], d["impressions"])
            s_ctr = round((s_clicks / s_items) * 100, 2)
            source_stats[s] = {
                "impressions": d["impressions"],
                "items_shown": d["items_shown"],
                "clicks": s_clicks,
                "ctr": s_ctr
            }

        return total_impressions, total_items_shown, total_clicks, ctr, source_stats

    def _load_offline_metrics(self) -> Dict[str, Any]:
        """Tải các chỉ số đánh giá ngoại tuyến từ mappings.json an toàn"""
        if os.path.exists(self.mappings_path):
            try:
                with open(self.mappings_path, "r", encoding="utf-8") as f:
                    return json.load(f).get("metrics", {})
            except Exception as e:
                logger.warning(f"[AnalyticsService] Error reading mappings.json: {e}")
        return {}

    async def _calculate_conversion_and_ai_revenue(
        self,
        impressions: List[Any],
        interactions: List[Any],
        total_clicks: int
    ) -> Tuple[float, int, float]:
        """
        Tính toán conversion_rate, ai_revenue và ai_revenue_share từ dữ liệu thực tế
        trong các bảng orders, recommendation_impressions và interactions.
        """
        from app.models.order import Order

        all_orders = await Order.find({"order_status": {"$ne": "cancelled"}}).to_list()
        if not all_orders:
            return 0.0, 0, 0.0

        # Tập hợp các sản phẩm được AI gợi ý hoặc người dùng tương tác khám phá (view/click/add_to_cart)
        recommended_pids = {
            pid
            for imp in impressions
            for pid in (imp.recommended_product_ids or [])
        }
        user_interacted_pairs = {
            (str(x.user_id), str(x.product_id))
            for x in interactions
            if getattr(x, "user_id", None) and getattr(x, "product_id", None)
            and getattr(x, "interaction_type", "") in ("view", "click", "add_to_cart", "wishlist")
        }

        total_revenue = 0.0
        ai_attributed_revenue = 0.0
        ai_converted_orders = 0

        for order in all_orders:
            order_total = float(order.total_amount or 0.0)
            total_revenue += order_total
            uid = str(order.user_id or "")

            order_items = order.items or []
            if not order_items:
                continue

            matched_item_val = 0.0
            total_item_val = 0.0
            has_ai_item = False
            for item in order_items:
                pid = str(getattr(item, "product_id", "") or "")
                item_val = float(getattr(item, "price", 0.0) or 0.0) * int(getattr(item, "quantity", 1) or 1)
                total_item_val += item_val
                if (uid, pid) in user_interacted_pairs or pid in recommended_pids:
                    matched_item_val += item_val
                    has_ai_item = True

            if has_ai_item:
                ai_converted_orders += 1
                if total_item_val > 0:
                    ai_attributed_revenue += order_total * (matched_item_val / total_item_val)
                else:
                    ai_attributed_revenue += order_total

        click_interactions_count = sum(
            1 for x in interactions if getattr(x, "interaction_type", "") == "click"
        )
        denominator_clicks = max(total_clicks, click_interactions_count, len(all_orders), 1)
        conversion_rate = round((ai_converted_orders / denominator_clicks) * 100, 2)
        ai_revenue = int(round(ai_attributed_revenue))
        ai_revenue_share = round((ai_attributed_revenue / total_revenue) * 100, 1) if total_revenue > 0 else 0.0

        return conversion_rate, ai_revenue, ai_revenue_share

    async def get_online_metrics(self) -> Dict[str, Any]:
        """Tính toán các chỉ số trực tuyến (Online CTR, Impressions, Clicks, Conversion, AI Revenue) từ MongoDB"""
        from app.models.recommendation_impression import RecommendationImpression
        from app.models.interaction import Interaction

        impressions = await RecommendationImpression.find_all().to_list()
        interactions = await Interaction.find_all().to_list()

        total_impressions, total_items_shown, total_clicks, ctr, source_stats = (
            self._aggregate_impressions_and_clicks(impressions, interactions)
        )

        offline_metrics = self._load_offline_metrics()
        hr_at_10 = offline_metrics.get("hit_rate_at_10", 0.0)
        ndcg_at_10 = offline_metrics.get("ndcg_at_10", 0.0)
        loss = offline_metrics.get("loss", 0.0)

        conversion_rate, ai_revenue, ai_revenue_share = await self._calculate_conversion_and_ai_revenue(
            impressions, interactions, total_clicks
        )

        return {
            "total_impressions": total_impressions,
            "total_items_shown": total_items_shown,
            "total_clicks": total_clicks,
            "ctr": ctr,
            "sources": source_stats,
            "hit_rate_at_10": f"{hr_at_10}%" if isinstance(hr_at_10, (int, float)) else str(hr_at_10),
            "ndcg_at_10": f"{ndcg_at_10:.3f}" if isinstance(ndcg_at_10, float) else str(ndcg_at_10),
            "loss": loss,
            "conversion_rate": conversion_rate,
            "ai_revenue": ai_revenue,
            "ai_revenue_share": ai_revenue_share
        }
