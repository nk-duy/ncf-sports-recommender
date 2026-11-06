"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, X, CheckCircle2, Calendar, Package, ExternalLink, Image as ImageIcon, MessageSquare } from "lucide-react";
import type { ReviewingItem } from "./types";

export interface SubmittedReviewData {
  id?: string;
  rating: number;
  title?: string;
  comment?: string;
  size_bought?: string;
  color_bought?: string;
  images?: string[];
  timestamp?: string;
  product_name?: string;
  product_id?: string;
  order_id?: string;
}

const SPORTS_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80";

interface ViewReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewData: SubmittedReviewData | null;
  itemData: ReviewingItem | null;
  loading?: boolean;
}

export default function ViewReviewModal({
  isOpen,
  onClose,
  reviewData,
  itemData,
  loading = false,
}: ViewReviewModalProps) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  if (!isOpen) return null;

  const productName = itemData?.productName || reviewData?.product_name || "Sản phẩm KADY Sports";
  const productId = itemData?.productId || reviewData?.product_id;
  const imageUrl = itemData?.imageUrl || SPORTS_FALLBACK_IMG;
  const rating = reviewData?.rating || 5;

  const ratingLabel =
    rating === 5
      ? "Tuyệt vời (5/5)"
      : rating === 4
      ? "Hài lòng (4/5)"
      : rating === 3
      ? "Bình thường (3/5)"
      : rating === 2
      ? "Chưa hài lòng (2/5)"
      : "Rất tệ (1/5)";

  const formattedDate = reviewData?.timestamp
    ? new Date(reviewData.timestamp).toLocaleDateString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Vừa xong";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} />
              Đánh giá của bạn
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Đánh giá thực tế từ trải nghiệm mua hàng tại KADY Sports
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-3">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Đang tải nội dung đánh giá...</p>
            </div>
          ) : (
            <>
              {/* Product Info Card */}
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={imgError ? SPORTS_FALLBACK_IMG : imageUrl}
                    alt={productName}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1 leading-snug">
                    {productName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
                    {(itemData?.size || reviewData?.size_bought) && (
                      <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-medium">
                        Size: {itemData?.size || reviewData?.size_bought}
                      </span>
                    )}
                    {(itemData?.color || reviewData?.color_bought) && (
                      <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-medium">
                        Màu: {itemData?.color || reviewData?.color_bought}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating Stars & Badge */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={
                        star <= rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                  <span className="text-sm font-bold text-amber-900 ml-2">
                    {ratingLabel}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full self-start sm:self-auto">
                  <CheckCircle2 size={12} />
                  Đã mua hàng chính hãng
                </span>
              </div>

              {/* Review Content */}
              <div className="space-y-3">
                {reviewData?.title && (
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                      Tiêu đề đánh giá
                    </span>
                    <h5 className="text-base font-bold text-gray-900 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      {reviewData.title}
                    </h5>
                  </div>
                )}

                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                    Nhận xét chi tiết
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-gray-800 leading-relaxed min-h-[60px] whitespace-pre-wrap">
                    {reviewData?.comment || "Khách hàng không để lại nhận xét văn bản."}
                  </div>
                </div>

                {/* Attached Images */}
                {reviewData?.images && reviewData.images.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                      Hình ảnh thực tế đính kèm ({reviewData.images.length})
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      {reviewData.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImg(img)}
                          className="w-full aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50 hover:opacity-80 transition cursor-zoom-in"
                        >
                          <img
                            src={img}
                            alt={`Ảnh đánh giá ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata timestamp */}
                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    Thời gian: {formattedDate}
                  </span>
                  {(itemData?.orderId || reviewData?.order_id) && (
                    <span className="font-mono">
                      Đơn #{String(itemData?.orderId || reviewData?.order_id).slice(-8).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/70 flex items-center justify-between gap-3">
          {productId ? (
            <Link
              href={`/san-pham/${productId}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-50 transition"
            >
              <span>Xem trang sản phẩm</span>
              <ExternalLink size={14} />
            </Link>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Lightbox zoom for review image */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-transparent">
            <img
              src={selectedImg}
              alt="Ảnh đánh giá phóng to"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedImg(null)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

