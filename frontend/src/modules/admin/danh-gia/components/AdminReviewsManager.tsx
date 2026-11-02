'use client';

import {
  EyeOff,
  MessageSquare,
  AlertTriangle,
  RefreshCcw,
  ThumbsUp,
} from 'lucide-react';
import { useAdminReviews } from '../hooks/useAdminReviews';
import ReviewsFilterBar from './ReviewsFilterBar';
import ReviewsTable from './ReviewsTable';
import ReviewImageModal from './ReviewImageModal';

export default function AdminReviewsManager() {
  const {
    reviews,
    total,
    page,
    pages,
    loading,
    search,
    setSearch,
    starFilter,
    setStarFilter,
    hiddenFilter,
    setHiddenFilter,
    previewImages,
    setPreviewImages,
    deletingId,
    setDeletingId,
    actionLoadingId,
    metrics,
    refreshReviews,
    handlePageChange,
    handleToggleVisibility,
    handleDeleteReview,
  } = useAdminReviews();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="text-blue-600" size={26} />
            Quản lý Đánh giá &amp; Nhận xét
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm duyệt phản hồi khách hàng, xác minh mua hàng và đồng bộ điểm xếp hạng sản phẩm
          </p>
        </div>

        <button
          onClick={refreshReviews}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs self-start sm:self-auto"
        >
          <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Tổng đánh giá
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tabular-nums">{total}</span>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
              Toàn hệ thống
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Đánh giá tích cực (4-5★)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 tabular-nums">{metrics.positiveCount}</span>
            <ThumbsUp size={16} className="text-emerald-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Cần chú ý (1-2★)
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-600 tabular-nums">{metrics.negativeCount}</span>
            <AlertTriangle size={16} className="text-amber-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Đã ẩn / Vi phạm
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600 tabular-nums">{metrics.hiddenCount}</span>
            <EyeOff size={16} className="text-rose-500" />
          </div>
        </div>
      </div>

      <ReviewsFilterBar
        search={search}
        onSearchChange={setSearch}
        hiddenFilter={hiddenFilter}
        onHiddenFilterChange={setHiddenFilter}
        starFilter={starFilter}
        onStarFilterChange={setStarFilter}
      />

      <ReviewsTable
        reviews={reviews}
        loading={loading}
        page={page}
        pages={pages}
        total={total}
        actionLoadingId={actionLoadingId}
        onPageChange={handlePageChange}
        onToggleVisibility={handleToggleVisibility}
        onRequestDelete={setDeletingId}
        onPreviewImages={setPreviewImages}
      />

      <ReviewImageModal
        previewImages={previewImages}
        onClosePreview={() => setPreviewImages(null)}
        deletingId={deletingId}
        onCancelDelete={() => setDeletingId(null)}
        onConfirmDelete={handleDeleteReview}
      />
    </div>
  );
}
