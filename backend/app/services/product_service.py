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
        
        new_product = Product(**product_data.dict())
        await new_product.insert()
        return new_product

    @staticmethod
    async def update_product(product_id: str, product_data: ProductUpdate) -> Optional[Product]:
        product = await Product.find_one(Product.product_id == product_id)
        if not product:
            return None
        
        update_data = product_data.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(product, key, value)
            
        await product.save()
        return product

    @staticmethod
    async def delete_product(product_id: str) -> bool:
        product = await Product.find_one(Product.product_id == product_id)
        if not product:
            return False
        
        await product.delete()
        return True

    @staticmethod
    async def get_distinct_brands() -> List[str]:
        """Lấy danh sách các thương hiệu có sẵn trong cơ sở dữ liệu"""
        col = Product.get_pymongo_collection()
        brands = await col.distinct("brand")
        valid_brands = [b.strip() for b in brands if b and isinstance(b, str) and b.strip()]
        return sorted(list(set(valid_brands)))

product_service = ProductService()
