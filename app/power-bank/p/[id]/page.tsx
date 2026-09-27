import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChargerProduct from "@/components/ChargerProduct";
import { DEVICES, fit } from "@/lib/charger";
import { flightOf, powerbankById, powerbanks, type PowerBank } from "@/lib/powerbank";

/**
 * 一顆行動電源的頁面（2026-09-27）。
 *
 * 跟充電器同一個版型（components/ChargerProduct）：你的手機插它多快、什麼時候不要買、細節收起來。
 * 多一塊電池：包裝寫幾 mAh、背面寫手機拿得到多少、能不能帶上飛機。
 * 這幾個數字各家寫法不一樣，官方寫什麼就照寫，沒寫的就不寫。
 */

export function generateStaticParams() {
  return powerbanks.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = powerbankById(id);
  if (!p) return {};
  const fast = DEVICES.filter((d) => fit(p, [d]).got![0].tier === "fast" && !d.noFast && d.group !== "Mac").map((d) => d.zh);
  return {
    title: `${p.brand} ${p.name}：手機插它多快、能不能帶上飛機`,
    description: `${p.back}。${fast.length ? `插它充最快的：${fast.slice(0, 3).join("、")}。` : ""}${flightOf(p).short}，一頁看完。`,
    alternates: { canonical: `/power-bank/p/${p.id}` },
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = powerbankById(id);
  if (!p) notFound();
  return <ChargerProduct c={p} list={powerbanks} kind="powerbank" battery={<Battery p={p} />} />;
}

function Battery({ p }: { p: PowerBank }) {
  const f = flightOf(p);
  const rows: [string, React.ReactNode][] = [
    ["包裝寫", `${p.cellMah.toLocaleString()}mAh（電池本身${p.cellV ? `，${p.cellV}V` : ""}；${p.cellWh}Wh）`],
    ...(p.rated5vMah
      ? [["手機拿得到", `${p.rated5vMah.toLocaleString()}mAh（背面的額定容量，用 5V 算）${p.conversionPct ? `，轉換率 ${p.conversionPct}%` : ""}`] as [string, React.ReactNode]]
      : [["手機拿得到", "官網沒寫額定容量"] as [string, React.ReactNode]]),
    ["搭飛機", <span key="f"><b style={{ color: f.ok ? "var(--keep)" : "var(--cut)" }}>{f.short}</b>（{f.why}）。{f.rule}。</span>],
    ...(p.cable ? [["自帶線", p.cable] as [string, React.ReactNode]] : []),
    ...(p.weightG ? [["重量", `${p.weightG} 公克`] as [string, React.ReactNode]] : []),
  ];
  return (
    <div style={box}>
      {rows.map(([k, v], i) => (
        <div key={k} style={{ ...row, borderTop: i ? "1px solid var(--line)" : 0 }}>
          <span style={label}>{k}</span>
          <span style={{ flex: 1, minWidth: 0 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

const box: React.CSSProperties = {
  marginTop: 14, background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
const row: React.CSSProperties = { display: "flex", gap: 12, padding: "11px 16px", fontSize: 15.5, lineHeight: 1.75 };
const label: React.CSSProperties = { width: 84, flexShrink: 0, fontSize: 14, fontWeight: 700, color: "var(--muted)", paddingTop: 2 };
