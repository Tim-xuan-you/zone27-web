import type { Metadata } from "next";
import Link from "next/link";
import Decider from "@/components/Decider";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { catalogOf, isLive, liveCount, shopLink } from "@/lib/catalog";
import { MIN_LIVE } from "@/lib/categories";
import { recommendable } from "@/lib/engine";
import { CAT_ALLERGENS, CAT_BREEDS } from "@/lib/slugs";
import type { Product, ProteinSource } from "@/lib/types";

/**
 * 貓飼料類目頁。
 *
 * 還沒開張的時候（能推薦的不到 MIN_LIVE 款），這一頁的主角是「我們讀過的那幾款」：
 * 每一款的成分重點、什麼時候不要買，全部攤開。來源不放網址（連出去是別家的店）。
 * 購買連結還沒補齊，但查證的工作已經做完了，那本身就有用 ——
 * 搜「ACANA 貓 鴨肉 有雞嗎」的人，在這裡就找得到答案。
 *
 * 開張之後，下面多長出品種與過敏原的長尾頁連結。
 */

export const metadata: Metadata = {
  title: "貓飼料怎麼選",
  description:
    "我們一款一款讀過台灣架上的貓飼料成分表：哪些名字寫鮭魚、鴨肉，成分表裡卻有雞；哪些被標成無穀，其實有燕麥。每一款都寫清楚什麼時候不要買。",
  alternates: { canonical: "/cat-food" },
};

const MEAT: Record<ProteinSource, string> = {
  chicken: "雞", turkey: "火雞", duck: "鴨", salmon: "鮭魚",
  // 白魚、其他魚在程式裡分開，是為了過敏排除算得準；給人看的時候都叫「魚」，跟成分表的寫法對得上
  whitefish: "魚", fish: "魚", beef: "牛", lamb: "羊", pork: "豬", venison: "鹿", insect: "昆蟲",
  poultry: "禽肉（沒寫哪種）", animal: "動物蛋白（沒寫哪種）",
};

function stageLabel(p: Product): string {
  const s = p.spec.lifeStage;
  if (s.includes("all")) return "成貓幼貓都能吃";
  if (s.length === 1 && s[0] === "puppy") return "幼貓專用";
  if (s.includes("senior") && s.includes("adult")) return "7 歲以上成貓";
  if (s.length === 1 && s[0] === "senior") return "高齡貓專用";
  return "成貓";
}

export default function Page() {
  const all = catalogOf("cat");
  const live = isLive("cat");
  const ready = liveCount("cat");
  // 候選款在前，對照款在後。對照款要講清楚為什麼放進來
  const candidates = all.filter((p) => !p.referenceOnly);
  const refs = all.filter((p) => p.referenceOnly);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="cat-food" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        貓飼料怎麼選
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "42ch" }}>
        把你家貓的狀況講一句，我們先把不適合的刪掉，剩下的才給你看。
      </p>

      <Decider defaultSpecies="cat" soonHint={false} />

      {!live && (
        <div style={soonBox}>
          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 16 }}>還在上架</p>
          <p style={{ margin: "0 0 8px", fontSize: 15, lineHeight: 1.9 }}>
            {all.length} 款的成分表我們一款一款讀完了。購買連結補好 {ready} 款，補到 {MIN_LIVE} 款就開放推薦。
          </p>
          <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
            在那之前裁決器先不推薦。推一款你點進去買不到的東西，比不推更糟。讀到的東西先攤開在下面。
          </p>
        </div>
      )}

      <p style={S.lbl}>先看這個</p>
      <Link href="/cat-food/hidden-chicken" style={feature}>
        <h2 style={featureTitle}>寫著鮭魚、鴨肉、火雞，成分表裡有雞</h2>
        <p style={featureBody}>
          一隻對雞過敏的貓換了三包「鮭魚口味」，很可能三包都有雞。
          逐筆核對台灣代理商的中文標示，附查核日期。
        </p>
      </Link>
      <Link href="/cat-food/how-much" style={{ ...feature, marginTop: 14 }}>
        <h2 style={featureTitle}>貓一天要吃多少飼料</h2>
        <p style={featureBody}>
          結紮的貓照狗的算法會多餵三成。一天幾克、這包吃幾天、一個月多少錢，算式全部寫出來。
        </p>
      </Link>

      <p style={S.lbl}>我們讀過的 {all.length} 款</p>
      <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
        數字照台灣代理商的中文標示，官網只給乾物基的，我們換算成同一個基準。
        碳水是用 100 減掉其他成分推算的，推估的地方每一款都有寫。
      </p>
      {candidates.map((p) => <Row key={p.id} p={p} live={live} />)}

      {refs.length > 0 && (
        <>
          <p style={S.lbl}>對照款</p>
          <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
            這幾款放進來是為了讓「刪掉」有東西可刪，我們不會推薦。
            它們的共同點是名字跟內容對不上，或是肉的來源沒寫清楚。
          </p>
          {refs.map((p) => <Row key={p.id} p={p} live={live} />)}
        </>
      )}

      {live && (
        <>
          <p style={S.lbl}>按過敏原</p>
          <div style={S.relRow}>
            {CAT_ALLERGENS.map((a) => (
              <Link key={a.slug} href={`/cat-food/${a.slug}`} style={S.relLink}>不含{a.zh}</Link>
            ))}
          </div>
          <p style={S.lbl}>按品種</p>
          <div style={S.relRow}>
            {CAT_BREEDS.map((b) => (
              <Link key={b.slug} href={`/cat-food/${b.slug}`} style={S.relLink}>{b.zh}</Link>
            ))}
          </div>
        </>
      )}

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          成分資料取自台灣代理商的中文標示與品牌官網。
          配方會改版，以你手上那一包的包裝標示為準。
        </p>
      </footer>
    </main>
  );
}

function Row({ p, live }: { p: Product; live: boolean }) {
  const meats = [...new Set(p.spec.proteinSources.map((k) => MEAT[k] ?? k))].join("、");
  const ok = recommendable(p);
  return (
    <article style={row}>
      <span style={S.brand}>{p.brand}</span>
      <h3 style={{ fontSize: 17.5, lineHeight: 1.5, margin: "2px 0 10px" }}>{p.name}</h3>

      <div style={tags}>
        <span style={tag}>{stageLabel(p)}</span>
        <span style={tag}>{p.spec.grainFree ? "無穀" : "含穀"}</span>
        {p.spec.singleSource && <span style={{ ...tag, ...tagGood }}>單一蛋白</span>}
        {p.spec.kcal && <span style={tag}>{p.spec.kcal.toLocaleString()} 大卡／公斤</span>}
      </div>

      <p style={{ margin: "0 0 8px", fontSize: 14.5, lineHeight: 1.85 }}>
        <span className="mono">粗蛋白 {p.spec.protein}%　碳水 {p.spec.carb}%</span>
        <span style={{ color: "var(--muted)" }}>　肉：{meats}</span>
      </p>
      <p style={{ margin: "0 0 10px", fontSize: 14.5, lineHeight: 1.85 }}>
        <b style={{ color: "var(--cut)" }}>什麼時候不要買：</b>{p.dealbreaker}
      </p>
      {p.knownIssues && (
        <p style={{ margin: "0 0 10px", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.85 }}>
          {p.knownIssues}
        </p>
      )}

      <div style={foot}>
        <span style={{ color: ok ? "var(--keep)" : "var(--faint)" }}>
          {ok
            // 還沒開張的時候裁決器會回「還在上架」，這裡不能叫人去問它
            ? live ? "可以買了，用上面的裁決器問" : "連結補好了，開張後就會推薦"
            : p.referenceOnly ? "對照款，不推薦" : "購買連結補齊中"}
        </span>
        {/* 只放我們自己的購買連結。以前這裡連去別家通路，讀者在那裡買我們拿不到 */}
        {shopLink(p.id) && (
          <a href={shopLink(p.id)!} rel="nofollow sponsored" style={{ color: "var(--accent)", fontWeight: 600 }}>
            去賣場看 →
          </a>
        )}
      </div>
    </article>
  );
}

const soonBox: React.CSSProperties = {
  marginTop: 28, background: "var(--sunken)", border: "1px solid var(--line)",
  borderRadius: 14, padding: "18px 22px",
};
const feature: React.CSSProperties = {
  display: "block", background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
  textDecoration: "none", color: "inherit",
};
const featureTitle: React.CSSProperties = {
  fontFamily: "var(--font-serif), serif", fontSize: 20, margin: "0 0 8px", lineHeight: 1.5,
};
const featureBody: React.CSSProperties = {
  margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.85,
};
const row: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, padding: "18px 20px 14px", marginBottom: 12,
};
const tags: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 };
const tag: React.CSSProperties = {
  fontSize: 12.5, padding: "3px 10px", borderRadius: 999,
  background: "var(--sunken)", border: "1px solid var(--line)", color: "var(--muted)",
};
const tagGood: React.CSSProperties = {
  background: "var(--keep-soft)", borderColor: "var(--keep)", color: "var(--keep)",
};
const foot: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "4px 12px",
  borderTop: "1px solid var(--line)", paddingTop: 10, fontSize: 13,
};
