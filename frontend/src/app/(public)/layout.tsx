import React from "react";
import Header from "@/modules/cot-loi/components/Header";
import Footer from "@/modules/cot-loi/components/Footer";

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
    </>
  );
}
