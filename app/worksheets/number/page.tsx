import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { G, R, S, T } from "@/components/styles";
import { NUMBER_LEVELS } from "@/lib/worksheets/number";
import { NUMBER_SHEETS, numberSheetsOf } from "@/lib/worksheets/number-sheets";
import { ASSETS, SHEET_IMG, numberLevelPdf, sheetImg } from "@/lib/worksheets/assets";
import { breadcrumb, faq, graph, numberSeries, TIM } from "@/lib/worksheets/seo";
import { OG_BASE } from "@/lib/og-base";

/**
 * 數字松果：4 關的總覽。接「數學學習單」「加法學習單 pdf」「大班數學」這種不分關卡的搜尋。
 * 撿松果回家的迷宮加上數字：玩過撿松果的孩子一看就會，多練的是加法和「先想好要撿哪幾顆」。
 */

const PER = numberSheetsOf(1).length;
const TITLE = `數學學習單 PDF 免費下載：數字松果加法迷宮 ${NUMBER_LEVELS.length} 關（大班、小一）`;
const DESC = `撿到的松果加起來，要剛好等於房子上的數字。加法迷宮分 ${NUMBER_LEVELS.length} 關：6 以內、10 以內、三個數連加、20 以內進位，共 ${NUMBER_SHEETS.length} 張 A4。每一題都只有一條路剛好湊得到，PDF 免費下載，附答案和算式。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/worksheets/number" },
  openGraph: { ...OG_BASE, title: TITLE, description: DESC, type: "website", images: [{ url: ASSETS.numberOg, width: 1200, height: 630, alt: "數字松果：加法迷宮數學學習單" }] },
  twitter: { card: "summary_large_image", images: [ASSETS.numberOg] },
};

const QA: [string, string][] = [
  ["這是什麼樣的數學學習單？", "撿松果回家的迷宮，松果上多了數字，房子上也有一個數字。孩子要挑一條路，撿到的松果加起來剛好等於房子上的數字，每個格子只能走一次。一邊走一邊加，也要先想好要撿哪幾顆。"],
  ["幾歲可以開始？", "會 10 以內的加法就可以，大約大班。照孩子學加法的順序分 4 關：6 以內、10 以內、三個數連加、20 以內要進位（小一）。"],
  ["答案只有一個嗎？", "是。每一題都用程式把起點到房子的每一條路走過一遍、算出總和，剛好等於房子數字的只有一條。"],
  ["學習單是免費的嗎？可以印給全班嗎？", "免費，可以印給家裡的孩子，也可以印給班上的同學寫。每一張都有 PDF 可以下載。"],
  ["答案在哪裡？", "每一張右下角有 QR code，掃了先看要撿哪幾顆，還是不會再看路線。每一關也有一個答案和算式的 PDF。"],
];

export default function Page() {
  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["學習單", "/worksheets"], ["數學學習單：數字松果", "/worksheets/number"]]),
        numberSeries(),
        faq(QA),
        TIM,
      ) }} />
      <SiteHeader current="worksheets" />
      <nav aria-label="麵包屑" style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm }}>
        <Link href="/worksheets" style={{ color: "var(--muted)" }}>學習單</Link>
      </nav>
      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>
        數字松果<br />
        <span style={{ fontSize: "0.6em", color: "var(--muted)" }}>加法迷宮數學學習單・PDF 免費下載</span>
      </h1>
      <p style={{ fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
        撿到的松果，數字加起來要剛好等於房子上的數字。不用每一顆都撿，要自己挑。
      </p>
      <p style={{ fontSize: T.md, lineHeight: 1.9, color: "var(--muted)", margin: `${G.sm}px 0 0` }}>
        跟<Link href="/worksheets/acorn" style={{ color: "var(--accent)" }}>撿松果回家</Link>是同一種迷宮，玩過的孩子一看就會。{NUMBER_LEVELS.length} 關、每關 {PER} 張，一共 {NUMBER_SHEETS.length} 張 A4。
      </p>

      <p style={S.lbl}>選關卡</p>
      <div style={{ display: "grid", gap: G.md }}>
        {NUMBER_LEVELS.map((L) => {
          const first = numberSheetsOf(L.n)[0];
          return (
            <div key={L.n} style={row}>
              <Link href={`/worksheets/number/${L.n}`} style={thumb} aria-label={`第 ${L.n} 關`}>
                <img src={sheetImg(first.id)} alt={`數字松果第 ${L.n} 關「${L.name}」：${L.grade}數學學習單`} width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/worksheets/number/${L.n}`} style={{ color: "inherit", textDecoration: "none" }}>
                  <span style={{ display: "block", fontSize: T.xs, fontWeight: 700, color: "var(--pop)", letterSpacing: ".1em" }}>{"★".repeat(L.stars)}</span>
                  <h2 style={{ margin: `${G.xs}px 0`, fontSize: T.xl, lineHeight: 1.4 }}>第 {L.n} 關：{L.name}</h2>
                </Link>
                <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
                  {L.grade}・{L.age}・{L.what}
                </span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: `${G.xs}px ${G.lg}px`, marginTop: G.sm, fontSize: T.sm }}>
                  <Link href={`/worksheets/number/${L.n}`} style={go}>看這一關 →</Link>
                  <a href={numberLevelPdf(L.n)} download={`數字松果_第${L.n}關_${PER}張.pdf`} style={dl}>下載 {PER} 張 PDF</a>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p style={S.lbl}>家長常問</p>
      <div style={S.box}>
        {QA.map(([q, a], i) => (
          <div key={q} style={{ marginTop: i ? G.lg : 0 }}>
            <h2 style={qh}>{q}</h2>
            <p style={{ margin: `${G.xs}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)" }}>{a}</p>
          </div>
        ))}
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>題目、圖都是我們自己做的，可以自由印給家裡的孩子、班上的同學寫。每一題都用程式把所有走法算過一遍，確定只有一個答案。</p>
      </footer>
    </main>
  );
}

const row: React.CSSProperties = { ...S.box, display: "flex", gap: G.lg, alignItems: "center" };
const thumb: React.CSSProperties = { display: "block", width: 92, flex: "none", background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, overflow: "hidden" };
const go: React.CSSProperties = { color: "var(--accent)", fontWeight: 700 };
const dl: React.CSSProperties = { color: "var(--muted)", fontWeight: 600 };
const qh: React.CSSProperties = { margin: 0, fontSize: T.md, fontWeight: 700, fontFamily: "inherit", letterSpacing: 0 };
