'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/shared/store/authStore';
import { AutocompleteProduct } from '../types';

export const TRENDING_KEYWORDS = [
  'Vợt Pickleball',
  'Giày chạy bộ',
  'Vợt cầu lông Yonex',
  'Giày đá bóng',
  'Bóng chuyền',
  'Đồ tập Gym',
  'Lều cắm trại',
  'Balo thể thao',
];

const MAX_HISTORY = 8;

function readStoredHistory(storageKey: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.slice(0, MAX_HISTORY);
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return [];
}

export function useSearchAutocomplete() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AutocompleteProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [historyByKey, setHistoryByKey] = useState<Record<string, string[]>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Storage key phân tách theo user id/username hoặc guest
  const storageKey = `kady_search_history_${user?.id || user?.username || 'guest'}`;
  const history = historyByKey[storageKey] ?? (open ? readStoredHistory(storageKey) : []);

  const refreshHistory = useCallback(() => {
    const loaded = readStoredHistory(storageKey);
    setHistoryByKey((prev) => ({ ...prev, [storageKey]: loaded }));
  }, [storageKey]);

  // Lưu từ khóa vào lịch sử tìm kiếm (tối đa 8 từ, đưa lên đầu, khử trùng lặp)
  const saveToHistory = (kw: string) => {
    const trimmed = kw.trim();
    if (!trimmed) return;
    try {
      const current = readStoredHistory(storageKey).filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      const next = [trimmed, ...current].slice(0, MAX_HISTORY);
      setHistoryByKey((prev) => ({ ...prev, [storageKey]: next }));
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Ignore storage write errors
    }
  };

  // Xóa 1 từ khóa khỏi lịch sử
  const removeHistoryItem = (e: React.MouseEvent, kw: string) => {
    e.stopPropagation();
    const next = history.filter((item) => item !== kw);
    setHistoryByKey((prev) => ({ ...prev, [storageKey]: next }));
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Ignore storage write errors
    }
  };

  // Xóa toàn bộ lịch sử
  const clearAllHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHistoryByKey((prev) => ({ ...prev, [storageKey]: [] }));
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage remove errors
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (!open) setOpen(true);
    if (value.trim().length >= 2) {
      setLoading(true);
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  // Live autocomplete khi gõ >= 2 ký tự (Debounce 250ms)
  useEffect(() => {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/v1/products/?search=${encodeURIComponent(cleanQuery)}&limit=5`
        );
        if (!cancelled) {
          if (res.ok) {
            const data = await res.json();
            setResults(Array.isArray(data) ? data.slice(0, 5) : []);
          } else {
            setResults([]);
          }
        }
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Đóng dropdown khi click ra ngoài hoặc nhấn Escape
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const executeSearch = (kw: string) => {
    const clean = kw.trim();
    if (!clean) return;
    saveToHistory(clean);
    setQuery(clean);
    setOpen(false);
    router.push(`/san-pham?search=${encodeURIComponent(clean)}`);
  };

  const handleSelectProduct = (product: AutocompleteProduct) => {
    saveToHistory(product.name);
    setOpen(false);

    // Ghi nhận tương tác view nếu người dùng đã đăng nhập
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('kady_customer_token') || localStorage.getItem('token')
        : null;
    if (token) {
      fetch('http://localhost:8000/api/v1/interactions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.product_id,
          interaction_type: 'view',
        }),
      }).catch(() => {});
    }

    router.push(`/san-pham/${product.product_id}`);
  };

  return {
    query,
    results,
    loading,
    open,
    setOpen,
    history,
    containerRef,
    inputRef,
    isLiveSearch: query.trim().length >= 2,
    refreshHistory,
    handleQueryChange,
    removeHistoryItem,
    clearAllHistory,
    executeSearch,
    handleSelectProduct,
  };
}
