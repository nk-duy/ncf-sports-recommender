export type ProductTabType = 'all' | 'promo' | 'hidden' | 'trash';

export interface ProductVariantItem {
  color?: string;
  size?: string;
  stock: number;
  sku?: string;
  price?: number;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface AdminProductItem {
  _id?: string;
  product_id: string;
  name: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  discount_end_date?: string | null;
  image_url: string;
  images?: string[];
  stock?: number;
  rating?: number;
  reviews_count?: number;
  reviewsCount?: number;
  sales_count?: number;
  sold?: number;
  category?: string[] | string;
  sub_category?: string;
  brand?: string | null;
  gender?: string | string[];
  product_type?: string;
  sport_type?: string;
  sizes?: string[];
  colors?: string[];
  variants?: ProductVariantItem[];
  description?: string;
  is_hidden?: boolean;
  is_deleted?: boolean;
}

export interface ProductSortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ProductTabCounts {
  all: number;
  promo: number;
  hidden: number;
  trash: number;
  low_stock?: number;
}

export interface ConfirmModalState {
  isOpen: boolean;
  title?: string;
  message: string;
  isBlocked?: boolean;
  aiWarning?: string;
  interactionCount?: number;
  orderCount?: number;
  reviewCount?: number;
  onConfirm?: () => void;
}

export interface MenuCategoryOption {
  category: string;
  is_hidden?: boolean;
}

export interface MenuProductTypeOption {
  product_type: string;
  categories?: Array<string | MenuCategoryOption>;
}

export interface MenuSportOption {
  sport_type: string;
  product_types?: MenuProductTypeOption[];
}

export interface ProductFormData {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  stock: number;
  rating: number;
  reviews_count: number;
  category: string[];
  brand: string;
  gender: string;
  product_type: string;
  sport_type: string;
  sizes: string[];
  colors: string[];
  variants: ProductVariantItem[];
  description: string;
  images: string[];
}

export const FALLBACK_PRODUCT_IMG =
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
