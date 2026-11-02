import type { ProductVariantItem } from '../types';

export const COLOR_HEX_MAP: Record<string, string> = {
  Đen: '#111827',
  Trắng: '#FFFFFF',
  Đỏ: '#EF4444',
  'Xanh Dương': '#2563EB',
  'Xanh Navy': '#1E3A8A',
  'Xanh Lá': '#10B981',
  Xám: '#6B7280',
  Vàng: '#F59E0B',
  Cam: '#F97316',
  Hồng: '#EC4899',
  Tím: '#8B5CF6',
};

// Tự động đồng bộ ma trận tổ hợp (Colors x Sizes) khi colors hoặc sizes thay đổi
export function syncVariantsMatrix(
  colors: string[],
  sizes: string[],
  existingVariants: ProductVariantItem[],
  productId = 'PROD',
  targetTotalStock?: number
): ProductVariantItem[] {
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;

  if (!hasColors && !hasSizes) {
    return [];
  }

  const skuBase = productId ? productId.slice(-6) : 'SKU';
  const newVariants: ProductVariantItem[] = [];

  if (hasColors && hasSizes) {
    colors.forEach((color) => {
      sizes.forEach((size) => {
        const existing = existingVariants.find((v) => v.color === color && v.size === size);
        newVariants.push({
          color,
          size,
          stock: existing !== undefined ? existing.stock : 0,
          sku: existing?.sku || `${skuBase}-${color.slice(0, 2).toUpperCase()}-${size}`,
          price: existing?.price,
        });
      });
    });
  } else if (hasColors) {
    colors.forEach((color) => {
      const existing = existingVariants.find((v) => v.color === color && !v.size);
      newVariants.push({
        color,
        size: '',
        stock: existing !== undefined ? existing.stock : 0,
        sku: existing?.sku || `${skuBase}-${color.slice(0, 2).toUpperCase()}`,
        price: existing?.price,
      });
    });
  } else if (hasSizes) {
    sizes.forEach((size) => {
      const existing = existingVariants.find((v) => !v.color && v.size === size);
      newVariants.push({
        color: '',
        size,
        stock: existing !== undefined ? existing.stock : 0,
        sku: existing?.sku || `${skuBase}-${size}`,
        price: existing?.price,
      });
    });
  }

  // Nếu trước đó chưa có variant nào, tự động phân bổ đều targetTotalStock nếu có
  const isFirstInit = existingVariants.length === 0 && newVariants.length > 0;
  if (isFirstInit && targetTotalStock && targetTotalStock > 0) {
    const count = newVariants.length;
    const base = Math.floor(targetTotalStock / count);
    let remainder = targetTotalStock % count;
    newVariants.forEach((nv) => {
      nv.stock = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
    });
  }

  return newVariants;
}
