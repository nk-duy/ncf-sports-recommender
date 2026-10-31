import logging
from fastapi import APIRouter, Depends
from typing import List, Dict, Any
from app.models.user import User
from app.models.product import Product
from app.models.interaction import Interaction
from app.api.deps import get_current_active_user

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/wishlist", response_model=Dict[str, Any])
@router.get("/me/wishlist", response_model=Dict[str, Any])
async def get_my_wishlist(current_user: User = Depends(get_current_active_user)):
    """Lấy danh sách ID và toàn bộ đối tượng Product yêu thích của khách hàng từ MongoDB"""
    product_ids = getattr(current_user, "wishlist", []) or []
    products = []
    if product_ids:
        raw_prods = await Product.find({"product_id": {"$in": product_ids}, "is_deleted": {"$ne": True}}).to_list()
        # Sắp xếp theo đúng thứ tự đã lưu trong wishlist
        prod_map = {p.product_id: p for p in raw_prods}
        for pid in product_ids:
            if pid in prod_map:
                p = prod_map[pid]
                products.append({
                    "product_id": p.product_id,
                    "id": p.product_id,
                    "name": p.name,
                    "price": p.price,
                    "image_url": p.image_url,
                    "category": p.category,
                    "sport_type": p.sport_type,
                    "rating": p.rating or 5.0,
                    "reviews_count": p.reviews_count or 0,
                    "discount_percent": p.discount_percent or 0,
                    "original_price": p.original_price,
                    "stock": p.stock or 0
                })
    return {
        "status": "success",
        "product_ids": product_ids,
        "total": len(product_ids),
        "products": products
    }

@router.post("/wishlist/{product_id}")
@router.post("/me/wishlist/{product_id}")
async def toggle_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Toggle (Thêm / Xóa) sản phẩm trong Wishlist của người dùng trong MongoDB.
    Khi thêm mới, tự động ghi nhận tương tác ngầm (interaction_type='wishlist', rating=4.0)
    cho mô hình NCF Recommender.
    """
    pid = product_id.strip()
    if not hasattr(current_user, "wishlist") or current_user.wishlist is None:
        current_user.wishlist = []

    if pid in current_user.wishlist:
        current_user.wishlist.remove(pid)
        await current_user.save()
        return {
            "status": "success",
            "action": "removed",
            "is_wishlisted": False,
            "message": "Đã xóa khỏi danh sách yêu thích thành công",
            "product_id": pid,
            "wishlist": current_user.wishlist
        }
    else:
        current_user.wishlist.append(pid)
        await current_user.save()

        # Tự động ghi nhận tương tác ngầm vào bảng interactions cho NCF Training với trọng số 4.0
        try:
            await Interaction(
                user_id=str(current_user.id),
                product_id=pid,
                interaction_type="wishlist",
                rating=4.0
            ).insert()
        except Exception as e:
            logger.warning(f"[Wishlist Interaction Error] {e}")

        return {
            "status": "success",
            "action": "added",
            "is_wishlisted": True,
            "message": "Đã thêm vào danh sách yêu thích thành công",
            "product_id": pid,
            "wishlist": current_user.wishlist
        }

@router.delete("/wishlist/{product_id}")
@router.delete("/me/wishlist/{product_id}")
async def remove_from_wishlist(
    product_id: str,
    current_user: User = Depends(get_current_active_user)
):
    """Xóa sản phẩm khỏi danh sách yêu thích trong MongoDB"""
    pid = product_id.strip()
    if hasattr(current_user, "wishlist") and current_user.wishlist and pid in current_user.wishlist:
        current_user.wishlist.remove(pid)
        await current_user.save()

    return {
        "status": "success",
        "action": "removed",
        "is_wishlisted": False,
        "message": "Đã xóa khỏi danh sách yêu thích thành công",
        "product_id": pid,
        "wishlist": getattr(current_user, "wishlist", [])
    }
