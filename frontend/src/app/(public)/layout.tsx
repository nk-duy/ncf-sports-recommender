import React from "react";
import Header from "@/modules/public/cot-loi/components/Header";
import Footer from "@/modules/public/cot-loi/components/Footer";
import FloatingSupportWidget from "@/modules/public/cot-loi/components/FloatingSupportWidget";
import BackToTop from "@/modules/public/cot-loi/components/BackToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <FloatingSupportWidget />
      <BackToTop />
    </>
  );
}
