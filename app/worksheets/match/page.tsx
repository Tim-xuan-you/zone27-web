import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { G, R, S, T } from "@/components/styles";
import { MATCH_THEMES } from "@/lib/worksheets/match";
import { MATCH_SHEETS, matchSheetsOf } from "@/lib/worksheets/match-sheets";
import { ASSETS, SHEET_IMG, matchThemePdf, sheetImg } from "@/lib/worksheets/assets";
import { breadcrumb, faq, graph, matchSeries, TIM } from "@/lib/worksheets/seo";
import { OG_BASE } from "@/lib/og-base";

/**
 * 連連看：兩個主題的總覽。接「連連看學習單」「幼兒連連看」「連連看 pdf」這種不分主題的搜尋。
 * 點子是 Tim 家大班生出的：蝴蝶、海鷗在左邊，毛毛蟲、魚在右邊，中間塗黑的小圓點是連線的地方。
 */

const TITLE = "幼兒連連看學習單 PDF 免費下載：誰吃什麼、長大變成什麼（大班、小一）";
const DESC = `從黑點畫線的連連看學習單，兩個主題：動物吃什麼、小時候長大變成什麼。共 ${MATCH_SHEETS.length} 張 A4，圖下面的名字都有注音，每一組答案都先查過資料（兔子主要吃草、孑孓長大變成蚊子），PDF 免費下載，附答案和小知識。`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/worksheets/match" },
  openGraph: { ...OG_BASE, title: TITLE, description: DESC, type: "website", images: [{ url: ASSETS.matchOg, width: 1200, height: 630, alt: "幼兒連連看學習單" }] },
  twitter: { card: "summary_large_image", images: [ASSETS.matchOg] },
};

const QA: [string, string][] = [
  ["這是什麼樣的連連看？", "左邊一排圖、右邊一排圖，每張圖旁邊有一個黑點，孩子從黑點畫線，把對的兩個連起來。圖下面有名字和注音，孑孓、水蠆這種沒看過的，看名字也能學到。"],
  ["幾歲可以開始？", "每個主題前 3 張每張 4 組，大班（5 歲）就可以；後 2 張每張 5 組，多了比較少見的動物，適合小一。"],
  ["答案是怎麼確定的？", "每一組都先查過資料：貓熊、無尾熊、食蟻獸吃什麼，照臺北市立動物園的說明；孑孓照衛生局防治病媒蚊的衛教資料。大家以為的答案跟事實不一樣的，收對的那一個，像兔子主要吃草，紅蘿蔔只能偶爾吃。同一張裡不會有兩個都說得通的答案。"],
  ["學習單是免費的嗎？可以印給全班嗎？", "免費，可以印給家裡的孩子，也可以印給班上的同學寫。每一張都有 PDF 可以下載。"],
  ["答案在哪裡？", "每一張右下角有 QR code，掃了就是答案，下面還有每一組的小知識。每個主題也有一個答案的 PDF。"],
];

export default function Page() {
  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(
        breadcrumb([["首頁", "/"], ["學習單", "/worksheets"], ["連連看", "/worksheets/match"]]),
        matchSeries(),
        faq(QA),
        TIM,
      ) }} />
      <SiteHeader current="worksheets" />
      <nav aria-label="麵包屑" style={{ margin: `0 0 ${G.sm}px`, fontSize: T.sm }}>
        <Link href="/worksheets" style={{ color: "var(--muted)" }}>學習單</Link>
      </nav>
      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>
        連連看<br />
        <span style={{ fontSize: "0.6em", color: "var(--muted)" }}>幼兒連連看學習單・PDF 免費下載</span>
      </h1>
      <p style={{ fontSize: T.lg, lineHeight: 1.9, margin: 0 }}>
        從黑點畫線，把對的兩個連起來。動物吃什麼、小時候長大變成什麼，每一組答案都先查過資料。
      </p>
      <p style={{ fontSize: T.md, lineHeight: 1.9, color: "var(--muted)", margin: `${G.sm}px 0 0` }}>
        這一款的點子，也是我家大班生出的。有一天畫了一張連連看考我：左邊是蝴蝶、海鷗，右邊是毛毛蟲、魚，中間塗黑的小圓點是連線的地方。我照著做成兩個主題、一共 {MATCH_SHEETS.length} 張 A4。
      </p>

      <p style={S.lbl}>選主題</p>
      <div style={{ display: "grid", gap: G.md }}>
        {MATCH_THEMES.map((Th) => {
          const sheets = matchSheetsOf(Th.id);
          return (
            <div key={Th.id} style={row}>
              <Link href={`/worksheets/match/${Th.id}`} style={thumb} aria-label={Th.name}>
                <img src={sheetImg(sheets[0].id)} alt={`連連看・${Th.name}學習單預覽`} width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
              </Link>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link href={`/worksheets/match/${Th.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                  <h2 style={{ margin: `0 0 ${G.xs}px`, fontSize: T.xl, lineHeight: 1.4 }}>{Th.ask}</h2>
                </Link>
                <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
                  {Th.pairs.slice(0, 3).map((p) => `${p.left.name}→${p.right.name}`).join("、")}，一共 {Th.pairs.length} 組・{sheets.length} 張
                </span>
                <span style={{ display: "flex", flexWrap: "wrap", gap: `${G.xs}px ${G.lg}px`, marginTop: G.sm, fontSize: T.sm }}>
                  <Link href={`/worksheets/match/${Th.id}`} style={go}>看這個主題 →</Link>
                  <a href={matchThemePdf(Th.id)} download={`連連看_${Th.name}_${sheets.length}張.pdf`} style={dl}>下載 {sheets.length} 張 PDF</a>
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
        想換個玩法？<Link href="/worksheets/acorn" style={{ color: "var(--accent)", fontWeight: 700 }}>迷宮學習單「撿松果回家」</Link>、<Link href="/worksheets/zhuyin" style={{ color: "var(--accent)", fontWeight: 700 }}>注音猜猜看</Link>
      </p>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>題目、圖都是我們自己做的，可以自由印給家裡的孩子、班上的同學寫。資料來源只寫名字，不放連結。</p>
      </footer>
    </main>
  );
}

const row: React.CSSProperties = { ...S.box, display: "flex", gap: G.lg, alignItems: "center" };
const thumb: React.CSSProperties = { display: "block", width: 92, flex: "none", background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, overflow: "hidden" };
const go: React.CSSProperties = { color: "var(--accent)", fontWeight: 700 };
const dl: React.CSSProperties = { color: "var(--muted)", fontWeight: 600 };
const qh: React.CSSProperties = { margin: 0, fontSize: T.md, fontWeight: 700, fontFamily: "inherit", letterSpacing: 0 };
