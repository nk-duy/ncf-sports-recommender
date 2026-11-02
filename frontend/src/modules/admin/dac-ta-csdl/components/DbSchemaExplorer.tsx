'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Printer,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { SCHEMAS } from '../data/schemasData';
import DbSchemaSidebar from './DbSchemaSidebar';
import CollectionSchemaCard from './CollectionSchemaCard';

export default function DbSchemaExplorer() {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SCHEMAS.forEach((s) => {
      initial[s.id] = true;
    });
    return initial;
  });

  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const updated: Record<string, boolean> = {};
    SCHEMAS.forEach((s) => {
      updated[s.id] = true;
    });
    setExpandedCards(updated);
  };

  const collapseAll = () => {
    const updated: Record<string, boolean> = {};
    SCHEMAS.forEach((s) => {
      updated[s.id] = false;
    });
    setExpandedCards(updated);
  };

  const handlePrint = () => {
    expandAll();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const filteredSchemas = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return SCHEMAS.filter((schema) => {
      const matchModule = selectedModule === 'all' || schema.module === selectedModule;
      if (!matchModule) return false;
      if (!query) return true;

      const inName = schema.name.toLowerCase().includes(query);
      const inTitle = schema.title.toLowerCase().includes(query);
      const inDesc = schema.description.toLowerCase().includes(query);
      const inFields = schema.fields.some(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.type.toLowerCase().includes(query) ||
          f.note.toLowerCase().includes(query)
      );

      return inName || inTitle || inDesc || inFields;
    });
  }, [selectedModule, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">
      {/* PRINT HEADER BANNER */}
      <div className="hidden print:block pb-6 mb-6 border-b-2 border-slate-900">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs font-black tracking-widest text-teal-600 uppercase">
              ĐẶC TẢ CƠ SỞ DỮ LIỆU NOSQL (MONGODB + PYTORCH NCF)
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              KADY SPORTS &amp; AI RECOMMENDER SYSTEM
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Đồ án tốt nghiệp: Hệ thống thương mại điện tử thể thao tích hợp gợi ý cá nhân hóa Neural Collaborative Filtering
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p className="font-bold text-slate-800">12 Collections &amp; Models</p>
            <p>162 Fields &amp; Schema Specs</p>
            <p>ODM: Beanie / Motor AsyncIO</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <DbSchemaSidebar
          selectedModule={selectedModule}
          onSelectModule={setSelectedModule}
        />

        {/* RIGHT COLUMN: MAIN CONTENT */}
        <main className="flex-1 space-y-6">
          {/* STICKY TOOLBAR */}
          <div className="print:hidden sticky top-0 z-10 bg-slate-50/95 backdrop-blur-md pb-4 pt-1 border-b border-slate-200/80">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm bảng, cột, module, ghi chú... ví dụ: product_id, ncf, variants, rating, voucher"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={expandAll}
                  className="px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronDown size={14} />
                  <span>Mở tất cả</span>
                </button>

                <button
                  onClick={collapseAll}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronUp size={14} />
                  <span>Thu gọn</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={15} />
                  <span>In/PDF</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 mt-2.5">
              <p>
                Đang hiển thị <span className="font-bold text-slate-900 font-sans tabular-nums">{filteredSchemas.length}</span> / <span className="font-sans tabular-nums">{SCHEMAS.length}</span> bảng.
                <span className="text-slate-400 ml-1 hidden sm:inline">Click từng card để mở/đóng. Có thể tìm kiếm theo tên bảng, tên cột hoặc ghi chú nghiệp vụ.</span>
              </p>
            </div>
          </div>

          {/* COLLECTION CARDS */}
          <div className="space-y-6">
            {filteredSchemas.map((schema) => (
              <CollectionSchemaCard
                key={schema.id}
                schema={schema}
                isExpanded={!!expandedCards[schema.id]}
                onToggle={toggleCard}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
