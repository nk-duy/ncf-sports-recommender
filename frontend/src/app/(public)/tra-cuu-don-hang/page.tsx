'use client';
import React, { useState } from 'react';
import Breadcrumb from '@/shared/components/Breadcrumb';
import OrderTrackingForm from '@/modules/tra-cuu-don-hang/components/OrderTrackingForm';
import OrderDetailsCard from '@/modules/tra-cuu-don-hang/components/OrderDetailsCard';

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

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm mt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Kiểm tra trạng thái đơn hàng</h1>
          <p className="text-gray-500 text-center mb-8">Nhập mã đơn hàng của bạn vào bên dưới để tra cứu</p>

          <OrderTrackingForm 
            orderId={orderId}
            setOrderId={setOrderId}
            loading={loading}
            error={error}
            onSearch={handleSearch}
          />

          {order && <OrderDetailsCard order={order} />}
        </div>
      </div>
    </div>
  );
}
