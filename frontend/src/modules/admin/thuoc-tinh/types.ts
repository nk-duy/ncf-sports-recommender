export interface ColorItem {
  name: string;
  hex: string;
}

export interface AttributesApiData {
  brands?: string[];
  colors?: Array<ColorItem | string>;
  shoe_sizes?: string[];
  clothing_sizes?: string[];
  sport_specs?: string[];
}

export const DEFAULT_BRANDS = [
  'Nike', 'Adidas', 'Puma', 'Yonex', 'Lining', 'Mizuno', 'Kamito', 'Victor', 'Asics', 'Under Armour', 'Decathlon',
];

export const DEFAULT_SPORT_SPECS = [
  'Vợt 3U-G5 (85-89g)', 'Vợt 4U-G5 (80-84g)', 'Vợt 5U-G5 (75-79g)',
  'Mặt vợt 13mm (Power)', 'Mặt vợt 16mm (Control)',
  'Đinh dăm TF (Cỏ nhân tạo)', 'Đinh AG/FG (Cỏ tự nhiên)', 'Đế bằng IC (Futsal/Trong nhà)',
  'Căng dây 10.5 - 12 kg', 'Bóng Size 4', 'Bóng Size 5',
];

export const DEFAULT_SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

export const DEFAULT_CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export const DEFAULT_COLORS: ColorItem[] = [
  { name: 'Đen', hex: '#111827' },
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Đỏ', hex: '#EF4444' },
  { name: 'Xanh Dương', hex: '#2563EB' },
  { name: 'Xanh Navy', hex: '#1E3A8A' },
  { name: 'Xanh Lá', hex: '#10B981' },
  { name: 'Xám', hex: '#6B7280' },
  { name: 'Vàng', hex: '#F59E0B' },
  { name: 'Cam', hex: '#F97316' },
  { name: 'Hồng', hex: '#EC4899' },
  { name: 'Tím', hex: '#8B5CF6' },
];

export const CLOTHING_SIZE_ORDER = [
  'XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL', 'Freesize',
];
