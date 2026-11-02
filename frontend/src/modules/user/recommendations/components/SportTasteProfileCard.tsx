"use client";

import Link from "next/link";
import { Activity, SlidersHorizontal, CheckCircle2 } from "lucide-react";

interface SportTasteProfileCardProps {
  displayName: string;
  preferredSport: string;
  tier?: string;
  shoeSize?: string;
}

export default function SportTasteProfileCard({
  displayName,
  preferredSport,
  tier,
  shoeSize,
}: SportTasteProfileCardProps) {
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-8 overflow-hidden flex flex-col gap-6">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-green-500"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="text-blue-600" size={24} />
          <h3 className="text-xl text-gray-900 font-bold">
            Hồ sơ thị hiếu thể thao của {displayName}
          </h3>
        </div>
        <Link
          href="/tai-khoan/settings"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-blue-600 text-sm font-semibold transition-colors"
        >
          <SlidersHorizontal size={16} />
          Tùy chỉnh sở thích trong Cài đặt
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-xs text-gray-500 uppercase font-semibold">
            Môn thể thao quan tâm
          </span>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-bold text-gray-900 leading-tight truncate">
              {preferredSport}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Hạng: {tier || "Thành viên Thể thao"}
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-xs text-gray-500 uppercase font-semibold">
            Thông số Form dáng &amp; Kích cỡ
          </span>
          <div className="flex items-center gap-4 text-sm font-bold text-gray-900">
            <span className="flex items-center gap-1.5">
              <span className="text-gray-500 font-normal">Cỡ giày:</span>{" "}
              {shoeSize || "42 EU"}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <span className="text-gray-500 font-normal">Trang phục:</span> L (Asian-fit)
            </span>
          </div>
          <span className="text-xs text-green-600 flex items-center gap-1.5">
            <CheckCircle2 size={14} />
            Tối ưu cho vóc dáng thể thao
          </span>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
          <span className="text-xs text-gray-500 uppercase font-semibold">
            Mức độ phù hợp sở thích
          </span>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden flex my-1">
            <div className="bg-blue-600 h-full w-[95%]" title="Độ phù hợp: 95%"></div>
          </div>
          <p className="text-xs text-gray-600 truncate">
            Đã cập nhật theo các nhóm sản phẩm thể thao bạn yêu thích.
          </p>
        </div>
      </div>
    </div>
  );
}
