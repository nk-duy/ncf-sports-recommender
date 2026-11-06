export type SizeTabId = 'shoes' | 'apparel' | 'rackets';
export type GenderType = 'nam' | 'nu';
export type FitPreference = 'snug' | 'regular' | 'loose';

/** Nhóm sản phẩm do trang chi tiết truyền vào (tương thích với ProductSizeKind của module san-pham). */
export type SizeGuideProductKind =
  | 'shoes'
  | 'apparel'
  | 'pickleball_paddle'
  | 'badminton_racket'
  | 'small_gear'
  | 'equipment';

/** Giày dép -> bảng size giày; Quần áo -> bảng S–2XL; các nhóm còn lại -> bảng Vợt & Phụ kiện. */
export function sizeKindToTab(kind: SizeGuideProductKind): SizeTabId {
  if (kind === 'shoes') return 'shoes';
  if (kind === 'apparel') return 'apparel';
  return 'rackets';
}

export interface ShoeSizeRow {
  eu: string;
  cm: string;
  usMen: string;
  usWomen: string;
  uk: string;
}

export interface ApparelSizeRow {
  size: string;
  h: string;
  w: string;
  chest: string;
  waist: string;
}

export const SIZE_TABS: { id: SizeTabId; label: string; sub: string }[] = [
  { id: 'shoes', label: '👟 Giày thể thao', sub: 'Running • Cầu Lông • Pickleball' },
  { id: 'apparel', label: '👕 Quần áo thể thao', sub: 'Áo đấu • Quần short • Set bộ' },
  { id: 'rackets', label: '🏸 Vợt & Phụ kiện', sub: 'Cầu lông 3U/4U • Vợt Pickleball' },
];

export const FIT_OPTIONS: { id: FitPreference; label: string }[] = [
  { id: 'snug', label: 'Ôm vừa' },
  { id: 'regular', label: 'Tiêu chuẩn' },
  { id: 'loose', label: 'Rộng rãi' },
];

export const SHOE_SIZE_ROWS: ShoeSizeRow[] = [
  { eu: '38', cm: '23.5 - 24.0', usMen: '5.5', usWomen: '7.0', uk: '5.0' },
  { eu: '39', cm: '24.1 - 24.5', usMen: '6.5', usWomen: '8.0', uk: '6.0' },
  { eu: '40', cm: '24.6 - 25.0', usMen: '7.0', usWomen: '8.5', uk: '6.5' },
  { eu: '41', cm: '25.1 - 25.5', usMen: '8.0', usWomen: '9.5', uk: '7.5' },
  { eu: '42', cm: '25.6 - 26.0', usMen: '8.5', usWomen: '10.0', uk: '8.0' },
  { eu: '43', cm: '26.1 - 26.5', usMen: '9.5', usWomen: '11.0', uk: '9.0' },
  { eu: '44', cm: '26.6 - 27.0', usMen: '10.0', usWomen: '11.5', uk: '9.5' },
];

export const APPAREL_SIZE_ROWS: ApparelSizeRow[] = [
  { size: 'S', h: '155 - 165', w: '48 - 56', chest: '84 - 88', waist: '68 - 74' },
  { size: 'M', h: '163 - 172', w: '57 - 65', chest: '89 - 94', waist: '75 - 80' },
  { size: 'L', h: '170 - 178', w: '66 - 74', chest: '95 - 100', waist: '81 - 86' },
  { size: 'XL', h: '175 - 183', w: '75 - 84', chest: '101 - 106', waist: '87 - 92' },
  { size: '2XL', h: '180 - 190', w: '85 - 95', chest: '107 - 114', waist: '93 - 100' },
];

export function detectDefaultSizeTab(productName: string, categories: string[]): SizeTabId {
  const text = `${productName} ${categories.join(' ')}`.toLowerCase();
  if (text.includes('vợt') || text.includes('racket') || text.includes('paddle') || text.includes('pickleball')) {
    return 'rackets';
  }
  if (
    text.includes('clothing') ||
    text.includes('quần áo') ||
    text.includes('áo') ||
    text.includes('quần') ||
    text.includes('váy') ||
    text.includes('jacket') ||
    text.includes('short')
  ) {
    return 'apparel';
  }
  return 'shoes';
}

export function calcRecommendedShoeSize(footLength: number, fitPreference: FitPreference): string {
  // Thể thao (Running/Badminton/Pickleball) cần dư mũi chân khoảng 0.5 - 0.8cm
  const adjustedLength =
    fitPreference === 'snug' ? footLength : fitPreference === 'loose' ? footLength + 0.8 : footLength + 0.5;
  // Cửa hàng chỉ bán giày size 38–44 nên kết quả gợi ý được giới hạn trong dải này.
  if (adjustedLength < 24.0) return '38';
  if (adjustedLength < 24.8) return '39';
  if (adjustedLength < 25.4) return '40';
  if (adjustedLength < 26.0) return '41';
  if (adjustedLength < 26.8) return '42';
  if (adjustedLength < 27.5) return '43';
  return '44';
}

export function calcRecommendedApparelSize(
  height: number,
  weight: number,
  gender: GenderType,
  fitPreference: FitPreference
): string {
  let score = (height - 150) * 0.4 + (weight - 45) * 0.6;
  if (gender === 'nu') score -= 10;
  if (fitPreference === 'loose') score += 8;
  if (fitPreference === 'snug') score -= 6;

  if (score < 18) return 'S';
  if (score < 30) return 'M';
  if (score < 42) return 'L';
  if (score < 54) return 'XL';
  return '2XL';
}
