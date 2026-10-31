from fastapi import APIRouter, Depends
from app.services.admin_service import admin_service
from app.services.recommendation_service import recommendation_service
from app.api.deps import get_current_admin_user
from app.models.user import User

router = APIRouter()

@router.get("/dashboard-stats")
async def get_dashboard_stats(current_admin: User = Depends(get_current_admin_user)):
    """Lấy các chỉ số thống kê cho trang quản trị (Dashboard)"""
    stats = await admin_service.get_dashboard_stats()
    return stats

@router.get("/evaluation-metrics")
async def get_evaluation_metrics(current_admin: User = Depends(get_current_admin_user)):
    """Lấy toàn bộ số liệu thực nghiệm khoa học NCF (AI Evaluation Lab) từ training_metrics.json"""
    return recommendation_service.get_evaluation_metrics()
