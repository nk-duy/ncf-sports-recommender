import React from 'react';
import { X, Scissors, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
}

export default function SizeGuideModal({ isOpen, onClose, categories }: SizeGuideModalProps) {
  if (!isOpen) return null;

  // Determine if the product is clothing
  const isClothing = categories?.some(c => c.toLowerCase().includes('clothing') || c.toLowerCase().includes('quần áo') || c.toLowerCase().includes('áo') || c.toLowerCase().includes('quần'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Hướng dẫn chọn size</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 hover:rotate-90 transition-all duration-300">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          {isClothing ? (
            <div>
              <div className="flex items-center gap-3 mb-4 text-blue-600">
                <Scissors className="w-6 h-6" />
                <h3 className="text-lg font-semibold text-gray-800">Bảng số đo (Quần áo)</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Sử dụng thước dây để đo các vòng trên cơ thể của bạn, sau đó đối chiếu với bảng dưới đây để chọn size phù hợp nhất.</p>
              <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 font-bold">Size</th>
                      <th className="px-6 py-4 font-bold">Vòng ngực (cm)</th>
                      <th className="px-6 py-4 font-bold">Vòng eo (cm)</th>
                      <th className="px-6 py-4 font-bold">Vòng mông (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">S</td>
                      <td className="px-6 py-4">84 - 88</td>
                      <td className="px-6 py-4">68 - 72</td>
                      <td className="px-6 py-4">90 - 94</td>
                    </tr>
                    <tr className="bg-gray-50 border-b hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">M</td>
                      <td className="px-6 py-4">88 - 92</td>
                      <td className="px-6 py-4">72 - 76</td>
                      <td className="px-6 py-4">94 - 98</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">L</td>
                      <td className="px-6 py-4">92 - 96</td>
                      <td className="px-6 py-4">76 - 80</td>
                      <td className="px-6 py-4">98 - 102</td>
                    </tr>
                    <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">XL</td>
                      <td className="px-6 py-4">96 - 100</td>
                      <td className="px-6 py-4">80 - 84</td>
                      <td className="px-6 py-4">102 - 106</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4 text-blue-600">
                <Ruler className="w-6 h-6" />
                <h3 className="text-lg font-semibold text-gray-800">Bảng chiều cao và cân nặng (Giày dép)</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">Lựa chọn size phù hợp với chiều cao và cân nặng của bạn theo thông số đề xuất dưới đây.</p>
              <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 font-bold">Size đề xuất</th>
                      <th className="px-6 py-4 font-bold">Chiều cao (cm)</th>
                      <th className="px-6 py-4 font-bold">Cân nặng (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600">38 - 39</td>
                      <td className="px-6 py-4">150 - 160</td>
                      <td className="px-6 py-4">45 - 55</td>
                    </tr>
                    <tr className="bg-gray-50 border-b hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600">40 - 41</td>
                      <td className="px-6 py-4">160 - 170</td>
                      <td className="px-6 py-4">55 - 65</td>
                    </tr>
                    <tr className="bg-white border-b hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600">42</td>
                      <td className="px-6 py-4">170 - 175</td>
                      <td className="px-6 py-4">65 - 75</td>
                    </tr>
                    <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-blue-600">43</td>
                      <td className="px-6 py-4">175 - 185</td>
                      <td className="px-6 py-4">75 - 85</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 bg-gray-50 rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-blue-600/30 transition-all duration-300">
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
}
