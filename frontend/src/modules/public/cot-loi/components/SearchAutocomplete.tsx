'use client';

import { useState } from 'react';
import { Search, Camera, X } from 'lucide-react';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useSearchAutocomplete } from '../hooks/useSearchAutocomplete';
import SearchDropdownContent from './SearchDropdownContent';
import VisualSearchModal from '@/shared/components/VisualSearchModal';

export default function SearchAutocomplete() {
  const { t } = useLanguage();
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);
  const [pastedFile, setPastedFile] = useState<File | null>(null);
  const {
    query,
    results,
    loading,
    open,
    setOpen,
    history,
    containerRef,
    inputRef,
    isLiveSearch,
    refreshHistory,
    handleQueryChange,
    handleClearQuery,
    removeHistoryItem,
    clearAllHistory,
    executeSearch,
    handleSelectProduct,
  } = useSearchAutocomplete();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      executeSearch(query);
    }
  };

  const handleInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    // Tự động nhận diện nếu người dùng dán ảnh trực tiếp vào ô tìm kiếm (Ctrl + V)
    const items = clipboardData.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            setOpen(false);
            inputRef.current?.blur();
            setPastedFile(file);
            setVisualSearchOpen(true);
            return;
          }
        }
      }
    }
  };

  const handleOpenVisualSearch = () => {
    setOpen(false);
    inputRef.current?.blur();
    setPastedFile(null);
    setVisualSearchOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full md:flex-1 md:max-w-3xl">
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onPaste={handleInputPaste}
          onFocus={() => {
            refreshHistory();
            setOpen(true);
          }}
          className="w-full h-10 pl-4 pr-24 sm:pr-28 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition placeholder-slate-400 shadow-2xs font-normal"
          placeholder={t('header.search_placeholder')}
          type="text"
          autoComplete="off"
        />
        <div className="absolute right-2 flex items-center gap-0.5 sm:gap-1">
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClearQuery}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Xóa toàn bộ nội dung tìm kiếm"
              aria-label="Xóa nội dung tìm kiếm"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={handleOpenVisualSearch}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
            title="Tìm kiếm bằng hình ảnh"
          >
            <Camera size={18} />
          </button>
          <button
            type="submit"
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
            title="Tìm kiếm"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Search size={18} />
            )}
          </button>
        </div>
      </form>

      <VisualSearchModal
        isOpen={visualSearchOpen}
        onClose={() => {
          setVisualSearchOpen(false);
          setPastedFile(null);
        }}
        initialFile={pastedFile}
      />

      {open && !visualSearchOpen && (
        <SearchDropdownContent
          isLiveSearch={isLiveSearch}
          query={query}
          results={results}
          loading={loading}
          history={history}
          onSelectProduct={handleSelectProduct}
          onExecuteSearch={executeSearch}
          onRemoveHistoryItem={removeHistoryItem}
          onClearAllHistory={clearAllHistory}
        />
      )}
    </div>
  );
}
