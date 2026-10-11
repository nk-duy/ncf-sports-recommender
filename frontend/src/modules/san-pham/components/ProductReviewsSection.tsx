'use client';

import React, { useState, useEffect } from 'react';

interface ReviewItem {
  id: string;
  user_name: string;
  avatar_url?: string;
  rating: number;
  comment: string;
  timestamp: string;
  size_bought?: string;
  color_bought?: string;
  verified_purchase?: boolean;
  images?: string[];
}

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
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Form viết đánh giá
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/reviews/product/${productId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mappedReviews: ReviewItem[] = data.map((r: any, idx: number) => ({
              id: r.id || r._id || `rev-${idx}`,
              user_name: r.user_name || 'Khách hàng',
              avatar_url: r.avatar_url,
              rating: r.rating || 5,
              comment: r.comment || '',
              timestamp: r.timestamp || new Date().toISOString(),
              verified_purchase: true,
              images: r.images || [],
              size_bought: r.size_bought,
              color_bought: r.color_bought,
            }));
            setReviews(mappedReviews);
          } else {
            setReviews([]);
          }
        } else {
          setReviews([]);
        }
      } catch (err) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/v1/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          product_id: productId,
          rating: newRating,
          comment: newComment,
        }),
      });

      const newReviewObj: ReviewItem = {
        id: 'rev-' + Date.now(),
        user_name: 'Khách hàng (Tôi)',
        rating: newRating,
        comment: newComment,
        timestamp: new Date().toISOString(),
        verified_purchase: true,
      };

      setReviews([newReviewObj, ...reviews]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsWriteModalOpen(false);
        setSubmitSuccess(false);
        setNewComment('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính toán số liệu THỰC TẾ từ danh sách đánh giá trong CSDL
  const totalCount = reviews.length;
  const avgRating = totalCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
    : '0.0';

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const s = Math.min(5, Math.max(1, Math.round(r.rating)));
    starCounts[s] = (starCounts[s] || 0) + 1;
  });

  const getPercentage = (count: number) => {
    if (totalCount === 0) return 0;
    return Math.round((count / totalCount) * 100);
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === '5') return Math.round(r.rating) === 5;
    if (activeFilter === '4') return Math.round(r.rating) === 4;
    if (activeFilter === '3') return Math.round(r.rating) === 3;
    if (activeFilter === '2') return Math.round(r.rating) === 2;
    if (activeFilter === '1') return Math.round(r.rating) === 1;
    if (activeFilter === 'images') return r.images && r.images.length > 0;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-6 mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Đánh giá & Nhận xét sản phẩm
          </h2>
          <p className="text-sm text-gray-500 mt-1">Đánh giá thực tế từ những khách hàng đã mua sản phẩm này</p>
        </div>
        <button
          onClick={() => setIsWriteModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Viết đánh giá
        </button>
      </div>

      {/* Tổng quan Điểm Đánh giá & Thanh sao thực tế */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50/80 p-6 rounded-2xl mb-8">
        {/* Điểm tổng quan */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200/80 pb-6 md:pb-0">
          <span className="text-5xl font-extrabold text-gray-900">{avgRating}</span>
          <div className="flex items-center text-yellow-400 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`w-5 h-5 ${star <= Math.round(Number(avgRating)) ? 'fill-current text-yellow-400' : 'fill-current text-gray-300'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-sm font-medium text-gray-500">{totalCount} đánh giá từ người dùng</p>
        </div>

        {/* Thanh tỷ lệ sao động thực tế từ 1 đến 5 sao */}
        <div className="md:col-span-2 flex flex-col justify-center gap-2">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = starCounts[s] || 0;
            const pct = getPercentage(count);
            return (
              <div key={s} className="flex items-center gap-3 text-sm">
                <span className="w-12 text-gray-600 font-medium">{s} Sao</span>
                <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-yellow-400 h-full rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                </div>
                <span className="w-16 text-right text-gray-500 font-medium">{pct}% ({count})</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bộ lọc bài đánh giá */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: `Tất cả (${reviews.length})` },
          { key: '5', label: `5 Sao (${starCounts[5]})` },
          { key: '4', label: `4 Sao (${starCounts[4]})` },
          { key: '3', label: `3 Sao (${starCounts[3]})` },
          { key: '2', label: `2 Sao (${starCounts[2]})` },
          { key: '1', label: `1 Sao (${starCounts[1]})` },
          { key: 'images', label: `Có hình ảnh (${reviews.filter(r => r.images && r.images.length > 0).length})` },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeFilter === f.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

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
          filteredReviews.map((rev) => {
            const displayName = rev.user_name || 'Khách hàng KADY';
            const avatarChar = displayName.charAt(0).toUpperCase();

            return (
              <div key={rev.id} className="py-6 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 overflow-hidden">
                  {rev.avatar_url ? (
                    <img src={rev.avatar_url} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    avatarChar
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900 text-base">{displayName}</h4>
                      {rev.verified_purchase && (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                          ✓ Đã mua hàng
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(rev.timestamp).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Ngôi sao đánh giá */}
                  <div className="flex items-center text-yellow-400 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? 'fill-current' : 'text-gray-200 fill-current'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {(rev.size_bought || rev.color_bought) && (
                    <p className="text-xs text-gray-400 mb-2">
                      Phân loại: {rev.size_bought ? `Size ${rev.size_bought}` : ''}{' '}
                      {rev.color_bought ? `| ${rev.color_bought}` : ''}
                    </p>
                  )}

                  <p className="text-gray-700 text-sm leading-relaxed mb-3">{rev.comment}</p>

                  {/* Hình ảnh thực tế từ khách hàng */}
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {rev.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Ảnh nhận xét"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal viết đánh giá */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Đánh giá {productName}</h3>

            {submitSuccess ? (
              <div className="py-8 text-center text-green-600 font-semibold">
                ✓ Đánh giá của bạn đã được gửi thành công! Cảm ơn bạn.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bạn chấm sản phẩm này bao nhiêu sao?
                  </label>
                  <div className="flex gap-2 text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <svg
                          className={`w-8 h-8 ${star <= newRating ? 'fill-current' : 'text-gray-300 fill-current'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhận xét chi tiết của bạn
                  </label>
                  <textarea
                    rows={4}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Hãy chia sẻ suy nghĩ của bạn về chất lượng sản phẩm, độ vừa vặn, giao hàng..."
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi nhận xét'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
