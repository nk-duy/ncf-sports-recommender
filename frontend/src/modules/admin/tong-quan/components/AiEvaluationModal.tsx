'use client';

import { useState } from 'react';
import { FileSpreadsheet, Sparkles, X } from 'lucide-react';
import type {
  BenchmarkComparisonRow,
  DatasetSummary,
  EpochMetricPoint,
  EvaluationMetricsData,
  ModelEvaluationSummary,
  ModelHyperparameters,
} from '../types';
import HyperparametersSection from './eval/HyperparametersSection';
import TrainingChartsSection from './eval/TrainingChartsSection';
import BenchmarkTableSection from './eval/BenchmarkTableSection';

interface AiEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricsData: EvaluationMetricsData | null;
  onExportReport?: () => void;
}

const DEFAULT_DATASET: DatasetSummary = {
  num_users: 135,
  num_items: 552,
  total_interactions: 1025,
  train_samples: 4535,
  test_instances: 118,
  sparsity_percent: 98.62,
};

const DEFAULT_HYPERPARAMS: ModelHyperparameters = {
  embedding_dim_gmf: 16,
  embedding_dim_mlp: 16,
  total_embedding_dim: 32,
  mlp_layers: [32, 16, 8],
  negative_sampling_ratio: '1:4',
  test_negatives: 99,
  optimizer: 'Adam (lr=0.001)',
  loss_function: 'Binary Cross-Entropy (BCELoss)',
  epochs: 20,
  batch_size: 128,
  inference_latency_ms: 0.44,
};

const DEFAULT_EVAL_METRICS: ModelEvaluationSummary = {
  final_bce_loss: 0.231,
  hr_at_8: 86.8,
  ndcg_at_8: 0.655,
  hr_at_10: 88.5,
  ndcg_at_10: 0.678,
  inference_latency_ms: 0.44,
};

export default function AiEvaluationModal({
  isOpen,
  onClose,
  metricsData,
  onExportReport,
}: AiEvaluationModalProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'hyperparams' | 'charts' | 'benchmark'>(
    'all'
  );

  if (!isOpen) return null;

  const dataset: DatasetSummary = metricsData?.dataset_summary ?? DEFAULT_DATASET;
  const hyperparams: ModelHyperparameters = metricsData?.hyperparameters ?? DEFAULT_HYPERPARAMS;
  const evalMetrics: ModelEvaluationSummary =
    metricsData?.evaluation_metrics ?? DEFAULT_EVAL_METRICS;
  const epochHistory: EpochMetricPoint[] = metricsData?.epoch_history ?? [];
  const benchmarkComparison: BenchmarkComparisonRow[] = metricsData?.benchmark_comparison ?? [];

  const firstEpochLoss =
    epochHistory.length > 0 && typeof epochHistory[0].bce_loss === 'number'
      ? epochHistory[0].bce_loss
      : 0.582;

  const lastEpoch = epochHistory.length > 0 ? epochHistory[epochHistory.length - 1] : null;
  const lastEpochLoss =
    typeof lastEpoch?.bce_loss === 'number'
      ? lastEpoch.bce_loss
      : typeof evalMetrics.final_bce_loss === 'number'
        ? evalMetrics.final_bce_loss
        : 0.231;

  const neuMfRow = benchmarkComparison.find(
    (row) =>
      row.is_best ||
      row.method?.includes('NeuMF') ||
      row.name?.includes('Neural Collaborative Filtering')
  );
  const popRow = benchmarkComparison.find(
    (row) =>
      row.method === 'Popularity' ||
      row.name?.includes('Popularity') ||
      row.name?.includes('Phổ biến')
  );

  const finalLossNum =
    typeof neuMfRow?.bce_loss === 'number'
      ? neuMfRow.bce_loss
      : typeof evalMetrics.final_bce_loss === 'number'
        ? evalMetrics.final_bce_loss
        : lastEpochLoss;
  const finalLoss = finalLossNum.toFixed(4);
  const popLoss = (typeof popRow?.bce_loss === 'number' ? popRow.bce_loss : 0.693).toFixed(4);

  const finalHr8 =
    typeof neuMfRow?.hr_at_8 === 'number'
      ? neuMfRow.hr_at_8
      : typeof evalMetrics.hr_at_8 === 'number'
        ? evalMetrics.hr_at_8
        : typeof lastEpoch?.hr_at_8 === 'number'
          ? lastEpoch.hr_at_8
          : 86.8;

  const finalNdcg8 =
    typeof neuMfRow?.ndcg_at_8 === 'number'
      ? neuMfRow.ndcg_at_8
      : typeof evalMetrics.ndcg_at_8 === 'number'
        ? evalMetrics.ndcg_at_8
        : typeof lastEpoch?.ndcg_at_8 === 'number'
          ? lastEpoch.ndcg_at_8
          : 0.655;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className="relative w-[95vw] max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight leading-tight">
                Thực nghiệm &amp; Đánh giá Mô hình NCF
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Filter Navigation */}
        <div className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between overflow-x-auto gap-2 shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            {(
              [
                ['all', 'Toàn bộ Báo cáo'],
                ['hyperparams', 'Siêu tham số'],
                ['charts', 'Biểu đồ Huấn luyện'],
                ['benchmark', 'Bảng Đối sánh Mô hình'],
              ] as const
            ).map(([tabKey, label]) => (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tabKey
                    ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6 sm:space-y-8 text-slate-800">
          {(activeTab === 'all' || activeTab === 'hyperparams') && (
            <HyperparametersSection
              dataset={dataset}
              hyperparams={hyperparams}
              evalMetrics={evalMetrics}
            />
          )}

          {(activeTab === 'all' || activeTab === 'charts') && (
            <TrainingChartsSection
              epochHistory={epochHistory}
              firstEpochLoss={firstEpochLoss}
              lastEpochLoss={lastEpochLoss}
              finalLoss={finalLoss}
              finalHr8={finalHr8}
            />
          )}

          {(activeTab === 'all' || activeTab === 'benchmark') && (
            <BenchmarkTableSection
              benchmarkComparison={benchmarkComparison}
              finalLoss={finalLoss}
              popLoss={popLoss}
              finalHr8={finalHr8}
              finalNdcg8={finalNdcg8}
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-3">
            {onExportReport && (
              <button
                type="button"
                onClick={onExportReport}
                className="flex items-center gap-2 h-9 px-4 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white transition-all shadow-xs cursor-pointer"
              >
                <FileSpreadsheet size={15} />
                <span>Xuất Báo Cáo Thực Nghiệm (Excel)</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
