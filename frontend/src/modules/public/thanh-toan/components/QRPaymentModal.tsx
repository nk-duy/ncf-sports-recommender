'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Check, Clock, Copy, QrCode, X } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { formatVND } from '@/shared/lib/cart';

interface QRPaymentModalProps {
  paymentMethod: string;
  finalTotal: number;
  transferContent?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const QR_FALLBACK_IMG =
  'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg';

export default function QRPaymentModal({
  paymentMethod,
  finalTotal,
  transferContent = 'KADY SPORT 886886',
  onCancel,
  onConfirm,
}: QRPaymentModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 phút

  const bankInfo = {
    bankName: 'MB Bank (Ngân hàng TMCP Quân Đội)',
    accountNumber: '0394857291',
    accountHolder: 'CONG TY CP KADY SPORT VIET NAM',
    transferContent,
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = (text: string, field: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedField(field);
    notifications.show({
      title: 'Đã sao chép',
      message: `Đã chép "${text}" vào bộ nhớ tạm.`,
      color: 'blue',
    });
    setTimeout(() => setCopiedField(null), 2500);
  };

  const qrUrl =
    paymentMethod === 'MOMO'
      ? QR_FALLBACK_IMG
      : `https://api.vietqr.io/image/970422-${bankInfo.accountNumber}-compact2.jpg?amount=${finalTotal}&addInfo=${encodeURIComponent(
          bankInfo.transferContent
        )}&accountName=${encodeURIComponent(bankInfo.accountHolder)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <QrCode size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base">
                {paymentMethod === 'MOMO' ? 'Thanh toán qua Ví MoMo' : 'Quét mã VietQR Chuyển khoản'}
              </h3>
              <p className="text-xs text-blue-100">Xác nhận tự động 24/7 trong 30 giây</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-medium block">Số tiền cần thanh toán:</span>
              <span className="text-2xl font-black text-blue-600 tracking-tight">{formatVND(finalTotal)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-blue-100 shadow-xs">
              <Clock size={15} className="text-amber-500 animate-spin" />
              <span className="text-xs font-mono font-bold text-gray-700">{formatTimer(timeLeft)}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
            <div className="w-56 h-56 bg-white p-2.5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={qrUrl}
                alt="Mã QR thanh toán"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = QR_FALLBACK_IMG;
                }}
              />
            </div>
            <p className="text-xs text-gray-500 font-medium mt-3 text-center">
              Mở App Ngân hàng hoặc {paymentMethod === 'MOMO' ? 'MoMo' : 'VietQR'} để quét mã
            </p>
          </div>

          <div className="space-y-2.5 text-xs bg-gray-50/70 p-4 rounded-2xl border border-gray-100">
            <div className="flex justify-between items-center py-1">
              <span className="text-gray-500">Ngân hàng:</span>
              <span className="font-bold text-gray-900">{bankInfo.bankName}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-gray-200/50">
              <span className="text-gray-500">Số tài khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-blue-600 text-sm">{bankInfo.accountNumber}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankInfo.accountNumber, 'acc')}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition cursor-pointer"
                >
                  {copiedField === 'acc' ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-gray-200/50">
              <span className="text-gray-500">Chủ tài khoản:</span>
              <span className="font-bold text-gray-900">{bankInfo.accountHolder}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-t border-gray-200/50">
              <span className="text-gray-500">Nội dung chuyển khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {bankInfo.transferContent}
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bankInfo.transferContent, 'content')}
                  className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition cursor-pointer"
                >
                  {copiedField === 'content' ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-[11px] text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <AlertCircle size={15} className="shrink-0 text-amber-600 mt-0.5" />
            <span>
              Vui lòng giữ nguyên <strong>Nội dung chuyển khoản</strong> để hệ thống tự động ghi nhận và xác thực đơn
              hàng nhanh nhất.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-200 transition text-sm cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition text-sm cursor-pointer"
          >
            Tôi đã chuyển khoản
          </button>
        </div>
      </div>
    </div>
  );
}
