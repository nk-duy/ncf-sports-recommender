'use client';

import { Database } from 'lucide-react';

interface DbSchemaSidebarProps {
  selectedModule: string;
  onSelectModule: (mod: string) => void;
}

export default function DbSchemaSidebar({
  selectedModule,
  onSelectModule,
}: DbSchemaSidebarProps) {
  return (
    <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 print:hidden space-y-6">
      {/* Brand Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white p-5 shadow-lg shadow-teal-500/15">
        <div className="relative z-10">
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black tracking-widest uppercase mb-2">
            DATABASE DESIGN
          </span>
          <h1 className="text-2xl font-black tracking-tight leading-tight mb-2">
            KADY Sports
          </h1>
          <p className="text-xs text-emerald-50 font-medium leading-relaxed opacity-95">
            Schema NoSQL (MongoDB + Beanie ODM) cho hệ thống E-commerce thể thao tích hợp gợi ý Neural Collaborative Filtering (NCF).
          </p>
        </div>
      </div>

      {/* Stat Metric Boxes */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-slate-900 font-mono">5</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Modules</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-teal-600 font-mono">12</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Tables</div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 text-center shadow-sm">
          <div className="text-2xl font-black text-amber-500 font-mono">162</div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Columns</div>
        </div>
      </div>

      {/* Module Filter List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800">
            Tất cả module
          </span>
          <span className="px-2 py-0.5 bg-slate-900 text-white rounded-full text-[11px] font-mono font-bold">
            12
          </span>
        </div>

        <div className="space-y-1.5 text-sm">
          <button
            onClick={() => onSelectModule('all')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left font-semibold transition-all ${
              selectedModule === 'all'
                ? 'bg-teal-50 text-teal-700 border border-teal-200 font-bold'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 ring-4 ring-teal-100"></span>
              <span>Tất cả Collections</span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">12</span>
          </button>

          <button
            onClick={() => onSelectModule('auth')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
              selectedModule === 'auth'
                ? 'bg-teal-50 text-teal-700 border border-teal-200 font-bold'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <div>
                <div className="text-xs font-bold text-slate-900">Authentication &amp; Users</div>
                <div className="text-[11px] text-slate-400 font-normal">users · 1 collection</div>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">1</span>
          </button>

          <button
            onClick={() => onSelectModule('catalog')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
              selectedModule === 'catalog'
                ? 'bg-teal-50 text-teal-700 border border-teal-200 font-bold'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <div>
                <div className="text-xs font-bold text-slate-900">Product &amp; MegaMenu</div>
                <div className="text-[11px] text-slate-400 font-normal">products, menu, attrs · 3 colls</div>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">3</span>
          </button>

          <button
            onClick={() => onSelectModule('order')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
              selectedModule === 'order'
                ? 'bg-teal-50 text-teal-700 border border-teal-200 font-bold'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <div>
                <div className="text-xs font-bold text-slate-900">Order &amp; Promotion</div>
                <div className="text-[11px] text-slate-400 font-normal">orders, vouchers, banners · 3 colls</div>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">3</span>
          </button>

          <button
            onClick={() => onSelectModule('ai')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
              selectedModule === 'ai'
                ? 'bg-teal-50 text-teal-700 border border-teal-200 font-bold'
                : 'text-slate-600 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <div>
                <div className="text-xs font-bold text-slate-900">AI NCF &amp; Interactions</div>
                <div className="text-[11px] text-slate-400 font-normal">interactions, reviews, ncf · 3 entities</div>
              </div>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">3</span>
          </button>
        </div>
      </div>

      {/* Conventions Box */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 text-slate-600 text-xs space-y-1.5 shadow-sm">
        <div className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <Database className="w-3.5 h-3.5 text-teal-600" />
          Quy ước kiến trúc CSDL
        </div>
        <p className="leading-relaxed text-[11px] text-slate-500">
          • <span className="font-semibold text-slate-700">Khóa chính:</span> BSON <code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded">_id: ObjectId</code> tự động sinh hoặc gán mã nghiệp vụ (<code className="text-slate-800 bg-slate-100 px-1 py-0.5 rounded">product_id: ASIN</code>).
        </p>
        <p className="leading-relaxed text-[11px] text-slate-500">
          • <span className="font-semibold text-slate-700">Kiến trúc AI:</span> Dữ liệu tương tác phản hồi ngầm (Implicit Feedback) được ánh xạ qua ma trận Vector nhúng 16/32 chiều.
        </p>
      </div>
    </aside>
  );
}
