export interface BannerItem {
  _id: string;
  title: string;
  subtitle?: string | null;
  badge?: string | null;
  image_url: string;
  link?: string | null;
  position: number;
  is_active: boolean;
}

export const FALLBACK_BANNER_IMAGE =
  "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&auto=format&fit=crop&q=80";
