import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ChargerPicker from "@/components/ChargerPicker";
import { S } from "@/components/styles";
import { anchorCharger, buyableCharger, itemHref } from "@/lib/charger";
import { flightOf, powerbanks } from "@/lib/powerbank";

/**
 * 行動電源類目（2026-09-27 開，第二個不是寵物的類目）。
 *
 * 跟充電器一樣：讀者只有一個問題，我這支手機買哪一顆。最上面就是「你的手機是哪一支」，點了就給。
 * 行動電源多兩件大家會卡住的事，都在包裝背面：
 *   包裝大字的 mAh 是電池本身，手機拿得到的少很多（背面的額定容量）
 *   能不能帶上飛機看 Wh，不是 mAh；2026 年 4 月起每人最多 2 個、飛機上不能用
 * 研究筆記在 docs/POWER-BANK-RESEARCH.md。
 */

export const metadata: Metadata = {
  title: "行動電源怎麼選：你的手機買哪一顆充最快、能不能帶上飛機",
  description:
    "點你的手機，直接告訴你買哪一顆充最快、多少錢。包裝寫 10000mAh，手機拿得到多少？能不能帶上飛機？每一顆都照官網規格寫。",
  alternates: { canonical: "/power-bank" },
};

export default function Page() {
  const ready = powerbanks.filter(buyableCharger).length;
  // 買得到的排前面，其他照價錢。小米那三顆整條線產不出連結，放最上面只會讓人點進去買不到
  const listed = [...powerbanks].sort(
    (a, b) => Number(buyableCharger(b)) - Number(buyableCharger(a)) || (a.listPrice ?? 9e9) - (b.listPrice ?? 9e9),
  );
  return (
    <main style={S.page}>
      <SiteHeader current="power-bank" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        行動電源怎麼選
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "42ch" }}>
        點你的手機，直接告訴你買哪一顆充最快、多少錢、能不能帶上飛機。
      </p>

      <ChargerPicker list={powerbanks} kind="powerbank" />

      {ready === 0 && (
        <p style={{ ...S.hint, marginTop: 20 }}>
          {powerbanks.length} 顆的官方規格讀完了，購買連結還在補。
        </p>
      )}

      <p style={S.lbl}>包裝背面才看得到的</p>
      <div style={card}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          <b>包裝寫 10000mAh，手機拿不到那麼多。</b>那是電池本身的容量。小米 10000 那一顆，背面寫手機拿得到的是 5500mAh。
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.9 }}>
          <b>能不能帶上飛機，看 Wh 不看 mAh。</b>小於 100Wh 可以帶，只能放隨身。2026 年 4 月起每人最多 2 個，飛機上不能用、也不能充它。
        </p>
      </div>

      <p style={S.lbl}>我們讀過的 {powerbanks.length} 顆</p>
      <div style={wrap}>
        {listed.map((p, i) => (
          <Link key={p.id} href={itemHref(p.id)} style={{ ...row, borderTop: i ? "1px solid var(--line)" : 0 }}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{p.brand} · {p.cellMah.toLocaleString()}mAh · {p.cellWh}Wh</span>
              <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, lineHeight: 1.5 }}>{p.name}</span>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 2 }}>{p.back}</span>
            </span>
            <span style={{ textAlign: "right", whiteSpace: "nowrap" }}>
              <span className="mono" style={{ display: "block", fontSize: 14, fontWeight: 700 }}>{anchorCharger(p) ? "$" + anchorCharger(p)!.amount.toLocaleString() : `${p.totalW}W`}</span>
              <span style={{ display: "block", fontSize: 12.5, color: flightOf(p).ok ? "var(--keep)" : "var(--cut)" }}>{flightOf(p).short}</span>
            </span>
          </Link>
        ))}
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          數字來自各品牌官網和 Apple、三星的手機規格，搭飛機的規定照民航局公告，{powerbanks[0].checkedAt} 查的。以你手上那一顆的包裝為準。
        </p>
      </footer>
    </main>
  );
}

const card: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderLeft: "4px solid var(--cut)", borderRadius: 14, padding: "16px 20px",
};
const wrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
const row: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", textDecoration: "none", color: "inherit",
};
