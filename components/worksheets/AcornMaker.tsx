"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Share from "@/components/Share";
import { G, R, S, T } from "@/components/styles";
import { ACORN_LEVELS, acornLevel, newSeed } from "@/lib/worksheets/acorn";
import { acornSheetPages } from "@/lib/worksheets/acorn-sheet";

/**
 * 撿松果回家：選關卡、換一張、印出來。
 *
 * 題目在讀者的手機或電腦上直接產生（一張 10 毫秒左右），網址記著「第幾關、第幾號」，
 * 傳給別人、掃 QR code 都找得回同一張。
 *
 * 列印：整張是一個 A4 的 SVG，螢幕上縮小給你看，印的時候換成真的 210 × 297 公釐。
 * 印的那一份放在 <body> 最外層，列印時只留它，頁首、按鈕都不會印出去。
 * 字型要先載好才印：那一份平常藏在畫面外面（不是 display:none），字型才會先下載。
 */

// 還沒按「換一張」之前，每一關都有一張固定的，搜尋引擎、沒開 JavaScript 的人看到的也是這張
const defaultSeed = (level: number) => 100000 + level * 1111;

const PRINT_CSS = `
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
.ws-preview svg { width: 100%; height: auto; display: block; }
`;

export default function AcornMaker() {
  const [level, setLevel] = useState(1);
  const [seed, setSeed] = useState(defaultSeed(1));
  const [withAnswers, setWithAnswers] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 網址上有 ?l=3&s=123456 就照著出（分享出去的、從提示頁回來的）
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const l = acornLevel(Number(q.get("l")) || 1).n;
    const s = Number(q.get("s"));
    setLevel(l);
    setSeed(Number.isInteger(s) && s >= 100000 && s <= 999999 ? s : defaultSeed(l));
    setMounted(true);
  }, []);

  // 換了關卡或題目，網址跟著改（不重新載入頁面）
  useEffect(() => {
    if (!mounted) return;
    window.history.replaceState(null, "", `?l=${level}&s=${seed}`);
  }, [level, seed, mounted]);

  const sheet = useMemo(() => acornSheetPages(level, seed), [level, seed]);
  const L = acornLevel(level);

  async function print() {
    try { await document.fonts?.ready; } catch {}
    window.print();
  }

  return (
    <div>
      <style>{PRINT_CSS}</style>

      <p style={lbl}>選關卡</p>
      <div style={levels} role="radiogroup" aria-label="關卡">
        {ACORN_LEVELS.map((x) => {
          const on = x.n === level;
          return (
            <button
              key={x.n}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => { setLevel(x.n); setSeed(defaultSeed(x.n)); }}
              style={on ? { ...chip, ...chipOn } : chip}
            >
              <span style={{ display: "block", fontWeight: 700, whiteSpace: "nowrap" }}>第 {x.n} 關</span>
              <span style={{ display: "block", fontSize: T.xs, color: on ? WSBlue : "var(--faint)", letterSpacing: ".1em" }}>
                {"★".repeat(x.stars)}
              </span>
            </button>
          );
        })}
      </div>
      <p style={{ ...S.hint, margin: `${G.sm}px 0 0` }}>
        第 {L.n} 關：{L.age}開始，{L.W}×{L.H} 的格子，每題 {L.acMin === L.acMax ? L.acMin : `${L.acMin}～${L.acMax}`} 顆松果。5 歲先從第 1 關開始。
      </p>

      <div className="ws-preview" style={paper} aria-label={`撿松果回家第 ${level} 關的學習單預覽`}>
        <div dangerouslySetInnerHTML={{ __html: sheet.page1 }} />
      </div>

      <div style={actions}>
        <button type="button" onClick={print} style={{ ...S.buy, border: 0, cursor: "pointer", background: WSBlue, color: "#fff" }}>
          印出來
        </button>
        <button type="button" onClick={() => setSeed(newSeed())} style={secondary}>
          換一張新的
        </button>
        <Share path={`/worksheets/acorn?l=${level}&s=${seed}`} text={`撿松果回家（第 ${level} 關），A4 印了就能寫`} label="傳給朋友" />
      </div>
      <label style={check}>
        <input type="checkbox" checked={withAnswers} onChange={(e) => setWithAnswers(e.target.checked)} style={{ width: 18, height: 18 }} />
        連第 2 頁的提示和答案一起印
      </label>
      <p style={{ ...S.hint, margin: `${G.sm}px 0 0` }}>
        沒有印表機也可以：按「印出來」，選「存成 PDF」，再拿去超商印。
      </p>

      {mounted && createPortal(
        <div className="ws-print" aria-hidden>
          <div className="ws-page" dangerouslySetInnerHTML={{ __html: sheet.page1 }} />
          {withAnswers && <div className="ws-page" dangerouslySetInnerHTML={{ __html: sheet.page2 }} />}
        </div>,
        document.body,
      )}
    </div>
  );
}

/** 孩子這一區的主色：蔚藍（Tim 偏愛的顏色） */
const WSBlue = "#1E88E5";

const lbl: React.CSSProperties = { ...S.lbl, margin: `${G.lg}px 0 ${G.sm}px` };
// 桌機一排六個，手機一排三個（一排六個在手機上「第 1 關」會被擠成三行）
const levels: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: G.sm };
const chip: React.CSSProperties = {
  border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", borderRadius: R.sm,
  padding: `${G.sm}px ${G.xs}px`, fontSize: T.sm, cursor: "pointer", textAlign: "center", lineHeight: 1.5,
};
const chipOn: React.CSSProperties = { borderColor: WSBlue, boxShadow: `0 0 0 1px ${WSBlue}`, background: "#EEF6FD", color: "#10233A" };
const paper: React.CSSProperties = {
  marginTop: G.lg, background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm,
  boxShadow: "var(--sh)", overflow: "hidden",
};
const actions: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: G.md, marginTop: G.lg };
const secondary: React.CSSProperties = {
  padding: "12px 22px", borderRadius: R.pill, border: "1px solid var(--line)", background: "var(--surface)",
  color: "var(--ink)", fontWeight: 700, fontSize: T.md, cursor: "pointer",
};
const check: React.CSSProperties = { display: "flex", alignItems: "center", gap: G.sm, marginTop: G.md, fontSize: T.sm, color: "var(--muted)", cursor: "pointer" };
