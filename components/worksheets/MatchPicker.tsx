"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Share from "@/components/Share";
import { G, R, S, T as TY } from "@/components/styles";
import { matchTheme, type MatchThemeId } from "@/lib/worksheets/match";
import { matchSheetPages } from "@/lib/worksheets/match-sheet";
import { matchSheetsOf } from "@/lib/worksheets/match-sheets";
import { SHEET_IMG, matchThemePdf, sheetImg, sheetPdf } from "@/lib/worksheets/assets";
import { PRINT_CSS } from "./SheetPrint";

/**
 * 連連看某一個主題：挑一張、印出來或下載 PDF。跟 AcornPicker 一樣，選哪一張記在 ?n=2。
 * 印的時候可以每一張後面附答案（線畫好了、附小知識的那一頁）。
 */

export default function MatchPicker({ theme }: { theme: MatchThemeId }) {
  const T = matchTheme(theme);
  const sheets = useMemo(() => matchSheetsOf(theme), [theme]);
  const [n, setN] = useState(1);
  const [withAnswers, setWithAnswers] = useState(false);
  const [printing, setPrinting] = useState<null | "one" | "all">(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const q = Number(new URLSearchParams(window.location.search).get("n"));
    if (q >= 1 && q <= sheets.length) setN(q);
    setMounted(true);
  }, [sheets.length]);
  useEffect(() => {
    if (mounted) window.history.replaceState(null, "", n === 1 ? window.location.pathname : `?n=${n}`);
  }, [n, mounted]);

  const sheet = sheets[n - 1] ?? sheets[0];
  const toPrint = useMemo(
    () => (printing === null ? [] : (printing === "all" ? sheets : [sheet]).map((s) => matchSheetPages(s))),
    [printing, sheets, sheet],
  );

  async function print(which: "one" | "all") {
    setPrinting(which);
    await new Promise((r) => setTimeout(r, 80));
    try { await document.fonts?.ready; } catch {}
    window.print();
    setPrinting(null);
  }

  return (
    <div>
      <style>{PRINT_CSS}</style>

      <div style={grid} role="radiogroup" aria-label={`${T.name}的 ${sheets.length} 張學習單`}>
        {sheets.map((s) => {
          const on = s.n === sheet.n;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setN(s.n)}
              style={on ? { ...thumb, ...thumbOn } : thumb}
            >
              <img
                src={sheetImg(s.id)}
                alt={`連連看・${T.name}第 ${s.n} 張（${s.left.length} 組）`}
                width={SHEET_IMG.w}
                height={SHEET_IMG.h}
                loading="lazy"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              {/* 縮圖的底是白的（紙），字的顏色不跟深色模式走，不然選中的那張字會看不見 */}
              <span style={{ display: "block", fontSize: TY.xs, fontWeight: on ? 700 : 500, color: on ? "#262B31" : "#565E68", padding: `${G.xs}px 0 0` }}>
                第 {s.n} 張
              </span>
            </button>
          );
        })}
      </div>

      <figure style={{ ...paper, margin: `${G.xl}px 0 0` }}>
        <img
          src={sheetImg(sheet.id)}
          alt={`連連看・${T.name}第 ${sheet.n} 張：大班、小一連連看學習單，可以下載 PDF 或直接列印`}
          width={SHEET_IMG.w}
          height={SHEET_IMG.h}
          fetchPriority="high"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </figure>

      <div style={actions}>
        <a href={sheetPdf(sheet.id)} download={`連連看_${T.name}_第${sheet.n}張.pdf`} style={primary}>下載 PDF</a>
        <button type="button" onClick={() => print("one")} style={secondary}>印這一張</button>
      </div>
      <p style={{ ...S.hint, margin: `${G.sm}px 0 0` }}>
        手機上：按「下載 PDF」，傳到 LINE 或拿去超商印。電腦上：按「印這一張」。
      </p>

      <div style={{ ...S.box, marginTop: G.lg }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: TY.md }}>{T.name} {sheets.length} 張一次拿</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: G.md, marginTop: G.md }}>
          <a href={matchThemePdf(theme)} download={`連連看_${T.name}_${sheets.length}張.pdf`} style={secondaryLink}>下載 {sheets.length} 張 PDF</a>
          <button type="button" onClick={() => print("all")} style={secondary}>{sheets.length} 張一起印</button>
        </div>
        <label style={check}>
          <input type="checkbox" checked={withAnswers} onChange={(e) => setWithAnswers(e.target.checked)} style={{ width: 18, height: 18 }} />
          用「印」的時候，每一張後面附上答案（線畫好了，還有每一組的小知識）
        </label>
      </div>

      <div style={{ marginTop: G.md }}>
        <Share path={`/worksheets/match/${theme}${sheet.n === 1 ? "" : `?n=${sheet.n}`}`} text={`連連看・${T.name}（第 ${sheet.n} 張），A4 PDF 免費下載`} label="傳給朋友" />
      </div>

      {mounted && printing && createPortal(
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

// 縮圖：桌機一排五張，手機一排三張
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: G.md };
const thumb: React.CSSProperties = {
  border: "1px solid var(--line)", background: "#fff", borderRadius: R.sm, padding: G.xs, cursor: "pointer", textAlign: "center",
};
// 選中的時候整個 border 重給，不要只給 borderColor（換回沒選的時候顏色會一起被清掉）
const thumbOn: React.CSSProperties = { border: "1px solid var(--accent)", boxShadow: "0 0 0 2px var(--accent)" };
const paper: React.CSSProperties = {
  background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, boxShadow: "var(--sh)", overflow: "hidden",
};
const actions: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: G.md, marginTop: G.lg };
const primary: React.CSSProperties = { ...S.buy, background: "var(--pop)", color: "var(--pop-ink)" };
const secondary: React.CSSProperties = {
  padding: "12px 22px", borderRadius: R.pill, border: "1px solid var(--line)", background: "var(--surface)",
  color: "var(--ink)", fontWeight: 700, fontSize: TY.md, cursor: "pointer",
};
const secondaryLink: React.CSSProperties = { ...secondary, display: "inline-block", textDecoration: "none" };
const check: React.CSSProperties = { display: "flex", alignItems: "center", gap: G.sm, marginTop: G.md, fontSize: TY.sm, color: "var(--muted)", cursor: "pointer" };
