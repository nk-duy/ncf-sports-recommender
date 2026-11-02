export interface UserRecommendedProduct {
  product_id: string;
  name: string;
  price: number;
  original_price?: number;
  discount_percent?: number;
  image_url: string;
  image?: string;
  sizes?: string[];
  colors?: string[];
  stock?: number;
  category?: string | string[];
  sport_type?: string;
  match_score?: number;
}

export const DEFAULT_RECOMMENDED_SPORT_IMG =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80";
