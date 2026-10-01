import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import AcornMaker from "@/components/worksheets/AcornMaker";
import { G, S, T } from "@/components/styles";

/**
 * 撿松果回家：選關卡、換題目、印出來。題目怎麼出寫在 lib/worksheets/acorn.ts。
 */

export const metadata: Metadata = {
  title: "撿松果回家：免費迷宮學習單，A4 印了就能寫",
  description: "幫小松鼠撿完每一顆松果再回家，每一格只能走一次。給 5 歲以上的孩子，6 個關卡，每按一次就是新題目，說明都有注音，卡住了有一段一段的提示。",
  alternates: { canonical: "/worksheets/acorn" },
};

export default function Page() {
  return (
    <main style={S.page}>
      <SiteHeader current="worksheets" />
      <p style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm }}>
        <Link href="/worksheets" style={{ color: "var(--muted)" }}>學習單</Link>
      </p>
      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>撿松果回家</h1>
      <p style={{ color: "var(--muted)", fontSize: T.lg, lineHeight: 1.9, margin: 0, maxWidth: "40ch" }}>
        幫小松鼠撿完每一顆松果再回家，每一格只能走一次。練的是先把路線想好再下筆。
      </p>

      <AcornMaker />

      <p style={S.lbl}>家長看這裡</p>
      <div style={S.box}>
        {[
          ["幾歲可以寫", "第 1、2 關 5 歲就可以，第 6 關大概 7 歲以上。看孩子寫得順不順，比看年紀準。"],
          ["每一題都只有一個答案", "題目是程式出的，出完會把所有走法數一遍，多一種走法就重出。直接走最近的路一定會漏掉松果，孩子要先想才走得對。"],
          ["孩子卡住了", "先問：「哪一顆松果最難拿到？」還是不會，掃學習單右下角的 QR code，提示一次只看一段。"],
        ].map(([q, a], i) => (
          <div key={q} style={{ marginTop: i ? G.lg : 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: T.md }}>{q}</p>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{a}</p>
          </div>
        ))}
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>題目、圖都是我們自己做的，可以自由印給家裡的孩子、班上的同學寫。</p>
      </footer>
    </main>
  );
}
