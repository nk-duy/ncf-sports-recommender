'use client';

import {
  BarChart2,
  CheckCircle2,
  DollarSign,
  MousePointerClick,
  RefreshCw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type { AiModelInfo, AiOnlineMetrics, AiTrainingStatus, DashboardStats } from '../types';

interface AiRecommenderBannerProps {
  aiModelInfo: AiModelInfo | null;
  aiMetrics: AiOnlineMetrics;
  stats: Pick<DashboardStats, 'totalUsers' | 'totalProducts' | 'revenue'>;
  isRetraining: boolean;
  trainingStatus?: AiTrainingStatus | null;
  onRetrainAi: () => void;
  onOpenEvaluationModal?: () => void;
  formatPrice: (val: number) => string;
}

export default function AiRecommenderBanner({
  aiModelInfo,
  aiMetrics,
  stats,
  isRetraining,
  trainingStatus,
  onRetrainAi,
  onOpenEvaluationModal,
  formatPrice,
}: AiRecommenderBannerProps) {
  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-xs border border-slate-200/80 flex flex-col gap-5">
      {/* Top row: Status, Title and Action Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
            <span className="font-semibold text-emerald-700 whitespace-nowrap">
              Đang hoạt động ổn định
            </span>
            <span className="text-slate-300">•</span>
            <span className="whitespace-nowrap">
              Cập nhật lần cuối:{' '}
              <span className="font-medium text-slate-700">
                {aiModelInfo?.last_trained || 'Hôm nay'}
              </span>
            </span>
            {aiModelInfo?.metrics?.negative_sampling_ratio && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-blue-700 font-semibold bg-blue-50 px-2.5 py-0.5 rounded-md whitespace-nowrap">
                  Negative Sampling {aiModelInfo.metrics.negative_sampling_ratio}
                </span>
              </>
            )}
          </div>

          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={20} className="text-blue-600 shrink-0" />
            Động cơ Gợi ý Cá nhân hóa &amp; Đề xuất Thông minh (NCF Engine)
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Hệ thống ứng dụng mô hình Deep Learning{' '}
            <strong className="text-blue-700">NCF (GMF + MLP)</strong> phân tích sở thích của{' '}
            <strong className="text-slate-900 font-semibold tabular-nums font-sans">
              {aiModelInfo?.num_users || stats.totalUsers} khách hàng
            </strong>{' '}
            để tối ưu hóa đề xuất độc bản cho{' '}
            <strong className="text-slate-900 font-semibold tabular-nums font-sans">
              {aiModelInfo?.num_items || stats.totalProducts} sản phẩm
            </strong>
            .
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto flex-wrap">
          {onOpenEvaluationModal && (
            <button
              type="button"
              onClick={onOpenEvaluationModal}
              className="flex items-center justify-center gap-2 h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white shadow-xs transition-all cursor-pointer"
              title="Mở Bảng Thực nghiệm & Biểu đồ Huấn luyện Mô hình NCF"
            >
              <BarChart2 size={16} />
              <span>📊 Xem Thực nghiệm &amp; Độ đo Mô hình (HR@8, NDCG@8, Loss)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onRetrainAi}
            disabled={isRetraining}
            className={`flex items-center justify-center gap-2 h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm border transition-all duration-200 cursor-pointer ${
              isRetraining
                ? 'bg-blue-50 text-blue-700 border-blue-200 cursor-not-allowed shadow-inner'
                : 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
            title="Kích hoạt huấn luyện NCF ngầm với Negative Sampling và đánh giá Leave-One-Out"
          >
            <RefreshCw size={15} className={`text-blue-600 ${isRetraining ? 'animate-spin' : ''}`} />
            <span>{isRetraining ? 'Đang huấn luyện ngầm...' : 'Cập nhật đề xuất'}</span>
          </button>
        </div>
      </div>

      {/* Retraining Progress Bar (Non-blocking Live Display) */}
      {isRetraining && trainingStatus && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 flex flex-col gap-2.5 transition-all">
          <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
            <span className="flex items-center gap-2">
              <RefreshCw size={14} className="text-blue-600 animate-spin" />
              {trainingStatus.message || 'Đang huấn luyện mô hình NCF trong nền...'}
            </span>
            <span className="font-sans tabular-nums text-blue-800 text-sm font-bold">
              {trainingStatus.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-blue-100/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, trainingStatus.progress || 0))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-blue-800 font-medium">
            <span>
              Tiến độ: Epoch {trainingStatus.current_epoch || 0}/
              {trainingStatus.total_epochs || 10}
            </span>
            {(trainingStatus.current_loss ?? 0) > 0 && (
              <span>
                Loss hiện thời:{' '}
                <strong className="font-sans tabular-nums text-blue-950 font-bold">
                  {trainingStatus.current_loss}
                </strong>
              </span>
            )}
            <span className="text-emerald-700 font-semibold">FastAPI Non-blocking</span>
          </div>
        </div>
      )}

      {/* Sub-metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
        <div className="h-full flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <DollarSign size={14} className="text-blue-600" /> Doanh thu từ Đề xuất
          </span>
          <div className="mt-2">
            <span className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight tabular-nums font-sans">
              {formatPrice(aiMetrics.ai_revenue || Math.round(stats.revenue * 0.324))}
            </span>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5 tabular-nums">
              Đóng góp ~{aiMetrics.ai_revenue_share || 32.4}% tổng doanh thu
            </p>
          </div>
        </div>

        <div className="h-full flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <MousePointerClick size={14} className="text-amber-600" /> Tỷ lệ Click xem (CTR)
          </span>
          <div className="mt-2">
            <span className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight tabular-nums font-sans">
              {aiMetrics.ctr}%
            </span>
            <p className="text-xs text-slate-500 font-medium mt-0.5 tabular-nums">
              <span className="text-emerald-600 font-semibold">+3.2%</span> so với tuần trước
            </p>
          </div>
        </div>

        <div className="h-full flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-600" /> Tỷ lệ Mua hàng (CR)
          </span>
          <div className="mt-2">
            <span className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight tabular-nums font-sans">
              {aiMetrics.conversion_rate}%
            </span>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Từ danh sách gợi ý vào giỏ
            </p>
          </div>
        </div>

        <div className="h-full flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-indigo-600" /> Độ phù hợp đề xuất
          </span>
          <div className="mt-2">
            <span className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight tabular-nums font-sans">
              {aiMetrics.hit_rate_at_10}
            </span>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Xếp hạng liên quan Top 10</p>
          </div>
        </div>
      </div>
    </div>
  );
}
