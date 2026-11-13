"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { notifications } from "@mantine/notifications";
import { useWishlistStore } from "@/shared/store/wishlistStore";
import QuickAddToCartModal, { QuickAddProduct } from "@/shared/components/QuickAddToCartModal";
import { resolveApiBaseUrl } from "@/shared/lib/apiUrl";
import FlashSaleHeader from "./FlashSaleHeader";
import FlashSaleCard from "./FlashSaleCard";
import type { FlashSaleProduct } from "../types";

const emptySubscribe = () => () => {};

export default function FlashSaleSection() {
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const [modalProduct, setModalProduct] = useState<QuickAddProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { toggleItem, isWishlisted } = useWishlistStore();

  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const targetStr = localStorage.getItem("kadyFlashSaleEnd");
    let target = targetStr ? parseInt(targetStr, 10) : 0;
    if (!target || target < Date.now()) {
      target = Date.now() + 8 * 3600 * 1000 + 42 * 60 * 1000 + 19 * 1000;
      localStorage.setItem("kadyFlashSaleEnd", target.toString());
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        target = Date.now() + 12 * 3600 * 1000;
        localStorage.setItem("kadyFlashSaleEnd", target.toString());
      } else {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch(`${resolveApiBaseUrl()}/products/?is_promotion=true&sort_by=discount_desc&limit=12`)
      .then((r) => r.json())
      .then((data: FlashSaleProduct[]) => {
        setProducts(data);
      })
      .catch((err) => console.error("Lỗi tải flash sale:", err))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, p: FlashSaleProduct) => {
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

  const handleToggleWishlist = (e: React.MouseEvent, p: FlashSaleProduct) => {
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

  if (!loading && products.length === 0) return null;

  return (
    <section className="w-full bg-gradient-to-b from-red-50/40 via-white to-white py-12 border-t border-red-100/60">
      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <FlashSaleHeader mounted={mounted} timeLeft={timeLeft} onScroll={scroll} />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
                <div className="w-full aspect-square bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-none scroll-smooth select-none"
          >
            {products.map((p, index) => (
              <FlashSaleCard
                key={p.product_id}
                product={p}
                index={index}
                mounted={mounted}
                wishlisted={mounted && isWishlisted(p.product_id)}
                onToggleWishlist={handleToggleWishlist}
                onQuickAdd={handleQuickAdd}
              />
            ))}
          </div>
        )}
      </div>

      <QuickAddToCartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={modalProduct}
      />
    </section>
  );
}
