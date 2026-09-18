import React from "react";
import { ArrowLeftRight, ShieldCheck, Headset } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
      <div className="bg-white p-4 rounded-lg flex items-center gap-3 border border-gray-100 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
          <ArrowLeftRight size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900">Đổi size tận nơi 30 ngày</h4>
          <p className="text-xs text-gray-500 font-medium">Không vừa chân, đổi lại miễn phí 100%.</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg flex items-center gap-3 border border-gray-100 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900">Bảo hành thể thao 12 tháng</h4>
          <p className="text-xs text-gray-500 font-medium">Cam kết chính hãng bằng mã kích hoạt AI.</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg flex items-center gap-3 border border-gray-100 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-gray-50 text-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200">
          <Headset size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900">Trực ban hỗ trợ 24/7</h4>
          <p className="text-xs text-gray-500 font-medium">Hotline: 1900 6868 (Miễn cước).</p>
        </div>
      </div>
    </section>
  );
}
