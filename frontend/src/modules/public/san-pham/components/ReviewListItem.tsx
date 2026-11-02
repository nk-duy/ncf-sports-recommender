'use client';

import type { ReviewItem } from '../hooks/useProductReviews';

const FALLBACK_AVATAR_URL =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
const FALLBACK_REVIEW_IMG =
  'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80';

interface ReviewListItemProps {
  review: ReviewItem;
}

export default function ReviewListItem({ review }: ReviewListItemProps) {
  const displayName = review.user_name || 'Khách hàng KADY';
  const avatarChar = displayName.charAt(0).toUpperCase();

  return (
    <div className="py-6 flex gap-4">
      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 overflow-hidden">
        {review.avatar_url ? (
          <img
            src={review.avatar_url}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_AVATAR_URL;
            }}
          />
        ) : (
          avatarChar
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-gray-900 text-base">{displayName}</h4>
            {review.verified_purchase && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                ✓ Đã mua hàng
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400">
            {new Date(review.timestamp).toLocaleDateString('vi-VN')}
          </span>
        </div>

        {/* Ngôi sao đánh giá */}
        <div className="flex items-center text-yellow-400 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-current'}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {(review.size_bought || review.color_bought) && (
          <p className="text-xs text-gray-400 mb-2">
            Phân loại: {review.size_bought ? `Size ${review.size_bought}` : ''}{' '}
            {review.color_bought ? `| ${review.color_bought}` : ''}
          </p>
        )}

        <p className="text-gray-700 text-sm leading-relaxed mb-3">{review.comment}</p>

        {/* Hình ảnh thực tế từ khách hàng */}
        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mt-2">
            {review.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Ảnh nhận xét"
                className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_REVIEW_IMG;
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
