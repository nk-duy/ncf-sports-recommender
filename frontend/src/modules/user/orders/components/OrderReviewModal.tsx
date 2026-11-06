"use client";

import React, { useState } from "react";
import { Star, X, Package, CheckCircle2, Upload, Trash2, Loader2 } from "lucide-react";
import { ReviewingItem } from "./types";

const SPORTS_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80";

const QUICK_TAGS = [
  "Đúng kích cỡ",
  "Chất liệu thoáng mát",
  "Độ hoàn thiện tốt",
  "Giao hàng nhanh",
];

interface OrderReviewModalProps {
  reviewingItem: ReviewingItem | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewTitle?: string;
  setReviewTitle?: (title: string) => void;
  reviewComment: string;
  setReviewComment: (comment: string | ((prev: string) => string)) => void;
  reviewImages?: string[];
  isUploadingImage?: boolean;
  onUploadImage?: (file: File) => void;
  onRemoveImage?: (index: number) => void;
  isSubmittingReview: boolean;
}

export default function OrderReviewModal({
  reviewingItem,
  onClose,
  onSubmit,
  reviewRating = 5,
  setReviewRating,
  reviewTitle = "",
  setReviewTitle,
  reviewComment,
  setReviewComment,
  reviewImages = [],
  isUploadingImage = false,
  onUploadImage,
  onRemoveImage,
  isSubmittingReview,
}: OrderReviewModalProps) {
  const [internalTitle, setInternalTitle] = useState(reviewTitle);
  const [imgError, setImgError] = useState(false);

  if (!reviewingItem) return null;

  const handleTitleChange = (val: string) => {
    setInternalTitle(val);
    if (setReviewTitle) {
      setReviewTitle(val);
    }
  };

  const handleAddTag = (tag: string) => {
    if (typeof setReviewComment === "function") {
      setReviewComment((prev) => {
        if (!prev) return tag;
        if (prev.includes(tag)) return prev;
        return `${prev}. ${tag}`;
      });
    }
  };

  const ratingLabel =
    reviewRating === 5
      ? "Tuyệt vời (5/5)"
      : reviewRating === 4
      ? "Hài lòng (4/5)"
      : reviewRating === 3
      ? "Bình thường (3/5)"
      : reviewRating === 2
      ? "Chưa hài lòng (2/5)"
      : "Rất tệ (1/5)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Star className="text-amber-500 fill-amber-500" size={20} />
              Đánh giá sản phẩm
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Chia sẻ trải nghiệm thực tế để nhận điểm thưởng thành viên KADY
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Product Info Card: Thumbnail + Name + Variant */}
          <div className="flex items-center gap-3 p-3 bg-gray-50/90 rounded-xl border border-gray-100">
            <div className="w-14 h-14 rounded-lg bg-white border border-gray-200 shrink-0 overflow-hidden flex items-center justify-center relative shadow-2xs">
              {reviewingItem.imageUrl && !imgError ? (
                <img
                  src={reviewingItem.imageUrl}
                  alt={reviewingItem.productName}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Package className="w-6 h-6 text-blue-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate" title={reviewingItem.productName}>
                {reviewingItem.productName}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs">
                {reviewingItem.size && (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 font-medium">
                    Size: {reviewingItem.size}
                  </span>
                )}
                {reviewingItem.color && (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 font-medium">
                    Màu: {reviewingItem.color}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-green-50 text-green-700 font-semibold border border-green-200 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-green-600" />
                  Đã mua hàng
                </span>
              </div>
            </div>
          </div>

          {/* Star Rating Section (Default 5 stars) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Chất lượng sản phẩm
            </label>
            <div className="flex items-center gap-3">
              <div className="flex gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setReviewRating(s)}
                    className="p-1 hover:scale-115 transition-transform focus:outline-none cursor-pointer"
                    title={`${s} sao`}
                  >
                    <Star
                      size={26}
                      className={s <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-200 fill-gray-200"}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                {ratingLabel}
              </span>
            </div>
          </div>

          {/* Quick Tags Section */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Chọn nhanh nhận xét:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddTag(tag)}
                  className="text-xs font-medium bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors cursor-pointer"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Review Title Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Tiêu đề đánh giá
            </label>
            <input
              type="text"
              value={setReviewTitle ? reviewTitle : internalTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Tóm tắt cảm nhận (Ví dụ: Rất ưng ý, đúng mô tả...)"
              spellCheck={false}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400 shadow-2xs"
            />
          </div>

          {/* Detailed Comment with spellCheck={false} */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Nhận xét chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              spellCheck={false}
              placeholder="Hãy chia sẻ suy nghĩ của bạn về độ ôm, độ co giãn, chất vải, độ bền khi tập luyện thể thao..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400 resize-none shadow-2xs"
            />
          </div>

          {/* Image Uploader */}
          {onUploadImage && onRemoveImage && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Hình ảnh thực tế ({reviewImages.length}/4)
                </label>
                <span className="text-[10px] text-gray-400">Tối đa 4 ảnh (JPG, PNG)</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {reviewImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 group"
                  >
                    <img
                      src={img}
                      alt={`Ảnh đánh giá ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SPORTS_FALLBACK_IMG;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] transition cursor-pointer"
                      title="Xóa ảnh"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}

                {reviewImages.length < 4 && (
                  <label
                    className={`w-14 h-14 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition ${
                      isUploadingImage ? "opacity-50 pointer-events-none" : ""
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onUploadImage(file);
                        e.target.value = "";
                      }}
                    />
                    {isUploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      <>
                        <Upload size={14} className="text-gray-400" />
                        <span className="text-[9px] font-bold text-gray-500">Thêm ảnh</span>
                      </>
                    )}
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:bg-gray-100 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmittingReview || !reviewComment.trim()}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition shadow-sm shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
            >
              {isSubmittingReview ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <span>Gửi đánh giá</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
