import React from "react";
import { CheckCircle2, Bookmark, Trash2 } from "lucide-react";

export default function CartItems() {
  return (
    <section className="bg-white p-5 sm:p-7 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Giỏ hàng SportsAI</h1>
          <span className="font-mono text-sm text-gray-500">(03 sản phẩm)</span>
        </div>
        <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
          <CheckCircle2 size={16} />
          Đủ điều kiện miễn phí giao hàng toàn quốc
        </span>
      </div>

      {/* Product Item 1 */}
      <article className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 bg-white">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded flex-shrink-0 overflow-hidden border border-gray-100">
            <img alt="Giày Chạy Bộ Marathon Carbon Alpha Pro" className="w-full h-full object-cover aspect-square" src="https://lh3.googleusercontent.com/aida/AEtjO1VzOz38bMViBJu1Cwk0ZSa_JegrzFwWl9ADfM9Ip8GPls_L_mqi1oPvQilXD3TElD48zWyfAaPZIDZPAJ29peibqwfa5oHgevOysDu5gXidyG1upPcsePVvzARP5m8ltPEusHqYJELrql3pi28FXBzgy5bCWaN3HWXfi7pnkaaAlRVXy7VKuA1am5Y2jhxKq6yrX6222znV0RqFAerg3B9Eidx9pbYtd9a5z7VgeSOcTQ0BI3q7uoe8HLs"/>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 font-mono text-[10px] tracking-wider uppercase font-bold">SportsAI Pro</span>
              <span className="text-xs font-semibold text-green-700">Còn hàng</span>
            </div>
            <h2 className="text-sm font-bold text-gray-900 truncate">Giày Chạy Bộ Marathon Carbon Alpha Pro</h2>
            <p className="text-xs text-gray-500">Phiên bản: Xanh/Trắng • Size: 42 EU</p>
            <div className="sm:hidden font-mono text-sm font-bold text-gray-900 mt-1">2.450.000 đ</div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
          {/* Stepper Quantity */}
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md">
            <button className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors rounded-l-md font-bold" type="button">-</button>
            <input className="w-9 h-8 text-center bg-transparent font-mono text-sm font-semibold text-gray-900 focus:outline-none" readOnly type="text" value="1"/>
            <button className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors rounded-r-md font-bold" type="button">+</button>
          </div>
          <div className="text-right hidden sm:block min-w-[120px]">
            <div className="font-mono text-base font-bold text-gray-900 leading-tight">2.450.000 đ</div>
            <div className="font-mono text-xs text-gray-500">Đơn giá: 2.450.000 đ</div>
          </div>
          {/* Action buttons */}
          <div className="flex items-center gap-1 text-gray-400">
            <button className="p-1.5 hover:text-blue-600 transition-colors" title="Lưu lại mua sau" type="button">
              <Bookmark size={20} />
            </button>
            <button className="p-1.5 hover:text-red-600 transition-colors" title="Xóa khỏi giỏ hàng" type="button">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </article>

      <div className="w-full h-px bg-gray-100 my-2"></div>

      {/* Product Item 2 */}
      <article className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 bg-white">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded flex-shrink-0 overflow-hidden border border-gray-100">
            <img alt="Áo Thun Thể Thao Dry-Fit Pro Training" className="w-full h-full object-cover aspect-square" src="https://lh3.googleusercontent.com/aida/AEtjO1VrmdKDLjPmzvyqGRQWNVkukG-qIX-C058T_CymrjwywHcC2umdTmrD-CdO-VIJ0Fq6ew4hTwJJvBLG8UAovWrWwuG6bXw4s689jWZDibCCZ4lGq91j4ffI1j-jFLKjwHJAwwBABGTRLH9XLxYqdGGoTPbd2aBa9imWLOUIbFlJcqp6kXYbYW1LefX6DrpGuhq_OCS46E3paW1L48pHjsrynLbHwU0Xn9ZAzVRIxI1gPDpfNLCWMUmrzA"/>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 font-mono text-[10px] tracking-wider uppercase font-bold">Dry-Fit AI</span>
              <span className="text-xs font-semibold text-green-700">Còn hàng</span>
            </div>
            <h2 className="text-sm font-bold text-gray-900 truncate">Áo Thun Thể Thao Dry-Fit Pro Training</h2>
            <p className="text-xs text-gray-500">Phiên bản: Xám Đen • Size: L</p>
            <div className="sm:hidden font-mono text-sm font-bold text-gray-900 mt-1">700.000 đ</div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md">
            <button className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors rounded-l-md font-bold" type="button">-</button>
            <input className="w-9 h-8 text-center bg-transparent font-mono text-sm font-semibold text-gray-900 focus:outline-none" readOnly type="text" value="2"/>
            <button className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors rounded-r-md font-bold" type="button">+</button>
          </div>
          <div className="text-right hidden sm:block min-w-[120px]">
            <div className="font-mono text-base font-bold text-gray-900 leading-tight">700.000 đ</div>
            <div className="font-mono text-xs text-gray-500">Đơn giá: 350.000 đ</div>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <button className="p-1.5 hover:text-blue-600 transition-colors" title="Lưu lại mua sau" type="button">
              <Bookmark size={20} />
            </button>
            <button className="p-1.5 hover:text-red-600 transition-colors" title="Xóa khỏi giỏ hàng" type="button">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </article>

      <div className="w-full h-px bg-gray-100 my-2"></div>

      {/* Product Item 3 */}
      <article className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 bg-white">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded flex-shrink-0 overflow-hidden border border-gray-100">
            <img alt="Thảm Tập Yoga Định Tuyến TPE 6mm Chống Trượt" className="w-full h-full object-cover aspect-square" src="https://lh3.googleusercontent.com/aida/AEtjO1XsP8M-61RdwnpqhQPISZJ62louLOP0YU2rknEU2uifWRfeBVfh1Qt0okVaYYNLvUcLB8mciBIIGNxCSH9QwN_1CkZ4CWGyuUzLyJLDDlfc3Y0zncU1UkJAQK9F3JyRlvWm9VZK8TuPQRnPLy8SgJV1n535HkEBF8r804Qsc_nM41ihKMssGvXtbznpfLTGceND8IzO6-fohY2Qx3Mb5wdwhlF_jS0CPMBwVrvi3Ojh8te7Py1IBN9yBQ"/>
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-900 font-mono text-[10px] tracking-wider uppercase font-bold">SportsAI Eco</span>
              <span className="text-xs font-semibold text-green-700">Còn hàng</span>
            </div>
            <h2 className="text-sm font-bold text-gray-900 truncate">Thảm Tập Yoga Định Tuyến TPE 6mm Chống Trượt</h2>
            <p className="text-xs text-gray-500">Màu: Xanh Rêu • Bản tiêu chuẩn</p>
            <div className="sm:hidden font-mono text-sm font-bold text-gray-900 mt-1">450.000 đ</div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md">
            <button className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors rounded-l-md font-bold" type="button">-</button>
            <input className="w-9 h-8 text-center bg-transparent font-mono text-sm font-semibold text-gray-900 focus:outline-none" readOnly type="text" value="1"/>
            <button className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors rounded-r-md font-bold" type="button">+</button>
          </div>
          <div className="text-right hidden sm:block min-w-[120px]">
            <div className="font-mono text-base font-bold text-gray-900 leading-tight">450.000 đ</div>
            <div className="font-mono text-xs text-gray-500">Đơn giá: 450.000 đ</div>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <button className="p-1.5 hover:text-blue-600 transition-colors" title="Lưu lại mua sau" type="button">
              <Bookmark size={20} />
            </button>
            <button className="p-1.5 hover:text-red-600 transition-colors" title="Xóa khỏi giỏ hàng" type="button">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
