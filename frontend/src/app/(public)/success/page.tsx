import CheckoutProgress from "@/modules/checkout/flow/components/CheckoutProgress";
import SuccessHeader from "@/modules/success/components/SuccessHeader";
import OrderDetails from "@/modules/success/components/OrderDetails";
import OrderMetaSidebar from "@/modules/success/components/OrderMetaSidebar";
import NextBasketCrossSell from "@/modules/success/components/NextBasketCrossSell";
import SuccessCommitments from "@/modules/success/components/SuccessCommitments";

export default function SuccessPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-16">
      {/* Container chung */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* Top Progress Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <div className="hidden md:block w-32"></div> {/* Spacer to center progress somewhat */}
          <div className="flex-1 flex justify-center">
            <CheckoutProgress currentStep={3} />
          </div>
          <div className="hidden md:block w-32"></div> {/* Spacer */}
        </div>

        {/* Success Header Area */}
        <SuccessHeader />

        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          
          {/* Left Column (Order Details) */}
          <div className="flex-1 min-w-0">
            <OrderDetails />
          </div>

          {/* Right Column (Sidebar) */}
          <aside className="w-full lg:w-[380px] flex-shrink-0">
            <OrderMetaSidebar />
          </aside>
          
        </div>

        {/* Bottom Cross-sell Area */}
        <div className="max-w-[1000px] mx-auto">
          <NextBasketCrossSell />
          <SuccessCommitments />
        </div>

      </div>
    </div>
  );
}
