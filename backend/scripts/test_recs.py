import asyncio
import sys
import os
import random

if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import init_db
from app.models.product import Product
from app.services.recommendation_service import recommendation_service

async def test_recs():
    await init_db()
    
    # Lấy 3 sản phẩm mẫu thuộc 3 môn thể thao khác nhau:
    # 1. Đá bóng
    p_soccer = await Product.find_one({"sport_type": "Đá bóng", "product_type": "Giày dép"})
    # 2. Cầu lông
    p_badminton = await Product.find_one({"sport_type": "Cầu lông"})
    # 3. Dã ngoại
    p_outdoor = await Product.find_one({"sport_type": "Dã ngoại"})
    
    test_cases = [
        ("Đá bóng", p_soccer),
        ("Cầu lông", p_badminton),
        ("Dã ngoại", p_outdoor)
    ]
    
    for label, prod in test_cases:
        if not prod:
            print(f"Không tìm thấy sản phẩm mẫu cho {label}")
            continue
        print("\n" + "="*60)
        print(f"ĐANG XEM SẢN PHẨM: [{label}]")
        print(f"ID: {prod.product_id} | Tên: {prod.name}")
        print(f"Sport: {prod.sport_type} | Type: {prod.product_type} | Sub: {prod.sub_category}")
        print("="*60)
        
        # Test 1: Khách vãng lai (Guest - Chưa đăng nhập)
        recs_guest = await recommendation_service.get_recommendations_for_user(
            user_id="",
            top_k=8,
            current_product_id=prod.product_id,
            sport_type=prod.sport_type
        )
        print(f"-> Gợi ý cho Khách Vãng Lai (Tổng: {len(recs_guest)} sản phẩm):")
        for i, r in enumerate(recs_guest):
            print(f"   [{i+1}] {r.product_id} | {r.name[:45]} | {r.sport_type} > {r.product_type} | {r.price:,.0f}đ ({r.rating}★)")
            if r.product_id == prod.product_id:
                print("   [CẢNH BÁO] Trùng với sản phẩm đang xem!")

if __name__ == "__main__":
    asyncio.run(test_recs())
