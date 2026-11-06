'use client';

import { notifications } from '@mantine/notifications';
import CartVoucherBox from '@/modules/public/thanh-toan/cart/components/CartVoucherBox';
import CartRecommendations from '@/modules/public/thanh-toan/cart/components/CartRecommendations';
import CheckoutProgress from '@/modules/public/thanh-toan/flow/components/CheckoutProgress';
import TrustStrip from '@/modules/public/thanh-toan/shared/components/TrustStrip';
import { CartHeader } from './CartHeader';
import { CartFreeshipProgress } from './CartFreeshipProgress';
import { EmptyCartState } from './EmptyCartState';
import { CartItemsCard } from './CartItemsCard';
import { CartSummary } from './CartSummary';
import { SavedForLater } from './SavedForLater';
import { CartFooter } from './CartFooter';
import CartConfirmModal from './CartConfirmModal';
import { useCartPage } from '../hooks/useCartPage';

export default function CartPageView() {
  const {
    mounted,
    items,
    savedItems,
    selectedKeys,
    setSelectedKeys,
    appliedVoucher,
    shipping_id,
    setField,
    liveInfo,
    pickerKey,
    setPickerKey,
    confirm,
    setConfirm,
    isUnavailable,
    allSelected,
    handleSelectAll,
    handleSelectItem,
    doConfirm,
    subtotal,
    totalCount,
    shippingFee,
    voucherDiscount,
    finalTotal,
    getOriginalPrice,
    promoSavings,
    totalSavings,
    canCheckout,
    handleCheckout,
    handleVariantChange,
    syncProduct,
    updateQuantity,
    saveForLater,
    moveSavedToCart,
    removeSaved,
  } = useCartPage();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-medium text-gray-500">
        Đang tải giỏ hàng...
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-32 overflow-x-hidden">
      {/* 1. Thanh tiêu đề giỏ hàng */}
      <CartHeader itemsCount={items.length} />

      {/* 2. Stepper tiến trình thanh toán */}
      <CheckoutProgress currentStep={1} />

      <div className="w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 mt-6">
        {items.length === 0 ? (
          <EmptyCartState
            savedItems={savedItems}
            moveSavedToCart={moveSavedToCart}
            removeSaved={removeSaved}
            showNotification={(msg) =>
              notifications.show({ title: 'Đã chuyển vào giỏ', message: msg, color: 'green' })
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Cột trái: Tiến trình Freeship + Bảng sản phẩm + Đã lưu + Cam kết */}
            <div className="lg:col-span-8 space-y-4">
              <CartFreeshipProgress subtotal={subtotal} />

              <CartItemsCard
                items={items}
                selectedKeys={selectedKeys}
                allSelected={allSelected}
                handleSelectAll={handleSelectAll}
                handleSelectItem={handleSelectItem}
                liveInfo={liveInfo}
                isUnavailable={isUnavailable}
                getOriginalPrice={getOriginalPrice}
                pickerKey={pickerKey}
                setPickerKey={setPickerKey}
                handleVariantChange={handleVariantChange}
                syncProduct={syncProduct}
                updateQuantity={updateQuantity}
                setConfirm={setConfirm}
                saveForLater={(idKey) => {
                  saveForLater(idKey);
                  notifications.show({
                    title: 'Đã lưu',
                    message: 'Sản phẩm được chuyển vào mục "Lưu để mua sau".',
                    color: 'blue',
                  });
                }}
                removeSelectedKey={(idKey) => {
                  setSelectedKeys(selectedKeys.filter((k) => k !== idKey));
                }}
              />

              {savedItems.length > 0 && (
                <SavedForLater
                  savedItems={savedItems}
                  moveSavedToCart={moveSavedToCart}
                  removeSaved={removeSaved}
                  showNotification={(msg) =>
                    notifications.show({ title: 'Đã chuyển vào giỏ', message: msg, color: 'green' })
                  }
                />
              )}

              <div className="pt-2">
                <TrustStrip />
              </div>
            </div>

            {/* Cột phải: Sticky Voucher + Tóm tắt đơn hàng */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
              <CartVoucherBox subtotal={subtotal} />

              <CartSummary
                totalCount={totalCount}
                subtotal={subtotal}
                shippingFee={shippingFee}
                shipping_id={shipping_id}
                setField={setField}
                voucherDiscount={voucherDiscount}
                appliedVoucher={appliedVoucher}
                finalTotal={finalTotal}
                totalSavings={totalSavings}
                promoSavings={promoSavings}
                canCheckout={canCheckout}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        )}

        {/* Khối Gợi ý mua kèm AI Cross-sell Full-width */}
        {items.length > 0 && (
          <div className="mt-8">
            <CartRecommendations />
          </div>
        )}
      </div>

      {/* Floating Bottom Bar (chỉ hiện trên Mobile/Tablet) */}
      <CartFooter
        itemsLength={items.length}
        allSelected={allSelected}
        handleSelectAll={handleSelectAll}
        hasSelected={selectedKeys.length > 0}
        setConfirmBulk={() => setConfirm({ kind: 'bulk' })}
        totalCount={totalCount}
        finalTotal={finalTotal}
        totalSavings={totalSavings}
        canCheckout={canCheckout}
        handleCheckout={handleCheckout}
      />

      {/* Modal xác nhận xóa */}
      <CartConfirmModal
        confirm={confirm}
        selectedKeysLength={selectedKeys.length}
        onCancel={() => setConfirm(null)}
        onConfirm={doConfirm}
      />
    </div>
  );
}
