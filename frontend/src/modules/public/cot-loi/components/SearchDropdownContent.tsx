'use client';

import { Clock, Flame, X, ChevronRight, Sparkles } from 'lucide-react';
import { AutocompleteProduct } from '../types';
import { TRENDING_KEYWORDS } from '../hooks/useSearchAutocomplete';

interface SearchDropdownContentProps {
  isLiveSearch: boolean;
  query: string;
  results: AutocompleteProduct[];
  loading: boolean;
  history: string[];
  onSelectProduct: (product: AutocompleteProduct) => void;
  onExecuteSearch: (kw: string) => void;
  onRemoveHistoryItem: (e: React.MouseEvent, kw: string) => void;
  onClearAllHistory: (e: React.MouseEvent) => void;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';

const formatPrice = (n: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

export default function SearchDropdownContent({
  isLiveSearch,
  query,
  results,
  loading,
  history,
  onSelectProduct,
  onExecuteSearch,
  onRemoveHistoryItem,
  onClearAllHistory,
}: SearchDropdownContentProps) {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {isLiveSearch ? (
        <div className="p-3">
          <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles size={14} className="text-blue-600" />
              Gợi ý sản phẩm ({results.length})
            </span>
            {loading && <span className="text-[11px] text-blue-600 font-medium">Đang tìm...</span>}
          </div>

          {results.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {results.map((p) => {
                const sportBadge = p.sport_type || p.product_type || (p.category && p.category[0]);
                return (
                  <button
                    key={p.product_id}
                    type="button"
                    onClick={() => onSelectProduct(p)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-blue-50/70 transition text-left group cursor-pointer"
                  >
                    <img
                      src={p.image_url || FALLBACK_IMAGE}
                      alt={p.name}
                      className="w-11 h-11 rounded-lg object-cover border border-slate-100 shrink-0 bg-slate-50 group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                        {p.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {sportBadge && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                            {sportBadge}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs md:text-sm font-extrabold text-blue-600">
                        {formatPrice(p.discount_percent ? p.price * (1 - p.discount_percent / 100) : p.price)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            !loading && (
              <div className="py-6 text-center text-xs text-slate-400">
                Không tìm thấy sản phẩm nào khớp với &ldquo;{query}&rdquo;
              </div>
            )
          )}

          <div className="border-t border-slate-100 pt-2.5 mt-1">
            <button
              type="button"
              onClick={() => onExecuteSearch(query)}
              className="w-full py-2 px-3 text-center text-xs md:text-sm font-bold text-blue-600 hover:text-white hover:bg-blue-600 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Xem tất cả kết quả cho &ldquo;{query}&rdquo;</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Khối 1: Lịch sử tìm kiếm gần đây */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-1.5 border-b border-slate-100 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-500" />
                Lịch sử tìm kiếm
              </span>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearAllHistory}
                  className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition cursor-pointer"
                >
                  Xóa tất cả
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="space-y-0.5">
                {history.map((item) => (
                  <div
                    key={item}
                    onClick={() => onExecuteSearch(item)}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition cursor-pointer group text-xs text-slate-700"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Clock size={13} className="text-slate-400 group-hover:text-blue-600 shrink-0" />
                      <span className="truncate group-hover:text-blue-600 font-medium">{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => onRemoveHistoryItem(e, item)}
                      className="p-1 text-slate-300 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Xóa"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-1.5 italic">
                Chưa có lịch sử tìm kiếm gần đây
              </p>
            )}
          </div>

          {/* Khối 2: Từ khóa xu hướng / Tìm kiếm phổ biến */}
          <div>
            <div className="flex items-center gap-1.5 pb-2 mb-2 text-xs font-bold text-slate-700 border-b border-slate-100">
              <Flame size={14} className="text-amber-500" />
              <span>Tìm kiếm phổ biến</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => onExecuteSearch(kw)}
                  className="rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-transparent text-xs font-medium px-3 py-1.5 transition text-slate-700 cursor-pointer flex items-center gap-1"
                >
                  <span>{kw}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
