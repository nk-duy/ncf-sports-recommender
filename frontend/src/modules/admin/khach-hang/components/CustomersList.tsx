"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Diamond, Medal, Shield, Star, UserCheck
} from "lucide-react";
import { notifications } from "@mantine/notifications";
import CustomerFormModal from "./CustomerFormModal";
import SendVoucherModal from "./SendVoucherModal";
import CustomerOrdersModal from "./CustomerOrdersModal";
import CustomerHeader from "./CustomerHeader";
import CustomerKPICards from "./CustomerKPICards";
import CustomerFilterBar from "./CustomerFilterBar";
import CustomerBulkBar from "./CustomerBulkBar";
import CustomerTable from "./CustomerTable";
import CustomerDetailDrawer from "./CustomerDetailDrawer";

const tierConfig: any = {
  "Kim Cương": { icon: Diamond, colors: { bg: "bg-emerald-100", text: "text-emerald-800", icon: "text-emerald-600", badge: "bg-emerald-500", badgeText: "text-white" } },
  "Vàng": { icon: Medal, colors: { bg: "bg-amber-100", text: "text-amber-800", icon: "text-amber-600", badge: "bg-amber-500", badgeText: "text-white" } },
  "Bạc": { icon: Shield, colors: { bg: "bg-gray-200", text: "text-gray-800", icon: "text-gray-600", badge: "bg-gray-400", badgeText: "text-white" } },
  "Đồng": { icon: Star, colors: { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600", badge: "bg-orange-400", badgeText: "text-white" } },
  "Đồng (Mới)": { icon: Star, colors: { bg: "bg-orange-100", text: "text-orange-800", icon: "text-orange-600", badge: "bg-orange-400", badgeText: "text-white" } },
  "default": { icon: UserCheck, colors: { bg: "bg-blue-100", text: "text-blue-800", icon: "text-blue-600", badge: "bg-blue-500", badgeText: "text-white" } }
};

export default function AdminCustomersList() {
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    total: 0, 
    active: 0, 
    vip: 0, 
    new: 0,
    potential: 0,
    churn_risk: 0,
    clv: 0 
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [activeTab, setActiveTab] = useState<"all" | "vip" | "new" | "potential" | "churn_risk">("all");
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [sportFilter, setSportFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Action Menu dropdown
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherTarget, setVoucherTarget] = useState<{
    count: number;
    ids?: string[];
    name?: string;
  }>({ count: 0 });
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [ordersModalCustomer, setOrdersModalCustomer] = useState<any | null>(null);

  // Recent orders for active customer
  const [activeCustomerOrders, setActiveCustomerOrders] = useState<any[]>([]);
  const [loadingActiveOrders, setLoadingActiveOrders] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token") || localStorage.getItem("token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        tab: activeTab
      });

      if (search.trim()) params.append("search", search.trim());
      if (tierFilter) params.append("tier", tierFilter);
      if (sportFilter) params.append("sport", sportFilter);
      if (regionFilter) params.append("region", regionFilter);

      const res = await fetch(`http://localhost:8000/api/v1/customers/?${params.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (res.ok) {
        const data = await res.json();
        const mappedCustomers = (data.customers || []).map((c: any) => {
          const tConfig = tierConfig[c.tier] || tierConfig["default"];
          return {
            ...c,
            tierIcon: tConfig.icon,
            tierColors: tConfig.colors,
            spentShort: (c.spent / 1000000).toFixed(2) + " tr",
            spentFormatted: c.spent.toLocaleString("vi-VN") + " đ"
          };
        });
        setCustomers(mappedCustomers);
        if (data.stats) {
          setStats(data.stats);
        }
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages || 1);
        }
        
        // Auto keep or select active customer
        if (mappedCustomers.length > 0) {
          if (!activeCustomerId || !mappedCustomers.some((c: any) => c.id === activeCustomerId)) {
            setActiveCustomerId(mappedCustomers[0].id);
          }
        } else {
          setActiveCustomerId(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, activeTab, tierFilter, sportFilter, regionFilter]);

  // Fetch recent orders whenever activeCustomerId changes
  useEffect(() => {
    if (!activeCustomerId) {
      setActiveCustomerOrders([]);
      return;
    }
    const fetchOrders = async () => {
      try {
        setLoadingActiveOrders(true);
        const res = await fetch(`http://localhost:8000/api/v1/customers/${activeCustomerId}/orders`);
        if (res.ok) {
          const data = await res.json();
          setActiveCustomerOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch customer orders:", err);
      } finally {
        setLoadingActiveOrders(false);
      }
    };
    fetchOrders();
  }, [activeCustomerId]);

  const activeCustomer = customers.find(c => c.id === activeCustomerId);

  // Filter actions
  const handleApplyFilter = () => {
    setPage(1);
    fetchCustomers();
  };

  const handleResetFilter = () => {
    setSearch("");
    setTierFilter("");
    setSportFilter("");
    setRegionFilter("");
    setActiveTab("all");
    setPage(1);
  };

  // Selection toggle
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(customers.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Excel / CSV Export
  const handleExportExcel = (selectedOnly = false) => {
    const listToExport = selectedOnly && selectedIds.length > 0
      ? customers.filter(c => selectedIds.includes(c.id))
      : customers;

    if (listToExport.length === 0) {
      notifications.show({
        title: "Thông báo",
        message: "Không có dữ liệu khách hàng nào để xuất file",
        color: "yellow"
      });
      return;
    }

    const headers = [
      "Mã KH",
      "Họ và tên",
      "Email",
      "Số điện thoại",
      "Địa chỉ",
      "Phân hạng",
      "Bộ môn quan tâm",
      "Số đơn hàng",
      "Tổng chi tiêu (VNĐ)",
      "Lần cuối mua",
      "Ngày tham gia"
    ];

    const rows = listToExport.map(c => [
      `"${c.code}"`,
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.address.replace(/"/g, '""')}"`,
      `"${c.tier}"`,
      `"${Array.isArray(c.sports) ? c.sports.join(", ") : c.sports}"`,
      c.orders,
      c.spent,
      `"${c.lastPurchase}"`,
      `"${c.joinDate}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `khach_hang_kady_sport_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    notifications.show({
      title: "Xuất dữ liệu thành công",
      message: `Đã xuất ${listToExport.length} khách hàng ra file Excel (CSV)`,
      color: "teal"
    });
  };

  // Delete Customer
  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}" không?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/v1/customers/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        notifications.show({
          title: "Thành công",
          message: `Đã xóa khách hàng ${name}`,
          color: "teal"
        });
        if (activeCustomerId === id) {
          setActiveCustomerId(null);
        }
        fetchCustomers();
      } else {
        throw new Error("Không thể xóa");
      }
    } catch (err: any) {
      notifications.show({
        title: "Lỗi",
        message: err.message || "Không thể xóa khách hàng",
        color: "red"
      });
    }
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-12">
      {/* Section 1: Header Area */}
      <CustomerHeader
        onExportExcel={() => handleExportExcel(false)}
        onOpenSendVoucher={() => {
          setVoucherTarget({
            count: selectedIds.length > 0 ? selectedIds.length : stats.total,
            ids: selectedIds
          });
          setIsVoucherModalOpen(true);
        }}
        onOpenAddCustomer={() => {
          setEditingCustomer(null);
          setIsFormModalOpen(true);
        }}
      />

      {/* Section 2: Four Horizontal KPI Cards */}
      <CustomerKPICards stats={stats} />

      {/* Section 3: Toolbar & Filters */}
      <CustomerFilterBar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPage(1);
        }}
        stats={stats}
        search={search}
        onSearchChange={setSearch}
        tierFilter={tierFilter}
        onTierChange={(val) => {
          setTierFilter(val);
          setPage(1);
        }}
        sportFilter={sportFilter}
        onSportChange={(val) => {
          setSportFilter(val);
          setPage(1);
        }}
        regionFilter={regionFilter}
        onRegionChange={(val) => {
          setRegionFilter(val);
          setPage(1);
        }}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
      />

      {/* Floating Bulk Actions Bar */}
      <CustomerBulkBar
        selectedCount={selectedIds.length}
        onSendVoucher={() => {
          setVoucherTarget({
            count: selectedIds.length,
            ids: selectedIds
          });
          setIsVoucherModalOpen(true);
        }}
        onExportExcel={() => handleExportExcel(true)}
        onDeselectAll={() => setSelectedIds([])}
      />

      {/* Section 4: Split Layout (65% Table / 35% Quick View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Data Table */}
        <CustomerTable
          customers={customers}
          loading={loading}
          selectedIds={selectedIds}
          activeCustomerId={activeCustomerId}
          menuOpenId={menuOpenId}
          menuRef={menuRef}
          page={page}
          totalPages={totalPages}
          totalCustomers={stats.total}
          onPageChange={setPage}
          onSelectAll={handleSelectAll}
          onToggleSelect={handleToggleSelect}
          onSelectCustomer={(id) => setActiveCustomerId(id)}
          onToggleMenu={(id) => setMenuOpenId(prev => prev === id ? null : id)}
          onEditCustomer={(customer) => {
            setEditingCustomer(customer);
            setIsFormModalOpen(true);
          }}
          onSendSingleVoucher={(customer) => {
            setVoucherTarget({
              count: 1,
              ids: [customer.id],
              name: customer.name
            });
            setIsVoucherModalOpen(true);
          }}
          onViewOrders={(customer) => {
            setOrdersModalCustomer(customer);
            setIsOrdersModalOpen(true);
          }}
          onDeleteCustomer={handleDeleteCustomer}
        />

        {/* Right Column: Customer Profile Quick View */}
        <CustomerDetailDrawer
          customer={activeCustomer}
          orders={activeCustomerOrders}
          loadingOrders={loadingActiveOrders}
          onClose={() => setActiveCustomerId(null)}
          onEdit={(customer) => {
            setEditingCustomer(customer);
            setIsFormModalOpen(true);
          }}
          onSendEmail={(customer) => {
            setVoucherTarget({
              count: 1,
              ids: [customer.id],
              name: customer.name
            });
            setIsVoucherModalOpen(true);
          }}
          onSendVoucher={(customer) => {
            setVoucherTarget({
              count: 1,
              ids: [customer.id],
              name: customer.name
            });
            setIsVoucherModalOpen(true);
          }}
          onViewAllOrders={(customer) => {
            setOrdersModalCustomer(customer);
            setIsOrdersModalOpen(true);
          }}
        />
      </div>

      {/* Modals */}
      <CustomerFormModal
        opened={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        customer={editingCustomer}
        onSuccess={() => fetchCustomers()}
      />

      <SendVoucherModal
        opened={isVoucherModalOpen}
        onClose={() => setIsVoucherModalOpen(false)}
        targetCount={voucherTarget.count}
        selectedCustomerIds={voucherTarget.ids}
        singleCustomerName={voucherTarget.name}
        onSuccess={() => {
          setSelectedIds([]);
        }}
      />

      <CustomerOrdersModal
        opened={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        customer={ordersModalCustomer}
      />
    </div>
  );
}
