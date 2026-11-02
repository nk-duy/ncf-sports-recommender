'use client';

import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import RegisterCredentialsFields, {
  type RegisterFieldsState,
} from './RegisterCredentialsFields';
import SportPreferenceSelector from './SportPreferenceSelector';
import GoogleOAuthDividerButton from './GoogleOAuthDividerButton';

interface RegisterFormProps {
  onSwitchToLogin: (prefilledUsername?: string) => void;
  onSwitchToGoogle: () => void;
}

export default function RegisterForm({
  onSwitchToLogin,
  onSwitchToGoogle,
}: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFieldsState>({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    full_name: '',
    phone: '',
  });

  const [selectedSports, setSelectedSports] = useState<string[]>(['Pickleball', 'Chạy bộ']);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSport = (sportId: string) => {
    setSelectedSports((prev) =>
      prev.includes(sportId) ? prev.filter((s) => s !== sportId) : [...prev, sportId]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = formData.phone.trim().replace(/[\s.-]/g, '');
    if (cleanPhone) {
      const vnPhoneRegex = /^(?:(?:\+84|84)0?|0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
      if (!vnPhoneRegex.test(cleanPhone)) {
        notifications.show({
          title: 'Số điện thoại không hợp lệ',
          message:
            'Vui lòng nhập đúng số điện thoại di động Việt Nam (gồm 10 số, bắt đầu bằng 03, 05, 07, 08, 09).',
          color: 'red',
        });
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      notifications.show({
        title: 'Mật khẩu không khớp',
        message: 'Mật khẩu nhập lại không trùng khớp với mật khẩu đã nhập!',
        color: 'red',
      });
      return;
    }

    if (formData.password.length < 6) {
      notifications.show({
        title: 'Mật khẩu quá ngắn',
        message: 'Mật khẩu phải có độ dài tối thiểu từ 6 ký tự trở lên.',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;

      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          full_name: formData.full_name.trim() || undefined,
          phone: cleanPhone || undefined,
          interested_sports: selectedSports,
        }),
      });

      if (res.ok) {
        setError('');
        notifications.show({
          title: 'Đăng ký thành công',
          message:
            'Tài khoản của bạn đã được tạo thành công! Hãy đăng nhập để trải nghiệm AI NCF.',
          color: 'green',
        });
        onSwitchToLogin(formData.username.trim());
      } else {
        const errData = await res.json();
        const msg = errData.detail || 'Đăng ký thất bại. Vui lòng thử lại!';
        setError(msg);
        notifications.show({
          title: 'Đăng ký thất bại',
          message: msg,
          color: 'red',
        });
      }
    } catch {
      const msg = 'Lỗi kết nối máy chủ. Vui lòng kiểm tra mạng!';
      setError(msg);
      notifications.show({
        title: 'Lỗi kết nối',
        message: msg,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="mt-1 mb-4 text-center text-xs sm:text-sm text-gray-500">
        Đã có tài khoản?{' '}
        <button
          type="button"
          onClick={() => onSwitchToLogin()}
          className="font-semibold text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
        >
          Đăng nhập ngay
        </button>
      </p>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5 text-red-600 animate-in fade-in slide-in-from-top-2">
          <div className="shrink-0">
            <svg className="h-4 w-4 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-xs sm:text-sm font-medium">{error}</p>
        </div>
      )}

      <form className="space-y-3" onSubmit={handleSubmit} autoComplete="off" noValidate>
        <RegisterCredentialsFields
          formData={formData}
          onChange={handleChange}
          showPassword={showPassword}
          onToggleShowPassword={() => setShowPassword(!showPassword)}
          showConfirmPassword={showConfirmPassword}
          onToggleShowConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <SportPreferenceSelector
          selectedSports={selectedSports}
          onToggleSport={toggleSport}
          showHint
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-md shadow-blue-500/20 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Tạo Tài Khoản'
            )}
          </button>
        </div>
      </form>

      <GoogleOAuthDividerButton onClick={onSwitchToGoogle} marginClass="mt-4" />
    </>
  );
}
