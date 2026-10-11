'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Verified, Info, ArrowRight, Loader2 } from "lucide-react";
import { useCartStore } from "@/shared/store/cartStore";
import { useCheckoutStore } from "@/shared/store/checkoutStore";
import { notifications } from "@mantine/notifications";

export default function CheckoutSummary() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { customer_name, customer_phone, customer_address, payment_method } = useCheckoutStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [showQR, setShowQR] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const executeOrder = async () => {
    setLoading(true);
    try {
      // Gọi API tạo đơn hàng
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
        clearCart();
        router.push("/thanh-toan/success");
      } else {
        notifications.show({
          title: 'Lỗi đặt hàng',
          message: 'Đã có lỗi xảy ra khi đặt hàng.',
          color: 'red',
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: 'Lỗi kết nối',
        message: 'Không thể kết nối đến máy chủ.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      notifications.show({ title: 'Lỗi', message: 'Giỏ hàng của bạn đang trống!', color: 'red' });
      return;
    }
    if (!customer_name.trim() || !customer_phone.trim() || !customer_address.trim()) {
      notifications.show({ title: 'Thiếu thông tin', message: 'Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ!', color: 'red' });
      return;
    }
    
    if (payment_method === 'VNPAY') {
      setShowQR(true);
      return;
    }
    
    await executeOrder();
  };

  const simulatePaymentSuccess = async () => {
    setIsProcessingPayment(true);
    setTimeout(async () => {
      setIsProcessingPayment(false);
      setShowQR(false);
      await executeOrder();
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (!mounted) return <div className="bg-white p-7 rounded-lg shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center">Đang tải tóm tắt...</div>;

  const total = getTotalPrice();

  return (
    <div className="bg-white p-5 sm:p-7 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Tóm tắt đơn hàng</h2>
        <span className="font-mono text-xs font-semibold text-gray-400">KADY #8942</span>
      </div>

      {/* Voucher Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600" htmlFor="voucher-code">Mã giảm giá / AI Voucher</label>
        <div className="flex items-center gap-2">
          <input 
            className="flex-1 h-10 px-3 rounded-md bg-gray-50 border border-gray-200 text-gray-900 font-mono text-sm uppercase focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors" 
            id="voucher-code" 
            type="text" 
            placeholder="Nhập mã..."
          />
          <button className="h-10 px-4 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md transition-colors" type="button">
            Áp dụng
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-gray-100"></div>

      {/* Financial Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Tạm tính ({items.length} món):</span>
          <span className="font-mono text-gray-900 font-bold">{formatPrice(total)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Phí vận chuyển:</span>
          <div className="flex items-center gap-1.5 font-mono">
            {total > 0 ? (
              <span className="text-green-700 font-bold">0 đ (Freeship)</span>
            ) : (
              <span>0 đ</span>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-100"></div>

      {/* Total Calculation */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-sm font-bold text-gray-900 uppercase tracking-wider block">Tổng thanh toán</span>
          <span className="text-[11px] text-gray-400 font-semibold">(Đã bao gồm thuế VAT 8%)</span>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-black text-gray-900 leading-none">{formatPrice(total)}</div>
        </div>
      </div>

      {/* Primary CTA Button */}
      <div className="mt-2">
        <button 
          onClick={handlePlaceOrder}
          disabled={loading || items.length === 0}
          className="w-full h-12 bg-gray-900 hover:bg-black text-white text-base font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <span>Đặt hàng &amp; Thanh toán</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
        <div className="text-center text-xs font-medium text-gray-400 mt-3">
          Nhấn "Đặt hàng" đồng nghĩa chấp thuận Điều khoản dịch vụ KADY
        </div>
      </div>

      {/* QR Code Modal for VNPay / Banking */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-center">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">Thanh Toán Đơn Hàng</h3>
              <p className="text-blue-100 text-sm font-medium mt-1">Quét mã QR qua ứng dụng ngân hàng hoặc ví điện tử</p>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              <div className="text-center mb-4">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-widest">Tổng tiền cần thanh toán</p>
                <p className="text-3xl font-black text-gray-900 font-mono mt-1 text-blue-600">{formatPrice(total)}</p>
              </div>
              
              <div className="p-3 bg-white border-2 border-dashed border-blue-200 rounded-xl mb-6 relative">
                {/* Dynamically generated VietQR Code */}
                <img 
                  src={`https://img.vietqr.io/image/970415-113366668888-compact2.jpg?amount=${total}&addInfo=KADY%20${customer_phone}&accountName=KADY%20SPORTS`} 
                  alt="VietQR Code" 
                  className={`w-64 h-64 object-contain transition-opacity duration-300 ${isProcessingPayment ? 'opacity-30 blur-sm' : 'opacity-100'}`}
                />
                
                {isProcessingPayment && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                    <span className="text-sm font-bold text-gray-900 tracking-wider">Đang xác thực...</span>
                  </div>
                )}
              </div>
              
              <div className="w-full space-y-3">
                <button 
                  onClick={simulatePaymentSuccess}
                  disabled={isProcessingPayment}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:shadow-none"
                >
                  <Verified size={20} />
                  <span>Tôi đã thanh toán xong</span>
                </button>
                <button 
                  onClick={() => !isProcessingPayment && setShowQR(false)}
                  disabled={isProcessingPayment}
                  className="w-full py-2 text-gray-500 hover:text-gray-900 font-semibold text-sm disabled:opacity-50"
                >
                  Hủy và chọn phương thức khác
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
