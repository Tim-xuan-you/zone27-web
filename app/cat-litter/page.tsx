import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Share from "@/components/Share";
import LitterPicker, { type LitterRow } from "@/components/LitterPicker";
import { litters, MATERIAL_ZH, FLUSH, buyableLitter, anchorLitter, unitPriceOf, monthlyCost } from "@/lib/litter";

/**
 * 貓砂類目。
 *
 * 飼料問「牠能不能吃」，貓砂問三件事：沖不沖得下去、一個月多少錢、家裡受不受得了粉塵。
 * 所以這一頁不放裁決器（那套規則是給吃的用的），先把最容易被騙的那件事擺在最前面。
 */

export const metadata: Metadata = {
  title: "貓砂怎麼選",
  description:
    "「可沖馬桶」這四個字，有的沖了會塞。我們照材質一款一款判：豆腐砂、混合砂、礦砂、木屑砂、沸石砂，哪些真的能沖，哪些沖下去會卡在管線裡。再幫你把一包多少錢換成一個月多少錢。",
  alternates: { canonical: "/cat-litter" },
};

export default function Page() {
  /*
   * 2026-09-19 手機走一次發現的：14 款混在一起，有 9 款點進去是「還沒有連結」。
   * 讀者一路滑過去一直碰壁，會以為這站沒東西。
   * 所以能買的排前面、照一個月多少錢由便宜排到貴（貓砂是消耗品，月花費就是他的決策軸），
   * 只有資料的收進下面點開才看得到 —— 資料還在，只是不擋路。
   */
  const cost = (p: (typeof litters)[number]) => {
    const m = anchorLitter(p);
    return m ? monthlyCost(p, m)?.cost ?? Infinity : Infinity;
  };
  const buyable = litters.filter(buyableLitter).sort((a, b) => cost(a) - cost(b));
  const dataOnly = litters.filter((p) => !buyableLitter(p));
  const live = buyable.length;
  const toRow = (p: (typeof litters)[number]): LitterRow => {
    const m = anchorLitter(p);
    const f = FLUSH[p.spec.flushable];
    return {
      id: p.id, brand: p.brand, name: p.name, materialZh: MATERIAL_ZH[p.spec.material],
      flush: p.spec.flushable, flushZh: f.zh, flushFg: f.fg, flushBg: f.bg,
      ...(p.spec.dust ? { dust: p.spec.dust } : {}),
      ...(p.spec.scented ? { scented: true } : {}),
      clumping: p.spec.clumping,
      monthly: m ? monthlyCost(p, m)?.cost ?? null : null,
      buyable: Boolean(m),
    };
  };
  const rows: LitterRow[] = [...buyable, ...dataOnly].map(toRow);
  const flushOk = litters.filter((p) => p.spec.flushable === "limited").length;
  const gap = litters.filter((p) => p.spec.flushClaim === "yes" && p.spec.flushable === "no").length;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="cat-litter" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        貓砂怎麼選
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 12px", maxWidth: "42ch" }}>
        材質決定一切：能不能沖馬桶、一個月要搬幾公斤上樓、家裡會不會變沙漠。
        我們讀過 {litters.length} 款，{flushOk} 款適量可以沖，其他的沖下去會卡在管線裡。
      </p>

      <Link href="/cat-litter/flush" style={feature}>
        <h2 style={featureTitle}>「可沖馬桶」這四個字，有的沖了會塞</h2>
        <p style={featureBody}>
          豆腐砂、稻殼砂遇水會散開，一次一點點可以沖。木屑砂遇水是散開沒錯，但體積變大、比重輕，容易在管線裡堆起來。
          礦砂遇水結成一團，本來就不溶於水。
          最容易搞混的是混合砂：名字都一樣，有的全是植物、有的摻礦砂，能不能沖差很多。
          {gap > 0 && <> 我們讀過的裡面，有 {gap} 款包裝寫可以沖，但那個材質沖下去不會散開。</>}
        </p>
      </Link>

      <LitterPicker rows={rows} />

      <div style={{ marginTop: 30 }}>
        <Share path="/cat-litter" text="貓砂的「可沖馬桶」有的沖了會塞，這裡照材質一款一款判：" label="把這頁傳給朋友" />
      </div>

      <footer style={{ marginTop: 60, paddingTop: 24, borderTop: "1px solid var(--line)", fontSize: 13, color: "var(--faint)", lineHeight: 1.9 }}>
        <p style={{ margin: 0 }}>
          一個月多少錢是照一隻貓推估的，每隻貓的用量差很多，當成比較用的基準就好。
          配方與包裝會改版，以你手上那一包為準。
        </p>
      </footer>
    </main>
  );
}

const lbl: React.CSSProperties = {
  margin: "34px 0 10px", fontSize: 13, fontWeight: 700, color: "var(--muted)", letterSpacing: ".06em",
};
const feature: React.CSSProperties = {
  display: "block", background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px", textDecoration: "none", color: "inherit",
};
const featureTitle: React.CSSProperties = {
  fontFamily: "var(--font-serif), serif", fontSize: 20, margin: "0 0 8px", lineHeight: 1.5,
};
const featureBody: React.CSSProperties = { margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.85 };
const moreBox: React.CSSProperties = {
  marginTop: 22, background: "var(--sunken)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 18px",
};
const moreSummary: React.CSSProperties = { cursor: "pointer", fontSize: 14.5, fontWeight: 700, color: "var(--muted)" };
const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "14px 0", borderBottom: "1px solid var(--line)", textDecoration: "none", color: "inherit",
};
