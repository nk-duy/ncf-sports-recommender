import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, Body, Request, HTTPException

from app.models.user import User
from app.schemas.product import ProductResponse
from app.api.deps import get_current_user_optional
from app.services.recommendation_service import recommendation_service
from app.services.product_service import ProductService
from app.core.limiter import limiter

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=List[ProductResponse])
async def get_recommendations(
    top_k: int = Query(8, ge=1, le=100, description="Số lượng gợi ý"),
    current_product_id: Optional[str] = Query(None, description="ID sản phẩm hiện tại đang xem"),
    sport_type: Optional[str] = Query(None, description="Môn thể thao của sản phẩm đang xem"),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Lấy danh sách sản phẩm gợi ý cá nhân hóa dựa trên NCF Model"""
    user_id_str = str(current_user.id) if current_user else ""
    products = await recommendation_service.get_recommendations_for_user(
        user_id=user_id_str,
        top_k=top_k,
        current_product_id=current_product_id,
        sport_type=sport_type
    )
    for p in products:
        ProductService._enforce_discount(p)
    return products


@router.post("/cross-sell", response_model=List[ProductResponse])
async def get_cross_sell(
    cart_item_ids: List[str] = Body(..., description="Danh sách ID sản phẩm trong giỏ hàng"),
    top_k: int = Query(3, ge=1, le=10)
):
    """Lấy danh sách gợi ý bán chéo dựa trên giỏ hàng hiện tại (Sử dụng Item Embeddings)"""
    products = await recommendation_service.get_cross_sell_recommendations(cart_item_ids, top_k)
    for p in products:
        ProductService._enforce_discount(p)
    return products


@router.get("/model-info")
async def get_ai_model_info():
    """Lấy thông tin trạng thái mô hình AI (NCF Model)"""
    return recommendation_service.get_model_info()


@router.get("/evaluation-metrics")
async def get_ai_evaluation_metrics():
    """Lấy số liệu thực nghiệm khoa học, siêu tham số, lịch sử epochs và benchmark phục vụ AI Evaluation Lab (Chương 4)"""
    return recommendation_service.get_evaluation_metrics()


@router.get("/training-status")
async def get_ai_training_status():
    """Lấy tiến độ huấn luyện NCF thời gian thực cho Admin Dashboard (Progress, Epoch, Loss)"""
    return recommendation_service.get_training_status()


@router.post("/retrain")
@limiter.limit("5/minute")
async def retrain_ai_model(request: Request):
    """Kích hoạt huấn luyện lại mô hình NCF ngầm (Non-blocking) với Negative Sampling & Leave-One-Out Evaluation"""
    res = await recommendation_service.start_background_training()
    return res


@router.post("/log-impression")
async def log_recommendation_impression(
    payload: Dict[str, Any] = Body(..., description="Payload ghi nhận lượt hiển thị gợi ý"),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Ghi nhận lượt hiển thị của danh sách sản phẩm gợi ý (Impressions Tracking)"""
    product_ids = payload.get("recommended_product_ids", [])
    source = payload.get("source") or payload.get("placement") or "homepage"
    user_id = str(current_user.id) if current_user else payload.get("user_id")
    impression_id = await recommendation_service.log_impression(
        recommended_product_ids=product_ids,
        source=source,
        user_id=user_id
    )
    return {"impression_id": impression_id, "status": "success"}


@router.post("/track-click")
async def track_recommendation_click(
    payload: Dict[str, Any] = Body(..., description="Payload ghi nhận lượt click vào sản phẩm gợi ý"),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """Ghi nhận khi khách hàng nhấp chuột vào một sản phẩm nằm trong danh sách gợi ý"""
    try:
        impression_id = payload.get("impression_id", "")
        product_id = payload.get("product_id", "")
        user_id = str(current_user.id) if current_user else payload.get("user_id")
        return await recommendation_service.track_click(
            impression_id=impression_id,
            product_id=product_id,
            user_id=user_id
        )
    except Exception as exc:
        logger.error(f"[Track Click Error]: {exc}")
        return {"status": "error", "message": "Không thể ghi nhận lượt click"}


@router.get("/metrics")
async def get_ai_metrics():
    """Thống kê chỉ số thực tế trực tuyến (Online CTR) và chỉ số học thuật (Offline HR@10, NDCG@10) của NCF"""
    return await recommendation_service.get_online_metrics()
