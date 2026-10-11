import asyncio
import random
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from app.core.config import settings
from app.models.product import Product
from app.models.user import User
from app.models.review import Review

MOCK_REVIEWS = [
    {
        "rating": 5,
        "comment": "Sản phẩm giao cực kỳ nhanh, đóng gói chắc chắn. Đáng tiền lắm mọi người nên mua nhé!",
        "size_bought": "L",
        "color_bought": "Xanh Navy",
        "images": ["https://vn-test-11.slatic.net/p/3b127ffc64032d91bb261eb891ed123c.jpg"]
    },
    {
        "rating": 5,
        "comment": "Chất lượng tuyệt vời. Rất đáng đồng tiền bát gạo. Shop hỗ trợ nhiệt tình.",
        "size_bought": "M",
        "color_bought": "Đen",
        "images": []
    },
    {
        "rating": 4,
        "comment": "Hàng đẹp, tuy nhiên màu thực tế hơi tối hơn so với hình chụp một chút xíu.",
        "size_bought": "XL",
        "color_bought": "Trắng",
        "images": []
    },
    {
        "rating": 5,
        "comment": "Mình mua để tặng bạn, bạn mình rất thích. Sẽ tiếp tục ủng hộ shop.",
        "size_bought": "S",
        "color_bought": "Đỏ",
        "images": ["https://vn-test-11.slatic.net/p/0df06c0fa1a7a0033cc178f56477e6f8.jpg"]
    },
    {
        "rating": 3,
        "comment": "Sản phẩm tạm ổn, giao hàng hơi chậm. Cần cải thiện tốc độ giao hàng.",
        "size_bought": "M",
        "color_bought": "Xám",
        "images": []
    }
]

MOCK_USERS = [
    {"user_name": "Nguyễn Văn Hải", "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"},
    {"user_name": "Trần Thị Mai", "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"},
    {"user_name": "Lê Hoàng Nam", "avatar_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80"},
    {"user_name": "Phạm Văn Tuấn", "avatar_url": "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=120&q=80"},
    {"user_name": "Hoàng Thị Ngọc", "avatar_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"}
]

async def seed_reviews():
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client[settings.MONGODB_DB_NAME]
    await init_beanie(database=db, document_models=[Product, User, Review])
    
    products = await Product.find_all().to_list()
    if not products:
        print("Không có sản phẩm nào trong DB!")
        return
        
    print(f"Bắt đầu seed đánh giá cho {len(products)} sản phẩm...")
    
    count = 0
    for product in products:
        # Kiểm tra xem sản phẩm đã có review chưa
        existing = await Review.find({"product_id": str(product.id)}).count()
        if existing > 0:
            continue
            
        # Add 1 to 5 random reviews
        num_reviews = random.randint(1, 5)
        for _ in range(num_reviews):
            mock_rev = random.choice(MOCK_REVIEWS)
            mock_user = random.choice(MOCK_USERS)
            
            review = Review(
                user_id=f"fake_user_{random.randint(100, 999)}",
                product_id=str(product.id),
                rating=mock_rev["rating"],
                comment=mock_rev["comment"],
                user_name=mock_user["user_name"],
                avatar_url=mock_user["avatar_url"],
                size_bought=mock_rev["size_bought"] if random.random() > 0.5 else None,
                color_bought=mock_rev["color_bought"] if random.random() > 0.5 else None,
                images=mock_rev["images"] if random.random() > 0.7 else [],
                verified_purchase=True
            )
            await review.insert()
            count += 1
            
    print(f"Hoàn thành! Đã thêm {count} đánh giá mới.")

if __name__ == "__main__":
    asyncio.run(seed_reviews())
