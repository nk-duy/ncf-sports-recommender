'use client';

import React, { useEffect, useState } from 'react';
import type { RawReviewResponse } from '../types';
import { resolveApiBaseUrl } from '@/shared/lib/apiUrl';

export interface ReviewItem {
  id: string;
  user_name: string;
  avatar_url?: string;
  rating: number;
  comment: string;
  timestamp: string;
  size_bought?: string;
  color_bought?: string;
  verified_purchase?: boolean;
  images?: string[];
}

export function useProductReviews(productId: string) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${resolveApiBaseUrl()}/reviews/product/${productId}`);
        if (res.ok) {
          const data: unknown = await res.json();
          if (active && Array.isArray(data)) {
            const mappedReviews: ReviewItem[] = (data as RawReviewResponse[]).map((r, idx) => ({
              id: r.id || r._id || `rev-${idx}`,
              user_name: r.user_name || 'Khách hàng',
              avatar_url: r.avatar_url,
              rating: r.rating || 5,
              comment: r.comment || '',
              timestamp: r.timestamp || new Date().toISOString(),
              verified_purchase: true,
              images: r.images || [],
              size_bought: r.size_bought,
              color_bought: r.color_bought,
            }));
            setReviews(mappedReviews);
          } else if (active) {
            setReviews([]);
          }
        } else if (active) {
          setReviews([]);
        }
      } catch {
        if (active) setReviews([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchReviews();
    return () => {
      active = false;
    };
  }, [productId]);

  const handleUploadImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (reviewImages.length >= 4) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${resolveApiBaseUrl()}/uploads/`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data: { url?: string } = await res.json();
        if (data.url) {
          setReviewImages((prev) => [...prev, data.url as string]);
        }
      }
    } catch (err) {
      console.error('Lỗi tải ảnh:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('kady_customer_token') || localStorage.getItem('token');
      const payload = {
        product_id: productId,
        rating: newRating,
        comment: newComment.trim(),
        images: reviewImages,
      };

      const res = await fetch(`${resolveApiBaseUrl()}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      let returnedReview: RawReviewResponse | null = null;
      if (res.ok) {
        returnedReview = await res.json();
      }

      const newReviewObj: ReviewItem = {
        id: returnedReview?.id || 'rev-' + Date.now(),
        user_name: returnedReview?.user_name || 'Khách hàng (Tôi)',
        rating: newRating,
        comment: newComment.trim(),
        images: reviewImages,
        timestamp: new Date().toISOString(),
        verified_purchase: true,
      };

      setReviews([newReviewObj, ...reviews]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsWriteModalOpen(false);
        setSubmitSuccess(false);
        setNewComment('');
        setReviewImages([]);
        setNewRating(5);
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính toán số liệu THỰC TẾ từ danh sách đánh giá trong CSDL
  const totalCount = reviews.length;
  const avgRating =
    totalCount > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1)
      : '0.0';

  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const s = Math.min(5, Math.max(1, Math.round(r.rating)));
    starCounts[s] = (starCounts[s] || 0) + 1;
  });

  const getPercentage = (count: number) => {
    if (totalCount === 0) return 0;
    return Math.round((count / totalCount) * 100);
  };

  const filteredReviews = reviews.filter((r) => {
    if (activeFilter === '5') return Math.round(r.rating) === 5;
    if (activeFilter === '4') return Math.round(r.rating) === 4;
    if (activeFilter === '3') return Math.round(r.rating) === 3;
    if (activeFilter === '2') return Math.round(r.rating) === 2;
    if (activeFilter === '1') return Math.round(r.rating) === 1;
    if (activeFilter === 'images') return Boolean(r.images && r.images.length > 0);
    return true;
  });

  return {
    reviews,
    loading,
    activeFilter,
    setActiveFilter,
    isWriteModalOpen,
    setIsWriteModalOpen,
    newRating,
    setNewRating,
    newComment,
    setNewComment,
    reviewImages,
    handleUploadImage,
    handleRemoveImage,
    isUploadingImage,
    isSubmitting,
    submitSuccess,
    isExpanded,
    setIsExpanded,
    totalCount,
    avgRating,
    starCounts,
    getPercentage,
    filteredReviews,
    handleSubmitReview,
  };
}
