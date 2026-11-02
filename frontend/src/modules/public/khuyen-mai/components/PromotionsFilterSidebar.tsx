"use client";

import { Check, RotateCcw, SlidersHorizontal } from "lucide-react";
import { COLOR_PALETTE, PRICE_RANGES, PRODUCT_TYPES, SPORTS } from "../types";

interface PromotionsFilterSidebarProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  selectedPriceIdx: number;
  onSelectPriceIdx: (idx: number) => void;
  availableSizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onResetFilters: () => void;
}

export default function PromotionsFilterSidebar({
  selectedSport,
  onSelectSport,
  selectedType,
  onSelectType,
  selectedPriceIdx,
  onSelectPriceIdx,
  availableSizes,
  selectedSize,
  onSelectSize,
  selectedColor,
  onSelectColor,
  onResetFilters,
}: PromotionsFilterSidebarProps) {
  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm sticky top-24 space-y-6">
        {/* Header of Sidebar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-700" />
            <h3 className="font-black text-sm uppercase tracking-wide text-slate-900">
              Bộ Lọc Khuyến Mãi
            </h3>
          </div>
          <button
            onClick={onResetFilters}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors"
            title="Xóa tất cả bộ lọc"
          >
            <RotateCcw className="w-3 h-3" />
            Xóa lọc
          </button>
        </div>

        {/* Sport Type */}
        <div>
          <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
            Môn Thể Thao
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SPORTS.map((sport) => (
              <button
                key={sport.value}
                onClick={() => onSelectSport(sport.value)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSport === sport.value
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {sport.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Type */}
        <div>
          <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
            Loại Sản Phẩm
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {PRODUCT_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => onSelectType(type.value)}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center transition-all cursor-pointer ${
                  selectedType === type.value
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2.5">
            Khoảng Giá
          </label>
          <div className="space-y-1.5">
            {PRICE_RANGES.map((r, idx) => (
              <label
                key={idx}
                className="flex items-center gap-2.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer select-none group"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceIdx === idx}
                  onChange={() => onSelectPriceIdx(idx)}
                  className="w-3.5 h-3.5 text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <span className={selectedPriceIdx === idx ? "font-bold text-red-600" : ""}>
                  {r.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Kích Cỡ ({selectedType || "Thể Thao"})
            </label>
            {selectedSize && (
              <button
                onClick={() => onSelectSize("")}
                className="text-[10px] text-red-500 hover:underline cursor-pointer"
              >
                Bỏ chọn
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => onSelectSize(selectedSize === size ? "" : size)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  selectedSize === size
                    ? "bg-red-600 border-red-600 text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-400"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Màu Sắc
            </label>
            {selectedColor && (
              <button
                onClick={() => onSelectColor("")}
                className="text-[10px] text-red-500 hover:underline cursor-pointer"
              >
                Bỏ chọn
              </button>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {COLOR_PALETTE.map((c) => {
              const isChecked = selectedColor === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => onSelectColor(isChecked ? "" : c.name)}
                  title={c.name}
                  className={`group relative w-full aspect-square rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    isChecked
                      ? "border-red-600 ring-2 ring-red-400/50 scale-105"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {isChecked && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        c.hex === "#FFFFFF" ? "text-slate-900" : "text-white"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
