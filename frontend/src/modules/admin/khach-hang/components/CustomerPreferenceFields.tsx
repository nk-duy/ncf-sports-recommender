"use client";

import { Award, Activity, Check } from "lucide-react";

const AVAILABLE_SPORTS = [
  "Chạy bộ",
  "Gym / Fitness",
  "Yoga",
  "Camping / Dã ngoại",
  "Bóng đá",
  "Cầu lông",
  "Bóng rổ",
  "Bơi lội",
  "Đạp xe",
  "Tennis",
];

const TIERS = [
  { value: "Đồng", label: "Đồng", color: "bg-orange-100 text-orange-800 border-orange-200" },
  { value: "Bạc", label: "Bạc", color: "bg-gray-200 text-gray-800 border-gray-300" },
  { value: "Vàng", label: "Vàng", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "Kim Cương", label: "Kim Cương", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
];

interface CustomerPreferenceFieldsProps {
  tier: string;
  onTierChange: (tier: string) => void;
  selectedSports: string[];
  onToggleSport: (sport: string) => void;
}

export default function CustomerPreferenceFields({
  tier,
  onTierChange,
  selectedSports,
  onToggleSport,
}: CustomerPreferenceFieldsProps) {
  return (
    <>
      {/* Tier Selection */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
          <Award size={15} className="text-amber-500" /> Phân hạng hội viên
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIERS.map((t) => {
            const isSelected = tier === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onTierChange(t.value)}
                className={`h-10 px-3 rounded-lg border text-xs font-bold flex items-center justify-between transition-all ${
                  isSelected
                    ? `${t.color} border-current ring-2 ring-blue-500/20 shadow-xs`
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{t.label}</span>
                {isSelected && <Check size={14} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sports Interest Tags */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Activity size={15} className="text-blue-600" /> Bộ môn thể thao quan tâm
          </span>
          <span className="text-[11px] text-gray-400 font-normal">Chọn nhiều bộ môn</span>
        </label>
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
          {AVAILABLE_SPORTS.map((sport) => {
            const isSelected = selectedSports.includes(sport);
            return (
              <button
                key={sport}
                type="button"
                onClick={() => onToggleSport(sport)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-100/50"
                }`}
              >
                {sport}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
