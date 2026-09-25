from pydantic import BaseModel
from typing import List

class OrderItemCreate(BaseModel):
    product_id: str
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
