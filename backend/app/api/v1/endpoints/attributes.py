from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.models.attribute import AttributeColor
from app.models.user import User
from app.services.attribute_service import attribute_service
from app.api.deps import get_current_admin_user

router = APIRouter()


class AttributesUpdatePayload(BaseModel):
    brands: List[str]
    colors: List[AttributeColor]
    shoe_sizes: List[str]
    clothing_sizes: List[str]
    sport_specs: List[str]


@router.get("/")
async def get_attributes():
    """Lấy danh sách cấu hình thuộc tính sản phẩm toàn hệ thống"""
    return await attribute_service.get_or_create_attributes()


@router.put("/")
async def update_attributes(
    payload: AttributesUpdatePayload,
    current_admin: User = Depends(get_current_admin_user)
):
    """Cập nhật các danh mục thương hiệu, màu sắc, kích cỡ, thông số kỹ thuật thể thao (Quản trị viên)"""
    doc = await attribute_service.update_attributes(
        brands=payload.brands,
        colors=payload.colors,
        shoe_sizes=payload.shoe_sizes,
        clothing_sizes=payload.clothing_sizes,
        sport_specs=payload.sport_specs
    )
    return {"status": "success", "message": "Đã lưu thuộc tính thành công", "data": doc}


@router.post("/reset")
async def reset_attributes(
    current_admin: User = Depends(get_current_admin_user)
):
    """Khôi phục cài đặt thuộc tính về mặc định ban đầu (Quản trị viên)"""
    doc = await attribute_service.reset_to_defaults()
    return {"status": "success", "message": "Đã khôi phục cài đặt mặc định", "data": doc}
