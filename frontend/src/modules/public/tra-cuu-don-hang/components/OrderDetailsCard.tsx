import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

interface OrderDetailsCardProps {
  order: any;
}

export default function OrderDetailsCard({ order }: OrderDetailsCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusDisplay = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return { text: 'Chờ xác nhận', color: 'text-amber-600', icon: <Clock size={24} /> };
      case 'shipped': return { text: 'Đang giao hàng', color: 'text-blue-600', icon: <Truck size={24} /> };
      case 'delivered': return { text: 'Đã giao thành công', color: 'text-green-600', icon: <CheckCircle size={24} /> };
      default: return { text: status, color: 'text-gray-600', icon: <Package size={24} /> };
    }
  };

  const statusDisplay = getStatusDisplay(order.status);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Mã đơn hàng: <span className="font-mono text-blue-600">{order._id}</span></h2>
          <p className="text-xs text-gray-500 mt-1">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
        </div>
        <div className={`flex items-center gap-2 ${statusDisplay.color}`}>
          {statusDisplay.icon}
          <span className="font-bold text-sm uppercase tracking-wider">{statusDisplay.text}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Thông tin người nhận</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="text-gray-500 block mb-1">Họ tên:</span>
            <span className="font-medium text-gray-900">{order.customer_name}</span>
          </div>
          <div>
            <span className="text-gray-500 block mb-1">Số điện thoại:</span>
            <span className="font-medium text-gray-900">{order.customer_phone}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-500 block mb-1">Địa chỉ nhận hàng:</span>
            <span className="font-medium text-gray-900">{order.customer_address}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Chi tiết sản phẩm</h3>
        <div className="space-y-4">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">Sản phẩm ID: {item.product_id}</span>
                <span className="text-xs text-gray-500">Số lượng: {item.quantity}</span>
              </div>
              <span className="font-mono font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <span className="font-bold text-gray-900">Tổng cộng (Đã bao gồm phí ship):</span>
          <span className="text-xl font-bold font-mono text-gray-900">{formatPrice(order.total_amount)}</span>
        </div>
      </div>
    </div>
  );
}
