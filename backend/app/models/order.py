from pydantic import BaseModel, Field
from beanie import Document
from typing import List
from datetime import datetime

class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class Order(Document):
    customer_name: str
    customer_phone: str
    customer_address: str
    payment_method: str
    items: List[OrderItem]
    total_amount: float
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "orders"
