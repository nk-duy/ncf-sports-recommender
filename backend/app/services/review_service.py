import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from beanie import PydanticObjectId
from app.models.review import Review
from app.models.product import Product
from app.models.user import User
from app.models.order import Order
from app.models.interaction import Interaction
from app.schemas.review import ReviewCreate

logger = logging.getLogger(__name__)

class ReviewService:
    @staticmethod
    async def _recalculate_product_rating(product_id: str):
        """Tính toán lại điểm trung bình (rating) và số lượng đánh giá (reviews_count) cho sản phẩm (chống chia 0)"""
        try:
            active_reviews = await Review.find({
                "product_id": product_id,
                "is_hidden": {"$ne": True}
            }).to_list()

            product = await Product.find_one(Product.product_id == product_id)
            if product:
                if active_reviews:
                    avg_rating = round(sum(r.rating for r in active_reviews) / max(1, len(active_reviews)), 1)
                    product.rating = avg_rating
                    product.reviews_count = len(active_reviews)
                else:
                    product.rating = 0.0
                    product.reviews_count = 0
                await product.save()
        except Exception as e:
            logger.error(f"[ReviewService] Error recalculating product rating for {product_id}: {e}")

    @staticmethod
    async def create_review(review_in: ReviewCreate, current_user: User) -> Review:
        # 1. Truy vấn thực tế xuống collection orders để xác minh xem user đã mua sản phẩm này chưa
        valid_order = await Order.find_one({
            "user_id": str(current_user.id),
            "items.product_id": review_in.product_id,
            "status": {"$nin": ["cancelled", "rejected", "đã hủy", "từ chối"]}
        })
        has_purchased = valid_order is not None

        # 2. Đảm bảo mỗi user chỉ có 1 đánh giá cho mỗi sản phẩm (nếu đã có thì cập nhật)
        existing_review = await Review.find_one({
            "user_id": str(current_user.id),
            "product_id": review_in.product_id
        })

        if existing_review:
            existing_review.rating = review_in.rating
            existing_review.comment = review_in.comment
            existing_review.size_bought = review_in.size_bought
            existing_review.color_bought = review_in.color_bought
            if review_in.images is not None:
                existing_review.images = review_in.images
            existing_review.verified_purchase = has_purchased
            existing_review.timestamp = datetime.utcnow()
            await existing_review.save()
            review_db = existing_review
        else:
            review_db = Review(
                user_id=str(current_user.id),
                product_id=review_in.product_id,
                rating=review_in.rating,
                comment=review_in.comment,
                user_name=current_user.full_name or current_user.email.split('@')[0],
                avatar_url=None,
                size_bought=review_in.size_bought,
                color_bought=review_in.color_bought,
                images=review_in.images or [],
                verified_purchase=has_purchased,
                is_hidden=False
            )
            await review_db.insert()

        # 3. Khép kín Vòng lặp Phản hồi Tường minh (Explicit Feedback) vào bảng interactions cho mô hình NCF
        try:
            interaction = Interaction(
                user_id=str(current_user.id),
                product_id=review_in.product_id,
                interaction_type="review",
                rating=float(review_in.rating),
                timestamp=datetime.utcnow()
            )
            await interaction.insert()
            logger.info(f"[ReviewService] Recorded explicit feedback for NCF: user={current_user.id}, product={review_in.product_id}")
        except Exception as e:
            logger.warning(f"[ReviewService] Error recording explicit feedback into interactions: {e}")

        # 4. Tính toán lại điểm số và số lượt đánh giá cho sản phẩm
        await ReviewService._recalculate_product_rating(review_in.product_id)

        return review_db

    @staticmethod
    async def get_reviews_by_product(product_id: str) -> List[Review]:
        # Chỉ lấy các đánh giá chưa bị ẩn bởi quản trị viên
        reviews = await Review.find({
            "product_id": product_id,
            "is_hidden": {"$ne": True}
        }).sort("-timestamp").to_list()
        
        # Bổ sung user_name nếu chưa có trong DB (legacy data)
        missing_user_reviews = [r for r in reviews if not r.user_name and r.user_id]
        if missing_user_reviews:
            from bson import ObjectId
            user_ids = list(set([r.user_id for r in missing_user_reviews]))
            valid_obj_ids = []
            for uid in user_ids:
                try:
                    valid_obj_ids.append(ObjectId(uid))
                except Exception:
                    pass
            if valid_obj_ids:
                users = await User.find({"_id": {"$in": valid_obj_ids}}).to_list()
                user_map = {str(u.id): (u.full_name or u.username or "Khách hàng") for u in users}
                for r in missing_user_reviews:
                    if r.user_id in user_map:
                        r.user_name = user_map[r.user_id]
        
        return reviews
        
    @staticmethod
    async def get_featured_reviews(limit: int = 8):
        """Lấy các đánh giá tiêu biểu (rating >= 4, có comment ý nghĩa) kèm thông tin sản phẩm cho trang chủ"""
        raw_reviews = await Review.find({
            "rating": {"$gte": 4}, 
            "comment": {"$ne": None},
            "is_hidden": {"$ne": True}
        }).sort("-timestamp").limit(limit * 3).to_list()

        results = []
        product_cache = {}

        default_avatars = [
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        ]

        for idx, r in enumerate(raw_reviews):
            if not r.comment or len(r.comment.strip()) < 15:
                continue
            
            p_id = r.product_id
            if p_id not in product_cache:
                prod = await Product.find_one(Product.product_id == p_id)
                product_cache[p_id] = prod
            
            product = product_cache[p_id]
            product_name = product.name if product else f"Sản phẩm #{p_id}"
            product_image = product.image_url if product else None
            brand = product.brand if product else None

            results.append({
                "id": str(r.id),
                "user_id": r.user_id,
                "user_name": r.user_name or "Khách hàng thân thiết",
                "avatar_url": r.avatar_url or default_avatars[idx % len(default_avatars)],
                "product_id": r.product_id,
                "product_name": product_name,
                "product_image": product_image,
                "brand": brand,
                "rating": r.rating,
                "comment": r.comment,
                "size_bought": r.size_bought,
                "color_bought": r.color_bought,
                "verified_purchase": r.verified_purchase,
                "timestamp": r.timestamp
            })

            if len(results) >= limit:
                break

        return results

    @staticmethod
    async def get_user_reviews(current_user: User) -> List[Review]:
        reviews = await Review.find(Review.user_id == str(current_user.id)).sort("-timestamp").to_list()
        return reviews

    @staticmethod
    async def get_admin_reviews(
        skip: int = 0,
        limit: int = 20,
        rating: Optional[int] = None,
        search: Optional[str] = None,
        is_hidden: Optional[bool] = None
    ) -> Dict[str, Any]:
        """Lấy danh sách đánh giá có phân trang, tìm kiếm và lọc dành cho Quản trị viên"""
        query: Dict[str, Any] = {}
        if rating is not None:
            query["rating"] = rating
        if is_hidden is not None:
            query["is_hidden"] = is_hidden

        if search and search.strip():
            import re
            s = re.escape(search.strip())
            query["$or"] = [
                {"comment": {"$regex": s, "$options": "i"}},
                {"user_name": {"$regex": s, "$options": "i"}},
                {"product_id": {"$regex": s, "$options": "i"}}
            ]

        total = await Review.find(query).count()
        reviews = await Review.find(query).sort("-timestamp").skip(skip).limit(limit).to_list()

        # Cache product info để hiển thị đẹp trên admin
        prod_ids = list(set(r.product_id for r in reviews))
        products = await Product.find({"product_id": {"$in": prod_ids}}).to_list() if prod_ids else []
        prod_map = {p.product_id: p for p in products}

        items = []
        for r in reviews:
            prod = prod_map.get(r.product_id)
            items.append({
                "id": str(r.id),
                "user_id": r.user_id,
                "user_name": r.user_name or "Khách hàng",
                "avatar_url": r.avatar_url,
                "product_id": r.product_id,
                "product_name": prod.name if prod else f"Mã #{r.product_id}",
                "product_image": prod.image_url if prod else None,
                "brand": prod.brand if prod else None,
                "rating": r.rating,
                "comment": r.comment,
                "size_bought": r.size_bought,
                "color_bought": r.color_bought,
                "verified_purchase": r.verified_purchase,
                "is_hidden": getattr(r, 'is_hidden', False),
                "images": r.images or [],
                "timestamp": r.timestamp
            })

        pages = max(1, (total + limit - 1) // limit) if total > 0 else 1
        page = (skip // limit) + 1

        return {
            "total": total,
            "items": items,
            "page": page,
            "pages": pages
        }

    @staticmethod
    async def toggle_review_visibility(review_id: str, is_hidden: Optional[bool] = None) -> Optional[Review]:
        """Bật/tắt trạng thái ẩn đánh giá vi phạm và tính toán lại rating sản phẩm"""
        clean_id = str(review_id).strip()
        if not ObjectId.is_valid(clean_id):
            return None
        try:
            review = await Review.get(PydanticObjectId(clean_id))
            if not review:
                return None
            
            if is_hidden is not None:
                review.is_hidden = is_hidden
            else:
                review.is_hidden = not getattr(review, 'is_hidden', False)
                
            await review.save()
            await ReviewService._recalculate_product_rating(review.product_id)
            return review
        except Exception as e:
            logger.error(f"[ReviewService] Error toggling visibility for review {review_id}: {e}")
            return None

    @staticmethod
    async def delete_review(review_id: str) -> bool:
        """Xóa đánh giá vi phạm và tính toán lại điểm rating cho sản phẩm"""
        clean_id = str(review_id).strip()
        if not ObjectId.is_valid(clean_id):
            return False
        try:
            review = await Review.get(PydanticObjectId(clean_id))
            if not review:
                return False
            product_id = review.product_id
            await review.delete()
            await ReviewService._recalculate_product_rating(product_id)
            return True
        except Exception as e:
            logger.error(f"[ReviewService] Error deleting review {review_id}: {e}")
            return False

review_service = ReviewService()
