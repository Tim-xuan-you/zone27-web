"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { G, R, S, T } from "@/components/styles";
import { acornHints, acornLevel, sheetPuzzles, type AcornPuzzle } from "@/lib/worksheets/acorn";
import { acornSheetById, acornSheetsOf } from "@/lib/worksheets/acorn-sheets";
import { WS, mazeSvg } from "@/lib/worksheets/draw";

/**
 * 掃學習單右下角的 QR code 會到這裡：同一張的兩題，提示一段一段點開。
 *
 * 2026-10-01 Tim 家的孩子：三個月前很多題不會，卡住就不想寫了。
 * 所以提示不一次給完：先給前三步，再給一半，再給到只剩最後三步，最後才是答案。
 * 每看一段，就把手機拿開，讓孩子接著自己畫。
 */

const STEPS = ["先看前三步", "再走到一半", "只剩最後三步", "看答案"];

function Puzzle({ p, k }: { p: AcornPuzzle; k: number }) {
  const [step, setStep] = useState(0);
  const hints = acornHints(p);
  const path = step === 0 ? undefined : step === 4 ? p.answer : hints[step - 1];
  const m = mazeSvg(p, 10, { path, color: step === 4 ? WS.emerald : WS.orange, side: 1.15 });
  return (
    <section style={{ ...S.box, marginTop: G.lg }}>
      <p style={{ margin: 0, fontWeight: 700, fontSize: T.lg }}>
        <span style={badge}>{k}</span>第 {k} 題・{p.acorns.length} 顆松果
      </p>
      <div style={{ background: "#fff", borderRadius: R.sm, marginTop: G.md, padding: G.xs }}>
        <svg viewBox={`0 0 ${m.w} ${m.h}`} style={{ width: "100%", height: "auto", display: "block" }} dangerouslySetInnerHTML={{ __html: m.svg }} />
      </div>
      <p style={{ ...S.hint, margin: `${G.sm}px 0 0` }}>
        {step === 0 && "還沒給提示。卡住了再點下面，一次一段。"}
        {step > 0 && step < 4 && `提示 ${step}：${STEPS[step - 1]}。看完把手機拿開，讓孩子接著畫。`}
        {step === 4 && "這是答案。可以跟孩子一起數：松果是不是每一顆都撿到了？"}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: G.sm, marginTop: G.md }}>
        {step < 4 && (
          <button type="button" onClick={() => setStep(step + 1)} style={step === 3 ? ghost : main}>
            {step < 3 ? `提示 ${step + 1}：${STEPS[step]}` : STEPS[3]}
          </button>
        )}
        {step > 0 && (
          <button type="button" onClick={() => setStep(0)} style={ghost}>藏起來</button>
        )}
      </div>
    </section>
  );
}

type Q = { level: number; n?: number; puzzles: [AcornPuzzle, AcornPuzzle]; back: string } | null | "bad";

export default function AcornHints() {
  const [q, setQ] = useState<Q>(null);
  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    const sheet = acornSheetById(u.get("id") ?? "");
    if (sheet) {
      setQ({ level: sheet.level, n: sheet.n, puzzles: sheet.puzzles, back: `/worksheets/acorn/${sheet.level}${sheet.n === 1 ? "" : `?n=${sheet.n}`}` });
      return;
    }
    // 2026-10-01 改成固定編號以前印的（?l=關&s=號碼），只有 Tim 家印過，留著讓舊的 QR code 還掃得到
    const level = acornLevel(Number(u.get("l")) || 1).n;
    const seed = Number(u.get("s"));
    if (Number.isInteger(seed) && seed >= 100000 && seed <= 999999) {
      setQ({ level, puzzles: sheetPuzzles(level, seed), back: `/worksheets/acorn/${level}` });
      return;
    }
    setQ("bad");
  }, []);

  if (q === null) return <p style={S.hint}>題目載入中...</p>;
  if (q === "bad") {
    return (
      <p style={{ fontSize: T.md, lineHeight: 1.9 }}>
        這個網址少了學習單的編號。請掃學習單右下角的 QR code，或是<Link href="/worksheets/acorn" style={{ color: "var(--accent)" }}>回去挑一張</Link>。
      </p>
    );
  }
  const next = acornSheetsOf(Math.min(q.level + 1, 6))[0];
  return (
    <div>
      <p style={{ color: "var(--muted)", fontSize: T.md, lineHeight: 1.9, margin: 0 }}>
        第 {q.level} 關{q.n ? `第 ${q.n} 張` : ""}。提示一次只開一段，看完把手機拿開，讓孩子接著畫。
      </p>
      {q.puzzles.map((p, i) => <Puzzle key={i} p={p} k={i + 1} />)}
      <p style={{ marginTop: G.xl, fontSize: T.md, lineHeight: 2 }}>
        <Link href={q.back} style={link}>回到這一張</Link>
        {q.level < 6 && next && (
          <>
            <span style={{ color: "var(--faint)", margin: `0 ${G.sm}px` }}>·</span>
            <Link href={`/worksheets/acorn/${next.level}`} style={link}>寫得很順？試第 {q.level + 1} 關</Link>
          </>
        )}
      </p>
    </div>
  );
}

const badge: React.CSSProperties = {
  display: "inline-grid", placeItems: "center", width: 26, height: 26, borderRadius: R.sm, marginRight: G.sm,
  background: WS.azure, color: "#fff", fontSize: T.sm, fontWeight: 800,
};
const main: React.CSSProperties = {
  border: 0, borderRadius: R.pill, background: WS.orange, color: "#fff", fontWeight: 700, fontSize: T.md,
  padding: "12px 22px", cursor: "pointer",
};
const ghost: React.CSSProperties = {
  border: "1px solid var(--line)", borderRadius: R.pill, background: "var(--surface)", color: "var(--ink)",
  fontWeight: 700, fontSize: T.md, padding: "12px 22px", cursor: "pointer",
};
const link: React.CSSProperties = { color: "var(--accent)", fontWeight: 700 };
