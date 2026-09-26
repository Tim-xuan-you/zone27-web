import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import PageReport from "@/components/PageReport";
import { Analytics } from "@vercel/analytics/next";

const sans = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

/* 標題用襯線 —— 同時給到權威感與人味。純無襯線讀起來太像後台。 */
const serif = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["600", "700", "900"],
  variable: "--font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  metadataBase: new URL("https://zone27.com.tw"),
  title: {
    default: "ZONE 27 · 幫你刪掉不適合的",
    template: "%s · ZONE 27",
  },
  description:
    "先選你要買的：狗的、貓的、充電器。每一款的包裝背面我們都讀過，先刪掉不適合你的，剩下的才給你看；每一款都寫清楚什麼時候不要買。",
  openGraph: { type: "website", locale: "zh_TW", siteName: "ZONE 27" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        {children}
        <PageReport />
        {/*
          流量統計（Vercel Web Analytics）：沒有 cookie，不記個人資料，只算有幾個人看了哪一頁、從哪裡來。
          Tim 2026-09-13 在 Vercel 後台打開了（Hobby 免費版：每月 5 萬次、資料留 30 天，超過就停止記錄，不收錢）。
          要知道 Threads、臉書社團帶了多少人進來，靠的就是這個。後台 Analytics 分頁看 Referrers
        */}
        <Analytics />
      </body>
    </html>
  );
}
