'use client';

import { Clock, Sparkles, Truck, Zap } from 'lucide-react';
import { useCheckoutStore } from '@/shared/store/checkoutStore';
import { calcEffectiveShippingFee, formatVND, SHIPPING_OPTIONS } from '@/shared/lib/cart';

interface CheckoutShippingMethodsProps {
  total: number;
}

export default function CheckoutShippingMethods({ total }: CheckoutShippingMethodsProps) {
  const { shipping_id, setField } = useCheckoutStore();
  const isFreeshipEligible = total >= 500000;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Hình thức giao hàng</h2>
            <p className="text-xs text-gray-500">Lựa chọn đơn vị và thời gian nhận hàng mong muốn</p>
          </div>
        </div>

        {isFreeshipEligible && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles size={13} className="text-emerald-600" />
            Đã áp dụng Freeship 30k
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SHIPPING_OPTIONS.map((option) => {
          const isSelected = shipping_id === option.id;
          const effectiveFee = calcEffectiveShippingFee(total, option.id);
          const hasDiscount = isFreeshipEligible && effectiveFee < option.price;

          return (
            <div
              key={option.id}
              onClick={() => setField('shipping_id', option.id)}
              className={`relative p-4 rounded-xl border-2 transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                  : 'border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`font-bold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {option.name}
                    </span>
                  </div>

                  {option.id === 'express' && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-0.5">
                      <Zap size={10} className="fill-amber-600 text-amber-600" />
                      Hỏa tốc
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3 pl-6">
                  <Clock size={13} className="text-gray-400 shrink-0" />
                  <span>
                    Dự kiến: <strong className="tabular-nums">{option.eta}</strong>
                  </span>
                </div>
              </div>

              <div className="pl-6 pt-2 border-t border-gray-100 flex items-baseline justify-between">
                <span className="text-xs text-gray-500">Cước phí:</span>
                <div className="text-right">
                  {hasDiscount ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-gray-400 line-through tabular-nums">
                        {formatVND(option.price)}
                      </span>
                      <span className="text-sm font-extrabold text-emerald-600 tabular-nums">
                        {effectiveFee === 0 ? 'Miễn phí' : formatVND(effectiveFee)}
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`text-sm font-extrabold tabular-nums ${
                        isSelected ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {formatVND(option.price)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
