import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { LanguageProvider } from "@/shared/context/LanguageContext";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

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
        className={`${inter.className} min-h-screen flex flex-col antialiased bg-[#F5F7FA] text-[#1A202C] w-full max-w-full overflow-x-hidden`}
        suppressHydrationWarning
      >
        <MantineProvider>
          <LanguageProvider>
            <Notifications position="top-right" zIndex={1000} />
            {children}
          </LanguageProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
