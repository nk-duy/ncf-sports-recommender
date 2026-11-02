'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { CollectionSchema } from '../types';

interface CollectionSchemaCardProps {
  schema: CollectionSchema;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export default function CollectionSchemaCard({
  schema,
  isExpanded,
  onToggle,
}: CollectionSchemaCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300 print:border print:shadow-none print:break-inside-avoid">
      {/* Card Header */}
      <div
        onClick={() => onToggle(schema.id)}
        className="cursor-pointer p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 select-none hover:bg-slate-50/60 transition-colors"
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="size-10 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm font-sans tabular-nums shrink-0 shadow-xs">
            {schema.prefix}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-base sm:text-lg font-bold font-sans text-slate-900">
                {schema.name}
              </span>
              {schema.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-700">
              {schema.title}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {schema.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 print:hidden">
          <span className="text-xs font-sans tabular-nums font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Columns <b className="text-slate-800 tabular-nums">{schema.fields.length}</b>
          </span>
          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
            {isExpanded ? 'Thu gọn' : 'Mở rộng'}
          </span>
          {isExpanded ? (
            <ChevronUp size={18} className="text-slate-400" />
          ) : (
            <ChevronDown size={18} className="text-slate-400" />
          )}
        </div>
      </div>

      {/* Card Table */}
      {isExpanded && (
        <div className="border-t border-slate-200/90 overflow-x-auto print:block">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0b1329] text-white">
              <tr>
                <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-300 uppercase py-3 px-4 sm:px-6 w-1/4">
                  CỘT / TRƯỜNG DỮ LIỆU
                </th>
                <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-300 uppercase py-3 px-4 sm:px-6 w-1/4">
                  KIỂU DỮ LIỆU
                </th>
                <th className="whitespace-nowrap text-xs font-semibold tracking-wider text-slate-300 uppercase py-3 px-4 sm:px-6 w-1/2">
                  GHI CHÚ NGHIỆP VỤ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {schema.fields.map((field, fIdx) => (
                <tr key={fIdx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 sm:px-6 font-sans font-semibold text-slate-900">
                    {field.name}
                  </td>
                  <td className="py-3 px-4 sm:px-6">
                    <span
                      className={`whitespace-nowrap inline-flex items-center px-2 py-0.5 rounded-md font-sans text-xs border font-medium ${
                        field.isPk
                          ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                          : field.isIndex
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {field.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-slate-600 leading-relaxed">
                    {field.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
