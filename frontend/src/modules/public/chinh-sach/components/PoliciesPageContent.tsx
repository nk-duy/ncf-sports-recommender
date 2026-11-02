'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumb from '@/shared/components/Breadcrumb';
import {
  Truck,
  RefreshCw,
  ShieldCheck,
  FileText,
  Lock,
  Phone,
  MessageCircle,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { PolicyTab } from '../types';
import ShippingAndReturnPolicies from './ShippingAndReturnPolicies';
import WarrantyTermsPrivacyPolicies from './WarrantyTermsPrivacyPolicies';

export type { PolicyTab };

export const POLICY_TABS: { id: PolicyTab; label: string; icon: typeof Truck }[] = [
  { id: 'giao-hang', label: 'Chính sách giao hàng', icon: Truck },
  { id: 'doi-tra', label: 'Đổi trả trong 30 ngày', icon: RefreshCw },
  { id: 'bao-hanh', label: 'Chính sách bảo hành', icon: ShieldCheck },
  { id: 'dieu-khoan', label: 'Điều khoản sử dụng', icon: FileText },
  { id: 'bao-mat', label: 'Chính sách bảo mật', icon: Lock },
];

const VALID_TABS: PolicyTab[] = ['giao-hang', 'doi-tra', 'bao-hanh', 'dieu-khoan', 'bao-mat'];

function PolicyContent() {
  const searchParams = useSearchParams();
  const rawTabParam = searchParams.get('tab') || '';
  const urlTab: PolicyTab = VALID_TABS.includes(rawTabParam as PolicyTab)
    ? (rawTabParam as PolicyTab)
    : 'giao-hang';

  const [manualSelection, setManualSelection] = useState<{
    paramKey: string;
    tab: PolicyTab;
  } | null>(null);

  const activeTab: PolicyTab =
    manualSelection && manualSelection.paramKey === rawTabParam
      ? manualSelection.tab
      : urlTab;

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Chính sách & Quy định' },
  ];

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16">
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 py-8 sm:py-10">
        <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Chính Sách &amp; Quy Định Mua Hàng
          </h1>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            Thông tin chi tiết về dịch vụ giao vận, bảo hành, đổi size và cam kết bảo mật quyền lợi dành cho khách hàng tại KADY.
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mt-6 sm:mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sidebar Menu */}
          <div className="lg:col-span-4 space-y-4 sticky top-24">
            <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-xs">
              <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Danh mục chính sách
              </div>
              <div className="space-y-1">
                {POLICY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setManualSelection({ paramKey: rawTabParam, tab: tab.id })}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition text-left ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={17} className={isActive ? 'text-white' : 'text-gray-400'} />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight size={15} className={`opacity-60 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hỗ trợ nhanh */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs text-sm">
              <div className="flex items-center gap-2 text-gray-900 font-bold mb-1.5">
                <HelpCircle size={16} className="text-blue-600" />
                <span>Cần hỗ trợ trực tiếp?</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Nếu bạn có câu hỏi về đơn hàng, đổi size hoặc bảo hành, đội ngũ CSKH luôn sẵn sàng hỗ trợ từ 08:00 – 21:30 hàng ngày.
              </p>
              <div className="space-y-2">
                <a
                  href="tel:19006868"
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  <Phone size={14} className="text-blue-600" />
                  Hotline: 1900 6868
                </a>
                <a
                  href="https://zalo.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  <MessageCircle size={14} />
                  Nhắn tin qua Zalo
                </a>
              </div>
            </div>
          </div>

          {/* Policy Detail Content */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs">
            {activeTab === 'giao-hang' || activeTab === 'doi-tra' ? (
              <ShippingAndReturnPolicies activeTab={activeTab} />
            ) : (
              <WarrantyTermsPrivacyPolicies activeTab={activeTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PoliciesPageContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PolicyContent />
    </Suspense>
  );
}
