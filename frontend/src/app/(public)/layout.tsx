import React from "react";
import Header from "@/modules/cot-loi/components/Header";
import Footer from "@/modules/cot-loi/components/Footer";
import FloatingSupportWidget from "@/modules/cot-loi/components/FloatingSupportWidget";
import BackToTop from "@/modules/cot-loi/components/BackToTop";

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
