import type { QuickAddProduct } from '../QuickAddToCartModal';

export const SPORTS_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';

export function computeAvailableSizes(product: QuickAddProduct | null): string[] {
  if (!product) return [];
  if (product.sizes && product.sizes.length > 0) return product.sizes;
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

export function computeAvailableColors(product: QuickAddProduct | null): string[] {
  if (!product) return [];
  if (product.colors && product.colors.length > 0) return product.colors;
  return [];
}
