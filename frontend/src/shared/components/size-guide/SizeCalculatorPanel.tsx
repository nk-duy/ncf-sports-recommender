'use client';

import { Sparkles, Check, Info } from 'lucide-react';
import {
  FIT_OPTIONS,
  type FitPreference,
  type GenderType,
  type SizeTabId,
} from './sizeGuideData';

interface SizeCalculatorPanelProps {
  activeTab: SizeTabId;
  calcGender: GenderType;
  setCalcGender: (g: GenderType) => void;
  calcHeight: number;
  setCalcHeight: (h: number) => void;
  calcWeight: number;
  setCalcWeight: (w: number) => void;
  calcFootLength: number;
  setCalcFootLength: (f: number) => void;
  fitPreference: FitPreference;
  setFitPreference: (fit: FitPreference) => void;
  recommendedShoeSize: string;
  recommendedApparelSize: string;
  onSelectSize?: (size: string) => void;
  onClose: () => void;
}

export default function SizeCalculatorPanel({
  activeTab,
  calcGender,
  setCalcGender,
  calcHeight,
  setCalcHeight,
  calcWeight,
  setCalcWeight,
  calcFootLength,
  setCalcFootLength,
  fitPreference,
  setFitPreference,
  recommendedShoeSize,
  recommendedApparelSize,
  onSelectSize,
  onClose,
}: SizeCalculatorPanelProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100/80 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-600 text-white">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">Bộ tính size chuẩn cho cơ thể của bạn</h3>
            <p className="text-xs text-gray-500">Kéo chọn số đo thực tế để hệ thống đưa ra size vừa vặn nhất</p>
          </div>
        </div>

        {/* Giới tính & Form mặc */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex bg-white rounded-lg p-0.5 border border-gray-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setCalcGender('nam')}
              className={`px-3 py-1 rounded-md transition-colors ${calcGender === 'nam' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Nam
            </button>
            <button
              type="button"
              onClick={() => setCalcGender('nu')}
              className={`px-3 py-1 rounded-md transition-colors ${calcGender === 'nu' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Nữ
            </button>
          </div>

          <div className="inline-flex bg-white rounded-lg p-0.5 border border-gray-200 text-xs font-semibold">
            {FIT_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFitPreference(f.id)}
                className={`px-2.5 py-1 rounded-md transition-colors ${fitPreference === f.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slider inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/90 p-3.5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-gray-600">Chiều cao</span>
            <span className="font-bold text-blue-600 text-sm">{calcHeight} cm</span>
          </div>
          <input
            type="range"
            min="145"
            max="195"
            step="1"
            value={calcHeight}
            onChange={(e) => setCalcHeight(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>145cm</span>
            <span>170cm</span>
            <span>195cm</span>
          </div>
        </div>

        <div className="bg-white/90 p-3.5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-gray-600">Cân nặng</span>
            <span className="font-bold text-blue-600 text-sm">{calcWeight} kg</span>
          </div>
          <input
            type="range"
            min="40"
            max="105"
            step="1"
            value={calcWeight}
            onChange={(e) => setCalcWeight(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>40kg</span>
            <span>70kg</span>
            <span>105kg</span>
          </div>
        </div>

        <div className="bg-white/90 p-3.5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="font-semibold text-gray-600">Dài bàn chân</span>
            <span className="font-bold text-blue-600 text-sm">{calcFootLength.toFixed(1)} cm</span>
          </div>
          <input
            type="range"
            min="22.0"
            max="29.0"
            step="0.5"
            value={calcFootLength}
            onChange={(e) => setCalcFootLength(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>22cm</span>
            <span>25.5cm</span>
            <span>29cm</span>
          </div>
        </div>
      </div>

      {/* Hộp kết quả đề xuất trực tiếp */}
      <div className="mt-4 pt-3.5 border-t border-blue-100/70 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-blue-200 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Gợi ý giày:</span>
            <span className="text-base font-extrabold text-blue-600">Size {recommendedShoeSize}</span>
            {activeTab === 'shoes' && onSelectSize && (
              <button
                type="button"
                onClick={() => {
                  onSelectSize(recommendedShoeSize);
                  onClose();
                }}
                className="ml-2 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2 py-0.5 rounded-md transition-colors inline-flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Chọn size này
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-indigo-200 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Gợi ý quần áo:</span>
            <span className="text-base font-extrabold text-indigo-600">Size {recommendedApparelSize}</span>
            {activeTab === 'apparel' && onSelectSize && (
              <button
                type="button"
                onClick={() => {
                  onSelectSize(recommendedApparelSize);
                  onClose();
                }}
                className="ml-2 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2 py-0.5 rounded-md transition-colors inline-flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Chọn size này
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-1 self-start sm:self-auto">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>Số đo tự động tính toán bù trừ độ giãn &amp; tất thể thao dày</span>
        </div>
      </div>
    </div>
  );
}
