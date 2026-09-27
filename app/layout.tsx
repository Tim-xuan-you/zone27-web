import type { Metadata } from "next";
import { preload } from "react-dom";
import "./globals.css";
/*
 * 字型自己放（public/fonts/），建置時不連 Google。
 * 2026-09-27 以前用 next/font/google，每次建置要下載 228 個字型檔，抓失敗一個整個建置就掛
 * （本機三次、Vercel 一次）。字型、字重、CSS 變數名稱都跟以前一樣：
 *   標題用思源宋體（Noto Serif TC 600／700／900）：同時給到權威感與人味，純無襯線讀起來太像後台
 *   內文思源黑體（Noto Sans TC 400／500／700），數字用 IBM Plex Mono（400／500／600）
 * 要換字重：改 scripts/fonts-selfhost.mjs 再跑一次，會重寫 fonts.css、fonts-preload.json 和字型檔。
 * fonts.css 放在 globals.css 後面，變數才會蓋過 Tailwind 預設的 --font-sans 那幾個。
 */
import "./fonts.css";
import fontPreload from "./fonts-preload.json";
import PageReport from "@/components/PageReport";
import { Analytics } from "@vercel/analytics/next";

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
  // 拉丁字母那幾塊先載（黑體、宋體各一塊，Mono 三個字重各一塊），跟以前 next/font 預先載入的是同一批
  for (const href of fontPreload) preload(href, { as: "font", type: "font/woff2", crossOrigin: "" });
  return (
    <html lang="zh-Hant-TW">
      <body>
        {children}
        <PageReport />
        {/*
          流量統計（Vercel Web Analytics）：沒有 cookie，不記個人資料，只算有幾個人看了哪一頁、從哪裡來。Tim 2026-09-13 在 Vercel 後台打開了（Hobby 免費版：每月 5 萬次、資料留 30 天，超過就停止記錄，不收錢）。要知道 Threads、臉書社團帶了多少人進來，靠的就是這個。後台 Analytics 分頁看 Referrers
        */}
        <Analytics />
      </body>
    </html>
  );
}
