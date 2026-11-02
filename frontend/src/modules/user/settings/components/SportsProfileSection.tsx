"use client";

import { Check } from "lucide-react";
import { APPAREL_SIZES, SHOE_SIZES, SPORTS_OPTIONS } from "../types";

interface SportsProfileSectionProps {
  interestedSports: string[];
  onToggleSport: (sport: string) => void;
  shoeSize: string;
  setShoeSize: (val: string) => void;
  apparelSize: string;
  setApparelSize: (val: string) => void;
}

export default function SportsProfileSection({
  interestedSports,
  onToggleSport,
  shoeSize,
  setShoeSize,
  apparelSize,
  setApparelSize,
}: SportsProfileSectionProps) {
  return (
    <div id="ai-section" className="space-y-4">
      {/* Môn thể thao quan tâm (Multi-select) */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
          <span>Môn thể thao quan tâm (chọn nhiều)</span>
          <span className="text-blue-600 text-xs font-medium">
            Hệ thống AI sẽ ưu tiên gợi ý theo các môn này
          </span>
        </label>
        <div className="flex flex-wrap gap-2 pt-1">
          {SPORTS_OPTIONS.map((sport) => {
            const isSelected = interestedSports.includes(sport.name);
            return (
              <button
                key={sport.name}
                type="button"
                onClick={() => onToggleSport(sport.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30 scale-102"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                <span>{sport.icon}</span>
                <span>{sport.name}</span>
                {isSelected && <Check size={14} className="ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Kích cỡ giày & Kích cỡ trang phục */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
            <span>Cỡ giày cá nhân</span>
            <span className="text-gray-500 text-xs">Chuẩn EU</span>
          </label>
          <select
            value={shoeSize}
            onChange={(e) => setShoeSize(e.target.value)}
            className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm cursor-pointer"
          >
            {SHOE_SIZES.map((sz) => (
              <option key={sz} value={sz}>
                {sz}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-900 flex items-center justify-between">
            <span>Cỡ trang phục</span>
            <span className="text-gray-500 text-xs">Áo / Quần</span>
          </label>
          <select
            value={apparelSize}
            onChange={(e) => setApparelSize(e.target.value)}
            className="h-10 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm cursor-pointer"
          >
            {APPAREL_SIZES.map((sz) => (
              <option key={sz} value={sz}>
                Size {sz}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
