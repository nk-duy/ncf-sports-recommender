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
  targetTotalStock?: number,
  forceRedistribute = false
): ProductVariantItem[] {
  const hasColors = colors.length > 0;
  const hasSizes = sizes.length > 0;

  if (!hasColors && !hasSizes) {
    return [];
  }

  const skuBase = productId ? productId.slice(-6) : 'SKU';
  const newVariants: ProductVariantItem[] = [];

  const wasEmpty = existingVariants.length === 0;
  const wasColorOnly =
    existingVariants.length > 0 && existingVariants.every((v) => Boolean(v.color) && !v.size);
  const wasSizeOnly =
    existingVariants.length > 0 && existingVariants.every((v) => !v.color && Boolean(v.size));

  if (hasColors && hasSizes) {
    colors.forEach((color) => {
      const colorOnlyItem = wasColorOnly
        ? existingVariants.find((v) => v.color === color && !v.size)
        : undefined;
      const colorStockToSplit = colorOnlyItem?.stock || 0;
      const basePerSize = sizes.length > 0 ? Math.floor(colorStockToSplit / sizes.length) : 0;
      let remPerSize = sizes.length > 0 ? colorStockToSplit % sizes.length : 0;

      sizes.forEach((size) => {
        const existing = existingVariants.find((v) => v.color === color && v.size === size);
        let stock = 0;
        if (existing !== undefined) {
          stock = existing.stock;
        } else if (wasColorOnly && colorOnlyItem !== undefined) {
          stock = basePerSize + (remPerSize > 0 ? 1 : 0);
          if (remPerSize > 0) remPerSize--;
        }
        newVariants.push({
          color,
          size,
          stock,
          sku: existing?.sku || `${skuBase}-${color.slice(0, 2).toUpperCase()}-${size}`,
          price: existing?.price,
        });
      });
    });

    // Nếu trước đó chỉ có size (wasSizeOnly), phân bổ tồn kho của từng size sang các màu
    if (wasSizeOnly) {
      sizes.forEach((size) => {
        const sizeOnlyItem = existingVariants.find((v) => !v.color && v.size === size);
        if (sizeOnlyItem && sizeOnlyItem.stock > 0) {
          const matching = newVariants.filter((nv) => nv.size === size);
          const basePerColor = Math.floor(sizeOnlyItem.stock / matching.length);
          let remPerColor = sizeOnlyItem.stock % matching.length;
          matching.forEach((nv) => {
            nv.stock = basePerColor + (remPerColor > 0 ? 1 : 0);
            if (remPerColor > 0) remPerColor--;
          });
        }
      });
    }
  } else if (hasColors) {
    colors.forEach((color) => {
      const existing = existingVariants.find((v) => v.color === color && !v.size);
      // Nếu vừa bỏ chọn hết sizes (từ Color+Size về Color-only), cộng dồn tồn kho của màu đó
      const summedFromSizes = existingVariants
        .filter((v) => v.color === color && Boolean(v.size))
        .reduce((sum, v) => sum + (v.stock || 0), 0);
      newVariants.push({
        color,
        size: '',
        stock: existing !== undefined ? existing.stock : summedFromSizes,
        sku: existing?.sku || `${skuBase}-${color.slice(0, 2).toUpperCase()}`,
        price: existing?.price,
      });
    });
  } else if (hasSizes) {
    sizes.forEach((size) => {
      const existing = existingVariants.find((v) => !v.color && v.size === size);
      // Nếu vừa bỏ chọn hết colors (từ Color+Size về Size-only), cộng dồn tồn kho của size đó
      const summedFromColors = existingVariants
        .filter((v) => Boolean(v.color) && v.size === size)
        .reduce((sum, v) => sum + (v.stock || 0), 0);
      newVariants.push({
        color: '',
        size,
        stock: existing !== undefined ? existing.stock : summedFromColors,
        sku: existing?.sku || `${skuBase}-${size}`,
        price: existing?.price,
      });
    });
  }

  // Nếu trước đó chưa có variant nào, hoặc người dùng chưa chỉnh tay từng dòng, hoặc tổng mới = 0 khi có targetTotalStock, tự động phân bổ đều targetTotalStock
  const currentNewSum = newVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const shouldRedistribute =
    newVariants.length > 0 &&
    targetTotalStock !== undefined &&
    targetTotalStock > 0 &&
    (forceRedistribute || wasEmpty || currentNewSum === 0);

  if (shouldRedistribute && targetTotalStock && targetTotalStock > 0) {
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
