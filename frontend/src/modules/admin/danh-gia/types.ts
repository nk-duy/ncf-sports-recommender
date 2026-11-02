export type HiddenFilterType = 'all' | 'visible' | 'hidden';

export interface ReviewItem {
  id: string;
  user_id: string;
  user_name?: string;
  avatar_url?: string;
  product_id: string;
  product_name?: string;
  product_image?: string;
  brand?: string;
  rating: number;
  comment?: string;
  size_bought?: string;
  color_bought?: string;
  verified_purchase: boolean;
  is_hidden: boolean;
  images?: string[];
  timestamp: string;
}

export interface ReviewsMetrics {
  positiveCount: number;
  negativeCount: number;
  hiddenCount: number;
}

export const FALLBACK_SPORTS_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
