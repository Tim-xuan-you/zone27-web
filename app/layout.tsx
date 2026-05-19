import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZONE 27 — 不靠直覺,只看演算法",
  description:
    "全台第一個為硬核棒球迷打造的暗黑黃金級數據俱樂部。蒙地卡羅 AI 模擬器、不可篡改的勝率紀錄、零手續費的會員制預測社群。",
  keywords: ["中華職棒", "CPBL", "MLB", "AI 預測", "蒙地卡羅", "棒球數據", "Sabermetrics"],
  authors: [{ name: "ZONE 27" }],
  openGraph: {
    title: "ZONE 27 — We Don't Guess. We Compute.",
    description: "暗黑黃金級體育數據俱樂部",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
