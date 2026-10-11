from fastapi import APIRouter
from app.models.menu import MegaMenu, MegaMenuSport
from typing import List

router = APIRouter()

@router.get("/", response_model=List[MegaMenuSport])
async def get_menu():
    menu_doc = await MegaMenu.find_one({"config_id": "default"})
    if menu_doc:
        return menu_doc.menu_data
    return []

@router.post("/")
async def update_menu(menu_data: List[MegaMenuSport]):
    menu_doc = await MegaMenu.find_one({"config_id": "default"})
    if menu_doc:
        menu_doc.menu_data = menu_data
        await menu_doc.save()
    else:
        menu_doc = MegaMenu(config_id="default", menu_data=menu_data)
        await menu_doc.insert()
    return {"status": "success", "message": "Menu updated successfully"}
