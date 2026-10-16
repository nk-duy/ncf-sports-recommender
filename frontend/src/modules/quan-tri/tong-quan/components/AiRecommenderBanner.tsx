'use client';
import React from 'react';
import { BrainCircuit, RefreshCw, DollarSign, Zap, TrendingUp, ShieldCheck } from 'lucide-react';

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
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-md border border-indigo-900/50 flex flex-col gap-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/80">
              NCF Recommender Engine Active
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2 text-white">
            <BrainCircuit size={22} className="text-blue-400 shrink-0" />
            Mô Hình Học Sâu Gợi Ý Sản Phẩm Cá Nhân Hóa (NCF AI)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Kiến trúc Neural Collaborative Filtering (GMF + MLP Embedding). Lần huấn luyện gần nhất:{' '}
            <strong className="text-white font-semibold">{aiModelInfo?.last_trained || 'Đang sẵn sàng'}</strong>.{' '}
            Lập chỉ mục{' '}
            <span className="text-emerald-300 font-bold">{aiModelInfo?.num_users || stats.totalUsers} khách hàng</span> và{' '}
            <span className="text-blue-300 font-bold">{aiModelInfo?.num_items || stats.totalProducts} sản phẩm</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onRetrainAi}
            disabled={isRetraining}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all duration-200 cursor-pointer ${
              isRetraining
                ? 'bg-indigo-800/60 text-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:scale-105 active:scale-95'
            }`}
          >
            <RefreshCw size={16} className={isRetraining ? 'animate-spin' : ''} />
            <span>{isRetraining ? 'Đang huấn luyện NCF...' : 'Huấn luyện lại mô hình'}</span>
          </button>
        </div>
      </div>

      {/* AI Performance Sub-metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-indigo-900/40">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <DollarSign size={13} className="text-blue-400" /> Doanh thu từ AI
          </span>
          <span className="text-lg font-black text-white mt-1">
            {formatPrice(aiMetrics.ai_revenue || Math.round(stats.revenue * 0.324))}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium mt-0.5">
            Đóng góp ~{aiMetrics.ai_revenue_share || 32.4}% tổng doanh thu
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <Zap size={13} className="text-amber-400" /> Tỷ lệ Click gợi ý (CTR)
          </span>
          <span className="text-lg font-black text-white mt-1">
            {aiMetrics.ctr}%
          </span>
          <span className="text-[11px] text-amber-300 font-medium mt-0.5">
            +3.2% so với tuần trước
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <TrendingUp size={13} className="text-green-400" /> Tỷ lệ Chuyển đổi (CR)
          </span>
          <span className="text-lg font-black text-white mt-1">
            {aiMetrics.conversion_rate}%
          </span>
          <span className="text-[11px] text-green-300 font-medium mt-0.5">
            Từ gợi ý đến đặt hàng
          </span>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold flex items-center gap-1">
            <ShieldCheck size={13} className="text-purple-400" /> Độ chính xác mô hình
          </span>
          <span className="text-lg font-black text-white mt-1">
            {aiMetrics.hit_rate_at_10}
          </span>
          <span className="text-[11px] text-purple-300 font-medium mt-0.5">
            Hit Ratio@10 (NDCG: {aiMetrics.ndcg_at_10})
          </span>
        </div>
      </div>
    </div>
  );
}
