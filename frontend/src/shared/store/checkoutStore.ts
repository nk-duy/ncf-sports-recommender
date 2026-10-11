import { create } from 'zustand';
import type { Voucher } from '@/shared/lib/cart';

type TextField = 'customer_name' | 'customer_phone' | 'customer_address' | 'payment_method' | 'shipping_id';

interface CheckoutState {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  payment_method: string;
  /** Phương thức vận chuyển đã chọn (dùng chung giữa giỏ hàng & thanh toán) */
  shipping_id: string;
  /** Các dòng giỏ hàng (cartKey) được tick để thanh toán */
  selectedKeys: string[];
  /** Voucher đang áp dụng (dùng chung giữa giỏ hàng & thanh toán) */
  appliedVoucher: Voucher | null;
  setField: (field: TextField, value: string) => void;
  setSelectedKeys: (keys: string[]) => void;
  setAppliedVoucher: (voucher: Voucher | null) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  customer_name: '',
  customer_phone: '',
  customer_address: '',
  payment_method: 'COD',
  shipping_id: 'fast',
  selectedKeys: [],
  appliedVoucher: null,
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  setSelectedKeys: (keys) => set({ selectedKeys: keys }),
  setAppliedVoucher: (voucher) => set({ appliedVoucher: voucher }),
}));
