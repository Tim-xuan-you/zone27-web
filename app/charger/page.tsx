import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ChargerPicker from "@/components/ChargerPicker";
import ReadList from "@/components/ReadList";
import { S } from "@/components/styles";
import { buyableCharger, chargers, portsZh } from "@/lib/charger";

/**
 * 充電器類目。第一個不是寵物的類目（2026-09-26）。
 *
 * 讀者來這裡只有一個問題：我這幾台，買哪一顆。
 * 所以最上面就是「你要充哪幾台」，點了就算，不用先讀任何東西。
 * 我們讀了什麼、怎麼判的，放在下面想看的人看。
 */

export const metadata: Metadata = {
  title: "充電器怎麼選：你那幾台插上去，各拿到幾瓦",
  description:
    "包裝寫 65W，三個孔一起插是 35W＋25W＋5W。iPhone 18 Pro 要 60W 的 AVS，Galaxy S26 Ultra 要 PPS 60W。點你要充的裝置，我們照官方規格算每一顆充電器插上去各拿到幾瓦。",
  alternates: { canonical: "/charger" },
};

export default function Page() {
  const ready = chargers.filter(buyableCharger).length;
  return (
    <main style={S.page}>
      <SiteHeader current="charger" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        充電器怎麼選
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "42ch" }}>
        包裝正面寫的瓦數，常常不是你拿到的瓦數。點你要充的那幾台，我們照官方規格算，每一顆插上去各拿到幾瓦。
      </p>

      <ChargerPicker />

      {ready === 0 && (
        <p style={{ ...S.hint, marginTop: 20 }}>
          {chargers.length} 顆的官方規格讀完了，購買連結還在補。
        </p>
      )}

      <p style={S.lbl}>先看這個</p>
      <ReadList items={[
        { href: "/charger/iphone-18-pro", title: "iPhone 18 Pro 要哪一顆充電器才會最快", line: "Apple 要 60W 的 AVS。寫 AVS 的，也要看那一檔幾瓦" },
      ]} />

      <p style={S.lbl}>我們讀過的 {chargers.length} 顆</p>
      <div style={wrap}>
        {chargers.map((c, i) => (
          <Link key={c.id} href={`/charger/p/${c.id}`} style={{ ...row, borderTop: i ? "1px solid var(--line)" : 0 }}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{c.brand} · {portsZh(c)}</span>
              <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, lineHeight: 1.5 }}>{c.name}</span>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 2 }}>{c.back}</span>
            </span>
            <span className="mono" style={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>{c.totalW}W</span>
          </Link>
        ))}
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          規格全部取自品牌官網（Apple、三星、KINYO、ONPRO），查核日期 {chargers[0].checkedAt}。
          我們沒有儀器、不做實測，官方沒寫的就寫沒寫。以你手上那一顆的包裝為準。
        </p>
      </footer>
    </main>
  );
}

const wrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
const row: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", textDecoration: "none", color: "inherit",
};
