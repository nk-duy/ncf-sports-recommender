from beanie import Document
from pydantic import Field
from typing import Optional, List

class Product(Document):
    product_id: str = Field(..., description="Mã sản phẩm (ASIN)")
    name: str = Field(..., description="Tên sản phẩm")
    price: float = Field(0.0, description="Giá sản phẩm")
    image_url: str = Field(..., description="Đường dẫn ảnh")
    category: Optional[List[str]] = Field(default=[], description="Danh mục sản phẩm")
    brand: Optional[str] = Field(default=None, description="Thương hiệu")
    rating: Optional[float] = Field(default=0.0, description="Điểm đánh giá trung bình")
    reviews_count: Optional[int] = Field(default=0, description="Số lượng đánh giá")
    sizes: Optional[List[str]] = Field(default=[], description="Kích thước có sẵn")
    colors: Optional[List[str]] = Field(default=[], description="Màu sắc có sẵn")
    gender: Optional[str] = Field(default="Unisex", description="Giới tính (Nam, Nữ, Unisex)")

    class Settings:
        name = "products" # Tên collection trong MongoDB
