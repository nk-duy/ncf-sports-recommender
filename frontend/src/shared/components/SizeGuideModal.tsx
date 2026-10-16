'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { X, Ruler, Sparkles, Check, ArrowRight, ShieldCheck, RefreshCw, Info } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories?: string[];
  productName?: string;
  onSelectSize?: (size: string) => void;
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  categories = [],
  productName = '',
  onSelectSize,
}: SizeGuideModalProps) {
  // Nhận diện loại sản phẩm mặc định
  const defaultTab = useMemo(() => {
    const text = `${productName} ${categories.join(' ')}`.toLowerCase();
    if (text.includes('vợt') || text.includes('racket') || text.includes('paddle') || text.includes('pickleball')) {
      return 'rackets';
    }
    if (text.includes('clothing') || text.includes('quần áo') || text.includes('áo') || text.includes('quần') || text.includes('váy') || text.includes('jacket') || text.includes('short')) {
      return 'apparel';
    }
    return 'shoes';
  }, [categories, productName]);

  const [activeTab, setActiveTab] = useState<'shoes' | 'apparel' | 'rackets'>(defaultTab);

  // Cập nhật tab khi mở lại theo sản phẩm tương ứng
  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Bộ tính size nhanh (Quick Calculator States)
  const [calcGender, setCalcGender] = useState<'nam' | 'nu'>('nam');
  const [calcHeight, setCalcHeight] = useState(170); // cm
  const [calcWeight, setCalcWeight] = useState(65);  // kg
  const [calcFootLength, setCalcFootLength] = useState(25.5); // cm
  const [fitPreference, setFitPreference] = useState<'snug' | 'regular' | 'loose'>('regular');

  // Logic đề xuất size dựa trên thông số
  const recommendedShoeSize = useMemo(() => {
    // Chiều dài chân (cm) -> EU size tiêu chuẩn
    // Công thức tiêu chuẩn: Size EU ≈ (Foot length + 1.5) * 1.5
    // Thể thao (Running/Badminton/Pickleball) cần dư mũi chân khoảng 0.5 - 1.0cm
    const adjustedLength = fitPreference === 'snug' ? calcFootLength : fitPreference === 'loose' ? calcFootLength + 0.8 : calcFootLength + 0.5;
    if (adjustedLength < 23.0) return '36';
    if (adjustedLength < 23.5) return '37';
    if (adjustedLength < 24.0) return '38';
    if (adjustedLength < 24.8) return '39';
    if (adjustedLength < 25.4) return '40';
    if (adjustedLength < 26.0) return '41';
    if (adjustedLength < 26.8) return '42';
    if (adjustedLength < 27.5) return '43';
    if (adjustedLength < 28.3) return '44';
    return '45';
  }, [calcFootLength, fitPreference]);

  const recommendedApparelSize = useMemo(() => {
    // BMI & Tỷ lệ Chiều cao / Cân nặng
    let score = (calcHeight - 150) * 0.4 + (calcWeight - 45) * 0.6;
    if (calcGender === 'nu') score -= 10;
    if (fitPreference === 'loose') score += 8;
    if (fitPreference === 'snug') score -= 6;

    if (score < 18) return 'S';
    if (score < 30) return 'M';
    if (score < 42) return 'L';
    if (score < 54) return 'XL';
    return '2XL';
  }, [calcHeight, calcWeight, calcGender, fitPreference]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 z-10 border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 sm:py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 via-white to-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
                Hướng Dẫn Chọn Size & Bộ Tính Nhanh
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
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100 bg-gray-50/80 px-6 gap-2 pt-3">
          {[
            { id: 'shoes', label: '👟 Giày thể thao', sub: 'Running • Cầu Lông • Pickleball' },
            { id: 'apparel', label: '👕 Quần áo thể thao', sub: 'Áo đấu • Quần short • Set bộ' },
            { id: 'rackets', label: '🏸 Vợt & Phụ kiện', sub: 'Cầu lông 3U/4U • Vợt Pickleball' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
          
          {/* ================= BỘ TÍNH SIZE THÔNG MINH ================= */}
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
                    onClick={() => setCalcGender('nam')}
                    className={`px-3 py-1 rounded-md transition-colors ${calcGender === 'nam' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Nam
                  </button>
                  <button
                    onClick={() => setCalcGender('nu')}
                    className={`px-3 py-1 rounded-md transition-colors ${calcGender === 'nu' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    Nữ
                  </button>
                </div>

                <div className="inline-flex bg-white rounded-lg p-0.5 border border-gray-200 text-xs font-semibold">
                  {[
                    { id: 'snug', label: 'Ôm vừa' },
                    { id: 'regular', label: 'Tiêu chuẩn' },
                    { id: 'loose', label: 'Rộng rãi' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFitPreference(f.id as any)}
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
              {/* Slider 1: Chiều cao */}
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

              {/* Slider 2: Cân nặng */}
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

              {/* Slider 3: Dài bàn chân */}
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
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-blue-200 shadow-xs">
                  <span className="text-xs text-gray-500 font-medium">Gợi ý giày:</span>
                  <span className="text-base font-extrabold text-blue-600">Size {recommendedShoeSize}</span>
                  {activeTab === 'shoes' && onSelectSize && (
                    <button
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
                <span>Số đo tự động tính toán bù trừ độ giãn & tất thể thao dày</span>
              </div>
            </div>
          </div>

          {/* ================= TAB 1: BẢNG SIZE GIÀY ================= */}
          {activeTab === 'shoes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  Bảng quy đổi kích cỡ Giày Thể Thao (Running / Badminton / Pickleball)
                </h4>
                <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Chuẩn EUR / US / UK / CM</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
                <table className="w-full text-xs text-left text-gray-600">
                  <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3.5 py-3 font-bold text-blue-700">Size EU</th>
                      <th className="px-3.5 py-3 font-bold">Chiều dài chân (cm)</th>
                      <th className="px-3.5 py-3 font-bold">US Nam</th>
                      <th className="px-3.5 py-3 font-bold">US Nữ</th>
                      <th className="px-3.5 py-3 font-bold">UK</th>
                      <th className="px-3.5 py-3 font-bold text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { eu: '38', cm: '23.5 - 24.0', usMen: '5.5', usWomen: '7.0', uk: '5.0' },
                      { eu: '39', cm: '24.1 - 24.5', usMen: '6.5', usWomen: '8.0', uk: '6.0' },
                      { eu: '40', cm: '24.6 - 25.0', usMen: '7.0', usWomen: '8.5', uk: '6.5' },
                      { eu: '41', cm: '25.1 - 25.5', usMen: '8.0', usWomen: '9.5', uk: '7.5' },
                      { eu: '42', cm: '25.6 - 26.0', usMen: '8.5', usWomen: '10.0', uk: '8.0' },
                      { eu: '43', cm: '26.1 - 26.5', usMen: '9.5', usWomen: '11.0', uk: '9.0' },
                      { eu: '44', cm: '26.6 - 27.0', usMen: '10.0', usWomen: '11.5', uk: '9.5' },
                      { eu: '45', cm: '27.1 - 27.5', usMen: '11.0', usWomen: '12.5', uk: '10.5' },
                    ].map((row) => {
                      const isRec = row.eu === recommendedShoeSize;
                      return (
                        <tr
                          key={row.eu}
                          className={`transition-colors ${
                            isRec ? 'bg-blue-50/70 font-semibold text-blue-900' : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-3.5 py-2.5 font-bold text-blue-600 flex items-center gap-1.5">
                            {row.eu}
                            {isRec && (
                              <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                                Gợi ý
                              </span>
                            )}
                          </td>
                          <td className="px-3.5 py-2.5">{row.cm}</td>
                          <td className="px-3.5 py-2.5">{row.usMen}</td>
                          <td className="px-3.5 py-2.5">{row.usWomen}</td>
                          <td className="px-3.5 py-2.5">{row.uk}</td>
                          <td className="px-3.5 py-2.5 text-center">
                            {onSelectSize ? (
                              <button
                                onClick={() => {
                                  onSelectSize(row.eu);
                                  onClose();
                                }}
                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5"
                              >
                                Chọn size {row.eu}
                              </button>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tips đo chân */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1 text-amber-800">
                  💡 Kinh nghiệm chọn size giày chạy & sân đấu không bị bầm móng:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-amber-800/90 pl-1">
                  <li>
                    <strong>Giày Chạy Bộ (Running):</strong> Nên chọn tăng thêm <strong>0.5 - 1 size</strong> so với giày đi chơi thông thường vì bàn chân sẽ giãn nở nhiệt sau 3km - 5km chạy liên tục.
                  </li>
                  <li>
                    <strong>Giày Cầu Lông & Pickleball:</strong> Cần ôm khít ngang má chân nhưng mũi ngón chân cái vẫn phải cách mũi giày khoảng <strong>0.5cm</strong> để hãm phanh gấp an toàn.
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* ================= TAB 2: BẢNG SIZE QUẦN ÁO ================= */}
          {activeTab === 'apparel' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-gray-900">
                  Bảng thông số kích cỡ Quần Áo Thể Thao (Form Regular-fit & Athletic)
                </h4>
                <span className="text-[11px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">Nam & Nữ Châu Á</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs">
                <table className="w-full text-xs text-left text-gray-600">
                  <thead className="text-[11px] text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3.5 py-3 font-bold text-indigo-700">Size</th>
                      <th className="px-3.5 py-3 font-bold">Chiều cao (cm)</th>
                      <th className="px-3.5 py-3 font-bold">Cân nặng (kg)</th>
                      <th className="px-3.5 py-3 font-bold">Vòng ngực (cm)</th>
                      <th className="px-3.5 py-3 font-bold">Vòng bụng/eo (cm)</th>
                      <th className="px-3.5 py-3 font-bold text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { size: 'S', h: '155 - 165', w: '48 - 56', chest: '84 - 88', waist: '68 - 74' },
                      { size: 'M', h: '163 - 172', w: '57 - 65', chest: '89 - 94', waist: '75 - 80' },
                      { size: 'L', h: '170 - 178', w: '66 - 74', chest: '95 - 100', waist: '81 - 86' },
                      { size: 'XL', h: '175 - 183', w: '75 - 84', chest: '101 - 106', waist: '87 - 92' },
                      { size: '2XL', h: '180 - 190', w: '85 - 95', chest: '107 - 114', waist: '93 - 100' },
                    ].map((row) => {
                      const isRec = row.size === recommendedApparelSize;
                      return (
                        <tr
                          key={row.size}
                          className={`transition-colors ${
                            isRec ? 'bg-indigo-50/70 font-semibold text-indigo-900' : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="px-3.5 py-2.5 font-bold text-indigo-600 flex items-center gap-1.5">
                            {row.size}
                            {isRec && (
                              <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                                Gợi ý
                              </span>
                            )}
                          </td>
                          <td className="px-3.5 py-2.5">{row.h}</td>
                          <td className="px-3.5 py-2.5">{row.w}</td>
                          <td className="px-3.5 py-2.5">{row.chest}</td>
                          <td className="px-3.5 py-2.5">{row.waist}</td>
                          <td className="px-3.5 py-2.5 text-center">
                            {onSelectSize ? (
                              <button
                                onClick={() => {
                                  onSelectSize(row.size);
                                  onClose();
                                }}
                                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-0.5"
                              >
                                Chọn size {row.size}
                              </button>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-900">
                <span className="font-semibold">Mẹo chọn form:</span> Nếu bạn có vòng bụng lớn hoặc thích mặc rộng rãi để cử động cổ tay và vai linh hoạt khi chơi thể thao, hãy ưu tiên chọn theo <strong>Cân nặng</strong> thay vì Chiều cao.
              </div>
            </div>
          )}

          {/* ================= TAB 3: VỢT CẦU LÔNG & PICKLEBALL ================= */}
          {activeTab === 'rackets' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vợt cầu lông */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-blue-600">
                    🏸 Trọng lượng Vợt Cầu Lông (Chỉ số U)
                  </h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="font-bold text-gray-900 flex justify-between">
                        <span>4U (80g - 84g)</span>
                        <span className="text-blue-600">Phổ biến nhất</span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">Dành cho đa số người chơi phong trào, cổ tay trung bình, linh hoạt công thủ toàn diện.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="font-bold text-gray-900 flex justify-between">
                        <span>3U (85g - 89g)</span>
                        <span className="text-orange-600">Đập cầu uy lực</span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">Dành cho người chơi lực tay khỏe, ưa chuộng lối tấn công smash mạnh mẽ.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="font-bold text-gray-900 flex justify-between">
                        <span>5U (&lt; 80g)</span>
                        <span className="text-emerald-600">Trợ lực cao</span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">Thích hợp cho nữ giới, người mới làm quen hoặc đánh lưới phản tạt tốc độ.</p>
                    </div>
                  </div>
                </div>

                {/* Vợt Pickleball */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-1.5 text-indigo-600">
                    🏓 Vợt Pickleball & Chu vi cán (Paddle Specs)
                  </h4>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="font-bold text-gray-900 flex justify-between">
                        <span>Lightweight (7.3 - 7.8 oz)</span>
                        <span className="text-emerald-600">Tốc độ & Phản xạ</span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">Tối ưu tốc độ dink bóng và cứu bóng nhanh trên lưới, giảm mỏi cổ tay.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="font-bold text-gray-900 flex justify-between">
                        <span>Midweight (7.9 - 8.3 oz)</span>
                        <span className="text-indigo-600">Cân bằng vàng</span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">Lựa chọn tiêu chuẩn lý tưởng kết hợp giữa sức mạnh giao bóng và kiểm soát.</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="font-bold text-gray-900 flex justify-between">
                        <span>Độ dày lõi 16mm vs 13mm</span>
                      </div>
                      <p className="text-gray-500 text-[11px] mt-0.5">16mm cho độ êm và cảm giác bóng tối đa (Control); 13mm cho tốc độ bay bóng nảy uy lực (Power).</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              Đã hiểu & Đóng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
