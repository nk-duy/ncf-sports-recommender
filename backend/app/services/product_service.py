from typing import List, Optional, Dict, Any
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

class ProductService:
    @staticmethod
    async def get_products(
        skip: int = 0,
        limit: int = 20,
        category: Optional[str] = None,
        search: Optional[str] = None,
        brand: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        sizes: Optional[str] = None,
        colors: Optional[str] = None,
        gender: Optional[str] = None
    ) -> List[Product]:
        query: Dict[str, Any] = {}
        
        if category:
            query["category"] = category
            
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
            color_list = [c.strip() for c in colors.split(',')]
            query["colors"] = {"$in": color_list}
            
        if gender:
            query["gender"] = gender

        products = await Product.find(query).skip(skip).limit(limit).to_list()
        return products

    @staticmethod
    async def get_featured_products(limit: int = 5) -> List[Product]:
        products = await Product.find({"rating": {"$gte": 4.0}, "image_url": {"$ne": ""}}).limit(limit).to_list()
        import random
        if products:
            random.shuffle(products)
        return products[:limit]

    @staticmethod
    async def get_product_by_id(product_id: str) -> Optional[Product]:
        return await Product.find_one(Product.product_id == product_id)

    @staticmethod
    async def create_product(product_data: ProductCreate) -> Optional[Product]:
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

product_service = ProductService()
