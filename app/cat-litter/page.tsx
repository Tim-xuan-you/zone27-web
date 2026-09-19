import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Share from "@/components/Share";
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

      <p style={lbl}>可以買的 {buyable.length} 款，便宜的排前面</p>
      <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
        材質照包裝與品牌官網。能不能沖馬桶是我們照材質判的，不是照文案抄的。
        {live === 0 && " 購買連結還在補，補好了每一款下面就會出現。"}
      </p>

      {buyable.map((p) => {
        const f = FLUSH[p.spec.flushable];
        const m = anchorLitter(p);
        const per = m ? unitPriceOf(p, m) : null;
        const month = m ? monthlyCost(p, m) : null;
        return (
          <Link key={p.id} href={`/cat-litter/p/${p.id}`} style={row}>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{p.brand}</span>
              <span style={{ display: "block", fontWeight: 700, lineHeight: 1.5 }}>{p.name}</span>
              <span style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 6 }}>
                <span style={{ fontSize: 12, color: f.fg, background: f.bg, borderRadius: 6, padding: "2px 8px" }}>{f.zh}</span>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{MATERIAL_ZH[p.spec.material]}</span>
                {p.spec.dust && (
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>
                    粉塵{{ low: "少", medium: "中", high: "多" }[p.spec.dust]}
                  </span>
                )}
                {p.spec.clumping ? null : <span style={{ fontSize: 12.5, color: "var(--muted)" }}>不結團</span>}
              </span>
            </span>
            <span className="mono" style={{ whiteSpace: "nowrap", fontSize: 13.5, textAlign: "right" }}>
              {month ? (
                <>
                  <b>${month.cost.toLocaleString()}</b>
                  <span style={{ color: "var(--faint)", fontSize: 12 }}>／月</span>
                </>
              ) : per ? (
                <>
                  <b>${per.n}</b>
                  <span style={{ color: "var(--faint)", fontSize: 12 }}>／{per.unit}</span>
                </>
              ) : (
                <span style={{ color: "var(--faint)", fontSize: 12.5 }}>還沒有連結</span>
              )}
              <span aria-hidden style={{ color: "var(--faint)", marginLeft: 8 }}>›</span>
            </span>
          </Link>
        );
      })}

      {dataOnly.length > 0 && (
        <details style={moreBox}>
          <summary style={moreSummary}>
            另外 {dataOnly.length} 款只讀了資料，還沒有購買連結
          </summary>
          <p style={{ margin: "10px 0 4px", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.85 }}>
            材質、能不能沖馬桶都查得到，只是我們還沒有這幾款的購買連結，所以不放連結。
          </p>
          {dataOnly.map((p) => {
            const f = FLUSH[p.spec.flushable];
            return (
              <Link key={p.id} href={`/cat-litter/p/${p.id}`} style={row}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{p.brand}</span>
                  <span style={{ display: "block", fontWeight: 700, lineHeight: 1.5 }}>{p.name}</span>
                  <span style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 6 }}>
                    <span style={{ fontSize: 12, color: f.fg, background: f.bg, borderRadius: 6, padding: "2px 8px" }}>{f.zh}</span>
                    <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{MATERIAL_ZH[p.spec.material]}</span>
                  </span>
                </span>
                <span aria-hidden style={{ color: "var(--faint)" }}>›</span>
              </Link>
            );
          })}
        </details>
      )}

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
