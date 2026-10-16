from typing import List, Optional, Dict, Any
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from app.schemas.product import ProductCreate, ProductUpdate
from datetime import datetime, timezone

class ProductService:
    @staticmethod
    def _enforce_discount(product: Product) -> Product:
        if product.discount_percent and product.discount_percent > 0:
            if product.discount_end_date:
                end_dt = product.discount_end_date
                if end_dt.tzinfo is None:
                    end_dt = end_dt.replace(tzinfo=timezone.utc)
                if end_dt < datetime.now(timezone.utc):
                    product.discount_percent = 0
        return product

    @staticmethod
    def _build_query(
        category: Optional[str] = None,
        product_type: Optional[str] = None,
        sport_type: Optional[str] = None,
        search: Optional[str] = None,
        brand: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        sizes: Optional[str] = None,
        colors: Optional[str] = None,
        gender: Optional[str] = None,
        is_promotion: Optional[bool] = None,
        include_hidden: bool = False,
        include_deleted: bool = False
    ) -> Dict[str, Any]:
        query: Dict[str, Any] = {}
        
        if not include_hidden:
            query["is_hidden"] = {"$ne": True}
            
        if not include_deleted:
            query["is_deleted"] = {"$ne": True}
        
        if category:
            cat_list = [c.strip() for c in category.split(',')]
            query["category"] = {"$in": cat_list}
            
        if product_type:
            query["product_type"] = product_type
            
        if sport_type:
            if sport_type.lower() in ["đa dụng", "gym", "gym & fitness", "gym & đa dụng", "fitness"]:
                query["sport_type"] = {"$in": ["Đa dụng", "Gym & Fitness", "Gym & Đa Dụng", "Gym"]}
            else:
                query["sport_type"] = sport_type
            
        if search:
            query["name"] = {"$regex": search, "$options": "i"}
            
        if brand:
            query["brand"] = brand
            
        if min_price is not None or max_price is not None:
            query["price"] = {}
            if min_price is not None:
                query["price"]["$gte"] = min_price
            if max_price is not None:
                query["price"]["$lte"] = max_price
                
        if sizes:
            size_list = [s.strip() for s in sizes.split(',')]
            query["sizes"] = {"$in": size_list}
            
        if colors:
            color_map = {
                "white": "Trắng", "black": "Đen", "blue": "Xanh Dương",
                "red": "Đỏ", "grey": "Xám", "gray": "Xám", "navy": "Xanh Navy",
                "yellow": "Vàng", "green": "Xanh Lá", "orange": "Cam", "pink": "Hồng"
            }
            raw_colors = [c.strip() for c in colors.split(',')]
            expanded = []
            for c in raw_colors:
                expanded.append(c)
                c_low = c.lower()
                if c_low in color_map:
                    expanded.append(color_map[c_low])
                for en, vn in color_map.items():
                    if vn.lower() == c_low:
                        expanded.append(en)
            query["colors"] = {"$in": list(set(expanded))}
            
        if gender:
            query["gender"] = gender
            
        if is_promotion:
            query["discount_percent"] = {"$gt": 0}
            if not include_hidden:
                now = datetime.now(timezone.utc)
                query["$or"] = [
                    {"discount_end_date": None},
                    {"discount_end_date": {"$gt": now}}
                ]
        return query

    @staticmethod
    async def get_products_with_count(
        skip: int = 0,
        limit: int = 20,
        category: Optional[str] = None,
        product_type: Optional[str] = None,
        sport_type: Optional[str] = None,
        search: Optional[str] = None,
        brand: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        sizes: Optional[str] = None,
        colors: Optional[str] = None,
        gender: Optional[str] = None,
        is_promotion: Optional[bool] = None,
        sort_by: Optional[str] = None,
        include_hidden: bool = False,
        include_deleted: bool = False
    ) -> tuple[List[Product], int]:
        query = ProductService._build_query(
            category=category, product_type=product_type, sport_type=sport_type, search=search,
            brand=brand, min_price=min_price, max_price=max_price,
            sizes=sizes, colors=colors, gender=gender, is_promotion=is_promotion,
            include_hidden=include_hidden, include_deleted=include_deleted
        )
        find_query = Product.find(query)
        total = await find_query.count()

        if sort_by == "discount_desc":
            find_query = find_query.sort("-discount_percent")
        elif sort_by == "price_asc":
            find_query = find_query.sort("+price")
        elif sort_by == "price_desc":
            find_query = find_query.sort("-price")
        elif sort_by == "rating_desc":
            find_query = find_query.sort("-rating")
        elif sort_by == "sold_desc":
            find_query = find_query.sort("-sold")
        elif sort_by == "oldest":
            find_query = find_query.sort("+_id")
        else:
            # Mặc định sản phẩm mới nhất lên đầu
            find_query = find_query.sort("-_id")

        products = await find_query.skip(skip).limit(limit).to_list()
        if not include_hidden:
            for p in products:
                ProductService._enforce_discount(p)
        return products, total

    @staticmethod
    async def get_products(
        skip: int = 0,
        limit: int = 20,
        category: Optional[str] = None,
        product_type: Optional[str] = None,
        sport_type: Optional[str] = None,
        search: Optional[str] = None,
        brand: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        sizes: Optional[str] = None,
        colors: Optional[str] = None,
        gender: Optional[str] = None,
        is_promotion: Optional[bool] = None,
        sort_by: Optional[str] = None,
        include_hidden: bool = False,
        include_deleted: bool = False
    ) -> List[Product]:
        products, _ = await ProductService.get_products_with_count(
            skip=skip, limit=limit, category=category, product_type=product_type, sport_type=sport_type,
            search=search, brand=brand, min_price=min_price, max_price=max_price,
            sizes=sizes, colors=colors, gender=gender, is_promotion=is_promotion,
            sort_by=sort_by,
            include_hidden=include_hidden, include_deleted=include_deleted
        )
        return products

    @staticmethod
    async def get_featured_products(limit: int = 5) -> List[Product]:
        products = await Product.find({"rating": {"$gte": 4.0}, "image_url": {"$ne": ""}, "is_hidden": {"$ne": True}}).limit(limit).to_list()
        import random
        if products:
            random.shuffle(products)
        
        # Enforce discount
        for p in products:
            ProductService._enforce_discount(p)
            
        return products[:limit]

    @staticmethod
    async def get_product_by_id(product_id: str) -> Optional[Product]:
        product = await Product.find_one(Product.product_id == product_id)
        if product:
            ProductService._enforce_discount(product)
        return product

    @staticmethod
    async def create_product(product_data: ProductCreate) -> Optional[Product]:
        import uuid
        if not product_data.product_id:
            product_data.product_id = f"PROD-{str(uuid.uuid4())[:8].upper()}"
            
        existing_product = await Product.find_one(Product.product_id == product_data.product_id)
        if existing_product:
            return None
        
        now = datetime.now(timezone.utc)
        if not product_data.created_at:
            product_data.created_at = now
        if not product_data.updated_at:
            product_data.updated_at = now

        if product_data.variants and len(product_data.variants) > 0:
            product_data.stock = sum(v.stock for v in product_data.variants)

        new_product = Product(**product_data.dict())
        await new_product.insert()
        return new_product

    @staticmethod
    async def update_product(product_id: str, product_data: ProductUpdate) -> Optional[Product]:
        product = await Product.find_one(Product.product_id == product_id)
        if not product:
            return None
        
        update_data = product_data.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.now(timezone.utc)
        if "variants" in update_data and update_data["variants"] is not None:
            if len(update_data["variants"]) > 0:
                update_data["stock"] = sum(v.get("stock", 0) if isinstance(v, dict) else v.stock for v in update_data["variants"])
        for key, value in update_data.items():
            setattr(product, key, value)
            
        await product.save()
        return product

    @staticmethod
    async def check_product_dependencies(product_id: str) -> Dict[str, Any]:
        """Kiểm tra xem sản phẩm có ràng buộc với đơn hàng, đánh giá hay dữ liệu tương tác AI không"""
        from app.models.order import Order
        from app.models.review import Review
        from app.models.interaction import Interaction

        order_count = await Order.find({"items.product_id": product_id}).count()
        review_count = await Review.find(Review.product_id == product_id).count()
        interaction_count = await Interaction.find(Interaction.product_id == product_id).count()

        can_delete = (order_count == 0 and review_count == 0 and interaction_count == 0)
        reasons = []
        if order_count > 0:
            reasons.append(f"{order_count} đơn hàng đã mua")
        if review_count > 0:
            reasons.append(f"{review_count} đánh giá thực tế")
        if interaction_count > 0:
            reasons.append(f"{interaction_count} lượt tương tác trong mô hình gợi ý AI")

        ai_warning = None
        if interaction_count > 0:
            ai_warning = f"Sản phẩm này đang có {interaction_count} lượt tương tác trong mô hình gợi ý AI. Bạn nên sử dụng tính năng Ẩn hoặc Thùng rác thay vì Xóa vĩnh viễn để bảo toàn độ chính xác của AI."

        return {
            "can_delete": can_delete,
            "order_count": order_count,
            "review_count": review_count,
            "interaction_count": interaction_count,
            "ai_warning": ai_warning,
            "reason": f"Sản phẩm này đã có lịch sử kinh doanh ({', '.join(reasons)}). Không thể xóa vĩnh viễn để tránh làm sai lệch báo cáo doanh thu và làm lỗi ma trận trọng số của mô hình gợi ý AI." if not can_delete else None
        }

    @staticmethod
    async def delete_product(product_id: str, force: bool = False) -> tuple[bool, Optional[str]]:
        product = await Product.find_one(Product.product_id == product_id)
        if not product:
            return False, "Không tìm thấy sản phẩm"

        # Kiểm tra ràng buộc dữ liệu
        dep_check = await ProductService.check_product_dependencies(product_id)
        if not dep_check["can_delete"] and not force:
            return False, dep_check["reason"]
        
        await product.delete()
        return True, None

    @staticmethod
    async def get_distinct_brands() -> List[str]:
        """Lấy danh sách các thương hiệu có sẵn trong cơ sở dữ liệu"""
        col = Product.get_pymongo_collection()
        brands = await col.distinct("brand")
        valid_brands = [b.strip() for b in brands if b and isinstance(b, str) and b.strip()]
        return sorted(list(set(valid_brands)))

product_service = ProductService()
