import React from "react";
import { Plus, MapPin, Banknote, CreditCard } from "lucide-react";

export default function ShippingPayment() {
  return (
    <section className="bg-white p-5 sm:p-7 rounded-lg shadow-sm border border-gray-100 space-y-6 mt-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Thông tin nhận hàng &amp; Giao vận</h2>
        <span className="text-xs font-semibold text-gray-400">SportsAI Fast Checkout</span>
      </div>

      {/* Delivery Address Selection */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Địa chỉ giao hàng</label>
        
        <div className="p-4 rounded-md bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <input defaultChecked className="mt-1 w-4 h-4 accent-gray-900 cursor-pointer" id="default-addr" name="delivery-address" type="radio"/>
            <div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-bold text-gray-900 cursor-pointer" htmlFor="default-addr">Nguyễn Khánh Duy</label>
                <span className="font-mono text-xs text-gray-500 font-semibold">0908 123 456</span>
                <span className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-800 text-[10px] font-bold uppercase">Mặc định VIP</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Landmark 81, 720A Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh
              </p>
            </div>
          </div>
          <button className="text-blue-600 text-sm font-bold hover:underline whitespace-nowrap pl-7 sm:pl-0" type="button">
            Thay đổi
          </button>
        </div>

        <div className="p-4 rounded-md bg-white border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-3">
            <input className="w-4 h-4 accent-gray-900 cursor-pointer" id="other-addr" name="delivery-address" type="radio"/>
            <label className="text-sm font-semibold text-gray-900 cursor-pointer" htmlFor="other-addr">Giao đến địa chỉ mới khác</label>
          </div>
          <MapPin size={20} className="text-gray-400" />
        </div>
      </div>

      {/* Shipping Method */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phương thức vận chuyển</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="p-4 rounded-md bg-gray-50 border border-gray-200 flex items-start gap-3 cursor-pointer">
            <input defaultChecked className="mt-1 w-4 h-4 accent-gray-900 cursor-pointer" name="shipping-method" type="radio"/>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Tiêu chuẩn SportsAI</span>
                <span className="font-mono text-sm font-bold text-green-700">0 đ</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Dự kiến nhận hàng trong 2-3 ngày</p>
              <span className="text-[11px] font-bold text-green-700 inline-block mt-2 bg-green-50 px-1.5 py-0.5 rounded">Đã áp dụng Freeship (&gt;500k)</span>
            </div>
          </label>

          <label className="p-4 rounded-md bg-white border border-gray-100 hover:bg-gray-50 transition-colors flex items-start gap-3 cursor-pointer">
            <input className="mt-1 w-4 h-4 accent-gray-900 cursor-pointer" name="shipping-method" type="radio"/>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Hỏa tốc 24H</span>
                <span className="font-mono text-sm font-bold text-gray-900">35.000 đ</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Giao siêu nhanh bằng đối tác ưu tiên</p>
            </div>
          </label>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phương thức thanh toán an toàn</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Payment 1: COD */}
          <label className="p-4 rounded-md bg-white border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input className="w-4 h-4 accent-gray-900 cursor-pointer" name="payment-method" type="radio"/>
              <span className="text-sm font-semibold text-gray-900">Thanh toán khi nhận hàng (COD)</span>
            </div>
            <Banknote size={20} className="text-gray-400" />
          </label>

          {/* Payment 2: VNPAY */}
          <label className="p-4 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input defaultChecked className="w-4 h-4 accent-gray-900 cursor-pointer" name="payment-method" type="radio"/>
              <div>
                <span className="text-sm font-bold text-gray-900">VNPAY-QR SportsAI</span>
                <span className="block text-xs font-semibold text-blue-600 mt-0.5">Giảm thêm 20.000 đ</span>
              </div>
            </div>
            <span className="text-sm font-black text-blue-700 italic tracking-tighter">VNPAY</span>
          </label>

          {/* Payment 3: MoMo */}
          <label className="p-4 rounded-md bg-white border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input className="w-4 h-4 accent-gray-900 cursor-pointer" name="payment-method" type="radio"/>
              <span className="text-sm font-semibold text-gray-900">Ví điện tử MoMo</span>
            </div>
            <span className="text-sm font-black text-pink-600 italic tracking-tighter">MoMo</span>
          </label>

          {/* Payment 4: Card */}
          <label className="p-4 rounded-md bg-white border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input className="w-4 h-4 accent-gray-900 cursor-pointer" name="payment-method" type="radio"/>
              <span className="text-sm font-semibold text-gray-900">Thẻ quốc tế (Visa, Mastercard)</span>
            </div>
            <CreditCard size={20} className="text-gray-400" />
          </label>
        </div>
      </div>
    </section>
  );
}
