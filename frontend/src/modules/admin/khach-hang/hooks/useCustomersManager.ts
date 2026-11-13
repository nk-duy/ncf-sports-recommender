"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { notifications } from "@mantine/notifications";
import type {
  CustomerItem,
  CustomerOrderSummary,
  CustomerStats,
  CustomerTabType,
  RawCustomerApiItem,
  VoucherTarget,
} from "../types";
import { mapCustomerWithTier } from "../utils/customerTierConfig";
import { exportCustomersToExcel } from "../utils/exportCustomersExcel";
import { getAuthHeaders } from "@/shared/lib/authHeader";
import { resolveApiBaseUrl } from "@/shared/lib/apiUrl";
import { useAdminAuthStore } from "@/shared/store/adminAuthStore";

interface CustomersApiResponse {
  customers?: RawCustomerApiItem[];
  stats?: CustomerStats;
  pagination?: {
    total_pages?: number;
  };
}

export function useCustomersManager() {
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<CustomerStats>({
    total: 0,
    active: 0,
    vip: 0,
    new: 0,
    potential: 0,
    churn_risk: 0,
    clv: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [activeTab, setActiveTab] = useState<CustomerTabType>("all");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
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
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
  const [voucherTarget, setVoucherTarget] = useState<VoucherTarget>({ count: 0 });
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationCustomer, setNotificationCustomer] = useState<CustomerItem | null>(null);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [ordersModalCustomer, setOrdersModalCustomer] = useState<CustomerItem | null>(null);

  // Recent orders for active customer
  const [fetchedCustomerOrders, setFetchedCustomerOrders] = useState<CustomerOrderSummary[]>([]);
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
  const fetchCustomers = useCallback(
    async (searchOverride?: string, pageOverride?: number) => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("kady_admin_token") ||
          localStorage.getItem("admin_token") ||
          localStorage.getItem("token");
        const queryPage = pageOverride ?? page;
        const querySearch = searchOverride !== undefined ? searchOverride : appliedSearch;

        const params = new URLSearchParams({
          page: queryPage.toString(),
          limit: "10",
          tab: activeTab,
        });

        if (querySearch.trim()) params.append("search", querySearch.trim());
        if (tierFilter) params.append("tier", tierFilter);
        if (sportFilter) params.append("sport", sportFilter);
        if (regionFilter) params.append("region", regionFilter);

        const apiUrl = resolveApiBaseUrl();
        const res = await fetch(`${apiUrl}/customers/?${params.toString()}`, {
          headers: getAuthHeaders(),
        });

        if (res.ok) {
          const data: CustomersApiResponse = await res.json();
          const mappedCustomers = (data.customers || []).map(mapCustomerWithTier);
          setCustomers(mappedCustomers);
          if (data.stats) {
            setStats(data.stats);
          }
          if (data.pagination) {
            setTotalPages(data.pagination.total_pages || 1);
          }

          // Auto keep or select active customer
          setActiveCustomerId((prevId) => {
            if (mappedCustomers.length === 0) return null;
            if (!prevId || !mappedCustomers.some((c) => c.id === prevId)) {
              return mappedCustomers[0].id;
            }
            return prevId;
          });
        } else if (res.status === 401) {
          useAdminAuthStore.getState().logout();
          notifications.show({
            title: 'Phiên đăng nhập hết hạn',
            message: 'Vui lòng đăng nhập lại tài khoản Quản trị viên để tiếp tục',
            color: 'red',
          });
          window.location.href = `/dang-nhap?redirect=${encodeURIComponent(window.location.pathname)}`;
          return;
        } else {
          const err: { detail?: string } | null = await res.json().catch(() => null);
          notifications.show({
            title: 'Lỗi tải danh sách khách hàng',
            message: err?.detail || 'Không thể tải dữ liệu khách hàng từ máy chủ',
            color: 'red',
          });
        }
      } catch {
        notifications.show({
          title: 'Lỗi kết nối',
          message: 'Không thể kết nối đến máy chủ quản trị khách hàng',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    },
    [page, activeTab, appliedSearch, tierFilter, sportFilter, regionFilter]
  );

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Fetch recent orders whenever activeCustomerId changes
  useEffect(() => {
    if (!activeCustomerId) return;
    let cancelled = false;

    const fetchOrders = async () => {
      try {
        setLoadingActiveOrders(true);
        const apiUrl = resolveApiBaseUrl();
        const res = await fetch(`${apiUrl}/customers/${activeCustomerId}/orders`, {
          headers: getAuthHeaders(),
        });
        if (res.ok && !cancelled) {
          const data = await res.json();
          setFetchedCustomerOrders(Array.isArray(data) ? data : []);
        }
      } catch {
        // Bỏ qua lỗi khi tải đơn hàng gần nhất
      } finally {
        if (!cancelled) {
          setLoadingActiveOrders(false);
        }
      }
    };
    fetchOrders();

    return () => {
      cancelled = true;
    };
  }, [activeCustomerId]);

  const activeCustomer = customers.find((c) => c.id === activeCustomerId);
  const activeCustomerOrders = activeCustomerId ? fetchedCustomerOrders : [];

  const handleApplyFilter = () => {
    setPage(1);
    if (appliedSearch === search) {
      fetchCustomers(search, 1);
    } else {
      setAppliedSearch(search);
    }
  };

  const handleResetFilter = () => {
    setSearch("");
    setAppliedSearch("");
    setTierFilter("");
    setSportFilter("");
    setRegionFilter("");
    setActiveTab("all");
    setPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(customers.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportExcel = (selectedOnly = false) => {
    exportCustomersToExcel(customers, selectedIds, selectedOnly);
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}" không?`)) {
      return;
    }

    try {
      const apiUrl = resolveApiBaseUrl();
      const res = await fetch(`${apiUrl}/customers/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        notifications.show({
          title: "Thành công",
          message: `Đã xóa khách hàng ${name}`,
          color: "teal",
        });
        if (activeCustomerId === id) {
          setActiveCustomerId(null);
        }
        fetchCustomers();
      } else {
        throw new Error("Không thể xóa");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Không thể xóa khách hàng";
      notifications.show({
        title: "Lỗi",
        message,
        color: "red",
      });
    }
  };

  return {
    activeCustomerId,
    setActiveCustomerId,
    activeCustomer,
    customers,
    loading,
    stats,
    page,
    setPage,
    totalPages,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    tierFilter,
    setTierFilter,
    sportFilter,
    setSportFilter,
    regionFilter,
    setRegionFilter,
    selectedIds,
    setSelectedIds,
    menuOpenId,
    setMenuOpenId,
    menuRef,
    isFormModalOpen,
    setIsFormModalOpen,
    editingCustomer,
    setEditingCustomer,
    isVoucherModalOpen,
    setIsVoucherModalOpen,
    voucherTarget,
    setVoucherTarget,
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    notificationCustomer,
    setNotificationCustomer,
    isOrdersModalOpen,
    setIsOrdersModalOpen,
    ordersModalCustomer,
    setOrdersModalCustomer,
    activeCustomerOrders,
    loadingActiveOrders,
    fetchCustomers,
    handleApplyFilter,
    handleResetFilter,
    handleSelectAll,
    handleToggleSelect,
    handleExportExcel,
    handleDeleteCustomer,
  };
}
