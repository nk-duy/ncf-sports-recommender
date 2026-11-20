'use client';

import { useEffect, useRef, useState } from 'react';
import GoogleLogoIcon from './GoogleLogoIcon';

interface GoogleOtpVerifyFormProps {
  email: string;
  loading: boolean;
  resending: boolean;
  resendSeconds: number;
  devOtp?: string | null;
  onBackToCustom: () => void;
  onResendOtp: () => void;
  onVerifyOtp: (otp: string) => void;
}

export default function GoogleOtpVerifyForm({
  email,
  loading,
  resending,
  resendSeconds,
  devOtp = null,
  onBackToCustom,
  onResendOtp,
  onVerifyOtp,
}: GoogleOtpVerifyFormProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [email]);

  const otpValue = digits.join('');

  const handleDigitChange = (index: number, rawValue: string) => {
    const cleaned = rawValue.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }

    if (cleaned.length > 1) {
      const chars = cleaned.slice(0, 6).split('');
      const next = ['', '', '', '', '', ''];
      chars.forEach((ch, idx) => {
        next[idx] = ch;
      });
      setDigits(next);
      const focusIdx = Math.min(chars.length, 5);
      inputRefs.current[focusIdx]?.focus();
      return;
    }

    const next = [...digits];
    next[index] = cleaned;
    setDigits(next);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        const next = [...digits];
        next[index - 1] = '';
        setDigits(next);
        inputRefs.current[index - 1]?.focus();
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const next = ['', '', '', '', '', ''];
    pasted.split('').forEach((ch, idx) => {
      next[idx] = ch;
    });
    setDigits(next);
    const focusIdx = Math.min(pasted.length - 1, 5);
    inputRefs.current[Math.max(0, focusIdx)]?.focus();
  };

  const handleFillDevOtp = () => {
    if (!devOtp) return;
    const clean = devOtp.replace(/\D/g, '').slice(0, 6);
    if (clean.length !== 6) return;
    setDigits(clean.split(''));
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpValue.length === 6 && !loading) {
      onVerifyOtp(otpValue);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center text-center pt-1">
        <GoogleLogoIcon className="w-7 h-7 mb-2.5" />
        <h2 className="text-lg font-semibold text-slate-900">Xác nhận Email</h2>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed px-2">
          Nhập mã xác nhận 6 số vừa gửi tới{' '}
          <span className="font-semibold text-slate-900 break-all">{email}</span>
        </p>
      </div>

      {devOtp && (
        <div className="px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 text-xs text-amber-900">
          <span>
            Mã thử nghiệm:{' '}
            <strong className="font-mono tracking-wider">{devOtp}</strong>
          </span>
          <button
            type="button"
            onClick={handleFillDevOtp}
            className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-semibold transition cursor-pointer"
          >
            Điền nhanh
          </button>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 sm:gap-2.5 pt-1">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={6}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={loading}
            aria-label={`Chữ số OTP thứ ${index + 1}`}
            className={`w-10 h-11 sm:w-11 sm:h-12 text-center text-lg font-bold font-mono rounded-xl border transition-all outline-none ${
              digit
                ? 'bg-blue-50/60 border-[#1a73e8] text-slate-900 ring-2 ring-[#1a73e8]/20'
                : 'bg-white border-[#e5e7eb] text-slate-900 focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20'
            } disabled:opacity-60`}
          />
        ))}
      </div>

      <div className="text-center text-xs">
        {resendSeconds > 0 ? (
          <span className="text-slate-500">
            Gửi lại mã sau <span className="font-semibold text-[#1a73e8] tabular-nums">{resendSeconds}s</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={onResendOtp}
            disabled={resending || loading}
            className="font-semibold text-[#1a73e8] hover:underline cursor-pointer disabled:opacity-50"
          >
            {resending ? 'Đang gửi lại...' : 'Gửi lại mã xác nhận'}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={onBackToCustom}
          disabled={loading || resending}
          className="px-4 py-2 border border-[#e5e7eb] text-slate-700 rounded-xl text-xs sm:text-sm font-medium hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
        >
          Quay lại
        </button>
        <button
          type="submit"
          disabled={otpValue.length !== 6 || loading}
          className="px-6 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Đang xác thực...' : 'Tiếp tục'}
        </button>
      </div>
    </form>
  );
}
