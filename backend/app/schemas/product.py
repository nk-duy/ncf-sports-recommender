from pydantic import BaseModel
from typing import Optional, List

class ProductBase(BaseModel):
    product_id: str
    name: str
    price: float
    image_url: str
    category: Optional[List[str]] = []
    brand: Optional[str] = None
    rating: Optional[float] = 0.0
    reviews_count: Optional[int] = 0
    sizes: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    gender: Optional[str] = "Unisex"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[List[str]] = None
    brand: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    gender: Optional[str] = None

class ProductResponse(ProductBase):
    pass
