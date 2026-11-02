'use client';

import { Sparkles, Check } from 'lucide-react';
import { AVAILABLE_SPORTS } from '../constants';

interface SportPreferenceSelectorProps {
  selectedSports: string[];
  onToggleSport: (sportId: string) => void;
  showHint?: boolean;
  compact?: boolean;
}

export default function SportPreferenceSelector({
  selectedSports,
  onToggleSport,
  showHint = false,
  compact = false,
}: SportPreferenceSelectorProps) {
  return (
    <div className={compact ? 'pt-1' : 'pt-1.5 pb-1'}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Sparkles size={13} className="text-blue-600" />
          <span>
            {compact ? 'Bộ môn thể thao yêu thích (Cold-Start NCF):' : 'Bộ môn thể thao yêu thích'}
          </span>
        </label>
        {!compact && (
          <span className="text-[11px] text-blue-600 font-medium">
            Giúp AI NCF gợi ý chuẩn xác
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {AVAILABLE_SPORTS.map((s) => {
          const isSelected = selectedSports.includes(s.id);
          return (
            <button
              type="button"
              key={s.id}
              onClick={() => onToggleSport(s.id)}
              className={`${compact ? 'text-[11px]' : 'text-xs'} px-2.5 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-blue-50 border-blue-600 text-blue-700 font-semibold shadow-2xs'
                  : 'bg-gray-50/80 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100/70'
              }`}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
              {isSelected && <Check size={12} className="text-blue-600 stroke-[2.5]" />}
            </button>
          );
        })}
      </div>

      {showHint && (
        <p className="mt-1 text-[11px] text-slate-400 italic">
          * Chọn ít nhất 1 bộ môn để AI Neural Collaborative Filtering lập hồ sơ sở thích ban đầu.
        </p>
      )}
    </div>
  );
}
