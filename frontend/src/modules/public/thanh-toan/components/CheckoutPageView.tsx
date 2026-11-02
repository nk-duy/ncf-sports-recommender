'use client';

import Link from 'next/link';
import CheckoutProgress from '../flow/components/CheckoutProgress';
import CheckoutCommitments from '../shared/components/CheckoutCommitments';
import { useCheckoutPage } from '../hooks/useCheckoutPage';
import CheckoutTopBar from './CheckoutTopBar';
import CheckoutAddressForm from './CheckoutAddressForm';
import CheckoutShippingMethods from './CheckoutShippingMethods';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';
import CheckoutOrderSummary from './CheckoutOrderSummary';
import QRPaymentModal from './QRPaymentModal';

export default function CheckoutPageView() {
  const {
    mounted,
    items,
    total,
    shippingFee,
    discountAmount,
    finalTotal,
    loading,
    payment_method,
    showPaymentModal,
    setShowPaymentModal,
    transferContent,
    hasAttemptedSubmit,
    selectedProvince,
    setSelectedProvince,
    selectedWard,
    setSelectedWard,
    streetAddress,
    setStreetAddress,
    note,
    setNote,
    handlePlaceOrderClick,
    submitOrder,
  } = useCheckoutPage();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-medium text-gray-500">
        Đang chuẩn bị thanh toán...
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-28">
      <CheckoutTopBar />
      <CheckoutProgress currentStep={2} />

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mt-6">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-lg mx-auto my-8">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Không có sản phẩm nào để thanh toán</h2>
            <p className="text-sm text-gray-500 mb-6">
              Giỏ hàng của bạn đang trống hoặc bạn chưa chọn sản phẩm nào.
            </p>
            <Link
              href="/gio-hang"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition"
            >
              Trở về giỏ hàng
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-5">
              <CheckoutAddressForm
                hasAttemptedSubmit={hasAttemptedSubmit}
                selectedProvince={selectedProvince}
                setSelectedProvince={setSelectedProvince}
                selectedWard={selectedWard}
                setSelectedWard={setSelectedWard}
                streetAddress={streetAddress}
                setStreetAddress={setStreetAddress}
                note={note}
                setNote={setNote}
              />
              <CheckoutShippingMethods total={total} />
              <CheckoutPaymentMethods />
            </div>

            <div className="lg:col-span-5 xl:col-span-4 space-y-5 sticky top-24">
              <CheckoutOrderSummary
                items={items}
                total={total}
                shippingFee={shippingFee}
                discountAmount={discountAmount}
                finalTotal={finalTotal}
                loading={loading}
                onPlaceOrder={handlePlaceOrderClick}
              />
              <CheckoutCommitments />
            </div>
          </div>
        )}
      </div>

      {showPaymentModal && (
        <QRPaymentModal
          paymentMethod={payment_method}
          finalTotal={finalTotal}
          transferContent={transferContent}
          onCancel={() => setShowPaymentModal(false)}
          onConfirm={() => {
            setShowPaymentModal(false);
            void submitOrder();
          }}
        />
      )}
    </div>
  );
}
