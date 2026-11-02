'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { X, Ruler, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  SIZE_TABS,
  calcRecommendedApparelSize,
  calcRecommendedShoeSize,
  detectDefaultSizeTab,
  type FitPreference,
  type GenderType,
  type SizeTabId,
} from './size-guide/sizeGuideData';
import SizeCalculatorPanel from './size-guide/SizeCalculatorPanel';
import SizeGuideTables from './size-guide/SizeGuideTables';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: string[];
  productName?: string;
  onSelectSize?: (size: string) => void;
}

function SizeGuideModalDialog({
  defaultTab,
  productName,
  onClose,
  onSelectSize,
}: {
  defaultTab: SizeTabId;
  productName: string;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<SizeTabId>(defaultTab);
  const [calcGender, setCalcGender] = useState<GenderType>('nam');
  const [calcHeight, setCalcHeight] = useState(170);
  const [calcWeight, setCalcWeight] = useState(65);
  const [calcFootLength, setCalcFootLength] = useState(25.5);
  const [fitPreference, setFitPreference] = useState<FitPreference>('regular');

  const recommendedShoeSize = useMemo(
    () => calcRecommendedShoeSize(calcFootLength, fitPreference),
    [calcFootLength, fitPreference]
  );

  const recommendedApparelSize = useMemo(
    () => calcRecommendedApparelSize(calcHeight, calcWeight, calcGender, fitPreference),
    [calcHeight, calcWeight, calcGender, fitPreference]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 z-10 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
                Hướng Dẫn Chọn Size &amp; Bộ Tính Nhanh
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-blue-600" /> Chuẩn form thể thao
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                {productName ? `Đang xem cho: ${productName}` : 'Hệ thống gợi ý kích cỡ chính xác theo thể trạng thể thao Việt Nam'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 px-6 gap-2 pt-3">
          {SIZE_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all relative flex flex-col items-start ${
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] text-gray-400 font-normal hidden sm:inline">{tab.sub}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Body content with scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <SizeCalculatorPanel
            activeTab={activeTab}
            calcGender={calcGender}
            setCalcGender={setCalcGender}
            calcHeight={calcHeight}
            setCalcHeight={setCalcHeight}
            calcWeight={calcWeight}
            setCalcWeight={setCalcWeight}
            calcFootLength={calcFootLength}
            setCalcFootLength={setCalcFootLength}
            fitPreference={fitPreference}
            setFitPreference={setFitPreference}
            recommendedShoeSize={recommendedShoeSize}
            recommendedApparelSize={recommendedApparelSize}
            onSelectSize={onSelectSize}
            onClose={onClose}
          />

          <SizeGuideTables
            activeTab={activeTab}
            recommendedShoeSize={recommendedShoeSize}
            recommendedApparelSize={recommendedApparelSize}
            onSelectSize={onSelectSize}
            onClose={onClose}
          />

          {/* Cam kết hỗ trợ đổi size */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Đổi size miễn phí trong 30 ngày:</strong> Nếu nhận hàng thử không vừa, shipper sẽ đến tận nhà đổi size mới hoàn toàn miễn phí.
              </span>
            </div>
            <Link
              href="/huong-dan-chon-size"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1 shrink-0 hover:underline"
            >
              Xem cẩm nang chi tiết <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500 hidden sm:block">
            Cần đo size trực tiếp? Hotline / Zalo: <span className="font-bold text-gray-900">0987.654.321</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              Đã hiểu &amp; Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  categories = [],
  productName = '',
  onSelectSize,
}: SizeGuideModalProps) {
  const defaultTab = useMemo(
    () => detectDefaultSizeTab(productName, categories),
    [categories, productName]
  );

  if (!isOpen) return null;

  return (
    <SizeGuideModalDialog
      key={`${productName}-${defaultTab}`}
      defaultTab={defaultTab}
      productName={productName}
      onClose={onClose}
      onSelectSize={onSelectSize}
    />
  );
}
