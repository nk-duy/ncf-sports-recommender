'use client';

import React, { useState } from 'react';
import { Ticket, ChevronDown, Check } from 'lucide-react';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { SHIPPING_OPTIONS, describeVoucher, fetchVoucherByCode, getShippingOption, getVoucherError } from '@/shared/lib/cart';
import { notifications } from '@mantine/notifications';

interface CheckoutOrderItemsProps {
  items: any[];
  total: number;
}

export default function CheckoutOrderItems({ items, total }: CheckoutOrderItemsProps) {
  const { shipping_id, setField, appliedVoucher, setAppliedVoucher } = useCheckoutStore();
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');

  const shippingMethod = getShippingOption(shipping_id);
  const setShippingMethod = (option: { id: string }) => setField('shipping_id', option.id);
  
  const voucherError = appliedVoucher ? getVoucherError(appliedVoucher, total) : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setAppliedVoucher(null);
      return;
    }

    try {
      const voucher = await fetchVoucherByCode(voucherCode);
      const error = getVoucherError(voucher, total);
      if (error) {
        notifications.show({ title: 'Lỗi', message: error, color: 'red' });
        return;
      }
      setAppliedVoucher(voucher);
      setVoucherCode('');
      notifications.show({ title: 'Thành công', message: `${voucher.code}: ${describeVoucher(voucher)}`, color: 'green' });
    } catch (error: any) {
      notifications.show({ title: 'Lỗi', message: error?.message || 'Lỗi kết nối tới server', color: 'red' });
    }
  };

  return (
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
            {SHIPPING_OPTIONS.map(option => (
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

      <div className="border-t border-gray-100 bg-white px-6 py-4 flex flex-col items-end gap-2 text-sm border-b border-dashed">
        <div className="flex items-center gap-3">
          <Ticket size={20} className="text-blue-600" />
          <span className="font-medium text-gray-900 mr-2">Voucher KADY:</span>
          <div className="flex">
            <input 
              type="text" 
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher()}
              placeholder="Nhập mã voucher" 
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
        {appliedVoucher && (
          <div className={`flex items-center gap-2 text-xs font-medium ${voucherError ? 'text-amber-600' : 'text-green-600'}`}>
            <span>
              {voucherError ? `${appliedVoucher.code}: ${voucherError}` : `Đang áp dụng ${appliedVoucher.code} · ${describeVoucher(appliedVoucher)}`}
            </span>
            <button onClick={() => setAppliedVoucher(null)} className="text-gray-400 hover:text-red-600 underline">Bỏ</button>
          </div>
        )}
      </div>

      <div className="px-6 py-4 flex justify-end items-center gap-4 border-t border-gray-100 text-sm">
        <span className="text-gray-500 font-medium">Tổng số tiền ({items.length} sản phẩm):</span>
        <span className="text-xl text-gray-900 font-bold">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
