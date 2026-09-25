'use client';
import React from "react";
import { Plus, MapPin, Banknote, CreditCard } from "lucide-react";
import { useCheckoutStore } from "@/shared/store/checkoutStore";

export default function ShippingPayment() {
  const { 
    customer_name, 
    customer_phone, 
    customer_address, 
    payment_method, 
    setField 
  } = useCheckoutStore();

  return (
    <section className="bg-white p-5 sm:p-7 rounded-lg shadow-sm border border-gray-100 space-y-6 mt-6">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Thông tin nhận hàng &amp; Giao vận</h2>
        <span className="text-xs font-semibold text-gray-400">SportsAI Fast Checkout</span>
      </div>

      {/* Delivery Address Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">Họ và tên *</label>
            <input 
              type="text" 
              value={customer_name}
              onChange={(e) => setField('customer_name', e.target.value)}
              placeholder="Nhập họ và tên..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">Số điện thoại *</label>
            <input 
              type="text" 
              value={customer_phone}
              onChange={(e) => setField('customer_phone', e.target.value)}
              placeholder="Nhập số điện thoại..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <div>
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">Địa chỉ nhận hàng *</label>
          <input 
            type="text" 
            value={customer_address}
            onChange={(e) => setField('customer_address', e.target.value)}
            placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Shipping Method */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
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
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phương thức thanh toán an toàn</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Payment 1: COD */}
          <label className="p-4 rounded-md bg-white border border-gray-100 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input 
                checked={payment_method === 'COD'}
                onChange={() => setField('payment_method', 'COD')}
                className="w-4 h-4 accent-gray-900 cursor-pointer" name="payment-method" type="radio"/>
              <span className="text-sm font-semibold text-gray-900">Thanh toán khi nhận (COD)</span>
            </div>
            <Banknote size={20} className="text-gray-400" />
          </label>

          {/* Payment 2: VNPAY */}
          <label className="p-4 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <input 
                checked={payment_method === 'VNPAY'}
                onChange={() => setField('payment_method', 'VNPAY')}
                className="w-4 h-4 accent-gray-900 cursor-pointer" name="payment-method" type="radio"/>
              <div>
                <span className="text-sm font-bold text-gray-900">VNPAY-QR SportsAI</span>
                <span className="block text-xs font-semibold text-blue-600 mt-0.5">Giảm thêm 20.000 đ</span>
              </div>
            </div>
            <span className="text-sm font-black text-blue-700 italic tracking-tighter">VNPAY</span>
          </label>
        </div>
      </div>
    </section>
  );
}
