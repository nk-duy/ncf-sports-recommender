export interface MegaMenuCategory {
  category: string;
  is_hidden?: boolean;
}

export interface MegaMenuProductType {
  product_type: string;
  categories: MegaMenuCategory[];
  is_hidden?: boolean;
}

export interface MegaMenuSport {
  sport_type: string;
  product_types: MegaMenuProductType[];
  is_hidden?: boolean;
}

export interface AutocompleteProduct {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  sport_type?: string;
  product_type?: string;
  category?: string[];
  discount_percent?: number;
}
