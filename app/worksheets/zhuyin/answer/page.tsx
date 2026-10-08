import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import GuessAnswer from "@/components/worksheets/GuessAnswer";
import { G, S } from "@/components/styles";

/**
 * 注音猜猜看右下角 QR code 的落點。內容由網址決定（?id=zhuyin-1-1），不給搜尋引擎收。
 */
export const metadata: Metadata = {
  title: "注音猜猜看：答案",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <main style={S.page}>
      <SiteHeader current="worksheets" />
      <h1 style={{ fontSize: "clamp(24px,5vw,32px)", lineHeight: 1.45, margin: `0 0 ${G.sm}px` }}>注音猜猜看：答案</h1>
      <GuessAnswer />
    </main>
  );
}
