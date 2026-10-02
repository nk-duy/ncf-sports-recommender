'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { notifications } from '@mantine/notifications';

export default function AdminAttributesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [shoeSizes, setShoeSizes] = useState<string[]>([]);
  const [clothingSizes, setClothingSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    // Load from localStorage or set defaults
    const loadedCategories = JSON.parse(localStorage.getItem('admin_categories') || '["Giày Chạy Bộ (Running)", "Sneaker Thể Thao / Lifestyle", "Quần Áo Thể Thao", "Phụ kiện"]');
    const loadedShoeSizes = JSON.parse(localStorage.getItem('admin_shoe_sizes') || '["36", "37", "38", "39", "40", "41", "42", "43", "44"]');
    const loadedClothingSizes = JSON.parse(localStorage.getItem('admin_clothing_sizes') || '["XS", "S", "M", "L", "XL", "XXL"]');
    const loadedColors = JSON.parse(localStorage.getItem('admin_colors') || '["Đen", "Trắng", "Đỏ", "Xanh Dương", "Xám", "Vàng"]');

    setCategories(loadedCategories);
    setShoeSizes(loadedShoeSizes);
    setClothingSizes(loadedClothingSizes);
    setColors(loadedColors);
  }, []);

  const saveSettings = () => {
    localStorage.setItem('admin_categories', JSON.stringify(categories));
    localStorage.setItem('admin_shoe_sizes', JSON.stringify(shoeSizes));
    localStorage.setItem('admin_clothing_sizes', JSON.stringify(clothingSizes));
    localStorage.setItem('admin_colors', JSON.stringify(colors));
    notifications.show({ title: 'Thành công', message: 'Đã lưu các thuộc tính thành công!', color: 'green' });
  };

  const addItem = (setter: any, list: string[], val: string) => {
    if (val && !list.includes(val)) setter([...list, val]);
  };

  const removeItem = (setter: any, list: string[], index: number) => {
    const newList = [...list];
    newList.splice(index, 1);
    setter(newList);
  };

  const AttributeSection = ({ title, items, setter, placeholder }: { title: string, items: string[], setter: any, placeholder: string }) => {
    const [input, setInput] = useState('');
    return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">{title}</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
              {item}
              <button onClick={() => removeItem(setter, items, idx)} className="text-gray-400 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
          {items.length === 0 && <span className="text-gray-400 text-sm italic">Chưa có dữ liệu</span>}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
            onKeyDown={(e) => { if(e.key === 'Enter') { addItem(setter, items, input); setInput(''); } }}
          />
          <button 
            onClick={() => { addItem(setter, items, input); setInput(''); }}
            className="px-3 py-2 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    );
  };

  // Local X icon component to avoid passing lucide explicitly inside
  const X = ({size}: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Thuộc tính Sản phẩm</h1>
        <button onClick={saveSettings} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition">
          <Save size={18} />
          <span>Lưu thay đổi</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttributeSection title="Danh mục sản phẩm" items={categories} setter={setCategories} placeholder="Thêm danh mục mới..." />
        <AttributeSection title="Màu sắc" items={colors} setter={setColors} placeholder="Thêm màu mới (Đỏ, Cam...)" />
        <AttributeSection title="Size Giày Dép" items={shoeSizes} setter={setShoeSizes} placeholder="Thêm size giày (40, 41...)" />
        <AttributeSection title="Size Quần Áo" items={clothingSizes} setter={setClothingSizes} placeholder="Thêm size quần áo (S, M...)" />
      </div>
    </div>
  );
}
