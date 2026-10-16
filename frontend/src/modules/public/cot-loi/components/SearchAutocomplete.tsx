'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string;
}

export default function SearchAutocomplete() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/products/?search=${encodeURIComponent(query.trim())}&limit=6`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setOpen(true);
        }
      } catch {}
      setLoading(false);
    }, 280);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/san-pham?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectProduct = (id: string) => {
    setOpen(false);
    setQuery('');
    router.push(`/san-pham/${id}`);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-3xl">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="w-full pl-4 pr-12 py-2.5 rounded-md bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition placeholder-gray-500 shadow-sm"
          placeholder="Nhập tên sản phẩm, thương hiệu, môn thể thao..."
          type="text"
          autoComplete="off"
        />
        <button type="submit" className="absolute right-3 text-gray-500 hover:text-blue-600 transition">
          {loading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </form>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden">
          <div className="p-2 text-[11px] text-gray-400 font-semibold uppercase tracking-wider px-3 pt-3 pb-1">
            Kết quả tìm kiếm
          </div>
          <ul>
            {results.map((p) => (
              <li key={p.product_id}>
                <button
                  onClick={() => handleSelectProduct(p.product_id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 transition text-left"
                >
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                    {p.category && (
                      <p className="text-[11px] text-gray-400">{p.category}</p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-blue-600 shrink-0">{formatPrice(p.price)}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 p-2">
            <button
              onClick={() => {
                setOpen(false);
                router.push(`/san-pham?search=${encodeURIComponent(query)}`);
              }}
              className="w-full text-center text-sm text-blue-600 font-semibold py-2 hover:bg-blue-50 rounded-lg transition"
            >
              Xem tất cả kết quả cho &ldquo;{query}&rdquo; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
