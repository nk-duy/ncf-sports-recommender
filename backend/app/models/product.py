from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class ProductVariant(BaseModel):
    color: Optional[str] = Field(default="", description="Màu sắc")
    size: Optional[str] = Field(default="", description="Kích cỡ")
    stock: int = Field(default=0, ge=0, description="Tồn kho của phân loại")
    sku: Optional[str] = Field(default="", description="Mã phân loại SKU")
    price: Optional[float] = Field(default=None, description="Giá riêng (nếu có)")

class Product(Document):
    product_id: str = Field(..., description="Mã sản phẩm (ASIN)")
    name: str = Field(..., description="Tên sản phẩm")
    price: float = Field(0.0, description="Giá sản phẩm")
    image_url: str = Field(..., description="Đường dẫn ảnh")
    images: Optional[List[str]] = Field(default=[], description="Các ảnh bổ sung")
    product_type: Optional[str] = Field(default=None, description="Loại sản phẩm (Quần áo, Giày dép, Phụ kiện, Thiết bị)")
    sport_type: Optional[str] = Field(default=None, description="Môn thể thao (Bóng chuyền, Cầu lông, Đá bóng, Chạy bộ, Pickleball, Dã ngoại)")
    category: Optional[List[str]] = Field(default=[], description="Danh mục tổng hợp")
    brand: Optional[str] = Field(default=None, description="Thương hiệu")
    rating: Optional[float] = Field(default=0.0, description="Điểm đánh giá trung bình")
    reviews_count: Optional[int] = Field(default=0, description="Số lượng đánh giá")
    sizes: Optional[List[str]] = Field(default=[], description="Kích thước có sẵn")
    colors: Optional[List[str]] = Field(default=[], description="Màu sắc có sẵn")
    variants: Optional[List[ProductVariant]] = Field(default=[], description="Danh sách phân loại biến thể (Màu, Size, Tồn kho)")
    gender: Optional[str] = Field(default="Unisex", description="Giới tính (Nam, Nữ, Unisex)")
    stock: Optional[int] = Field(default=100, description="Số lượng tồn kho")
    description: Optional[str] = Field(default="", description="Mô tả chi tiết sản phẩm")
    discount_percent: Optional[int] = Field(default=0, description="Phần trăm giảm giá (nếu có)")
    discount_start_date: Optional[datetime] = Field(default=None, description="Thời gian bắt đầu giảm giá")
    discount_end_date: Optional[datetime] = Field(default=None, description="Thời gian kết thúc giảm giá")
    is_hidden: Optional[bool] = Field(default=False, description="Trạng thái ẩn sản phẩm")
    is_deleted: Optional[bool] = Field(default=False, description="Đã chuyển vào thùng rác")
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Thời gian tạo")
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Thời gian cập nhật")

    class Settings:
        name = "products" # Tên collection trong MongoDB
