'use client';

const FALLBACK_UPLOAD_IMG =
  'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80';

interface ReviewImageUploaderProps {
  reviewImages: string[];
  isUploadingImage: boolean;
  onUploadImage: (file: File) => void;
  onRemoveImage: (index: number) => void;
}

export default function ReviewImageUploader({
  reviewImages,
  isUploadingImage,
  onUploadImage,
  onRemoveImage,
}: ReviewImageUploaderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
          Hình ảnh thực tế sản phẩm ({reviewImages.length}/4)
        </label>
        <span className="text-[10px] text-slate-400">Tối đa 4 ảnh (JPG, PNG)</span>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {reviewImages.map((img, idx) => (
          <div
            key={idx}
            className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group"
          >
            <img
              src={img}
              alt={`Ảnh review ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_UPLOAD_IMG;
              }}
            />
            <button
              type="button"
              onClick={() => onRemoveImage(idx)}
              className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] transition cursor-pointer"
              title="Xóa ảnh"
            >
              ✕
            </button>
          </div>
        ))}

        {reviewImages.length < 4 && (
          <label
            className={`w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition ${
              isUploadingImage ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onUploadImage(file);
                e.target.value = '';
              }}
            />
            {isUploadingImage ? (
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[9px] font-bold text-slate-500">Thêm ảnh</span>
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
