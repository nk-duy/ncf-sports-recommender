import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

// Nếu báo lỗi @, hãy đổi thành đường dẫn tương đối (vd: "../modules/...")
import Header from "@/modules/cot-loi/components/Header";
import Footer from "@/modules/cot-loi/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KADY - Đồ án Tốt nghiệp",
  description: "Hệ thống gợi ý sản phẩm thể thao",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased bg-[#F5F7FA] text-[#1A202C]`}
        suppressHydrationWarning
      >
        <MantineProvider>
          <Notifications position="top-right" zIndex={1000} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
