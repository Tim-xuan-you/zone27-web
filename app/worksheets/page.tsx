import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { G, R, S, T } from "@/components/styles";
import { ACORN_LEVELS } from "@/lib/worksheets/acorn";
import { acornSheetPages } from "@/lib/worksheets/acorn-sheet";

/**
 * 學習單首頁（2026-10-01 開工）。
 *
 * Tim 的方向：免費學習單當主軸，A4 印了就能寫，跟著自己的孩子一起長大（他家的現在大班）。
 * 跟別人不一樣的地方（2026-10-01 查過台灣的學習單網站）：
 *   每按一次就換新題目、題目說明都有注音孩子自己讀得懂、答案用畫的不用寫國字、
 *   卡住有一段一段的提示（掃 QR code）、每一題都用程式確認只有一個答案。
 * 題目全部自己出。照著評量卷、益智書改是改作，不做（memory: zone27-kids-worksheets）。
 */

export const metadata: Metadata = {
  title: "免費益智學習單：A4 印了就能寫，每次都是新題目",
  description: "給 5 歲以上孩子的益智學習單。說明都有注音，答案用畫的不用寫字，卡住了掃 QR code 一段一段看提示。每按一次就換新題目，免費列印。",
  alternates: { canonical: "/worksheets" },
};

const THUMB = acornSheetPages(1, 101111).page1;

export default function Page() {
  return (
    <main style={S.page}>
      <SiteHeader current="worksheets" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: `0 0 ${G.lg}px` }}>
        印了就能寫的學習單
      </h1>
      <p style={{ color: "var(--muted)", fontSize: T.lg, lineHeight: 1.9, margin: `0 0 ${G.xl}px`, maxWidth: "40ch" }}>
        A4 一張兩題，每按一次就是新題目。說明都有注音，孩子自己讀得懂；答案用畫的，不用寫字。
      </p>

      <Link href="/worksheets/acorn" style={card}>
        <span style={thumb} aria-hidden dangerouslySetInnerHTML={{ __html: THUMB }} />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontSize: T.xs, color: "var(--faint)", fontWeight: 600 }}>迷宮・路線</span>
          <span style={{ display: "block", fontSize: T.xl, fontWeight: 700, lineHeight: 1.4, margin: `${G.xs}px 0` }}>撿松果回家</span>
          <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
            每一顆松果都要撿到，每一格只能走一次。5 歲開始，一共 {ACORN_LEVELS.length} 關。
          </span>
        </span>
      </Link>

      <p style={S.lbl}>怎麼用</p>
      <div style={S.box}>
        {[
          "先從第 1 關開始。寫得很順，下一張就往下一關；卡住了，就印前一關。",
          "卡住的時候，掃學習單右下角的 QR code，提示一次只看一段，看完讓孩子接著自己畫。",
          "沒有印表機：按「印出來」選「存成 PDF」，拿去超商印。",
        ].map((t, i) => (
          <p key={i} style={{ margin: i ? `${G.md}px 0 0` : 0, fontSize: T.md, lineHeight: 1.9 }}>{t}</p>
        ))}
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          題目都是我們自己出的，每一題出完都用程式把所有走法數過一遍，確定只有一個答案。字型用芫荽（Iansui），照教育部標準字形調整，跟課本上的字長得一樣。
        </p>
      </footer>
    </main>
  );
}

const card: React.CSSProperties = {
  ...S.box, display: "flex", alignItems: "center", gap: G.lg, textDecoration: "none", color: "inherit", boxShadow: "var(--sh)",
};
const thumb: React.CSSProperties = {
  display: "block", width: 96, flex: "none", background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, overflow: "hidden",
};
