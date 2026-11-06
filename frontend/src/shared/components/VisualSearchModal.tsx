'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  UploadCloud,
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  ClipboardPaste,
  Star,
} from 'lucide-react';
import type { AIExplanation } from '@/shared/types/aiExplanation';

const SPORTS_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';

export interface VisualSearchProduct {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  sport_type?: string;
  product_type?: string;
  rating?: number;
  reviews_count?: number;
  discount_percent?: number;
  ai_explanation?: AIExplanation;
}

interface VisualSearchMetadata {
  feature_dim: number;
  ncf_dim: number;
  latency_ms: number;
  total_matched: number;
  sport_type?: string;
}

interface DemoSportSample {
  id: string;
  title: string;
  sport: string;
  imageUrl: string;
}

const DEMO_SPORT_SAMPLES: DemoSportSample[] = [
  {
    id: 'sample-volleyball',
    title: 'Bóng Chuyền Mikasa V200W',
    sport: 'Bóng chuyền',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=500&q=80',
  },
  {
    id: 'sample-badminton',
    title: 'Vợt Cầu Lông Yonex Astrox',
    sport: 'Cầu lông',
    imageUrl: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&q=80',
  },
  {
    id: 'sample-football',
    title: 'Bóng Đá Thi Đấu FIFA Pro',
    sport: 'Đá bóng',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&q=80',
  },
  {
    id: 'sample-running',
    title: 'Giày Chạy Bộ Marathon Carbon',
    sport: 'Chạy bộ',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  },
  {
    id: 'sample-pickleball',
    title: 'Vợt Pickleball T700 Pro',
    sport: 'Pickleball',
    imageUrl: 'https://images.unsplash.com/photo-1599474924187-334a4ae5bd3c?w=500&q=80',
  },
  {
    id: 'sample-outdoor',
    title: 'Lều Dã Ngoại Chống Mưa NatureHike',
    sport: 'Dã ngoại',
    imageUrl: 'https://images.unsplash.com/photo-1525811902-f2342640856e?w=500&q=80',
  },
];

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFile?: File | null;
}

export default function VisualSearchModal({ isOpen, onClose, initialFile }: VisualSearchModalProps) {
  const router = useRouter();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [activeSampleTitle, setActiveSampleTitle] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<VisualSearchProduct[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [pasteNotice, setPasteNotice] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastPasteTimeRef = useRef<number>(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  // Dừng luồng Camera và giải phóng thiết bị
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Đóng modal an toàn (tự động tắt camera)
  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  // Điều hướng người dùng vào chi tiết sản phẩm và đóng modal
  const handleNavigateProduct = (productId: string) => {
    handleClose();
    router.push(`/san-pham/${productId}`);
  };

  // Thực thi gọi API Visual Search
  const executeVisualSearch = useCallback(
    async (payload: {
      image_base64?: string;
      reference_product_id?: string;
      sport_type?: string;
      filename?: string;
      top_k?: number;
    }) => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch(`${API_URL}/products/visual-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            top_k: payload.top_k || 8,
          }),
        });

        if (!res.ok) {
          throw new Error(`Máy chủ trả về mã lỗi: ${res.status}`);
        }

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err: any) {
        console.error('Visual search request error:', err);
        setErrorMsg('Không thể kết nối đến hệ thống tìm kiếm ảnh. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    },
    [API_URL]
  );

  // Xử lý khi người dùng chọn file ảnh từ máy tính hoặc dán từ clipboard
  const handleFileProcess = useCallback(
    (file: File, isFromPaste = false) => {
      stopCamera();
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Vui lòng chọn hoặc dán tệp định dạng hình ảnh (.jpg, .png, .webp)');
        return;
      }

      setErrorMsg('');
      const displayName =
        file.name && file.name !== 'image.png' && file.name !== 'clipboard-pasted.png'
          ? file.name
          : 'Ảnh đã dán từ Clipboard';
      setActiveSampleTitle(displayName);
      setSelectedSport('');

      if (isFromPaste) {
        setPasteNotice('Đã nhận diện ảnh dán! Đang tìm sản phẩm...');
        setTimeout(() => setPasteNotice(''), 3000);
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Str = e.target?.result as string;
        setPreviewImage(base64Str);
        executeVisualSearch({
          image_base64: base64Str,
          filename: displayName,
          top_k: 8,
        });
      };
      reader.onerror = () => {
        setErrorMsg('Lỗi khi đọc file ảnh từ máy tính hoặc clipboard.');
      };
      reader.readAsDataURL(file);
    },
    [stopCamera, executeVisualSearch]
  );

  // Khởi động luồng Camera trực tiếp (WebRTC)
  const startCamera = useCallback(async () => {
    setErrorMsg('');
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setErrorMsg('Trình duyệt của bạn không hỗ trợ tính năng truy cập Camera.');
      return;
    }

    try {
      setIsCameraActive(true);
      let mediaStream: MediaStream;
      try {
        // Ưu tiên camera sau trên thiết bị di động
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
      } catch {
        // Fallback webcam máy tính/laptop
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((err) => console.warn('Video play error:', err));
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Bạn đã từ chối cấp quyền Camera. Vui lòng cho phép quyền Camera trong cài đặt trình duyệt.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMsg('Không tìm thấy thiết bị Camera trên máy của bạn.');
      } else {
        setErrorMsg('Không thể mở Camera. Vui lòng kiểm tra lại thiết bị hoặc chọn tệp ảnh.');
      }
    }
  }, []);

  // Chụp khung hình từ Video Camera qua Canvas và gửi tìm kiếm
  const captureFromCamera = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setErrorMsg('Camera đang khởi động, vui lòng chờ 1-2 giây rồi bấm "Chụp ngay".');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setErrorMsg('Không thể khởi tạo bộ xử lý hình ảnh chụp.');
      return;
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setErrorMsg('Lỗi khi lưu ảnh từ Camera.');
          return;
        }
        const file = new File([blob], 'camera-search.jpg', { type: 'image/jpeg' });
        stopCamera();
        handleFileProcess(file);
      },
      'image/jpeg',
      0.92
    );
  }, [stopCamera, handleFileProcess]);

  // Đồng bộ luồng video khi bật Camera
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => console.warn('Video play error:', err));
    }
  }, [isCameraActive]);

  // Tự động giải phóng camera khi đóng modal hoặc unmount
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, stopCamera]);

  // Khử trùng lặp khi cả keydown và paste event cùng kích hoạt
  const processPastedFile = useCallback(
    (file: File) => {
      const now = Date.now();
      if (now - lastPasteTimeRef.current < 600) return;
      lastPasteTimeRef.current = now;
      handleFileProcess(file, true);
    },
    [handleFileProcess]
  );

  // Chủ động đọc ảnh từ Clipboard qua Clipboard API
  const handleClipboardRead = useCallback(async () => {
    // 1. Thử đọc blob ảnh từ navigator.clipboard.read
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.read) {
      try {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const blob = await item.getType(type);
              const file = new File([blob], 'clipboard-pasted.png', { type });
              processPastedFile(file);
              return true;
            }
          }
        }
      } catch (err) {
        console.warn('navigator.clipboard.read error:', err);
      }
    }

    // 2. Thử đọc URL ảnh từ text trong clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.readText) {
      try {
        const text = (await navigator.clipboard.readText()).trim();
        if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
          if (/\.(jpeg|jpg|png|webp|gif)($|\?)/i.test(text) || text.startsWith('data:image/')) {
            const now = Date.now();
            if (now - lastPasteTimeRef.current < 600) return true;
            lastPasteTimeRef.current = now;

            setPreviewImage(text);
            setActiveSampleTitle('Ảnh dán từ liên kết');
            setSelectedSport('');
            setPasteNotice('Đã nhận diện ảnh dán!');
            setTimeout(() => setPasteNotice(''), 3000);
            executeVisualSearch({
              image_base64: text,
              filename: 'clipboard-image',
              top_k: 8,
            });
            return true;
          }
        }
      } catch (err) {
        console.warn('navigator.clipboard.readText error:', err);
      }
    }

    return false;
  }, [processPastedFile, executeVisualSearch]);

  // Xử lý sự kiện dán ảnh (paste event)
  const handlePasteEvent = useCallback(
    (e: ClipboardEvent | React.ClipboardEvent) => {
      const clipboardData =
        'clipboardData' in e ? e.clipboardData : (e as any).clipboardData;
      if (!clipboardData) return;

      // 1. Kiểm tra items trong clipboard (Snipping Tool, Win + Shift + S, sao chép ảnh từ web)
      const items = clipboardData.items;
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              e.preventDefault();
              processPastedFile(file);
              return;
            }
          }
        }
      }

      // 2. Kiểm tra files trong clipboard (Ctrl + C file ảnh từ Windows Explorer)
      if (clipboardData.files && clipboardData.files.length > 0) {
        for (let i = 0; i < clipboardData.files.length; i++) {
          const file = clipboardData.files[i];
          if (file.type.startsWith('image/')) {
            e.preventDefault();
            processPastedFile(file);
            return;
          }
        }
      }

      // 3. Kiểm tra text/html (sao chép hình ảnh từ trang web khác)
      const html = clipboardData.getData('text/html');
      if (html) {
        const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match && match[1]) {
          const src = match[1];
          if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:image/')) {
            e.preventDefault();
            const now = Date.now();
            if (now - lastPasteTimeRef.current < 600) return;
            lastPasteTimeRef.current = now;

            setPreviewImage(src);
            setActiveSampleTitle('Ảnh dán từ liên kết');
            setSelectedSport('');
            setPasteNotice('Đã nhận diện ảnh dán!');
            setTimeout(() => setPasteNotice(''), 3000);
            executeVisualSearch({
              image_base64: src,
              filename: 'clipboard-image',
              top_k: 8,
            });
            return;
          }
        }
      }

      // 4. Kiểm tra text nếu dán URL ảnh trực tiếp
      const text = clipboardData.getData('text')?.trim();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        if (/\.(jpeg|jpg|png|webp|gif)($|\?)/i.test(text) || text.startsWith('data:image/')) {
          e.preventDefault();
          const now = Date.now();
          if (now - lastPasteTimeRef.current < 600) return;
          lastPasteTimeRef.current = now;

          setPreviewImage(text);
          setActiveSampleTitle('Ảnh dán từ liên kết');
          setSelectedSport('');
          setPasteNotice('Đã nhận diện ảnh dán!');
          setTimeout(() => setPasteNotice(''), 3000);
          executeVisualSearch({
            image_base64: text,
            filename: 'clipboard-image',
            top_k: 8,
          });
        }
      }
    },
    [processPastedFile, executeVisualSearch]
  );

  // Lắng nghe sự kiện paste trên toàn trang khi modal mở (không kích hoạt prompt xin quyền)
  useEffect(() => {
    if (!isOpen) return;

    modalRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const onDocPaste = (e: ClipboardEvent) => {
      handlePasteEvent(e);
    };

    const onDocKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      // Phím tắt Ctrl + V sẽ kích hoạt sự kiện native 'paste' của trình duyệt,
      // KHÔNG gọi navigator.clipboard.read() ở đây để tránh Chrome bật popup xin quyền.
    };

    document.addEventListener('paste', onDocPaste, true);
    document.addEventListener('keydown', onDocKeyDown, true);
    window.addEventListener('paste', onDocPaste, true);

    return () => {
      document.removeEventListener('paste', onDocPaste, true);
      document.removeEventListener('keydown', onDocKeyDown, true);
      window.removeEventListener('paste', onDocPaste, true);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleClose, handlePasteEvent]);

  // Xử lý ảnh được truyền sẵn từ bên ngoài (ví dụ dán tại ô tìm kiếm)
  useEffect(() => {
    if (isOpen && initialFile) {
      handleFileProcess(initialFile, true);
    }
  }, [isOpen, initialFile, handleFileProcess]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Xử lý khi bấm chọn 1 trong 6 mẫu thể thao Demo
  const handleSelectDemoSample = (sample: DemoSportSample) => {
    stopCamera();
    setPreviewImage(sample.imageUrl);
    setActiveSampleTitle(sample.title);
    setSelectedSport(sample.sport);
    executeVisualSearch({
      sport_type: sample.sport,
      filename: sample.title,
      top_k: 8,
    });
  };

  // Tự động kích hoạt mẫu đầu tiên khi mới mở modal lần đầu (chỉ khi không có initialFile)
  useEffect(() => {
    if (isOpen && !initialFile && products.length === 0 && !previewImage && !loading) {
      handleSelectDemoSample(DEMO_SPORT_SAMPLES[0]);
    }
  }, [isOpen, initialFile]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onPaste={handlePasteEvent}
        className="bg-white rounded-3xl shadow-2xl w-[95vw] max-w-5xl h-[85vh] max-h-[85vh] flex flex-col overflow-hidden border border-slate-100 outline-none"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Camera size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 leading-tight">
                  Tìm kiếm sản phẩm bằng hình ảnh
                </h2>
                <span className="hidden sm:inline-flex text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                  Google Lens Style &bull; NCF 32D
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Chụp ảnh trực tiếp, dán ảnh hoặc tải tệp để tìm sản phẩm thể thao tương tự
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
            title="Đóng hộp thoại"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung Modal: Split-View 2 Cột (Trái - Phải) */}
        <div className="flex-1 min-h-0 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* CỘT TRÁI (md:col-span-4): Khung ảnh Google Lens / Camera, 3 Nút Thao Tác & 6 Mẫu thể thao */}
          <div className="md:col-span-4 bg-slate-50/80 border-r border-slate-100 p-4 sm:p-5 flex flex-col overflow-y-auto">
            {/* Input file ẩn */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileInputChange}
            />

            {/* Khung hiển thị ảnh truy vấn / Camera trực tiếp với hiệu ứng Google Lens */}
            <div className="flex flex-col">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isCameraActive) setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  if (!isCameraActive) handleDrop(e);
                }}
                className={`relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border-2 transition-all flex items-center justify-center bg-slate-900 shadow-inner group ${
                  isDragOver
                    ? 'border-blue-500 ring-2 ring-blue-300'
                    : isCameraActive
                    ? 'border-blue-500 ring-2 ring-blue-400/50'
                    : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                {/* 4 góc khung ngắm vuông AI Google Lens */}
                <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl-sm pointer-events-none z-20 transition-all group-hover:scale-110" />
                <span className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-tr-sm pointer-events-none z-20 transition-all group-hover:scale-110" />
                <span className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl-sm pointer-events-none z-20 transition-all group-hover:scale-110" />
                <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-blue-500 rounded-br-sm pointer-events-none z-20 transition-all group-hover:scale-110" />

                {/* Thanh quét sáng ngang nhẹ (Scan beam effect) */}
                <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_rgba(96,165,250,0.9)] animate-pulse pointer-events-none z-20" />

                {/* Hiển thị Video Camera trực tiếp (WebRTC) */}
                {isCameraActive ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* 2 nút Chụp ngay và Hủy nổi ngay trên luồng video camera */}
                    <div className="absolute bottom-2.5 inset-x-3 z-30 flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          captureFromCamera();
                        }}
                        className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/40 transition cursor-pointer"
                      >
                        <Camera size={14} />
                        <span>Chụp ngay</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          stopCamera();
                        }}
                        className="py-1.5 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-sm transition cursor-pointer border border-white/20"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : previewImage ? (
                  <>
                    <img
                      src={previewImage}
                      alt="Ảnh tìm kiếm"
                      className="max-h-full max-w-full object-contain p-2 rounded-xl transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = SPORTS_FALLBACK_IMAGE;
                      }}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1.5 z-20 cursor-pointer"
                    >
                      <Camera size={14} />
                      <span>Nhấp để đổi ảnh</span>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center text-center p-3 text-slate-300 z-10 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-slate-800 text-blue-400 flex items-center justify-center mb-2">
                      <Camera size={20} />
                    </div>
                    <span className="text-xs font-bold text-white">
                      Kéo thả hoặc <span className="text-blue-400 underline">chọn ảnh</span>
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">
                      Hỗ trợ JPG, PNG, WEBP hoặc Camera
                    </span>
                  </div>
                )}
              </div>

              {/* Tên ảnh / Nhãn nhận diện */}
              <p
                className="text-xs font-semibold text-slate-800 text-center truncate mt-2.5 px-1"
                title={isCameraActive ? 'Đang mở Camera trực tiếp' : activeSampleTitle || 'Ảnh đã chọn'}
              >
                {isCameraActive ? '📷 Đang mở Camera trực tiếp...' : activeSampleTitle || 'Ảnh tìm kiếm sản phẩm'}
              </p>

              {/* Nhóm 3 nút thao tác gọn gàng: "Chọn tệp ảnh", "Mở Camera" và "Dán ảnh" */}
              <div className="grid grid-cols-3 gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    fileInputRef.current?.click();
                  }}
                  className="py-1.5 px-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 hover:border-blue-300 text-slate-700 text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition cursor-pointer shadow-2xs"
                  title="Chọn tệp ảnh từ máy tính"
                >
                  <UploadCloud size={13} className="text-blue-600 shrink-0" />
                  <span className="truncate">Chọn tệp ảnh</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (isCameraActive) {
                      stopCamera();
                    } else {
                      startCamera();
                    }
                  }}
                  className={`py-1.5 px-1 rounded-xl border text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition cursor-pointer shadow-2xs ${
                    isCameraActive
                      ? 'border-red-300 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border-slate-200 bg-white hover:bg-slate-100 hover:border-blue-300 text-slate-700'
                  }`}
                  title={isCameraActive ? 'Tắt camera' : 'Mở Camera để chụp ảnh trực tiếp'}
                >
                  <Camera size={13} className={isCameraActive ? 'text-red-600 shrink-0' : 'text-blue-600 shrink-0'} />
                  <span className="truncate">{isCameraActive ? 'Tắt Camera' : 'Mở Camera'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    handleClipboardRead();
                  }}
                  className="py-1.5 px-1 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition cursor-pointer shadow-2xs"
                  title="Dán ảnh từ bộ nhớ tạm"
                >
                  <ClipboardPaste size={13} className="text-blue-600 shrink-0" />
                  <span className="truncate">Dán ảnh</span>
                </button>
              </div>
            </div>

            {/* Phần "Hoặc chọn nhanh ảnh mẫu có sẵn": Lưới 2 cột nhỏ gọn */}
            <div className="mt-4 pt-3.5 border-t border-slate-200/70 flex flex-col flex-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
                <Sparkles size={13} className="text-amber-500" />
                Hoặc chọn nhanh ảnh mẫu
              </span>

              <div className="grid grid-cols-2 gap-2">
                {DEMO_SPORT_SAMPLES.map((sample) => {
                  const isSelected = previewImage === sample.imageUrl && !isCameraActive;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectDemoSample(sample)}
                      className={`group relative flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/90 shadow-2xs ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-white bg-white/70'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                        <img
                          src={sample.imageUrl}
                          alt={sample.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = SPORTS_FALLBACK_IMAGE;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 pr-1">
                        <span className="text-[9.5px] font-bold text-blue-600 uppercase block truncate leading-tight">
                          {sample.sport}
                        </span>
                        <p className="text-[10px] font-medium text-slate-700 line-clamp-1 leading-tight mt-0.5">
                          {sample.title}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 text-blue-600">
                          <CheckCircle2 size={11} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (md:col-span-8): Tiêu đề cố định & Lưới kết quả sản phẩm */}
          <div className="md:col-span-8 flex flex-col h-full min-h-0 bg-white">
            {/* Thanh tiêu đề kết quả cố định */}
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-900">
                  Sản phẩm gợi ý tương tự
                </span>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                  {products.length} sản phẩm
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline-block">
                Đối sánh kiểu dáng, màu sắc &amp; ngữ cảnh bộ môn
              </span>
            </div>

            {/* Khu vực cuộn độc lập cho kết quả */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 pr-2 sm:pr-4 space-y-3">
              {/* Thông báo dán ảnh thành công */}
              {pasteNotice && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200 shadow-2xs">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>{pasteNotice}</span>
                </div>
              )}

              {/* Thông báo lỗi nếu có */}
              {errorMsg && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between">
                  <span>{errorMsg}</span>
                  <button
                    type="button"
                    onClick={() => handleSelectDemoSample(DEMO_SPORT_SAMPLES[0])}
                    className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[11px] font-bold hover:bg-red-700 cursor-pointer"
                  >
                    Thử lại
                  </button>
                </div>
              )}

              {/* Trạng thái tải dữ liệu */}
              {loading ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center py-16 space-y-3">
                  <div className="w-10 h-10 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
                  <p className="text-xs font-bold text-slate-800">
                    Đang tìm kiếm sản phẩm tương tự...
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Hệ thống đang trích xuất đặc trưng thị giác 48D và vector NCF 32D
                  </p>
                </div>
              ) : products.length > 0 ? (
                /* Lưới kết quả sản phẩm: 2 cột mobile, 3 cột desktop */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {products.map((p) => {
                    const matchPercent = p.ai_explanation?.match_percent || 92;
                    const salePrice =
                      p.discount_percent && p.discount_percent > 0
                        ? p.price * (1 - p.discount_percent / 100)
                        : p.price;

                    return (
                      <Link
                        key={p.product_id}
                        href={`/san-pham/${p.product_id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigateProduct(p.product_id);
                        }}
                        className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white hover:border-blue-500 hover:shadow-md transition-all overflow-hidden p-2.5 sm:p-3 cursor-pointer"
                      >
                        {/* Huy hiệu Độ tương đồng xanh lá ở góc trên trái ảnh */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-600 text-white shadow-xs">
                            Tương đồng {matchPercent}%
                          </span>
                        </div>

                        {/* Ảnh sản phẩm vuông */}
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-50 mb-2 border border-slate-100">
                          <img
                            src={p.image_url}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = SPORTS_FALLBACK_IMAGE;
                            }}
                          />
                        </div>

                        {/* Chi tiết sản phẩm */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            {/* Phân loại bộ môn & Nhãn thuật toán 1 dòng không ngắt dòng */}
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-bold uppercase text-slate-500 truncate">
                                {p.sport_type || 'Thể thao'}
                              </span>
                              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded whitespace-nowrap shrink-0">
                                Thị giác &amp; NCF 32D
                              </span>
                            </div>

                            {/* Tên sản phẩm tối đa 2 dòng không bị cắt khuất */}
                            <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug min-h-[2.4rem] pb-0.5 group-hover:text-blue-600 transition-colors">
                              {p.name}
                            </h4>

                            {/* Đánh giá sao & Đã bán */}
                            <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                              <Star size={11} className="fill-amber-400 text-amber-400" />
                              <span>{p.rating ? Number(p.rating).toFixed(1) : '5.0'}</span>
                              {p.reviews_count ? (
                                <span className="text-slate-400 font-normal text-[10px]">
                                  ({p.reviews_count})
                                </span>
                              ) : null}
                            </div>

                            {/* Giá bán nổi bật màu đỏ */}
                            <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-red-600">
                                {salePrice.toLocaleString('vi-VN')}đ
                              </span>
                              {p.discount_percent && p.discount_percent > 0 && (
                                <span className="text-[10px] text-slate-400 line-through">
                                  {p.price.toLocaleString('vi-VN')}đ
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Nút Xem chi tiết */}
                          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                            <span className="group-hover:underline">Xem chi tiết</span>
                            <div className="w-5 h-5 rounded-md bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                              <ArrowRight size={11} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center text-slate-400 text-xs py-12">
                  <p>Không tìm thấy sản phẩm phù hợp với ảnh này.</p>
                  <p className="mt-1 text-[11px] text-slate-400">Vui lòng thử tải lên hoặc chọn một ảnh mẫu khác.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Modal gọn gàng */}
        <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px] text-slate-400 hidden sm:inline-block">
            KADY Sports &bull; Tìm kiếm sản phẩm thông minh bằng đặc trưng thị giác &amp; NCF
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="ml-auto px-4 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

