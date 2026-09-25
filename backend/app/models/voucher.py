from beanie import Document
from pydantic import Field
from typing import Optional
from datetime import datetime

class Voucher(Document):
    code: str = Field(..., description="Mã giảm giá (ví dụ: FREESHIP, GIAM20K)")
    discount_type: str = Field(..., description="Loại giảm giá: 'fixed' hoặc 'percent' hoặc 'freeship'")
    discount_value: float = Field(..., description="Giá trị giảm giá (số tiền hoặc %)")
    max_discount: Optional[float] = Field(None, description="Mức giảm tối đa (đối với phần trăm)")
    min_order_value: Optional[float] = Field(0, description="Giá trị đơn hàng tối thiểu để áp dụng")
    usage_limit: Optional[int] = Field(None, description="Số lần sử dụng tối đa")
    used_count: int = Field(0, description="Số lần đã sử dụng")
    valid_from: Optional[datetime] = Field(None, description="Ngày bắt đầu có hiệu lực")
    valid_until: Optional[datetime] = Field(None, description="Ngày hết hạn")
    is_active: bool = Field(True, description="Trạng thái kích hoạt")

    class Settings:
        name = "vouchers"
