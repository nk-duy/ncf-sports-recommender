export type SizeTabType = 'shoes' | 'apparel' | 'equipment';

export const PRODUCT_TYPES = ['Quần áo', 'Giày dép', 'Thiết bị', 'Phụ kiện'];

export const SPORT_TYPES = [
  'Pickleball',
  'Chạy bộ',
  'Cầu lông',
  'Đá bóng',
  'Bóng chuyền',
  'Gym & Fitness',
  'Dã ngoại',
  'Phụ kiện chung',
];

export const BRANDS = ['Nike', 'Adidas', 'Puma', 'Asics', 'New Balance', 'Salomon', 'Unknown'];

export const GENDERS = ['Nam', 'Nữ', 'Unisex'];

export const SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45'];
export const APPAREL_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL'];
export const EQUIPMENT_SIZES = ['Tiêu chuẩn', 'Freesize', '3U', '4U', 'Size 4', 'Size 5', 'S/M', 'L/XL'];

export const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: '', max: '' },
  { label: 'Dưới 1.000.000đ', min: '', max: '1000000' },
  { label: '1.000.000đ - 2.500.000đ', min: '1000000', max: '2500000' },
  { label: 'Trên 2.500.000đ', min: '2500000', max: '' },
];

export interface FilterColorOption {
  name: string;
  bg: string;
  border: string;
  label: string;
}

export const FILTER_COLORS: FilterColorOption[] = [
  { name: 'Đen', bg: 'bg-gray-900', border: 'border-gray-900', label: 'Đen' },
  { name: 'Trắng', bg: 'bg-white', border: 'border-gray-300', label: 'Trắng' },
  { name: 'Xanh Navy', bg: 'bg-blue-950', border: 'border-blue-950', label: 'Navy' },
  { name: 'Xanh Dương', bg: 'bg-blue-600', border: 'border-blue-600', label: 'Xanh' },
  { name: 'Đỏ', bg: 'bg-red-600', border: 'border-red-600', label: 'Đỏ' },
  { name: 'Xám', bg: 'bg-gray-400', border: 'border-gray-400', label: 'Xám' },
  { name: 'Vàng', bg: 'bg-yellow-400', border: 'border-yellow-400', label: 'Vàng' },
  { name: 'Cam', bg: 'bg-orange-500', border: 'border-orange-500', label: 'Cam' },
  { name: 'Xanh Lá', bg: 'bg-emerald-600', border: 'border-emerald-600', label: 'Lá' },
  { name: 'Hồng', bg: 'bg-pink-400', border: 'border-pink-400', label: 'Hồng' },
];

export function resolveSizeFilterContext(
  currentProductTypes: string[],
  currentCategory: string,
  activeSizeTab: SizeTabType
) {
  const catLower = currentCategory.toLowerCase();
  const isShoesContext = currentProductTypes.includes('Giày dép') || catLower.includes('giày');
  const isApparelContext =
    currentProductTypes.includes('Quần áo') ||
    catLower.includes('áo') ||
    catLower.includes('quần') ||
    catLower.includes('đồ chạy');
  const isEquipmentContext =
    currentProductTypes.includes('Thiết bị') ||
    currentProductTypes.includes('Phụ kiện') ||
    catLower.includes('vợt') ||
    catLower.includes('bóng') ||
    catLower.includes('balo') ||
    catLower.includes('mũ') ||
    catLower.includes('phụ kiện');

  const showQuickSizeTabs = !isShoesContext && !isApparelContext && !isEquipmentContext;

  if (isApparelContext && !isShoesContext) {
    return { displayedSizes: APPAREL_SIZES, sizeLabel: 'Kích thước Quần áo (Size Á/Âu)', showQuickSizeTabs };
  }
  if (isEquipmentContext && !isShoesContext && !isApparelContext) {
    return { displayedSizes: EQUIPMENT_SIZES, sizeLabel: 'Kích thước Phụ kiện & Thiết bị', showQuickSizeTabs };
  }
  if (showQuickSizeTabs) {
    if (activeSizeTab === 'apparel') {
      return { displayedSizes: APPAREL_SIZES, sizeLabel: 'Kích thước Quần áo', showQuickSizeTabs };
    }
    if (activeSizeTab === 'equipment') {
      return { displayedSizes: EQUIPMENT_SIZES, sizeLabel: 'Kích thước Phụ kiện & Thiết bị', showQuickSizeTabs };
    }
    return { displayedSizes: SHOE_SIZES, sizeLabel: 'Kích thước Giày dép', showQuickSizeTabs };
  }

  return { displayedSizes: SHOE_SIZES, sizeLabel: 'Kích thước Giày (Size EU)', showQuickSizeTabs };
}
