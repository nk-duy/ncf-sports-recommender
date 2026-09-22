import React from "react";
import { Check } from "lucide-react";

export default function CheckoutStepper() {
  return (
    <section className="w-full bg-white px-4 sm:px-8 py-5 border-b border-gray-200">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Step 1 */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-200 text-green-900 flex items-center justify-center font-semibold">
            <Check size={16} />
          </div>
          <span className="font-semibold text-gray-900 hidden sm:inline">1. Giỏ hàng</span>
        </div>
        <div className="flex-1 h-0.5 mx-3 sm:mx-6 bg-green-200"></div>
        {/* Step 2 */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-green-200 text-green-900 flex items-center justify-center font-semibold">
            <Check size={16} />
          </div>
          <span className="font-semibold text-gray-900 hidden sm:inline">2. Thanh toán &amp; Giao vận</span>
        </div>
        <div className="flex-1 h-0.5 mx-3 sm:mx-6 bg-green-200"></div>
        {/* Step 3 (Active) */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold">
            3
          </div>
          <span className="font-bold text-gray-900">3. Hoàn tất đơn</span>
        </div>
      </div>
    </section>
  );
}
