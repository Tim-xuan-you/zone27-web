import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import Share from "@/components/Share";
import { litters, MATERIAL_ZH, FLUSH, FLUSH_LINE, flushGap, type LitterMaterial } from "@/lib/litter";

/**
 * 「哪些貓砂真的可以沖馬桶」——貓砂這個類目的招牌頁，對應飼料的 /check。
 *
 * 同一個作法：查得到、可以分享、判定寫清楚理由。
 * 差別是這裡的判準不是成分表，是材質遇水會怎樣 —— 這件事賣場文案幾乎都寫得含糊。
 */

export const metadata: Metadata = {
  title: "哪些貓砂真的可以沖馬桶",
  description:
    "豆腐砂、稻殼砂適量可以沖；木屑砂遇水散開但體積變大，容易卡管線；礦砂、沸石、水晶不溶於水，沖下去就是在堆積。名字都叫混合砂，有的能沖有的不能，差在裡面有沒有礦砂。",
  alternates: { canonical: "/cat-litter/flush" },
};

/** 材質怎麼判，一次講清楚，不要每一款重複講 */
const WHY: Record<LitterMaterial, string> = {
  tofu: "黃豆渣、豌豆纖維做的，遇水會散開，所以一次一小坨沖得掉。",
  cassava: "木薯（樹薯）澱粉做的，遇水會散開，量少沖得掉。",
  "mixed-plant": "稻殼加豆腐這種，兩種都是植物纖維，遇水一樣會散開。",
  "mixed-mineral": "裡面摻了礦砂。礦砂不溶於水，整團卡住的就是它。",
  mineral: "膨潤土遇水是結成一團，而且不溶於水。",
  wood: "木屑遇水是散開，不是溶解。散開之後體積變大、比重輕，容易在管線轉彎處堆起來。",
  paper: "紙纖維遇水會散，量少可以沖。",
  zeolite: "沸石是礦物，不會溶。這種砂本來就是設計成不用沖的。",
  crystal: "矽膠顆粒，遇水不會散也不會溶。",
};

export default function Page() {
  const order = ["limited", "no"] as const;
  // 兩種落差要分開講：包裝寫可沖但根本沖不掉，跟包裝寫可沖、實際上只能一次一點點
  const hardGaps = litters.filter((p) => p.spec.flushClaim === "yes" && p.spec.flushable === "no");
  const softGaps = litters.filter((p) => p.spec.flushClaim === "yes" && p.spec.flushable === "limited");

  return (
    <main style={S.page}>
      <SiteHeader current="cat-litter" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        哪些貓砂<br />真的可以沖馬桶
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 10px", maxWidth: "42ch" }}>
        我們讀過的 {litters.length} 款裡，只有 {litters.filter((p) => p.spec.flushable === "limited").length} 款適量可以沖。
        其他的沖下去不會散開，是在管線裡堆積。
        {hardGaps.length > 0 && <> 其中 <b style={{ color: "var(--cut)" }}>{hardGaps.length} 款包裝寫可以沖，但那個材質沖不掉</b>。</>}
        {softGaps.length > 0 && <> 另外 {softGaps.length} 款包裝寫可以沖，實際上是「一次一點點才可以」。</>}
      </p>
      <p style={{ color: "var(--faint)", fontSize: 14, lineHeight: 1.8, margin: "0 0 26px" }}>
        判準是材質遇水會怎樣，不是文案怎麼寫。老公寓、化糞池、管徑小的，再保險一點都不要沖。
      </p>

      {order.map((f) => {
        const list = litters.filter((p) => p.spec.flushable === f);
        if (list.length === 0) return null;
        const s = FLUSH[f];
        return (
          <section key={f} style={{ marginBottom: 34 }}>
            <p style={{ margin: "0 0 4px" }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: s.fg, background: s.bg, borderRadius: 8, padding: "5px 12px" }}>
                {s.zh}（{list.length} 款）
              </span>
            </p>
            <p style={{ margin: "10px 0 12px", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>{FLUSH_LINE[f]}</p>
            <div style={{ border: "1px solid var(--line)", borderRadius: 14, background: "var(--surface)", padding: "4px 18px 8px" }}>
              {list.map((p) => {
                const gap = flushGap(p);
                return (
                  <Link key={p.id} href={`/cat-litter/p/${p.id}`} style={S.listRow}>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{p.brand}</span>
                      <span style={{ display: "block", fontWeight: 700, lineHeight: 1.5 }}>{p.name}</span>
                      <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)", marginTop: 4, lineHeight: 1.75 }}>
                        {MATERIAL_ZH[p.spec.material]}：{WHY[p.spec.material]}
                      </span>
                      {gap && (
                        <span style={{ display: "block", fontSize: 12.5, color: "var(--cut)", marginTop: 4, fontWeight: 700 }}>
                          {gap}
                        </span>
                      )}
                    </span>
                    <span aria-hidden style={{ color: "var(--faint)" }}>›</span>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      <div style={{ marginTop: 10 }}>
        <Share
          path="/cat-litter/flush"
          text="貓砂寫「可沖馬桶」不代表沖得掉，這裡照材質一款一款判："
          label="把這頁傳給朋友"
        />
      </div>

      <p style={{ marginTop: 28, fontSize: 12.5, color: "var(--faint)", lineHeight: 1.9 }}>
        材質照包裝與品牌官網。這一頁講的是「沖下去會不會卡」，不是在講哪一款比較好用。
        我們只讀了這 {litters.length} 款，沒列出來的不代表可以沖。
      </p>
    </main>
  );
}

