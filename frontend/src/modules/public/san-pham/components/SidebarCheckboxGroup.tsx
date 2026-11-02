'use client';

import { Check } from 'lucide-react';

interface SidebarCheckboxGroupProps {
  title: string;
  options: string[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export default function SidebarCheckboxGroup({
  title,
  options,
  selectedValues,
  onToggle,
}: SidebarCheckboxGroupProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{title}</h3>
        {selectedValues.length > 0 && (
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
            Đã chọn {selectedValues.length}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {options.map((item, idx) => {
          const checked = selectedValues.includes(item);
          return (
            <label
              key={idx}
              onClick={() => onToggle(item)}
              className="flex items-center justify-between cursor-pointer group select-none"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                  }`}
                >
                  {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span
                  className={`text-sm ${
                    checked ? 'text-blue-700 font-semibold' : 'text-gray-600 group-hover:text-gray-900'
                  }`}
                >
                  {item}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
