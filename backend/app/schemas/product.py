from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    product_id: Optional[str] = None
    name: str
    price: float
    image_url: str
    images: Optional[List[str]] = []
    product_type: Optional[str] = None
    sport_type: Optional[str] = None
    category: Optional[List[str]] = []
    brand: Optional[str] = None
    rating: Optional[float] = 0.0
    reviews_count: Optional[int] = 0
    sizes: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    gender: Optional[str] = "Unisex"
    stock: Optional[int] = 100
    description: Optional[str] = ""
    discount_percent: Optional[int] = 0
    discount_start_date: Optional[datetime] = None
    discount_end_date: Optional[datetime] = None
    is_hidden: Optional[bool] = False
    is_deleted: Optional[bool] = False

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    product_type: Optional[str] = None
    sport_type: Optional[str] = None
    category: Optional[List[str]] = None
    brand: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    gender: Optional[str] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    discount_percent: Optional[int] = None
    discount_start_date: Optional[datetime] = None
    discount_end_date: Optional[datetime] = None
    is_hidden: Optional[bool] = None
    is_deleted: Optional[bool] = None

class ProductResponse(ProductBase):
    pass
