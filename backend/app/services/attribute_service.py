from typing import List, Dict, Any
from datetime import datetime
from app.models.attribute import ProductAttributes, AttributeColor

DEFAULT_BRANDS = [
    'Nike', 'Adidas', 'Puma', 'Yonex', 'Lining', 'Mizuno', 'Kamito', 'Victor', 'Asics', 'Under Armour', 'Decathlon'
]

DEFAULT_SPORT_SPECS = [
    'Vợt 3U-G5 (85-89g)', 'Vợt 4U-G5 (80-84g)', 'Vợt 5U-G5 (75-79g)', 
    'Mặt vợt 13mm (Power)', 'Mặt vợt 16mm (Control)', 
    'Đinh dăm TF (Cỏ nhân tạo)', 'Đinh AG/FG (Cỏ tự nhiên)', 'Đế bằng IC (Futsal/Trong nhà)',
    'Căng dây 10.5 - 12 kg', 'Bóng Size 4', 'Bóng Size 5'
]

DEFAULT_SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']

DEFAULT_CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

DEFAULT_COLORS = [
    {"name": "Đen", "hex": "#111827"},
    {"name": "Trắng", "hex": "#FFFFFF"},
    {"name": "Đỏ", "hex": "#EF4444"},
    {"name": "Xanh Dương", "hex": "#2563EB"},
    {"name": "Xanh Navy", "hex": "#1E3A8A"},
    {"name": "Xanh Lá", "hex": "#10B981"},
    {"name": "Xám", "hex": "#6B7280"},
    {"name": "Vàng", "hex": "#F59E0B"},
    {"name": "Cam", "hex": "#F97316"},
    {"name": "Hồng", "hex": "#EC4899"},
    {"name": "Tím", "hex": "#8B5CF6"},
]

class AttributeService:
    @staticmethod
    async def get_or_create_attributes() -> ProductAttributes:
        doc = await ProductAttributes.find_one()
        if not doc:
            doc = ProductAttributes(
                brands=DEFAULT_BRANDS,
                colors=[AttributeColor(**c) for c in DEFAULT_COLORS],
                shoe_sizes=DEFAULT_SHOE_SIZES,
                clothing_sizes=DEFAULT_CLOTHING_SIZES,
                sport_specs=DEFAULT_SPORT_SPECS
            )
            await doc.insert()
        return doc

    @staticmethod
    async def update_attributes(
        brands: List[str],
        colors: List[AttributeColor],
        shoe_sizes: List[str],
        clothing_sizes: List[str],
        sport_specs: List[str]
    ) -> ProductAttributes:
        doc = await ProductAttributes.find_one()
        if not doc:
            doc = ProductAttributes()
        
        doc.brands = brands
        doc.colors = colors
        doc.shoe_sizes = shoe_sizes
        doc.clothing_sizes = clothing_sizes
        doc.sport_specs = sport_specs
        doc.updated_at = datetime.utcnow()
        await doc.save()
        return doc

    @staticmethod
    async def reset_to_defaults() -> ProductAttributes:
        doc = await ProductAttributes.find_one()
        if not doc:
            doc = ProductAttributes()
        
        doc.brands = DEFAULT_BRANDS
        doc.colors = [AttributeColor(**c) for c in DEFAULT_COLORS]
        doc.shoe_sizes = DEFAULT_SHOE_SIZES
        doc.clothing_sizes = DEFAULT_CLOTHING_SIZES
        doc.sport_specs = DEFAULT_SPORT_SPECS
        doc.updated_at = datetime.utcnow()
        await doc.save()
        return doc

attribute_service = AttributeService()
