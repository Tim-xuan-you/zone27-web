import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// ── Viewport · themeColor + colorScheme (Next.js 16 pattern) ──
// In Next 14+, themeColor / colorScheme were deprecated from
// metadata and moved to a separate Viewport export. Setting
// themeColor to deep navy makes iOS Safari address bar match
// the brand. colorScheme: dark prevents flash-of-white on
// initial paint and tells the OS to use dark scrollbars.
export const viewport: Viewport = {
  themeColor: "#0F1A2E",
  colorScheme: "dark",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zone27-web.vercel.app"),
  title: {
    default: "ZONE 27 — 不靠直覺,只看演算法",
    template: "%s · ZONE 27",
  },
  description:
    "全台第一個為硬核棒球迷打造的暗黑黃金級數據俱樂部。蒙地卡羅 AI 模擬器、不可篡改的勝率紀錄、零手續費的會員制預測社群。",
  keywords: [
    "中華職棒",
    "CPBL",
    "MLB",
    "AI 預測",
    "蒙地卡羅",
    "棒球數據",
    "Sabermetrics",
    "ZONE 27",
  ],
  authors: [{ name: "ZONE 27" }],
  openGraph: {
    title: "ZONE 27 — We Don't Guess. We Compute.",
    description:
      "全台最帥的暗黑黃金級體育預測社群 · 蒙地卡羅 AI 模擬器 · 零手續費會員制",
    type: "website",
    locale: "zh_TW",
    siteName: "ZONE 27",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZONE 27 — We Don't Guess. We Compute.",
    description: "全台最帥的暗黑黃金級體育預測社群",
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
