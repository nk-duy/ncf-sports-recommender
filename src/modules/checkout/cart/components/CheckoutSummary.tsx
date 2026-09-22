import React from "react";
import Link from "next/link";
import { Verified, Info, ArrowRight } from "lucide-react";

export default function CheckoutSummary() {
  return (
    <div className="bg-white p-5 sm:p-7 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Tóm tắt đơn hàng</h2>
        <span className="font-mono text-xs font-semibold text-gray-400">SportsAI #8942</span>
      </div>

      {/* Voucher Input */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-600" htmlFor="voucher-code">Mã giảm giá / AI Voucher</label>
        <div className="flex items-center gap-2">
          <input 
            className="flex-1 h-10 px-3 rounded-md bg-gray-50 border border-gray-200 text-gray-900 font-mono text-sm uppercase focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors" 
            id="voucher-code" 
            type="text" 
            defaultValue="SPORTSAI99"
          />
          <button className="h-10 px-4 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-md transition-colors" type="button">
            Áp dụng
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-green-700 font-semibold text-xs pt-1">
          <Verified size={14} />
          Mã SPORTSAI99: Đã trừ trực tiếp 50.000 đ
        </div>
      </div>

      <div className="w-full h-px bg-gray-100"></div>

      {/* Financial Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Tạm tính (4 món):</span>
          <span className="font-mono text-gray-900 font-bold">3.600.000 đ</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Phí vận chuyển:</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="line-through text-gray-400">35.000 đ</span>
            <span className="text-green-700 font-bold">0 đ (Freeship)</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span className="flex items-center gap-1">
            Ưu đãi Gold Member (5%):
            <Info size={14} className="text-gray-400" title="Đặc quyền thành viên VIP" />
          </span>
          <span className="font-mono text-green-700 font-bold">-180.000 đ</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Khuyến mãi AI Voucher:</span>
          <span className="font-mono text-green-700 font-bold">-50.000 đ</span>
        </div>
      </div>

      <div className="w-full h-px bg-gray-100"></div>

      {/* Total Calculation */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-sm font-bold text-gray-900 uppercase tracking-wider block">Tổng thanh toán</span>
          <span className="text-[11px] text-gray-400 font-semibold">(Đã bao gồm thuế VAT 8%)</span>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-black text-gray-900 leading-none">3.370.000 đ</div>
          <div className="text-xs font-semibold text-green-700 mt-1.5">Tiết kiệm tổng cộng 230.000 đ</div>
        </div>
      </div>

      {/* Primary CTA Button (Strictly Flat Black) */}
      <div className="mt-2">
        <Link href="/checkout/success" className="w-full h-12 bg-gray-900 hover:bg-black text-white text-base font-bold uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm">
          <span>Đặt hàng &amp; Thanh toán</span>
          <ArrowRight size={20} />
        </Link>
        <div className="text-center text-xs font-medium text-gray-400 mt-3">
          Nhấn "Đặt hàng" đồng nghĩa chấp thuận Điều khoản dịch vụ SportsAI
        </div>
      </div>
    </div>
  );
}
