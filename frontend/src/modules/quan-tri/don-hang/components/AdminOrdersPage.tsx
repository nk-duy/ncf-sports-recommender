'use client';
import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

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
      case 'confirmed': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200"><CheckCircle size={12} /> Đã xác nhận</span>;
      case 'rejected': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200"><XCircle size={12} /> Từ chối</span>;
      case 'delivered': 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200"><Truck size={12} /> Đã giao</span>;
      default: 
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-50 text-gray-700 text-xs font-bold border border-gray-200"><Package size={12} /> {status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Duyệt Đơn hàng</h1>
      
      <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
        {[
          { id: 'all', label: 'Tất cả', icon: <Package size={14} />, iconColor: 'text-gray-500' },
          { id: 'pending', label: 'Chờ duyệt', icon: <Clock size={14} />, iconColor: 'text-amber-500' },
          { id: 'confirmed', label: 'Đã xác nhận', icon: <CheckCircle size={14} />, iconColor: 'text-brand-blue' },
          { id: 'delivered', label: 'Đã giao', icon: <Truck size={14} />, iconColor: 'text-green-500' },
          { id: 'rejected', label: 'Từ chối', icon: <XCircle size={14} />, iconColor: 'text-red-500' },
        ].map(tab => {
          const count = tab.id === 'all' ? orders.length : orders.filter(o => o.status === tab.id).length;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-2 ${
                isActive ? 'bg-brand-blue text-white shadow-sm' : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={isActive ? 'text-white' : tab.iconColor}>{tab.icon}</span>
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Đang tải dữ liệu...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Chưa có đơn hàng nào</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {(activeTab === 'all' ? orders : orders.filter(o => o.status === activeTab)).map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                      {order.customer_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{order.customer_name}</h3>
                      <p className="text-xs text-gray-500">{order.customer_phone}</p>
                    </div>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="space-y-1 mb-4">
                  <p className="text-sm font-mono text-gray-500 text-xs truncate">Mã đơn: {order._id}</p>
                  <p className="text-sm text-gray-600 line-clamp-2"><span className="font-semibold text-gray-700">Giao đến:</span> {order.customer_address}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Sản phẩm</p>
                    <p className="font-bold text-gray-900">{order.items.length} món</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Tổng tiền</p>
                    <p className="font-bold text-blue-600">{formatPrice(order.total_amount)}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50/50 mt-auto">
                <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Cập nhật nhanh</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(order._id, 'pending')}
                    className={`text-[11px] py-2 px-2 rounded-lg font-bold transition-all border ${order.status === 'pending' ? 'bg-amber-500 text-white border-amber-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600'}`}
                  >
                    Chờ duyệt
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                    className={`text-[11px] py-2 px-2 rounded-lg font-bold transition-all border ${order.status === 'confirmed' ? 'bg-blue-500 text-white border-blue-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}
                  >
                    Đã xác nhận
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(order._id, 'rejected')}
                    className={`text-[11px] py-2 px-2 rounded-lg font-bold transition-all border ${order.status === 'rejected' ? 'bg-red-500 text-white border-red-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600'}`}
                  >
                    Từ chối
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(order._id, 'delivered')}
                    className={`text-[11px] py-2 px-2 rounded-lg font-bold transition-all border ${order.status === 'delivered' ? 'bg-green-500 text-white border-green-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600'}`}
                  >
                    Đã giao
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
