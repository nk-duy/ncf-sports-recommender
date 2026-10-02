import os

page_path = 'd:/Projects/ncf-sports-recommender/frontend/src/app/(public)/products/[id]/page.tsx'
components_dir = 'd:/Projects/ncf-sports-recommender/frontend/src/modules/product_detail/components'
os.makedirs(components_dir, exist_ok=True)

with open(page_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

def get_lines(start, end):
    return "".join(lines[start-1:end])

# 1. Breadcrumb: 93 - 105
breadcrumb_code = get_lines(93, 105)
with open(os.path.join(components_dir, 'ProductBreadcrumb.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";
import Link from "next/link";

export default function ProductBreadcrumb({ productName }: { productName: string }) {
    return (
''' + breadcrumb_code + '''
    );
}
''')

# 2. ProductGallery: 109 - 170
gallery_code = get_lines(109, 170)
with open(os.path.join(components_dir, 'ProductGallery.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

interface Props {
    mainImage: string;
    setMainImage: (url: string) => void;
    productName: string;
}

export default function ProductGallery({ mainImage, setMainImage, productName }: Props) {
    return (
''' + gallery_code + '''
    );
}
''')

# 3. ProductInfo: 171 - 402
info_code = get_lines(171, 402)
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
''' + info_code + '''
    );
}
''')

# 4. ProductBundle: 405 - 500
bundle_code = get_lines(405, 500)
with open(os.path.join(components_dir, 'ProductBundle.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

export default function ProductBundle() {
    return (
''' + bundle_code + '''
    );
}
''')

# 5. ProductTabs: 501 - 840
tabs_code = get_lines(501, 840)
with open(os.path.join(components_dir, 'ProductTabs.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

interface Props {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function ProductTabs({ activeTab, setActiveTab }: Props) {
    return (
''' + tabs_code + '''
    );
}
''')

# 6. RecommendedProducts: 841 - 990
rec_code = get_lines(841, 990)
with open(os.path.join(components_dir, 'RecommendedProducts.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

export default function RecommendedProducts() {
    return (
''' + rec_code + '''
    );
}
''')

# Now rewrite page.tsx
new_page = "".join(lines[0:92]) # Up to line 92
new_page += """
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
"""
with open(page_path, 'w', encoding='utf-8') as f:
    f.write(new_page)

# Import the components at the top
with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

imports = """
import ProductBreadcrumb from '@/modules/product_detail/components/ProductBreadcrumb';
import ProductGallery from '@/modules/product_detail/components/ProductGallery';
import ProductInfo from '@/modules/product_detail/components/ProductInfo';
import ProductBundle from '@/modules/product_detail/components/ProductBundle';
import ProductTabs from '@/modules/product_detail/components/ProductTabs';
import RecommendedProducts from '@/modules/product_detail/components/RecommendedProducts';
"""
content = content.replace("import { useParams, useRouter } from 'next/navigation';", "import { useParams, useRouter } from 'next/navigation';" + imports)

with open(page_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Split by lines successful!")
