"use client";

import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { notifications } from "@mantine/notifications";
import { useAuthStore } from "@/shared/store/authStore";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import type { QuickAddProduct } from "@/shared/components/QuickAddToCartModal";
import type { RecProduct } from "../types";

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

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [modalProduct, setModalProduct] = useState<QuickAddProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const loadRecommendationsData = useCallback(async (currentToken: string | null): Promise<RecProduct[] | null> => {
    const authToken =
      currentToken ||
      (typeof window !== "undefined"
        ? localStorage.getItem("kady_customer_token") || localStorage.getItem("token")
        : null);
    const headers: Record<string, string> = {};
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Fetch 12 personalized recommended products
    const res = await fetch("http://localhost:8000/api/v1/recommendations/?top_k=12", {
      headers,
    });

    if (!res.ok) return null;
    const data: RecProduct[] = await res.json();
    return deduplicateRecommendations(data);
  }, []);

  useEffect(() => {
    let active = true;
    loadRecommendationsData(token)
      .then((list) => {
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
        }
      });

    return () => {
      active = false;
    };
  }, [token, isAuthenticated, loadRecommendationsData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const list = await loadRecommendationsData(token);
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
