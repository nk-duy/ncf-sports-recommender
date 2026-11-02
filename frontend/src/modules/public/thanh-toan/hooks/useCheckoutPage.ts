'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { useHydrated } from '@/shared/hooks/useHydrated';
import { useCartStore, cartKey } from '@/shared/store/cartStore';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { useAuthStore } from '@/shared/store/authStore';
import { calcEffectiveShippingFee, calcVoucherDiscount, getShippingOption } from '@/shared/lib/cart';

function parseUserAddress(raw?: string): { province: string; ward: string; street: string } {
  if (!raw) return { province: '', ward: '', street: '' };
  const fullAddr = raw.trim();
  const parts = fullAddr.split(',').map((p) => p.trim());
  if (parts.length >= 3) {
    return {
      province: parts[parts.length - 1],
      ward: parts[parts.length - 2],
      street: parts.slice(0, parts.length - 2).join(', '),
    };
  }
  return { province: '', ward: '', street: fullAddr };
}

export function useCheckoutPage() {
  const router = useRouter();
  const mounted = useHydrated();
  const { items: cartItems, removeItems } = useCartStore();
  const {
    customer_name,
    customer_phone,
    payment_method,
    shipping_id,
    selectedKeys,
    setSelectedKeys,
    appliedVoucher,
    setAppliedVoucher,
    setField,
  } = useCheckoutStore();
  const { token, isAuthenticated, user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transferContent, setTransferContent] = useState('KADY SPORT');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const [provinceOverride, setSelectedProvince] = useState<string | null>(null);
  const [wardOverride, setSelectedWard] = useState<string | null>(null);
  const [streetOverride, setStreetAddress] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const parsedUserAddr = parseUserAddress(user?.address);
  const selectedProvince = provinceOverride ?? parsedUserAddr.province;
  const selectedWard = wardOverride ?? parsedUserAddr.ward;
  const streetAddress = streetOverride ?? parsedUserAddr.street;

  // Tự động điền họ tên & số điện thoại vào store nếu đã đăng nhập và form còn trống
  useEffect(() => {
    if (!user) return;
    if (!customer_name && user.full_name) {
      setField('customer_name', user.full_name);
    }
    if (!customer_phone && user.phone) {
      setField('customer_phone', user.phone);
    }
  }, [user, customer_name, customer_phone, setField]);

  const selectedCartItems = cartItems.filter((i) => selectedKeys.includes(cartKey(i)));
  const items = selectedCartItems.length > 0 ? selectedCartItems : cartItems;

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = calcEffectiveShippingFee(total, shipping_id);
  const discountAmount = calcVoucherDiscount(appliedVoucher, total, shippingFee);
  const finalTotal = Math.max(0, total + shippingFee - discountAmount);

  const submitOrder = async () => {
    const purchasedKeys = items.map(cartKey);
    const fullAddress = `${streetAddress.trim()}, ${selectedWard}, ${selectedProvince}${
      note.trim() ? ` (Ghi chú: ${note.trim()})` : ''
    }`;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isAuthenticated && token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customer_name: customer_name.trim(),
          customer_phone: customer_phone.trim(),
          customer_address: fullAddress,
          payment_method,
          items: items.map((i) => ({
            product_id: i.product_id,
            product_name: i.name,
            quantity: i.quantity,
            price: i.price,
            size: i.size,
            color: i.color || '',
            image_url: i.image_url || '',
          })),
          subtotal: total,
          shipping_fee: shippingFee,
          shipping_method: getShippingOption(shipping_id).name,
          total_amount: finalTotal,
          voucher_code: appliedVoucher && discountAmount > 0 ? appliedVoucher.code : undefined,
          discount_amount: discountAmount,
        }),
      });

      if (res.ok) {
        const data: { order_id: string } = await res.json();
        // Chỉ xóa những sản phẩm đã mua, giữ lại các sản phẩm còn lại trong giỏ
        removeItems(purchasedKeys);
        setSelectedKeys([]);
        setAppliedVoucher(null);
        router.push(`/thanh-toan/success?order_id=${data.order_id}`);
      } else {
        notifications.show({
          title: 'Lỗi đặt hàng',
          message: 'Đã có lỗi xảy ra khi tạo đơn hàng.',
          color: 'red',
        });
      }
    } catch {
      notifications.show({
        title: 'Lỗi kết nối',
        message: 'Không thể kết nối đến máy chủ.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrderClick = () => {
    setHasAttemptedSubmit(true);

    if (items.length === 0) {
      notifications.show({
        title: 'Giỏ hàng trống',
        message: 'Không có sản phẩm nào để thanh toán!',
        color: 'red',
      });
      return;
    }

    if (
      !customer_name.trim() ||
      !customer_phone.trim() ||
      !selectedProvince ||
      !selectedWard ||
      !streetAddress.trim()
    ) {
      notifications.show({
        title: 'Thiếu thông tin nhận hàng',
        message: 'Vui lòng điền đầy đủ các thông tin bắt buộc bị tô đỏ!',
        color: 'red',
      });
      return;
    }

    if (payment_method === 'COD') {
      void submitOrder();
    } else {
      setTransferContent(`KADY SPORT ${Math.floor(100000 + Math.random() * 900000)}`);
      setShowPaymentModal(true);
    }
  };

  return {
    mounted,
    items,
    total,
    shippingFee,
    discountAmount,
    finalTotal,
    loading,
    payment_method,
    showPaymentModal,
    setShowPaymentModal,
    transferContent,
    hasAttemptedSubmit,
    selectedProvince,
    setSelectedProvince,
    selectedWard,
    setSelectedWard,
    streetAddress,
    setStreetAddress,
    note,
    setNote,
    handlePlaceOrderClick,
    submitOrder,
  };
}
