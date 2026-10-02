from pydantic import BaseModel, Field
from beanie import Document
from typing import List
from datetime import datetime

class OrderItem(BaseModel):
    product_id: str
    product_name: str = "Sản phẩm"
    quantity: int
    price: float
    size: str = ""
    color: str = ""

class Order(Document):
    customer_name: str
    customer_phone: str
    customer_address: str
    payment_method: str
    items: List[OrderItem]
    total_amount: float
    voucher_code: str | None = None
    discount_amount: float = 0.0
    status: str = "pending"
    user_id: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "orders"
