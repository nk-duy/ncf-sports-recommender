/** Thông tin mới nhất của sản phẩm lấy từ server (tồn kho, giá, biến thể) */
export interface LiveInfo {
  missing: boolean;
  price: number;
  stock: number;
  sizes: string[];
  colors: string[];
  discount_percent: number;
  hidden: boolean;
  variants?: Array<{ size?: string; color?: string; stock?: number; sku?: string }>;
}
