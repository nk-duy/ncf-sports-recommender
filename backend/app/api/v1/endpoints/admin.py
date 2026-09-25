from fastapi import APIRouter
from app.services.admin_service import admin_service

router = APIRouter()

@router.get("/dashboard-stats")
async def get_dashboard_stats():
    """Lấy các chỉ số thống kê cho trang quản trị (Dashboard)"""
    stats = await admin_service.get_dashboard_stats()
    return stats
