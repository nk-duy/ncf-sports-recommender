'use client';

import { Check } from 'lucide-react';
import { AVAILABLE_SPORTS } from '../constants';

interface SportPreferenceSelectorProps {
  selectedSports: string[];
  onToggleSport: (sportId: string) => void;
}

export default function SportPreferenceSelector({
  selectedSports,
  onToggleSport,
}: SportPreferenceSelectorProps) {
  return (
    <div className="pt-0.5">
      <div className="mb-1.5">
        <label className="block text-xs font-semibold text-slate-700">
          Môn thể thao yêu thích <span className="font-normal text-slate-400">(Tùy chọn)</span>
        </label>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Chọn bộ môn bạn thường tập luyện để cá nhân hóa trải nghiệm mua sắm
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {AVAILABLE_SPORTS.map((s) => {
          const isSelected = selectedSports.includes(s.id);
          return (
            <button
              type="button"
              key={s.id}
              onClick={() => onToggleSport(s.id)}
              className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all inline-flex items-center gap-1 cursor-pointer ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 text-blue-700 font-semibold'
                  : 'bg-slate-50 border-[#e5e7eb] text-slate-600 hover:border-slate-300 hover:bg-slate-100/70'
              }`}
            >
              <span>{s.label}</span>
              {isSelected && <Check size={11} className="text-blue-600 stroke-[2.5]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
