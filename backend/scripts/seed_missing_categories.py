import asyncio
import sys
import os
import random
from datetime import datetime

# Add backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.models.product import Product
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

SAMPLE_PRODUCTS = [
    # =========================================================================
    # 1. DÃ NGOẠI > THIẾT BỊ > LỀU & DỤNG CỤ OUTDOOR
    # =========================================================================
    {
        "product_id": "OUT-LEU-001",
        "name": "Lều Cắm Trại Tự Bung Chống Mưa 4 Người NatureHike Ango",
        "price": 1850000,
        "image_url": "https://images.unsplash.com/photo-1525811902-f2342640856e?w=600&q=80",
        "sport_type": "Dã ngoại",
        "product_type": "Thiết bị",
        "category": ["Dã ngoại", "Thiết bị", "Lều & Dụng Cụ Outdoor", "Cắm trại"],
        "sub_category": "Lều & Dụng Cụ Outdoor",
        "brand": "Decathlon",
        "rating": 4.9,
        "reviews_count": 86,
        "sizes": ["4 Người", "Tiêu chuẩn"],
        "colors": ["Xanh Rêu", "Be Khaki"],
        "stock": 35,
        "gender": "Unisex",
        "description": "Lều tự bung thế hệ mới chịu gió cấp 6, lớp phủ bạc chống tia UV UPF50+, chống thấm nước PU 3000mm. Không gian rộng rãi thoáng khí 4 mặt lưới chống côn trùng."
    },
    {
        "product_id": "OUT-LEU-002",
        "name": "Lều Cắm Trại Siêu Nhẹ 2 Người Chống Bão Coleman WeatherMaster",
        "price": 1450000,
        "image_url": "https://images.unsplash.com/photo-1504280390227-331ef29b4cb6?w=600&q=80",
        "sport_type": "Dã ngoại",
        "product_type": "Thiết bị",
        "category": ["Dã ngoại", "Thiết bị", "Lều & Dụng Cụ Outdoor", "Leo núi"],
        "sub_category": "Lều & Dụng Cụ Outdoor",
        "brand": "Decathlon",
        "rating": 4.8,
        "reviews_count": 64,
        "sizes": ["2 Người"],
        "colors": ["Cam", "Xám"],
        "stock": 28,
        "gender": "Unisex",
        "description": "Khung nhôm hàng không 7001 siêu cứng và nhẹ, trọng lượng chỉ 1.8kg gấp gọn vừa vặn balo leo núi. Chịu mưa rào lớn và gió mạnh tại các đỉnh núi cao."
    },
    {
        "product_id": "OUT-TOOL-003",
        "name": "Bếp Ga Dã Ngoại Xếp Gọn Đánh Lửa Tự Động Kovea Spider",
        "price": 590000,
        "image_url": "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=600&q=80",
        "sport_type": "Dã ngoại",
        "product_type": "Thiết bị",
        "category": ["Dã ngoại", "Thiết bị", "Lều & Dụng Cụ Outdoor", "Dụng cụ dã ngoại"],
        "sub_category": "Lều & Dụng Cụ Outdoor",
        "brand": "Decathlon",
        "rating": 4.7,
        "reviews_count": 42,
        "sizes": ["Tiêu chuẩn"],
        "colors": ["Bạc"],
        "stock": 50,
        "gender": "Unisex",
        "description": "Bếp ga mini công suất 3000W đun sôi 1L nước chỉ trong 3.5 phút. Thiết kế gấp 3 chân vững chãi chịu tải nồi dã ngoại tới 10kg."
    },
    {
        "product_id": "OUT-TOOL-004",
        "name": "Bộ Nồi Nhôm Anodized Dã Ngoại 4 Món Cho Gia Đình Fire-Maple",
        "price": 720000,
        "image_url": "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80",
        "sport_type": "Dã ngoại",
        "product_type": "Thiết bị",
        "category": ["Dã ngoại", "Thiết bị", "Lều & Dụng Cụ Outdoor"],
        "sub_category": "Lều & Dụng Cụ Outdoor",
        "brand": "Decathlon",
        "rating": 4.8,
        "reviews_count": 39,
        "sizes": ["Bộ 4 món"],
        "colors": ["Xám Titan"],
        "stock": 40,
        "gender": "Unisex",
        "description": "Hợp kim nhôm siêu nhẹ xử lý oxy hóa điện cực chống dính, chống gỉ sét tuyệt đối. Quai cầm bọc silicon cách nhiệt gập gọn thông minh."
    },

    # =========================================================================
    # 2. PHỤ KIỆN CHUNG > PHỤ KIỆN > VỚ THỂ THAO DỆT KIM
    # =========================================================================
    {
        "product_id": "ACC-VO-001",
        "name": "Set 3 Đôi Vớ Thể Thao Cổ Trung Chống Trượt Dệt Kim Nike Everyday Plus",
        "price": 280000,
        "image_url": "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Vớ Thể Thao Dệt Kim", "Tất thể thao"],
        "sub_category": "Vớ Thể Thao Dệt Kim",
        "brand": "Nike",
        "rating": 4.9,
        "reviews_count": 145,
        "sizes": ["M (38-41)", "L (42-45)"],
        "colors": ["Trắng", "Đen", "Xám"],
        "stock": 120,
        "gender": "Unisex",
        "description": "Sợi cotton dệt kim công nghệ Dri-FIT thấm hút mồ hôi tối ưu, đệm êm gót chân và mũi chân giúp giảm chấn khi vận động cường độ cao."
    },
    {
        "product_id": "ACC-VO-002",
        "name": "Vớ Thể Thao Dệt Kim Kháng Khuẩn Bàn Chân Thoáng Khí Adidas Cushioned Crew",
        "price": 250000,
        "image_url": "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Vớ Thể Thao Dệt Kim"],
        "sub_category": "Vớ Thể Thao Dệt Kim",
        "brand": "Adidas",
        "rating": 4.8,
        "reviews_count": 98,
        "sizes": ["M", "L"],
        "colors": ["Đen", "Trắng"],
        "stock": 85,
        "gender": "Unisex",
        "description": "Gia cố vòm bàn chân chống xô lệch tất, lưới dệt tổ ong thoát nhiệt cực nhanh phù hợp cả chạy bộ, gym lẫn bóng rổ."
    },
    {
        "product_id": "ACC-VO-003",
        "name": "Vớ Dệt Kim Cổ Ngắn Nén Vòm Chân Khử Mùi Puma Sport Tech",
        "price": 190000,
        "image_url": "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Vớ Thể Thao Dệt Kim"],
        "sub_category": "Vớ Thể Thao Dệt Kim",
        "brand": "Puma",
        "rating": 4.7,
        "reviews_count": 56,
        "sizes": ["Freesize"],
        "colors": ["Xám", "Trắng", "Xanh Navy"],
        "stock": 90,
        "gender": "Unisex",
        "description": "Thiết kế cổ ngắn ôm sát mắt cá chân, chống phồng rộp da chân khi mang giày tập luyện trong thời gian dài."
    },

    # =========================================================================
    # 3. PHỤ KIỆN CHUNG > PHỤ KIỆN > BALO / TÚI THỂ THAO
    # =========================================================================
    {
        "product_id": "ACC-BALO-001",
        "name": "Balo Thể Thao Đa Năng Có Ngăn Giày Riêng Biệt Nike Brasilia 9.5",
        "price": 890000,
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Balo / Túi Thể Thao", "Balo"],
        "sub_category": "Balo / Túi Thể Thao",
        "brand": "Nike",
        "rating": 4.9,
        "reviews_count": 182,
        "sizes": ["30L", "Tiêu chuẩn"],
        "colors": ["Đen", "Xanh Navy"],
        "stock": 45,
        "gender": "Unisex",
        "description": "Dung tích 30L thoải mái đựng đồ tập gym, giày, bình nước và laptop 15.6 inch. Chất liệu vải polyester chống trượt nước bền bỉ."
    },
    {
        "product_id": "ACC-TUI-002",
        "name": "Túi Trống Thể Thao Tập Gym Chống Nước Adidas Defender Duffel",
        "price": 650000,
        "image_url": "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Balo / Túi Thể Thao", "Túi trống"],
        "sub_category": "Balo / Túi Thể Thao",
        "brand": "Adidas",
        "rating": 4.8,
        "reviews_count": 110,
        "sizes": ["M (39L)"],
        "colors": ["Đen", "Xám Đậm"],
        "stock": 55,
        "gender": "Unisex",
        "description": "Túi trống thể thao quai đeo có đệm mút êm ái, ngăn thông gió bảo quản quần áo ướt và giày tập sau mỗi buổi tập luyện."
    },
    {
        "product_id": "ACC-TUI-003",
        "name": "Túi Đeo Chéo Thể Thao Nhỏ Gọn Chống Thấm Puma Phase Waist Bag",
        "price": 350000,
        "image_url": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Balo / Túi Thể Thao", "Túi chéo"],
        "sub_category": "Balo / Túi Thể Thao",
        "brand": "Puma",
        "rating": 4.6,
        "reviews_count": 78,
        "sizes": ["Tiêu chuẩn"],
        "colors": ["Đen", "Xanh Rêu"],
        "stock": 60,
        "gender": "Unisex",
        "description": "Túi bao tử đeo chéo gọn nhẹ đựng vừa điện thoại, ví tiền, chìa khóa khi chạy bộ, đi dạo hoặc đi du lịch thể thao."
    },

    # =========================================================================
    # 4. PHỤ KIỆN CHUNG > PHỤ KIỆN > MŨ / NÓN NĂNG ĐỘNG
    # =========================================================================
    {
        "product_id": "ACC-MU-001",
        "name": "Mũ Lưỡi Trai Thể Thao Siêu Thoáng Khí Chống Tia UV Nike Dri-FIT Club",
        "price": 450000,
        "image_url": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Mũ / Nón Năng Động", "Nón lưỡi trai"],
        "sub_category": "Mũ / Nón Năng Động",
        "brand": "Nike",
        "rating": 4.9,
        "reviews_count": 164,
        "sizes": ["Freesize điều chỉnh"],
        "colors": ["Đen", "Trắng", "Xanh Navy"],
        "stock": 80,
        "gender": "Unisex",
        "description": "Chất vải dù mỏng nhẹ công nghệ AeroBill giảm lực cản gió, vành mũ cong tự nhiên chống lóa nắng hiệu quả khi chơi thể thao ngoài trời."
    },
    {
        "product_id": "ACC-MU-002",
        "name": "Mũ Nửa Đầu Chạy Bộ & Tennis Siêu Nhẹ Adidas Superlite Visor",
        "price": 380000,
        "image_url": "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Mũ / Nón Năng Động", "Mũ nửa đầu"],
        "sub_category": "Mũ / Nón Năng Động",
        "brand": "Adidas",
        "rating": 4.8,
        "reviews_count": 92,
        "sizes": ["Freesize điều chỉnh"],
        "colors": ["Trắng", "Hồng", "Đen"],
        "stock": 65,
        "gender": "Unisex",
        "description": "Mũ visor nửa đầu giải phóng đỉnh đầu thoáng mát tối đa, đai thấm mồ hôi Climalite giữ cho tầm nhìn luôn khô ráo và thoải mái."
    },
    {
        "product_id": "ACC-MU-003",
        "name": "Mũ Bucket Tai Bèo Dã Ngoại Chống Nước Decathlon Forclaz Trek 500",
        "price": 320000,
        "image_url": "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Mũ / Nón Năng Động", "Mũ tai bèo"],
        "sub_category": "Mũ / Nón Năng Động",
        "brand": "Decathlon",
        "rating": 4.7,
        "reviews_count": 45,
        "sizes": ["Freesize"],
        "colors": ["Xanh Rêu", "Be Khaki"],
        "stock": 50,
        "gender": "Unisex",
        "description": "Mũ tai bèo vành rộng che chắn 360 độ cho mặt và gáy, có dây rút cố định chống bay gió khi đi trekking ngoài trời."
    },

    # =========================================================================
    # 5. PHỤ KIỆN CHUNG > PHỤ KIỆN > BĂNG GỐI / LÓT GIÀY
    # =========================================================================
    {
        "product_id": "ACC-GOI-001",
        "name": "Băng Bảo Vệ Khớp Gối Đàn Hồi 4 Chiều Giảm Chấn LP Support Pro",
        "price": 320000,
        "image_url": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Băng Gối / Lót Giày", "Bảo vệ gối"],
        "sub_category": "Băng Gối / Lót Giày",
        "brand": "Asics",
        "rating": 4.9,
        "reviews_count": 138,
        "sizes": ["M", "L", "XL"],
        "colors": ["Đen", "Xám"],
        "stock": 75,
        "gender": "Unisex",
        "description": "Chất liệu cao su tổng hợp kết hợp sợi nylon co giãn 4 chiều hỗ trợ giữ vững bánh chè, giảm nguy cơ chấn thương dây chằng khi bật nhảy."
    },
    {
        "product_id": "ACC-LOT-002",
        "name": "Lót Giày Thể Thao Silicon Đệm Gel Giảm Chấn Chống Đau Gót Chân Asics Ortholite",
        "price": 280000,
        "image_url": "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Băng Gối / Lót Giày", "Lót giày"],
        "sub_category": "Băng Gối / Lót Giày",
        "brand": "Asics",
        "rating": 4.8,
        "reviews_count": 105,
        "sizes": ["36-40 (Cắt tùy chỉnh)", "41-45 (Cắt tùy chỉnh)"],
        "colors": ["Xanh Dương", "Vàng"],
        "stock": 100,
        "gender": "Unisex",
        "description": "Lót giày công nghệ Gel giảm chấn hấp thụ 90% lực phản hồi từ mặt sân, hỗ trợ nâng đỡ vòm bàn chân chống mỏi khi chạy bộ hoặc đi bộ đường dài."
    },
    {
        "product_id": "ACC-GOI-003",
        "name": "Băng Cuốn Cổ Chân & Gót Chân Thể Thao Tự Dính Mueller Cohesive",
        "price": 160000,
        "image_url": "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600&q=80",
        "sport_type": "Phụ kiện chung",
        "product_type": "Phụ kiện",
        "category": ["Phụ kiện chung", "Phụ kiện", "Băng Gối / Lót Giày", "Băng dán cơ"],
        "sub_category": "Băng Gối / Lót Giày",
        "brand": "Under Armour",
        "rating": 4.7,
        "reviews_count": 68,
        "sizes": ["Tiêu chuẩn (5cm x 4.5m)"],
        "colors": ["Đen", "Be Da", "Xanh Dương"],
        "stock": 150,
        "gender": "Unisex",
        "description": "Băng thun tự dính không bám dính vào lông và da, cố định khớp cổ chân và cổ tay chống lật sơ mi khi chơi cầu lông, bóng đá, bóng chuyền."
    }
]

from app.core.database import init_db

async def seed_missing_products():
    print("Connecting to MongoDB and initializing Beanie...")
    await init_db()

    print("Checking and inserting missing category products...")
    inserted_count = 0
    updated_count = 0

    for item in SAMPLE_PRODUCTS:
        existing = await Product.find_one({"product_id": item["product_id"]})
        if existing:
            # Update fields
            for k, v in item.items():
                setattr(existing, k, v)
            existing.is_hidden = False
            existing.is_deleted = False
            existing.updated_at = datetime.now()
            await existing.save()
            updated_count += 1
            print(f"  [UPDATED] {item['product_id']}: {item['name']}")
        else:
            # Create new
            new_prod = Product(
                **item,
                is_hidden=False,
                is_deleted=False,
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            await new_prod.insert()
            inserted_count += 1
            print(f"  [INSERTED] {item['product_id']}: {item['name']}")

    print(f"\nFinished seeding! Inserted: {inserted_count}, Updated: {updated_count}")

if __name__ == "__main__":
    asyncio.run(seed_missing_products())
