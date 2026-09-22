from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models.product import Product
from app.schemas.product import ProductResponse

router = APIRouter()

@router.get("/", response_model=List[ProductResponse])
async def get_products(
    skip: int = Query(0, ge=0, description="Số lượng bản ghi bỏ qua"),
    limit: int = Query(20, ge=1, le=100, description="Số lượng bản ghi tối đa lấy về")
):
    """Lấy danh sách sản phẩm"""
    products = await Product.find_all().skip(skip).limit(limit).to_list()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Lấy chi tiết một sản phẩm theo product_id"""
    product = await Product.find_one(Product.product_id == product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product
