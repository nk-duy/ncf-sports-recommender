'use client';

import { BarChart2, Clock, Cpu, Layers, Sliders, TrendingDown, Zap } from 'lucide-react';
import type { DatasetSummary, ModelEvaluationSummary, ModelHyperparameters } from '../../types';

interface HyperparametersSectionProps {
  dataset: DatasetSummary;
  hyperparams: ModelHyperparameters;
  evalMetrics: ModelEvaluationSummary;
}

export default function HyperparametersSection({
  dataset,
  hyperparams,
  evalMetrics,
}: HyperparametersSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            1
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sliders size={18} className="text-blue-600" />
            Cấu hình Siêu tham số &amp; Không gian Vector ẩn
          </h3>
        </div>
        <span className="text-xs text-slate-500">He et al. (WWW 2017) NeuMF Protocol</span>
      </div>

      {/* 6 Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Embedding Dim */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Layers size={13} className="text-blue-600" /> Embedding Dim
          </span>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 tabular-nums">
              {hyperparams.total_embedding_dim || 32} chiều
            </div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">16D GMF + 16D MLP</div>
          </div>
        </div>

        {/* 2. MLP Layers */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Cpu size={13} className="text-indigo-600" /> Tầng ẩn MLP
          </span>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
              [32, 16, 8]
            </div>
            <div className="text-[10px] text-indigo-600 font-medium mt-0.5">
              3 Lớp phi tuyến ReLU
            </div>
          </div>
        </div>

        {/* 3. Negative Sampling */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <BarChart2 size={13} className="text-amber-600" /> Mẫu âm (Train)
          </span>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 tabular-nums">
              {hyperparams.negative_sampling_ratio || '1:4'}
            </div>
            <div className="text-[10px] text-amber-600 font-medium mt-0.5">99 Negs khi Test LOO</div>
          </div>
        </div>

        {/* 4. Optimizer */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <Zap size={13} className="text-emerald-600" /> Optimizer
          </span>
          <div className="mt-2">
            <div className="text-base font-bold text-slate-900">Adam</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
              Learning rate = 0.001
            </div>
          </div>
        </div>

        {/* 5. Loss Function */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
            <TrendingDown size={13} className="text-rose-600" /> Hàm mất mát
          </span>
          <div className="mt-2">
            <div className="text-base font-bold text-slate-900">BCE Loss</div>
            <div className="text-[10px] text-rose-600 font-medium mt-0.5">
              Binary Cross-Entropy
            </div>
          </div>
        </div>

        {/* 6. Latency */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col justify-between">
          <span className="text-[11px] font-semibold text-blue-800 flex items-center gap-1">
            <Clock size={13} className="text-blue-600" /> Độ trễ suy luận
          </span>
          <div className="mt-2">
            <div className="text-lg font-black text-blue-900 tabular-nums">
              {evalMetrics.inference_latency_ms || 0.44} ms
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Real-time (&lt;50ms)
            </div>
          </div>
        </div>
      </div>

      {/* Data Space Summary Ribbon */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <span className="text-slate-400 block text-[11px]">Không gian ma trận</span>
            <strong className="text-white text-sm tabular-nums">
              {dataset.num_users} Users × {dataset.num_items} Items
            </strong>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-slate-400 block text-[11px]">Cặp tương tác dương</span>
            <strong className="text-white text-sm tabular-nums">
              {dataset.total_interactions} Positive Pairs
            </strong>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-slate-400 block text-[11px]">Mẫu học sau Negative Sampling</span>
            <strong className="text-amber-400 text-sm tabular-nums">
              {dataset.train_samples} Train Pairs
            </strong>
          </div>
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />
          <div>
            <span className="text-slate-400 block text-[11px]">Độ thưa dữ liệu (Sparsity)</span>
            <strong className="text-emerald-400 text-sm tabular-nums">
              {dataset.sparsity_percent}%
            </strong>
          </div>
        </div>
        <div className="text-right text-[11px] text-slate-400">
          Leave-One-Out Test: <strong className="text-white">{dataset.test_instances} Users</strong>{' '}
          (1 Pos + 99 Negs)
        </div>
      </div>
    </section>
  );
}

