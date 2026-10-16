from fastapi import APIRouter, HTTPException, Query, Response
from typing import List, Optional
from app.schemas.product import ProductResponse, ProductCreate, ProductUpdate
from app.services.product_service import product_service

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
@router.get("", response_model=List[ProductResponse], include_in_schema=False)
async def get_products(
    response: Response,
    skip: int = Query(0, ge=0, description="Số lượng bản ghi bỏ qua"),
    limit: int = Query(20, ge=1, le=2000, description="Số lượng bản ghi tối đa lấy về"),
    category: Optional[str] = Query(None, description="Lọc theo danh mục"),
    product_type: Optional[str] = Query(None, description="Lọc theo Loại sản phẩm"),
    sport_type: Optional[str] = Query(None, description="Lọc theo Môn thể thao"),
    search: Optional[str] = Query(None, description="Tìm kiếm theo tên sản phẩm"),
    brand: Optional[str] = Query(None, description="Thương hiệu"),
    min_price: Optional[float] = Query(None, description="Giá thấp nhất"),
    max_price: Optional[float] = Query(None, description="Giá cao nhất"),
    sizes: Optional[str] = Query(None, description="Kích thước, phân tách bằng dấu phẩy"),
    colors: Optional[str] = Query(None, description="Màu sắc, phân tách bằng dấu phẩy"),
    gender: Optional[str] = Query(None, description="Giới tính (Nam, Nữ, Unisex)"),
    is_promotion: Optional[bool] = Query(None, description="Lọc sản phẩm đang giảm giá"),
    sort_by: Optional[str] = Query(None, description="Sắp xếp: discount_desc, price_asc, price_desc, sold_desc, rating_desc"),
    include_hidden: bool = Query(False, description="Bao gồm cả sản phẩm bị ẩn"),
    include_deleted: bool = Query(False, description="Bao gồm cả sản phẩm trong thùng rác")
):
    """Lấy danh sách sản phẩm"""
    products, total = await product_service.get_products_with_count(
        skip=skip, limit=limit, category=category, product_type=product_type, sport_type=sport_type, search=search,
        brand=brand, min_price=min_price, max_price=max_price,
        sizes=sizes, colors=colors, gender=gender, is_promotion=is_promotion,
        sort_by=sort_by,
        include_hidden=include_hidden, include_deleted=include_deleted
    )
    response.headers["X-Total-Count"] = str(total)
    response.headers["Access-Control-Expose-Headers"] = "X-Total-Count"
    return products

@router.get("/brands", response_model=List[str])
async def get_brands():
    """Lấy danh sách các thương hiệu có trong hệ thống"""
    brands = await product_service.get_distinct_brands()
    return brands

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
@router.post("", response_model=ProductResponse, include_in_schema=False)
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

@router.get("/{product_id}/check-dependencies")
async def check_dependencies(product_id: str):
    """Kiểm tra sản phẩm có đơn hàng, đánh giá hoặc tương tác AI không trước khi xóa vĩnh viễn"""
    product = await product_service.get_product_by_id(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    dep_check = await product_service.check_product_dependencies(product_id)
    return dep_check

@router.delete("/{product_id}")
async def delete_product(product_id: str, force: bool = False):
    """Xóa sản phẩm (có kiểm tra ràng buộc toàn vẹn dữ liệu)"""
    success, reason = await product_service.delete_product(product_id, force=force)
    if not success:
        if reason == "Không tìm thấy sản phẩm":
            raise HTTPException(status_code=404, detail=reason)
        # Bị chặn bởi ràng buộc dữ liệu
        raise HTTPException(status_code=400, detail=reason)
    return {"status": "success", "message": "Đã xóa vĩnh viễn sản phẩm"}
