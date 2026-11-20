'use client';

import { User, Lock, Mail, Tag, Phone, Eye, EyeOff } from 'lucide-react';

export interface RegisterFieldsState {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  full_name: string;
  phone: string;
}

interface RegisterCredentialsFieldsProps {
  formData: RegisterFieldsState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  showConfirmPassword: boolean;
  onToggleShowConfirmPassword: () => void;
}

export default function RegisterCredentialsFields({
  formData,
  onChange,
  showPassword,
  onToggleShowPassword,
  showConfirmPassword,
  onToggleShowConfirmPassword,
}: RegisterCredentialsFieldsProps) {
  const inputClass =
    'block w-full pl-8 pr-2.5 py-1.5 sm:py-2 bg-slate-50/70 border border-[#e5e7eb] rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-slate-900 font-medium placeholder-slate-400';

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tên đăng nhập *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <User size={14} />
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onChange}
              placeholder="Nhập username"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Tag size={14} />
            </div>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={onChange}
              placeholder="Họ và tên đầy đủ"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Mail size={14} />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="you@gmail.com"
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Phone size={14} />
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              placeholder="0912 345 678"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={14} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="••••••••"
              className={`block w-full pl-8 pr-8 py-1.5 sm:py-2 bg-slate-50/70 border border-[#e5e7eb] rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-slate-900 font-medium placeholder-slate-400 ${showPassword ? '' : 'tracking-widest'}`}
              required
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              tabIndex={-1}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nhập lại mật khẩu *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={14} />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={onChange}
              placeholder="••••••••"
              className={`block w-full pl-8 pr-8 py-1.5 sm:py-2 bg-slate-50/70 border border-[#e5e7eb] rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-slate-900 font-medium placeholder-slate-400 ${showConfirmPassword ? '' : 'tracking-widest'}`}
              required
            />
            <button
              type="button"
              onClick={onToggleShowConfirmPassword}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
