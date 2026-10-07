from typing import List
from fastapi import APIRouter, HTTPException
from app.models.banner import Banner
from pydantic import BaseModel
from bson import ObjectId

router = APIRouter()

class BannerCreate(BaseModel):
    title: str
    image_url: str
    link: str = None
    position: int = 0
    is_active: bool = True

@router.get("/", response_model=List[Banner])
async def get_banners(active_only: bool = False):
    if active_only:
        banners = await Banner.find(Banner.is_active == True).sort(+Banner.position).to_list()
    else:
        banners = await Banner.find_all().sort(+Banner.position).to_list()
    return banners

@router.post("/", response_model=Banner)
async def create_banner(banner_in: BannerCreate):
    banner = Banner(**banner_in.dict())
    await banner.insert()
    return banner

@router.put("/{banner_id}", response_model=Banner)
async def update_banner(banner_id: str, banner_in: BannerCreate):
    banner = await Banner.get(ObjectId(banner_id))
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    for key, value in banner_in.dict().items():
        setattr(banner, key, value)
    await banner.save()
    return banner

@router.delete("/{banner_id}")
async def delete_banner(banner_id: str):
    banner = await Banner.get(ObjectId(banner_id))
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    await banner.delete()
    return {"message": "Banner deleted successfully"}
