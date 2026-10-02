from pydantic import BaseModel
from typing import List

class OrderItemCreate(BaseModel):
    product_id: str
    product_name: str = "Sản phẩm"
    quantity: int
    price: float
    size: str = ""
    color: str = ""

class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_address: str
    payment_method: str
    items: List[OrderItemCreate]
    total_amount: float
    voucher_code: str | None = None
    discount_amount: float = 0.0
