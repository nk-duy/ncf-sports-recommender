'use client';

import { TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { EpochMetricPoint } from '../../types';

interface TrainingChartsSectionProps {
  epochHistory: EpochMetricPoint[];
  firstEpochLoss: number;
  lastEpochLoss: number;
  finalLoss: string;
  finalHr8: number;
}

export default function TrainingChartsSection({
  epochHistory,
  firstEpochLoss,
  lastEpochLoss,
  finalLoss,
  finalHr8,
}: TrainingChartsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-600" />
          Biểu đồ Hội tụ Hàm mất mát (BCE Loss) &amp; Tăng trưởng Độ đo Xếp hạng (HR@8, NDCG@8)
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: BCE Loss Convergence */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                Đường Hội tụ Hàm Mất Mát (BCE Loss)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Giá trị Binary Cross-Entropy giảm đều từ {firstEpochLoss.toFixed(4)} xuống{' '}
                {lastEpochLoss.toFixed(4)}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              Loss cuối: {finalLoss}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={epochHistory}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="epoch"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val: number | string) => `E${val}`}
                />
                <YAxis
                  domain={[
                    (dataMin: number) => Math.max(0, Math.floor((dataMin - 0.03) * 20) / 20),
                    (dataMax: number) => Math.ceil((dataMax + 0.03) * 20) / 20,
                  ]}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                />
                <Tooltip
                  formatter={(value) => [`${String(value ?? '')}`, 'BCE Loss']}
                  labelFormatter={(label) => `Epoch ${String(label ?? '')}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bce_loss"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#lossGradient)"
                  name="BCE Loss"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 text-center italic">
            * Đồ thị phản ánh sự tối ưu hóa của thuật toán Adam với tốc độ học η = 0.001, đường mất
            mát hội tụ ổn định không bị Overfitting.
          </div>
        </div>

        {/* Chart 2: Ranking Metrics HR@8 & NDCG@8 */}
        <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                Tăng trưởng Độ đo Xếp hạng (HR@8 &amp; NDCG@8)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Leave-One-Out Evaluation với 99 Negative Items ngẫu nhiên
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                HR@8: {finalHr8}%
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={epochHistory}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="epoch"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(val: number | string) => `E${val}`}
                />
                <YAxis
                  yAxisId="left"
                  domain={[
                    (dataMin: number) => Math.max(0, Math.floor((dataMin - 5) / 10) * 10),
                    (dataMax: number) => Math.min(100, Math.ceil((dataMax + 5) / 10) * 10),
                  ]}
                  tick={{ fontSize: 11, fill: '#2563eb' }}
                  tickFormatter={(v: number | string) => `${v}%`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[
                    (dataMin: number) => Math.max(0, Math.floor((dataMin - 0.05) * 10) / 10),
                    (dataMax: number) => Math.min(1, Math.ceil((dataMax + 0.05) * 10) / 10),
                  ]}
                  tick={{ fontSize: 11, fill: '#059669' }}
                />
                <Tooltip
                  formatter={(value, name) => [
                    name === 'HR@8 (%)' ? `${String(value ?? '')}%` : String(value ?? ''),
                    String(name ?? ''),
                  ]}
                  labelFormatter={(label) => `Epoch ${String(label ?? '')}`}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="hr_at_8"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#2563eb' }}
                  name="HR@8 (%)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ndcg_at_8"
                  stroke="#059669"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2, fill: '#059669' }}
                  name="NDCG@8"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 text-center italic">
            * HR@8 (Hit Ratio): Tỷ lệ sản phẩm người dùng đã mua lọt vào Top 8 gợi ý. NDCG@8: Đánh
            giá vị trí xếp hạng cao hay thấp trong Top 8.
          </div>
        </div>
      </div>
    </section>
  );
}

