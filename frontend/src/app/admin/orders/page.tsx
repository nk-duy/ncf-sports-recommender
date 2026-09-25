'use client';
import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/orders?limit=100');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
      } else {
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      alert('Lỗi kết nối máy chủ');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200"><Clock size={12} /> Chờ xác nhận</span>;
      case 'shipped': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"><Truck size={12} /> Đang giao</span>;
      case 'delivered': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200"><CheckCircle size={12} /> Hoàn thành</span>;
      default: 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200"><Package size={12} /> {status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Duyệt Đơn hàng</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã Đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Sản phẩm</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Cập nhật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Đang tải dữ liệu...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">Chưa có đơn hàng nào</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500 truncate max-w-[100px]">{order._id}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{order.items.length} món</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{formatPrice(order.total_amount)}</td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-md py-1.5 px-2 focus:outline-none focus:border-blue-500"
                      >
                        <option value="pending">Chờ xác nhận</option>
                        <option value="shipped">Đang giao</option>
                        <option value="delivered">Hoàn thành</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
