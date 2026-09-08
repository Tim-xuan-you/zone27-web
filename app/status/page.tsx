import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { buyable, maintenanceRows, PRICE_FRESH_DAYS, PRICE_STALE_DAYS } from "@/lib/engine";

/**
 * 維護台。給 Tim 一個人看的，不給讀者、不給搜尋引擎。
 *
 * 存在的理由只有一句話：商品越來越多之後，不可能一個一個找哪個連結壞了。
 * 所以把「該處理什麼」變成一頁排好順序的清單 —— 打開、由上往下做、關掉。
 *
 * 每天重算一次（revalidate），因為「幾天沒複查」是會自己長大的數字，
 * 不重算的話這頁明天就開始說謊。
 */

export const metadata: Metadata = {
  title: "維護台",
  robots: { index: false, follow: false },
};

export const revalidate = 86400;

const TONE = {
  dead: { bg: "var(--cut-soft)", fg: "var(--cut)", zh: "連結已死" },
  stale: { bg: "var(--warn-soft)", fg: "var(--warn)", zh: "過期" },
  aging: { bg: "var(--sunken)", fg: "var(--muted)", zh: "快過期" },
  fresh: { bg: "var(--keep-soft)", fg: "var(--keep)", zh: "新的" },
} as const;

export default function Page() {
  const rows = maintenanceRows(catalog);
  const n = (l: keyof typeof TONE) => rows.filter((r) => r.level === l).length;

  const unbuyable = catalog.filter((p) => !buyable(p) || p.discontinued);
  const noIssues = catalog.filter((p) => !p.knownIssues?.trim());

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px 120px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 36,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
        <span style={{ fontSize: 12.5, color: "var(--faint)" }}>維護台 · 不對外</span>
      </div>

      <h1 style={{ fontSize: "clamp(24px,5vw,32px)", lineHeight: 1.4, margin: "0 0 12px" }}>
        今天要處理什麼
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "46ch" }}>
        由上往下做就好。上面的最急，做到「新的」那一段就可以關掉。
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
        {(["dead", "stale", "aging", "fresh"] as const).map((l) => (
          <span key={l} style={{
            background: TONE[l].bg, color: TONE[l].fg,
            borderRadius: 999, padding: "8px 16px", fontSize: 14, fontWeight: 600,
          }}>
            {TONE[l].zh} {n(l)}
          </span>
        ))}
      </div>

      {/* ── 待辦 ── */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 660, borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--faint)", fontSize: 12 }}>
              <th style={th}>狀態</th>
              <th style={th}>商品</th>
              <th style={th}>賣場</th>
              <th style={th}>規格</th>
              <th style={th}>幾天沒查</th>
              <th style={th}>去看</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.merchantId} style={{ borderTop: "1px solid var(--line)" }}>
                <td style={td}>
                  <span style={{
                    background: TONE[r.level].bg, color: TONE[r.level].fg,
                    borderRadius: 999, padding: "3px 10px", fontSize: 12, whiteSpace: "nowrap",
                  }}>{TONE[r.level].zh}</span>
                </td>
                <td style={td}>
                  <span style={{ color: "var(--muted)", fontSize: 12.5, display: "block" }}>{r.brand}</span>
                  {r.name}
                </td>
                <td style={{ ...td, color: "var(--muted)" }}>{r.label}</td>
                <td style={{ ...td, whiteSpace: "nowrap" }} className="mono">
                  {r.unit} · ${r.amount}
                </td>
                <td style={{ ...td, whiteSpace: "nowrap" }} className="mono">
                  {r.days} 天
                </td>
                <td style={td}>
                  <a
                    href={r.affiliateUrl}
                    target="_blank"
                    rel="noopener nofollow"
                    style={{ color: "var(--accent)", whiteSpace: "nowrap" }}
                  >開連結 ↗</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── 其他缺口 ── */}
      <h2 style={h2}>整款買不到的</h2>
      {unbuyable.length === 0 ? (
        <p style={okLine}>沒有。每一款都至少還有一家能買。</p>
      ) : (
        <ul style={ul}>
          {unbuyable.map((p) => (
            <li key={p.id}>{p.brand}｜{p.name} —— {p.discontinued ? "已標記停產" : "所有賣場都失效"}</li>
          ))}
        </ul>
      )}

      <h2 style={h2}>還沒寫飼主回報的</h2>
      {noIssues.length === 0 ? (
        <p style={okLine}>都寫了。</p>
      ) : (
        <ul style={ul}>
          {noIssues.map((p) => (
            <li key={p.id}>{p.brand}｜{p.name}</li>
          ))}
        </ul>
      )}

      <h2 style={h2}>規則</h2>
      <ul style={ul}>
        <li>{PRICE_FRESH_DAYS} 天內查過 = 新的，價格照常顯示。</li>
        <li>超過 {PRICE_FRESH_DAYS} 天 = 快過期，卡片上會多一行「這個價格是 N 天前查的」。</li>
        <li>超過 {PRICE_STALE_DAYS} 天 = 過期，畫面上明講我們把它當參考不當承諾。</li>
        <li>賣場標成 <code style={code}>dead</code>，引擎完全跳過它；一款全部賣場都死，整款不會出現在裁決結果。</li>
        <li>連結健檢在自己電腦上跑：<code style={code}>npm run links:check</code>。</li>
      </ul>

      <p style={{ marginTop: 40 }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 700 }}>← 回裁決器</Link>
      </p>
    </main>
  );
}

const th: React.CSSProperties = { padding: "8px 12px 8px 0", fontWeight: 600 };
const td: React.CSSProperties = { padding: "12px 12px 12px 0", verticalAlign: "top", lineHeight: 1.6 };
const h2: React.CSSProperties = {
  fontSize: 17, fontWeight: 700, margin: "40px 0 12px",
  paddingTop: 20, borderTop: "1px solid var(--line)",
};
const ul: React.CSSProperties = { paddingLeft: 20, margin: 0, fontSize: 15, lineHeight: 1.95 };
const okLine: React.CSSProperties = { margin: 0, fontSize: 15, color: "var(--keep)" };
const code: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace", fontSize: "0.9em",
  background: "var(--sunken)", padding: "1px 5px", borderRadius: 3,
};
