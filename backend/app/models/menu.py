from beanie import Document
from pydantic import BaseModel, Field
from typing import List, Optional

class MegaMenuCategory(BaseModel):
    category: str
    is_hidden: Optional[bool] = False

class MegaMenuProductType(BaseModel):
    product_type: str
    categories: List[MegaMenuCategory] = []
    is_hidden: Optional[bool] = False

class MegaMenuSport(BaseModel):
    sport_type: str
    product_types: List[MegaMenuProductType] = []
    is_hidden: Optional[bool] = False

class MegaMenu(Document):
    config_id: str = "default"
    menu_data: List[MegaMenuSport] = []

    class Settings:
        name = "mega_menu"
