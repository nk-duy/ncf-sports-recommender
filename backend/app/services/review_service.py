from typing import List
from app.models.review import Review
from app.models.user import User
from app.schemas.review import ReviewCreate

class ReviewService:
    @staticmethod
    async def create_review(review_in: ReviewCreate, current_user: User) -> Review:
        review_db = Review(
            user_id=str(current_user.id),
            product_id=review_in.product_id,
            rating=review_in.rating,
            comment=review_in.comment
        )
        await review_db.insert()
        return review_db

    @staticmethod
    async def get_reviews_by_product(product_id: str) -> List[Review]:
        reviews = await Review.find(Review.product_id == product_id).sort("-timestamp").to_list()
        return reviews
        
    @staticmethod
    async def get_user_reviews(current_user: User) -> List[Review]:
        reviews = await Review.find(Review.user_id == str(current_user.id)).sort("-timestamp").to_list()
        return reviews

review_service = ReviewService()
