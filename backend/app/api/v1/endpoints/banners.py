from typing import List, Optional
from fastapi import APIRouter, HTTPException
from app.models.banner import Banner
from app.services.banner_service import banner_service
from pydantic import BaseModel

router = APIRouter()

class BannerCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    image_url: str
    link: Optional[str] = None
    position: int = 0
    is_active: bool = True

class BannerUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None
    position: Optional[int] = None
    is_active: Optional[bool] = None

class BannerReorderItem(BaseModel):
    id: str
    position: int

@router.get("/", response_model=List[Banner])
async def get_banners(active_only: bool = False):
    """Lấy danh sách banner (tất cả hoặc chỉ banner đang kích hoạt)"""
    return await banner_service.get_banners(active_only=active_only)

@router.post("/", response_model=Banner)
async def create_banner(banner_in: BannerCreate):
    """Tạo banner quảng cáo hoặc chiến dịch mới"""
    return await banner_service.create_banner(banner_in.dict())

@router.put("/reorder")
async def reorder_banners(items: List[BannerReorderItem]):
    """Cập nhật thứ tự hiển thị banner trên trang chủ"""
    await banner_service.reorder_banners([item.dict() for item in items])
    return {"status": "success", "message": "Đã cập nhật thứ tự banner"}

@router.put("/{banner_id}", response_model=Banner)
async def update_banner(banner_id: str, banner_in: BannerUpdate):
    """Cập nhật nội dung hoặc trạng thái của banner"""
    banner = await banner_service.update_banner(banner_id, banner_in.dict(exclude_unset=True))
    if not banner:
        raise HTTPException(status_code=404, detail="Banner không tồn tại hoặc ID không hợp lệ")
    return banner

@router.delete("/{banner_id}")
async def delete_banner(banner_id: str):
    """Xóa banner khỏi hệ thống"""
    success = await banner_service.delete_banner(banner_id)
    if not success:
        raise HTTPException(status_code=404, detail="Banner không tồn tại hoặc ID không hợp lệ")
    return {"message": "Banner deleted successfully"}
