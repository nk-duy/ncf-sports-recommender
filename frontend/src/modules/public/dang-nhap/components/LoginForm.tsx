'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { useAdminAuthStore } from '@/shared/store/adminAuthStore';
import { User, Lock, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import GoogleOAuthDividerButton from './GoogleOAuthDividerButton';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgot: () => void;
  onSwitchToGoogle: () => void;
  initialUsername?: string;
}

export default function LoginForm({
  onSwitchToRegister,
  onSwitchToForgot,
  onSwitchToGoogle,
  initialUsername = '',
}: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const isAdminRedirect = redirectParam === '/admin' || redirectParam?.startsWith('/admin');

  const [formData, setFormData] = useState({
    username: initialUsername,
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiUrl = rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;

      const formDataParams = new URLSearchParams();
      formDataParams.append('username', formData.username.trim());
      formDataParams.append('password', formData.password);

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formDataParams,
      });

      if (res.ok) {
        const data = await res.json();
        const userRes = await fetch(`${apiUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${data.access_token}` },
        });

        if (userRes.ok) {
          const user = await userRes.json();

          if (isAdminRedirect || user.role === 'admin') {
            // Lưu vào phiên Quản trị viên riêng biệt (kady_admin_*), không đè lên phiên Khách hàng
            useAdminAuthStore.getState().login(data.access_token, user);
            router.push(redirectParam && redirectParam.startsWith('/admin') ? redirectParam : '/admin');
          } else {
            // Lưu vào phiên Khách hàng riêng biệt (kady_customer_*), không đè lên phiên Quản trị viên
            useAuthStore.getState().login(data.access_token, user);
            router.push(redirectParam || '/');
          }
        }
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Sai tên tài khoản, email hoặc mật khẩu!');
      }
    } catch {
      setError('Lỗi kết nối máy chủ. Vui lòng kiểm tra mạng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isAdminRedirect && (
        <div className="mb-4 p-3 rounded-xl bg-amber-50/90 border border-amber-200/80 flex items-start gap-2.5 text-amber-900 text-xs shadow-2xs animate-in fade-in duration-200">
          <ShieldAlert size={16} className="shrink-0 text-amber-600 mt-0.5" />
          <div className="leading-snug">
            <span className="font-bold text-amber-800">Yêu cầu quyền Quản trị:</span>{' '}
            Vui lòng đăng nhập bằng tài khoản Quản trị viên (Admin) để truy cập hệ thống quản trị.
          </div>
        </div>
      )}

      <p className="mt-1 mb-4 text-center text-xs sm:text-sm text-gray-500">
        Chưa có tài khoản?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
        >
          Đăng ký ngay
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

      <form className="space-y-3.5" onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tên tài khoản hoặc Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User size={16} />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên tài khoản hoặc email"
              className="block w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 font-medium placeholder-gray-400"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-gray-700">Mật khẩu</label>
            <button
              type="button"
              onClick={onSwitchToForgot}
              className="text-xs font-medium text-blue-600 hover:text-blue-500 cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={16} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`block w-full pl-9 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 font-medium placeholder-gray-400 ${showPassword ? '' : 'tracking-widest'}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="pt-1.5">
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
              'Đăng Nhập'
            )}
          </button>
        </div>
      </form>

      <GoogleOAuthDividerButton onClick={onSwitchToGoogle} marginClass="mt-5" />
    </>
  );
}
