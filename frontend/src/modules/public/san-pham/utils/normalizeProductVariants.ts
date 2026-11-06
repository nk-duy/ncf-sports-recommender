import type { ProductDetail, ProductVariant } from '../types';

/**
 * Nhóm kích cỡ của sản phẩm. Logic phân loại phản chiếu backend/scripts/normalize_product_variants.py
 * (ưu tiên TÊN sản phẩm vì `product_type` trong dữ liệu có thể gán sai, sau đó mới dùng
 * sub_category / category / product_type làm dự phòng).
 */
export type ProductSizeKind =
  | 'shoes'
  | 'apparel'
  | 'pickleball_paddle'
  | 'badminton_racket'
  | 'small_gear'
  | 'equipment';

export const SHOE_SIZE_SET = ['38', '39', '40', '41', '42', '43', '44'];
export const APPAREL_SIZE_SET = ['S', 'M', 'L', 'XL', '2XL'];
export const PICKLEBALL_SIZE_SET = ['14mm (Công thủ)', '16mm (Kiểm soát)'];
export const BADMINTON_SIZE_SET = ['3U (85-89g)', '4U (80-84g)'];
export const SMALL_GEAR_SIZE_SET = ['M', 'L', 'XL'];
export const EQUIPMENT_SIZE_SET = ['Tiêu chuẩn', 'Bản Pro'];

export const SIZE_SET_BY_KIND: Record<ProductSizeKind, string[]> = {
  shoes: SHOE_SIZE_SET,
  apparel: APPAREL_SIZE_SET,
  pickleball_paddle: PICKLEBALL_SIZE_SET,
  badminton_racket: BADMINTON_SIZE_SET,
  small_gear: SMALL_GEAR_SIZE_SET,
  equipment: EQUIPMENT_SIZE_SET,
};

/** Size chữ (quần áo) được ánh xạ tuần tự sang size giày khi dữ liệu giày bị lẫn size quần áo. */
const APPAREL_LETTER_TO_SHOE: Record<string, string> = {
  XS: '38',
  S: '38',
  M: '39',
  L: '40',
  XL: '41',
  '2XL': '42',
  XXL: '42',
  '3XL': '43',
};

// Không dùng lookbehind để tương thích Safari cũ: (^|[^chữ-số-_]) + từ khóa + (?![chữ-số-_])
const kw = (words: string) =>
  new RegExp(`(?:^|[^\\p{L}\\p{N}_])(?:${words})(?![\\p{L}\\p{N}_])`, 'iu');

const SHOE_RE = kw('giày|ủng|dép|sandal|shoes?|sneakers?|boots?');
const SHOE_START_RE = /^\s*(giày|ủng|dép|sandal|shoes?|sneakers?|boots?)(?![\p{L}\p{N}_])/iu;
const APPAREL_RE = kw('áo|quần|váy|bộ đồ|trang phục|shirts?|shorts?|jackets?|jerseys?|leggings?');
const SMALL_GEAR_RE = kw('vớ|tất|găng|băng|ống đồng|bảo vệ|gloves?|socks?');
const ACCESSORY_RE = kw(
  'túi|balo|ba lô|bình|bọc|quấn|chì dán|lót|đai|vòng tay|dây|mũ|nón|khăn|kính|đồng hồ|còi|kẹp|hộp'
);
const EQUIPMENT_NAME_RE = kw('quả bóng|bóng|lều|thảm|xe đạp|tạ|dây kháng lực|lưới|cột|gậy|ván');

type KindSource = Pick<
  ProductDetail,
  'name' | 'product_type' | 'sport_type' | 'sub_category' | 'category'
>;

function racketKind(nameL: string, subL: string, sport: string): ProductSizeKind | null {
  if (nameL.includes('pickleball') || subL.includes('pickleball') || sport === 'Pickleball') {
    return 'pickleball_paddle';
  }
  if (nameL.includes('cầu lông') || subL.includes('cầu lông') || sport === 'Cầu lông') {
    return 'badminton_racket';
  }
  return null;
}

export function detectProductSizeKind(product: KindSource): ProductSizeKind {
  const name = (product.name || '').trim();
  const ptype = (product.product_type || '').trim();
  const sport = (product.sport_type || '').trim();
  const sub = (product.sub_category || '').trim();
  const nameL = name.toLowerCase();
  const subL = sub.toLowerCase();
  const meta = [sub, ...(product.category || [])].join(' ');

  // A. Theo tên sản phẩm
  if (nameL.startsWith('vợt')) {
    const k = racketKind(nameL, subL, sport);
    if (k) return k;
  }
  if (SHOE_START_RE.test(name)) return 'shoes';
  if (APPAREL_RE.test(name)) return 'apparel';
  if (SMALL_GEAR_RE.test(name)) return 'small_gear';
  if (ACCESSORY_RE.test(name) || EQUIPMENT_NAME_RE.test(name)) return 'equipment';
  if (SHOE_RE.test(name)) return 'shoes';

  // B. Tên chung chung -> dùng sub_category / category
  if (subL.startsWith('vợt')) {
    const k = racketKind(nameL, subL, sport);
    if (k) return k;
  }
  if (SMALL_GEAR_RE.test(meta)) return 'small_gear';
  if (ACCESSORY_RE.test(sub) || EQUIPMENT_NAME_RE.test(sub)) return 'equipment';
  if (SHOE_RE.test(meta)) return 'shoes';
  if (APPAREL_RE.test(meta)) return 'apparel';

  // C. Dự phòng theo product_type
  if (ptype === 'Giày dép') return 'shoes';
  if (ptype === 'Quần áo') return 'apparel';
  return 'equipment';
}

export function getSizeSetForProduct(product: KindSource): string[] {
  return SIZE_SET_BY_KIND[detectProductSizeKind(product)];
}

/**
 * Hàm kiểm tra bảo vệ: đảm bảo `sizes` / `variants` của sản phẩm khớp đúng nhóm kích cỡ.
 * Ví dụ sản phẩm Giày dép chứa `S, M, L, XL, 2XL, 3XL` sẽ được ánh xạ sang `38 … 44`;
 * bình nước / bóng không bao giờ hiển thị size quần áo.
 * Dữ liệu đã hợp lệ thì trả về nguyên đối tượng (không tạo bản sao mới).
 */
export function normalizeProductVariants(product: ProductDetail): ProductDetail {
  const kind = detectProductSizeKind(product);
  const target = SIZE_SET_BY_KIND[kind];
  const targetSet = new Set(target);

  const sizes = product.sizes ?? [];
  const variants = product.variants ?? [];
  const sizesValid = sizes.length > 0 && sizes.every((s) => targetSet.has(s));
  const variantsValid = variants.every((v) => !v.size || targetSet.has(v.size));
  if (sizesValid && variantsValid) return product;

  if (variants.length === 0) {
    // Chưa có biến thể: chỉ chuẩn hóa danh sách size hiển thị (tồn kho dùng stock chung).
    return { ...product, sizes: [...target] };
  }

  const mapSize = (old?: string): string | undefined => {
    if (!old) return undefined;
    if (targetSet.has(old)) return old;
    if (kind === 'shoes') return APPAREL_LETTER_TO_SHOE[old.toUpperCase()];
    if (kind === 'apparel' && old.toUpperCase() === 'XXL') return '2XL';
    return undefined;
  };

  const colors = Array.from(
    new Set([...(product.colors ?? []), ...variants.map((v) => v.color || '')].filter((c) => c !== undefined))
  );
  const colorList = colors.length > 0 ? colors : [''];
  const next: ProductVariant[] = [];

  colorList.forEach((color, ci) => {
    const old = variants.filter((v) => (v.color || '') === color);
    const colorTotal = old.reduce((sum, v) => sum + (v.stock ?? 0), 0);
    const fallbackStock = Math.max(1, Math.floor((colorTotal || (product.stock ?? 25)) / target.length));
    target.forEach((size) => {
      const matched = old.filter((v) => mapSize(v.size) === size);
      const stock = matched.length > 0 ? matched.reduce((s, v) => s + (v.stock ?? 0), 0) : fallbackStock;
      next.push({
        color,
        size,
        stock: Math.max(1, stock),
        sku: `${product.product_id}-C${ci + 1}-${size.replace(/\s*\(.*?\)/g, '').replace(/[^0-9A-Za-z]+/g, '').toUpperCase()}`,
      });
    });
  });

  return { ...product, sizes: [...target], variants: next };
}

