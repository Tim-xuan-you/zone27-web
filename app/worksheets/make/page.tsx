import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SheetPrint from "@/components/worksheets/SheetPrint";
import { G, S, T } from "@/components/styles";
import { acornMakerPage, freeMakerPage } from "@/lib/worksheets/make-sheet";

/**
 * 出題紙：換孩子出題給大人寫（2026-10-01）。
 * Tim 家的大班生寫完撿松果回家說太簡單，自己畫了兩題考爸爸，隔天又出一張。這一頁就是照這件事做的。
 */

export const metadata: Metadata = {
  title: "換你出題：給孩子的出題紙，A4 免費列印",
  description: "讓孩子當出題的人：撿松果回家的空白出題單，還有什麼題都能出的萬用出題紙，答案寫在下面往後摺。A4 印了就能用。",
  alternates: { canonical: "/worksheets/make" },
};

const ACORN = acornMakerPage();
const FREE = freeMakerPage();

export default function Page() {
  return (
    <main style={S.page}>
      <SiteHeader current="worksheets" />
      <p style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm }}>
        <Link href="/worksheets" style={{ color: "var(--muted)" }}>學習單</Link>
      </p>
      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>換你出題</h1>
      <p style={{ color: "var(--muted)", fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
        我家大班生寫完撿松果回家，說太簡單，自己畫了題目考我。原來孩子最喜歡的，是當出題的人。
      </p>

      <p style={S.lbl}>撿松果回家的出題單</p>
      <p style={{ margin: `0 0 ${G.md}px`, fontSize: T.md, lineHeight: 1.9 }}>
        格子、小松鼠、房子都印好了，孩子在虛線上畫牆、在格子裡畫松果，再拿給大人寫。
      </p>
      <SheetPrint svg={ACORN} label="這一張出題單" />

      <p style={S.lbl}>萬用出題紙</p>
      <p style={{ margin: `0 0 ${G.md}px`, fontSize: T.md, lineHeight: 1.9 }}>
        迷宮、連連看、猜謎、算數，什麼題都可以。答案寫在下面，往後摺起來，寫題的人就看不到。
      </p>
      <SheetPrint svg={FREE} label="這一張出題紙" />

      <p style={S.lbl}>家長看這裡</p>
      <div style={S.box}>
        {[
          ["為什麼要讓孩子出題", "出題要先想好答案，再想怎麼讓別人想不到，比寫題更要動腦。而且孩子當出題的人，會覺得自己很厲害。"],
          ["寫題的人卡住了", "請出題的人當小老師，講他的題目要怎麼解。講得出來，代表他真的想清楚了。"],
          ["題目有兩個答案，或是走不到", "很正常，大人出題也常這樣。一起走一次，問他：「要怎麼改，才只有一條路？」"],
        ].map(([q, a], i) => (
          <div key={q} style={{ marginTop: i ? G.lg : 0 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: T.md }}>{q}</p>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
