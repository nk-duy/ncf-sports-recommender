/**
 * Helper utility to provide Authorization headers with Bearer token for API requests
 * Tách biệt độc lập giữa Quản trị viên (Admin Portal) và Khách hàng (Storefront)
 */

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kady_admin_token') || localStorage.getItem('admin_token') || localStorage.getItem('token');
}

export function getCustomerToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kady_customer_token') || localStorage.getItem('token');
}

export function getAdminAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };
  const token = getAdminToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export function getCustomerAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { ...extraHeaders };
  const token = getCustomerToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Mặc định getAuthHeaders() phục vụ cho các trang Quản trị (Admin)
 */
export function getAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  return getAdminAuthHeaders(extraHeaders);
}

