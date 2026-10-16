'use client';

import { useState, useEffect } from 'react';

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

  // Form viết đánh giá modal state
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/reviews/product/${productId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mappedReviews: ReviewItem[] = data.map((r: any, idx: number) => ({
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
          } else {
            setReviews([]);
          }
        } else {
          setReviews([]);
        }
      } catch (err) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8000/api/v1/reviews/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          product_id: productId,
          rating: newRating,
          comment: newComment,
        }),
      });

      const newReviewObj: ReviewItem = {
        id: 'rev-' + Date.now(),
        user_name: 'Khách hàng (Tôi)',
        rating: newRating,
        comment: newComment,
        timestamp: new Date().toISOString(),
        verified_purchase: true,
      };

      setReviews([newReviewObj, ...reviews]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsWriteModalOpen(false);
        setSubmitSuccess(false);
        setNewComment('');
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính toán số liệu THỰC TẾ từ danh sách đánh giá trong CSDL
  const totalCount = reviews.length;
  const avgRating = totalCount > 0
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
    if (activeFilter === 'images') return r.images && r.images.length > 0;
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
