import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { notifications } from "@mantine/notifications";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingProduct?: any | null;
}

export default function ProductFormModal({ isOpen, onClose, onSuccess, editingProduct }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    price: 0,
    image_url: "",
    stock: 100,
    rating: 0,
    reviews_count: 0,
    category: [] as string[],
    product_type: "",
    sport_type: "",
    sizes: [] as string[],
    colors: [] as string[],
    description: "",
    images: [] as string[],
  });

  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  useEffect(() => {
    let loadedCategories = JSON.parse(localStorage.getItem('admin_categories') || 'null');
    const defaultCategories = ["Bóng đá", "Cầu lông", "Bóng chuyền", "Chạy bộ", "Pickleball", "Dã ngoại", "Gym / Yoga", "Quần áo", "Giày dép", "Thiết bị", "Phụ kiện"];
    if (!loadedCategories || loadedCategories.includes("Giày Chạy Bộ (Running)")) {
      loadedCategories = defaultCategories;
      localStorage.setItem('admin_categories', JSON.stringify(defaultCategories));
    }
    setAvailableCategories(loadedCategories);
    setAvailableColors(JSON.parse(localStorage.getItem('admin_colors') || '["Đen", "Trắng", "Đỏ", "Xanh Dương", "Xám", "Vàng"]'));
    
    const shoes = JSON.parse(localStorage.getItem('admin_shoe_sizes') || '["36", "37", "38", "39", "40", "41", "42", "43", "44"]');
    const clothes = JSON.parse(localStorage.getItem('admin_clothing_sizes') || '["XS", "S", "M", "L", "XL", "XXL"]');
    setAvailableSizes([...new Set([...shoes, ...clothes])]);
  }, []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        product_id: editingProduct.product_id || "",
        name: editingProduct.name || "",
        price: editingProduct.price || 0,
        image_url: editingProduct.image_url || "",
        stock: editingProduct.stock !== undefined ? editingProduct.stock : 100,
        rating: editingProduct.rating !== undefined ? editingProduct.rating : 0,
        reviews_count: editingProduct.reviews_count !== undefined ? editingProduct.reviews_count : 0,
        product_type: editingProduct.product_type || "",
        sport_type: editingProduct.sport_type || "",
        category: Array.isArray(editingProduct.category) ? editingProduct.category : (editingProduct.category ? [editingProduct.category] : []),
        sizes: Array.isArray(editingProduct.sizes) ? editingProduct.sizes : (editingProduct.sizes ? [editingProduct.sizes] : []),
        colors: Array.isArray(editingProduct.colors) ? editingProduct.colors : (editingProduct.colors ? [editingProduct.colors] : []),
        description: editingProduct.description || "",
        images: Array.isArray(editingProduct.images) && editingProduct.images.length > 0 
          ? editingProduct.images 
          : (editingProduct.image_url ? [editingProduct.image_url] : []),
      });
    } else {
      setFormData({
        product_id: "",
        name: "",
        price: 0,
        image_url: "",
        stock: 100,
        rating: 0,
        reviews_count: 0,
        product_type: "",
        sport_type: "",
        category: [],
        sizes: [],
        colors: [],
        description: "",
        images: [],
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      product_id: formData.product_id,
      name: formData.name,
      price: Number(formData.price),
      image_url: formData.image_url,
      stock: Number(formData.stock),
      rating: Number(formData.rating),
      reviews_count: Number(formData.reviews_count),
      product_type: formData.product_type,
      sport_type: formData.sport_type,
      category: formData.category,
      sizes: formData.sizes,
      colors: formData.colors,
      description: formData.description,
      images: formData.images,
    };

    try {
      const url = editingProduct 
        ? `http://localhost:8000/api/v1/products/${editingProduct.product_id}`
        : `http://localhost:8000/api/v1/products/`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        notifications.show({ title: 'Thành công', message: 'Lưu sản phẩm thành công!', color: 'green' });
        onSuccess();
        onClose();
      } else {
        const errorData = await res.json();
        notifications.show({ title: 'Lỗi', message: errorData.detail || 'Có lỗi xảy ra', color: 'red' });
      }
    } catch (error) {
      notifications.show({ title: 'Lỗi', message: 'Không thể kết nối tới server', color: 'red' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col w-full animate-in fade-in zoom-in-95 duration-200">
      <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{editingProduct ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm Mới'}</h2>
          <p className="text-sm text-gray-500 mt-1">Điền đầy đủ thông tin bên dưới để lưu vào hệ thống</p>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <X size={24} />
        </button>
      </div>
      
      <div className="p-8 overflow-y-auto w-full">
        <form id="product-form" onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã Sản phẩm (Tùy chọn - Tự động sinh nếu để trống)</label>
              <input type="text" disabled={!!editingProduct} value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})} className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100" placeholder="Hệ thống tự tạo mã nếu để trống" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên Sản phẩm</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-md" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết sản phẩm</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-3 py-2 border rounded-md resize-y" placeholder="Nhập mô tả sản phẩm vào đây..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng tồn kho</label>
                <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-md" />
              </div>
            </div>



            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh</label>
              
              <div className="flex flex-wrap gap-4 items-start">
                {formData.images.map((imgUrl, index) => (
                  <div key={index} className="relative group w-24 h-24 border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0">
                    <img src={imgUrl} alt={`Product ${index}`} className="w-full h-full object-contain" />
                    <button 
                      type="button" 
                      onClick={() => {
                        const newImages = formData.images.filter((_, i) => i !== index);
                        setFormData({...formData, images: newImages, image_url: newImages.length > 0 ? newImages[0] : ''});
                      }} 
                      className="absolute top-1 right-1 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                <label className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors text-gray-400 hover:text-gray-500">
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden" 
                    onChange={(e) => {
                      const files = e.target.files;
                      if (!files) return;
                      let updatedImages = [...formData.images];
                      
                      const processFile = (index: number) => {
                        if (index >= files.length) {
                           setFormData({...formData, images: updatedImages, image_url: updatedImages.length > 0 ? updatedImages[0] : formData.image_url});
                           return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          updatedImages.push(reader.result as string);
                          processFile(index + 1);
                        };
                        reader.readAsDataURL(files[index]);
                      };
                      
                      processFile(0);
                    }} 
                  />
                  <Plus size={24} />
                  <span className="text-[10px] mt-1 font-medium">Thêm ảnh</span>
                </label>
              </div>
              
              <div className="mt-4 flex gap-2">
                <input 
                  type="url" 
                  id="url-input"
                  className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
                  placeholder="Hoặc dán URL hình ảnh vào đây..." 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val) {
                        const newImages = [...formData.images, val];
                        setFormData({...formData, images: newImages, image_url: newImages[0]});
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
                <button 
                  type="button" 
                  onClick={() => {
                    const input = document.getElementById('url-input') as HTMLInputElement;
                    const val = input?.value.trim();
                    if (val) {
                      const newImages = [...formData.images, val];
                      setFormData({...formData, images: newImages, image_url: newImages[0]});
                      input.value = '';
                    }
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Thêm URL
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm</label>
                <select value={formData.product_type} onChange={e => setFormData({...formData, product_type: e.target.value})} className="w-full px-3 py-2 border rounded-md">
                  <option value="">Chọn loại sản phẩm...</option>
                  <option value="Quần áo">Quần áo</option>
                  <option value="Giày dép">Giày dép</option>
                  <option value="Phụ kiện">Phụ kiện</option>
                  <option value="Thiết bị">Thiết bị</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Môn thể thao</label>
                <select value={formData.sport_type} onChange={e => setFormData({...formData, sport_type: e.target.value})} className="w-full px-3 py-2 border rounded-md">
                  <option value="">Chọn môn thể thao...</option>
                  <option value="Bóng chuyền">Bóng chuyền</option>
                  <option value="Cầu lông">Cầu lông</option>
                  <option value="Đá bóng">Đá bóng</option>
                  <option value="Chạy bộ">Chạy bộ</option>
                  <option value="Pickleball">Pickleball</option>
                  <option value="Dã ngoại">Dã ngoại</option>
                  <option value="Đa dụng">Đa dụng (Gym/Training)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục (Chọn từ Thuộc tính)</label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 min-h-[42px]">
                {availableCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({
                      ...formData, 
                      category: formData.category.includes(cat) 
                        ? formData.category.filter(c => c !== cat) 
                        : [...formData.category, cat]
                    })}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${formData.category.includes(cat) ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 max-h-32 overflow-y-auto">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({
                        ...formData, 
                        colors: formData.colors.includes(color) 
                          ? formData.colors.filter(c => c !== color) 
                          : [...formData.colors, color]
                      })}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${formData.colors.includes(color) ? 'bg-gray-900 text-white' : 'bg-white border text-gray-600 hover:bg-gray-100'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kích cỡ</label>
                <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-gray-50 max-h-32 overflow-y-auto">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData({
                        ...formData, 
                        sizes: formData.sizes.includes(size) 
                          ? formData.sizes.filter(s => s !== size) 
                          : [...formData.sizes, size]
                      })}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${formData.sizes.includes(size) ? 'bg-gray-900 text-white' : 'bg-white border text-gray-600 hover:bg-gray-100'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
        </form>
      </div>

      <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 mt-auto">
        <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">Trở về</button>
        <button type="submit" form="product-form" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
          {loading ? 'Đang lưu...' : 'Lưu Sản phẩm'}
        </button>
      </div>
    </div>
  );
}
