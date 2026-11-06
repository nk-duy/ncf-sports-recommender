'use client';

import { Award, CheckCircle2, HelpCircle } from 'lucide-react';
import type { BenchmarkComparisonRow } from '../../types';

interface BenchmarkTableSectionProps {
  benchmarkComparison: BenchmarkComparisonRow[];
  finalLoss: string;
  popLoss: string;
  finalHr8: number;
  finalNdcg8: number;
}

export default function BenchmarkTableSection({
  benchmarkComparison,
  finalLoss,
  popLoss,
  finalHr8,
  finalNdcg8,
}: BenchmarkTableSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award size={18} className="text-amber-600" />
          Bảng Đối sánh Kết quả Thực nghiệm giữa các Phương pháp
        </h3>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
              <th className="py-3.5 px-4">Phương pháp / Thuật toán</th>
              <th className="py-3.5 px-4">Bản chất Kiến trúc học máy</th>
              <th className="py-3.5 px-4 text-center">BCE Loss</th>
              <th className="py-3.5 px-4 text-center">Hit Ratio @ 8 (HR@8)</th>
              <th className="py-3.5 px-4 text-center">NDCG @ 8</th>
              <th className="py-3.5 px-4 text-center">Đánh giá &amp; Kết luận</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {benchmarkComparison.map((row, idx) => {
              const isNeuMF = Boolean(row.is_best || row.method.includes('NeuMF'));
              return (
                <tr
                  key={`${row.method}-${idx}`}
                  className={`transition-colors ${
                    isNeuMF
                      ? 'bg-blue-50/70 font-semibold text-slate-900 border-l-4 border-l-blue-600 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {isNeuMF && <Award size={16} className="text-blue-600 shrink-0" />}
                      <strong className={isNeuMF ? 'text-blue-900 text-sm' : 'text-slate-800'}>
                        {row.method === 'Popularity' ||
                        row.name?.includes('Non-personalized') ||
                        row.name?.includes('Phổ biến')
                          ? 'Gợi ý theo Độ phổ biến (Popularity)'
                          : row.name || row.method}
                      </strong>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{row.description}</td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    <span
                      className={
                        isNeuMF
                          ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200'
                          : 'text-slate-600'
                      }
                    >
                      {typeof row.bce_loss === 'number' ? row.bce_loss.toFixed(4) : row.bce_loss}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs ${
                        isNeuMF
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {row.hr_at_8}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold">
                    <span
                      className={
                        isNeuMF
                          ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200'
                          : 'text-slate-600'
                      }
                    >
                      {row.ndcg_at_8}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {isNeuMF ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                        <CheckCircle2 size={13} /> Tối ưu hóa toàn diện (Đề xuất)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Mô hình Baseline</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Research Insights Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
        <HelpCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h5 className="font-bold text-amber-950">Phân tích kết quả thực nghiệm mô hình:</h5>
          <p className="leading-relaxed">
            Mô hình NeuMF kết hợp nhánh tuyến tính GMF và phi tuyến MLP vượt trội hơn hẳn so với
            phương pháp Phổ biến và các nhánh đơn lẻ về khả năng hội tụ hàm mất mát (BCE Loss đạt
            mức thấp nhất <strong>{finalLoss}</strong> so với {popLoss} của phương pháp Phổ biến, độ
            chính xác HR@8 đạt <strong>{finalHr8}%</strong> và NDCG@8 đạt{' '}
            <strong>{finalNdcg8}</strong>). Kiến trúc này giúp hệ thống học được cả tương quan tiềm
            ẩn và tương tác đặc trưng bậc cao của hành vi khách hàng đối với thiết bị thể thao KADY.
          </p>
        </div>
      </div>
    </section>
  );
}

