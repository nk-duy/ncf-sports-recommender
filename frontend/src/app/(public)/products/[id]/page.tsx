'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProductBreadcrumb from '@/modules/detailproduct/components/ProductBreadcrumb';
import ProductGallery from '@/modules/detailproduct/components/ProductGallery';
import ProductInfo from '@/modules/detailproduct/components/ProductInfo';
import ProductBundle from '@/modules/detailproduct/components/ProductBundle';
import ProductTabs from '@/modules/detailproduct/components/ProductTabs';
import RecommendedProducts from '@/modules/detailproduct/components/RecommendedProducts';


interface ProductAPI {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
  category?: string[];
  brand?: string;
  rating?: number;
  reviews_count?: number;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductAPI | null>(null);
  const [loading, setLoading] = useState(true);

  // For interactive states
  const [activeTab, setActiveTab] = useState('tab-desc');
  const [selectedColor, setSelectedColor] = useState('Xanh / Trắng Carbon');
  const [selectedSize, setSelectedSize] = useState('42');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    // 1. Fetch Product
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setMainImage(data.image_url);
        } else {
          // Fallback to dummy data for UI testing if API fails
          setProduct({
            product_id: "SHOE-CARB-902",
            name: "Giày Chạy Bộ Marathon Carbon Alpha Pro",
            price: 2450000,
            image_url: "https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8",
            brand: "SportsAI Pro Athletics",
            rating: 4.9,
            reviews_count: 184
          });
          setMainImage("https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, router]);

  useEffect(() => {
    // 2. Track Interaction (View)
    if (product) {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:8000/api/v1/interactions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            product_id: product.product_id,
            interaction_type: 'view'
          })
        }).catch(err => console.error('Tracking failed', err));
      }
    }
  }, [product]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-headline-md">Đang tải dữ liệu...</div>;
  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
      <main className="w-full pt-28 bg-surface">
        <div className="flex flex-col w-full">

        <ProductBreadcrumb productName={product.name} />
        
        {/* Main Product Section: 55% - 45% Split */}
        <div className="w-full px-margin-desktop py-space-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
            <ProductGallery mainImage={mainImage} setMainImage={setMainImage} productName={product.name} />
            <ProductInfo 
                product={product} 
                formatPrice={formatPrice}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                setMainImage={setMainImage}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                setQuantity={setQuantity}
            />
          </div>
        </div>

        <ProductBundle />
        <ProductTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <RecommendedProducts />
      </div>
    </main>
  );
}
