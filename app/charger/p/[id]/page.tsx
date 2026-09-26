import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import {
  DEVICES, TIER_TONE, anchorCharger, chargerById, chargers, fit, liveCharger, portsZh, tierZh,
} from "@/lib/charger";

/**
 * 一顆充電器的「背面」：每個孔最多幾瓦、同時插怎麼分、PPS 跟 AVS 那一檔到多少。
 * 再把我們收的每一台裝置單獨插上去算一次，讀者找自己那一台看就好。
 *
 * 官方沒寫的格子寫「沒寫」，不填一個看起來合理的數字。
 */

export function generateStaticParams() {
  return chargers.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = chargerById(id);
  if (!c) return {};
  return {
    title: `${c.brand} ${c.name}：每個孔幾瓦、同時插怎麼分`,
    description: `${c.back}。${c.brand} ${c.name} 每個孔最多幾瓦、兩個孔一起插各剩多少、PPS 和 AVS 到幾瓦，照官方規格整理，iPhone、iPad、MacBook、Galaxy 插上去各拿到幾瓦。`,
    alternates: { canonical: `/charger/p/${c.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = chargerById(id);
  if (!c) notFound();
  const m = anchorCharger(c);
  const live = liveCharger(c);
  const multi = c.ports.length > 1;
  const w = (n?: number) => (n === undefined ? "沒寫" : `${n}W`);

  return (
    <main style={S.page}>
      <SiteHeader current="charger" />

      <span style={S.brand}>{c.brand}</span>
      <h1 style={{ fontSize: "clamp(24px,5vw,34px)", lineHeight: 1.45, margin: "4px 0 14px" }}>{c.name}</h1>
      <div style={tags}>
        <span style={tag}>最高 {c.totalW}W</span>
        <span style={tag}>{portsZh(c)}</span>
        {c.weightG && <span style={tag}>{c.weightG} 公克</span>}
        {c.bsmi && <span style={tag}>商檢 {c.bsmi}</span>}
      </div>

      {/* 背面那一句：這一頁的重點，放最上面 */}
      <div style={backBox}>
        <span style={backTag}>背面</span>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.7 }}>{c.back}</p>
      </div>

      <p style={S.lbl}>每個孔最多幾瓦</p>
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
      {c.avsNote && <p style={note}>{c.avsNote}</p>}

      {multi && (
        <>
          <p style={S.lbl}>同時插的時候</p>
          {c.combos.length === 0 ? (
            <p style={note}>官方沒寫同時插怎麼分。</p>
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

      <p style={S.lbl}>單獨插一台，拿到什麼</p>
      <div style={listWrap}>
        {DEVICES.map((d, i) => {
          const g = fit(c, [d]).got![0];
          return (
            <div key={d.id} style={{ padding: "12px 16px", borderTop: i ? "1px solid var(--line)" : 0 }}>
              <span style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <b style={{ fontSize: 15.5 }}>{d.zh}</b>
                <b style={{ fontSize: 14, color: `var(--${TIER_TONE[g.tier]})`, whiteSpace: "nowrap" }}>{tierZh(d, g.tier)}</b>
              </span>
              <span style={{ display: "block", fontSize: 14, color: "var(--muted)", lineHeight: 1.75 }}>{g.why}</span>
            </div>
          );
        })}
      </div>
      <p style={{ ...note, marginTop: 10 }}>
        兩台以上要一起充，<Link href="/charger" style={{ color: "var(--accent)", fontWeight: 700 }}>點你的裝置算一次</Link>。
      </p>

      <div style={dealBox}>
        <p style={{ margin: "0 0 8px", fontSize: 15.5, lineHeight: 1.85 }}>
          <b style={{ color: "var(--cut)" }}>什麼時候不要買：</b>{c.dealbreaker}
        </p>
        {c.knownIssues && <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>{c.knownIssues}</p>}
      </div>

      {m ? (
        <div style={S.buyRow}>
          <a href={`/go/${m.id}/${c.id}`} rel="nofollow sponsored" style={S.btnBuy}>去蝦皮看這一顆</a>
          <p style={S.buyNote}>{m.label} · ${m.amount.toLocaleString()}{live.length > 1 ? ` · 另外 ${live.length - 1} 家` : ""}</p>
        </div>
      ) : (
        <p style={{ ...note, marginTop: 18 }}>購買連結還在補。</p>
      )}

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          規格取自 {c.brand.split(" ")[0]} 官網，查核日期 {c.checkedAt}。我們沒有實測，官方沒寫的就寫沒寫。以你手上那一顆的包裝為準。
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
  marginTop: 28, background: "var(--cut-soft)", border: "1px solid var(--cut)", borderRadius: 14, padding: "16px 20px",
};
