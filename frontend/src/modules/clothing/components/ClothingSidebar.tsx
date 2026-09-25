'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ClothingSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('?');
  };

  const currentSize = searchParams.get('sizes');
  const currentColor = searchParams.get('colors');

  return (
    <div className="w-full">
      <div className="bg-white p-6 mb-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-bold text-gray-900 text-xl tracking-wider uppercase">
            Filters
          </h2>
          <button onClick={clearFilters} className="text-sm text-red-500 font-semibold hover:underline">
            Xoá bộ lọc
          </button>
        </div>

        <div className="w-full h-px bg-gray-200 mb-6"></div>

        {/* Kích thước */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Size</h3>
          <div className="flex flex-col space-y-3">
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => {
              const isChecked = currentSize === size;
              return (
                <label key={size} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); handleFilterChange('sizes', size); }}>
                  <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${isChecked ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-white group-hover:border-gray-500'}`}>
                    {isChecked && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base text-gray-800">{size}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 mb-6"></div>

        {/* Màu sắc */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Màu</h3>
          <div className="flex flex-col space-y-3">
            {[
              { val: 'Cam', bg: 'bg-orange-500' },
              { val: 'Đỏ', bg: 'bg-red-500' },
              { val: 'Trắng', bg: 'bg-white border border-gray-300' },
              { val: 'Trắng Đỏ', bg: 'bg-gradient-to-r from-white to-red-500 border border-gray-300' },
              { val: 'Trắng Xanh', bg: 'bg-gradient-to-r from-white to-teal-500 border border-gray-300' },
              { val: 'Vàng', bg: 'bg-yellow-400' },
              { val: 'Xanh Đen', bg: 'bg-slate-800' },
              { val: 'Xanh Dương', bg: 'bg-blue-400' },
              { val: 'Xanh Lá', bg: 'bg-emerald-400' },
              { val: 'Xanh Navy', bg: 'bg-indigo-800' },
              { val: 'Xám', bg: 'bg-gray-400' },
              { val: 'Đen', bg: 'bg-black' },
              { val: 'Hồng', bg: 'bg-pink-400' },
            ].map((color, idx) => {
              const isChecked = currentColor === color.val;
              return (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); handleFilterChange('colors', color.val); }}>
                  <div className={`w-5 h-5 border rounded flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'border-gray-900 bg-gray-900' : 'border-gray-300 bg-white group-hover:border-gray-500'}`}>
                    {isChecked && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className={`w-8 h-5 rounded-sm shrink-0 ${color.bg} ${!color.bg.includes('border') ? 'shadow-sm' : ''}`}></div>
                  <span className="text-base text-gray-800 truncate">{color.val}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
