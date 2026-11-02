import React from 'react';
import { Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import type { OrderItem } from '../types';

// Tiện ích chuẩn hóa tiếng Việt không dấu để tìm kiếm không dấu lẫn có dấu
export const removeVietnameseTones = (str: string): string => {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

// Helper kiểm tra tìm kiếm thông minh: hỗ trợ cả mã đầy đủ, mã rút gọn #ORD-..., số điện thoại, tên khách (có dấu & không dấu)
export const matchOrderSearch = (order: OrderItem, searchTerm: string): boolean => {
  if (!searchTerm || !searchTerm.trim()) return true;
  const rawTerm = searchTerm.trim().toLowerCase();
  const unaccentedTerm = removeVietnameseTones(rawTerm);

  // Bỏ các tiền tố #, ord-, ord, dh-, dh để lấy phần mã hex cốt lõi
  const cleanTerm = rawTerm
    .replace(/^[#\s]+/, '')
    .replace(/^(ord|dh)[-_\s]*/i, '')
    .trim();

  const customerName = (order.customer_name || '').toLowerCase();
  const unaccentedName = removeVietnameseTones(customerName);
  const matchName = customerName.includes(rawTerm) || unaccentedName.includes(unaccentedTerm);

  const phone = (order.customer_phone || '').replace(/[\s.-]/g, '');
  const cleanPhoneTerm = rawTerm.replace(/[\s.-]/g, '');
  const matchPhone =
    (order.customer_phone || '').includes(rawTerm) ||
    (cleanPhoneTerm.length >= 3 && phone.includes(cleanPhoneTerm));

  const matchTracking = (order.tracking_code || '').toLowerCase().includes(rawTerm);

  const orderId = (order._id || '').toLowerCase();
  const matchId = orderId.includes(rawTerm) || (cleanTerm.length > 0 && orderId.includes(cleanTerm));

  const formattedCode6 = `ord-${orderId.slice(-6)}`;
  const formattedCode5 = `ord-${orderId.slice(-5)}`;
  const formattedCode8 = `ord-${orderId.slice(-8)}`;
  const matchCode =
    formattedCode6.includes(rawTerm) ||
    formattedCode5.includes(rawTerm) ||
    formattedCode8.includes(rawTerm) ||
    `#${formattedCode6}`.includes(rawTerm) ||
    `#${formattedCode5}`.includes(rawTerm) ||
    `#${formattedCode8}`.includes(rawTerm);

  return Boolean(matchName || matchPhone || matchTracking || matchId || matchCode);
};

export const isDeliveredStatus = (status?: string): boolean => {
  const s = (status || '').toLowerCase();
  return s === 'delivered' || s === 'completed';
};

export const matchesDateAndPaymentFilter = (
  order: OrderItem,
  dateFilter: string,
  paymentFilter: string
): boolean => {
  if (dateFilter !== 'all' && order.created_at) {
    const orderDate = new Date(order.created_at);
    const now = new Date();
    if (dateFilter === 'today' && orderDate.toDateString() !== now.toDateString()) return false;
    if (
      dateFilter === 'week' &&
      orderDate < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
    ) {
      return false;
    }
    if (
      dateFilter === 'month' &&
      orderDate < new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    ) {
      return false;
    }
  }

  if (paymentFilter !== 'all') {
    const isPaid = order.payment_status === 'paid';
    if (paymentFilter === 'paid' && !isPaid) return false;
    if (paymentFilter === 'unpaid' && isPaid) return false;
  }

  return true;
};

export const formatOrderPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const formatOrderDate = (dateString?: string): string => {
  if (!dateString) return 'Vừa xong';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'Vừa xong';
  return date.toLocaleDateString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const renderOrderStatusBadge = (status: string): React.ReactNode => {
  switch (status) {
    case 'pending':
      return (
        <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
          <Clock size={12} className="text-amber-500" /> Chờ duyệt
        </span>
      );
    case 'confirmed':
      return (
        <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
          <CheckCircle size={12} className="text-blue-500" /> Đã xác nhận
        </span>
      );
    case 'shipping':
      return (
        <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/60">
          <Truck size={12} className="text-purple-500" /> Đang giao
        </span>
      );
    case 'delivered':
    case 'completed':
      return (
        <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
          <CheckCircle size={12} className="text-emerald-500" /> Đã giao
        </span>
      );
    case 'rejected':
    case 'cancelled':
      return (
        <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60">
          <XCircle size={12} className="text-rose-500" /> Đã hủy
        </span>
      );
    default:
      return (
        <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
          {status}
        </span>
      );
  }
};
