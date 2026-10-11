from typing import List
from app.models.review import Review
from app.models.product import Product
from app.models.user import User
from app.schemas.review import ReviewCreate

class ReviewService:
    @staticmethod
    async def create_review(review_in: ReviewCreate, current_user: User) -> Review:
        # Giả lập đã mua hàng (thực tế cần check DB Order xem user đã mua product_id này chưa)
        has_purchased = True 
        
        review_db = Review(
            user_id=str(current_user.id),
            product_id=review_in.product_id,
            rating=review_in.rating,
            comment=review_in.comment,
            user_name=current_user.full_name or current_user.email.split('@')[0],
            avatar_url=None, # user.avatar_url nếu có trong User model tương lai
            size_bought=review_in.size_bought,
            color_bought=review_in.color_bought,
            images=review_in.images or [],
            verified_purchase=has_purchased
        )
        await review_db.insert()

        # Cập nhật số liệu thực tế cho sản phẩm
        all_reviews = await Review.find(Review.product_id == review_in.product_id).to_list()
        if all_reviews:
            avg_rating = round(sum(r.rating for r in all_reviews) / len(all_reviews), 1)
            product = await Product.find_one(Product.product_id == review_in.product_id)
            if product:
                product.rating = avg_rating
                product.reviews_count = len(all_reviews)
                await product.save()

        return review_db

    @staticmethod
    async def get_reviews_by_product(product_id: str) -> List[Review]:
        reviews = await Review.find(Review.product_id == product_id).sort("-timestamp").to_list()
        
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
        # Lấy các review rating cao và có comment
        raw_reviews = await Review.find(
            {"rating": {"$gte": 4}, "comment": {"$ne": None}}
        ).sort("-timestamp").limit(limit * 3).to_list()

        results = []
        product_cache = {}

        # Avatar fallback list nếu review không có avatar
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
                "verified_purchase": True,
                "timestamp": r.timestamp
            })

            if len(results) >= limit:
                break

        return results

    @staticmethod
    async def get_user_reviews(current_user: User) -> List[Review]:
        reviews = await Review.find(Review.user_id == str(current_user.id)).sort("-timestamp").to_list()
        return reviews

review_service = ReviewService()
