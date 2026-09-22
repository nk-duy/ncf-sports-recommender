from beanie import Document
from pydantic import Field

class Product(Document):
    product_id: str = Field(description="The original string ID from the mock data")
    name: str
    price: float
    image_url: str

    class Settings:
        name = "products" # Tên collection trong MongoDB
