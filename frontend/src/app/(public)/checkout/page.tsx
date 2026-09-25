'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Ticket, CreditCard, Banknote, ChevronDown, Check } from "lucide-react";
import { useCartStore } from "@/shared/store/cartStore";
import { useCheckoutStore } from "@/shared/store/checkoutStore";
import { notifications } from "@mantine/notifications";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { customer_name, customer_phone, customer_address, payment_method, setField } = useCheckoutStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const shippingOptions = [
    { id: 'vnexpress', name: 'VNExpress', price: 30000 },
    { id: 'fast', name: 'Giao Hàng Nhanh', price: 35000 },
    { id: 'express', name: 'Hỏa tốc', price: 60000 },
  ];

  const [shippingMethod, setShippingMethod] = useState(shippingOptions[1]);
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      notifications.show({
        title: 'Lỗi',
        message: 'Không có sản phẩm nào để thanh toán!',
        color: 'red',
      });
      return;
    }
    
    if (!customer_name.trim() || !customer_phone.trim() || !customer_address.trim()) {
      notifications.show({
        title: 'Thiếu thông tin',
        message: 'Vui lòng nhập đầy đủ địa chỉ nhận hàng!',
        color: 'red',
      });
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/v1/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: customer_name.trim(),
          customer_phone: customer_phone.trim(),
          customer_address: customer_address.trim(),
          payment_method: payment_method,
          items: items.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity,
            price: i.price,
            size: i.size,
            color: i.color || ""
          })),
          total_amount: getTotalPrice()
        })
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        router.push(`/checkout/success?order_id=${data.order_id}`);
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

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setDiscountAmount(0);
      return;
    }
    const code = voucherCode.trim().toUpperCase();
    
    try {
      const res = await fetch(`http://localhost:8000/api/v1/vouchers/code/${code}`);
      if (!res.ok) {
        setDiscountAmount(0);
        notifications.show({ title: 'Lỗi', message: 'Mã voucher không hợp lệ hoặc đã hết hạn!', color: 'red' });
        return;
      }
      const data = await res.json();
      
      if (!data.is_active) {
        setDiscountAmount(0);
        notifications.show({ title: 'Lỗi', message: 'Mã voucher đã ngừng hoạt động!', color: 'red' });
        return;
      }

      if (data.min_order_value && total < data.min_order_value) {
        setDiscountAmount(0);
        notifications.show({ title: 'Lỗi', message: `Đơn hàng chưa đạt giá trị tối thiểu ${data.min_order_value}đ`, color: 'red' });
        return;
      }

      if (data.discount_type === 'freeship') {
        setDiscountAmount(shippingMethod.price);
        notifications.show({ title: 'Thành công', message: 'Áp dụng mã FREESHIP thành công!', color: 'green' });
      } else if (data.discount_type === 'fixed') {
        setDiscountAmount(data.discount_value);
        notifications.show({ title: 'Thành công', message: `Giảm ${data.discount_value}đ thành công!`, color: 'green' });
      } else if (data.discount_type === 'percent') {
        let discount = (total * data.discount_value) / 100;
        if (data.max_discount && discount > data.max_discount) {
          discount = data.max_discount;
        }
        setDiscountAmount(discount);
        notifications.show({ title: 'Thành công', message: `Giảm ${data.discount_value}% thành công!`, color: 'green' });
      }
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối tới server', color: 'red' });
    }
  };

  // Re-calculate freeship discount if shipping method changes
  useEffect(() => {
    if (discountAmount > 0 && voucherCode) {
      handleApplyVoucher();
    }
  }, [shippingMethod]);

  if (!mounted) return <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">Đang tải...</div>;

  const total = getTotalPrice();
  const shippingFee = shippingMethod.price;
  const finalTotal = Math.max(0, total + shippingFee - discountAmount);

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-blue-700 font-bold text-2xl tracking-tighter">SportsAI</span>
            <span className="text-blue-700 text-xl">|</span>
            <span className="text-blue-700 text-xl font-medium">Thanh Toán</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Địa chỉ nhận hàng */}
        <div className="bg-white rounded-lg shadow-sm mb-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[repeating-linear-gradient(45deg,transparent,transparent_33px,#3b82f6_33px,#3b82f6_39px,transparent_39px,transparent_72px,#0ea5e9_72px,#0ea5e9_78px)]"></div>
          <div className="p-6">
            <div className="flex items-center gap-2 text-blue-600 text-lg mb-4 font-medium">
              <MapPin size={20} />
              <span>Địa Chỉ Nhận Hàng</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <input 
                  type="text" 
                  value={customer_name}
                  onChange={(e) => setField('customer_name', e.target.value)}
                  placeholder="Họ và tên"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  value={customer_phone}
                  onChange={(e) => setField('customer_phone', e.target.value)}
                  placeholder="Số điện thoại"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  value={customer_address}
                  onChange={(e) => setField('customer_address', e.target.value)}
                  placeholder="Địa chỉ cụ thể"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="px-6 py-4 border-b border-gray-100 flex text-sm text-gray-500 font-medium">
            <div className="w-[50%] text-gray-800 text-lg">Sản phẩm</div>
            <div className="w-[15%] text-center">Đơn giá</div>
            <div className="w-[15%] text-center">Số lượng</div>
            <div className="w-[20%] text-right pr-4">Thành tiền</div>
          </div>
          <div className="px-6">
            {items.map((item, index) => (
              <div key={`${item.product_id}-${item.size}-${item.color}`} className={`flex items-center py-4 ${index !== items.length -1 ? 'border-b border-dashed border-gray-200' : ''}`}>
                <div className="w-[50%] flex items-start gap-3">
                  <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover" />
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900">{item.name}</span>
                    <span className="text-xs text-gray-500">Loại: {item.size}{item.color ? `, ${item.color}` : ''}</span>
                  </div>
                </div>
                <div className="w-[15%] text-center text-sm text-gray-700">{formatPrice(item.price)}</div>
                <div className="w-[15%] text-center text-sm text-gray-700">{item.quantity}</div>
                <div className="w-[20%] text-right pr-4 text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 bg-blue-50/30 px-6 py-4 flex flex-col text-sm">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsShippingOpen(!isShippingOpen)}
            >
              <div className="flex items-center gap-4">
                <span className="font-medium text-gray-900">Phương thức vận chuyển:</span>
                <span className="font-bold text-gray-900">{shippingMethod.name}</span>
                <span className="text-gray-600">({formatPrice(shippingMethod.price)})</span>
              </div>
              <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 uppercase text-xs">
                Thay Đổi
                <ChevronDown size={16} className={`transition-transform duration-200 ${isShippingOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {isShippingOpen && (
              <div className="mt-4 pt-4 border-t border-dashed border-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {shippingOptions.map(option => (
                  <div 
                    key={option.id}
                    onClick={() => {
                      setShippingMethod(option);
                      setIsShippingOpen(false);
                    }}
                    className={`relative p-3 border rounded-md cursor-pointer transition-all ${shippingMethod.id === option.id ? 'border-blue-600 bg-blue-50/80 shadow-sm' : 'border-gray-200 bg-white hover:border-blue-400'}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold ${shippingMethod.id === option.id ? 'text-blue-700' : 'text-gray-800'}`}>{option.name}</span>
                      {shippingMethod.id === option.id && (
                        <div className="text-blue-600 absolute right-2 top-2">
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                    <div className={`text-sm ${shippingMethod.id === option.id ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                      {formatPrice(option.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 bg-white px-6 py-4 flex items-center justify-end text-sm border-b border-dashed">
            <div className="flex items-center gap-3">
              <Ticket size={20} className="text-blue-600" />
              <span className="font-medium text-gray-900 mr-2">Voucher SportsAI:</span>
              <div className="flex">
                <input 
                  type="text" 
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập FREESHIP hoặc GIAM20K" 
                  className="px-3 py-1.5 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:border-blue-500 uppercase w-[220px]"
                />
                <button 
                  onClick={handleApplyVoucher}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-r-md text-sm font-medium transition-colors"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 flex justify-end items-center gap-4 border-t border-gray-100 text-sm">
            <span className="text-gray-500 font-medium">Tổng số tiền ({items.length} sản phẩm):</span>
            <span className="text-xl text-gray-900 font-bold">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-8">
            <h3 className="text-lg text-gray-900 font-medium">Phương thức thanh toán</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => setField('payment_method', 'COD')}
                className={`px-4 py-2 text-sm border rounded-md flex items-center gap-2 transition-colors ${payment_method === 'COD' ? 'border-blue-600 text-blue-600 bg-blue-50 font-medium' : 'border-gray-300 text-gray-700 hover:border-blue-400'}`}
              >
                Thanh toán khi nhận hàng
              </button>
              <button 
                onClick={() => setField('payment_method', 'VNPAY')}
                className={`px-4 py-2 text-sm border rounded-md flex items-center gap-2 transition-colors ${payment_method === 'VNPAY' ? 'border-blue-600 text-blue-600 bg-blue-50 font-medium' : 'border-gray-300 text-gray-700 hover:border-blue-400'}`}
              >
                VNPAY / Thẻ Tín Dụng
              </button>
            </div>
          </div>
          
          {/* Tổng kết cuối trang */}
          <div className="bg-gray-50/50 border-t border-gray-100 p-6 flex justify-end">
            <div className="w-[400px]">
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-gray-500 font-medium">Tổng tiền hàng</span>
                <span className="text-gray-800 font-medium">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center py-2 text-sm">
                <span className="text-gray-500 font-medium">Phí vận chuyển</span>
                <span className="text-gray-800 font-medium">{formatPrice(shippingFee)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between items-center py-2 text-sm">
                  <span className="text-gray-500 font-medium">Giảm giá voucher</span>
                  <span className="text-green-600 font-medium">- {formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 mt-2 border-t border-gray-200">
                <span className="text-gray-500 font-medium">Tổng thanh toán</span>
                <span className="text-3xl text-blue-600 font-bold">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 p-6 flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <span className="text-blue-600 cursor-pointer">Điều khoản SportsAI</span>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3.5 rounded-lg text-lg font-bold transition-all shadow-md min-w-[200px]"
            >
              {loading ? "Đang xử lý..." : "Đặt Hàng"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
