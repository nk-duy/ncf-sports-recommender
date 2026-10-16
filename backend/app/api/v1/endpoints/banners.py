from typing import List, Optional
from fastapi import APIRouter, HTTPException
from app.models.banner import Banner
from pydantic import BaseModel
from bson import ObjectId

router = APIRouter()

class BannerCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    image_url: str
    link: Optional[str] = None
    position: int = 0
    is_active: bool = True

class BannerUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    badge: Optional[str] = None
    image_url: Optional[str] = None
    link: Optional[str] = None
    position: Optional[int] = None
    is_active: Optional[bool] = None

class BannerReorderItem(BaseModel):
    id: str
    position: int

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

@router.put("/reorder")
async def reorder_banners(items: List[BannerReorderItem]):
    for item in items:
        try:
            banner = await Banner.get(ObjectId(item.id))
            if banner:
                banner.position = item.position
                await banner.save()
        except Exception:
            continue
    return {"status": "success", "message": "Đã cập nhật thứ tự banner"}

@router.put("/{banner_id}", response_model=Banner)
async def update_banner(banner_id: str, banner_in: BannerUpdate):
    try:
        banner = await Banner.get(ObjectId(banner_id))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid banner id format")
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    update_data = banner_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(banner, key, value)
    await banner.save()
    return banner

@router.delete("/{banner_id}")
async def delete_banner(banner_id: str):
    try:
        banner = await Banner.get(ObjectId(banner_id))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid banner id format")
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    await banner.delete()
    return {"message": "Banner deleted successfully"}
