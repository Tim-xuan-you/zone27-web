"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Share from "@/components/Share";
import { G, R, S, T } from "@/components/styles";
import { GUESS_MODES, guessLevel, type GuessMode } from "@/lib/worksheets/guess";
import { guessSheetPages } from "@/lib/worksheets/guess-sheet";
import { guessSheetsOf } from "@/lib/worksheets/guess-sheets";
import { SHEET_IMG, guessLevelPdf, guessSheetImg, guessSheetPdf } from "@/lib/worksheets/assets";
import { PRINT_CSS } from "./SheetPrint";

/**
 * 注音猜猜看某一關：挑一張、挑玩法（圈圈看／寫寫看），下載 PDF 或印出來。
 * 跟撿松果回家的 AcornPicker 一樣：固定編號、選哪一張記在 ?n=2，玩法記在 &m=write。
 * 同一張的兩種玩法題目一樣，所以可以先圈、隔天再寫同一張。
 */

const MODE_HINT: Record<GuessMode, string> = {
  circle: "看注音，圈出對的圖。還不太會寫注音的，先玩這個。",
  write: "看圖，自己寫出注音，聲調也要寫。",
};

export default function GuessPicker({ level }: { level: number }) {
  const L = guessLevel(level);
  const sheets = useMemo(() => guessSheetsOf(level), [level]);
  const [n, setN] = useState(1);
  const [mode, setMode] = useState<GuessMode>("circle");
  const [withAnswers, setWithAnswers] = useState(false);
  const [printing, setPrinting] = useState<null | "one" | "all">(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const q = Number(sp.get("n"));
    if (q >= 1 && q <= sheets.length) setN(q);
    if (sp.get("m") === "write") setMode("write");
    setMounted(true);
  }, [sheets.length]);
  useEffect(() => {
    if (!mounted) return;
    const qs = [n === 1 ? "" : `n=${n}`, mode === "write" ? "m=write" : ""].filter(Boolean).join("&");
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [n, mode, mounted]);

  const sheet = sheets[n - 1] ?? sheets[0];
  const toPrint = useMemo(
    () => (printing === null ? [] : (printing === "all" ? sheets : [sheet]).map((s) => guessSheetPages(s))),
    [printing, sheets, sheet],
  );
  const modeName = GUESS_MODES[mode];

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

      <div role="radiogroup" aria-label="玩法" style={modes}>
        {(Object.keys(GUESS_MODES) as GuessMode[]).map((m) => {
          const on = m === mode;
          return (
            <button key={m} type="button" role="radio" aria-checked={on} onClick={() => setMode(m)} style={on ? { ...modeBtn, ...modeOn } : modeBtn}>
              {GUESS_MODES[m]}
            </button>
          );
        })}
      </div>
      <p style={{ ...S.hint, margin: `${G.sm}px 0 ${G.lg}px` }}>{MODE_HINT[mode]}</p>

      <div style={grid} role="radiogroup" aria-label={`第 ${level} 關的 ${sheets.length} 張學習單`}>
        {sheets.map((s) => {
          const on = s.n === sheet.n;
          return (
            <button key={s.id} type="button" role="radio" aria-checked={on} onClick={() => setN(s.n)} style={on ? { ...thumb, ...thumbOn } : thumb}>
              <img
                src={guessSheetImg(s.id, mode)}
                alt={`注音猜猜看第 ${level} 關第 ${s.n} 張（${modeName}）`}
                width={SHEET_IMG.w}
                height={SHEET_IMG.h}
                loading="lazy"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              {/* 縮圖的底是白的（紙），字的顏色不跟深色模式走，不然選中的那張字會看不見 */}
              <span style={{ display: "block", fontSize: T.xs, fontWeight: on ? 700 : 500, color: on ? "#262B31" : "#565E68", padding: `${G.xs}px 0 0` }}>
                第 {s.n} 張
              </span>
            </button>
          );
        })}
      </div>

      <figure style={{ ...paper, margin: `${G.xl}px 0 0` }}>
        <img
          src={guessSheetImg(sheet.id, mode)}
          alt={`注音猜猜看第 ${level} 關第 ${sheet.n} 張，${modeName}：${L.grade}注音學習單，可以下載 PDF 或直接列印`}
          width={SHEET_IMG.w}
          height={SHEET_IMG.h}
          fetchPriority="high"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </figure>

      <div style={actions}>
        <a href={guessSheetPdf(sheet.id, mode)} download={`注音猜猜看_第${level}關第${sheet.n}張_${modeName}.pdf`} style={primary}>下載 PDF</a>
        <button type="button" onClick={() => print("one")} style={secondary}>印這一張</button>
      </div>
      <p style={{ ...S.hint, margin: `${G.sm}px 0 0` }}>
        手機上：按「下載 PDF」，傳到 LINE 或拿去超商印。電腦上：按「印這一張」。
      </p>

      <div style={{ ...S.box, marginTop: G.lg }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: T.md }}>第 {level} 關 {sheets.length} 張一次拿（{modeName}）</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: G.md, marginTop: G.md }}>
          <a href={guessLevelPdf(level, mode)} download={`注音猜猜看_第${level}關_${modeName}_${sheets.length}張.pdf`} style={secondaryLink}>下載 {sheets.length} 張 PDF</a>
          <button type="button" onClick={() => print("all")} style={secondary}>{sheets.length} 張一起印</button>
        </div>
        <label style={check}>
          <input type="checkbox" checked={withAnswers} onChange={(e) => setWithAnswers(e.target.checked)} style={{ width: 18, height: 18 }} />
          用「印」的時候，每一張後面附上答案（給大人看的那一頁）
        </label>
      </div>

      <div style={{ marginTop: G.md }}>
        <Share
          path={`/worksheets/zhuyin/${level}${sheet.n === 1 && mode === "circle" ? "" : `?${[sheet.n === 1 ? "" : `n=${sheet.n}`, mode === "write" ? "m=write" : ""].filter(Boolean).join("&")}`}`}
          text={`注音猜猜看（第 ${level} 關第 ${sheet.n} 張，${modeName}），A4 PDF 免費下載`}
          label="傳給朋友"
        />
      </div>

      {mounted && printing && createPortal(
        <div className="ws-print" aria-hidden>
          {toPrint.map((p, i) => (
            <div key={i}>
              <div className="ws-page" dangerouslySetInnerHTML={{ __html: p[mode] }} />
              {withAnswers && <div className="ws-page" dangerouslySetInnerHTML={{ __html: p.answer }} />}
            </div>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
}

const modes: React.CSSProperties = { display: "inline-flex", gap: 4, padding: 4, borderRadius: R.pill, background: "var(--sunken)" };
const modeBtn: React.CSSProperties = {
  padding: "8px 20px", borderRadius: R.pill, border: "1px solid transparent", background: "transparent",
  color: "var(--muted)", fontWeight: 700, fontSize: T.md, cursor: "pointer",
};
// 選中的時候整個 border 重給，不要只給 borderColor（換回沒選的時候顏色會一起被清掉）
const modeOn: React.CSSProperties = { border: "1px solid var(--accent)", background: "var(--surface)", color: "var(--accent)" };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: G.md };
const thumb: React.CSSProperties = {
  border: "1px solid var(--line)", background: "#fff", borderRadius: R.sm, padding: G.xs, cursor: "pointer", textAlign: "center",
};
const thumbOn: React.CSSProperties = { border: "1px solid var(--accent)", boxShadow: "0 0 0 2px var(--accent)" };
const paper: React.CSSProperties = {
  background: "#fff", border: "1px solid var(--line)", borderRadius: R.sm, boxShadow: "var(--sh)", overflow: "hidden",
};
const actions: React.CSSProperties = { display: "flex", flexWrap: "wrap", alignItems: "center", gap: G.md, marginTop: G.lg };
const primary: React.CSSProperties = { ...S.buy, background: "var(--pop)", color: "var(--pop-ink)" };
const secondary: React.CSSProperties = {
  padding: "12px 22px", borderRadius: R.pill, border: "1px solid var(--line)", background: "var(--surface)",
  color: "var(--ink)", fontWeight: 700, fontSize: T.md, cursor: "pointer",
};
const secondaryLink: React.CSSProperties = { ...secondary, display: "inline-block", textDecoration: "none" };
const check: React.CSSProperties = { display: "flex", alignItems: "center", gap: G.sm, marginTop: G.md, fontSize: T.sm, color: "var(--muted)", cursor: "pointer" };
