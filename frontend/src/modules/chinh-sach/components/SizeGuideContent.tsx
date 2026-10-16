'use client';

import React, { useState } from 'react';
import Breadcrumb from '@/shared/components/Breadcrumb';
import Link from 'next/link';
import { 
  Footprints, 
  Shirt, 
  Dumbbell, 
  HelpCircle, 
  Phone, 
  MessageCircle, 
  Ruler, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

type TabKey = 'giay' | 'quan-ao' | 'vot';

export default function SizeGuideContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('giay');

  // Trạng thái cho bộ tính size nhanh (Interactive Calculator)
  const [userGender, setUserGender] = useState<'nam' | 'nu'>('nam');
  const [userHeight, setUserHeight] = useState<number>(170);
  const [userWeight, setUserWeight] = useState<number>(65);
  const [userFootLength, setUserFootLength] = useState<number>(25.5);

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Hướng dẫn chọn size' },
  ];

  // Tính toán gợi ý size quần áo
  const calculateClothingSize = () => {
    // Đơn giản hóa theo chuẩn phom thể thao Việt Nam
    if (userGender === 'nam') {
      if (userWeight < 55 && userHeight < 165) return { size: 'S', note: 'Ôm vừa vặn người' };
      if (userWeight <= 65 && userHeight <= 172) return { size: 'M', note: 'Chuẩn dáng thể thao' };
      if (userWeight <= 75 && userHeight <= 178) return { size: 'L', note: 'Thoải mái vận động' };
      if (userWeight <= 85) return { size: 'XL', note: 'Rộng rãi thoáng khí' };
      return { size: 'XXL', note: 'Phù hợp người tập thể hình/vóc dáng to lớn' };
    } else {
      if (userWeight < 48 && userHeight < 158) return { size: 'S', note: 'Tôn dáng thon gọn' };
      if (userWeight <= 55 && userHeight <= 165) return { size: 'M', note: 'Chuẩn dáng nữ' };
      if (userWeight <= 62 && userHeight <= 170) return { size: 'L', note: 'Thoải mái vận động' };
      return { size: 'XL', note: 'Rộng rãi dễ chịu' };
    }
  };

  // Tính toán gợi ý size giày
  const calculateShoeSize = () => {
    const cm = userFootLength;
    if (cm <= 23.0) return { eu: '37', us: '5.0', uk: '4.5' };
    if (cm <= 23.5) return { eu: '38', us: '5.5', uk: '5.0' };
    if (cm <= 24.0) return { eu: '39', us: '6.5', uk: '6.0' };
    if (cm <= 24.5) return { eu: '40', us: '7.5', uk: '7.0' };
    if (cm <= 25.0) return { eu: '40.5', us: '8.0', uk: '7.5' };
    if (cm <= 25.5) return { eu: '41', us: '8.5', uk: '8.0' };
    if (cm <= 26.0) return { eu: '42', us: '9.0', uk: '8.5' };
    if (cm <= 26.5) return { eu: '42.5', us: '9.5', uk: '9.0' };
    if (cm <= 27.0) return { eu: '43', us: '10.0', uk: '9.5' };
    if (cm <= 27.5) return { eu: '44', us: '10.5', uk: '10.0' };
    return { eu: '45+', us: '11.5+', uk: '11.0+' };
  };

  const recommendedCloth = calculateClothingSize();
  const recommendedShoe = calculateShoeSize();

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200 py-8 sm:py-10">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Hướng Dẫn Chọn Size Thể Thao Chuẩn Xác
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            Bảng quy đổi kích cỡ chuẩn quốc tế và công cụ tính size nhanh cho Giày chạy bộ, Quần áo tập luyện và Vợt thi đấu tại KADY.
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Left Sidebar: Tabs & Support */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-xs">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Nhóm sản phẩm
              </div>
              <div className="space-y-1">
                {[
                  { id: 'giay', label: 'Giày thể thao (Running, Cầu lông)', icon: Footprints },
                  { id: 'quan-ao', label: 'Quần áo tập luyện & Thi đấu', icon: Shirt },
                  { id: 'vot', label: 'Vợt Cầu lông & Vợt Pickleball', icon: Dumbbell },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as TabKey)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-medium transition text-left ${
                        isActive 
                          ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                        <span>{tab.label}</span>
                      </div>
                      <ArrowRight size={15} className={`opacity-60 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Interactive Calculator Box */}
            <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs text-sm">
              <div className="flex items-center gap-2 text-blue-900 font-bold mb-3">
                <Sparkles size={18} className="text-blue-600" />
                <span>Tính size đề xuất nhanh</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Giới tính</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUserGender('nam')}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                        userGender === 'nam' 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Nam
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserGender('nu')}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                        userGender === 'nu' 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Nữ
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Chiều cao</span>
                    <span className="text-blue-600 font-bold">{userHeight} cm</span>
                  </div>
                  <input
                    type="range"
                    min={145}
                    max={195}
                    value={userHeight}
                    onChange={(e) => setUserHeight(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Cân nặng</span>
                    <span className="text-blue-600 font-bold">{userWeight} kg</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={100}
                    value={userWeight}
                    onChange={(e) => setUserWeight(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                    <span>Chiều dài bàn chân</span>
                    <span className="text-blue-600 font-bold">{userFootLength} cm</span>
                  </div>
                  <input
                    type="range"
                    step={0.5}
                    min={22.0}
                    max={29.0}
                    value={userFootLength}
                    onChange={(e) => setUserFootLength(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                {/* Kết quả tính toán */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Size quần áo:</span>
                    <span className="font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded shadow-2xs border border-blue-200">
                      Size {recommendedCloth.size}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Size giày (EU):</span>
                    <span className="font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded shadow-2xs border border-blue-200">
                      Size {recommendedShoe.eu}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-600/90 pt-1 italic">
                    * {recommendedCloth.note}
                  </p>
                </div>
              </div>
            </div>

            {/* Hỗ trợ tư vấn */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs text-sm">
              <div className="flex items-center gap-2 text-gray-900 font-bold mb-1.5">
                <HelpCircle size={16} className="text-blue-600" />
                <span>Vẫn chưa chắc chắn?</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                KADY hỗ trợ <strong>đổi size tận nhà miễn phí trong 30 ngày</strong>. Bạn cũng có thể nhắn số đo cho CSKH để được tư vấn phom dáng.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:19006868"
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <Phone size={14} className="text-blue-600" />
                  Hotline: 1900 6868
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <MessageCircle size={14} />
                  Nhắn Zalo tư vấn phom
                </a>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
            
            {/* 1. GIÀY THỂ THAO */}
            {activeTab === 'giay' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Bảng Size Giày Thể Thao & Hướng Dẫn Đo Chân
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Áp dụng cho Giày chạy bộ, Cầu lông, Pickleball và Bóng đá</p>
                </div>

                <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                  {/* Bảng quy đổi */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">1. Bảng quy đổi kích thước chuẩn (Unisex)</h3>
                    <div className="border border-gray-200 rounded-lg overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                          <tr>
                            <th className="p-3">Chiều dài chân (cm)</th>
                            <th className="p-3">Size EU</th>
                            <th className="p-3">Size US (Nam)</th>
                            <th className="p-3">Size UK</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-600">
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-medium text-gray-900">23.0 - 23.5 cm</td>
                            <td className="p-3 font-bold text-blue-600">37 - 38</td>
                            <td className="p-3">5.0 - 5.5</td>
                            <td className="p-3">4.5 - 5.0</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-medium text-gray-900">24.0 - 24.5 cm</td>
                            <td className="p-3 font-bold text-blue-600">39 - 40</td>
                            <td className="p-3">6.5 - 7.5</td>
                            <td className="p-3">6.0 - 7.0</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-medium text-gray-900">25.0 - 25.5 cm</td>
                            <td className="p-3 font-bold text-blue-600">40.5 - 41</td>
                            <td className="p-3">8.0 - 8.5</td>
                            <td className="p-3">7.5 - 8.0</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-medium text-gray-900">26.0 - 26.5 cm</td>
                            <td className="p-3 font-bold text-blue-600">42 - 42.5</td>
                            <td className="p-3">9.0 - 9.5</td>
                            <td className="p-3">8.5 - 9.0</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-medium text-gray-900">27.0 - 27.5 cm</td>
                            <td className="p-3 font-bold text-blue-600">43 - 44</td>
                            <td className="p-3">10.0 - 10.5</td>
                            <td className="p-3">9.5 - 10.0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Cách đo chân */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">2. Hướng dẫn đo chiều dài bàn chân tại nhà</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
                        <span className="font-bold text-xs text-blue-600 block mb-1">Bước 1: Chuẩn bị</span>
                        <p className="text-[12px] text-gray-600">Đặt tờ giấy A4 trên sàn sát vào mép tường phẳng. Đứng thẳng lên giấy, gót chân chạm sát tường.</p>
                      </div>
                      <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
                        <span className="font-bold text-xs text-blue-600 block mb-1">Bước 2: Đánh dấu</span>
                        <p className="text-[12px] text-gray-600">Dùng bút chì giữ thẳng đứng, đánh dấu điểm xa nhất của ngón chân dài nhất trên tờ giấy.</p>
                      </div>
                      <div className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50">
                        <span className="font-bold text-xs text-blue-600 block mb-1">Bước 3: Đối chiếu</span>
                        <p className="text-[12px] text-gray-600">Đo khoảng cách từ mép giấy đến điểm đánh dấu. <strong>Cộng thêm 0.5cm</strong> nếu bạn mang tất dệt dày khi chơi thể thao.</p>
                      </div>
                    </div>
                  </div>

                  {/* Lưu ý môn thể thao */}
                  <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1 text-xs sm:text-sm">
                    <strong className="flex items-center gap-1.5 font-bold">
                      <Info size={16} /> Lưu ý quan trọng cho từng môn:
                    </strong>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-amber-950 mt-1">
                      <li><strong>Giày chạy bộ (Running):</strong> Khi chạy đường dài, bàn chân có xu hướng giãn nở. Bạn nên chọn tăng thêm <strong>0.5 – 1 size</strong> so với giày đi dạo phố để tránh bị cấn mũi hoặc bầm móng.</li>
                      <li><strong>Giày Cầu lông & Pickleball:</strong> Chọn vừa vặn, ôm chân và có độ khóa gót tốt để giảm chấn thương lật cổ chân khi đổi hướng đột ngột.</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 2. QUẦN ÁO */}
            {activeTab === 'quan-ao' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Bảng Size Quần Áo Tập Luyện & Thi Đấu
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Chuẩn phom dáng Regular Fit và Slim Fit thể thao</p>
                </div>

                <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                  {/* Bảng nam */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">1. Bảng số đo Nam (Áo & Quần thể thao)</h3>
                    <div className="border border-gray-200 rounded-lg overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                          <tr>
                            <th className="p-3">Size</th>
                            <th className="p-3">Chiều cao (cm)</th>
                            <th className="p-3">Cân nặng (kg)</th>
                            <th className="p-3">Vòng ngực (cm)</th>
                            <th className="p-3">Vòng eo (cm)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-600">
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-bold text-blue-600">S</td>
                            <td className="p-3">155 - 165 cm</td>
                            <td className="p-3">50 - 58 kg</td>
                            <td className="p-3">84 - 88 cm</td>
                            <td className="p-3">68 - 74 cm</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-bold text-blue-600">M</td>
                            <td className="p-3">165 - 172 cm</td>
                            <td className="p-3">59 - 66 kg</td>
                            <td className="p-3">89 - 93 cm</td>
                            <td className="p-3">75 - 80 cm</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-bold text-blue-600">L</td>
                            <td className="p-3">170 - 177 cm</td>
                            <td className="p-3">67 - 75 kg</td>
                            <td className="p-3">94 - 98 cm</td>
                            <td className="p-3">81 - 86 cm</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-bold text-blue-600">XL</td>
                            <td className="p-3">175 - 183 cm</td>
                            <td className="p-3">76 - 84 kg</td>
                            <td className="p-3">99 - 104 cm</td>
                            <td className="p-3">87 - 93 cm</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-bold text-blue-600">XXL</td>
                            <td className="p-3">&gt; 180 cm</td>
                            <td className="p-3">85 - 95 kg</td>
                            <td className="p-3">105 - 110 cm</td>
                            <td className="p-3">&gt; 94 cm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bảng nữ */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">2. Bảng số đo Nữ (Áo thun, Bra thể thao, Quần legging)</h3>
                    <div className="border border-gray-200 rounded-lg overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold">
                          <tr>
                            <th className="p-3">Size</th>
                            <th className="p-3">Chiều cao (cm)</th>
                            <th className="p-3">Cân nặng (kg)</th>
                            <th className="p-3">Vòng ngực (cm)</th>
                            <th className="p-3">Vòng mông (cm)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-600">
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-bold text-blue-600">S</td>
                            <td className="p-3">150 - 158 cm</td>
                            <td className="p-3">42 - 48 kg</td>
                            <td className="p-3">78 - 83 cm</td>
                            <td className="p-3">84 - 88 cm</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-bold text-blue-600">M</td>
                            <td className="p-3">158 - 165 cm</td>
                            <td className="p-3">49 - 55 kg</td>
                            <td className="p-3">84 - 89 cm</td>
                            <td className="p-3">89 - 94 cm</td>
                          </tr>
                          <tr className="hover:bg-blue-50/50">
                            <td className="p-3 font-bold text-blue-600">L</td>
                            <td className="p-3">163 - 170 cm</td>
                            <td className="p-3">56 - 63 kg</td>
                            <td className="p-3">90 - 95 cm</td>
                            <td className="p-3">95 - 100 cm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. VỢT CẦU LÔNG & PICKLEBALL */}
            {activeTab === 'vot' && (
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Hướng Dẫn Chọn Thông Số Vợt Cầu Lông & Pickleball
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Lựa chọn đúng trọng lượng và chu vi cán giúp hạn chế chấn thương cổ tay</p>
                </div>

                <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">1. Trọng lượng vợt Cầu lông (Ký hiệu chữ U)</h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                        <strong className="text-blue-600 text-sm block mb-1">3U (85 - 89 gram)</strong>
                        <p className="text-xs text-gray-600">Trọng lượng đầm tay, lực đập cầu uy lực. Phù hợp cho nam giới có lực cổ tay khỏe hoặc vận động viên phong trào.</p>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                        <strong className="text-blue-600 text-sm block mb-1">4U (80 - 84 gram)</strong>
                        <p className="text-xs text-gray-600"><strong>Phổ biến nhất tại Việt Nam (80% người chơi).</strong> Cân bằng hoàn hảo giữa tấn công đập cầu và phòng thủ phản tạt.</p>
                      </div>
                      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50/50">
                        <strong className="text-blue-600 text-sm block mb-1">5U (75 - 79 gram)</strong>
                        <p className="text-xs text-gray-600">Trọng lượng siêu nhẹ, linh hoạt xoay sở trên lưới. Rất thích hợp cho nữ giới hoặc người mới bắt đầu tập luyện.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">2. Chu vi cán tay cầm (Ký hiệu chữ G)</h3>
                    <p className="text-gray-600 mb-2">
                      Ký hiệu số G càng lớn thì cán cầm càng nhỏ:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-xs sm:text-sm">
                      <li><strong>G5:</strong> Cán tiêu chuẩn vừa vặn với kích thước bàn tay trung bình của người Việt Nam.</li>
                      <li><strong>G6:</strong> Cán nhỏ, phù hợp với người tay nhỏ hoặc người thích quấn thêm nhiều lớp bọc cán êm tay.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-2">3. Vợt Pickleball (Độ dày lõi và Trọng lượng)</h3>
                    <div className="border border-gray-200 rounded-lg p-4 space-y-2 bg-blue-50/40">
                      <p><strong>• Vợt nhẹ (7.3 - 7.8 oz):</strong> Phù hợp cho người chơi ưu tiên kiểm soát bóng tinh tế (Dink shot), giảm mỏi khớp vai và cổ tay.</p>
                      <p><strong>• Vợt trung bình (7.9 - 8.4 oz):</strong> Lựa chọn đa năng, vừa có lực đánh sâu (Drive), vừa có độ ổn định khi đỡ bóng nhanh ở vạch Kitchen.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
