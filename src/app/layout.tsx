import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

// Nếu báo lỗi @, hãy đổi thành đường dẫn tương đối (vd: "../modules/...")
import Header from "@/modules/core/components/Header";
import Footer from "@/modules/core/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SportsAI - Đồ án Tốt nghiệp",
  description: "Hệ thống gợi ý sản phẩm thể thao",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body
        className={`${inter.className} min-h-screen flex flex-col antialiased bg-[#F5F7FA] text-[#1A202C]`}
      >
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
