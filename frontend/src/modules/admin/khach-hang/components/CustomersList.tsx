"use client";

import CustomerFormModal from "./CustomerFormModal";
import SendVoucherModal from "./SendVoucherModal";
import SendNotificationModal from "./SendNotificationModal";
import CustomerOrdersModal from "./CustomerOrdersModal";
import CustomerHeader from "./CustomerHeader";
import CustomerKPICards from "./CustomerKPICards";
import CustomerFilterBar from "./CustomerFilterBar";
import CustomerBulkBar from "./CustomerBulkBar";
import CustomerTable from "./CustomerTable";
import CustomerDetailDrawer from "./CustomerDetailDrawer";
import { useCustomersManager } from "../hooks/useCustomersManager";

export default function AdminCustomersList() {
  const {
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
  } = useCustomersManager();

  return (
    <div className="flex flex-col w-full space-y-6 pb-12">
      {/* Section 1: Header Area */}
      <CustomerHeader
        onExportExcel={() => handleExportExcel(false)}
        onOpenSendVoucher={() => {
          setVoucherTarget({
            count: selectedIds.length > 0 ? selectedIds.length : stats.total,
            ids: selectedIds,
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
            ids: selectedIds,
          });
          setIsVoucherModalOpen(true);
        }}
        onExportExcel={() => handleExportExcel(true)}
        onDeselectAll={() => setSelectedIds([])}
      />

      {/* Section 4: Split Layout (65% Table / 35% Quick View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
          onToggleMenu={(id) => setMenuOpenId((prev) => (prev === id ? null : id))}
          onEditCustomer={(customer) => {
            setEditingCustomer(customer);
            setIsFormModalOpen(true);
          }}
          onSendSingleVoucher={(customer) => {
            setVoucherTarget({
              count: 1,
              ids: [customer.id],
              name: customer.name,
            });
            setIsVoucherModalOpen(true);
          }}
          onViewOrders={(customer) => {
            setOrdersModalCustomer(customer);
            setIsOrdersModalOpen(true);
          }}
          onDeleteCustomer={handleDeleteCustomer}
        />

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
            setNotificationCustomer(customer);
            setIsNotificationModalOpen(true);
          }}
          onSendVoucher={(customer) => {
            setVoucherTarget({
              count: 1,
              ids: [customer.id],
              name: customer.name,
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

      <SendNotificationModal
        opened={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        customer={notificationCustomer}
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
