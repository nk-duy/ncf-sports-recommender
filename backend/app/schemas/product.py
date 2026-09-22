from pydantic import BaseModel

class ProductBase(BaseModel):
    product_id: str
    name: str
    price: float
    image_url: str

class ProductResponse(ProductBase):
    pass
