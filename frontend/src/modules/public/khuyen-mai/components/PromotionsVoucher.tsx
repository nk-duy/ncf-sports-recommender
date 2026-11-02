"use client";

import { useEffect, useState } from "react";
import { Check, Ticket } from "lucide-react";
import { notifications } from "@mantine/notifications";
import type { VoucherItem } from "../types";
import VoucherTicketCard from "./VoucherTicketCard";

const VOUCHER_TABS = [
  { id: "all", label: "Tất cả mã" },
  { id: "freeship", label: "Freeship 0Đ" },
  { id: "cash", label: "Giảm tiền mặt" },
  { id: "percent", label: "Giảm theo %" },
];

export default function PromotionsVoucher() {
  const [vouchers, setVouchers] = useState<VoucherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [savedCodes, setSavedCodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/vouchers/")
      .then((res) => res.json())
      .then((data: VoucherItem[] | { items?: VoucherItem[] }) => {
        const list = Array.isArray(data) ? data : data.items || [];
        setVouchers(list.filter((v) => v.is_active));
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

  const filteredVouchers = vouchers.filter((v) => {
    if (activeTab === "all") return true;
    if (activeTab === "freeship") return v.code.includes("FREESHIP");
    if (activeTab === "cash") return v.discount_type === "fixed" && !v.code.includes("FREESHIP");
    if (activeTab === "percent") return v.discount_type === "percent";
    return true;
  });

  return (
    <section id="kho-voucher" className="mb-14 scroll-mt-24">
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

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
          {VOUCHER_TABS.map((tab) => (
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
          {filteredVouchers.map((v) => (
            <VoucherTicketCard
              key={v._id || v.id || v.code}
              voucher={v}
              isSaved={Boolean(savedCodes[v.code])}
              onSave={handleSaveVoucher}
            />
          ))}
        </div>
      )}
    </section>
  );
}
