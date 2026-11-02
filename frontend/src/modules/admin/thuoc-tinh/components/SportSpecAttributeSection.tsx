'use client';

import React from 'react';
import { Activity, Sparkles, X, Plus } from 'lucide-react';

interface SportSpecAttributeSectionProps {
  sportSpecs: string[];
  newSpecInput: string;
  onNewSpecInputChange: (val: string) => void;
  onAddSpec: () => void;
  onRemoveSpec: (idx: number) => void;
}

export default function SportSpecAttributeSection({
  sportSpecs,
  newSpecInput,
  onNewSpecInputChange,
  onAddSpec,
  onRemoveSpec,
}: SportSpecAttributeSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col hover:border-slate-300 transition-colors">
      <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="size-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-base">Thông số Kỹ thuật Thể thao Đặc thù</h2>
            <p className="text-xs text-slate-500">
              Trọng lượng vợt cầu lông/pickleball, loại mặt đinh bóng đá, độ căng dây, size bóng (<span className="tabular-nums font-semibold">{sportSpecs.length}</span>)
            </p>
          </div>
        </div>
        <span className="whitespace-nowrap inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
          Sport Specs
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex flex-wrap gap-2 min-h-[60px] content-start">
          {sportSpecs.map((spec, idx) => (
            <div 
              key={idx}
              className="group flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-semibold text-slate-700 hover:text-indigo-800 transition-colors"
            >
              <Sparkles size={12} className="text-indigo-500" />
              <span>{spec}</span>
              <button 
                onClick={() => onRemoveSpec(idx)} 
                className="size-5 inline-flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors ml-0.5 rounded-md hover:bg-white cursor-pointer"
                title={`Xóa ${spec}`}
                aria-label={`Xóa ${spec}`}
              >
                <X size={13} />
              </button>
            </div>
          ))}
          {sportSpecs.length === 0 && (
            <p className="text-slate-400 text-sm italic py-2">Chưa có thông số thể thao nào</p>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={newSpecInput}
            onChange={e => onNewSpecInputChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onAddSpec(); } }}
            placeholder="Thêm thông số mới (ví dụ: Vợt 4U-G5, Đinh dăm TF, Căng dây 11kg...)"
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition font-medium text-slate-900"
          />
          <button
            onClick={onAddSpec}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 transition-colors duration-150 shadow-xs cursor-pointer"
          >
            <Plus size={16} /> Thêm thông số
          </button>
        </div>
      </div>
    </div>
  );
}
