import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { readerNotes } from "@/lib/notes";
import {
  DEVICES, TIER_TONE, anchorCharger, chargerById, chargers, fit, liveCharger, portsZh, tierZh,
  type Got,
} from "@/lib/charger";

/**
 * 一顆充電器的頁面。
 *
 * 2026-09-26 Tim：「好多用詞都有看沒有懂，大家就只是想要能快速充電。」
 * 所以最上面只回答讀者真的想知道的：哪些手機插它充最快、多少錢、在哪買、什麼時候不要買。
 * 每個孔幾瓦、同時插怎麼分、AVS、PPS 這些，收在「想看細節」裡，想研究的人點開。
 *
 * 來源在頁尾講一次就好，不要每一行都寫「官方寫的」。
 */

export function generateStaticParams() {
  return chargers.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = chargerById(id);
  if (!c) return {};
  const fast = DEVICES.filter((d) => fit(c, [d]).got![0].tier === "fast" && !d.noFast).map((d) => d.zh);
  return {
    title: `${c.brand} ${c.name}：哪些手機插它充最快`,
    description: `${c.back}。${fast.length ? `插它充最快的：${fast.slice(0, 4).join("、")}。` : ""}兩台一起插、筆電能不能用，一頁看完。`,
    alternates: { canonical: `/charger/p/${c.id}` },
  };
}

/** 等級由好到壞，同一級的裝置放一行 */
const ORDER = ["fast", "enough", "ok", "slow", "none"] as const;
const GROUP_ZH = { fast: "充最快", enough: "夠用", ok: "慢一點", slow: "很慢", none: "不能用" } as const;
const GROUP_TONE = { fast: "keep", enough: "keep", ok: "muted", slow: "warn", none: "cut" } as const;

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = chargerById(id);
  if (!c) notFound();
  const m = anchorCharger(c);
  const live = liveCharger(c);
  const multi = c.ports.length > 1;
  const w = (n?: number) => (n === undefined ? "沒寫" : `${n}W`);

  // 每一台單獨插上去的結果，照等級分組
  const each: Got[] = DEVICES.map((d) => fit(c, [d]).got![0]);
  const groups = ORDER.map((k) => ({
    k,
    items: each.filter((g) => (k === "enough" ? g.tier === "fast" && g.device.noFast : k === "fast" ? g.tier === "fast" && !g.device.noFast : g.tier === k)),
  })).filter((g) => g.items.length > 0);

  return (
    <main style={S.page}>
      <SiteHeader current="charger" />

      <span style={S.brand}>{c.brand}</span>
      <h1 style={{ fontSize: "clamp(24px,5vw,34px)", lineHeight: 1.45, margin: "4px 0 14px" }}>{c.name}</h1>
      <div style={tags}>
        <span style={tag}>最高 {c.totalW}W</span>
        <span style={tag}>{portsZh(c)}</span>
      </div>

      {/* 背面那一句：包裝正面沒講的那件事，用白話講 */}
      <div style={backBox}>
        <span style={backTag}>背面</span>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.7 }}>{c.back}</p>
      </div>

      {m ? (
        <div style={S.buyRow}>
          <a href={`/go/${m.id}/${c.id}`} rel="nofollow sponsored" style={S.btnBuy}>去蝦皮看這一顆 · ${m.amount.toLocaleString()}</a>
          <p style={S.buyNote}>{[m.label, ...readerNotes(m.note, { keepVariant: true })].join(" · ")}</p>
          {/* 其他賣場也列出來：有的是組合（像多附一條 60W 的線），貴一點但可能剛好是讀者要的 */}
          {live.length > 1 && (
            <div style={{ ...listWrap, marginTop: 6 }}>
              <p style={{ margin: 0, padding: "10px 16px 0", fontSize: 12.5, fontWeight: 700, color: "var(--faint)" }}>其他賣場</p>
              {live.filter((x) => x !== m).map((x) => (
                <a key={x.id} href={`/go/${x.id}/${c.id}`} rel="nofollow sponsored" style={otherShop}>
                  <span style={{ minWidth: 0 }}>
                    <b style={{ display: "block", fontSize: 14 }}>{x.label}</b>
                    {readerNotes(x.note, { keepVariant: true }).length > 0 && (
                      <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>{readerNotes(x.note, { keepVariant: true }).join(" · ")}</span>
                    )}
                  </span>
                  <span className="mono" style={{ fontSize: 14, whiteSpace: "nowrap" }}>${x.amount.toLocaleString()} ›</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p style={{ ...note, marginTop: 18 }}>購買連結還在補。</p>
      )}

      <p style={S.lbl}>你的手機插它會怎樣</p>
      <div style={listWrap}>
        {groups.map((g, i) => (
          <div key={g.k} style={{ padding: "12px 16px", borderTop: i ? "1px solid var(--line)" : 0 }}>
            <b style={{ display: "block", fontSize: 14, color: `var(--${GROUP_TONE[g.k]})` }}>{GROUP_ZH[g.k]}</b>
            <span style={{ display: "block", fontSize: 15.5, lineHeight: 1.8 }}>{g.items.map((x) => x.device.zh).join("、")}</span>
          </div>
        ))}
      </div>
      <p style={{ ...note, marginTop: 10 }}>
        兩台以上要一起充？<Link href="/charger" style={{ color: "var(--accent)", fontWeight: 700 }}>點你的裝置算一次</Link>。
      </p>

      <div style={dealBox}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.85 }}>
          <b style={{ color: "var(--cut)" }}>什麼時候不要買：</b>{c.dealbreaker}
        </p>
      </div>

      {/* 想研究的人才點開：每個孔幾瓦、同時插怎麼分、每一台的技術原因 */}
      <details style={S.more}>
        <summary style={S.moreSummary}>
          <span>想看細節</span>
          <span style={S.moreHint}>展開</span>
        </summary>
        <div style={{ marginTop: 14 }}>
          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>孔</th><th style={th}>一般 USB PD</th><th style={th}>PPS</th><th style={th}>AVS</th>
                </tr>
              </thead>
              <tbody>
                {c.ports.map((p) => (
                  <tr key={p.id}>
                    <td style={td}>{p.kind === "A" ? "USB-A" : multi ? p.id : "USB-C"}</td>
                    <td style={tdNum}>{p.kind === "A" ? `${p.w}W（沒有 PD）` : `${p.w}W`}</td>
                    <td style={tdNum}>{w(p.pps)}</td>
                    <td style={tdNum}>{w(p.avs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={note}>PPS 是三星超快速充電用的，AVS 是 iPhone 18 Pro 最快要的。{c.avsNote ? ` ${c.avsNote}。` : ""}</p>

          {multi && (
            <>
              <p style={subLbl}>同時插的時候</p>
              {c.combos.length === 0 ? (
                <p style={note}>品牌沒寫同時插怎麼分。</p>
              ) : (
                <div style={listWrap}>
                  {c.combos.map((k, i) => (
                    <div key={k.use.join("+")} style={{ ...comboRow, borderTop: i ? "1px solid var(--line)" : 0 }}>
                      <span style={{ fontWeight: 700 }}>{k.use.map((u) => (u === "A" ? "USB-A" : u)).join("＋")}</span>
                      <span className="mono">{k.use.map((u) => `${k.w[u]}W`).join("＋")}</span>
                      {k.pps && <span style={{ fontSize: 12.5, color: "var(--muted)", flexBasis: "100%" }}>PPS：{k.use.filter((u) => k.pps![u] !== undefined).map((u) => `${u} ${k.pps![u]}W`).join("、")}</span>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <p style={subLbl}>每一台為什麼是這個結果</p>
          <div style={listWrap}>
            {each.map((g, i) => (
              <div key={g.device.id} style={{ padding: "10px 16px", borderTop: i ? "1px solid var(--line)" : 0 }}>
                <span style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <b style={{ fontSize: 14 }}>{g.device.zh}</b>
                  <b style={{ fontSize: 14, color: `var(--${TIER_TONE[g.tier]})`, whiteSpace: "nowrap" }}>{tierZh(g.device, g.tier)}</b>
                </span>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>{g.tech}；{g.device.line}</span>
              </div>
            ))}
          </div>

          {c.knownIssues && <p style={{ ...note, marginTop: 14 }}>{c.knownIssues}</p>}
          <p style={{ ...note, marginTop: 8 }}>
            {[c.model && `型號 ${c.model}`, c.weightG && `${c.weightG} 公克`, c.sizeMm && `${c.sizeMm} 公釐`, c.bsmi && `商檢字號 ${c.bsmi}`].filter(Boolean).join(" · ")}
          </p>
        </div>
      </details>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          數字來自 {c.brand.split(" ")[0]} 官網和 Apple、三星的手機規格，{c.checkedAt} 查的。以你手上那一顆的包裝為準。
        </p>
      </footer>
    </main>
  );
}

const tags: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 6 };
const tag: React.CSSProperties = {
  fontSize: 12.5, padding: "4px 11px", borderRadius: 999,
  background: "var(--sunken)", border: "1px solid var(--line)", color: "var(--muted)",
};
const backBox: React.CSSProperties = {
  marginTop: 18, background: "var(--surface)", border: "1px solid var(--line)", borderLeft: "4px solid var(--cut)",
  borderRadius: 14, padding: "16px 20px",
};
const backTag: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 12.5, fontWeight: 600, letterSpacing: ".14em",
  color: "var(--cut)", marginBottom: 4,
};
const subLbl: React.CSSProperties = { margin: "20px 0 8px", fontSize: 14, fontWeight: 700, color: "var(--muted)" };
const tableWrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflowX: "auto",
};
const table: React.CSSProperties = { width: "100%", borderCollapse: "collapse", fontSize: 14 };
const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 14px", fontSize: 12.5, color: "var(--faint)", fontWeight: 600,
  borderBottom: "1px solid var(--line)", whiteSpace: "nowrap",
};
const td: React.CSSProperties = { padding: "10px 14px", fontWeight: 700, whiteSpace: "nowrap" };
const tdNum: React.CSSProperties = { padding: "10px 14px", fontFamily: "var(--font-mono), monospace", whiteSpace: "nowrap" };
const note: React.CSSProperties = { margin: "8px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 };
const listWrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
const comboRow: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "4px 12px", padding: "12px 16px", fontSize: 15.5,
};
const dealBox: React.CSSProperties = {
  marginTop: 24, background: "var(--cut-soft)", border: "1px solid var(--cut)", borderRadius: 14, padding: "16px 20px",
};
const otherShop: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "10px 16px 12px", textDecoration: "none", color: "inherit",
};
