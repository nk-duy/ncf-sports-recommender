import type { ProductDetail } from '../types';

export function getAvailableSizes(product: ProductDetail): string[] {
  if (product.sizes?.length) return product.sizes;
  const cat = product.category || [];
  const nameLower = (product.name || '').toLowerCase();
  if (
    cat.includes('Clothing') ||
    nameLower.includes('áo') ||
    nameLower.includes('quần') ||
    product.product_type === 'Quần áo'
  ) {
    return ['S', 'M', 'L', 'XL', 'XXL'];
  }
  if (
    cat.includes('Shoes') ||
    nameLower.includes('giày') ||
    product.product_type === 'Giày dép'
  ) {
    return ['39', '40', '41', '42', '43'];
  }
  return ['Tiêu chuẩn', 'Freesize'];
}

export function getVariantSizeStock(
  product: ProductDetail,
  size: string,
  selectedColor: string
): number {
  const activeVariants = product.variants || [];
  const productStock = product.stock ?? 25;

  if (activeVariants.length === 0) {
    if (productStock <= 0) return 0;
    if (size === 'XXL' || size === '43') return productStock < 10 ? 0 : productStock;
    return productStock;
  }

  if (selectedColor) {
    const match = activeVariants.find((v) => v.size === size && v.color === selectedColor);
    return match !== undefined ? (match.stock ?? 0) : 0;
  }

  const matchingSizes = activeVariants.filter((v) => v.size === size);
  if (matchingSizes.length > 0) {
    return matchingSizes.reduce((sum, v) => sum + (v.stock || 0), 0);
  }
  return productStock;
}

export function getDefaultProductSize(product: ProductDetail, colorOverride?: string): string {
  const sizes = getAvailableSizes(product);
  if (sizes.length === 0) return '';
  const defaultColor = colorOverride !== undefined ? colorOverride : (product.colors?.[0] || '');
  return sizes.find((s) => getVariantSizeStock(product, s, defaultColor) > 0) || sizes[0];
}

export function formatVndCurrency(price: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
