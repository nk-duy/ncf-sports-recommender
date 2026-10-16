"use client";

import React, { useState, useEffect } from "react";
import { Ticket, Check, Sparkles, Truck, Users, Gift, Percent, Copy } from "lucide-react";
import { notifications } from "@mantine/notifications";

interface VoucherItem {
  _id?: string;
  id?: string;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount?: number | null;
  usage_limit: number;
  used_count: number;
  is_active: boolean;
  valid_until?: string;
}

export default function PromotionsVoucher() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [savedCodes, setSavedCodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/vouchers/")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data.items || [];
        setVouchers(list.filter((v: VoucherItem) => v.is_active));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi tải voucher:", err);
        setLoading(false);
      });
  }, []);

  const handleSaveVoucher = (v: VoucherItem) => {
    navigator.clipboard.writeText(v.code);
    setSavedCodes((prev) => ({ ...prev, [v.code]: true }));

    notifications.show({
      title: `Đã lưu mã: ${v.code}`,
      message: `Đã sao chép mã ${v.code} vào bộ nhớ tạm. Hãy áp dụng ở bước Thanh toán!`,
      color: "teal",
      icon: <Check size={16} />,
      autoClose: 2500,
    });
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `${val / 1000000}Tr`;
    if (val >= 1000) return `${val / 1000}K`;
    return `${val}đ`;
  };

  const getVoucherStyle = (v: VoucherItem) => {
    if (v.code.includes("FREESHIP")) {
      return {
        badgeBg: "bg-blue-100 text-blue-700 border-blue-200",
        tag: "FREESHIP TOÀN SÀN",
        accent: "from-blue-600 to-cyan-600",
        btnColor: "bg-blue-600 hover:bg-blue-700",
        icon: Truck,
        iconColor: "text-blue-500",
      };
    }
    if (v.code.includes("WELCOME") || v.code.includes("NEWBIE")) {
      return {
        badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
        tag: "KHÁCH HÀNG MỚI",
        accent: "from-emerald-600 to-teal-600",
        btnColor: "bg-emerald-600 hover:bg-emerald-700",
        icon: Users,
        iconColor: "text-emerald-500",
      };
    }
    if (v.code.includes("MEGA") || v.discount_value >= 100000) {
      return {
        badgeBg: "bg-purple-100 text-purple-700 border-purple-200",
        tag: "SIÊU VOUCHER",
        accent: "from-purple-600 to-indigo-600",
        btnColor: "bg-purple-600 hover:bg-purple-700",
        icon: Sparkles,
        iconColor: "text-purple-500",
      };
    }
    return {
      badgeBg: "bg-red-100 text-red-700 border-red-200",
      tag: "VOUCHER HOT",
      accent: "from-red-600 to-amber-600",
      btnColor: "bg-red-600 hover:bg-red-700",
      icon: Percent,
      iconColor: "text-red-500",
    };
  };

  const filteredVouchers = vouchers.filter((v) => {
    if (activeTab === "all") return true;
    if (activeTab === "freeship") return v.code.includes("FREESHIP");
    if (activeTab === "cash") return v.discount_type === "fixed" && !v.code.includes("FREESHIP");
    if (activeTab === "percent") return v.discount_type === "percent";
    return true;
  });

  return (
    <section id="kho-voucher" className="mb-14 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-lg bg-red-100 text-red-600">
              <Ticket className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-red-600">
              ƯU ĐÃI KHÔNG GIỚI HẠN
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900">
            KHO VOUCHER THỂ THAO TOÀN SÀN
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Lưu mã ngay để nhận giảm giá trực tiếp khi đặt hàng. Số lượng có hạn theo ngày!
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          {[
            { id: "all", label: "Tất cả mã" },
            { id: "freeship", label: "Freeship 0Đ" },
            { id: "cash", label: "Giảm tiền mặt" },
            { id: "percent", label: "Giảm theo %" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Vouchers */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredVouchers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
          Không có voucher nào trong danh mục này.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVouchers.map((v) => {
            const style = getVoucherStyle(v);
            const isSaved = savedCodes[v.code];
            const usagePercent = v.usage_limit
              ? Math.min(Math.round(((v.used_count || 0) / v.usage_limit) * 100), 100)
              : null;

            return (
              <div
                key={v._id || v.id || v.code}
                className="group relative bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
              >
                {/* Top Notch Accent Banner */}
                <div className={`h-2 bg-gradient-to-r ${style.accent}`} />

                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  {/* Badge & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${style.badgeBg}`}>
                      {style.tag}
                    </span>
                    <span className="text-slate-400">
                      <style.icon className={`w-5 h-5 ${style.iconColor}`} />
                    </span>
                  </div>

                  {/* Discount Value */}
                  <div className="mb-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                      {v.discount_type === "percent"
                        ? `GIẢM ${v.discount_value}%`
                        : `GIẢM ${formatCurrency(v.discount_value)}`}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      {v.min_order_value > 0
                        ? `Đơn tối thiểu ${formatCurrency(v.min_order_value)}`
                        : "Áp dụng cho mọi đơn hàng"}
                    </p>
                    {v.max_discount && (
                      <p className="text-[11px] text-slate-400">
                        Giảm tối đa {formatCurrency(v.max_discount)}
                      </p>
                    )}
                  </div>

                  {/* Usage Progress Bar */}
                  {usagePercent !== null && (
                    <div className="my-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Đã dùng {usagePercent}%</span>
                        {usagePercent >= 80 && (
                          <span className="text-red-500 font-black">SẮP CHÁY HÀNG</span>
                        )}
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${style.accent}`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Voucher Code Strip & Button */}
                  <div className="mt-auto pt-3 border-t border-dashed border-slate-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-bold">
                      <span>{v.code}</span>
                    </div>

                    <button
                      onClick={() => handleSaveVoucher(v)}
                      className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        isSaved
                          ? "bg-emerald-600 text-white"
                          : `${style.btnColor} text-white hover:shadow-md transform hover:-translate-y-0.5`
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          ĐÃ LƯU
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          LƯU MÃ
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Serrated Ticket Cutout Notches on Left & Right */}
                <div className="absolute top-1/2 -left-2.5 w-5 h-5 bg-slate-50 rounded-full border-r border-slate-200 -translate-y-1/2 pointer-events-none" />
                <div className="absolute top-1/2 -right-2.5 w-5 h-5 bg-slate-50 rounded-full border-l border-slate-200 -translate-y-1/2 pointer-events-none" />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
