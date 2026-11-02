'use client';

interface ProductActionCommitmentsProps {
  isReady: boolean;
  inStock: boolean;
  added: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

export default function ProductActionCommitments({
  isReady,
  inStock,
  added,
  onAddToCart,
  onBuyNow,
}: ProductActionCommitmentsProps) {
  return (
    <>
      {/* 2 Nút hành động (CTA) lớn cân đối */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={onAddToCart}
          disabled={!isReady || !inStock}
          className={`h-11 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border-2 ${
            !isReady || !inStock
              ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-70'
              : added
              ? 'bg-emerald-50 border-emerald-600 text-emerald-600 hover:bg-emerald-100'
              : 'border-blue-600 bg-blue-50/60 text-blue-700 hover:bg-blue-100 shadow-xs'
          }`}
        >
          {added ? (
            <>
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Đã thêm vào giỏ</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Thêm vào giỏ hàng</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onBuyNow}
          disabled={!isReady || !inStock}
          className={`h-11 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center cursor-pointer ${
            !isReady || !inStock
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70 shadow-none'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 active:scale-98'
          }`}
        >
          Mua ngay
        </button>
      </div>

      {/* Thanh cam kết 3 cột ngang dưới nút mua */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-slate-600 text-[11px]">
        <div className="flex flex-col items-center gap-1">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-semibold text-slate-800">Đổi trả 30 ngày</span>
          <span className="text-[10px] text-slate-400">Đổi size tận nơi</span>
        </div>
        <div className="flex flex-col items-center gap-1 border-x border-slate-100 px-1">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.965 11.965 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-semibold text-slate-800">Bảo hành 12T</span>
          <span className="text-[10px] text-slate-400">Chính hãng KADY</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="font-semibold text-slate-800">COD & VietQR</span>
          <span className="text-[10px] text-slate-400">Kiểm hàng trước</span>
        </div>
      </div>
    </>
  );
}
