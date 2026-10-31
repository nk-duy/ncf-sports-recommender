from typing import List
from fastapi import APIRouter, Depends

from app.models.menu import MegaMenu, MegaMenuSport
from app.models.user import User
from app.core.cache import cache_response, fast_cache
from app.api.deps import get_current_admin_user

router = APIRouter()


@router.get("/", response_model=List[MegaMenuSport])
@router.get("", response_model=List[MegaMenuSport], include_in_schema=False)
@cache_response(ttl=3600, prefix="menu:default")
async def get_menu():
    """Lấy danh mục MegaMenu (Được đệm Cache 1 giờ để tăng tốc độ tải trang chủ)"""
    menu_doc = await MegaMenu.find_one({"config_id": "default"})
    if menu_doc:
        return menu_doc.menu_data
    return []


@router.post("/")
@router.post("", include_in_schema=False)
async def update_menu(
    menu_data: List[MegaMenuSport],
    current_admin: User = Depends(get_current_admin_user)
):
    """Cập nhật cấu hình MegaMenu và tự động xóa bộ đệm cache (Quản trị viên)"""
    menu_doc = await MegaMenu.find_one({"config_id": "default"})
    if menu_doc:
        menu_doc.menu_data = menu_data
        await menu_doc.save()
    else:
        menu_doc = MegaMenu(config_id="default", menu_data=menu_data)
        await menu_doc.insert()

    # Tự động hủy cache menu để client nhận dữ liệu mới ngay lập tức
    await fast_cache.invalidate_prefix("menu:")
    return {"status": "success", "message": "Menu updated successfully"}
