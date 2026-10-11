import sys
import os
import asyncio
import random
from datetime import datetime, timedelta

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from app.models.review import Review
from app.models.user import User
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

SAMPLE_COMMENTS = {
    5: [
        "Sản phẩm rất tuyệt vời, đúng như mô tả.",
        "Chất lượng tốt, đóng gói cẩn thận, giao hàng nhanh.",
        "Mang rất êm chân, phù hợp để chạy bộ hàng ngày.",
        "Màu sắc bên ngoài đẹp hơn trong hình. Rất ưng ý!",
        "Chất liệu xịn, đáng đồng tiền bát gạo.",
        "Sẽ ủng hộ shop thêm nhiều lần nữa."
    ],
    4: [
        "Sản phẩm tốt, nhưng hộp bị móp một chút do vận chuyển.",
        "Chất lượng khá ổn trong tầm giá.",
        "Mặc mát và thoải mái, tuy nhiên size hơi rộng so với mình.",
        "Hàng giao đúng hạn, chất lượng đúng như quảng cáo.",
        "Khá ổn, dùng tốt cho việc tập luyện cơ bản."
    ],
    3: [
        "Chất lượng bình thường, không có gì nổi bật.",
        "Đường may còn vài chỗ lỗi chỉ, tạm chấp nhận được.",
        "Sản phẩm tạm ổn, nhưng giao hàng hơi chậm.",
        "Màu sắc hơi khác so với hình chụp."
    ],
    2: [
        "Chất liệu khá mỏng, không giống như kỳ vọng.",
        "Mang không được êm cho lắm.",
        "Giao sai màu, mong shop rút kinh nghiệm."
    ],
    1: [
        "Sản phẩm kém chất lượng, không đáng tiền.",
        "Thái độ phục vụ của bên giao hàng rất tệ.",
        "Vừa dùng được vài hôm đã bung keo."
    ]
}

async def seed_reviews():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product, Review, User])

    # Get some random users or create dummy ones if none exist
    users = await User.find_all().to_list()
    if not users:
        print("No users found. Creating dummy users...")
        for i in range(50):
            dummy_user = User(
                username=f"khachhang{i+1}",
                email=f"khachhang{i+1}@example.com",
                full_name=f"Khách hàng {i+1}",
                hashed_password="hashed" # fake
            )
            await dummy_user.insert()
            users.append(dummy_user)
            
    products = await Product.find_all().to_list()
    if not products:
        print("No products found to review!")
        return

    # Delete existing reviews
    await Review.find_all().delete()
    print("Cleared existing reviews.")

    total_reviews = 0

    for product in products:
        # 90% chance a product has reviews, randomly 5 to 25 reviews to create dense interactions
        if random.random() < 0.9:
            num_reviews = random.randint(5, 25)
            total_score = 0
            
            for _ in range(num_reviews):
                user = random.choice(users)
                
                # Biased towards good ratings
                rating = random.choices([5, 4, 3, 2, 1], weights=[50, 30, 10, 5, 5])[0]
                total_score += rating
                
                comment = random.choice(SAMPLE_COMMENTS[rating])
                
                # Random timestamp within last 6 months
                days_ago = random.randint(1, 180)
                review_time = datetime.utcnow() - timedelta(days=days_ago)

                review = Review(
                    user_id=str(user.id),
                    user_name=user.full_name or user.username or "Khách hàng",
                    product_id=product.product_id,
                    rating=rating,
                    comment=comment,
                    timestamp=review_time
                )
                await review.insert()
                total_reviews += 1
            
            # Update product rating and reviews count
            avg_rating = round(total_score / num_reviews, 1)
            product.rating = avg_rating
            product.reviews_count = num_reviews
            await product.save()
        else:
            # 30% chance product has 0 reviews
            product.rating = 0
            product.reviews_count = 0
            await product.save()

    print(f"Successfully seeded {total_reviews} reviews for {len(products)} products.")

if __name__ == "__main__":
    asyncio.run(seed_reviews())
