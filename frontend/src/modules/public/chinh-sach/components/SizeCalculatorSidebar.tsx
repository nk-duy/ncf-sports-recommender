'use client';

import { useState } from 'react';
import {
  Footprints,
  Shirt,
  Dumbbell,
  HelpCircle,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SizeGuideTabKey } from '../types';
import { calculateClothingSize, calculateShoeSize } from '../data/sizeGuideData';

interface SizeCalculatorSidebarProps {
  activeTab: SizeGuideTabKey;
  onSelectTab: (tab: SizeGuideTabKey) => void;
}

const PRODUCT_TABS: { id: SizeGuideTabKey; label: string; icon: typeof Footprints }[] = [
  { id: 'giay', label: 'Giày thể thao (Running, Cầu lông)', icon: Footprints },
  { id: 'quan-ao', label: 'Quần áo tập luyện & Thi đấu', icon: Shirt },
  { id: 'vot', label: 'Vợt Cầu lông & Vợt Pickleball', icon: Dumbbell },
];

export default function SizeCalculatorSidebar({
  activeTab,
  onSelectTab,
}: SizeCalculatorSidebarProps) {
  const [userGender, setUserGender] = useState<'nam' | 'nu'>('nam');
  const [userHeight, setUserHeight] = useState<number>(170);
  const [userWeight, setUserWeight] = useState<number>(65);
  const [userFootLength, setUserFootLength] = useState<number>(25.5);

  const recommendedCloth = calculateClothingSize(userGender, userHeight, userWeight);
  const recommendedShoe = calculateShoeSize(userFootLength);

  return (
    <div className="lg:col-span-4 space-y-4 sticky top-24">
      <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-xs">
        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Nhóm sản phẩm
        </div>
        <div className="space-y-1">
          {PRODUCT_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
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
            <p className="text-[11px] text-blue-600/90 pt-1 italic">* {recommendedCloth.note}</p>
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
  );
}
