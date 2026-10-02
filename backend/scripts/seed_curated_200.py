import asyncio
import gzip
import json
import random
import sys
import os
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from datetime import datetime, timedelta

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.product import Product
from app.models.review import Review
from app.models.user import User
from app.core.config import settings

def is_blacklisted(text: str):
    blacklist = ['helmet', 'american football', 'nfl', 'pump', 'mouth guard', 'baseball', 'basketball', 'golf', 'hockey', 'softball', 'mouthguard', 'cleats']
    return any(b in text for b in blacklist)

def get_sport_and_type(title_lower: str, cat_str: str):
    combined = title_lower + " " + cat_str
    
    # Exclude unwanted sports
    if is_blacklisted(combined):
        return None, None
        
    sport_type = None
    product_type = None
    
    # 1. Sport
    if any(k in combined for k in ['soccer', 'đá bóng', 'football']):
        if 'football' in combined and not 'soccer' in combined:
            return None, None # Prevent American football
        sport_type = "Đá bóng"
    elif any(k in combined for k in ['badminton', 'cầu lông', 'shuttlecock']):
        sport_type = "Cầu lông"
    elif any(k in combined for k in ['volleyball', 'bóng chuyền']):
        sport_type = "Bóng chuyền"
    elif any(k in combined for k in ['running', 'chạy bộ', 'marathon']):
        sport_type = "Chạy bộ"
    elif any(k in combined for k in ['pickleball']):
        sport_type = "Pickleball"
    elif any(k in combined for k in ['tent', 'camping', 'outdoor', 'hiking', 'trekking', 'sleeping bag', 'dã ngoại']):
        sport_type = "Dã ngoại"
    elif any(k in combined for k in ['yoga', 'gym', 'fitness', 'workout', 'training']):
        sport_type = "Đa dụng"
        
    if not sport_type:
        return None, None

    # 2. Type
    if any(k in combined for k in ["shirt", "jersey", "pant", "short", "apparel", "clothing", "jacket", "áo", "quần"]):
        product_type = "Quần áo"
    elif any(k in combined for k in ["shoe", "sneaker", "boot", "footwear", "sandal", "giày", "dép"]):
        product_type = "Giày dép"
    elif any(k in combined for k in ["bag", "sock", "hat", "cap", "glove", "sleeve", "phụ kiện", "balo", "vớ", "mũ"]):
        product_type = "Phụ kiện"
    elif any(k in combined for k in ["ball", "racket", "net", "equipment", "tent", "mat", "vợt", "bóng", "thiết bị"]):
        product_type = "Thiết bị"
    else:
        # Default fallback based on sport
        if sport_type == 'Đá bóng': product_type = 'Quần áo'
        elif sport_type == 'Dã ngoại': product_type = 'Thiết bị'
        else: product_type = 'Phụ kiện'

    return product_type, sport_type

# Localized naming dictionaries
BRAND_MAP = {
    'Đá bóng': ['Kamito', 'Mizuno', 'Adidas', 'Nike', 'Wika', 'Jogarbola'],
    'Cầu lông': ['Yonex', 'Lining', 'Victor', 'Kumpoo', 'Kawasaki'],
    'Bóng chuyền': ['Beyono', 'Mizuno', 'Asics', 'Molten', 'Mikasa'],
    'Chạy bộ': ['Asics', 'Nike', 'Adidas', 'Saucony', 'Hoka', 'Xtep'],
    'Pickleball': ['Joola', 'Selkirk', 'Engage', 'Paddletek'],
    'Dã ngoại': ['Naturehike', 'Coleman', 'Camel', 'Trekking Pro'],
    'Đa dụng': ['Lululemon', 'Nike', 'Under Armour', 'Gymshark', 'Oxy']
}

NAMES_MAP = {
    'Quần áo': {
        'Đá bóng': ['Áo Bóng Đá ĐTQG', 'Bộ Quần Áo CLB', 'Áo Tập Training Cao Cấp', 'Áo Đá Bóng Vải Thun Lạnh'],
        'Cầu lông': ['Áo Cầu Lông Thi Đấu', 'Quần Cầu Lông Co Giãn', 'Áo Váy Cầu Lông Nữ', 'Áo Polo Cầu Lông Thoáng Khí', 'Bộ Quần Áo Cầu Lông Victor'],
        'Bóng chuyền': ['Bộ Áo Quần Bóng Chuyền Nam', 'Đồ Bóng Chuyền Nữ', 'Áo Bóng Chuyền Sát Nách'],
        'Chạy bộ': ['Áo T-Shirt Chạy Bộ', 'Quần Short Chạy Bộ 2 Lớp', 'Áo Khoác Chống Gió Running'],
        'Đa dụng': ['Áo Bra Tập Yoga', 'Quần Legging Nữ', 'Áo Tanktop Tập Gym Nam'],
        'Pickleball': ['Áo Polo Pickleball Sành Điệu', 'Chân Váy Pickleball Nữ', 'Bộ Đồ Thể Thao Pickleball', 'Áo Thun Chơi Pickleball'],
        'Dã ngoại': ['Áo Khoác Gió Dã Ngoại Chống Nước', 'Quần Kaki Túi Hộp Leo Núi', 'Áo Phản Quang Trekking']
    },
    'Giày dép': {
        'Đá bóng': ['Giày Đá Bóng Đinh TF', 'Giày Bóng Đá Sân Cỏ Nhân Tạo', 'Giày Đá Banh Siêu Nhẹ'],
        'Cầu lông': ['Giày Cầu Lông Bám Sân Tốt', 'Giày Chơi Cầu Lông Chuyên Nghiệp', 'Giày Cầu Lông Êm Ái'],
        'Bóng chuyền': ['Giày Bóng Chuyền Cổ Thấp', 'Giày Bóng Chuyền Bật Nhảy Cao', 'Giày Bóng Chuyền Chống Trượt'],
        'Chạy bộ': ['Giày Chạy Bộ Đường Nhựa', 'Giày Chạy Địa Hình Trail', 'Giày Chạy Bộ Siêu Nhẹ'],
        'Pickleball': ['Giày Pickleball Mũi Thoải Mái', 'Giày Đánh Pickleball Sân Cứng', 'Giày Pickleball Siêu Nhẹ'],
        'Dã ngoại': ['Giày Leo Núi Chống Nước', 'Giày Trekking Đế Cứng', 'Sandal Dã Ngoại Chống Trơn'],
        'Đa dụng': ['Giày Tập Gym Đế Phẳng', 'Giày Sneaker Thể Thao Đa Năng', 'Giày Thể Thao Thời Trang']
    },
    'Thiết bị': {
        'Cầu lông': ['Vợt Cầu Lông Trợ Lực', 'Vợt Cầu Lông Tấn Công', 'Quả Cầu Lông Tiêu Chuẩn'],
        'Đá bóng': ['Quả Bóng Đá Size 5', 'Quả Bóng Đá Tiêu Chuẩn FIFA', 'Khung Thành Mini Di Động'],
        'Pickleball': ['Vợt Pickleball Sợi Carbon', 'Bóng Pickleball Ngoài Trời', 'Vợt Pickleball Trọng Lượng Nhẹ', 'Bộ Lưới Pickleball Di Động'],
        'Dã ngoại': ['Lều Cắm Trại 2-4 Người', 'Túi Ngủ Dã Ngoại Chống Rét', 'Bếp Ga Gấp Gọn Dã Ngoại', 'Thảm Trải Lều Chống Thấm'],
        'Bóng chuyền': ['Quả Bóng Chuyền Hơi', 'Quả Bóng Chuyền Thi Đấu Trong Nhà', 'Lưới Bóng Chuyền Tiêu Chuẩn'],
        'Chạy bộ': ['Máy Chạy Bộ Mini Tại Nhà', 'Đồng Hồ Đo Nhịp Tim Chạy Bộ'],
        'Đa dụng': ['Thảm Tập Yoga TPE', 'Tạ Đơn Tập Gym Dây Cao Su', 'Dây Kháng Lực Đa Năng']
    },
    'Phụ kiện': {
        'Đá bóng': ['Tất Ống Đồng Chống Trượt', 'Bọc Ống Đồng Bóng Đá', 'Balo Thể Thao Đựng Giày', 'Găng Tay Thủ Môn'],
        'Cầu lông': ['Băng Chặn Mồ Hôi Tay', 'Balo Đựng Vợt Cầu Lông', 'Quấn Cán Vợt Chống Trượt', 'Tất Cầu Lông Dày Dặn'],
        'Chạy bộ': ['Đai Chạy Bộ Đựng Điện Thoại', 'Bình Nước Chạy Bộ Cầm Tay', 'Mũ Lưỡi Trai Chạy Bộ', 'Tất Chạy Bộ Chống Phồng Rộp'],
        'Bóng chuyền': ['Băng Bảo Vệ Đầu Gối Bóng Chuyền', 'Ống Tay Bóng Chuyền', 'Băng Cuốn Cổ Chân'],
        'Pickleball': ['Băng Đô Thấm Mồ Hôi Pickleball', 'Túi Đựng Vợt Pickleball Cao Cấp', 'Bóng Pickleball Trong Nhà'],
        'Dã ngoại': ['Đèn Pin Đội Đầu Dã Ngoại', 'Bình Nước Giữ Nhiệt Khóa Bấm', 'Mũ Tai Bèo Che Nắng Cắm Trại'],
        'Đa dụng': ['Găng Tay Tập Gym Thoáng Khí', 'Băng Đô Thể Thao Nam Nữ', 'Balo Dây Rút Thể Thao']
    }
}

def localize_product(product_type, sport_type, default_name):
    brands = BRAND_MAP.get(sport_type, ['PRO SPORTS'])
    brand = random.choice(brands)
    
    adjectives = ['Cao Cấp', 'Chính Hãng', 'Siêu Bền', 'Nhập Khẩu', 'Thế Hệ Mới', 'PRO', 'Elite']
    
    # Try to find a localized base name
    base_names = NAMES_MAP.get(product_type, {}).get(sport_type, [])
    if base_names:
        base_name = random.choice(base_names)
        name = f"{brand} {base_name} {random.choice(adjectives)} - V{random.randint(100, 999)}"
    else:
        # Fallback to a generic localized name
        name = f"{brand} {product_type} {sport_type} {random.choice(adjectives)} - V{random.randint(100, 999)}"
        
    return name, brand

async def seed_curated_data():
    filepath = r"D:\Dataset Amazon\meta_Sports_and_Outdoors.json.gz"
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    await init_beanie(database=client[settings.MONGODB_DB_NAME], document_models=[Product, Review, User])
    
    print("Clearing old products & reviews...")
    await Product.find_all().delete()
    await Review.find_all().delete()
    
    counts = {
        'Đá bóng': 0,
        'Cầu lông': 0,
        'Bóng chuyền': 0,
        'Chạy bộ': 0,
        'Pickleball': 0,
        'Dã ngoại': 0,
        'Đa dụng': 0
    }
    TARGET_PER_SPORT = 30 # 7 * 30 = 210 products total
    
    batch = []
    
    with gzip.open(filepath, 'rt', encoding='utf-8') as f:
        for line in f:
            # Stop if we have enough of everything
            if all(v >= TARGET_PER_SPORT for v in counts.values()):
                break
                
            try:
                data = json.loads(line)
                title_lower = data.get('title', '').lower()
                cat_str = " ".join(data.get('category', [])).lower()
                
                p_type, s_type = get_sport_and_type(title_lower, cat_str)
                if not p_type or not s_type:
                    continue
                    
                if counts[s_type] >= TARGET_PER_SPORT:
                    continue
                    
                image_urls = data.get('imageURLHighRes', [])
                if not image_urls:
                    continue
                image_url = image_urls[0]
                
                # Assign Asian pricing
                price_val = random.randint(2, 20) * 100000 # 200k to 2M VND
                
                name, brand = localize_product(p_type, s_type, data.get('title'))
                
                sizes = []
                if p_type in ['Giày dép']:
                    sizes = ['39', '40', '41', '42', '43']
                elif p_type in ['Quần áo']:
                    sizes = ['S', 'M', 'L', 'XL', 'XXL']
                    
                colors = random.sample(['Đen', 'Trắng', 'Xanh Navy', 'Đỏ', 'Xám'], 2)
                
                product = Product(
                    product_id=data.get('asin', ''),
                    name=name,
                    price=price_val,
                    image_url=image_url,
                    category=[s_type, p_type],
                    product_type=p_type,
                    sport_type=s_type,
                    brand=brand,
                    rating=round(random.uniform(4.0, 5.0), 1),
                    reviews_count=random.randint(20, 500),
                    sizes=sizes,
                    colors=colors
                )
                batch.append(product)
                counts[s_type] += 1
                
            except Exception as e:
                pass
                
    if batch:
        await Product.insert_many(batch)
        print(f"Inserted {len(batch)} curated products!")
        
    # Generate users and reviews
    users = await User.find_all().to_list()
    if not users:
        print("Creating 50 dummy users for reviews...")
        for i in range(50):
            dummy_user = User(
                username=f"nguoidung{i+1}",
                email=f"user{i+1}@example.com",
                full_name=f"Khách hàng {i+1}",
                hashed_password="hashed"
            )
            await dummy_user.insert()
            users.append(dummy_user)
            
    products = await Product.find_all().to_list()
    print("Generating dense interactions (reviews)...")
    reviews_batch = []
    
    COMMENTS = [
        "Sản phẩm rất tốt, đúng form người châu Á.",
        "Chất liệu thoáng mát, phù hợp với thời tiết Việt Nam.",
        "Giao hàng nhanh, shop đóng gói cẩn thận.",
        "Đúng thương hiệu chính hãng, dùng rất bền.",
        "Form áo hơi ôm, khuyên anh em nên tăng 1 size.",
        "Giày bám sân rất tốt, chạy không bị trượt.",
        "Giá cả hợp lý so với chất lượng nhận được.",
        "Đồ đẹp, rất hài lòng với số tiền bỏ ra."
    ]
    
    for product in products:
        num_reviews = random.randint(5, 15)
        for _ in range(num_reviews):
            user = random.choice(users)
            rating = random.choices([5, 4, 3], weights=[70, 20, 10])[0]
            comment = random.choice(COMMENTS)
            days_ago = random.randint(1, 100)
            
            review = Review(
                product_id=product.product_id,
                user_id=str(user.id),
                user_name=user.full_name,
                rating=rating,
                comment=comment,
                created_at=datetime.utcnow() - timedelta(days=days_ago)
            )
            reviews_batch.append(review)
            
    if reviews_batch:
        await Review.insert_many(reviews_batch)
        print(f"Seeded {len(reviews_batch)} reviews!")

if __name__ == "__main__":
    asyncio.run(seed_curated_data())
