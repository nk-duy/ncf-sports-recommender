export interface MegaMenuCategory {
  category: string;
}

export interface MegaMenuProductType {
  product_type: string;
  categories: MegaMenuCategory[];
}

export interface MegaMenuSport {
  sport_type: string;
  product_types: MegaMenuProductType[];
}
