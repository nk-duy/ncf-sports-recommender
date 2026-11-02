'use client';

import { Package } from 'lucide-react';
import Pagination from '@/shared/components/Pagination';
import ShippingModal from './ShippingModal';
import OrderToolbar from './OrderToolbar';
import OrderMetrics from './OrderMetrics';
import OrderStatusTabs from './OrderStatusTabs';
import OrderCardGrid from './OrderCardGrid';
import OrderTable from './OrderTable';
import OrderDetailModal from './OrderDetailModal';
import RejectOrderModal from './RejectOrderModal';
import { useAdminOrders } from '../hooks/useAdminOrders';
import {
  formatOrderDate,
  formatOrderPrice,
  isDeliveredStatus,
  renderOrderStatusBadge,
} from '../utils/orderHelpers';

export default function AdminOrdersPage() {
  const {
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
  } = useAdminOrders();

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header & Toolbar */}
      <OrderToolbar
        ordersCount={orders.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        paymentFilter={paymentFilter}
        setPaymentFilter={setPaymentFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleExportExcel={handleExportExcel}
        isExporting={isExporting}
      />

      {/* 2. Summary Stats Quick Bar */}
      <OrderMetrics metrics={metrics} />

      {/* 3. Status Filter Tabs */}
      <OrderStatusTabs
        baseFilteredOrders={baseFilteredOrders}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* 4. Main Content Area */}
      {loading ? (
        <div className="text-center py-24 text-gray-500 font-medium animate-pulse bg-white rounded-2xl border border-gray-100">
          <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Đang tải dữ liệu đơn hàng...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-2xs flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-3">
            <Package size={32} className="text-gray-300" />
          </div>
          <p className="font-bold text-gray-800 text-base">Không tìm thấy đơn hàng nào</p>
          <p className="text-xs mt-1 text-gray-400">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc thời gian
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' && (
            <OrderCardGrid
              orders={paginatedOrders}
              isDeliveredStatus={isDeliveredStatus}
              getStatusBadge={renderOrderStatusBadge}
              formatPrice={formatOrderPrice}
              formatDate={formatOrderDate}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
              setSelectedOrder={setSelectedOrder}
              handlePrintInvoice={handlePrintInvoice}
              handleUpdateStatus={handleUpdateStatus}
              handleUpdatePaymentStatus={handleUpdatePaymentStatus}
              setShippingModalOrder={setShippingModalOrder}
              setRejectModalOrder={setRejectModalOrder}
              setSelectedRejectPreset={setSelectedRejectPreset}
              setCustomRejectReason={setCustomRejectReason}
            />
          )}

          {viewMode === 'table' && (
            <OrderTable
              orders={paginatedOrders}
              getStatusBadge={renderOrderStatusBadge}
              formatPrice={formatOrderPrice}
              formatDate={formatOrderDate}
              copyToClipboard={copyToClipboard}
              copiedId={copiedId}
              handleUpdateStatus={handleUpdateStatus}
              handleUpdatePaymentStatus={handleUpdatePaymentStatus}
              setShippingModalOrder={setShippingModalOrder}
              setSelectedOrder={setSelectedOrder}
              handlePrintInvoice={handlePrintInvoice}
            />
          )}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl shadow-2xs border border-gray-100 text-xs">
              <p className="text-gray-500 font-medium">
                Hiển thị{' '}
                <span className="font-bold text-gray-900">
                  {(currentPage - 1) * pageSize + 1}
                </span>{' '}
                -{' '}
                <span className="font-bold text-gray-900">
                  {Math.min(currentPage * pageSize, filteredOrders.length)}
                </span>{' '}
                trên tổng số{' '}
                <span className="font-bold text-gray-900">{filteredOrders.length}</span> đơn hàng
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
        formatPrice={formatOrderPrice}
        formatDate={formatOrderDate}
        getStatusBadge={renderOrderStatusBadge}
        handleUpdatePaymentStatus={handleUpdatePaymentStatus}
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
        isOpen={Boolean(shippingModalOrder)}
        order={shippingModalOrder}
        onClose={() => setShippingModalOrder(null)}
        onConfirm={confirmShippingOrder}
      />
    </div>
  );
}
