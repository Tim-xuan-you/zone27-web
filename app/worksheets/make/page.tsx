import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SheetPrint from "@/components/worksheets/SheetPrint";
import { G, S, T } from "@/components/styles";
import { acornMakerPage, freeMakerPage } from "@/lib/worksheets/make-sheet";
import { ASSETS } from "@/lib/worksheets/assets";
import { breadcrumb, faq, graph, ORG_ID, SITE, TIM, TIM_ID } from "@/lib/worksheets/seo";

/**
 * 出題紙：換孩子出題給大人寫（2026-10-01）。
 * Tim 家的大班生寫完撿松果回家說太簡單，自己畫了兩題考爸爸，隔天又出一張。這一頁就是照這件事做的。
 */

const TITLE = "出題紙 PDF 免費下載：換孩子出題給大人寫（迷宮出題單、萬用出題紙）";
const DESC = "讓孩子當出題的人：撿松果回家的空白迷宮出題單，還有什麼題都能出的萬用出題紙，答案寫在下面往後摺。A4 PDF 免費下載，說明都有注音。";
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/worksheets/make" },
  openGraph: { title: TITLE, description: DESC, type: "website", images: [{ url: ASSETS.makeOg, width: 1200, height: 630, alt: "換你出題：出題紙" }] },
  twitter: { card: "summary_large_image", images: [ASSETS.makeOg] },
};

const QA: [string, string][] = [
  ["為什麼要讓孩子出題？", "出題要先想好答案，再想怎麼讓別人想不到，比寫題更要動腦。而且孩子當出題的人，會覺得自己很厲害。"],
  ["寫題的人卡住了怎麼辦？", "請出題的人當小老師，講他的題目要怎麼解。講得出來，代表他真的想清楚了。"],
  ["孩子出的題目有兩個答案，或是走不到，怎麼辦？", "很正常，大人出題也常這樣。一起走一次，問他：「要怎麼改，才只有一條路？」"],
];
const res = (name: string, pdf: string, img: string) => ({
  "@type": "LearningResource", name, inLanguage: "zh-Hant-TW", isAccessibleForFree: true, learningResourceType: "出題紙",
  typicalAgeRange: "5-8", image: `${SITE}${img}`, author: { "@id": TIM_ID }, publisher: { "@id": ORG_ID },
  encoding: { "@type": "MediaObject", contentUrl: `${SITE}${pdf}`, encodingFormat: "application/pdf" },
});

const ACORN = acornMakerPage();
const FREE = freeMakerPage();

export default function Page() {
  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["學習單", "/worksheets"], ["換你出題", "/worksheets/make"]]),
        res("撿松果回家出題單", ASSETS.makeAcornPdf, ASSETS.makeAcornImg),
        res("萬用出題紙", ASSETS.makeFreePdf, ASSETS.makeFreeImg),
        faq(QA),
        TIM,
      ) }} />
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
      <SheetPrint svg={ACORN} label="這一張出題單" img={ASSETS.makeAcornImg} alt="撿松果回家出題單：空白的迷宮格子，孩子自己畫牆、畫松果" pdf={ASSETS.makeAcornPdf} filename="出題紙_撿松果回家.pdf" />

      <p style={S.lbl}>萬用出題紙</p>
      <p style={{ margin: `0 0 ${G.md}px`, fontSize: T.md, lineHeight: 1.9 }}>
        迷宮、連連看、猜謎、算數，什麼題都可以。答案寫在下面，往後摺起來，寫題的人就看不到。
      </p>
      <SheetPrint svg={FREE} label="這一張出題紙" img={ASSETS.makeFreeImg} alt="萬用出題紙：上面寫題目，答案寫在下面往後摺" pdf={ASSETS.makeFreePdf} filename="出題紙_萬用.pdf" />

      <p style={S.lbl}>家長看這裡</p>
      <div style={S.box}>
        {QA.map(([q, a], i) => (
          <div key={q} style={{ marginTop: i ? G.lg : 0 }}>
            <h2 style={{ margin: 0, fontSize: T.md, fontWeight: 700, fontFamily: "inherit", letterSpacing: 0 }}>{q}</h2>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
