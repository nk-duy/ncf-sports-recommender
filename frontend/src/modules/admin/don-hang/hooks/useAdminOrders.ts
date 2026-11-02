'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { getAuthHeaders } from '@/shared/lib/authHeader';
import type { OrderItem, OrderMetricsData, OrderViewMode } from '../types';
import { printOrderInvoice } from '../utils/printInvoiceHelper';
import {
  isDeliveredStatus,
  matchesDateAndPaymentFilter,
  matchOrderSearch,
} from '../utils/orderHelpers';
import { exportOrdersToCsv } from '../utils/exportOrdersCsv';

export function useAdminOrders() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTabState] = useState<string>('all');
  const [searchTerm, setSearchTermState] = useState('');

  // Advanced filters & pagination
  const [dateFilter, setDateFilterState] = useState('all');
  const [paymentFilter, setPaymentFilterState] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 3 columns * 3 rows
  const [viewMode, setViewModeState] = useState<OrderViewMode>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [shippingModalOrder, setShippingModalOrder] = useState<OrderItem | null>(null);
  const [rejectModalOrder, setRejectModalOrder] = useState<OrderItem | null>(null);
  const [selectedRejectPreset, setSelectedRejectPreset] = useState<string>('Hết hàng tồn kho');
  const [customRejectReason, setCustomRejectReason] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    setCurrentPage(1);
  };

  const setSearchTerm = (term: string) => {
    setSearchTermState(term);
    setCurrentPage(1);
  };

  const setDateFilter = (filter: string) => {
    setDateFilterState(filter);
    setCurrentPage(1);
  };

  const setPaymentFilter = (filter: string) => {
    setPaymentFilterState(filter);
    setCurrentPage(1);
  };

  const setViewMode = (mode: OrderViewMode) => {
    setViewModeState(mode);
    setCurrentPage(1);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/orders?limit=1000', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : data.items || data.orders || data.data || []);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: string,
    reason?: string,
    trackingCode?: string,
    carrier?: string
  ) => {
    try {
      const payload: {
        status: string;
        rejection_reason?: string;
        tracking_code?: string;
        carrier?: string;
      } = { status: newStatus };
      if (reason !== undefined) payload.rejection_reason = reason;
      if (trackingCode !== undefined) payload.tracking_code = trackingCode;
      if (carrier !== undefined) payload.carrier = carrier;

      const res = await fetch(`http://localhost:8000/api/v1/orders/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const updated = await res.json().catch(() => null);
        const newPaymentStatus =
          updated?.payment_status || (newStatus === 'delivered' ? 'paid' : undefined);
        const newPaidAt = updated?.paid_at;
        const targetOrder = orders.find((o) => o._id === id);
        const orderCode = `ORD-${(targetOrder?._id || id).slice(-6).toUpperCase()}`;

        let statusLabel = newStatus;
        if (newStatus === 'confirmed') statusLabel = 'Đã xác nhận';
        else if (newStatus === 'shipping') statusLabel = 'Đang giao hàng';
        else if (newStatus === 'delivered') statusLabel = 'Đã giao thành công';
        else if (newStatus === 'rejected') statusLabel = 'Đã từ chối đơn hàng';

        notifications.show({
          title: 'Cập nhật thành công',
          message: `Đơn hàng #${orderCode} đã chuyển sang "${statusLabel}".`,
          color: newStatus === 'rejected' ? 'red' : 'green',
        });

        setOrders((prev) =>
          prev.map((o) =>
            o._id === id
              ? {
                  ...o,
                  status: newStatus,
                  payment_status: newPaymentStatus !== undefined ? newPaymentStatus : o.payment_status,
                  paid_at: newPaidAt !== undefined ? newPaidAt : o.paid_at,
                  rejection_reason: reason !== undefined ? reason : o.rejection_reason,
                  tracking_code: trackingCode !== undefined ? trackingCode : o.tracking_code,
                  carrier: carrier !== undefined ? carrier : o.carrier,
                }
              : o
          )
        );

        setSelectedOrder((prev) =>
          prev && prev._id === id
            ? {
                ...prev,
                status: newStatus,
                payment_status: newPaymentStatus !== undefined ? newPaymentStatus : prev.payment_status,
                paid_at: newPaidAt !== undefined ? newPaidAt : prev.paid_at,
                rejection_reason: reason !== undefined ? reason : prev.rejection_reason,
                tracking_code: trackingCode !== undefined ? trackingCode : prev.tracking_code,
                carrier: carrier !== undefined ? carrier : prev.carrier,
              }
            : prev
        );
      } else {
        notifications.show({
          title: 'Thao tác thất bại',
          message: 'Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại!',
          color: 'red',
        });
      }
    } catch {
      notifications.show({
        title: 'Lỗi kết nối',
        message: 'Lỗi kết nối máy chủ khi cập nhật trạng thái đơn hàng.',
        color: 'red',
      });
    }
  };

  const handleUpdatePaymentStatus = async (id: string, newPaymentStatus: string) => {
    try {
      const targetOrder = orders.find((o) => o._id === id);
      const orderCode = `ORD-${(targetOrder?._id || id).slice(-6).toUpperCase()}`;

      const res = await fetch(`http://localhost:8000/api/v1/orders/${id}/payment-status`, {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ payment_status: newPaymentStatus }),
      });
      if (res.ok) {
        const updated = await res.json().catch(() => null);
        const resolvedStatus = updated?.payment_status || newPaymentStatus;
        const resolvedPaidAt =
          updated?.paid_at || (newPaymentStatus === 'paid' ? new Date().toISOString() : null);

        setOrders((prev) =>
          prev.map((o) =>
            o._id === id ? { ...o, payment_status: resolvedStatus, paid_at: resolvedPaidAt } : o
          )
        );

        setSelectedOrder((prev) =>
          prev && prev._id === id
            ? { ...prev, payment_status: resolvedStatus, paid_at: resolvedPaidAt }
            : prev
        );

        if (resolvedStatus === 'paid') {
          notifications.show({
            title: 'Thu tiền thành công',
            message: `Đơn hàng #${orderCode} đã ghi nhận: Đã thanh toán!`,
            color: 'teal',
          });
        } else {
          notifications.show({
            title: 'Đã đổi trạng thái',
            message: `Đơn hàng #${orderCode} đã chuyển về: Chưa thu tiền.`,
            color: 'orange',
          });
        }
      } else {
        notifications.show({
          title: 'Cập nhật thất bại',
          message: 'Không thể cập nhật trạng thái thanh toán trên máy chủ.',
          color: 'red',
        });
      }
    } catch {
      notifications.show({
        title: 'Lỗi kết nối',
        message: 'Lỗi kết nối máy chủ khi cập nhật thanh toán.',
        color: 'red',
      });
    }
  };

  const confirmRejectOrder = () => {
    if (!rejectModalOrder) return;
    const finalReason =
      selectedRejectPreset === 'Khác'
        ? customRejectReason.trim() || 'Lý do khác'
        : `${selectedRejectPreset}${customRejectReason.trim() ? ` (${customRejectReason.trim()})` : ''}`;

    handleUpdateStatus(rejectModalOrder._id, 'rejected', finalReason);
    setRejectModalOrder(null);
  };

  const confirmShippingOrder = async (orderId: string, carrier: string, trackingCode: string) => {
    await handleUpdateStatus(orderId, 'shipping', undefined, trackingCode, carrier);
    setShippingModalOrder(null);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notifications.show({
      title: 'Đã sao chép',
      message: `Đã lưu "${text}" vào bộ nhớ tạm.`,
      color: 'blue',
      autoClose: 2000,
    });
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handlePrintInvoice = (orderToPrint?: OrderItem) => {
    const targetOrder = orderToPrint || selectedOrder;
    if (!targetOrder) return;
    printOrderInvoice(targetOrder);
  };

  const baseFilteredOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        matchOrderSearch(order, searchTerm) &&
        matchesDateAndPaymentFilter(order, dateFilter, paymentFilter)
    );
  }, [orders, searchTerm, dateFilter, paymentFilter]);

  const filteredOrders = useMemo(() => {
    return baseFilteredOrders.filter((order) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'delivered') return isDeliveredStatus(order.status);
      return order.status?.toLowerCase() === activeTab;
    });
  }, [baseFilteredOrders, activeTab]);

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  const metrics: OrderMetricsData = useMemo(() => {
    let pending = 0;
    let shipping = 0;
    let delivered = 0;
    orders.forEach((o) => {
      if (o.status === 'pending') pending++;
      else if (o.status === 'shipping') shipping++;
      else if (isDeliveredStatus(o.status)) delivered++;
    });
    return {
      totalCount: orders.length,
      pendingCount: pending,
      shippingCount: shipping,
      deliveredCount: delivered,
    };
  }, [orders]);

  const handleExportExcel = () => {
    try {
      setIsExporting(true);
      exportOrdersToCsv(filteredOrders);
    } catch {
      notifications.show({
        title: 'Lỗi xuất file',
        message: 'Đã xảy ra lỗi khi tạo file Excel',
        color: 'red',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    orders,
    loading,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    paymentFilter,
    setPaymentFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    viewMode,
    setViewMode,
    copiedId,
    selectedOrder,
    setSelectedOrder,
    shippingModalOrder,
    setShippingModalOrder,
    rejectModalOrder,
    setRejectModalOrder,
    selectedRejectPreset,
    setSelectedRejectPreset,
    customRejectReason,
    setCustomRejectReason,
    isExporting,
    baseFilteredOrders,
    filteredOrders,
    paginatedOrders,
    totalPages,
    metrics,
    handleUpdateStatus,
    handleUpdatePaymentStatus,
    confirmRejectOrder,
    confirmShippingOrder,
    copyToClipboard,
    handlePrintInvoice,
    handleExportExcel,
  };
}
