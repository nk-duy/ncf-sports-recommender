from fastapi import APIRouter
from typing import List
from pydantic import BaseModel
from app.models.attribute import AttributeColor
from app.services.attribute_service import attribute_service

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
async def update_attributes(payload: AttributesUpdatePayload):
    """Cập nhật các danh mục thương hiệu, màu sắc, kích cỡ, thông số kỹ thuật thể thao"""
    doc = await attribute_service.update_attributes(
        brands=payload.brands,
        colors=payload.colors,
        shoe_sizes=payload.shoe_sizes,
        clothing_sizes=payload.clothing_sizes,
        sport_specs=payload.sport_specs
    )
    return {"status": "success", "message": "Đã lưu thuộc tính thành công", "data": doc}

@router.post("/reset")
async def reset_attributes():
    """Khôi phục cài đặt thuộc tính về mặc định ban đầu"""
    doc = await attribute_service.reset_to_defaults()
    return {"status": "success", "message": "Đã khôi phục cài đặt mặc định", "data": doc}
