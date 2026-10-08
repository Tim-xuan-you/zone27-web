"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { G, R, S, T } from "@/components/styles";
import { SHEET_IMG } from "@/lib/worksheets/assets";

/**
 * 一張固定的學習單：預覽、印出來。出題紙這種不用選關卡的用這個。
 * 列印的做法跟撿松果回家一樣：印的那一份放在 <body> 最外層，列印時只留它。
 */

export const PRINT_CSS = `
.ws-print { position: absolute; left: -10000px; top: 0; width: 210mm; visibility: hidden; pointer-events: none; }
.ws-print .ws-page svg { width: 210mm; height: 297mm; display: block; }
@media print {
  @page { size: A4; margin: 0; }
  html, body { background: #fff !important; margin: 0 !important; padding: 0 !important; }
  body > *:not(.ws-print) { display: none !important; }
  .ws-print { position: static; left: auto; visibility: visible; width: 210mm; }
  .ws-print .ws-page { width: 210mm; height: 297mm; overflow: hidden; break-after: page; }
  .ws-print .ws-page:last-child { break-after: auto; }
}
.ws-svg svg { width: 100%; height: auto; display: block; }
`;

/**
 * img、pdf：預先產生的預覽圖和 PDF（scripts/worksheets-assets.ts）。
 * 2026-10-09 家長搜的是「下載」「pdf」，所以下載 PDF 放第一個；預覽用圖片，頁面輕、Google 圖片也找得到。
 */
export default function SheetPrint({ svg, label, img, alt, pdf, filename }: { svg: string; label: string; img: string; alt: string; pdf: string; filename: string }) {
  const [mounted, setMounted] = useState(false);
  const [on, setOn] = useState(false);
  useEffect(() => setMounted(true), []);

  async function print() {
    setOn(true);
    await new Promise((r) => setTimeout(r, 60));
    try { await document.fonts?.ready; } catch {}
    window.print();
    // 列印視窗關掉才會走到這裡。收起來，同一頁再按另一張的時候才不會兩張一起印
    setOn(false);
  }

  return (
    <div>
      <style>{PRINT_CSS}</style>
      <figure style={{ ...paper, margin: 0 }}>
        <img src={img} alt={alt} width={SHEET_IMG.w} height={SHEET_IMG.h} loading="lazy" style={{ width: "100%", height: "auto", display: "block" }} />
      </figure>
      <div style={{ display: "flex", flexWrap: "wrap", gap: G.md, marginTop: G.lg }}>
        <a href={pdf} download={filename} style={btn}>下載 PDF</a>
        <button type="button" onClick={print} style={ghost}>印{label}</button>
      </div>
      {/* 同一頁有好幾張可以印：按哪一張，印的那一份才放哪一張 */}
      {mounted && on && createPortal(
        <div className="ws-print" aria-hidden>
          <div className="ws-page" dangerouslySetInnerHTML={{ __html: svg }} />
        </div>,
        document.body,
      )}
    </div>
  );
}

const paper: React.CSSProperties = {
  background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, boxShadow: "var(--sh)", overflow: "hidden",
};
const btn: React.CSSProperties = { ...S.buy, background: "var(--pop)", color: "var(--pop-ink)" };
const ghost: React.CSSProperties = {
  padding: "12px 22px", borderRadius: R.pill, border: "1px solid var(--line)", background: "var(--surface)",
  color: "var(--ink)", fontWeight: 700, fontSize: T.md, cursor: "pointer",
};
