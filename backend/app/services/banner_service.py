from typing import List, Optional, Dict, Any
from bson import ObjectId
from app.models.banner import Banner

class BannerService:
    @staticmethod
    async def get_banners(active_only: bool = False) -> List[Banner]:
        if active_only:
            return await Banner.find(Banner.is_active == True).sort(+Banner.position).to_list()
        return await Banner.find_all().sort(+Banner.position).to_list()

    @staticmethod
    async def get_banner_by_id(banner_id: str) -> Optional[Banner]:
        try:
            return await Banner.get(ObjectId(banner_id))
        except Exception:
            return None

    @staticmethod
    async def create_banner(data: Dict[str, Any]) -> Banner:
        banner = Banner(**data)
        await banner.insert()
        return banner

    @staticmethod
    async def update_banner(banner_id: str, update_data: Dict[str, Any]) -> Optional[Banner]:
        banner = await BannerService.get_banner_by_id(banner_id)
        if not banner:
            return None
        
        for key, value in update_data.items():
            setattr(banner, key, value)
        await banner.save()
        return banner

    @staticmethod
    async def reorder_banners(items: List[Dict[str, Any]]) -> None:
        for item in items:
            try:
                banner = await Banner.get(ObjectId(item["id"]))
                if banner:
                    banner.position = item["position"]
                    await banner.save()
            except Exception:
                continue

    @staticmethod
    async def delete_banner(banner_id: str) -> bool:
        banner = await BannerService.get_banner_by_id(banner_id)
        if not banner:
            return False
        await banner.delete()
        return True

banner_service = BannerService()
