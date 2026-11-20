'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { resolveApiBaseUrl } from '@/shared/lib/apiUrl';
import { notifications } from '@mantine/notifications';
import GooglePresetAccountList from './GooglePresetAccountList';
import GoogleCustomAccountForm from './GoogleCustomAccountForm';
import GoogleOtpVerifyForm from './GoogleOtpVerifyForm';

interface GoogleAccountPickerProps {
  onBackToLogin: () => void;
  initialMode?: 'picker' | 'custom';
}

interface SendOtpApiResponse {
  status: string;
  message: string;
  email: string;
  expires_in_seconds: number;
  email_sent: boolean;
  dev_otp?: string | null;
  detail?: string;
}

export default function GoogleAccountPicker({
  onBackToLogin,
  initialMode = 'picker',
}: GoogleAccountPickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [mode, setMode] = useState<'picker' | 'custom' | 'otp'>(initialMode);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode !== 'otp' || resendSeconds <= 0) return;
    const timer = setTimeout(() => {
      setResendSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearTimeout(timer);
  }, [mode, resendSeconds]);

  const completeCustomerLogin = async (accessToken: string) => {
    const apiUrl = resolveApiBaseUrl();
    const userRes = await fetch(`${apiUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userRes.ok) {
      throw new Error('Không thể tải thông tin hồ sơ người dùng.');
    }

    const user = await userRes.json();
    if (user.role === 'admin') {
      throw new Error('Tài khoản Quản trị viên bắt buộc đăng nhập bằng tên đăng nhập và mật khẩu.');
    }

    useAuthStore.getState().login(accessToken, user);
    notifications.show({
      title: 'Đăng nhập thành công',
      message: `Chào mừng ${user.full_name || user.username} đến với KADY Sports!`,
      color: 'green',
    });

    const destination = redirectPath && !redirectPath.startsWith('/admin') ? redirectPath : '/';
    router.push(destination);
  };

  const handlePresetOAuthLogin = async (email: string, fullName: string, sports: string[]) => {
    setError('');
    setLoading(true);

    try {
      const apiUrl = resolveApiBaseUrl();
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'google',
          email: email.trim().toLowerCase(),
          full_name: fullName.trim() || email.split('@')[0],
          token: 'google-oauth-client-token',
          interested_sports: sports,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Đăng nhập Google không thành công.');
      }

      await completeCustomerLogin(data.access_token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối khi xác thực qua Google');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (isResend = false) => {
    const cleanEmail = customEmail.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Vui lòng nhập địa chỉ Gmail hợp lệ.');
      return;
    }

    setError('');
    if (isResend) {
      setResending(true);
    } else {
      setLoading(true);
    }

    try {
      const apiUrl = resolveApiBaseUrl();
      const res = await fetch(`${apiUrl}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          full_name: customName.trim() || cleanEmail.split('@')[0],
          interested_sports: [],
        }),
      });

      const data: SendOtpApiResponse = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Không thể gửi mã xác nhận OTP. Vui lòng thử lại.');
      }

      setOtpEmail(cleanEmail);
      setDevOtp(data.dev_otp ?? null);
      setResendSeconds(60);
      setMode('otp');

      notifications.show({
        title: 'Đã gửi mã xác nhận',
        message: `Đã gửi mã xác nhận đến hộp thư ${cleanEmail}`,
        color: data.email_sent ? 'blue' : 'yellow',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối máy chủ khi gửi mã OTP.');
    } finally {
      setLoading(false);
      setResending(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSendOtp(false);
  };

  const handleVerifyOtp = async (otpCode: string) => {
    setError('');
    setLoading(true);

    try {
      const apiUrl = resolveApiBaseUrl();
      const res = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail,
          otp: otpCode,
          full_name: customName.trim() || otpEmail.split('@')[0],
          interested_sports: [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Mã xác nhận OTP không hợp lệ hoặc đã hết hạn.');
      }

      await completeCustomerLogin(data.access_token);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể xác thực mã OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-200">
      {error && (
        <div className="mb-3.5 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {error}
        </div>
      )}

      {mode === 'picker' && (
        <GooglePresetAccountList
          loading={loading}
          onSelectPreset={(email, name, sports) => void handlePresetOAuthLogin(email, name, sports)}
          onSwitchToCustom={() => {
            setError('');
            setMode('custom');
          }}
          onBackToLogin={onBackToLogin}
        />
      )}

      {mode === 'custom' && (
        <GoogleCustomAccountForm
          customEmail={customEmail}
          setCustomEmail={setCustomEmail}
          customName={customName}
          setCustomName={setCustomName}
          loading={loading}
          onBackToPicker={() => {
            setError('');
            setMode('picker');
          }}
          onSubmit={handleCustomSubmit}
        />
      )}

      {mode === 'otp' && (
        <GoogleOtpVerifyForm
          email={otpEmail}
          loading={loading}
          resending={resending}
          resendSeconds={resendSeconds}
          devOtp={devOtp}
          onBackToCustom={() => {
            setError('');
            setMode('custom');
          }}
          onResendOtp={() => void handleSendOtp(true)}
          onVerifyOtp={(otp) => void handleVerifyOtp(otp)}
        />
      )}
    </div>
  );
}
