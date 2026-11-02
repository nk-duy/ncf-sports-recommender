import React from "react";
import { ArrowLeftRight, ShieldCheck, Headset } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left print:hidden">
      <div className="bg-white p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200/80 shadow-xs">
        <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <ArrowLeftRight size={18} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-900">Đổi size tận nơi 30 ngày</h4>
          <p className="text-xs text-slate-500 font-medium">Không vừa chân, đổi lại miễn phí 100%.</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200/80 shadow-xs">
        <div className="size-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <ShieldCheck size={18} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-900">Bảo hành thể thao 12 tháng</h4>
          <p className="text-xs text-slate-500 font-medium">Cam kết chính hãng bằng mã kích hoạt AI.</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200/80 shadow-xs">
        <div className="size-10 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
          <Headset size={18} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-slate-900">Trực ban hỗ trợ 24/7</h4>
          <p className="text-xs text-slate-500 font-medium">Hotline: 1900 6868 (Miễn cước).</p>
        </div>
      </div>
    </section>
  );
}
