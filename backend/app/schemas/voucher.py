from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class VoucherBase(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    max_discount: Optional[float] = None
    min_order_value: Optional[float] = 0
    usage_limit: Optional[int] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: bool = True

class VoucherCreate(VoucherBase):
    pass

class VoucherUpdate(BaseModel):
    code: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None
    max_discount: Optional[float] = None
    min_order_value: Optional[float] = None
    usage_limit: Optional[int] = None
    valid_from: Optional[datetime] = None
    valid_until: Optional[datetime] = None
    is_active: Optional[bool] = None

class VoucherResponse(VoucherBase):
    id: str = Field(alias="_id")
    used_count: int

    class Config:
        populate_by_name = True
