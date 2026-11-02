'use client';

import { Banknote, Check, CreditCard, QrCode, ShieldCheck, Wallet } from 'lucide-react';
import { useCheckoutStore } from '@/shared/store/checkoutStore';

const PAYMENT_METHODS = [
  {
    id: 'COD',
    title: 'Thanh toán khi nhận hàng (COD)',
    desc: 'Nhận hàng, kiểm tra sản phẩm và thanh toán tiền mặt cho shipper.',
    icon: Banknote,
    iconColor: 'text-emerald-600',
    badge: 'Phổ biến nhất',
  },
  {
    id: 'BANK_TRANSFER',
    title: 'Chuyển khoản QR ngân hàng (VietQR 24/7)',
    desc: 'Quét mã VietQR tự động qua mọi app ngân hàng (VCB, MB, Techcombank, VPBank...).',
    icon: QrCode,
    iconColor: 'text-blue-600',
    badge: 'Nhanh chóng & Tiện lợi',
  },
  {
    id: 'VNPAY',
    title: 'VNPAY / Thẻ ATM & Quốc tế',
    desc: 'Cổng thanh toán bảo mật VNPAY hỗ trợ thẻ nội địa và thẻ Visa/Mastercard.',
    icon: CreditCard,
    iconColor: 'text-indigo-600',
  },
  {
    id: 'MOMO',
    title: 'Ví điện tử MoMo',
    desc: 'Thanh toán một chạm liên kết với tài khoản ví MoMo trên điện thoại.',
    icon: Wallet,
    iconColor: 'text-[#A50064]',
  },
];

export default function CheckoutPaymentMethods() {
  const { payment_method, setField } = useCheckoutStore();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CreditCard size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Phương thức thanh toán</h2>
            <p className="text-xs text-gray-500">Chọn hình thức thanh toán thuận tiện nhất cho bạn</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Bảo mật SSL 256-bit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {PAYMENT_METHODS.map((m) => {
          const isSelected = payment_method === m.id;
          const Icon = m.icon;

          return (
            <div
              key={m.id}
              onClick={() => setField('payment_method', m.id)}
              className={`relative p-4 rounded-xl border-2 transition-colors cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                  : 'border-gray-200/80 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white shadow-xs' : 'bg-gray-100'
                      }`}
                    >
                      <Icon size={18} className={m.iconColor} />
                    </div>
                    <span
                      className={`font-bold text-sm leading-tight ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}
                    >
                      {m.title}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                      isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-white stroke-[3]" />}
                  </div>
                </div>

                <p className="text-xs text-gray-500 pl-10.5 pr-2 leading-relaxed">{m.desc}</p>
              </div>

              {m.badge && (
                <div className="mt-3 pl-10.5">
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                    {m.badge}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {payment_method !== 'COD' && (
        <div className="mt-4 p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-center gap-2">
          <QrCode size={16} className="text-blue-600 shrink-0" />
          <span>
            Sau khi nhấn <strong>&quot;Xác Nhận Đặt Hàng&quot;</strong>, hệ thống sẽ hiển thị mã QR kèm thông tin chuyển
            khoản để bạn quét và xác thực ngay lập tức.
          </span>
        </div>
      )}
    </div>
  );
}
