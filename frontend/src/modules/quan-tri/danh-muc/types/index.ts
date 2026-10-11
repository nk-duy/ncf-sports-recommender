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
