/**
 * Chuẩn hóa URL máy chủ Backend API từ biến môi trường NEXT_PUBLIC_API_URL
 * Đảm bảo đường dẫn luôn kết thúc bằng /api/v1 bất kể người dùng cấu hình có hay không có hậu tố này.
 */
export function resolveApiBaseUrl(): string {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return rawApiUrl.endsWith('/api/v1') ? rawApiUrl : `${rawApiUrl}/api/v1`;
}

export const API_BASE_URL = resolveApiBaseUrl();

