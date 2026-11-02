"use client";

import React from "react";
import { Star, X } from "lucide-react";
import { ReviewingItem } from "./types";

interface OrderReviewModalProps {
  reviewingItem: ReviewingItem | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  reviewRating: number;
  setReviewRating: (rating: number) => void;
  reviewComment: string;
  setReviewComment: (comment: string) => void;
  isSubmittingReview: boolean;
}

export default function OrderReviewModal({
  reviewingItem,
  onClose,
  onSubmit,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  isSubmittingReview,
}: OrderReviewModalProps) {
  if (!reviewingItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Star className="text-amber-500 fill-amber-500" size={20} />
              Đánh giá sản phẩm
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{reviewingItem.productName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Bạn đánh giá chất lượng sản phẩm này thế nào?
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setReviewRating(s)}
                  className="p-1 hover:scale-110 transition-transform focus:outline-none"
                >
                  <Star
                    size={28}
                    className={s <= reviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-amber-600 ml-2">
                {reviewRating === 5 ? "Tuyệt vời (5/5)" :
                 reviewRating === 4 ? "Rất tốt (4/5)" :
                 reviewRating === 3 ? "Bình thường (3/5)" :
                 reviewRating === 2 ? "Chưa hài lòng (2/5)" : "Kém (1/5)"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nhận xét & Trải nghiệm thực tế của bạn <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Chia sẻ về độ ôm chân, độ co giãn, chất vải, độ bền khi tập luyện thể thao..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder-gray-400 resize-none shadow-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmittingReview || !reviewComment.trim()}
              className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors shadow-sm flex items-center gap-2"
            >
              {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
