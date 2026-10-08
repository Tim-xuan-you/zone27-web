"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { G, R, S, T } from "@/components/styles";
import { matchPair, matchTheme } from "@/lib/worksheets/match";
import { matchSheetById } from "@/lib/worksheets/match-sheets";
import { iconSvg } from "@/lib/worksheets/icons";

/**
 * 連連看的答案（學習單右下角 QR code 掃進來的）。大人在手機上看：一組一列，左邊的圖、右邊的圖、一句小知識。
 */
const icon = (name: string) => (
  <svg viewBox="0 0 100 100" width="52" height="52" aria-hidden style={{ flex: "none", background: "#fff", borderRadius: R.sm }} dangerouslySetInnerHTML={{ __html: iconSvg(name, 50, 50, 84) }} />
);

export default function MatchAnswer() {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => setId(new URLSearchParams(window.location.search).get("id") ?? ""), []);
  if (id === null) return null;

  const sheet = matchSheetById(id);
  if (!sheet) {
    return (
      <p style={{ fontSize: T.md, lineHeight: 1.9 }}>
        找不到這一張的答案。<Link href="/worksheets/match" style={{ color: "var(--accent)", fontWeight: 700 }}>回到連連看 →</Link>
      </p>
    );
  }
  const Th = matchTheme(sheet.theme);
  return (
    <div>
      <p style={{ margin: `0 0 ${G.lg}px`, fontSize: T.md, color: "var(--muted)", lineHeight: 1.9 }}>
        {Th.name}第 {sheet.n} 張。每一組下面有一句小知識，可以邊對答案邊講給孩子聽。
      </p>
      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: G.sm }}>
        {sheet.left.map((pid) => {
          const p = matchPair(sheet.theme, pid);
          return (
            <li key={pid} style={S.box}>
              <div style={{ display: "flex", alignItems: "center", gap: G.sm }}>
                {icon(p.left.icon)}
                <span style={{ fontWeight: 700, fontSize: T.lg }}>{p.left.name}</span>
                <span aria-hidden style={{ color: "var(--faint)", padding: `0 ${G.xs}px` }}>→</span>
                {icon(p.right.icon)}
                <span style={{ fontWeight: 700, fontSize: T.lg }}>{p.right.name}</span>
              </div>
              <p style={{ margin: `${G.sm}px 0 0`, fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>
                {p.fact}{p.source ? `（資料：${p.source}）` : ""}
              </p>
            </li>
          );
        })}
      </ol>
      <p style={{ marginTop: G.xl, fontSize: T.md }}>
        <Link href={`/worksheets/match/${sheet.theme}${sheet.n === 1 ? "" : `?n=${sheet.n}`}`} style={{ color: "var(--accent)", fontWeight: 700 }}>← 回到這一張</Link>
      </p>
    </div>
  );
}
