'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore, cartKey } from "@/shared/store/cartStore";
import { useCheckoutStore } from "@/shared/store/checkoutStore";
import { useAuthStore } from "@/shared/store/authStore";
import { calcVoucherDiscount, getShippingOption } from "@/shared/lib/cart";
import { notifications } from "@mantine/notifications";

import CheckoutAddressForm from "@/modules/thanh-toan/components/CheckoutAddressForm";
import CheckoutOrderItems from "@/modules/thanh-toan/components/CheckoutOrderItems";
import CheckoutPaymentMethods from "@/modules/thanh-toan/components/CheckoutPaymentMethods";
import CheckoutSummary from "@/modules/thanh-toan/components/CheckoutSummary";
import QRPaymentModal from "@/modules/thanh-toan/components/QRPaymentModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { items: cartItems, removeItems } = useCartStore();
  const {
    customer_name, customer_phone, payment_method, 
    shipping_id, selectedKeys, setSelectedKeys, appliedVoucher, setAppliedVoucher,
  } = useCheckoutStore();
  const { token, isAuthenticated } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [note, setNote] = useState('');

  const shippingMethod = getShippingOption(shipping_id);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePlaceOrderClick = () => {
    setHasAttemptedSubmit(true);
    
    if (items.length === 0) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không có sản phẩm nào để thanh toán!',
        color: 'red',
      });
      return;
    }
    
    if (!customer_name.trim() || !customer_phone.trim() || !selectedProvince || !selectedWard || !streetAddress.trim()) {
      notifications.show({
        title: 'Thiếu thông tin',
        message: 'Vui lòng điền đầy đủ các trường thông tin bắt buộc bị tô đỏ!',
        color: 'red',
      });
      return;
    }

    if (payment_method === 'COD') {
      submitOrder();
    } else {
      setShowPaymentModal(true);
    }
  };

  const submitOrder = async () => {
    const purchasedKeys = items.map(cartKey);
    const fullAddress = `${streetAddress.trim()}, ${selectedWard}, ${selectedProvince}${note.trim() ? ` (Ghi chú: ${note.trim()})` : ''}`;
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(isAuthenticated && token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          customer_name: customer_name.trim(),
          customer_phone: customer_phone.trim(),
          customer_address: fullAddress,
          payment_method: payment_method,
          items: items.map(i => ({
            product_id: i.product_id,
            product_name: i.name,
            quantity: i.quantity,
            price: i.price,
            size: i.size,
            color: i.color || ""
          })),
          total_amount: finalTotal,
          voucher_code: appliedVoucher && discountAmount > 0 ? appliedVoucher.code : undefined,
          discount_amount: discountAmount
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Chỉ xóa những sản phẩm đã mua, giữ lại các sản phẩm còn lại trong giỏ
        removeItems(purchasedKeys);
        setSelectedKeys([]);
        setAppliedVoucher(null);
        router.push(`/thanh-toan/success?order_id=${data.order_id}`);
      } else {
        notifications.show({ title: 'Lỗi đặt hàng', message: 'Đã có lỗi xảy ra khi đặt hàng.', color: 'red' });
      }
    } catch (error) {
      console.error(error);
      notifications.show({ title: 'Lỗi kết nối', message: 'Không thể kết nối đến máy chủ.', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">Đang tải...</div>;

  const selectedCartItems = cartItems.filter(i => selectedKeys.includes(cartKey(i)));
  const items = selectedCartItems.length > 0 ? selectedCartItems : cartItems;

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingFee = shippingMethod.price;
  const discountAmount = calcVoucherDiscount(appliedVoucher, total, shippingFee);
  const finalTotal = Math.max(0, total + shippingFee - discountAmount);

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 h-20 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-blue-700 font-bold text-2xl tracking-tighter">KADY</span>
            <span className="text-blue-700 text-xl">|</span>
            <span className="text-blue-700 text-xl font-medium">Thanh Toán</span>
          </Link>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mt-6">
        
        {/* Địa chỉ nhận hàng */}
        <CheckoutAddressForm 
          hasAttemptedSubmit={hasAttemptedSubmit}
          selectedProvince={selectedProvince}
          setSelectedProvince={setSelectedProvince}
          selectedWard={selectedWard}
          setSelectedWard={setSelectedWard}
          streetAddress={streetAddress}
          setStreetAddress={setStreetAddress}
          note={note}
          setNote={setNote}
        />

        {/* Danh sách sản phẩm & Vouchers */}
        <CheckoutOrderItems items={items} total={total} />

        {/* Phương thức thanh toán */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <CheckoutPaymentMethods />
          
          <CheckoutSummary 
            total={total}
            shippingFee={shippingFee}
            discountAmount={discountAmount}
            finalTotal={finalTotal}
            loading={loading}
            onPlaceOrder={handlePlaceOrderClick}
          />
        </div>

      </div>
      
      {/* QR Code Payment Modal */}
      {showPaymentModal && (
        <QRPaymentModal 
          paymentMethod={payment_method}
          finalTotal={finalTotal}
          onCancel={() => setShowPaymentModal(false)}
          onConfirm={() => {
            setShowPaymentModal(false);
            submitOrder();
          }}
        />
      )}
    </div>
  );
}
