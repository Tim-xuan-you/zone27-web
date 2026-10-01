import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import AcornPicker from "@/components/worksheets/AcornPicker";
import { G, S, T } from "@/components/styles";

/**
 * 撿松果回家：選關卡、挑一張、印出來。題目怎麼出、怎麼挑，寫在 lib/worksheets/acorn.ts、scripts/worksheets-acorn.ts。
 */

export const metadata: Metadata = {
  title: "撿松果回家：免費迷宮學習單，A4 印了就能寫",
  description: "幫小松鼠撿完每一顆松果再回家，每個格子只能走一次。給 5 歲以上的孩子，6 個關卡、每關 5 張，說明都有注音，卡住了有一段一段的提示。",
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
      <p style={{ color: "var(--muted)", fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
        幫小松鼠撿完每一顆松果再回家，每個格子只能走一次。練的是先把路線想好，再下筆。
      </p>

      <AcornPicker />

      <p style={S.lbl}>家長看這裡</p>
      <div style={S.box}>
        {[
          ["開始之前", "跟孩子說：「像跳格子一樣，一格一格走，走過的格子不能再踩。」右上角「小松鼠這樣走」那一題，可以先一起看。"],
          ["寫完自己檢查", "每一題旁邊寫了有幾顆松果。寫完讓孩子自己數一數，數到一樣多就對了，不用等大人改。"],
          ["卡住了", "先問：「哪一顆松果最難拿到？」還是不會，掃學習單右下角的 QR code，提示一次只開一段。"],
          ["幾歲可以寫", "第 1、2 關 5 歲就可以，第 6 關大概 7 歲以上。看孩子寫得順不順，比看年紀準：太難就退一關，太簡單就往上一關。"],
          ["稱讚方法", "寫對的時候，說「你先找最難拿的那一顆，這個方法很好」，比說「你好聰明」更能讓孩子願意挑戰難一點的題目。"],
        ].map(([q, a], i) => (
          <div key={q} style={{ marginTop: i ? G.lg : 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: T.md }}>{q}</p>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{a}</p>
          </div>
        ))}
      </div>

      <p style={{ marginTop: G.xl, fontSize: T.md, lineHeight: 1.9 }}>
        孩子寫完說太簡單？<Link href="/worksheets/make" style={{ color: "var(--accent)", fontWeight: 700 }}>換他出題給你寫 →</Link>
      </p>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>題目、圖都是我們自己做的，可以自由印給家裡的孩子、班上的同學寫。</p>
      </footer>
    </main>
  );
}
