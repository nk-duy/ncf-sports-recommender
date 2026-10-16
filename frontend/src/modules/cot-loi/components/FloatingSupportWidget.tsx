'use client';
import React, { useState } from 'react';
import { Phone, X, Headphones } from 'lucide-react';

export default function FloatingSupportWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

  const hotline = '1900 6868';
  const rawHotline = '19006868';
  const zaloPhone = '0988888888';
  const zaloLink = `https://zalo.me/${zaloPhone}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5 select-none">
      {/* Khi mở rộng: Danh sách các kênh hỗ trợ */}
      {isExpanded && (
        <div className="flex flex-col items-end gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Zalo Button */}
          <a
            href={zaloLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-white text-gray-800 pl-3 pr-2 py-1.5 rounded-full shadow-lg border border-gray-200/90 hover:shadow-xl hover:border-blue-300 transition-all active:scale-95 group"
            title="Chat Zalo tư vấn nhanh"
          >
            <span className="text-xs font-semibold group-hover:text-blue-600 transition-colors whitespace-nowrap">
              Chat Zalo tư vấn
            </span>
            <div className="w-8 h-8 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-xs shadow-xs group-hover:bg-[#0052cc]">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.03 2 11c0 2.87 1.5 5.43 3.86 7.03-.17.96-.68 2.5-1.54 3.52-.16.19-.03.48.21.48.33 0 1.95-.23 3.69-1.22.56.12 1.15.19 1.78.19 5.52 0 10-4.03 10-9s-4.48-9-10-9zm-2.8 11.2H7.6l2.9-4.7V8.4H6.8v1.3h2.1l-2.9 4.7v.1h3.2v-1.3zm3.5.1c-.4 0-.8-.1-1.1-.3-.3-.2-.5-.5-.7-.9l1.1-.6c.2.4.4.5.7.5.3 0 .5-.1.7-.2.1-.1.2-.3.2-.5 0-.2-.1-.4-.3-.5l-1.2-.5c-.4-.2-.8-.4-1-.7-.2-.3-.3-.7-.3-1.1 0-.5.2-1 .6-1.3.4-.3.9-.5 1.5-.5.5 0 .9.1 1.3.4.4.3.6.6.7 1l-1.1.6c-.2-.3-.4-.4-.7-.4-.2 0-.4.1-.5.2-.1.1-.2.2-.2.4 0 .2.1.3.3.4l1.2.5c.5.2.9.5 1.1.8.2.3.3.7.3 1.2 0 .5-.2 1-.6 1.3-.4.4-1 .6-1.6.6zm4.8 0h-3.4V8.4h1.4v3.8h2v1.1z" />
              </svg>
            </div>
          </a>

          {/* Hotline Call Button */}
          <a
            href={`tel:${rawHotline}`}
            className="flex items-center gap-2.5 bg-white text-gray-800 pl-3 pr-2 py-1.5 rounded-full shadow-lg border border-gray-200/90 hover:shadow-xl hover:border-rose-300 transition-all active:scale-95 group"
            title={`Gọi Hotline: ${hotline}`}
          >
            <span className="text-xs font-semibold group-hover:text-rose-600 transition-colors whitespace-nowrap">
              Hotline: <strong className="text-rose-600 font-bold">{hotline}</strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xs group-hover:bg-rose-700">
              <Phone size={15} />
            </div>
          </a>
        </div>
      )}

      {/* Nút bấm tròn đại diện duy nhất (cố định góc phải màn hình) */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`relative w-12 h-12 rounded-full shadow-xl flex items-center justify-center text-white transition-all transform duration-200 active:scale-90 ${
          isExpanded 
            ? 'bg-gray-800 hover:bg-gray-900 rotate-90' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl'
        }`}
        title={isExpanded ? 'Thu gọn hỗ trợ' : 'Mở kênh tư vấn'}
      >
        {isExpanded ? (
          <X size={20} />
        ) : (
          <>
            <Headphones size={22} />
            {/* Chấm xanh online nhấp nháy */}
            <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
            </span>
          </>
        )}
      </button>
    </div>
  );
}
