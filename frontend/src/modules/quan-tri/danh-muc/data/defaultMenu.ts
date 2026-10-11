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
    sport_type: 'Chạy bộ',
    product_types: [
      { product_type: 'Giày dép', categories: [{ category: 'Giày Chạy Bộ' }] },
      { product_type: 'Quần áo', categories: [{ category: 'Đồ Chạy Thoáng Khí' }] },
      { product_type: 'Phụ kiện', categories: [{ category: 'Đai Chạy & Bình Nước' }] },
    ]
  },
  {
    sport_type: 'Cầu lông',
    product_types: [
      { product_type: 'Thiết bị', categories: [{ category: 'Vợt Cầu Lông' }] },
      { product_type: 'Giày dép', categories: [{ category: 'Giày Cầu Lông' }] },
      { product_type: 'Quần áo', categories: [{ category: 'Quần Áo Cầu Lông' }] },
      { product_type: 'Phụ kiện', categories: [{ category: 'Quấn Cán & Túi Vợt' }] },
    ]
  },
  {
    sport_type: 'Đá bóng',
    product_types: [
      { product_type: 'Giày dép', categories: [{ category: 'Giày Đá Bóng Sân Cỏ' }] },
      { product_type: 'Quần áo', categories: [{ category: 'Quần Áo Thi Đấu' }] },
      { product_type: 'Thiết bị', categories: [{ category: 'Quả Bóng Đá' }] },
      { product_type: 'Phụ kiện', categories: [{ category: 'Bọc Ống Đồng & Vớ' }] },
    ]
  },
  {
    sport_type: 'Bóng chuyền',
    product_types: [
      { product_type: 'Giày dép', categories: [{ category: 'Giày Bóng Chuyền' }] },
      { product_type: 'Quần áo', categories: [{ category: 'Quần Áo Bóng Chuyền' }] },
      { product_type: 'Thiết bị', categories: [{ category: 'Quả Bóng Chuyền' }] },
      { product_type: 'Phụ kiện', categories: [{ category: 'Băng Bảo Vệ Gối' }] },
    ]
  },
  {
    sport_type: 'Đa dụng',
    product_types: [
      { product_type: 'Quần áo', categories: [{ category: 'Đồ Tập Gym & Yoga' }] },
      { product_type: 'Thiết bị', categories: [{ category: 'Dụng Cụ Kháng Lực' }] },
      { product_type: 'Phụ kiện', categories: [{ category: 'Thảm Tập & Bình Nước' }] },
    ]
  },
  {
    sport_type: 'Dã ngoại',
    product_types: [
      { product_type: 'Giày dép', categories: [{ category: 'Giày Trekking & Leo Núi' }] },
      { product_type: 'Phụ kiện', categories: [{ category: 'Balo Trợ Lực' }] },
      { product_type: 'Thiết bị', categories: [{ category: 'Lều & Dụng Cụ Outdoor' }] },
    ]
  },
  {
    sport_type: 'Phụ kiện chung',
    product_types: [
      { 
        product_type: 'Phụ kiện', 
        categories: [
          { category: 'Vớ Thể Thao Dệt Kim' },
          { category: 'Balo / Túi Thể Thao' },
          { category: 'Mũ / Nón Năng Động' },
          { category: 'Băng Gối / Lót Giày' }
        ] 
      }
    ]
  }
];
