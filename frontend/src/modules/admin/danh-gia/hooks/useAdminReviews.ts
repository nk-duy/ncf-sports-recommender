'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { getAuthHeaders } from '@/shared/lib/authHeader';
import { HiddenFilterType, ReviewItem } from '../types';

export function useAdminReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [hiddenFilter, setHiddenFilter] = useState<HiddenFilterType>('all');

  // Modal / Confirm state
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const fetchReviews = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      try {
        const limit = 15;
        const skip = (currentPage - 1) * limit;
        const params = new URLSearchParams({
          skip: String(skip),
          limit: String(limit),
        });

        if (search.trim()) {
          params.append('search', search.trim());
        }
        if (starFilter !== null) {
          params.append('rating', String(starFilter));
        }
        if (hiddenFilter === 'visible') {
          params.append('is_hidden', 'false');
        } else if (hiddenFilter === 'hidden') {
          params.append('is_hidden', 'true');
        }

        const res = await fetch(`${API_URL}/reviews/admin?${params.toString()}`, {
          headers: getAuthHeaders(),
        });

        if (res.ok) {
          const data: {
            items?: ReviewItem[];
            total?: number;
            page?: number;
            pages?: number;
          } = await res.json();
          setReviews(data.items || []);
          setTotal(data.total || 0);
          setPage(data.page || 1);
          setPages(data.pages || 1);
        } else {
          const err: { detail?: string } | null = await res.json().catch(() => null);
          notifications.show({
            title: 'Lỗi tải dữ liệu',
            message: err?.detail || 'Không thể tải danh sách đánh giá',
            color: 'red',
          });
        }
      } catch {
        notifications.show({
          title: 'Lỗi mạng',
          message: 'Không thể kết nối đến máy chủ quản trị',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    },
    [API_URL, search, starFilter, hiddenFilter]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchReviews(newPage);
  };

  const handleToggleVisibility = async (review: ReviewItem) => {
    setActionLoadingId(review.id);
    const newHiddenState = !review.is_hidden;
    try {
      const res = await fetch(`${API_URL}/reviews/admin/${review.id}/visibility`, {
        method: 'PATCH',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ is_hidden: newHiddenState }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === review.id ? { ...r, is_hidden: newHiddenState } : r))
        );
        notifications.show({
          title: 'Cập nhật thành công',
          message: newHiddenState
            ? 'Đã ẩn đánh giá khỏi giao diện khách hàng và cập nhật lại điểm sản phẩm'
            : 'Đã hiển thị lại đánh giá cho khách hàng',
          color: 'green',
        });
      } else {
        const err: { detail?: string } | null = await res.json().catch(() => null);
        notifications.show({
          title: 'Không thể cập nhật',
          message: err?.detail || 'Lỗi xử lý yêu cầu',
          color: 'red',
        });
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setActionLoadingId(reviewId);
    try {
      const res = await fetch(`${API_URL}/reviews/admin/${reviewId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setTotal((prev) => Math.max(0, prev - 1));
        setDeletingId(null);
        notifications.show({
          title: 'Xóa thành công',
          message: 'Đã xóa vĩnh viễn đánh giá và tính toán lại điểm sản phẩm',
          color: 'green',
        });
      } else {
        const err: { detail?: string } | null = await res.json().catch(() => null);
        notifications.show({
          title: 'Không thể xóa',
          message: err?.detail || 'Lỗi khi xóa đánh giá',
          color: 'red',
        });
      }
    } catch {
      notifications.show({ title: 'Lỗi', message: 'Lỗi kết nối máy chủ', color: 'red' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const metrics = useMemo(() => {
    const positiveCount = reviews.filter((r) => r.rating >= 4).length;
    const negativeCount = reviews.filter((r) => r.rating <= 2).length;
    const hiddenCount = reviews.filter((r) => r.is_hidden).length;
    return { positiveCount, negativeCount, hiddenCount };
  }, [reviews]);

  return {
    reviews,
    total,
    page,
    pages,
    loading,
    search,
    setSearch,
    starFilter,
    setStarFilter,
    hiddenFilter,
    setHiddenFilter,
    previewImages,
    setPreviewImages,
    deletingId,
    setDeletingId,
    actionLoadingId,
    metrics,
    refreshReviews: () => fetchReviews(page),
    handlePageChange,
    handleToggleVisibility,
    handleDeleteReview,
  };
}
