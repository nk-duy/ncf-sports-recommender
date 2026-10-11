import React from 'react';
import { Search } from 'lucide-react';

interface OrderTrackingFormProps {
  orderId: string;
  setOrderId: (id: string) => void;
  loading: boolean;
  error: string;
  onSearch: (e: React.FormEvent) => void;
}

export default function OrderTrackingForm({
  orderId,
  setOrderId,
  loading,
  error,
  onSearch
}: OrderTrackingFormProps) {
  return (
    <form onSubmit={onSearch} className="max-w-lg mx-auto mb-10">
      <div className="relative flex items-center">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full pl-5 pr-28 py-3.5 rounded-full bg-gray-50 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          placeholder="VD: 60a7c9f..."
          type="text"
        />
        <button 
          disabled={loading}
          type="submit" 
          className="absolute right-1.5 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-sm rounded-full transition flex items-center gap-2 shadow-sm"
        >
          {loading ? 'Đang tìm...' : (
            <>
              <Search size={16} />
              <span>Tra cứu</span>
            </>
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
    </form>
  );
}
