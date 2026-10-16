"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import { notifications } from "@mantine/notifications";

export interface PromotionProductItem {
  id?: string;
  product_id?: string;
  name: string;
  price: number;
  image_url: string;
  product_type?: string;
  sport_type?: string;
  category?: string[];
  brand?: string;
  rating?: number;
  reviews_count?: number;
  discount_percent?: number;
  sold?: number;
  stock?: number;
  sizes?: string[];
  colors?: string[];
}

export const SPORTS = [
  { label: "Tất cả môn", value: "" },
  { label: "Pickleball", value: "Pickleball" },
  { label: "Cầu lông", value: "Cầu lông" },
  { label: "Bóng đá", value: "Đá bóng" },
  { label: "Chạy bộ", value: "Chạy bộ" },
  { label: "Bóng chuyền", value: "Bóng chuyền" },
  { label: "Dã ngoại", value: "Dã ngoại" },
  { label: "Gym & Đa dụng", value: "Đa dụng" },
];

export const PRODUCT_TYPES = [
  { label: "Tất cả", value: "" },
  { label: "Quần áo", value: "Quần áo" },
  { label: "Giày dép", value: "Giày dép" },
  { label: "Thiết bị", value: "Thiết bị" },
  { label: "Phụ kiện", value: "Phụ kiện" },
];

export const PRICE_RANGES = [
  { label: "Tất cả mức giá", min: null, max: null },
  { label: "Dưới 300.000đ", min: 0, max: 300000 },
  { label: "300.000đ - 700.000đ", min: 300000, max: 700000 },
  { label: "700.000đ - 1.500.000đ", min: 700000, max: 1500000 },
  { label: "Trên 1.500.000đ", min: 1500000, max: null },
];

export const COLOR_PALETTE = [
  { name: "Đen", hex: "#111827" },
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Xanh Navy", hex: "#1E3A8A" },
  { name: "Xanh Dương", hex: "#2563EB" },
  { name: "Đỏ", hex: "#DC2626" },
  { name: "Xám", hex: "#6B7280" },
  { name: "Vàng", hex: "#EAB308" },
  { name: "Cam", hex: "#F97316" },
  { name: "Xanh Lá", hex: "#16A34A" },
  { name: "Hồng", hex: "#EC4899" },
];

const ITEMS_PER_PAGE = 8;

export function usePromotionsFilter() {
  const [products, setProducts] = useState<PromotionProductItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedPriceIdx, setSelectedPriceIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("discount_desc");
  const [page, setPage] = useState<number>(1);

  // Wishlist
  const { toggleItem, isWishlisted } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamic sizes by product type
  const availableSizes = useMemo(() => {
    if (selectedType === "Giày dép") {
      return ["38", "39", "40", "41", "42", "43", "44", "45"];
    }
    if (selectedType === "Quần áo") {
      return ["S", "M", "L", "XL", "2XL", "3XL"];
    }
    if (selectedType === "Thiết bị") {
      return ["3U", "4U", "Size 4", "Size 5", "Tiêu chuẩn"];
    }
    if (selectedType === "Phụ kiện") {
      return ["Freesize", "S/M", "L/XL", "Tiêu chuẩn"];
    }
    return ["S", "M", "L", "XL", "40", "41", "42", "Tiêu chuẩn", "Freesize"];
  }, [selectedType]);

  // Fetch promotion products
  useEffect(() => {
    const fetchPromotions = async () => {
      setLoading(true);
      try {
        const skip = (page - 1) * ITEMS_PER_PAGE;
        let url = `http://localhost:8000/api/v1/products?is_promotion=true&skip=${skip}&limit=${ITEMS_PER_PAGE}`;

        if (selectedSport) url += `&sport_type=${encodeURIComponent(selectedSport)}`;
        if (selectedType) url += `&product_type=${encodeURIComponent(selectedType)}`;
        if (selectedSize) url += `&sizes=${encodeURIComponent(selectedSize)}`;
        if (selectedColor) url += `&colors=${encodeURIComponent(selectedColor)}`;
        if (sortBy) url += `&sort_by=${encodeURIComponent(sortBy)}`;

        const priceChoice = PRICE_RANGES[selectedPriceIdx];
        if (priceChoice.min !== null) url += `&min_price=${priceChoice.min}`;
        if (priceChoice.max !== null) url += `&max_price=${priceChoice.max}`;

        const res = await fetch(url);
        if (res.ok) {
          const totalHeader = res.headers.get("x-total-count") || res.headers.get("X-Total-Count");
          let data: PromotionProductItem[] = await res.json();

          if (minDiscount > 0) {
            data = data.filter((p) => (p.discount_percent || 0) >= minDiscount);
          }

          setProducts(data);
          setTotalCount(totalHeader ? parseInt(totalHeader, 10) : data.length);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm khuyến mãi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [page, selectedSport, selectedType, selectedPriceIdx, selectedSize, selectedColor, minDiscount, sortBy]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleResetFilters = () => {
    setSelectedSport("");
    setSelectedType("");
    setSelectedPriceIdx(0);
    setSelectedSize("");
    setSelectedColor("");
    setMinDiscount(0);
    setSortBy("discount_desc");
    setPage(1);
  };

  const handleToggleWishlist = (e: React.MouseEvent, p: PromotionProductItem) => {
    e.preventDefault();
    e.stopPropagation();
    const pid = String(p.product_id || p.id || "");
    if (!pid) return;

    const discountPercent = p.discount_percent || 0;
    const finalPrice = discountPercent > 0 ? p.price * (1 - discountPercent / 100) : p.price;

    const added = toggleItem({
      product_id: pid,
      name: p.name,
      price: finalPrice,
      image_url: p.image_url,
      category: p.category && p.category.length > 0 ? p.category[0] : "Thể Thao",
      original_price: discountPercent > 0 ? `${p.price.toLocaleString("vi-VN")}đ` : undefined,
      discount_percent: discountPercent,
      discount_label: discountPercent > 0 ? `-${discountPercent}%` : undefined,
    });

    notifications.show({
      message: added ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích",
      color: added ? "red" : "gray",
      autoClose: 2000,
    });
  };

  return {
    products,
    totalCount,
    loading,
    selectedSport,
    setSelectedSport,
    selectedType,
    setSelectedType,
    selectedPriceIdx,
    setSelectedPriceIdx,
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
    minDiscount,
    setMinDiscount,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    mounted,
    sectionRef,
    availableSizes,
    handlePageChange,
    handleResetFilters,
    handleToggleWishlist,
    isWishlisted,
  };
}
