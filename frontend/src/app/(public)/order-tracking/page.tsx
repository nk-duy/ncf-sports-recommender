'use client';
import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Breadcrumb from '@/shared/components/Breadcrumb';

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');

  const breadcrumbItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Tra cứu đơn hàng" }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/orders/${orderId.trim()}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        setError('Không tìm thấy đơn hàng với mã này. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      setError('Lỗi kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm mt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Kiểm tra trạng thái đơn hàng</h1>
          <p className="text-gray-500 text-center mb-8">Nhập mã đơn hàng của bạn vào bên dưới để tra cứu</p>

          <form onSubmit={handleSearch} className="max-w-lg mx-auto mb-10">
            <div className="relative flex items-center">
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full pl-5 pr-28 py-3.5 rounded-full bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="VD: 60a7c9f..."
                type="text"
              />
              <button 
                disabled={loading}
                type="submit" 
                className="absolute right-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-sm rounded-full transition flex items-center gap-2 shadow-sm"
              >
                {loading ? 'Đang tìm...' : (
                  <>
                    <Search size={16} />
                    <span>Tra cứu</span>
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
          </form>

          {order && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-sm font-bold text-gray-900">Mã đơn hàng: <span className="font-mono text-blue-600">{order._id}</span></h2>
                  <p className="text-xs text-gray-500 mt-1">Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}</p>
                </div>
                <div className={`flex items-center gap-2 ${getStatusDisplay(order.status).color}`}>
                  {getStatusDisplay(order.status).icon}
                  <span className="font-bold text-sm uppercase tracking-wider">{getStatusDisplay(order.status).text}</span>
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
          )}
        </div>
      </div>
    </div>
  );
}
