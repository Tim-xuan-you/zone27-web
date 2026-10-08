"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { G, R, S, T } from "@/components/styles";
import { WS, mazeSvg } from "@/lib/worksheets/draw";
import { numberEquation, numberLevel, type NumberPuzzle } from "@/lib/worksheets/number";
import { numberSheetById } from "@/lib/worksheets/number-sheets";

/**
 * 數字松果的答案（學習單右下角 QR code 掃進來的）。
 * 跟撿松果回家的提示一樣，一次只開一段：先看要撿哪幾顆（路線讓孩子自己找），還是不會再看路線。
 */
function Puzzle({ p, k }: { p: NumberPuzzle; k: number }) {
  const [step, setStep] = useState(0);
  const m = mazeSvg(p, 10, { path: step >= 2 ? p.answer : undefined, values: p.values, target: p.target, side: 1.05, icon: 0.9 });
  return (
    <div style={{ ...S.box, marginTop: k ? G.lg : 0 }}>
      <p style={{ margin: 0, fontWeight: 700, fontSize: T.md }}>第 {k + 1} 題：房子上是 {p.target}</p>
      <div style={{ background: "#fff", borderRadius: R.sm, marginTop: G.sm, padding: G.xs }}>
        <svg viewBox={`0 0 ${m.w} ${m.h}`} style={{ width: "100%", height: "auto", display: "block" }} dangerouslySetInnerHTML={{ __html: m.svg }} />
      </div>
      {step >= 1 && (
        <p style={{ margin: `${G.md}px 0 0`, fontSize: T.lg, fontWeight: 800, color: WS.emerald }}>{numberEquation(p)}</p>
      )}
      {step < 2 && (
        <button type="button" onClick={() => setStep(step + 1)} style={btn}>
          {step === 0 ? "先看要撿哪幾顆" : "看路線"}
        </button>
      )}
    </div>
  );
}

export default function NumberAnswer() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => setId(new URLSearchParams(window.location.search).get("id") ?? ""), []);
  if (id === null) return null;
  const sheet = numberSheetById(id);
  if (!sheet) {
    return (
      <p style={{ fontSize: T.md, lineHeight: 1.9 }}>
        找不到這一張的答案。<Link href="/worksheets/number" style={{ color: "var(--accent)", fontWeight: 700 }}>回到數字松果 →</Link>
      </p>
    );
  }
  const L = numberLevel(sheet.level);
  return (
    <div>
      <p style={{ margin: `0 0 ${G.lg}px`, fontSize: T.md, color: "var(--muted)", lineHeight: 1.9 }}>
        第 {sheet.level} 關「{L.name}」第 {sheet.n} 張。一次只開一段：先看要撿哪幾顆，讓孩子自己找路；還是不會，再看路線。
      </p>
      {sheet.puzzles.map((p, k) => <Puzzle key={k} p={p} k={k} />)}
      <p style={{ marginTop: G.xl, fontSize: T.md }}>
        <Link href={`/worksheets/number/${sheet.level}${sheet.n === 1 ? "" : `?n=${sheet.n}`}`} style={{ color: "var(--accent)", fontWeight: 700 }}>← 回到這一張</Link>
      </p>
    </div>
  );
}

const btn: React.CSSProperties = {
  marginTop: G.md, padding: "10px 20px", borderRadius: R.pill, border: "1px solid var(--accent)", background: "var(--surface)",
  color: "var(--accent)", fontWeight: 700, fontSize: T.md, cursor: "pointer",
};
