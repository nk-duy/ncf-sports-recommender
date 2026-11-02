export interface PromoProductItem {
  product_id: string;
  asin?: string;
  title?: string;
  name: string;
  price: number;
  discount_percent: number;
  image_url: string;
  is_active?: boolean;
}

export const FALLBACK_PROMO_IMAGE =
  'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80';

export function formatPromoPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}
