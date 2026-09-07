import type { Metadata } from "next";
import { Noto_Sans_TC, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zone27.com.tw"),
  title: {
    default: "ZONE 27 · 幫你刪掉不適合的",
    template: "%s · ZONE 27",
  },
  description:
    "你把狀況講完，我們先幫你刪掉不適合的，剩下的才給你看。排序不看佣金，方法公開。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "ZONE 27",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant-TW" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
