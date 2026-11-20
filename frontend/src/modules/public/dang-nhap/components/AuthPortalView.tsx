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
    <div className="min-h-[calc(100dvh-115px)] flex items-center justify-center pt-14 pb-6 lg:py-5 px-4 sm:px-6 relative bg-[#f7f8fa]">
      <div className="absolute top-4 left-4 sm:top-5 sm:left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all text-xs font-medium border border-[#e5e7eb] shadow-2xs"
        >
          <ArrowLeft size={14} />
          Trở về trang chủ
        </Link>
      </div>

      <div className={`w-full ${authMode === 'register' ? 'max-w-[500px]' : 'max-w-[420px]'} z-10 transition-all duration-200`}>
        <div className="bg-white py-5 px-5 sm:px-7 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.1)] rounded-2xl border border-[#e5e7eb]">
          {authMode !== 'google' && (
            <div className="flex flex-col items-center mb-2">
              <Link href="/" className="transition hover:opacity-90">
                <img
                  src="/logo.png"
                  alt="KADY Sports Logo"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = AUTH_LOGO_FALLBACK;
                  }}
                  className="h-7 sm:h-8 w-auto object-contain mb-1.5"
                />
              </Link>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 text-center">
                {authMode === 'login' && 'Đăng nhập KADY Sports'}
                {authMode === 'register' && 'Đăng ký tài khoản'}
                {authMode === 'forgot' && 'Khôi phục mật khẩu'}
              </h1>
            </div>
          )}

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
