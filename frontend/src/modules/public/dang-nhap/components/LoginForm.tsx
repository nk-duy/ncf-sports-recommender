'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { User, Lock } from 'lucide-react';
// import { notifications } from '@mantine/notifications';
// import { auth, googleProvider, facebookProvider } from '@/shared/lib/firebase';
// import { signInWithPopup } from 'firebase/auth';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /*
  const handleSocialLogin = async (providerName: 'google' | 'facebook') => {
    try {
      const provider = providerName === 'google' ? googleProvider : facebookProvider;
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const mockEmail = result.user.email || (providerName === 'google' ? 'user@gmail.com' : 'user@facebook.com');
      const mockName = result.user.displayName || (providerName === 'google' ? 'Google User' : 'Facebook User');
      
      const res = await fetch('http://localhost:8000/api/v1/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerName,
          token: idToken,
          email: mockEmail,
          full_name: mockName
        })
      });

      if (res.ok) {
        const data = await res.json();
        const userRes = await fetch('http://localhost:8000/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        if (userRes.ok) {
          const user = await userRes.json();
          useAuthStore.getState().login(data.access_token, user);
          router.push('/');
          notifications.show({
            title: 'Thành công',
            message: `Đăng nhập bằng ${providerName} thành công!`,
            color: 'green',
          });
        }
      } else {
        setError(`Đăng nhập bằng ${providerName} thất bại!`);
      }
    } catch (err: any) {
      setError(`Lỗi: ${err.message || 'Đăng nhập mạng xã hội thất bại'}`);
    }
  };
  */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataParams = new URLSearchParams();
      formDataParams.append('username', formData.username);
      formDataParams.append('password', formData.password);

      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataParams,
      });

      if (res.ok) {
        const data = await res.json();
        const userRes = await fetch('http://localhost:8000/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${data.access_token}` }
        });
        if (userRes.ok) {
          const user = await userRes.json();
          useAuthStore.getState().login(data.access_token, user);
          
          if (user.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Sai tên đăng nhập hoặc mật khẩu!');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ. Vui lòng kiểm tra mạng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="mt-2 mb-8 text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <button type="button" onClick={onSwitchToRegister} className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
          Đăng ký ngay
        </button>
      </p>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
          <div className="shrink-0">
            <svg className="h-5 w-5 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên đăng nhập</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <User size={18} />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 font-medium placeholder-gray-400"
              required
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-gray-700">Mật khẩu</label>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">Quên mật khẩu?</a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-900 font-medium placeholder-gray-400 tracking-widest"
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Đăng Nhập'
            )}
          </button>
        </div>
      </form>

      {/* Tạm thời tắt đăng nhập mạng xã hội
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white/80 text-gray-500 font-medium">Hoặc tiếp tục với</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleSocialLogin('google')}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button 
            onClick={() => handleSocialLogin('facebook')}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>
      </div>
      */}
    </>
  );
}
