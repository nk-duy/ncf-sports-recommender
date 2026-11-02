'use client';

import React from 'react';
import type { OrderItem } from '../types';
import OrderCardItem from './OrderCardItem';

interface OrderCardGridProps {
  orders: OrderItem[];
  isDeliveredStatus: (status?: string) => boolean;
  getStatusBadge: (status: string) => React.ReactNode;
  formatPrice: (price: number) => string;
  formatDate: (dateStr?: string) => string;
  copyToClipboard: (text: string, id: string) => void;
  copiedId: string | null;
  setSelectedOrder: (order: OrderItem) => void;
  handlePrintInvoice: (order: OrderItem) => void;
  handleUpdateStatus: (id: string, status: string) => void;
  handleUpdatePaymentStatus?: (id: string, paymentStatus: string) => void;
  setShippingModalOrder: (order: OrderItem) => void;
  setRejectModalOrder: (order: OrderItem) => void;
  setSelectedRejectPreset: (preset: string) => void;
  setCustomRejectReason: (reason: string) => void;
}

export default function OrderCardGrid({
  orders,
  isDeliveredStatus,
  getStatusBadge,
  formatPrice,
  formatDate,
  copyToClipboard,
  copiedId,
  setSelectedOrder,
  handlePrintInvoice,
  handleUpdateStatus,
  handleUpdatePaymentStatus,
  setShippingModalOrder,
  setRejectModalOrder,
  setSelectedRejectPreset,
  setCustomRejectReason,
}: OrderCardGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {orders.map((order) => (
        <OrderCardItem
          key={order._id}
          order={order}
          isDelivered={isDeliveredStatus(order.status)}
          getStatusBadge={getStatusBadge}
          formatPrice={formatPrice}
          formatDate={formatDate}
          copyToClipboard={copyToClipboard}
          copiedId={copiedId}
          setSelectedOrder={setSelectedOrder}
          handlePrintInvoice={handlePrintInvoice}
          handleUpdateStatus={handleUpdateStatus}
          handleUpdatePaymentStatus={handleUpdatePaymentStatus}
          setShippingModalOrder={setShippingModalOrder}
          setRejectModalOrder={setRejectModalOrder}
          setSelectedRejectPreset={setSelectedRejectPreset}
          setCustomRejectReason={setCustomRejectReason}
        />
      ))}
    </div>
  );
}
