'use client';

import { Search } from 'lucide-react';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useSearchAutocomplete } from '../hooks/useSearchAutocomplete';
import SearchDropdownContent from './SearchDropdownContent';

export default function SearchAutocomplete() {
  const { t } = useLanguage();
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

  return (
    <div ref={containerRef} className="relative flex-1 max-w-3xl">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => {
            refreshHistory();
            setOpen(true);
          }}
          className="w-full h-10 pl-4 pr-12 rounded-xl bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition placeholder-slate-400 shadow-2xs font-normal"
          placeholder={t('header.search_placeholder')}
          type="text"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-2.5 p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
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
      </form>

      {open && (
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
