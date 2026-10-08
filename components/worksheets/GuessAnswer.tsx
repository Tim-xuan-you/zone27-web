"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { G, R, S, T } from "@/components/styles";
import { GUESS_MODES, guessLevel } from "@/lib/worksheets/guess";
import { guessSheetById } from "@/lib/worksheets/guess-sheets";
import { iconSvg } from "@/lib/worksheets/icons";
import { wordByZh } from "@/lib/worksheets/words";

/**
 * 注音猜猜看的答案（學習單右下角 QR code 掃進來的）。大人在手機上看，所以不用 A4 那一頁，
 * 一題一列：圖、國字、注音、圈圈看圈第幾張。
 */
export default function GuessAnswer() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => setId(new URLSearchParams(window.location.search).get("id") ?? ""), []);
  if (id === null) return null;

  const sheet = guessSheetById(id);
  if (!sheet) {
    return (
      <p style={{ fontSize: T.md, lineHeight: 1.9 }}>
        找不到這一張的答案。<Link href="/worksheets/zhuyin" style={{ color: "var(--accent)", fontWeight: 700 }}>回到注音猜猜看 →</Link>
      </p>
    );
  }
  const L = guessLevel(sheet.level);
  return (
    <div>
      <p style={{ margin: `0 0 ${G.lg}px`, fontSize: T.md, color: "var(--muted)", lineHeight: 1.9 }}>
        第 {sheet.level} 關「{L.name}」第 {sheet.n} 張。{GUESS_MODES.circle}：最右邊寫的是圈第幾張。{GUESS_MODES.write}：照注音對，聲調、輕聲的點都要寫對。
      </p>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: G.sm }}>
        {sheet.questions.map((q, i) => {
          const w = wordByZh(q.zh);
          return (
            <li key={i} style={row}>
              <span style={num}>{i + 1}</span>
              <svg viewBox="0 0 100 100" width="56" height="56" aria-hidden style={{ flex: "none", background: "#fff", borderRadius: R.sm }} dangerouslySetInnerHTML={{ __html: iconSvg(w.icon, 50, 50, 84) }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "block", fontFamily: "var(--font-kai), serif", fontSize: 26, lineHeight: 1.3 }}>{w.zh}</span>
                <span style={{ display: "block", fontSize: T.lg, letterSpacing: ".08em" }}>{w.zy.join("　")}</span>
              </span>
              <span style={{ fontSize: T.sm, color: "var(--muted)", textAlign: "right", flex: "none" }}>圈第 {q.answer + 1} 張</span>
            </li>
          );
        })}
      </ol>
      <p style={{ marginTop: G.xl, fontSize: T.md }}>
        <Link href={`/worksheets/zhuyin/${sheet.level}${sheet.n === 1 ? "" : `?n=${sheet.n}`}`} style={{ color: "var(--accent)", fontWeight: 700 }}>← 回到這一張</Link>
      </p>
    </div>
  );
}

const row: React.CSSProperties = { ...S.box, display: "flex", alignItems: "center", gap: G.md, padding: `${G.sm}px ${G.md}px` };
const num: React.CSSProperties = { width: 26, height: 26, flex: "none", borderRadius: R.sm, background: "var(--accent)", color: "var(--accent-ink)", fontWeight: 800, display: "grid", placeItems: "center", fontSize: T.sm };
