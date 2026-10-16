from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class AttributeColor(BaseModel):
    name: str
    hex: str = "#2563EB"

class ProductAttributes(Document):
    brands: List[str] = Field(default_factory=list)
    colors: List[AttributeColor] = Field(default_factory=list)
    shoe_sizes: List[str] = Field(default_factory=list)
    clothing_sizes: List[str] = Field(default_factory=list)
    sport_specs: List[str] = Field(default_factory=list)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "product_attributes"
