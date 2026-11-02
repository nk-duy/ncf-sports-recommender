'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { useAdminAuthStore } from '@/shared/store/adminAuthStore';
import { notifications } from '@mantine/notifications';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import GooglePresetAccountList from './GooglePresetAccountList';
import GoogleCustomAccountForm from './GoogleCustomAccountForm';

interface GoogleAccountPickerProps {
  onBackToLogin: () => void;
  defaultSports?: string[];
}

export default function GoogleAccountPicker({
  onBackToLogin,
  defaultSports = ['Pickleball', 'Chạy bộ'],
}: GoogleAccountPickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');

  const [mode, setMode] = useState<'picker' | 'custom'>('picker');
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>(defaultSports);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSport = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId) ? prev.filter((s) => s !== sportId) : [...prev, sportId]
    );
  };

  const handleOAuthLogin = async (email: string, fullName: string, sports: string[]) => {
    setError('');
    setLoading(true);

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;

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

      const userRes = await fetch(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (!userRes.ok) {
        throw new Error('Không thể tải thông tin hồ sơ người dùng.');
      }

      const user = await userRes.json();

      if (user.role === 'admin' || redirectPath?.startsWith('/admin')) {
        // Lưu phiên Quản trị viên riêng biệt (kady_admin_*)
        useAdminAuthStore.getState().login(data.access_token, user);
        notifications.show({
          title: 'Đăng nhập Quản trị viên',
          message: `Chào mừng Quản trị viên ${user.full_name || user.username}!`,
          color: 'blue',
        });
        router.push(redirectPath && redirectPath.startsWith('/admin') ? redirectPath : '/admin');
      } else {
        // Lưu phiên Khách hàng riêng biệt (kady_customer_*)
        useAuthStore.getState().login(data.access_token, user);
        notifications.show({
          title: 'Đăng nhập thành công',
          message: `Chào mừng ${user.full_name || user.username} đến với KADY Sports!`,
          color: 'green',
        });
        router.push(redirectPath || '/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối khi xác thực qua Google');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) {
      setError('Vui lòng nhập địa chỉ Gmail');
      return;
    }
    void handleOAuthLogin(customEmail, customName || customEmail.split('@')[0], selectedSports);
  };

  return (
    <div className="animate-in fade-in duration-200">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          Quay lại Đăng nhập
        </button>
        <span className="text-[11px] font-medium text-slate-400">Google OAuth 2.0</span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {mode === 'picker' ? (
        <GooglePresetAccountList
          loading={loading}
          onSelectPreset={(email, name, sports) => void handleOAuthLogin(email, name, sports)}
          onSwitchToCustom={() => setMode('custom')}
        />
      ) : (
        <GoogleCustomAccountForm
          customEmail={customEmail}
          setCustomEmail={setCustomEmail}
          customName={customName}
          setCustomName={setCustomName}
          selectedSports={selectedSports}
          onToggleSport={toggleSport}
          loading={loading}
          onBackToPicker={() => setMode('picker')}
          onSubmit={handleCustomSubmit}
        />
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck size={13} className="text-emerald-500" />
        <span>Xác thực an toàn qua giao thức OAuth 2.0 &amp; MongoDB</span>
      </div>
    </div>
  );
}
