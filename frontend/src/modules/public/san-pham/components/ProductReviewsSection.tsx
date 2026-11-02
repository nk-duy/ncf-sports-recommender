'use client';

import { useProductReviews, ReviewItem } from '../hooks/useProductReviews';
import ReviewsSummaryHeader from './ReviewsSummaryHeader';
import ReviewListItem from './ReviewListItem';
import WriteReviewModal from './WriteReviewModal';

export type { ReviewItem };

interface ProductReviewsSectionProps {
  productId: string;
  rating?: number;
  reviewsCount?: number;
  productName: string;
}

export default function ProductReviewsSection({
  productId,
  productName,
}: ProductReviewsSectionProps) {
  const {
    reviews,
    loading,
    activeFilter,
    setActiveFilter,
    isWriteModalOpen,
    setIsWriteModalOpen,
    newRating,
    setNewRating,
    newComment,
    setNewComment,
    reviewImages,
    handleUploadImage,
    handleRemoveImage,
    isUploadingImage,
    isSubmitting,
    submitSuccess,
    isExpanded,
    setIsExpanded,
    totalCount,
    avgRating,
    starCounts,
    getPercentage,
    filteredReviews,
    handleSubmitReview,
  } = useProductReviews(productId);

  const reviewsWithImagesCount = reviews.filter((r) => r.images && r.images.length > 0).length;
  const visibleReviews = isExpanded ? filteredReviews : filteredReviews.slice(0, 2);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mt-5">
      <ReviewsSummaryHeader
        totalCount={totalCount}
        avgRating={avgRating}
        starCounts={starCounts}
        getPercentage={getPercentage}
        reviewsWithImagesCount={reviewsWithImagesCount}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        onOpenWriteModal={() => setIsWriteModalOpen(true)}
      />

      {/* Danh sách các bài nhận xét thực tế */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="py-12 text-center text-gray-400">Đang tải đánh giá từ người dùng...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-medium">
            {reviews.length === 0
              ? 'Sản phẩm này chưa có đánh giá nào. Hãy là người đầu tiên mua và để lại nhận xét!'
              : 'Không có bài nhận xét nào phù hợp với bộ lọc đã chọn.'}
          </div>
        ) : (
          visibleReviews.map((rev) => <ReviewListItem key={rev.id} review={rev} />)
        )}
      </div>

      {/* Nút Xem thêm / Thu gọn bình luận */}
      {!loading && filteredReviews.length > 2 && (
        <div className="pt-6 border-t border-gray-100 flex justify-center">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold shadow-2xs transition-all cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Thu gọn đánh giá</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </>
            ) : (
              <>
                <span>Xem thêm {filteredReviews.length - 2} đánh giá khác</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {isWriteModalOpen && (
        <WriteReviewModal
          productName={productName}
          submitSuccess={submitSuccess}
          newRating={newRating}
          setNewRating={setNewRating}
          newComment={newComment}
          setNewComment={setNewComment}
          reviewImages={reviewImages}
          isUploadingImage={isUploadingImage}
          isSubmitting={isSubmitting}
          onUploadImage={handleUploadImage}
          onRemoveImage={handleRemoveImage}
          onSubmit={handleSubmitReview}
          onClose={() => setIsWriteModalOpen(false)}
        />
      )}
    </div>
  );
}
