"use client";

import Link from "next/link";
import { Package, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import OrderFilterHeader from "./OrderFilterHeader";
import OrderCard from "./OrderCard";
import OrderDetailModal from "./OrderDetailModal";
import OrderReviewModal from "./OrderReviewModal";
import { useOrdersList } from "../hooks/useOrdersList";

export default function OrdersList() {
  const {
    orders,
    loading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    selectedOrder,
    setSelectedOrder,
    isCancelling,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredOrders,
    totalPages,
    paginatedOrders,
    reviewingItem,
    setReviewingItem,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    isSubmittingReview,
    handleCancelOrder,
    handleSubmitReview,
    handleResetFilter,
  } = useOrdersList();

  return (
    <div className="space-y-6">
      <OrderFilterHeader
        orders={orders}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        onResetFilter={handleResetFilter}
        setCurrentPage={setCurrentPage}
      />

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center">
            <Package className="w-12 h-12 text-blue-500 animate-bounce mb-3" />
            <p className="text-gray-600 font-medium text-sm">Đang tải lịch sử đơn hàng...</p>
          </div>
        ) : paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onSelectOrder={setSelectedOrder}
              onCancelOrder={handleCancelOrder}
              isCancelling={isCancelling}
              onOpenReview={setReviewingItem}
            />
          ))
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center">
            <Package className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Không tìm thấy đơn hàng nào</h3>
            <p className="text-gray-500 text-sm max-w-sm">
              Bạn chưa có đơn hàng nào phù hợp với bộ lọc hiện tại. Hãy tiếp tục khám phá các sản phẩm thể thao chất lượng nhé!
            </p>
            <Link
              href="/san-pham"
              className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              Mua sắm ngay
            </Link>
          </div>
        )}
      </div>

      {filteredOrders.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-2 text-sm text-gray-500">
          <div>
            Hiển thị{" "}
            <span className="font-semibold text-gray-900">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            -{" "}
            <span className="font-semibold text-gray-900">
              {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
            </span>{" "}
            / <span className="font-semibold text-gray-900">{filteredOrders.length}</span> đơn hàng
          </div>
          <div className="flex items-center gap-1 mt-4 sm:mt-0">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md font-semibold text-sm flex items-center justify-center transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onCancelOrder={handleCancelOrder}
        isCancelling={isCancelling}
        onOpenReview={setReviewingItem}
      />

      <OrderReviewModal
        reviewingItem={reviewingItem}
        onClose={() => setReviewingItem(null)}
        onSubmit={handleSubmitReview}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        isSubmittingReview={isSubmittingReview}
      />
    </div>
  );
}
