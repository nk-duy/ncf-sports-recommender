from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from app.services.product_service import product_service

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = Query(0, ge=0, description="Số lượng bản ghi bỏ qua"),
    limit: int = Query(20, ge=1, le=100, description="Số lượng bản ghi tối đa lấy về"),
    category: Optional[str] = Query(None, description="Lọc theo danh mục"),
    search: Optional[str] = Query(None, description="Tìm kiếm theo tên sản phẩm"),
    brand: Optional[str] = Query(None, description="Thương hiệu"),
    min_price: Optional[float] = Query(None, description="Giá thấp nhất"),
    max_price: Optional[float] = Query(None, description="Giá cao nhất"),
    sizes: Optional[str] = Query(None, description="Kích thước, phân tách bằng dấu phẩy"),
    colors: Optional[str] = Query(None, description="Màu sắc, phân tách bằng dấu phẩy"),
    gender: Optional[str] = Query(None, description="Giới tính (Nam, Nữ, Unisex)")
):
    """Lấy danh sách sản phẩm"""
    products = await product_service.get_products(
        skip=skip, limit=limit, category=category, search=search,
        brand=brand, min_price=min_price, max_price=max_price,
        sizes=sizes, colors=colors, gender=gender
    )
    return products

@router.get("/featured", response_model=List[ProductResponse])
async def get_featured_products(limit: int = Query(5, description="Số lượng sản phẩm nổi bật")):
    """Lấy danh sách sản phẩm nổi bật (cho Banner)"""
    products = await product_service.get_featured_products(limit=limit)
    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Lấy chi tiết một sản phẩm theo product_id"""
    product = await product_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product

@router.post("/", response_model=ProductResponse)
async def create_product(product_data: ProductCreate):
    """Thêm sản phẩm mới"""
    new_product = await product_service.create_product(product_data)
    if not new_product:
        raise HTTPException(status_code=400, detail="Mã sản phẩm đã tồn tại")
    return new_product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: str, product_data: ProductUpdate):
    """Cập nhật sản phẩm"""
    updated_product = await product_service.update_product(product_id, product_data)
    if not updated_product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return updated_product

@router.delete("/{product_id}")
async def delete_product(product_id: str):
    """Xóa sản phẩm"""
    success = await product_service.delete_product(product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return {"status": "success", "message": "Đã xóa sản phẩm"}
