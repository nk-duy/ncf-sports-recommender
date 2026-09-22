import React from "react";
import CheckoutProgress from "@/modules/checkout/flow/components/CheckoutProgress";
import CartItems from "@/modules/checkout/cart/components/CartItems";
import AiCrossSell from "@/modules/checkout/cross-sell/components/AiCrossSell";
import ShippingPayment from "@/modules/checkout/flow/components/ShippingPayment";
import CheckoutSummary from "@/modules/checkout/cart/components/CheckoutSummary";
import CheckoutCommitments from "@/modules/checkout/shared/components/CheckoutCommitments";

export default function CheckoutPage() {
  return (
    <div className="bg-gray-50 min-h-screen pb-16 flex flex-col w-full">
      {/* Top Header Section with Stepper */}
      <CheckoutProgress />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <CartItems />
            <AiCrossSell />
            <ShippingPayment />
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="lg:col-span-4 flex-shrink-0">
            <div className="sticky top-28 flex flex-col gap-4">
              <CheckoutSummary />
              <CheckoutCommitments />
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}
