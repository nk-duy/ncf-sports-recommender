"use client";

import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { notifications } from "@mantine/notifications";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { useAuthStore } from "@/shared/store/authStore";
import { useAiXRayStore } from "@/shared/store/aiXRayStore";
import type { QuickAddProduct } from "@/shared/components/QuickAddToCartModal";
import type { HomeRecProduct } from "../types";

const emptySubscribe = () => () => {};

interface UserIdShape {
  id?: string;
  user_id?: string;
  full_name?: string;
}

function resolveUserId(user: unknown): string | undefined {
  if (!user || typeof user !== "object") return undefined;
  const u = user as UserIdShape;
  return u.id || u.user_id;
}

function resolveApiBaseUrl(): string {
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return rawApiUrl.endsWith("/api/v1") ? rawApiUrl : `${rawApiUrl}/api/v1`;
}

function deduplicateHomeRecs(data: HomeRecProduct[]): HomeRecProduct[] {
  const seenImgs = new Set<string>();
  const seenNames = new Set<string>();
  const uniqueList: HomeRecProduct[] = [];

  for (const p of data) {
    const cleanName = (p.name || "")
      .replace(/\s*-\s*Mẫu\s+\d+/i, "")
      .replace(/\s*-\s*V\d+/i, "")
      .trim()
      .toLowerCase();
    const img = (p.image_url || "").trim();
    if (img && seenImgs.has(img)) continue;
    if (cleanName && seenNames.has(cleanName)) continue;
    if (img) seenImgs.add(img);
    if (cleanName) seenNames.add(cleanName);
    uniqueList.push(p);
  }

  return uniqueList.slice(0, 12);
}

export function useHomeRecommendations() {
  const [products, setProducts] = useState<HomeRecProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>("all");
  const [impressionId, setImpressionId] = useState<string>("");

  const [modalProduct, setModalProduct] = useState<QuickAddProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { user, token, isAuthenticated } = useAuthStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { isXRayActive } = useAiXRayStore();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const currentUserId = resolveUserId(user);

  const fetchAndLogRecommendations = useCallback(
    async (authTokenParam: string | null, uid?: string) => {
      const authToken =
        authTokenParam ||
        (typeof window !== "undefined"
          ? localStorage.getItem("kady_customer_token") || localStorage.getItem("token")
          : null);
      const headers: Record<string, string> = {};
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const apiUrl = resolveApiBaseUrl();
      const endpoint = uid
        ? `${apiUrl}/recommendations/?top_k=12&user_id=${encodeURIComponent(uid)}`
        : `${apiUrl}/recommendations/?top_k=12`;

      const res = await fetch(endpoint, { headers });
      if (!res.ok) return null;

      const data: HomeRecProduct[] = await res.json();
      const finalProds = deduplicateHomeRecs(data);

      // Ghi nhận lượt hiển thị trực tuyến (Impression Logging) để tính toán Real-time CTR
      let loggedImpressionId: string | undefined;
      if (finalProds.length > 0) {
        fetch(`${apiUrl}/recommendations/log-impression`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "homepage",
            user_id: uid,
            recommended_product_ids: finalProds.map((p) => p.product_id),
          }),
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((resp: { impression_id?: string } | null) => {
            if (resp?.impression_id) {
              setImpressionId(resp.impression_id);
            }
          })
          .catch(() => {});
      }

      return { finalProds, loggedImpressionId };
    },
    []
  );

  useEffect(() => {
    let active = true;
    fetchAndLogRecommendations(token, currentUserId)
      .then((res) => {
        if (active && res) {
          setProducts(res.finalProds);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải gợi ý sản phẩm:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, isAuthenticated, currentUserId, fetchAndLogRecommendations]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchAndLogRecommendations(token, currentUserId);
      if (res) {
        setProducts(res.finalProds);
      }
    } catch (err) {
      console.error("Lỗi khi tải gợi ý sản phẩm:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleProductClick = (productId: string) => {
    if (impressionId) {
      const apiUrl = resolveApiBaseUrl();
      fetch(`${apiUrl}/recommendations/track-click`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          impression_id: impressionId,
          product_id: productId,
          user_id: currentUserId,
        }),
      }).catch(() => {});
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, p: HomeRecProduct) => {
    e.preventDefault();
    e.stopPropagation();

    setModalProduct({
      product_id: p.product_id,
      name: p.name,
      price: p.price,
      discount_percent: p.discount_percent,
      image_url: p.image_url,
      sizes: p.sizes,
      colors: p.colors,
      stock: p.stock,
      category: p.category,
      sport_type: p.sport_type,
    });
    setIsModalOpen(true);
  };

  const handleToggleWishlist = (e: React.MouseEvent, p: HomeRecProduct) => {
    e.preventDefault();
    e.stopPropagation();
    const pid = p.product_id;
    if (!pid) return;

    const discount = p.discount_percent || 0;
    const finalPrice = discount > 0 ? p.price * (1 - discount / 100) : p.price;

    const added = toggleItem({
      product_id: pid,
      name: p.name,
      price: finalPrice,
      image_url: p.image_url,
      category: p.category && p.category.length > 0 ? p.category[0] : "Thể Thao",
      original_price: discount > 0 ? `${p.price.toLocaleString("vi-VN")}đ` : undefined,
      discount_percent: discount,
      discount_label: discount > 0 ? `-${discount}%` : undefined,
    });

    notifications.show({
      message: added ? "Đã lưu vào danh sách yêu thích" : "Đã xóa khỏi yêu thích",
      color: added ? "red" : "gray",
      autoClose: 2000,
    });
  };

  const filteredProducts = products
    .filter((p) => {
      if (p.is_hidden || p.is_deleted) return false;
      if (activeCategoryTab === "all") return true;
      const lower = p.name.toLowerCase();
      if (activeCategoryTab === "equipment") {
        return p.product_type === "Thiết bị" || lower.includes("vợt") || lower.includes("bóng");
      }
      if (activeCategoryTab === "shoes") {
        return p.product_type === "Giày dép" || lower.includes("giày");
      }
      if (activeCategoryTab === "clothes") {
        return p.product_type === "Quần áo" || lower.includes("áo") || lower.includes("quần");
      }
      return true;
    })
    .slice(0, 8);

  return {
    user,
    isAuthenticated,
    filteredProducts,
    loading,
    isRefreshing,
    activeCategoryTab,
    setActiveCategoryTab,
    mounted,
    isXRayActive,
    isWishlisted,
    modalProduct,
    isModalOpen,
    setIsModalOpen,
    handleRefresh,
    handleProductClick,
    handleQuickAdd,
    handleToggleWishlist,
  };
}
