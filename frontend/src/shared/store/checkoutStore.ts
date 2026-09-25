import { create } from 'zustand';

interface CheckoutState {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  payment_method: string;
  setField: (field: keyof CheckoutState, value: string) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  customer_name: '',
  customer_phone: '',
  customer_address: '',
  payment_method: 'COD',
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
}));
