// Tiện ích dùng chung cho Giỏ hàng & Thanh toán.
// Giá `product.price` trong DB là GIÁ ĐÃ GIẢM, giá gốc = price / (1 - discount_percent/100).

export const API_BASE = 'http://localhost:8000/api/v1';

export const formatVND = (price: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  eta: string;
}

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'vnexpress', name: 'VNExpress', price: 30000, eta: '3-5 ngày' },
  { id: 'fast', name: 'Giao Hàng Nhanh', price: 35000, eta: '2-3 ngày' },
  { id: 'express', name: 'Hỏa tốc', price: 60000, eta: 'Trong 24 giờ' },
];

export const getShippingOption = (id: string): ShippingOption =>
  SHIPPING_OPTIONS.find((o) => o.id === id) || SHIPPING_OPTIONS[1];

export const calcOriginalPrice = (price: number, discountPercent?: number | null): number =>
  discountPercent && discountPercent > 0 && discountPercent < 100
    ? Math.round(price / (1 - discountPercent / 100))
    : price;

export interface Voucher {
  code: string;
  discount_type: 'fixed' | 'percent' | 'freeship' | string;
  discount_value: number;
  max_discount?: number | null;
  min_order_value?: number | null;
  usage_limit?: number | null;
  used_count?: number;
  valid_from?: string | null;
  valid_until?: string | null;
  is_active: boolean;
}

/** Trả về thông báo lỗi nếu voucher KHÔNG dùng được với đơn hiện tại, ngược lại trả null. */
export function getVoucherError(v: Voucher, subtotal: number): string | null {
  if (!v.is_active) return 'Mã voucher đã ngừng hoạt động.';
  const now = Date.now();
  if (v.valid_from && new Date(v.valid_from).getTime() > now) return 'Mã voucher chưa đến thời gian sử dụng.';
  if (v.valid_until && new Date(v.valid_until).getTime() < now) return 'Mã voucher đã hết hạn.';
  if (v.usage_limit && (v.used_count || 0) >= v.usage_limit) return 'Mã voucher đã hết lượt sử dụng.';
  if (v.min_order_value && subtotal < v.min_order_value) {
    return `Đơn hàng cần tối thiểu ${formatVND(v.min_order_value)} (còn thiếu ${formatVND(v.min_order_value - subtotal)}).`;
  }
  return null;
}

/** Số tiền giảm của voucher (0 nếu voucher không hợp lệ với đơn hiện tại). */
export function calcVoucherDiscount(v: Voucher | null, subtotal: number, shippingFee: number): number {
  if (!v || subtotal <= 0 || getVoucherError(v, subtotal)) return 0;
  if (v.discount_type === 'freeship') {
    return Math.min(shippingFee, v.max_discount || shippingFee);
  }
  if (v.discount_type === 'fixed') {
    return Math.min(v.discount_value, subtotal);
  }
  if (v.discount_type === 'percent') {
    let discount = Math.round((subtotal * v.discount_value) / 100);
    if (v.max_discount && discount > v.max_discount) discount = v.max_discount;
    return Math.min(discount, subtotal);
  }
  return 0;
}

export function describeVoucher(v: Voucher): string {
  if (v.discount_type === 'freeship') return 'Miễn phí vận chuyển';
  if (v.discount_type === 'fixed') return `Giảm ${formatVND(v.discount_value)}`;
  if (v.discount_type === 'percent') {
    return `Giảm ${v.discount_value}%${v.max_discount ? ` (tối đa ${formatVND(v.max_discount)})` : ''}`;
  }
  return v.code;
}

/** Gọi API lấy voucher theo mã. Ném lỗi với message tiếng Việt nếu không tìm thấy. */
export async function fetchVoucherByCode(code: string): Promise<Voucher> {
  const res = await fetch(`${API_BASE}/vouchers/code/${encodeURIComponent(code.trim().toUpperCase())}`);
  if (!res.ok) throw new Error('Mã voucher không hợp lệ.');
  return res.json();
}
