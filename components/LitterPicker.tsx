"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * 貓砂的「先刪掉不適合的」。
 *
 * 飼料問的是牠能不能吃，貓砂問的是你家的條件：馬桶沖不沖得下去、家裡有沒有人怕粉塵、
 * 貓吃不吃得下香味、預算多少。所以這裡不是搜尋框，是四個開關。
 *
 * 2026-09-19：原本這一頁只有一張清單，跟全站「先刪再選」的主張對不起來。
 * 刪掉幾款、為什麼刪，都寫出來 —— 看得到被刪的理由，才信得過留下來的。
 */

export interface LitterRow {
  id: string;
  brand: string;
  name: string;
  materialZh: string;
  flush: "limited" | "no";
  flushZh: string;
  flushFg: string;
  flushBg: string;
  dust?: "low" | "medium" | "high";
  scented?: boolean;
  clumping: boolean;
  monthly: number | null;
  buyable: boolean;
}

type Key = "flush" | "dust" | "unscented";

const RULES: { key: Key; label: string; cut: (r: LitterRow) => boolean; why: string }[] = [
  { key: "flush", label: "要能沖馬桶", cut: (r) => r.flush === "no", why: "遇水不會散開，沖下去會卡在管線裡" },
  { key: "dust", label: "家裡有人怕粉塵", cut: (r) => r.dust === "high" || r.dust === "medium", why: "粉塵不是最低的那一級" },
  { key: "unscented", label: "不要香味", cut: (r) => r.scented === true, why: "有加香精，貓不一定買單" },
];

export default function LitterPicker({ rows }: { rows: LitterRow[] }) {
  const [on, setOn] = useState<Key[]>([]);
  const active = RULES.filter((r) => on.includes(r.key));

  const cut: { row: LitterRow; why: string }[] = [];
  const kept = rows.filter((r) => {
    const hit = active.find((rule) => rule.cut(r));
    if (hit) { cut.push({ row: r, why: hit.why }); return false; }
    return true;
  });

  return (
    <section style={{ marginTop: 30 }}>
      <p style={lbl}>你家的情況</p>
      <p style={{ margin: "-4px 0 12px", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
        點一下就好，可以多選。不符合的我們刪掉，順便告訴你為什麼刪。
      </p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {RULES.map((r) => {
          const isOn = on.includes(r.key);
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => setOn(isOn ? on.filter((k) => k !== r.key) : [...on, r.key])}
              aria-pressed={isOn}
              style={isOn ? { ...chip, ...chipOn } : chip}
            >
              {isOn ? "✓ " : ""}{r.label}
            </button>
          );
        })}
      </div>

      {active.length > 0 && (
        <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
          刪掉 {cut.length} 款，剩下 <b style={{ color: "var(--ink)" }}>{kept.filter((r) => r.buyable).length} 款可以買</b>。
          {kept.length === 0 && " 條件放寬一點吧，這幾個條件湊在一起，我們讀過的都不符合。"}
        </p>
      )}

      {kept.filter((r) => r.buyable).map((r) => (
        <Link key={r.id} href={`/cat-litter/p/${r.id}`} style={row}>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{r.brand}</span>
            <span style={{ display: "block", fontWeight: 700, lineHeight: 1.5 }}>{r.name}</span>
            <span style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 6 }}>
              <span style={{ fontSize: 12.5, color: r.flushFg, background: r.flushBg, borderRadius: 8, padding: "2px 8px" }}>{r.flushZh}</span>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.materialZh}</span>
              {r.dust && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>粉塵{{ low: "少", medium: "中", high: "多" }[r.dust]}</span>}
              {!r.clumping && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>不結團</span>}
            </span>
          </span>
          <span className="mono" style={{ whiteSpace: "nowrap", fontSize: 14, textAlign: "right" }}>
            {r.monthly !== null ? (
              <>
                <b>${r.monthly.toLocaleString()}</b>
                <span style={{ color: "var(--faint)", fontSize: 12.5 }}>／月</span>
              </>
            ) : (
              <span style={{ color: "var(--faint)", fontSize: 12.5 }}>還沒有連結</span>
            )}
            <span aria-hidden style={{ color: "var(--faint)", marginLeft: 8 }}>›</span>
          </span>
        </Link>
      ))}

      {kept.some((r) => !r.buyable) && (
        <details style={cutBox}>
          <summary style={cutSummary}>
            還有 {kept.filter((r) => !r.buyable).length} 款符合，但我們還沒有購買連結
          </summary>
          <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
            材質、能不能沖馬桶都查得到，只是還沒補到連結，所以不放。
          </p>
          {kept.filter((r) => !r.buyable).map((r) => (
            <Link key={r.id} href={`/cat-litter/p/${r.id}`} style={row}>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{r.brand}</span>
                <span style={{ display: "block", fontWeight: 700, lineHeight: 1.5 }}>{r.name}</span>
                <span style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 6 }}>
                  <span style={{ fontSize: 12.5, color: r.flushFg, background: r.flushBg, borderRadius: 8, padding: "2px 8px" }}>{r.flushZh}</span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.materialZh}</span>
                </span>
              </span>
              <span aria-hidden style={{ color: "var(--faint)" }}>›</span>
            </Link>
          ))}
        </details>
      )}

      {cut.length > 0 && (
        <details style={cutBox}>
          <summary style={cutSummary}>被刪掉的 {cut.length} 款，還有為什麼</summary>
          {cut.map(({ row: r, why }) => (
            <p key={r.id} style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.8 }}>
              <b>{r.brand} {r.name}</b>
              <span style={{ display: "block", color: "var(--cut)" }}>{why}</span>
            </p>
          ))}
        </details>
      )}
    </section>
  );
}

const lbl: React.CSSProperties = {
  margin: "0 0 10px", fontSize: 12.5, fontWeight: 700, color: "var(--muted)", letterSpacing: ".06em",
};
const chip: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", font: "inherit", fontSize: 14,
  padding: "8px 16px", borderRadius: 999, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--muted)",
};
const chipOn: React.CSSProperties = {
  borderColor: "var(--accent)", color: "var(--accent)", background: "var(--accent-soft)", fontWeight: 700,
};
const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "14px 0", borderBottom: "1px solid var(--line)", textDecoration: "none", color: "inherit",
};
const cutBox: React.CSSProperties = {
  marginTop: 18, background: "var(--sunken)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 18px",
};
const cutSummary: React.CSSProperties = { cursor: "pointer", fontSize: 14, fontWeight: 700, color: "var(--muted)" };
