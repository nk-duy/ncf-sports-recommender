'use client';

import { Package } from 'lucide-react';
import type { OrderItem } from '../types';

interface OrderDetailItemsSectionProps {
  order: OrderItem;
  formatPrice: (price: number) => string;
}

export default function OrderDetailItemsSection({
  order,
  formatPrice,
}: OrderDetailItemsSectionProps) {
  const subtotal =
    order.subtotal && order.subtotal > 0
      ? order.subtotal
      : order.items?.reduce((sum, it) => sum + it.price * (it.quantity || 1), 0) ||
        order.total_amount;
  const shippingFee = order.shipping_fee ?? 0;
  const discountAmount = order.discount_amount ?? 0;
  const voucherCode = order.voucher_code;

  return (
    <>
      {/* Order Items Table */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Package size={16} className="text-gray-600" /> Danh sách Sản phẩm ({order.items?.length || 0})
        </h3>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3 text-center">SL</th>
                <th className="px-4 py-3 text-right">Đơn giá</th>
                <th className="px-4 py-3 text-right">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-900 line-clamp-2">
                      {item.product_name || item.name || 'Sản phẩm'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex gap-3">
                      {item.color && (
                        <span className="flex items-center gap-1">
                          Màu: <span className="font-semibold text-gray-700">{item.color}</span>
                        </span>
                      )}
                      {item.size && (
                        <span className="flex items-center gap-1">
                          Size: <span className="font-semibold text-gray-700">{item.size}</span>
                        </span>
                      )}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatPrice(item.price)}</td>
                  <td className="px-4 py-3 text-right font-bold text-blue-600">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="flex justify-end">
        <div className="w-full sm:w-80 space-y-2.5 text-sm bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <div className="flex justify-between text-gray-600">
            <span>Tiền hàng (tạm tính):</span>
            <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí vận chuyển:</span>
            <span
              className={
                shippingFee > 0 ? 'font-semibold text-gray-900' : 'font-bold text-green-600'
              }
            >
              {shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí (0 ₫)'}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Mã giảm giá {voucherCode ? `(${voucherCode})` : ''}:</span>
              <span className="font-bold">-{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="pt-3 mt-2 border-t border-gray-200 flex justify-between font-black text-base items-baseline">
            <span className="text-gray-900">Tổng thanh toán:</span>
            <span className="text-xl text-blue-600">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
