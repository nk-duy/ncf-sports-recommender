import React from "react";
import { Verified } from "lucide-react";

export default function OrderSummary() {
  return (
    <div className="lg:col-span-8 bg-white rounded-lg p-5 sm:p-7 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Sản phẩm trong đơn hàng</h2>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">4 sản phẩm • Đã đồng bộ kiểm kho tự động</p>
        </div>
        <span className="font-mono text-sm bg-gray-50 px-2.5 py-1 rounded text-gray-600 font-semibold border border-gray-100">#DH-8942</span>
      </div>
      
      {/* Product List */}
      <div className="divide-y divide-gray-100">
        {/* Item 1 */}
        <div className="py-4 flex gap-4 items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100">
            <img alt="Giày Chạy Bộ Marathon Carbon Alpha Pro" className="w-full h-full object-cover aspect-square" src="https://lh3.googleusercontent.com/aida/AEtjO1VzOz38bMViBJu1Cwk0ZSa_JegrzFwWl9ADfM9Ip8GPls_L_mqi1oPvQilXD3TElD48zWyfAaPZIDZPAJ29peibqwfa5oHgevOysDu5gXidyG1upPcsePVvzARP5m8ltPEusHqYJELrql3pi28FXBzgy5bCWaN3HWXfi7pnkaaAlRVXy7VKuA1am5Y2jhxKq6yrX6222znV0RqFAerg3B9Eidx9pbYtd9a5z7VgeSOcTQ0BI3q7uoe8HLs"/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900 truncate">Giày Chạy Bộ Marathon Carbon Alpha Pro</h3>
              <span className="text-sm font-bold text-gray-900 whitespace-nowrap">2.450.000 đ</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
              <span>Màu: Xanh/Trắng</span>
              <span>•</span>
              <span>Size: 42 EU</span>
              <span>•</span>
              <span>SL: 1</span>
            </div>
            <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-bold">
              <Verified size={12} className="text-green-600" />
              Chính hãng SportsAI Pro
            </span>
          </div>
        </div>

        {/* Item 2 */}
        <div className="py-4 flex gap-4 items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100">
            <img alt="Áo Thun Thể Thao Dry-Fit Pro Training" className="w-full h-full object-cover aspect-square" src="https://lh3.googleusercontent.com/aida/AEtjO1VrmdKDLjPmzvyqGRQWNVkukG-qIX-C058T_CymrjwywHcC2umdTmrD-CdO-VIJ0Fq6ew4hTwJJvBLG8UAovWrWwuG6bXw4s689jWZDibCCZ4lGq91j4ffI1j-jFLKjwHJAwwBABGTRLH9XLxYqdGGoTPbd2aBa9imWLOUIbFlJcqp6kXYbYW1LefX6DrpGuhq_OCS46E3paW1L48pHjsrynLbHwU0Xn9ZAzVRIxI1gPDpfNLCWMUmrzA"/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900 truncate">Áo Thun Thể Thao Dry-Fit Pro Training</h3>
              <span className="text-sm font-bold text-gray-900 whitespace-nowrap">700.000 đ</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
              <span>Màu: Xám Đen</span>
              <span>•</span>
              <span>Size: L</span>
              <span>•</span>
              <span>SL: 2 (350.000 đ/áo)</span>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="py-4 flex gap-4 items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-gray-50 flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100">
            <img alt="Thảm Tập Yoga Định Tuyến TPE 6mm Chống Trượt" className="w-full h-full object-cover aspect-square" src="https://lh3.googleusercontent.com/aida/AEtjO1XsP8M-61RdwnpqhQPISZJ62louLOP0YU2rknEU2uifWRfeBVfh1Qt0okVaYYNLvUcLB8mciBIIGNxCSH9QwN_1CkZ4CWGyuUzLyJLDDlfc3Y0zncU1UkJAQK9F3JyRlvWm9VZK8TuPQRnPLy8SgJV1n535HkEBF8r804Qsc_nM41ihKMssGvXtbznpfLTGceND8IzO6-fohY2Qx3Mb5wdwhlF_jS0CPMBwVrvi3Ojh8te7Py1IBN9yBQ"/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-gray-900 truncate">Thảm Tập Yoga Định Tuyến TPE 6mm Chống Trượt</h3>
              <span className="text-sm font-bold text-gray-900 whitespace-nowrap">450.000 đ</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
              <span>Màu: Xanh Rêu</span>
              <span>•</span>
              <span>Dày: 6mm TPE</span>
              <span>•</span>
              <span>SL: 1</span>
            </div>
          </div>
        </div>

        {/* Item 4 */}
        <div className="py-4 flex gap-4 items-center bg-green-50/40 -mx-5 sm:-mx-7 px-5 sm:px-7">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-white flex-shrink-0 overflow-hidden flex items-center justify-center border border-gray-100">
            <img alt="Bộ Dây Kháng Lực Latex Tập Thể Lực Đa Năng SportsAI" className="w-full h-full object-cover aspect-square" src="https://lh3.googleusercontent.com/aida/AEtjO1XUzUB9Wr9yxJGSvrJMmf50tUvtKZ1wBgLD702_K_dDKHOnxL8zt3Wtp-HomsilsvNemBsDN7RP9CJZBwun70FJYpck8UwwZukkeC13VimZmFix3oTogZ9dP6lmZgLMalrQUBZtwjtf9w6zuQcFvEBsO7iWSoRAnLpdXl4akAdmffo7D1CdjyboRHGTPVlIREwqfMQUjiKR9tUymv993kTj_q4pdCJt1amnBiIkHVRW2XLiE34EUXlkEg"/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-gray-900 truncate">Bộ Dây Kháng Lực Latex Tập Thể Lực Đa Năng</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] bg-green-700 text-white px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Ưu đãi kèm AI -40%</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900 whitespace-nowrap">190.000 đ</span>
                <span className="block text-xs text-gray-400 line-through mt-0.5">320.000 đ</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 font-medium">
              <span>Set 5 cấp độ</span>
              <span>•</span>
              <span>SL: 1</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Cost Breakdown */}
      <div className="pt-5 mt-2 border-t border-gray-100 space-y-3 text-sm">
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Tạm tính sản phẩm</span>
          <span className="font-mono text-gray-900 font-bold">3.790.000 đ</span>
        </div>
        <div className="flex justify-between text-gray-500 font-medium">
          <span className="flex items-center gap-2">
            Phí vận chuyển tiêu chuẩn
            <span className="bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border border-green-100">Freeship đơn &gt; 500k</span>
          </span>
          <span className="font-mono text-green-700 font-bold">0 đ</span>
        </div>
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Đặc quyền Hội viên SportsAI VIP (Gold - 5%)</span>
          <span className="font-mono text-red-600 font-bold">-180.000 đ</span>
        </div>
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Voucher trợ giá thuật toán NCF</span>
          <span className="font-mono text-red-600 font-bold">-50.000 đ</span>
        </div>
        <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline mt-2">
          <div>
            <span className="font-bold text-gray-900 text-base">Tổng tiền đã thanh toán</span>
            <p className="text-xs text-gray-400 font-medium mt-1">(Đã bao gồm VAT và các loại thuế phí)</p>
          </div>
          <span className="text-2xl text-blue-600 font-bold">3.560.000 đ</span>
        </div>
      </div>
    </div>
  );
}
