import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import AcornHints from "@/components/worksheets/AcornHints";
import { G, S } from "@/components/styles";

/**
 * 學習單右下角 QR code 的落點。每一張的號碼不同，內容由網址決定，所以不給搜尋引擎收。
 */
export const metadata: Metadata = {
  title: "撿松果回家：提示和答案",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main style={S.page}>
      <SiteHeader current="worksheets" />
      <h1 style={{ fontSize: "clamp(24px,5vw,32px)", lineHeight: 1.45, margin: `0 0 ${G.sm}px` }}>撿松果回家：提示</h1>
      <AcornHints />
    </main>
  );
}
