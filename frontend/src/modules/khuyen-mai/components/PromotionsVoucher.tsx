"use client";

import React, { useState, useEffect } from "react";

export default function PromotionsVoucher() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/vouchers/")
      .then(res => res.json())
      .then(data => {
        // Handle both direct array and paginated response
        const list = Array.isArray(data) ? data : (data.items || []);
        setVouchers(list.filter((v: any) => v.is_active));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getColorConfig = (index: number, code: string) => {
    if (code.includes("FREESHIP")) return { btnColor: "bg-blue-600 hover:bg-blue-700", tagColor: "text-blue-600 bg-blue-100", tag: "FREESHIP EXTRA", iconColor: "text-blue-500" };
    if (code.includes("WELCOME")) return { btnColor: "bg-emerald-600 hover:bg-emerald-700", tagColor: "text-emerald-600 bg-emerald-100", tag: "KHÁCH MỚI", iconColor: "text-emerald-500" };
    const configs = [
      { btnColor: "bg-red-600 hover:bg-red-700", tagColor: "text-red-600 bg-red-100", tag: "SIÊU SALE", iconColor: "text-red-500" },
      { btnColor: "bg-amber-500 hover:bg-amber-600", tagColor: "text-amber-600 bg-amber-100", tag: "ĐỘC QUYỀN", iconColor: "text-amber-500" },
      { btnColor: "bg-purple-600 hover:bg-purple-700", tagColor: "text-purple-600 bg-purple-100", tag: "VOUCHER HOT", iconColor: "text-purple-500" }
    ];
    return configs[index % configs.length];
  };

  const formatCurrency = (value: number) => {
    return value >= 1000 ? `${value / 1000}k` : `${value}đ`;
  };

  const formatDescription = (v: any) => {
    let desc = "";
    if (v.discount_type === "percent") {
      desc = `Giảm ${v.discount_value}%`;
      if (v.max_discount) desc += ` tối đa ${formatCurrency(v.max_discount)}`;
    } else {
      desc = `Giảm ngay ${formatCurrency(v.discount_value)}`;
    }
    return desc;
  };

  const formatCondition = (v: any) => {
    if (v.min_order_value > 0) return `Đơn từ ${formatCurrency(v.min_order_value)}`;
    return "Mọi đơn hàng";
  };

  const calculateProgress = (used: number, limit: number) => {
    if (!limit) return null;
    return Math.min(Math.round((used / limit) * 100), 100);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-red-600 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-gray-900">
            KHO VOUCHER KHUYẾN MÃI TOÀN SÀN
          </h2>
          <span className="hidden md:inline-block px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
            Cập nhật tự động
          </span>
        </div>
        <a href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
          Xem tất cả ({vouchers.length})
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vouchers.map((voucher, index) => {
            const config = getColorConfig(index, voucher.code);
            const progress = calculateProgress(voucher.used_count || 0, voucher.usage_limit);

            return (
              <div key={voucher._id || voucher.id || index} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:border-red-200 transition-all flex group">
                {/* Left side (Discount style notch) */}
                <div className="w-4 bg-gray-50 flex flex-col justify-between items-center py-2 border-r border-dashed border-gray-300">
                  <div className="w-3 h-3 bg-white rounded-full -ml-2 border border-gray-200 group-hover:border-red-200 transition-colors"></div>
                  <div className="w-3 h-3 bg-white rounded-full -ml-2 border border-gray-200 group-hover:border-red-200 transition-colors"></div>
                  <div className="w-3 h-3 bg-white rounded-full -ml-2 border border-gray-200 group-hover:border-red-200 transition-colors"></div>
                </div>
                
                {/* Main content */}
                <div className="flex-1 p-4 flex flex-col relative">
                  <div className="absolute top-4 right-4">
                    <svg className={`w-6 h-6 ${config.iconColor} opacity-20`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="mb-2">
                    <span className={`inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-sm mb-2 ${config.tagColor}`}>
                      {config.tag}
                    </span>
                    <h3 className="font-bold text-gray-900 leading-tight">Mã {voucher.code}</h3>
                    <p className="text-xs text-gray-800 font-semibold mt-1">{formatDescription(voucher)}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{formatCondition(voucher)}</p>
                  </div>
                  
                  <div className="mt-auto pt-3">
                    {progress !== null && (
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                        <div className={`${config.btnColor.split(' ')[0]} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {progress !== null ? `Đã dùng ${progress}%` : (voucher.valid_until ? `HSD: ${new Date(voucher.valid_until).toLocaleDateString('vi-VN')}` : 'Không thời hạn')}
                      </span>
                      <button className={`px-4 py-1.5 rounded-full text-white text-xs font-bold transition-colors ${config.btnColor}`}>
                        Lưu mã
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
