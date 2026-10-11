'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LoginForm from '@/modules/dang-nhap/components/LoginForm';
import RegisterForm from '@/modules/dang-nhap/components/RegisterForm';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div 
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1920&auto=format&fit=crop")' }}
    >
      {/* Overlay to darken the background image */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px] z-0"></div>

      {/* Back to Home Link - Fixed at top left */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="flex items-center justify-center gap-2 text-gray-200 hover:text-white transition-colors font-medium drop-shadow">
          <ArrowLeft size={18} />
          Trở về trang chủ
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white/95 backdrop-blur-2xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-white/40">
          
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="KADY Logo" className="h-14 w-auto object-contain" />
          </div>
          
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}

        </div>
      </div>
    </div>
  );
}
