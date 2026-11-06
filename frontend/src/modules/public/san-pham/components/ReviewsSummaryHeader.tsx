'use client';

interface ReviewsSummaryHeaderProps {
  totalCount: number;
  avgRating: string;
  starCounts: Record<number, number>;
  getPercentage: (count: number) => number;
  reviewsWithImagesCount: number;
  activeFilter: string;
  onSelectFilter: (key: string) => void;
  onOpenWriteModal?: () => void;
}

export default function ReviewsSummaryHeader({
  totalCount,
  avgRating,
  starCounts,
  getPercentage,
  reviewsWithImagesCount,
  activeFilter,
  onSelectFilter,
}: ReviewsSummaryHeaderProps) {
  const filters = [
    { key: 'all', label: `Tất cả (${totalCount})` },
    { key: '5', label: `5 Sao (${starCounts[5]})` },
    { key: '4', label: `4 Sao (${starCounts[4]})` },
    { key: '3', label: `3 Sao (${starCounts[3]})` },
    { key: '2', label: `2 Sao (${starCounts[2]})` },
    { key: '1', label: `1 Sao (${starCounts[1]})` },
    { key: 'images', label: `Có hình ảnh (${reviewsWithImagesCount})` },
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-4 gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Đánh giá &amp; Nhận xét sản phẩm
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Đánh giá thực tế từ những khách hàng đã mua sản phẩm này
          </p>
        </div>
      </div>

      {/* Tổng quan Điểm Đánh giá & Thanh sao thực tế */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/80 p-4 rounded-xl mb-5">
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200/80 pb-3 md:pb-0">
          <span className="text-4xl font-extrabold text-gray-900">{avgRating}</span>
          <div className="flex items-center text-yellow-400 my-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(Number(avgRating)) ? 'fill-current text-yellow-400' : 'fill-current text-gray-300'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-xs font-medium text-gray-500">{totalCount} đánh giá từ người dùng</p>
        </div>

        <div className="md:col-span-2 flex flex-col justify-center gap-1.5">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = starCounts[s] || 0;
            const pct = getPercentage(count);
            return (
              <div key={s} className="flex items-center gap-2.5 text-xs">
                <span className="w-10 text-gray-600 font-medium">{s} Sao</span>
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-14 text-right text-gray-500 font-medium">
                  {pct}% ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bộ lọc bài đánh giá */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => onSelectFilter(f.key)}
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
    </>
  );
}
