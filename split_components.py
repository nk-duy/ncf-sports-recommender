import os

page_path = 'd:/Projects/ncf-sports-recommender/frontend/src/app/(public)/products/[id]/page.tsx'
components_dir = 'd:/Projects/ncf-sports-recommender/frontend/src/modules/product_detail/components'

with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Helper to extract a block of HTML/JSX between two markers
def extract_block(start_marker, end_marker):
    start_idx = content.find(start_marker)
    if start_idx == -1: return ""
    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1: return ""
    return content[start_idx:end_idx].strip()

os.makedirs(components_dir, exist_ok=True)

# 1. Breadcrumb
breadcrumb_jsx = extract_block('{/* Breadcrumb Navigation */}', '{/* Main Product Section: 55% - 45% Split */}')
with open(os.path.join(components_dir, 'Breadcrumb.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";
import Link from "next/link";

export default function Breadcrumb({ productName }: { productName: string }) {
    return (
''' + breadcrumb_jsx.replace('Giày Chạy Bộ Marathon Carbon Alpha Pro', '{productName}') + '''
    );
}
''')

# 2. Product Gallery
gallery_jsx = extract_block('{/* Left Column: Gallery (7 cols ~ 58%) */}', '{/* Right Column: Purchasing & Specifications (5 cols ~ 42%) */}')
with open(os.path.join(components_dir, 'ProductGallery.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

interface Props {
    mainImage: string;
    setMainImage: (url: string) => void;
    productName: string;
}

export default function ProductGallery({ mainImage, setMainImage, productName }: Props) {
    return (
''' + gallery_jsx + '''
    );
}
''')

# 3. Product Info (Right Column)
info_jsx = extract_block('{/* Right Column: Purchasing & Specifications (5 cols ~ 42%) */}', '{/* Frequently Bought Together / AI Bundle Module */}')
# We need to wrap it in a div if it starts with multiple elements, but the source is already wrapped in <div className="lg:col-span-5...
with open(os.path.join(components_dir, 'ProductInfo.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

interface Props {
    product: any;
    formatPrice: (price: number) => string;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    setMainImage: (url: string) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    quantity: number;
    setQuantity: (qty: number) => void;
}

export default function ProductInfo({
    product, formatPrice, selectedColor, setSelectedColor, setMainImage, selectedSize, setSelectedSize, quantity, setQuantity
}: Props) {
    return (
''' + info_jsx + '''
    );
}
''')

# 4. Product Bundle
bundle_jsx = extract_block('{/* Frequently Bought Together / AI Bundle Module */}', '{/* Detailed Specifications & Tabs Section */}')
with open(os.path.join(components_dir, 'ProductBundle.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

export default function ProductBundle() {
    return (
''' + bundle_jsx + '''
    );
}
''')

# 5. Product Tabs
tabs_jsx = extract_block('{/* Detailed Specifications & Tabs Section */}', '{/* Related & Recommended Products (AI Engine Grid) */}')
with open(os.path.join(components_dir, 'ProductTabs.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

interface Props {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function ProductTabs({ activeTab, setActiveTab }: Props) {
    return (
''' + tabs_jsx + '''
    );
}
''')

# 6. Recommended Products
rec_jsx = extract_block('{/* Related & Recommended Products (AI Engine Grid) */}', '{/* Interactive JavaScript for Product Page Mechanics */}')
with open(os.path.join(components_dir, 'RecommendedProducts.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

export default function RecommendedProducts() {
    return (
''' + rec_jsx + '''
    );
}
''')

# Now rewrite page.tsx
new_page_content = """'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Breadcrumb from '@/modules/product_detail/components/Breadcrumb';
import ProductGallery from '@/modules/product_detail/components/ProductGallery';
import ProductInfo from '@/modules/product_detail/components/ProductInfo';
import ProductBundle from '@/modules/product_detail/components/ProductBundle';
import ProductTabs from '@/modules/product_detail/components/ProductTabs';
import RecommendedProducts from '@/modules/product_detail/components/RecommendedProducts';

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

  // Interactive states
  const [activeTab, setActiveTab] = useState('tab-desc');
  const [selectedColor, setSelectedColor] = useState('Xanh / Trắng Carbon');
  const [selectedSize, setSelectedSize] = useState('42');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setMainImage(data.image_url);
        } else {
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
    if (product) {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('http://localhost:8000/api/v1/interactions/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ product_id: product.product_id, interaction_type: 'view' })
        }).catch(err => console.error('Tracking failed', err));
      }
    }
  }, [product]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-headline-md">Đang tải dữ liệu...</div>;
  if (!product) return null;

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <main className="w-full pt-28 bg-surface">
      <div className="flex flex-col w-full">
        <Breadcrumb productName={product.name} />
        
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
"""

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(new_page_content)

print("Split successful!")
