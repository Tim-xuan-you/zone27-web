import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Promises from "@/components/worksheets/Promises";
import { G, R, S, T } from "@/components/styles";
import { ACORN_LEVELS } from "@/lib/worksheets/acorn";
import { ACORN_SHEETS } from "@/lib/worksheets/acorn-sheets";
import { ASSETS, SHEET_IMG, guessSheetImg, sheetImg } from "@/lib/worksheets/assets";
import { GUESS_LEVELS } from "@/lib/worksheets/guess";
import { GUESS_SHEETS } from "@/lib/worksheets/guess-sheets";
import { MATCH_SHEETS } from "@/lib/worksheets/match-sheets";
import { NUMBER_LEVELS } from "@/lib/worksheets/number";
import { NUMBER_SHEETS } from "@/lib/worksheets/number-sheets";
import { breadcrumb, graph, SITE, TIM } from "@/lib/worksheets/seo";
import { OG_BASE } from "@/lib/og-base";

/**
 * 學習單首頁。
 *
 * 2026-10-01 Tim：「我想要大家可以印自己想要的！不要隨機耶！」
 * 每一種玩法都是固定編號的幾張，家長挑想要的印。
 * 還在做的那幾款也列出來（一行一款，不做成空卡片），讓家長知道這裡會一直長，也知道點子從哪裡來。
 */

// 2026-10-09 查 Google 建議字：免費學習單下載、大班學習單下載、中班學習單下載、幼兒迷宮pdf、注音學習單下載
const TITLE = "免費學習單下載：幼兒迷宮、數學、注音、連連看 PDF（中班、大班、小一）";
const DESC = `給中班、大班、小一孩子的免費益智學習單，A4 PDF 下載就能印。幼兒迷宮 6 關共 ${ACORN_SHEETS.length} 張、數字松果加法迷宮 ${NUMBER_SHEETS.length} 張、注音猜猜看 4 關共 ${GUESS_SHEETS.length} 張、連連看 ${MATCH_SHEETS.length} 張，還有讓孩子出題的出題紙。說明都有注音，答案不用寫國字，卡住了掃 QR code 看提示。`;
export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/worksheets" },
  openGraph: { ...OG_BASE, title: TITLE, description: DESC, type: "website", images: [{ url: ASSETS.worksheetsOg, width: 1200, height: 630, alt: "陪孩子動腦的益智學習單" }] },
  twitter: { card: "summary_large_image", images: [ASSETS.worksheetsOg] },
};

const LIST = {
  "@type": "ItemList",
  name: "ZONE 27 的免費學習單",
  itemListElement: [
    { "@type": "ListItem", position: 1, url: `${SITE}/worksheets/acorn`, name: "撿松果回家：幼兒迷宮學習單" },
    { "@type": "ListItem", position: 2, url: `${SITE}/worksheets/number`, name: "數字松果：加法迷宮數學學習單" },
    { "@type": "ListItem", position: 3, url: `${SITE}/worksheets/zhuyin`, name: "注音猜猜看：注音學習單" },
    { "@type": "ListItem", position: 4, url: `${SITE}/worksheets/match`, name: "連連看：誰吃什麼、長大變成什麼" },
    { "@type": "ListItem", position: 5, url: `${SITE}/worksheets/make`, name: "換你出題：出題紙" },
  ],
};

export default function Page() {
  return (
    <main style={S.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: graph(breadcrumb([["首頁", "/"], ["學習單", "/worksheets"]]), LIST, TIM) }} />
      <SiteHeader current="worksheets" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>
        免費學習單<br />
        <span style={{ fontSize: "0.6em", color: "var(--muted)" }}>中班、大班、小一・PDF 下載</span>
      </h1>
      <p style={{ color: "var(--muted)", fontSize: T.lg, lineHeight: 1.9, margin: `0 0 ${G.xl}px` }}>
        A4，每一張都能下載 PDF。每一關有固定的幾張，挑想要的印。第一次寫，先從第 1 關開始。
      </p>

      <Link href="/worksheets/acorn" style={card}>
        <span style={thumb}><img src={sheetImg(ACORN_SHEETS[0].id)} alt="撿松果回家：幼兒迷宮學習單預覽" width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={imgFit} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={tag}>迷宮・路線</span>
          <span style={{ display: "block", fontSize: T.xl, fontWeight: 700, lineHeight: 1.4, margin: `${G.sm}px 0 ${G.xs}px` }}>撿松果回家</span>
          <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
            每一顆松果都要撿到，每個格子只能走一次。5 歲開始，{ACORN_LEVELS.length} 關、每關 {ACORN_SHEETS.filter((s) => s.level === 1).length} 張。
          </span>
        </span>
        <span aria-hidden style={{ fontSize: T.xl, color: "var(--faint)" }}>›</span>
      </Link>

      <Link href="/worksheets/number" style={{ ...card, marginTop: G.md }}>
        <span style={thumb}><img src={sheetImg(NUMBER_SHEETS[0].id)} alt="數字松果：加法迷宮數學學習單預覽" width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={imgFit} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={tag}>數學・加法</span>
          <span style={{ display: "block", fontSize: T.xl, fontWeight: 700, lineHeight: 1.4, margin: `${G.sm}px 0 ${G.xs}px` }}>數字松果</span>
          <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
            撿到的松果加起來，要剛好等於房子上的數字。大班 10 以內到小一 20 以內進位，{NUMBER_LEVELS.length} 關。
          </span>
        </span>
        <span aria-hidden style={{ fontSize: T.xl, color: "var(--faint)" }}>›</span>
      </Link>

      <Link href="/worksheets/zhuyin" style={{ ...card, marginTop: G.md }}>
        <span style={thumb}><img src={guessSheetImg(GUESS_SHEETS[0].id, "circle")} alt="注音猜猜看：注音學習單預覽" width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={imgFit} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={tag}>注音</span>
          <span style={{ display: "block", fontSize: T.xl, fontWeight: 700, lineHeight: 1.4, margin: `${G.sm}px 0 ${G.xs}px` }}>注音猜猜看</span>
          <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
            看注音圈出對的圖，會寫的換你寫出來。大班開始，{GUESS_LEVELS.length} 關、每關 {GUESS_SHEETS.filter((s) => s.level === 1).length} 張。點子是我家大班生出的。
          </span>
        </span>
        <span aria-hidden style={{ fontSize: T.xl, color: "var(--faint)" }}>›</span>
      </Link>

      <Link href="/worksheets/match" style={{ ...card, marginTop: G.md }}>
        <span style={thumb}><img src={sheetImg(MATCH_SHEETS[0].id)} alt="連連看學習單預覽" width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={imgFit} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={tag}>連連看</span>
          <span style={{ display: "block", fontSize: T.xl, fontWeight: 700, lineHeight: 1.4, margin: `${G.sm}px 0 ${G.xs}px` }}>誰吃什麼、長大變成什麼</span>
          <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
            從黑點畫線連起來。兔子主要吃草、孑孓長大變成蚊子，每一組答案都先查過資料。
          </span>
        </span>
        <span aria-hidden style={{ fontSize: T.xl, color: "var(--faint)" }}>›</span>
      </Link>

      <Link href="/worksheets/make" style={{ ...card, marginTop: G.md }}>
        <span style={thumb}><img src={ASSETS.makeAcornImg} alt="換你出題：迷宮出題單預覽" width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={imgFit} /></span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={tag}>出題紙</span>
          <span style={{ display: "block", fontSize: T.xl, fontWeight: 700, lineHeight: 1.4, margin: `${G.sm}px 0 ${G.xs}px` }}>換你出題</span>
          <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
            孩子當出題的人，畫牆、畫松果，拿給大人寫。還有一張什麼題都能出的萬用出題紙。
          </span>
        </span>
        <span aria-hidden style={{ fontSize: T.xl, color: "var(--faint)" }}>›</span>
      </Link>

      <p style={S.lbl}>每一張都做到的四件事</p>
      <Promises />

          </main>
  );
}

const card: React.CSSProperties = {
  ...S.box, display: "flex", alignItems: "center", gap: G.lg, textDecoration: "none", color: "inherit", boxShadow: "var(--sh)",
};
const thumb: React.CSSProperties = {
  display: "block", width: 104, flex: "none", background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, overflow: "hidden",
};
const imgFit: React.CSSProperties = { width: "100%", height: "auto", display: "block" };
const tag: React.CSSProperties = {
  display: "inline-block", fontSize: T.xs, fontWeight: 700, color: "var(--accent)", background: "var(--accent-soft)",
  borderRadius: R.pill, padding: "2px 10px",
};
