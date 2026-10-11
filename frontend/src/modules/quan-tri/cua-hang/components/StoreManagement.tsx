'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Building2,
  Phone,
  Clock
} from 'lucide-react';
import { notifications } from '@mantine/notifications';

export default function StoreManagement() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'hanoi',
    phone: '',
    hours: '08:00 - 22:00',
    is_active: true
  });

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/stores`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setStores(data);
      }
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi khi tải danh sách cửa hàng',
        color: 'red'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleOpenModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setFormData({
        name: store.name,
        address: store.address,
        city: store.city,
        phone: store.phone,
        hours: store.hours,
        is_active: store.is_active
      });
    } else {
      setEditingStore(null);
      setFormData({
        name: '',
        address: '',
        city: 'hanoi',
        phone: '',
        hours: '08:00 - 22:00',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingStore 
        ? `${API_URL}/stores/${editingStore._id || editingStore.id}` 
        : `${API_URL}/stores`;
      
      const method = editingStore ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        notifications.show({
          title: 'Thành công',
          message: editingStore ? 'Cập nhật cửa hàng thành công!' : 'Thêm cửa hàng mới thành công!',
          color: 'green'
        });
        handleCloseModal();
        fetchStores();
      } else {
        notifications.show({
          title: 'Lỗi',
          message: 'Có lỗi xảy ra, vui lòng thử lại.',
          color: 'red'
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi kết nối đến máy chủ.',
        color: 'red'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chi nhánh này không?')) {
      try {
        const res = await fetch(`${API_URL}/stores/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          notifications.show({
            title: 'Thành công',
            message: 'Xóa cửa hàng thành công',
            color: 'green'
          });
          fetchStores();
        }
      } catch (error) {
        notifications.show({
          title: 'Lỗi',
          message: 'Có lỗi khi xóa cửa hàng',
          color: 'red'
        });
      }
    }
  };

  const toggleStatus = async (store: any) => {
    try {
      const res = await fetch(`${API_URL}/stores/${store._id || store.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !store.is_active })
      });
      if (res.ok) {
        notifications.show({
          title: 'Thành công',
          message: `Đã ${store.is_active ? 'ẩn' : 'hiện'} cửa hàng.`,
          color: 'green'
        });
        fetchStores();
      }
    } catch (error) {
      notifications.show({
        title: 'Lỗi',
        message: 'Lỗi khi đổi trạng thái',
        color: 'red'
      });
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    store.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cityMap: Record<string, string> = {
    'hanoi': 'Hà Nội',
    'hcm': 'TP. Hồ Chí Minh',
    'danang': 'Đà Nẵng'
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Chi nhánh</h1>
          <p className="text-sm text-gray-500 mt-1">Danh sách hệ thống cửa hàng KADY trên toàn quốc</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium shadow-sm flex items-center gap-2 transition-colors w-fit"
        >
          <Plus size={18} />
          Thêm chi nhánh
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
        <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
          Tổng cộng: <span className="text-gray-900 font-bold">{stores.length}</span> cửa hàng
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="p-4 pl-6">Chi nhánh</th>
                <th className="p-4">Khu vực</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 pr-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    <div className="animate-pulse flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <span className="text-sm">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Không tìm thấy cửa hàng nào.
                  </td>
                </tr>
              ) : (
                filteredStores.map((store) => (
                  <tr key={store._id || store.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{store.name}</div>
                          <div className="text-xs text-gray-500 mt-1 max-w-[200px] truncate" title={store.address}>
                            {store.address}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-semibold">
                        {cityMap[store.city] || store.city}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Phone size={14} className="text-gray-400" /> {store.phone}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Clock size={14} className="text-gray-400" /> {store.hours}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleStatus(store)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors ${
                          store.is_active 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        {store.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {store.is_active ? 'Đang mở' : 'Tạm đóng'}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(store)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(store._id || store.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                {editingStore ? <Edit size={18} className="text-blue-600" /> : <Plus size={18} className="text-blue-600" />}
                {editingStore ? 'Cập nhật Chi nhánh' : 'Thêm Chi nhánh mới'}
              </h2>
              <button onClick={handleCloseModal} className="p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors">
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên chi nhánh <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: KADY Cầu Giấy"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Khu vực / Thành phố</label>
                <select 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="hanoi">Hà Nội</option>
                  <option value="hcm">TP. Hồ Chí Minh</option>
                  <option value="danang">Đà Nẵng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ chi tiết <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  required
                  placeholder="Số nhà, Tên đường, Quận, Huyện..."
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                  <input 
                    type="text" 
                    placeholder="VD: 024 3888 9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Giờ mở cửa</label>
                  <input 
                    type="text" 
                    placeholder="VD: 08:00 - 22:00"
                    value={formData.hours}
                    onChange={(e) => setFormData({...formData, hours: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Chi nhánh đang hoạt động
                </label>
              </div>

              <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-6">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
                >
                  {editingStore ? 'Lưu thay đổi' : 'Thêm chi nhánh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
