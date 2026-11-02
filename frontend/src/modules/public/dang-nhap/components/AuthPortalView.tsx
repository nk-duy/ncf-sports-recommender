'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AUTH_LOGO_FALLBACK, type AuthMode } from '../constants';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import GoogleAccountPicker from './GoogleAccountPicker';

interface AuthPortalViewProps {
  defaultMode?: AuthMode;
}

export default function AuthPortalView({ defaultMode = 'login' }: AuthPortalViewProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const urlMode: AuthMode | null =
    tabParam === 'login' || tabParam === 'register' || tabParam === 'forgot' || tabParam === 'google'
      ? tabParam
      : null;

  const [manualMode, setManualMode] = useState<AuthMode | null>(null);
  const [prefilledUsername, setPrefilledUsername] = useState('');

  const authMode: AuthMode = manualMode ?? urlMode ?? defaultMode;

  return (
    <div
      className="min-h-[calc(100dvh-115px)] flex items-center justify-center py-4 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 bg-cover bg-center"
      style={{
        backgroundImage:
          'linear-gradient(rgba(15, 23, 42, 0.60), rgba(15, 23, 42, 0.72)), url("https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80")',
      }}
    >
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 hover:bg-slate-900/80 text-slate-200 hover:text-white transition-all text-xs sm:text-sm font-medium backdrop-blur-md border border-white/15 shadow-sm"
        >
          <ArrowLeft size={15} />
          Trở về trang chủ
        </Link>
      </div>

      <div className={`w-full ${authMode === 'register' ? 'max-w-lg' : 'max-w-md'} z-10 transition-all duration-300`}>
        <div className="bg-white/95 backdrop-blur-2xl py-5 px-5 sm:px-7 shadow-2xl rounded-2xl border border-white/60 transition-all duration-300 max-h-[85dvh] overflow-y-auto scrollbar-thin">
          <div className="flex flex-col items-center mb-3.5">
            <Link href="/" className="transition hover:opacity-90">
              <img
                src="/logo.png"
                alt="KADY Sports Logo"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = AUTH_LOGO_FALLBACK;
                }}
                className="h-8 sm:h-9 w-auto object-contain mb-1"
              />
            </Link>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 text-center">
              {authMode === 'login' && 'Đăng nhập KADY Sports'}
              {authMode === 'register' && 'Đăng ký tài khoản mới'}
              {authMode === 'forgot' && 'Khôi phục mật khẩu'}
              {authMode === 'google' && 'Tiếp tục với Google'}
            </h1>
            <p className="text-[11.5px] text-slate-500 text-center mt-0.5">
              {authMode === 'login' && 'Hệ sinh thái thể thao tích hợp AI gợi ý cá nhân hóa'}
              {authMode === 'register' && 'Thiết lập sở thích thể thao để tối ưu gợi ý Cold-Start'}
              {authMode === 'forgot' && 'Cập nhật mật khẩu an toàn trực tiếp vào hệ thống'}
              {authMode === 'google' && 'Đăng nhập nhanh 1-chạm hoặc thiết lập hồ sơ Cold-Start AI'}
            </p>
          </div>

          {authMode === 'login' && (
            <LoginForm
              key={prefilledUsername}
              initialUsername={prefilledUsername}
              onSwitchToRegister={() => setManualMode('register')}
              onSwitchToForgot={() => setManualMode('forgot')}
              onSwitchToGoogle={() => setManualMode('google')}
            />
          )}

          {authMode === 'register' && (
            <RegisterForm
              onSwitchToLogin={(username) => {
                if (username) setPrefilledUsername(username);
                setManualMode('login');
              }}
              onSwitchToGoogle={() => setManualMode('google')}
            />
          )}

          {authMode === 'forgot' && (
            <ForgotPasswordForm
              onBackToLogin={() => setManualMode('login')}
              onSuccessPrefill={(email) => setPrefilledUsername(email)}
            />
          )}

          {authMode === 'google' && (
            <GoogleAccountPicker onBackToLogin={() => setManualMode('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
