from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProductVariant(BaseModel):
    color: Optional[str] = ""
    size: Optional[str] = ""
    stock: int = 0
    sku: Optional[str] = ""
    price: Optional[float] = None

class AIExplanation(BaseModel):
    strategy: str = "hybrid_ncf"  # "hybrid_ncf" | "cold_start" | "cosine_cross_sell"
    ncf_score: Optional[float] = 0.0
    context_boost: Optional[float] = 0.0
    cosine_score: Optional[float] = 0.0
    rating_score: Optional[float] = 0.0
    final_score: float = 0.0
    match_percent: int = 85
    reason: str = ""

class ProductBase(BaseModel):
    product_id: Optional[str] = None
    name: str
    price: float
    image_url: str
    images: Optional[List[str]] = []
    product_type: Optional[str] = None
    sport_type: Optional[str] = None
    category: Optional[List[str]] = []
    sub_category: Optional[str] = None
    brand: Optional[str] = None
    rating: Optional[float] = 0.0
    reviews_count: Optional[int] = 0
    sizes: Optional[List[str]] = []
    colors: Optional[List[str]] = []
    variants: Optional[List[ProductVariant]] = []
    gender: Optional[str] = "Unisex"
    stock: Optional[int] = 100
    description: Optional[str] = ""
    discount_percent: Optional[int] = 0
    discount_start_date: Optional[datetime] = None
    discount_end_date: Optional[datetime] = None
    is_hidden: Optional[bool] = False
    is_deleted: Optional[bool] = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    ai_explanation: Optional[AIExplanation] = None

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
    sub_category: Optional[str] = None
    brand: Optional[str] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    variants: Optional[List[ProductVariant]] = None
    gender: Optional[str] = None
    stock: Optional[int] = None
    description: Optional[str] = None
    discount_percent: Optional[int] = None
    discount_start_date: Optional[datetime] = None
    discount_end_date: Optional[datetime] = None
    is_hidden: Optional[bool] = None
    is_deleted: Optional[bool] = None
    updated_at: Optional[datetime] = None

class ProductResponse(ProductBase):
    pass
