'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/shared/store/cartStore";
import { notifications } from "@mantine/notifications";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(items.map(i => `${i.product_id}-${i.size}-${i.color || ''}`));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    items.forEach(item => {
      const id = `${item.product_id}-${item.size}-${item.color || ''}`;
      if (selectedItems.includes(id)) {
        removeItem(item.product_id, item.size, item.color);
      }
    });
    setSelectedItems([]);
    notifications.show({
      title: 'Thành công',
      message: 'Đã xóa các sản phẩm đã chọn',
      color: 'green',
    });
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      notifications.show({
        title: 'Lỗi',
        message: 'Bạn vẫn chưa chọn sản phẩm nào để mua.',
        color: 'red',
      });
      return;
    }
    // We can store selected items to checkout store if we wanted to support partial checkout.
    // For now, we just redirect. If they want true partial checkout, we need to adapt checkout page to filter items.
    // Assuming we do it in a simple way for now.
    router.push('/checkout');
  };

  const selectedItemsData = items.filter(item => selectedItems.includes(`${item.product_id}-${item.size}-${item.color || ''}`));
  const totalPrice = selectedItemsData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = selectedItemsData.reduce((sum, item) => sum + item.quantity, 0);

  if (!mounted) return <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">Đang tải giỏ hàng...</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-blue-700 font-bold text-2xl tracking-tighter">SportsAI</span>
            <span className="text-blue-700 text-xl">|</span>
            <span className="text-blue-700 text-xl font-medium">Giỏ Hàng</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Table Header */}
        <div className="bg-white rounded shadow-sm flex items-center px-5 py-4 mb-3 text-sm text-gray-500">
          <div className="w-[45%] flex items-center gap-3">
            <input 
              type="checkbox" 
              className="w-4 h-4 accent-blue-600 cursor-pointer rounded-sm"
              checked={items.length > 0 && selectedItems.length === items.length}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span className="font-medium text-gray-700">Sản Phẩm</span>
          </div>
          <div className="w-[15%] text-center">Đơn Giá</div>
          <div className="w-[15%] text-center">Số Lượng</div>
          <div className="w-[15%] text-center">Số Tiền</div>
          <div className="w-[10%] text-center">Thao Tác</div>
        </div>

        {/* Cart Items List */}
        {items.length === 0 ? (
          <div className="bg-white rounded shadow-sm py-20 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart size={48} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium mb-4">Giỏ hàng của bạn còn trống</p>
            <Link href="/" className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm">
              Mua ngay
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded shadow-sm flex flex-col mb-6">
            {items.map((item, index) => {
              const id = `${item.product_id}-${item.size}-${item.color || ''}`;
              const isSelected = selectedItems.includes(id);

              return (
                <div key={id} className={`flex items-center px-5 py-4 border-b border-gray-100 hover:bg-gray-50 ${index === items.length - 1 ? 'border-b-0' : ''}`}>
                  <div className="w-[45%] flex items-start gap-3">
                    <div className="flex items-center pt-6">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 accent-blue-600 cursor-pointer rounded-sm"
                        checked={isSelected}
                        onChange={(e) => handleSelectItem(id, e.target.checked)}
                      />
                    </div>
                    <Link href={`/products/${item.product_id}`} className="block w-20 h-20 border border-gray-200 shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex flex-col gap-1 pr-4">
                      <Link href={`/products/${item.product_id}`} className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                        {item.name}
                      </Link>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit mt-1">
                        Phân loại hàng: {item.size}{item.color ? `, ${item.color}` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="w-[15%] text-center text-sm text-gray-700">
                    {formatPrice(item.price)}
                  </div>
                  <div className="w-[15%] flex justify-center">
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity - 1)}
                        className="w-8 h-8 text-gray-600 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center text-lg"
                      >-</button>
                      <input 
                        type="text" 
                        className="w-12 h-8 text-center text-sm font-medium focus:outline-none"
                        value={item.quantity}
                        readOnly
                      />
                      <button 
                        onClick={() => updateQuantity(item.product_id, item.size, item.color, item.quantity + 1)}
                        className="w-8 h-8 text-gray-600 hover:bg-gray-100 border-l border-gray-200 flex items-center justify-center text-lg"
                      >+</button>
                    </div>
                  </div>
                  <div className="w-[15%] text-center text-sm font-bold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <div className="w-[10%] text-center text-sm">
                    <button 
                      onClick={() => removeItem(item.product_id, item.size, item.color)}
                      className="text-gray-500 hover:text-red-600 transition-colors font-medium"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 accent-blue-600 rounded-sm"
                  checked={items.length > 0 && selectedItems.length === items.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700">Chọn Tất Cả ({items.length})</span>
              </label>
              <button onClick={handleDeleteSelected} className="text-sm font-medium text-gray-500 hover:text-red-600">Xóa</button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">
                  Tổng thanh toán ({totalCount} Sản phẩm): <span className="text-xl text-gray-900 font-bold ml-2">{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 h-12 rounded-lg text-sm font-bold transition-all shadow-md min-w-[200px]"
              >
                Tiếp tục thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
