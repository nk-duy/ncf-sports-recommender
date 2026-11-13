"use client";

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/shared/store/authStore";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { resolveApiBaseUrl } from "@/shared/lib/apiUrl";
import type { QuickAddProduct } from "@/shared/components/QuickAddToCartModal";
import type { LatentRadarAxis, RecProduct } from "../types";

const emptySubscribe = () => () => {};

function deduplicateRecommendations(data: RecProduct[]): RecProduct[] {
  const seenImgs = new Set<string>();
  const seenNames = new Set<string>();
  const uniqueList: RecProduct[] = [];

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

export function useRecommendedPage() {
  const { user, token, isAuthenticated } = useAuthStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const [products, setProducts] = useState<RecProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeSportTab, setActiveSportTab] = useState<string>("all");
  const [activeTypeTab, setActiveTypeTab] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");

  // Adaptive Fusion Weights & Cross-Sport Discovery State
  const [wNcf, setWNcf] = useState<number>(1.0);
  const [wVisual, setWVisual] = useState<number>(0.35);
  const [wContext, setWContext] = useState<number>(1.0);
  const [discoveryMode, setDiscoveryMode] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isTuning, setIsTuning] = useState<boolean>(false);
  const [radarAxes, setRadarAxes] = useState<LatentRadarAxis[]>([]);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [modalProduct, setModalProduct] = useState<QuickAddProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const getAuthHeaders = useCallback((currentToken: string | null): Record<string, string> => {
    const authToken =
      currentToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("kady_customer_token") || localStorage.getItem("token")
        : null);
    const headers: Record<string, string> = {};
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
    return headers;
  }, []);

  const loadRecommendationsData = useCallback(
    async (
      currentToken: string | null,
      params: {
        w_ncf: number;
        w_visual: number;
        w_context: number;
        discovery_mode: boolean;
      }
    ): Promise<RecProduct[] | null> => {
      const headers = getAuthHeaders(currentToken);
      const query = new URLSearchParams({
        top_k: "12",
        w_ncf: String(params.w_ncf),
        w_visual: String(params.w_visual),
        w_context: String(params.w_context),
        discovery_mode: String(params.discovery_mode),
      });

      const t0 = typeof performance !== "undefined" ? performance.now() : Date.now();
      const res = await fetch(`${resolveApiBaseUrl()}/recommendations/?${query.toString()}`, {
        headers,
      });
      const t1 = typeof performance !== "undefined" ? performance.now() : Date.now();
      setLatencyMs(Math.max(1, Math.round(t1 - t0)));

      if (!res.ok) return null;
      const data: RecProduct[] = await res.json();
      return deduplicateRecommendations(data);
    },
    [getAuthHeaders]
  );

  const loadLatentRadarData = useCallback(
    async (currentToken: string | null, currWNcf: number, currWVisual: number) => {
      try {
        const headers = getAuthHeaders(currentToken);
        const query = new URLSearchParams({
          w_ncf: String(currWNcf),
          w_visual: String(currWVisual),
        });
        const res = await fetch(`${resolveApiBaseUrl()}/recommendations/latent-radar?${query.toString()}`, {
          headers,
        });
        if (!res.ok) return;
        const data = await res.json();
        const axes: LatentRadarAxis[] = Array.isArray(data) ? data : data?.axes || [];
        if (axes.length > 0) {
          setRadarAxes(axes);
        }
      } catch (err) {
        console.error("Lỗi khi tải biểu đồ Radar 8 bộ môn:", err);
      }
    },
    [getAuthHeaders]
  );

  // Debounce 250ms khi thay đổi thanh trượt trọng số hoặc chế độ khám phá
  useEffect(() => {
    let active = true;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (active) {
        setIsTuning(true);
      }
      Promise.all([
        loadRecommendationsData(token, {
          w_ncf: wNcf,
          w_visual: wVisual,
          w_context: wContext,
          discovery_mode: discoveryMode,
        }),
        loadLatentRadarData(token, wNcf, wVisual),
      ])
        .then(([list]) => {
          if (active && list) {
            setProducts(list);
          }
        })
        .catch((err) => {
          console.error("Lỗi khi tải danh sách gợi ý:", err);
        })
        .finally(() => {
          if (active) {
            setLoading(false);
            setIsTuning(false);
          }
        });
    }, 250);

    return () => {
      active = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [token, isAuthenticated, wNcf, wVisual, wContext, discoveryMode, loadRecommendationsData, loadLatentRadarData]);

  const handleResetOptimal = () => {
    setWNcf(1.0);
    setWVisual(0.35);
    setWContext(1.0);
    setDiscoveryMode(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [list] = await Promise.all([
        loadRecommendationsData(token, {
          w_ncf: wNcf,
          w_visual: wVisual,
          w_context: wContext,
          discovery_mode: discoveryMode,
        }),
        loadLatentRadarData(token, wNcf, wVisual),
      ]);
      if (list) {
        setProducts(list);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách gợi ý:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, p: RecProduct) => {
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

  const handleToggleWishlist = (e: React.MouseEvent, p: RecProduct) => {
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

  const filteredProducts = products.filter((p) => {
    if (p.is_hidden || p.is_deleted) return false;

    if (activeSportTab !== "all" && p.sport_type !== activeSportTab) {
      if (!(activeSportTab === "Đa dụng" && p.sport_type?.toLowerCase().includes("gym"))) {
        return false;
      }
    }

    const lowerName = p.name.toLowerCase();
    if (activeTypeTab === "equipment") {
      return p.product_type === "Thiết bị" || lowerName.includes("vợt") || lowerName.includes("bóng");
    }
    if (activeTypeTab === "shoes") {
      return p.product_type === "Giày dép" || lowerName.includes("giày");
    }
    if (activeTypeTab === "clothes") {
      return p.product_type === "Quần áo" || lowerName.includes("áo") || lowerName.includes("quần");
    }
    if (activeTypeTab === "accessories") {
      return (
        p.product_type === "Phụ kiện" ||
        lowerName.includes("băng") ||
        lowerName.includes("túi") ||
        lowerName.includes("balo")
      );
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = (a.discount_percent || 0) > 0 ? a.price * (1 - (a.discount_percent || 0) / 100) : a.price;
    const priceB = (b.discount_percent || 0) > 0 ? b.price * (1 - (b.discount_percent || 0) / 100) : b.price;

    if (sortBy === "price_asc") return priceA - priceB;
    if (sortBy === "price_desc") return priceB - priceA;
    if (sortBy === "discount") return (b.discount_percent || 0) - (a.discount_percent || 0);
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return {
    user,
    isAuthenticated,
    productsCount: products.length,
    sortedProducts,
    loading,
    isRefreshing,
    activeSportTab,
    setActiveSportTab,
    activeTypeTab,
    setActiveTypeTab,
    sortBy,
    setSortBy,
    wNcf,
    setWNcf,
    wVisual,
    setWVisual,
    wContext,
    setWContext,
    discoveryMode,
    setDiscoveryMode,
    handleResetOptimal,
    latencyMs,
    isTuning,
    radarAxes,
    mounted,
    isWishlisted,
    modalProduct,
    isModalOpen,
    setIsModalOpen,
    handleRefresh,
    handleQuickAdd,
    handleToggleWishlist,
  };
}
