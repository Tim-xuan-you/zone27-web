import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Promises from "@/components/worksheets/Promises";
import { G, R, S, T } from "@/components/styles";
import { ACORN_LEVELS } from "@/lib/worksheets/acorn";
import { acornSheetPages } from "@/lib/worksheets/acorn-sheet";
import { ACORN_SHEETS } from "@/lib/worksheets/acorn-sheets";
import { acornMakerPage } from "@/lib/worksheets/make-sheet";

/**
 * 學習單首頁。
 *
 * 2026-10-01 Tim：「我想要大家可以印自己想要的！不要隨機耶！」
 * 每一種玩法都是固定編號的幾張，家長挑想要的印。
 * 還在做的那幾款也列出來（一行一款，不做成空卡片），讓家長知道這裡會一直長，也知道點子從哪裡來。
 */

export const metadata: Metadata = {
  title: "免費益智學習單：A4 印了就能寫",
  description: "給 5 歲以上孩子的益智學習單。說明都有注音，答案用畫的不用寫字，卡住了掃 QR code 一段一段看提示。每一關都有固定的幾張，挑想要的印。",
  alternates: { canonical: "/worksheets" },
};

const THUMB = acornSheetPages(ACORN_SHEETS[0]).page1;
const MAKER = acornMakerPage();
const COMING = [
  ["注音猜猜看", "看注音，圈出是哪一個東西；會寫注音的，換你寫出來。點子是我家大班生出的。"],
  ["連連看", "誰吃什麼、長大會變成什麼。每一個答案都先查過可靠的資料。"],
  ["數字松果", "松果上有數字，撿到的加起來要剛好等於房子上的數字。"],
] as const;

export default function Page() {
  return (
    <main style={S.page}>
      <SiteHeader current="worksheets" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.md}px` }}>學習單</h1>
      <p style={{ color: "var(--muted)", fontSize: T.lg, lineHeight: 1.9, margin: `0 0 ${G.xl}px` }}>
        A4 一張兩題，每一關都有固定的幾張，挑想要的印。第一次寫，先從第 1 關開始。
      </p>

      <Link href="/worksheets/acorn" style={card}>
        <span style={thumb} aria-hidden dangerouslySetInnerHTML={{ __html: THUMB }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={tag}>迷宮・路線</span>
          <span style={{ display: "block", fontSize: T.xl, fontWeight: 700, lineHeight: 1.4, margin: `${G.sm}px 0 ${G.xs}px` }}>撿松果回家</span>
          <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
            每一顆松果都要撿到，每個格子只能走一次。5 歲開始，{ACORN_LEVELS.length} 關、每關 {ACORN_SHEETS.filter((s) => s.level === 1).length} 張。
          </span>
        </span>
        <span aria-hidden style={{ fontSize: T.xl, color: "var(--faint)" }}>›</span>
      </Link>

      <Link href="/worksheets/make" style={{ ...card, marginTop: G.md }}>
        <span style={thumb} aria-hidden dangerouslySetInnerHTML={{ __html: MAKER }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={tag}>出題紙</span>
          <span style={{ display: "block", fontSize: T.xl, fontWeight: 700, lineHeight: 1.4, margin: `${G.sm}px 0 ${G.xs}px` }}>換你出題</span>
          <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
            孩子當出題的人，畫牆、畫松果，拿給大人寫。還有一張什麼題都能出的萬用出題紙。
          </span>
        </span>
        <span aria-hidden style={{ fontSize: T.xl, color: "var(--faint)" }}>›</span>
      </Link>

      <p style={S.lbl}>正在做的</p>
      <div style={{ ...S.box, padding: `${G.sm}px ${G.xl - 4}px` }}>
        {COMING.map(([t, d], i) => (
          <div key={t} style={{ padding: `${G.md}px 0`, borderTop: i ? "1px solid var(--line)" : 0 }}>
            <span style={{ fontWeight: 700, fontSize: T.md }}>{t}</span>
            <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>{d}</span>
          </div>
        ))}
      </div>

      <p style={S.lbl}>每一張都做到的四件事</p>
      <Promises />

      <style>{`.ws-svg svg, a span[aria-hidden] svg { width: 100%; height: auto; display: block; }`}</style>
    </main>
  );
}

const card: React.CSSProperties = {
  ...S.box, display: "flex", alignItems: "center", gap: G.lg, textDecoration: "none", color: "inherit", boxShadow: "var(--sh)",
};
const thumb: React.CSSProperties = {
  display: "block", width: 104, flex: "none", background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, overflow: "hidden",
};
const tag: React.CSSProperties = {
  display: "inline-block", fontSize: T.xs, fontWeight: 700, color: "var(--accent)", background: "var(--accent-soft)",
  borderRadius: R.pill, padding: "2px 10px",
};
