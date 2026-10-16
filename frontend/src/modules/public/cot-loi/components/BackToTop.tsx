'use client';
import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Về đầu trang"
      className="fixed bottom-6 right-20 z-40 w-11 h-11 rounded-full bg-white text-gray-700 hover:text-blue-600 border border-gray-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center group"
      title="Lên đầu trang"
    >
      <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
