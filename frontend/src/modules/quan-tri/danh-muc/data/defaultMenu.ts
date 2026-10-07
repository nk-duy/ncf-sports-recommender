import { MegaMenuSport } from '../types';

export const defaultMenu: MegaMenuSport[] = [
  {
    sport_type: 'Pickleball',
    product_types: [
      { product_type: 'Quần áo', categories: [{ category: 'Quần Áo Pickleball' }] },
      { product_type: 'Giày dép', categories: [{ category: 'Giày Pickleball' }] },
      { product_type: 'Thiết bị', categories: [{ category: 'Vợt Pickleball' }] },
      { product_type: 'Phụ kiện', categories: [{ category: 'Phụ Kiện Pickleball' }] },
    ]
  },
  {
    sport_type: 'Bóng chuyền',
    product_types: [
      { product_type: 'Quần áo', categories: [{ category: 'Quần Áo Bóng Chuyền' }] },
      { product_type: 'Giày dép', categories: [{ category: 'Giày Bóng Chuyền' }] },
      { product_type: 'Thiết bị', categories: [{ category: 'Quả Bóng Chuyền' }] },
    ]
  },
  {
    sport_type: 'Chạy bộ',
    product_types: [
      { product_type: 'Quần áo', categories: [{ category: 'Đồ Chạy Bộ' }] },
      { product_type: 'Giày dép', categories: [{ category: 'Giày Chạy Bộ' }] },
    ]
  },
  {
    sport_type: 'Phụ kiện chung',
    product_types: [
      { 
        product_type: 'Phụ kiện', 
        categories: [
          { category: 'Vớ Thể Thao' },
          { category: 'Balo / Túi Xách' },
          { category: 'Mũ / Nón' },
          { category: 'Băng Gối / Lót Giày' }
        ] 
      }
    ]
  }
];
