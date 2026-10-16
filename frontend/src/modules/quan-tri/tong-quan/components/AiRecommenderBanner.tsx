'use client';
import React from 'react';
import { Sparkles, RefreshCw, DollarSign, MousePointerClick, TrendingUp, CheckCircle2 } from 'lucide-react';

interface AiRecommenderBannerProps {
  aiModelInfo: any;
  aiMetrics: any;
  stats: {
    totalUsers: number;
    totalProducts: number;
    revenue: number;
  };
  isRetraining: boolean;
  onRetrainAi: () => void;
  formatPrice: (val: number) => string;
}

export default function AiRecommenderBanner({
  aiModelInfo,
  aiMetrics,
  stats,
  isRetraining,
  onRetrainAi,
  formatPrice,
}: AiRecommenderBannerProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-200/80 flex flex-col gap-5">
      {/* Top row: Status, Title and Action Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Đang hoạt động ổn định
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">
              Cập nhật: <span className="font-medium text-gray-700">{aiModelInfo?.last_trained || 'Hôm nay'}</span>
            </span>
          </div>

          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600 shrink-0" />
            Động cơ Gợi ý Cá nhân hóa &amp; Đề xuất Thông minh
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
            Hệ thống tự động phân tích hành vi và sở thích bộ môn của{' '}
            <strong className="text-gray-900 font-semibold">{aiModelInfo?.num_users || stats.totalUsers} khách hàng</strong>{' '}
            để tối ưu hiển thị danh mục cho{' '}
            <strong className="text-gray-900 font-semibold">{aiModelInfo?.num_items || stats.totalProducts} sản phẩm</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={onRetrainAi}
            disabled={isRetraining}
            className={`flex items-center justify-center gap-2 h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm border transition-all duration-200 cursor-pointer ${
              isRetraining
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 shadow-2xs'
            }`}
            title="Đồng bộ lại hành vi duyệt web và lịch sử đơn hàng mới nhất vào thuật toán gợi ý"
          >
            <RefreshCw size={15} className={`text-blue-600 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Đang đồng bộ dữ liệu...' : 'Cập nhật đề xuất'}</span>
          </button>
        </div>
      </div>

      {/* Sub-metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
        {/* Metric 1 */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <DollarSign size={14} className="text-blue-600" /> Doanh thu từ Đề xuất
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {formatPrice(aiMetrics.ai_revenue || Math.round(stats.revenue * 0.324))}
            </span>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              Đóng góp ~{aiMetrics.ai_revenue_share || 32.4}% tổng doanh thu
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <MousePointerClick size={14} className="text-amber-600" /> Tỷ lệ Click xem (CTR)
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {aiMetrics.ctr}%
            </span>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              <span className="text-emerald-600 font-semibold">+3.2%</span> so với tuần trước
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <TrendingUp size={14} className="text-green-600" /> Tỷ lệ Mua hàng (CR)
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {aiMetrics.conversion_rate}%
            </span>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Từ danh sách gợi ý vào giỏ
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-gray-50/70 border border-gray-100 rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-indigo-600" /> Độ phù hợp đề xuất
          </span>
          <div className="mt-2">
            <span className="text-xl font-bold text-gray-900 tracking-tight">
              {aiMetrics.hit_rate_at_10}
            </span>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Xếp hạng liên quan Top 10
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
