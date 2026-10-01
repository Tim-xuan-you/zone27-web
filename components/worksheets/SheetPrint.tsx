"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { G, R, S } from "@/components/styles";

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

export default function SheetPrint({ svg, label }: { svg: string; label: string }) {
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
      <div className="ws-svg" style={paper} aria-label={`${label}的預覽`} dangerouslySetInnerHTML={{ __html: svg }} />
      <button type="button" onClick={print} style={btn}>印{label}</button>
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
const btn: React.CSSProperties = { ...S.buy, border: 0, cursor: "pointer", background: "var(--pop)", color: "var(--pop-ink)", marginTop: G.lg };
