'use client';

import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import { MegaMenuSport } from '../types';
import { getSportTheme } from '../utils/sportTheme';

interface CategorySportCardHeaderProps {
  sport: MegaMenuSport;
  sIdx: number;
  totalSports: number;
  isExpanded: boolean;
  sportProductCount: number;
  totalSubs: number;
  onToggleExpand: (sIdx: number) => void;
  onMoveSport: (sIdx: number, direction: 'up' | 'down') => void;
  onToggleVisibility: (
    type: 'sport' | 'product' | 'category',
    sIdx: number,
    pIdx?: number,
    cIdx?: number
  ) => void;
  onRemoveSport: (sIdx: number) => void;
  onUpdateSportName: (sIdx: number, newName: string) => void;
}

export default function CategorySportCardHeader({
  sport,
  sIdx,
  totalSports,
  isExpanded,
  sportProductCount,
  totalSubs,
  onToggleExpand,
  onMoveSport,
  onToggleVisibility,
  onRemoveSport,
  onUpdateSportName,
}: CategorySportCardHeaderProps) {
  const theme = getSportTheme(sport.sport_type);
  const [editingSport, setEditingSport] = useState(false);
  const [sportNameInput, setSportNameInput] = useState(sport.sport_type);

  const handleSaveSportName = () => {
    if (sportNameInput.trim()) {
      onUpdateSportName(sIdx, sportNameInput.trim());
    }
    setEditingSport(false);
  };

  return (
    <div
      onClick={() => !editingSport && onToggleExpand(sIdx)}
      className={`px-5 py-4 flex items-center justify-between cursor-pointer select-none transition-colors ${
        sport.is_hidden
          ? 'bg-slate-100/60 text-slate-400'
          : isExpanded
          ? 'bg-blue-50/30'
          : 'bg-white hover:bg-slate-50/80'
      }`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <button
          type="button"
          className="text-slate-400 hover:text-blue-600 p-0.5 rounded transition"
          aria-label={isExpanded ? 'Thu gọn môn thể thao' : 'Mở rộng môn thể thao'}
        >
          {isExpanded ? (
            <ChevronDown size={20} className="text-blue-600" />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>

        <div
          className={`size-10 rounded-xl flex items-center justify-center shrink-0 border ${theme.bg} ${theme.text} ${theme.border}`}
        >
          {theme.icon}
        </div>

        {editingSport ? (
          <div
            className="flex items-center gap-2 flex-1 max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              autoFocus
              type="text"
              value={sportNameInput}
              onChange={(e) => setSportNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveSportName();
                if (e.key === 'Escape') setEditingSport(false);
              }}
              className="w-full px-2.5 py-1 text-sm font-bold border border-blue-400 rounded-lg outline-none bg-white text-slate-900"
            />
            <button
              type="button"
              onClick={handleSaveSportName}
              className="size-8 inline-flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors duration-150"
              title="Lưu tên"
              aria-label="Lưu tên"
            >
              <Check size={16} />
            </button>
            <button
              type="button"
              onClick={() => setEditingSport(false)}
              className="size-8 inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors duration-150"
              title="Hủy đổi tên"
              aria-label="Hủy đổi tên"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <span
              className={`text-sm font-black tracking-tight ${
                sport.is_hidden ? 'line-through text-slate-400' : 'text-slate-900'
              }`}
            >
              {sport.sport_type}
            </span>

            <span className="whitespace-nowrap inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 tabular-nums">
              {sport.product_types.length} nhóm loại • {totalSubs} danh mục con
            </span>

            {sportProductCount > 0 && (
              <span className="whitespace-nowrap inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 tabular-nums">
                {sportProductCount} sản phẩm
              </span>
            )}

            {sport.is_hidden && (
              <span className="whitespace-nowrap inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-600">
                Đang ẩn trên menu
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions Toolbar */}
      <div
        className="flex items-center gap-1 shrink-0 ml-3"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onMoveSport(sIdx, 'up')}
          disabled={sIdx === 0}
          className={`size-8 inline-flex items-center justify-center rounded-lg transition-colors duration-150 ${
            sIdx === 0
              ? 'text-slate-200 cursor-not-allowed'
              : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title="Di chuyển lên trên"
          aria-label="Di chuyển lên trên"
        >
          <ArrowUp size={15} />
        </button>
        <button
          type="button"
          onClick={() => onMoveSport(sIdx, 'down')}
          disabled={sIdx === totalSports - 1}
          className={`size-8 inline-flex items-center justify-center rounded-lg transition-colors duration-150 ${
            sIdx === totalSports - 1
              ? 'text-slate-200 cursor-not-allowed'
              : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'
          }`}
          title="Di chuyển xuống dưới"
          aria-label="Di chuyển xuống dưới"
        >
          <ArrowDown size={15} />
        </button>

        <div className="w-px h-4 bg-slate-200 mx-1"></div>

        <button
          type="button"
          onClick={() => onToggleVisibility('sport', sIdx)}
          className={`size-8 inline-flex items-center justify-center rounded-lg transition-colors duration-150 ${
            sport.is_hidden
              ? 'text-rose-500 hover:bg-rose-50'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
          title={sport.is_hidden ? 'Bật hiển thị menu' : 'Tạm ẩn khỏi menu'}
          aria-label={sport.is_hidden ? 'Bật hiển thị menu' : 'Tạm ẩn khỏi menu'}
        >
          {sport.is_hidden ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>

        {!editingSport && (
          <button
            type="button"
            onClick={() => {
              setSportNameInput(sport.sport_type);
              setEditingSport(true);
            }}
            className="size-8 inline-flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
            title="Đổi tên môn thể thao"
            aria-label="Đổi tên môn thể thao"
          >
            <Edit2 size={15} />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                `Bạn có chắc chắn muốn xóa môn thể thao "${sport.sport_type}" và toàn bộ danh mục con bên trong?`
              )
            ) {
              onRemoveSport(sIdx);
            }
          }}
          className="size-8 inline-flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors duration-150"
          title="Xóa môn thể thao"
          aria-label="Xóa môn thể thao"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
