"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Share from "@/components/Share";
import { G, R, S, T } from "@/components/styles";
import { ACORN_LEVELS, acornLevel } from "@/lib/worksheets/acorn";
import { acornSheetPages } from "@/lib/worksheets/acorn-sheet";
import { ACORN_SHEETS, acornSheetById, acornSheetsOf } from "@/lib/worksheets/acorn-sheets";

/**
 * 撿松果回家：選關卡、挑一張、印出來。
 *
 * 2026-10-01 Tim：「我想要大家可以印自己想要的！不要隨機耶！」
 * 所以這裡沒有「換一張新的」。每一關固定幾張，都有編號（第 3 關第 2 張），
 * 家長挑哪一張就印哪一張，老師說「今天印第 3 關第 2 張」大家印到的都一樣。
 *
 * 列印：整張是 A4 的 SVG，印的那一份放在 <body> 最外層，列印時只留它（頁首、按鈕都不印）。
 * 那一份平常藏在畫面外（不是 display:none），字型才會先下載好。
 */

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
.ws-svg svg { width: 100%; height: auto; display: block; }
`;

const FIRST = ACORN_SHEETS[0].id;

export default function AcornPicker() {
  const [id, setId] = useState(FIRST);
  const [all, setAll] = useState(false);
  const [withAnswers, setWithAnswers] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 網址上的 ?id=acorn-3-2（分享出去的、從提示頁回來的）；舊的 ?l=3 也接
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const byId = acornSheetById(q.get("id") ?? "");
    const byLevel = q.get("l") ? acornSheetsOf(acornLevel(Number(q.get("l"))).n)[0] : undefined;
    setId((byId ?? byLevel)?.id ?? FIRST);
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) window.history.replaceState(null, "", `?id=${id}`);
  }, [id, mounted]);

  const sheet = acornSheetById(id) ?? ACORN_SHEETS[0];
  const level = sheet.level;
  const L = acornLevel(level);
  const sheets = useMemo(() => acornSheetsOf(level), [level]);
  const pages = useMemo(() => acornSheetPages(sheet), [sheet]);
  const thumbs = useMemo(() => sheets.map((s) => acornSheetPages(s).page1), [sheets]);
  const toPrint = useMemo(
    () => (all ? sheets : [sheet]).map((s) => acornSheetPages(s)),
    [all, sheets, sheet],
  );

  async function print(everyOne: boolean) {
    setAll(everyOne);
    // 等畫面把要印的那幾張放好、字型載好，再叫出列印
    await new Promise((r) => setTimeout(r, 60));
    try { await document.fonts?.ready; } catch {}
    window.print();
  }

  return (
    <div>
      <style>{PRINT_CSS}</style>

      <p style={lbl}>1. 選關卡</p>
      <div style={levels} role="radiogroup" aria-label="關卡">
        {ACORN_LEVELS.map((x) => {
          const on = x.n === level;
          return (
            <button
              key={x.n}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setId(acornSheetsOf(x.n)[0].id)}
              style={on ? { ...chip, ...chipOn } : chip}
            >
              <span style={{ display: "block", fontWeight: 700, whiteSpace: "nowrap" }}>第 {x.n} 關</span>
              <span style={{ display: "block", fontSize: T.xs, color: on ? "var(--pop)" : "var(--faint)", letterSpacing: ".1em" }}>
                {"★".repeat(x.stars)}
              </span>
            </button>
          );
        })}
      </div>
      <p style={{ ...S.hint, margin: `${G.sm}px 0 0` }}>
        第 {L.n} 關：{L.age}開始，{L.W}×{L.H} 的格子。第一次寫，先從第 1 關開始。
      </p>

      <p style={lbl}>2. 挑一張</p>
      <div style={grid} role="radiogroup" aria-label={`第 ${level} 關的學習單`}>
        {sheets.map((s, i) => {
          const on = s.id === sheet.id;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={`第 ${s.level} 關第 ${s.n} 張`}
              onClick={() => setId(s.id)}
              style={on ? { ...thumb, ...thumbOn } : thumb}
            >
              <span className="ws-svg" style={{ display: "block" }} dangerouslySetInnerHTML={{ __html: thumbs[i] }} />
              <span style={{ display: "block", fontSize: T.xs, fontWeight: on ? 700 : 500, color: on ? "var(--ink)" : "var(--muted)", padding: `${G.xs}px 0` }}>
                第 {s.n} 張
              </span>
            </button>
          );
        })}
      </div>

      <div className="ws-svg" style={paper} aria-label={`第 ${level} 關第 ${sheet.n} 張的預覽`}>
        <div dangerouslySetInnerHTML={{ __html: pages.page1 }} />
      </div>

      <div style={actions}>
        <button type="button" onClick={() => print(false)} style={printBtn}>印這一張</button>
        <button type="button" onClick={() => print(true)} style={secondary}>第 {level} 關 {sheets.length} 張全部印</button>
      </div>
      <label style={check}>
        <input type="checkbox" checked={withAnswers} onChange={(e) => setWithAnswers(e.target.checked)} style={{ width: 18, height: 18 }} />
        每一張後面都附上提示和答案（給大人看的那一頁）
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: G.md, marginTop: G.md }}>
        <Share path={`/worksheets/acorn?id=${sheet.id}`} text={`撿松果回家（第 ${level} 關第 ${sheet.n} 張），A4 印了就能寫`} label="傳給朋友" />
        <span style={{ fontSize: T.sm, color: "var(--faint)" }}>沒有印表機：按「印這一張」，選「存成 PDF」，再拿去超商印。</span>
      </div>

      {mounted && createPortal(
        <div className="ws-print" aria-hidden>
          {toPrint.map((p, i) => (
            <div key={i}>
              <div className="ws-page" dangerouslySetInnerHTML={{ __html: p.page1 }} />
              {withAnswers && <div className="ws-page" dangerouslySetInnerHTML={{ __html: p.page2 }} />}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { ...S.lbl, margin: `${G.xl}px 0 ${G.sm}px` };
// 桌機一排六個，手機一排三個
const levels: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(92px, 1fr))", gap: G.sm };
const chip: React.CSSProperties = {
  border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)", borderRadius: R.sm,
  padding: `${G.sm}px ${G.xs}px`, fontSize: T.sm, cursor: "pointer", textAlign: "center", lineHeight: 1.5,
};
// 選中的時候整個 border 重給，不要只給 borderColor：React 換回沒選的樣式時會把 borderColor 清掉，連 border 的顏色一起不見（變成文字的深色）
const chipOn: React.CSSProperties = { border: "1px solid var(--accent)", boxShadow: "0 0 0 1px var(--accent)", background: "var(--accent-soft)" };
// 縮圖：桌機一排五張，手機一排三張
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: G.md };
const thumb: React.CSSProperties = {
  border: "1px solid var(--line)", background: "#fff", borderRadius: R.sm, padding: G.xs, cursor: "pointer", textAlign: "center",
};
const thumbOn: React.CSSProperties = { border: "1px solid var(--accent)", boxShadow: "0 0 0 2px var(--accent)" };
const paper: React.CSSProperties = {
  marginTop: G.xl, background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, boxShadow: "var(--sh)", overflow: "hidden",
};
const actions: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: G.md, marginTop: G.lg };
const printBtn: React.CSSProperties = { ...S.buy, border: 0, cursor: "pointer", background: "var(--pop)", color: "var(--pop-ink)" };
const secondary: React.CSSProperties = {
  padding: "12px 22px", borderRadius: R.pill, border: "1px solid var(--line)", background: "var(--surface)",
  color: "var(--ink)", fontWeight: 700, fontSize: T.md, cursor: "pointer",
};
const check: React.CSSProperties = { display: "flex", alignItems: "center", gap: G.sm, marginTop: G.md, fontSize: T.sm, color: "var(--muted)", cursor: "pointer" };
