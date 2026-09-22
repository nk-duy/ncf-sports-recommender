import React from "react";
import { BadgeCheck, RefreshCcw, ShieldCheck, BrainCircuit } from "lucide-react";

export default function CheckoutCommitments() {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 mt-4 space-y-4">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        Cam kết độc quyền SportsAI
      </div>
      <ul className="space-y-3 text-sm text-gray-600 font-medium">
        <li className="flex items-start gap-3 text-gray-900">
          <BadgeCheck size={18} className="text-green-700 mt-0.5 flex-shrink-0" />
          <span>100% Chính hãng phân phối trực tiếp</span>
        </li>
        <li className="flex items-start gap-3 text-gray-900">
          <RefreshCcw size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <span>Đổi size miễn phí trong 30 ngày tại nhà</span>
        </li>
        <li className="flex items-start gap-3 text-gray-900">
          <ShieldCheck size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <span>Bảo hành hiệu năng thể thao 12 tháng</span>
        </li>
        <li className="flex items-start gap-3 text-gray-900">
          <BrainCircuit size={18} className="text-green-700 mt-0.5 flex-shrink-0" />
          <span>Hỗ trợ đo size chân AI trực tuyến 24/7</span>
        </li>
      </ul>
    </div>
  );
}
