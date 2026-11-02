'use client';

import React from 'react';
import ReviewImageUploader from './ReviewImageUploader';

const POSITIVE_SUGGESTIONS = [
  'Chất liệu thể thao cao cấp, co giãn tốt',
  'Mặc rất êm và thoáng khí, không bị bí',
  'Đúng như mô tả, giao hàng siêu nhanh',
  'Form dáng chuẩn đẹp, đường may chắc chắn',
  'Rất đáng tiền, sẽ ủng hộ KADY tiếp',
];

const CRITICAL_SUGGESTIONS = [
  'Sản phẩm giao hơi chậm so với dự kiến',
  'Chất liệu cần cải thiện độ thoáng khí hơn',
  'Kích cỡ hơi rộng/chật một chút so với bảng size',
  'Đóng gói cần kỹ càng hơn',
];

interface WriteReviewModalProps {
  productName: string;
  submitSuccess: boolean;
  newRating: number;
  setNewRating: (rating: number) => void;
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  reviewImages: string[];
  isUploadingImage: boolean;
  isSubmitting: boolean;
  onUploadImage: (file: File) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function WriteReviewModal({
  productName,
  submitSuccess,
  newRating,
  setNewRating,
  newComment,
  setNewComment,
  reviewImages,
  isUploadingImage,
  isSubmitting,
  onUploadImage,
  onRemoveImage,
  onSubmit,
  onClose,
}: WriteReviewModalProps) {
  const suggestions = newRating >= 4 ? POSITIVE_SUGGESTIONS : CRITICAL_SUGGESTIONS;
  const ratingLabel =
    newRating === 5
      ? 'Tuyệt vời'
      : newRating === 4
      ? 'Hài lòng'
      : newRating === 3
      ? 'Bình thường'
      : newRating === 2
      ? 'Chưa tốt'
      : 'Rất tệ';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 pr-6 leading-snug">
          Đánh giá {productName}
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Chia sẻ cảm nhận thực tế của bạn để giúp cộng đồng thể thao mua sắm dễ dàng hơn
        </p>

        {submitSuccess ? (
          <div className="py-8 text-center text-emerald-600 font-semibold flex flex-col items-center gap-2">
            <span className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl">✓</span>
            <span>Đánh giá của bạn đã được gửi thành công! Cảm ơn bạn.</span>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Chất lượng sản phẩm
              </label>
              <div className="flex items-center gap-3">
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-115 transition-transform cursor-pointer"
                    >
                      <svg
                        className={`w-7 h-7 ${
                          star <= newRating ? 'fill-current text-amber-400' : 'text-slate-200 fill-slate-200'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {ratingLabel}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Gợi ý nội dung (Nhấp để chèn nhanh):
                </label>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!newComment.includes(suggestion)) {
                        setNewComment((prev) => (prev ? `${prev}. ${suggestion}` : suggestion));
                      }
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/60 transition cursor-pointer"
                  >
                    + {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wide">
                Nhận xét chi tiết của bạn <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Hãy chia sẻ suy nghĩ của bạn về chất lượng sản phẩm, độ vừa vặn, thời gian giao hàng..."
                className="w-full border border-slate-200 rounded-xl p-3 text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none placeholder-slate-400"
                required
              />
            </div>

            <ReviewImageUploader
              reviewImages={reviewImages}
              isUploadingImage={isUploadingImage}
              onUploadImage={onUploadImage}
              onRemoveImage={onRemoveImage}
            />

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs md:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="px-5 py-2 text-xs md:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-50 transition cursor-pointer"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi nhận xét'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
