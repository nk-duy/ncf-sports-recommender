'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, ChevronDown, Check, Tag, Sparkles, X } from 'lucide-react';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { 
  SHIPPING_OPTIONS, 
  describeVoucher, 
  fetchVoucherByCode, 
  getShippingOption, 
  getVoucherError,
  calcEffectiveShippingFee,
  Voucher,
  API_BASE,
  formatVND,
  findBestVoucher
} from '@/shared/lib/cart';
import { notifications } from '@mantine/notifications';

interface CheckoutOrderItemsProps {
  items: any[];
  total: number;
}

export default function CheckoutOrderItems({ items, total }: CheckoutOrderItemsProps) {
  const { shipping_id, setField, appliedVoucher, setAppliedVoucher } = useCheckoutStore();
  const [isShippingOpen, setIsShippingOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState<Voucher[]>([]);

  const shippingMethod = getShippingOption(shipping_id);
  const effectiveShippingFee = calcEffectiveShippingFee(total, shipping_id);
  const setShippingMethod = (option: { id: string }) => setField('shipping_id', option.id);
  
  const voucherError = appliedVoucher ? getVoucherError(appliedVoucher, total) : null;

  useEffect(() => {
    fetch(`${API_BASE}/vouchers`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Voucher[]) => {
        if (Array.isArray(data)) {
          setAvailableVouchers(data.filter((v) => getVoucherError(v, Number.MAX_SAFE_INTEGER) === null));
        }
      })
      .catch(() => {});
  }, []);

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
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-900">Phương thức vận chuyển:</span>
            <span className="font-bold text-gray-900">{shippingMethod.name}</span>
            {total >= 500000 && effectiveShippingFee === 0 ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 line-through">{formatPrice(shippingMethod.price)}</span>
                <span className="font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded text-xs">
                  Miễn phí vận chuyển
                </span>
              </div>
            ) : total >= 500000 ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-gray-400 line-through">{formatPrice(shippingMethod.price)}</span>
                <span className="text-gray-900 font-bold">({formatPrice(effectiveShippingFee)})</span>
                <span className="text-xs text-green-600 font-medium">(Đã giảm 30k)</span>
              </div>
            ) : (
              <span className="text-gray-600">({formatPrice(shippingMethod.price)})</span>
            )}
          </div>
          <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 uppercase text-xs cursor-pointer">
            Thay Đổi
            <ChevronDown size={16} className={`transition-transform duration-200 ${isShippingOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {isShippingOpen && (
          <div className="mt-4 pt-4 border-t border-dashed border-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SHIPPING_OPTIONS.map(option => {
              const optionEffectiveFee = calcEffectiveShippingFee(total, option.id);
              return (
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
                    {total >= 500000 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="line-through text-xs text-gray-400">{formatPrice(option.price)}</span>
                        <span className="font-bold text-green-600">{optionEffectiveFee === 0 ? '0đ (Miễn phí)' : formatPrice(optionEffectiveFee)}</span>
                      </div>
                    ) : (
                      formatPrice(option.price)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 bg-white px-6 py-4 flex flex-col items-end gap-2 text-sm border-b border-dashed">
        <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-gray-900 font-medium mr-auto sm:mr-0">
            <Ticket size={20} className="text-blue-600" />
            <span>Voucher KADY:</span>
          </div>

          {availableVouchers.length > 0 && (
            <button
              type="button"
              onClick={() => setIsVoucherModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Tag size={14} />
              Chọn hoặc nhập mã ({availableVouchers.length} voucher)
            </button>
          )}

          <div className="flex">
            <input 
              type="text" 
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyVoucher()}
              placeholder="Nhập mã voucher" 
              className="px-3 py-1.5 border border-gray-300 rounded-l-md text-sm focus:outline-none focus:border-blue-500 uppercase w-[180px] sm:w-[220px]"
            />
            <button 
              onClick={handleApplyVoucher}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-r-md text-sm font-medium transition-colors cursor-pointer"
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
            <button onClick={() => setAppliedVoucher(null)} className="text-gray-400 hover:text-red-600 underline cursor-pointer">Bỏ</button>
          </div>
        )}
      </div>

      <div className="px-6 py-4 flex justify-end items-center gap-4 border-t border-gray-100 text-sm">
        <span className="text-gray-500 font-medium">Tổng tiền hàng ({items.length} sản phẩm):</span>
        <span className="text-xl text-gray-900 font-bold">{formatPrice(total)}</span>
      </div>

      {/* Modal / Drawer Chọn Voucher */}
      {isVoucherModalOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsVoucherModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-base">
                <Ticket className="text-blue-600" size={20} />
                <span>Chọn Voucher KADY</span>
              </div>
              <button 
                onClick={() => setIsVoucherModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content List */}
            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {availableVouchers.map((v) => {
                const error = getVoucherError(v, total);
                const isApplied = appliedVoucher?.code === v.code;
                const missing = v.min_order_value ? v.min_order_value - total : 0;

                return (
                  <div
                    key={v.code}
                    className={`rounded-xl border p-4 transition-all flex items-start justify-between gap-3 ${
                      isApplied 
                        ? 'border-green-500 bg-green-50/70 shadow-xs' 
                        : error 
                        ? 'border-gray-200 bg-gray-50 opacity-60' 
                        : 'border-blue-200 bg-blue-50/30 hover:border-blue-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-blue-700 text-sm tracking-wider">{v.code}</span>
                        {isApplied && (
                          <span className="text-[10px] bg-green-600 text-white font-bold px-2 py-0.5 rounded-full">
                            Đang dùng
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{describeVoucher(v)}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {v.min_order_value ? `Đơn tối thiểu ${formatVND(v.min_order_value)}` : 'Không yêu cầu đơn tối thiểu'}
                      </p>
                      {missing > 0 && total > 0 && (
                        <p className="text-xs text-amber-600 font-medium mt-1">
                          Cần mua thêm {formatVND(missing)} để sử dụng
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isApplied || !!error}
                      onClick={() => {
                        setAppliedVoucher(v);
                        setIsVoucherModalOpen(false);
                        notifications.show({
                          title: 'Áp dụng thành công',
                          message: `${v.code}: ${describeVoucher(v)}`,
                          color: 'green'
                        });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                        isApplied 
                          ? 'bg-green-600 text-white cursor-default' 
                          : error 
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-sm shadow-blue-200'
                      }`}
                    >
                      {isApplied ? 'Đã chọn' : 'Áp dụng'}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setIsVoucherModalOpen(false)}
                className="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold rounded-lg transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
