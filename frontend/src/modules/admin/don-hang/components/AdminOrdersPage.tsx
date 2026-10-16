'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import ShippingModal from './ShippingModal';
import OrderToolbar from './OrderToolbar';
import OrderMetrics from './OrderMetrics';
import OrderCardGrid from './OrderCardGrid';
import OrderTable from './OrderTable';
import OrderDetailModal from './OrderDetailModal';
import RejectOrderModal from './RejectOrderModal';
import { printOrderInvoice } from '../utils/printInvoiceHelper';
import Pagination from '@/shared/components/Pagination';

// Helper kiểm tra tìm kiếm thông minh: hỗ trợ cả mã đầy đủ, mã rút gọn #ORD-..., số điện thoại, tên khách
const matchOrderSearch = (order: any, searchTerm: string): boolean => {
  if (!searchTerm || !searchTerm.trim()) return true;
  const rawTerm = searchTerm.trim().toLowerCase();
  // Bỏ các tiền tố #, ord-, ord, dh-, dh để lấy phần mã hex cốt lõi
  const cleanTerm = rawTerm.replace(/^[#\s]+/, '').replace(/^(ord|dh)[-_\s]*/i, '').trim();

  const matchName = order.customer_name?.toLowerCase().includes(rawTerm);
  const matchPhone = order.customer_phone?.includes(rawTerm);
  const matchTracking = order.tracking_code?.toLowerCase().includes(rawTerm);
  
  const orderId = (order._id || '').toLowerCase();
  // Khớp theo _id gốc (nguyên chuỗi hoặc đuôi hex sạch)
  const matchId = orderId.includes(rawTerm) || (cleanTerm.length > 0 && orderId.includes(cleanTerm));

  // Khớp theo các format mã hiển thị: ord-xxxxxx, #ord-xxxxxx
  const formattedCode6 = `ord-${orderId.slice(-6)}`;
  const formattedCode5 = `ord-${orderId.slice(-5)}`;
  const formattedCode8 = `ord-${orderId.slice(-8)}`;
  const matchCode = formattedCode6.includes(rawTerm) ||
                    formattedCode5.includes(rawTerm) ||
                    formattedCode8.includes(rawTerm) ||
                    `#${formattedCode6}`.includes(rawTerm) ||
                    `#${formattedCode5}`.includes(rawTerm) ||
                    `#${formattedCode8}`.includes(rawTerm);

  return Boolean(matchName || matchPhone || matchTracking || matchId || matchCode);
};

export default function AdminOrdersPage() {

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Advanced filters & pagination
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 3 columns * 3 rows
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Shipping modal state
  const [shippingModalOrder, setShippingModalOrder] = useState<any | null>(null);

  // Rejection modal state
  const [rejectModalOrder, setRejectModalOrder] = useState<any | null>(null);
  const [selectedRejectPreset, setSelectedRejectPreset] = useState<string>('Hết hàng tồn kho');
  const [customRejectReason, setCustomRejectReason] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, dateFilter, viewMode]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/orders?limit=1000');
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : (data.items || data.orders || data.data || []));
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string, 
    newStatus: string, 
    reason?: string,
    trackingCode?: string,
    carrier?: string
  ) => {
    try {
      const payload: { status: string; rejection_reason?: string; tracking_code?: string; carrier?: string } = { status: newStatus };
      if (reason !== undefined) {
        payload.rejection_reason = reason;
      }
      if (trackingCode !== undefined) {
        payload.tracking_code = trackingCode;
      }
      if (carrier !== undefined) {
        payload.carrier = carrier;
      }

      const res = await fetch(`http://localhost:8000/api/v1/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setOrders(orders.map(o => o._id === id ? { 
          ...o, 
          status: newStatus, 
          rejection_reason: reason !== undefined ? reason : o.rejection_reason,
          tracking_code: trackingCode !== undefined ? trackingCode : o.tracking_code,
          carrier: carrier !== undefined ? carrier : o.carrier
        } : o));

        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ 
            ...selectedOrder, 
            status: newStatus, 
            rejection_reason: reason !== undefined ? reason : selectedOrder.rejection_reason,
            tracking_code: trackingCode !== undefined ? trackingCode : selectedOrder.tracking_code,
            carrier: carrier !== undefined ? carrier : selectedOrder.carrier
          });
        }
      }
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const confirmRejectOrder = () => {
    if (!rejectModalOrder) return;
    const finalReason = selectedRejectPreset === 'Khác' 
      ? customRejectReason.trim() || 'Lý do khác' 
      : `${selectedRejectPreset}${customRejectReason.trim() ? ` (${customRejectReason.trim()})` : ''}`;

    handleUpdateStatus(rejectModalOrder._id, 'rejected', finalReason);
    setRejectModalOrder(null);
  };

  const confirmShippingOrder = async (orderId: string, carrier: string, trackingCode: string) => {
    await handleUpdateStatus(orderId, 'shipping', undefined, trackingCode, carrier);
    setShippingModalOrder(null);
  };

  const isDeliveredStatus = (status?: string) => {
    const s = (status || '').toLowerCase();
    return s === 'delivered' || s === 'completed';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs"><Clock size={13} className="text-amber-500" /> Chờ duyệt</span>;
      case 'confirmed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs"><CheckCircle size={13} className="text-blue-500" /> Đã xác nhận</span>;
      case 'shipping':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"><Truck size={13} className="text-indigo-500" /> Đang giao</span>;
      case 'delivered':
      case 'completed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs"><CheckCircle size={13} className="text-emerald-500" /> Đã giao</span>;
      case 'rejected':
      case 'cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs"><XCircle size={13} className="text-rose-500" /> Đã hủy</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-700 border border-gray-200">{status}</span>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Vừa xong';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Vừa xong';
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handlePrintInvoice = (orderToPrint?: any) => {
    const targetOrder = orderToPrint || selectedOrder;
    if (!targetOrder) return;
    printOrderInvoice(targetOrder);
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // 1. Search filter
      if (!matchOrderSearch(order, searchTerm)) return false;

      // 2. Date filter
      if (dateFilter !== 'all' && order.created_at) {
        const orderDate = new Date(order.created_at);
        const now = new Date();
        if (dateFilter === 'today') {
          if (orderDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === 'week') {
          const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          if (orderDate < sevenDaysAgo) return false;
        } else if (dateFilter === 'month') {
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          if (orderDate < oneMonthAgo) return false;
        }
      }

      // 3. Tab filter
      if (activeTab === 'all') return true;
      if (activeTab === 'delivered') return isDeliveredStatus(order.status);
      return order.status?.toLowerCase() === activeTab;
    });
  }, [orders, activeTab, searchTerm, dateFilter]);

  // Paginated orders
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Quick stats metrics
  const metrics = useMemo(() => {
    let pending = 0;
    let shipping = 0;
    let delivered = 0;
    orders.forEach(o => {
      if (o.status === 'pending') pending++;
      else if (o.status === 'shipping') shipping++;
      else if (isDeliveredStatus(o.status)) delivered++;
    });
    return {
      totalCount: orders.length,
      pendingCount: pending,
      shippingCount: shipping,
      deliveredCount: delivered
    };
  }, [orders]);

  // Export to Excel / CSV
  const handleExportExcel = () => {
    try {
      setIsExporting(true);
      if (!filteredOrders.length) {
        alert("Không có dữ liệu đơn hàng để xuất!");
        return;
      }

      const headers = [
        "Mã Đơn Hàng",
        "Tên Khách Hàng",
        "Số Điện Thoại",
        "Địa Chỉ Giao Hàng",
        "Ngày Đặt",
        "Hình Thức Thanh Toán",
        "Mã Giảm Giá",
        "Giảm Giá (VND)",
        "Phí Vận Chuyển (VND)",
        "Tổng Tiền (VND)",
        "Trạng Thái",
        "Đơn Vị Vận Chuyển",
        "Mã Vận Đơn",
        "Số Lượng Sản Phẩm",
        "Chi Tiết Sản Phẩm"
      ];

      const rows = filteredOrders.map(order => {
        const itemsSummary = (order.items || [])
          .map((item: any) => `${item.product_name || item.name || 'SP'} (x${item.quantity})`)
          .join(" | ");

        let statusText = order.status;
        if (order.status === 'pending') statusText = 'Chờ duyệt';
        else if (order.status === 'confirmed') statusText = 'Đã xác nhận';
        else if (order.status === 'shipping') statusText = 'Đang giao';
        else if (isDeliveredStatus(order.status)) statusText = 'Đã giao';
        else if (order.status === 'rejected') statusText = 'Từ chối / Hủy';

        return [
          `"${order._id || ''}"`,
          `"${(order.customer_name || '').replace(/"/g, '""')}"`,
          `"${order.customer_phone || ''}"`,
          `"${(order.customer_address || '').replace(/"/g, '""')}"`,
          `"${formatDate(order.created_at)}"`,
          `"${order.payment_method || 'COD'}"`,
          `"${order.voucher_code || ''}"`,
          order.discount_amount || 0,
          order.shipping_fee || 0,
          order.total_amount || 0,
          `"${statusText}"`,
          `"${order.carrier || ''}"`,
          `"${order.tracking_code || ''}"`,
          order.items?.length || 0,
          `"${itemsSummary.replace(/"/g, '""')}"`
        ];
      });

      const csvContent = "\uFEFF" + [
        headers.join(","),
        ...rows.map(r => r.join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      link.setAttribute("href", url);
      link.setAttribute("download", `DonHang_KADY_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Lỗi xuất Excel:", e);
      alert("Đã xảy ra lỗi khi tạo file Excel");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Toolbar */}
      <OrderToolbar
        ordersCount={orders.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleExportExcel={handleExportExcel}
        isExporting={isExporting}
      />

      {/* 2. Summary Stats Quick Bar */}
      <OrderMetrics metrics={metrics} />
      
      {/* 3. Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl shadow-2xs border border-gray-100">
        {[
          { id: 'all', label: 'Tất cả', icon: <Package size={14} />, iconColor: 'text-gray-500' },
          { id: 'pending', label: 'Chờ duyệt', icon: <Clock size={14} />, iconColor: 'text-amber-500' },
          { id: 'confirmed', label: 'Đã xác nhận', icon: <CheckCircle size={14} />, iconColor: 'text-blue-600' },
          { id: 'shipping', label: 'Đang giao', icon: <Truck size={14} />, iconColor: 'text-indigo-600' },
          { id: 'delivered', label: 'Đã giao', icon: <CheckCircle size={14} />, iconColor: 'text-emerald-500' },
          { id: 'rejected', label: 'Từ chối / Hủy', icon: <XCircle size={14} />, iconColor: 'text-rose-500' },
        ].map(tab => {
          const count = orders.filter(order => {
            if (!matchOrderSearch(order, searchTerm)) return false;

            if (dateFilter !== 'all' && order.created_at) {
              const orderDate = new Date(order.created_at);
              const now = new Date();
              if (dateFilter === 'today' && orderDate.toDateString() !== now.toDateString()) return false;
              if (dateFilter === 'week' && orderDate < new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)) return false;
              if (dateFilter === 'month' && orderDate < new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())) return false;
            }

            if (tab.id === 'delivered') return isDeliveredStatus(order.status);
            if (tab.id !== 'all' && order.status?.toLowerCase() !== tab.id) return false;

            return true;
          }).length;

          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className={isActive ? 'text-white' : tab.iconColor}>{tab.icon}</span>
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Main Content Area */}
      {loading ? (
        <div className="text-center py-24 text-gray-500 font-medium animate-pulse bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Đang tải dữ liệu đơn hàng...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-2xs flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <Package size={32} className="text-gray-300" />
          </div>
          <p className="font-bold text-gray-800 text-base">Không tìm thấy đơn hàng nào</p>
          <p className="text-xs mt-1 text-gray-400">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc thời gian</p>
        </div>
      ) : (
        <>
          {/* View Mode: Grid View */}
          {viewMode === 'grid' && (
            <OrderCardGrid
              orders={paginatedOrders}
              isDeliveredStatus={isDeliveredStatus}
              getStatusBadge={getStatusBadge}
              formatPrice={formatPrice}
              formatDate={formatDate}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
              setSelectedOrder={setSelectedOrder}
              handlePrintInvoice={handlePrintInvoice}
              handleUpdateStatus={handleUpdateStatus}
              setShippingModalOrder={setShippingModalOrder}
              setRejectModalOrder={setRejectModalOrder}
              setSelectedRejectPreset={setSelectedRejectPreset}
              setCustomRejectReason={setCustomRejectReason}
            />
          )}

          {/* View Mode: Modern Table View */}
          {viewMode === 'table' && (
            <OrderTable
              orders={paginatedOrders}
              getStatusBadge={getStatusBadge}
              formatPrice={formatPrice}
              formatDate={formatDate}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
              handleUpdateStatus={handleUpdateStatus}
              setShippingModalOrder={setShippingModalOrder}
              setSelectedOrder={setSelectedOrder}
              handlePrintInvoice={handlePrintInvoice}
            />
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl shadow-2xs border border-gray-100 text-xs">
              <p className="text-gray-500 font-medium">
                Hiển thị <span className="font-bold text-gray-900">{(currentPage - 1) * pageSize + 1}</span> - <span className="font-bold text-gray-900">{Math.min(currentPage * pageSize, filteredOrders.length)}</span> trên tổng số <span className="font-bold text-gray-900">{filteredOrders.length}</span> đơn hàng
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
                siblingCount={1}
                showEllipsis={totalPages > 6}
              />
            </div>
          )}
        </>
      )}

      {/* 5. Order Details Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        formatPrice={formatPrice}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
        onOpenRejectModal={(order) => {
          setRejectModalOrder(order);
          setSelectedRejectPreset('Hết hàng tồn kho / Tạm ngừng kinh doanh mẫu');
          setCustomRejectReason('');
        }}
        onOpenShippingModal={(order) => setShippingModalOrder(order)}
        onPrintInvoice={handlePrintInvoice}
      />

      {/* 6. Reject Order Reason Modal */}
      <RejectOrderModal
        order={rejectModalOrder}
        onClose={() => setRejectModalOrder(null)}
        selectedRejectPreset={selectedRejectPreset}
        setSelectedRejectPreset={setSelectedRejectPreset}
        customRejectReason={customRejectReason}
        setCustomRejectReason={setCustomRejectReason}
        onConfirmReject={confirmRejectOrder}
      />

      {/* 7. Shipping / Tracking Modal */}
      <ShippingModal
        isOpen={!!shippingModalOrder}
        order={shippingModalOrder}
        onClose={() => setShippingModalOrder(null)}
        onConfirm={confirmShippingOrder}
      />
    </div>
  );
}
