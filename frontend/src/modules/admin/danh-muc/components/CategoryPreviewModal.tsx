'use client';
import React, { useState } from 'react';
import { X, Eye, Sparkles, Layers, Activity, Footprints, Zap, Trophy, Flame, Dumbbell, Compass, ShoppingBag } from 'lucide-react';
import { MegaMenuSport } from '../types';

interface CategoryPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: MegaMenuSport[];
}

export const getSportIcon = (sport: string) => {
  const s = sport.toLowerCase();
  if (s.includes('pickleball')) return <Activity className="w-3.5 h-3.5" />;
  if (s.includes('chạy bộ')) return <Footprints className="w-3.5 h-3.5" />;
  if (s.includes('cầu lông')) return <Zap className="w-3.5 h-3.5" />;
  if (s.includes('đá bóng')) return <Trophy className="w-3.5 h-3.5" />;
  if (s.includes('bóng chuyền')) return <Flame className="w-3.5 h-3.5" />;
  if (s.includes('đa dụng') || s.includes('gym')) return <Dumbbell className="w-3.5 h-3.5" />;
  if (s.includes('dã ngoại')) return <Compass className="w-3.5 h-3.5" />;
  if (s.includes('phụ kiện')) return <ShoppingBag className="w-3.5 h-3.5" />;
  return <Layers className="w-3.5 h-3.5" />;
};

export default function CategoryPreviewModal({ isOpen, onClose, menu }: CategoryPreviewModalProps) {
  const [showHidden, setShowHidden] = useState(false);

  if (!isOpen) return null;

  const displayMenu = showHidden ? menu : menu.filter(s => !s.is_hidden);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Eye size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Xem Trước Menu Khách Hàng (Live MegaMenu)
              </h2>
              <p className="text-xs text-gray-500">
                Mô phỏng chính xác khung menu thả xuống ngoài trang chủ khi khách hàng rê chuột vào mục "Sản phẩm"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showHidden}
                onChange={e => setShowHidden(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span>Hiển thị cả mục đang ẩn</span>
            </label>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: MegaMenu Simulator Container */}
        <div className="p-6 md:p-8 overflow-y-auto bg-slate-100/60 flex-1 flex flex-col justify-center items-center">
          {/* Header Mockup Bar */}
          <div className="w-full max-w-5xl bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm mb-4 flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-6 font-bold text-gray-700">
              <span className="text-blue-600 font-black">KADY SPORT</span>
              <span>Trang chủ</span>
              <span className="text-blue-600 border-b-2 border-blue-600 pb-0.5 flex items-center gap-1">
                Sản phẩm ▼
              </span>
              <span>Khuyến mãi</span>
              <span>Giới thiệu</span>
            </div>
            <span className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
              Mô phỏng MegaMenu ngoài Header
            </span>
          </div>

          {/* Actual MegaMenu Box */}
          <div className="w-full max-w-5xl bg-white text-gray-800 rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Sports Grid */}
              <div className="flex-1 p-6 sm:p-7 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6">
                {displayMenu.map((sport, sIdx) => {
                  const icon = getSportIcon(sport.sport_type);
                  const isSportHidden = sport.is_hidden;

                  // Lọc các product_types và categories
                  const pTypes = showHidden
                    ? sport.product_types
                    : sport.product_types?.filter(p => !p.is_hidden);

                  return (
                    <div
                      key={sIdx}
                      className={`group/col relative ${
                        isSportHidden ? 'opacity-40 border border-dashed border-red-300 p-2 rounded-xl' : ''
                      }`}
                    >
                      {isSportHidden && (
                        <span className="absolute -top-2 right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 rounded-full">
                          Đang ẩn
                        </span>
                      )}

                      {/* Sport Title */}
                      <div className="flex items-center gap-2 text-sm font-black text-gray-900 uppercase tracking-wide mb-3">
                        <span className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                          {icon}
                        </span>
                        <span className="truncate">{sport.sport_type}</span>
                      </div>

                      {/* Subcategories list */}
                      <div className="space-y-1.5 font-medium pl-9 text-[13px]">
                        {pTypes?.flatMap(p =>
                          showHidden ? p.categories : p.categories?.filter(c => !c.is_hidden)
                        ).slice(0, 5).map((cat, cIdx) => (
                          <div
                            key={cIdx}
                            className={`flex items-center justify-between text-gray-600 hover:text-blue-600 transition truncate ${
                              cat.is_hidden ? 'line-through text-gray-300' : ''
                            }`}
                          >
                            <span className="truncate">{cat.category}</span>
                            {cat.is_hidden && (
                              <span className="text-[9px] text-gray-400 font-mono">(ẩn)</span>
                            )}
                          </div>
                        ))}

                        {/* Fallback if no categories inside product_types */}
                        {pTypes?.filter(p => p.categories?.length === 0).map((prod, pIdx) => (
                          <div
                            key={pIdx}
                            className="text-gray-500 text-[12px] italic truncate"
                          >
                            {prod.product_type}
                          </div>
                        ))}

                        {pTypes?.length === 0 && (
                          <div className="text-gray-400 text-xs italic">Chưa có danh mục</div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {displayMenu.length === 0 && (
                  <div className="col-span-4 text-center py-10 text-gray-400 text-sm">
                    Không có môn thể thao nào đang hiển thị.
                  </div>
                )}
              </div>

              {/* Right: AI Recommender Promotional Box */}
              <div className="w-full lg:w-[280px] bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 text-white border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between shrink-0 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl"></div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold tracking-wider uppercase mb-3">
                    <Sparkles size={12} className="text-blue-400" />
                    Gợi ý NCF thông minh
                  </div>
                  <h4 className="font-extrabold text-white text-sm leading-snug">
                    Đồ Thể Thao Phù Hợp Nhất Với Bạn
                  </h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Hệ thống AI tự động đề xuất dựa trên sở thích và môn thể thao bạn tập luyện.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80">
                  <div className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl text-center shadow-md">
                    Khám phá ngay
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <span className="text-xs text-gray-500">
            Mẹo: Các danh mục được gạch chéo là các mục bạn đã bấm nút Ẩn (con mắt gạch chéo).
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition"
          >
            Đóng xem trước
          </button>
        </div>
      </div>
    </div>
  );
}
