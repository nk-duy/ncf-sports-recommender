"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, Trash2, Mail, Phone, User, MessageSquare } from "lucide-react";
import { notifications } from "@mantine/notifications";

const API_URL = "http://localhost:8000/api/v1";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_resolved: boolean;
  created_at: string;
}

export default function ContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`${API_URL}/contacts`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải liên hệ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/contacts/${id}/resolve`, {
        method: "PATCH",
      });
      if (res.ok) {
        notifications.show({
          title: "Thành công",
          message: "Đã đánh dấu liên hệ là đã xử lý",
          color: "green",
        });
        fetchContacts();
      }
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message: "Không thể cập nhật trạng thái",
        color: "red",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa liên hệ này?")) return;
    
    try {
      const res = await fetch(`${API_URL}/contacts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        notifications.show({
          title: "Đã xóa",
          message: "Liên hệ đã được xóa thành công",
          color: "green",
        });
        fetchContacts();
      }
    } catch (error) {
      notifications.show({
        title: "Lỗi",
        message: "Không thể xóa liên hệ",
        color: "red",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Quản lý Liên hệ</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý và phản hồi các liên hệ từ khách hàng</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
          <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium text-lg">Chưa có liên hệ nào</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div 
              key={contact.id} 
              className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 transition-all ${
                contact.is_resolved ? 'border-gray-200 opacity-75' : 'border-blue-100 ring-1 ring-blue-50'
              }`}
            >
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${contact.is_resolved ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                      <User size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{contact.name}</h3>
                      <p className="text-xs text-gray-500">
                        {new Date(contact.created_at).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {contact.is_resolved ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
                        <CheckCircle size={14} /> Đã xử lý
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-semibold border border-amber-200">
                        <Clock size={14} /> Chờ xử lý
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Mail size={16} className="text-gray-400" />
                    <a href={`mailto:${contact.email}`} className="hover:text-blue-600 font-medium transition-colors">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${contact.phone}`} className="hover:text-blue-600 font-medium transition-colors">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                </div>

                <div className="text-gray-700 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <p className="whitespace-pre-wrap leading-relaxed">{contact.message}</p>
                </div>
              </div>

              <div className="flex md:flex-col gap-3 md:min-w-[140px] md:border-l md:border-gray-100 md:pl-6 justify-center">
                {!contact.is_resolved && (
                  <button 
                    onClick={() => handleResolve(contact.id)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-blue-200"
                  >
                    <CheckCircle size={18} />
                    <span>Xong</span>
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(contact.id)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-gray-600 font-medium rounded-xl transition-colors"
                >
                  <Trash2 size={18} />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
