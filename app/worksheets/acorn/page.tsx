import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { G, R, S, T } from "@/components/styles";
import { ACORN_LEVELS } from "@/lib/worksheets/acorn";
import { ACORN_SHEETS, acornSheetsOf } from "@/lib/worksheets/acorn-sheets";
import { ASSETS, SHEET_IMG, levelPdf, sheetImg } from "@/lib/worksheets/assets";
import { acornSeries, breadcrumb, faq, graph, TIM } from "@/lib/worksheets/seo";

/**
 * 撿松果回家：6 關的總覽（2026-10-09 起，每一關另外有自己的頁面）。
 *
 * 這一頁接「幼兒迷宮學習單」「幼兒迷宮 pdf」「兒童迷宮下載」這種不分年級的搜尋：
 * 一眼看到 6 關各適合哪個年級，點進去就是那一關。整關的 PDF 這裡也直接給。
 */

const TITLE = "幼兒迷宮學習單 PDF 免費下載：撿松果回家 6 關（中班到小一）";
const DESC = `幫小松鼠撿完每一顆松果再回家的迷宮學習單。從中班到小一分 6 關，共 ${ACORN_SHEETS.length} 張 A4，每一張都能下載 PDF。說明都有注音，答案用畫的，每一題都只有一個答案，卡住了有一段一段的提示。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/worksheets/acorn" },
  openGraph: { title: TITLE, description: DESC, type: "website", images: [{ url: ASSETS.acornOg, width: 1200, height: 630, alt: "撿松果回家：幼兒迷宮學習單" }] },
  twitter: { card: "summary_large_image", images: [ASSETS.acornOg] },
};

const QA: [string, string][] = [
  ["這是什麼樣的迷宮？", "小松鼠從左上角出發、走到右下角的房子。路上的松果每一顆都要撿到，每個格子只能走一次。直接走最近的路一定會漏掉松果，所以要先想好路線再下筆。"],
  ["幾歲可以開始寫？", "第 1 關 5 歲（中班、大班）就可以，第 6 關大概 7 歲以上（小一、小二）。第一次寫，先從第 1 關開始。"],
  ["要怎麼選關卡？", "會九成、卡一成的那一關最剛好。一張兩題寫得很輕鬆，下一張就往上一關；卡住想放棄，就退一關。"],
  ["學習單是免費的嗎？可以印給全班嗎？", "免費，可以印給家裡的孩子，也可以印給班上的同學寫。每一張都有 PDF 可以下載。"],
  ["答案在哪裡？", "每一張右下角有 QR code，掃了會看到提示，一次只開一段，最後一段是答案。每一關也有一個提示和答案的 PDF。"],
];

export default function Page() {
  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["學習單", "/worksheets"], ["幼兒迷宮：撿松果回家", "/worksheets/acorn"]]),
        acornSeries(),
        faq(QA),
        TIM,
      ) }} />
      <SiteHeader current="worksheets" />
      <nav aria-label="麵包屑" style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm }}>
        <Link href="/worksheets" style={{ color: "var(--muted)" }}>學習單</Link>
      </nav>
      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>
        撿松果回家<br />
        <span style={{ fontSize: "0.6em", color: "var(--muted)" }}>幼兒迷宮學習單・PDF 免費下載</span>
      </h1>
      <p style={{ fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
        幫小松鼠撿完每一顆松果再回家，每個格子只能走一次。直接走最近的路一定會漏掉松果，要先看完整條路線、想好再下筆。
      </p>
      <p style={{ fontSize: T.md, lineHeight: 1.9, color: "var(--muted)", margin: `${G.sm}px 0 0` }}>
        中班到小一，分 {ACORN_LEVELS.length} 關、每關 5 張，一共 {ACORN_SHEETS.length} 張 A4。挑孩子的年級，點進去選一張下載或列印。
      </p>

      <p style={S.lbl}>選關卡</p>
      <div style={{ display: "grid", gap: G.md }}>
        {ACORN_LEVELS.map((L) => {
          const first = acornSheetsOf(L.n)[0];
          return (
            <div key={L.n} style={row}>
              <Link href={`/worksheets/acorn/${L.n}`} style={thumb} aria-label={`第 ${L.n} 關`}>
                <img src={sheetImg(first.id)} alt={`撿松果回家第 ${L.n} 關：${L.grade}，${L.W}×${L.H} 迷宮學習單`} width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/worksheets/acorn/${L.n}`} style={{ color: "inherit", textDecoration: "none" }}>
                  <span style={{ display: "block", fontSize: T.xs, fontWeight: 700, color: "var(--pop)", letterSpacing: ".1em" }}>{"★".repeat(L.stars)}</span>
                  <h2 style={{ margin: `${G.xs}px 0`, fontSize: T.xl, lineHeight: 1.4 }}>第 {L.n} 關：{L.grade}</h2>
                </Link>
                <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
                  {L.age}・{L.W}×{L.H} 格子・每題 {L.acMin}～{L.acMax} 顆松果・5 張
                </span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: `${G.xs}px ${G.lg}px`, marginTop: G.sm, fontSize: T.sm }}>
                  <Link href={`/worksheets/acorn/${L.n}`} style={go}>看這一關 →</Link>
                  <a href={levelPdf(L.n)} download={`撿松果回家_第${L.n}關_5張.pdf`} style={dl}>下載 5 張 PDF</a>
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

      <p style={{ marginTop: G.xl, fontSize: T.md, lineHeight: 1.9 }}>
        孩子寫完說太簡單？<Link href="/worksheets/make" style={{ color: "var(--accent)", fontWeight: 700 }}>換他出題給你寫 →</Link>
      </p>

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
