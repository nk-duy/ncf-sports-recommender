import { Check, Copy, Mail, Calendar } from 'lucide-react';

export default function SuccessHeader() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-10 pt-4">
      {/* Icon */}
      <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
          <Check className="w-8 h-8" strokeWidth={3} />
        </div>
      </div>

      {/* Heading */}
      <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-3">
        Giao dịch đã xác thực thành công
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-4">
        Đặt hàng thành công!
      </h1>
      <p className="text-gray-500 text-sm mb-6 max-w-md">
        Cảm ơn bạn đã lựa chọn mua sắm tại KADY. Đơn hàng của bạn đang được hệ thống phân loại tự động tại kho trung tâm.
      </p>

      {/* Order ID */}
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          Mã đơn hàng: <strong className="text-gray-900">#S8-8942</strong>
          <button className="text-blue-600 font-bold hover:text-blue-700 transition flex items-center gap-1 ml-2 border-l border-gray-300 pl-3">
            <Copy className="w-4 h-4" />
            Copy
          </button>
        </div>
      </div>

      {/* Meta Info */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm text-gray-500 bg-white border border-gray-100 px-6 py-3 rounded-full shadow-sm">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-500" />
          Email gửi tới: <strong className="text-gray-900">khanhduy.nguyen@gmail.com</strong>
        </div>
        <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-500" />
          Dự kiến giao: <strong className="text-gray-900">2 - 3 ngày làm việc</strong>
        </div>
      </div>
    </div>
  );
}
