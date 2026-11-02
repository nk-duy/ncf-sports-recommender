'use client';
import React, { useState, useEffect } from 'react';
import { X, Gift, Mail, ChevronRight, Check } from 'lucide-react';

export default function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [voucherCode, setVoucherCode] = useState('KADY10');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const dismissed = localStorage.getItem('email_popup_dismissed');
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('email_popup_dismissed', '1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    setErrorMsg('');

    setTimeout(() => {
      setVoucherCode('KADYNEW10');
      setSubmitted(true);
      setSubmitting(false);
      setTimeout(() => {
        setVisible(false);
        localStorage.setItem('email_popup_dismissed', '1');
      }, 4000);
    }, 400);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleDismiss}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decorative banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center relative">
          <div className="absolute top-3 right-3">
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2.5">
            <Gift size={24} className="text-white" />
          </div>
          <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest mb-0.5">Ưu đãi đặc biệt</p>
          <h2 className="text-2xl font-black">Giảm Ngay 10%</h2>
          <p className="text-white/80 text-xs mt-0.5">Cho đơn hàng đầu tiên của bạn</p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {!submitted ? (
            <>
              <p className="text-gray-600 text-xs sm:text-sm text-center mb-5 leading-relaxed">
                Đăng ký nhận bản tin để không bỏ lỡ các chương trình khuyến mãi, 
                sản phẩm mới và deal flash sale độc quyền từ KADY.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email của bạn..."
                    className="w-full h-10 pl-9 pr-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    required
                  />
                </div>
                {errorMsg && (
                  <p className="text-xs text-red-500 text-center">{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  {submitting ? 'Đang kích hoạt ưu đãi...' : 'Nhận Mã Giảm Giá'}
                  <ChevronRight size={16} />
                </button>
              </form>
              <button
                onClick={handleDismiss}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-4 transition cursor-pointer"
              >
                Không, cảm ơn. Tôi muốn trả giá đầy đủ.
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Tuyệt vời!</h3>
              <p className="text-gray-500 text-sm mb-3">
                Mã giảm giá đã được kích hoạt thành công cho tài khoản của bạn.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-xs text-blue-600 font-semibold mb-1">Mã của bạn:</p>
                <p className="text-2xl font-black text-blue-700 tracking-widest">{voucherCode}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
