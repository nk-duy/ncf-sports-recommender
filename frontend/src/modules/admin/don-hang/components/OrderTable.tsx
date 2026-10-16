'use client';
import React from 'react';
import { Copy, Truck, Eye, Printer } from 'lucide-react';

interface OrderTableProps {
  orders: any[];
  getStatusBadge: (status: string) => React.ReactNode;
  formatPrice: (price: number) => string;
  formatDate: (dateStr: string) => string;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
  handleUpdateStatus: (id: string, status: string) => void;
  setShippingModalOrder: (order: any) => void;
  setSelectedOrder: (order: any) => void;
  handlePrintInvoice: (order: any) => void;
}

export default function OrderTable({
  orders,
  getStatusBadge,
  formatPrice,
  formatDate,
  copyToClipboard,
  copiedId,
  handleUpdateStatus,
  setShippingModalOrder,
  setSelectedOrder,
  handlePrintInvoice,
}: OrderTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-150 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50/90 text-gray-500 font-bold border-b border-gray-150 uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Mã đơn &amp; Ngày đặt</th>
              <th className="py-3 px-4">Khách hàng</th>
              <th className="py-3 px-4">Địa chỉ giao hàng</th>
              <th className="py-3 px-4 text-center">Sản phẩm</th>
              <th className="py-3 px-4 text-right">Tổng thanh toán</th>
              <th className="py-3 px-4">Vận chuyển</th>
              <th className="py-3 px-4 text-center">Trạng thái</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {orders.map((order) => {
              const orderCode = `ORD-${(order._id || '').slice(-6).toUpperCase()}`;

              return (
                <tr key={order._id} className="hover:bg-blue-50/30 transition">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-gray-900">#{orderCode}</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(orderCode, order._id)}
                        className="text-gray-400 hover:text-blue-600 transition"
                        title="Chép mã đơn"
                      >
                        {copiedId === order._id ? (
                          <span className="text-[10px] text-emerald-600 font-bold">Chép!</span>
                        ) : (
                          <Copy size={11} />
                        )}
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{formatDate(order.created_at)}</span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-gray-900">{order.customer_name}</div>
                    <div className="text-gray-500 text-[11px]">{order.customer_phone}</div>
                  </td>

                  <td className="py-3 px-4 max-w-xs truncate" title={order.customer_address}>
                    {order.customer_address}
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap font-bold text-gray-900">
                    {order.items?.length || 0} món
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="font-black text-blue-600">{formatPrice(order.total_amount)}</div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{order.payment_method || 'COD'}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    {order.tracking_code ? (
                      <div className="text-xs">
                        <span className="font-bold text-gray-800">{order.carrier || 'ĐVVC'}: </span>
                        <span className="font-mono text-indigo-700 font-bold">{order.tracking_code}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-[11px]">Chưa tạo mã</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {order.status === 'pending' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-2xs"
                          title="Duyệt đơn ngay"
                        >
                          Duyệt
                        </button>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          type="button"
                          onClick={() => setShippingModalOrder(order)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition shadow-2xs flex items-center gap-1"
                          title="Tạo vận đơn &amp; giao hàng"
                        >
                          <Truck size={12} /> Giao
                        </button>
                      )}

                      {order.status === 'shipping' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(order._id, 'delivered')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition shadow-2xs"
                          title="Xác nhận đã giao"
                        >
                          Đã giao
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-blue-600 rounded-lg transition"
                        title="Xem chi tiết"
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePrintInvoice(order)}
                        className="p-1.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 rounded-lg transition"
                        title="In phiếu giao hàng"
                      >
                        <Printer size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
