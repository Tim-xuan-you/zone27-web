import type { Metadata } from "next";
import Link from "next/link";
import Decider from "@/components/Decider";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { catalogOf, isLive, liveCount, shopLink } from "@/lib/catalog";
import { MIN_LIVE } from "@/lib/categories";
import { cansOf, canWord, mer, recommendable } from "@/lib/engine";
import type { Product, ProteinSource } from "@/lib/types";

/**
 * 貓主食罐類目頁。
 *
 * 跟貓飼料那一頁同一個骨架，但罐頭要多講兩件乾糧不用講的事：
 *   1. 主食還是副食。副食罐當正餐吃久了會缺營養，這是罐頭最大的坑
 *   2. 數字要扣掉水分才比得起來。水分 76% 跟 86% 的罐頭，包裝上的蛋白質差一倍，扣掉水分可能差不多
 *
 * 還沒開張的時候，主角一樣是「我們讀過的那幾款」。
 */

const TITLE = "貓主食罐怎麼選";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "我們一款一款讀過台灣架上的貓罐頭標示：哪些是副食罐不能當正餐，哪些名字寫鮭魚、鴨肉，第一項卻是雞湯。每一款都寫清楚什麼時候不要買，一天要吃幾罐。",
  alternates: { canonical: "/cat-wet-food" },
  openGraph: { title: TITLE, type: "website" },
};

const MEAT: Record<ProteinSource, string> = {
  chicken: "雞", turkey: "火雞", duck: "鴨", salmon: "鮭魚",
  whitefish: "魚", fish: "魚", beef: "牛", lamb: "羊", pork: "豬", venison: "鹿", insect: "昆蟲",
  poultry: "禽肉（沒寫哪種）", animal: "沒寫來源的肉或蛋白",
};

function stageLabel(p: Product): string {
  const s = p.spec.lifeStage;
  if (s.includes("all")) return "成貓幼貓都能吃";
  if (s.length === 1 && s[0] === "puppy") return "幼貓專用";
  if (s.length === 1 && s[0] === "senior") return "老貓專用";
  return "成貓";
}

/** 一罐幾大卡。規格或熱量缺一個就是 null */
function kcalPerCan(p: Product): number | null {
  const c = cansOf(p.price.unit);
  return c && p.spec.kcal ? Math.round((c.g / 1000) * p.spec.kcal) : null;
}

export default function Page() {
  const all = catalogOf("cat", "wet");
  const live = isLive("cat", "wet");
  const ready = liveCount("cat", "wet");
  const candidates = all.filter((p) => !p.referenceOnly);
  const refs = all.filter((p) => p.referenceOnly);

  // 4 公斤結紮的貓全吃罐頭，一天要幾罐：從我們讀過的主食罐算出區間，不寫死
  const need = mer(4, "adultFixed", "cat");
  const perDay = candidates
    .map(kcalPerCan)
    .filter((k): k is number => k !== null)
    .map((k) => need / k);
  const lo = Math.floor(Math.min(...perDay) * 10) / 10;
  const hi = Math.ceil(Math.max(...perDay) * 10) / 10;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="cat-wet-food" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        {TITLE}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "42ch" }}>
        罐頭先翻到背面，看兩件事：是主食還是副食，第一項是不是雞湯。剩下的，把你家貓的狀況講一句，我們先刪掉不適合的。
      </p>

      <Decider defaultSpecies="cat" defaultForm="wet" soonHint={false} />

      {!live && (
        <div style={soonBox}>
          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 16 }}>還在上架</p>
          <p style={{ margin: "0 0 8px", fontSize: 15, lineHeight: 1.9 }}>
            {all.length} 款的標示我們一款一款讀完了。購買連結補好 {ready} 款，補到 {MIN_LIVE} 款就開放推薦。
          </p>
          <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
            在那之前裁決器先不推薦。推一款你點進去買不到的東西，比不推更糟。讀到的東西先攤開在下面。
          </p>
        </div>
      )}

      <p style={S.lbl}>先看這三篇</p>
      <div style={{ display: "grid", gap: 14 }}>
        <Link href="/cat-wet-food/complementary" style={feature}>
          <h2 style={featureTitle}>副食罐可以當主食嗎</h2>
          <p style={featureBody}>
            偶爾一餐沒關係，天天當正餐不行。怎麼分辨、副食罐該怎麼用，還有我們讀到的鈣差幾十倍。
          </p>
        </Link>
        <Link href="/cat-wet-food/hidden-chicken" style={feature}>
          <h2 style={featureTitle}>寫著鮭魚、鴨肉的罐頭，很多是雞湯煮的</h2>
          <p style={featureBody}>
            名字沒寫雞的 8 款，5 款成分表前三項就有雞。逐筆核對，附查核日期。
          </p>
        </Link>
        <Link href="/cat-wet-food/how-much" style={feature}>
          <h2 style={featureTitle}>貓一天要吃幾罐</h2>
          <p style={featureBody}>
            4 公斤結紮的貓全吃罐頭，一天要 {lo} 到 {hi} 罐，看那一罐的熱量。一個月多少錢、乾濕混餵怎麼算，一起寫出來。
          </p>
        </Link>
      </div>

      <p style={S.lbl}>我們讀過的 {candidates.length} 款主食罐</p>
      <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
        數字照罐子背面的標示，你翻過來對得上。罐頭的水分從七成多到將近九成，
        包裝上的蛋白質看起來都很低，扣掉水分之後才比得起來，所以兩個數字都列。
        碳水只有品牌自己公布、或是蛋白、脂肪、纖維、灰分、水分都寫齊的，我們才算。
      </p>
      {candidates.map((p) => <Row key={p.id} p={p} live={live} />)}

      {refs.length > 0 && (
        <>
          <p style={S.lbl}>對照款：副食罐</p>
          <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
            這兩款放進來，是為了讓裁決器的第一刀有東西可刪，也讓你看看副食罐的標示長什麼樣子。
            我們不會推薦它們當正餐。
          </p>
          {refs.map((p) => <Row key={p.id} p={p} live={live} />)}
        </>
      )}

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          標示資料取自台灣通路與品牌台灣官網的中文標示。
          配方會改版，以你手上那一罐的標示為準。本站透過購買連結取得分潤，這不影響推薦排序。
        </p>
      </footer>
    </main>
  );
}

function Row({ p, live }: { p: Product; live: boolean }) {
  const meats = [...new Set(p.spec.proteinSources.map((k) => MEAT[k] ?? k))].join("、");
  const ok = recommendable(p);
  const side = p.spec.complete === false;
  const kc = kcalPerCan(p);
  const af = p.spec.asFed;
  const carb =
    p.spec.carbBasis === "published" ? `碳水 ${af?.carb}%（品牌公布），扣掉水分是 ${p.spec.carb}%`
    : p.spec.carbBasis === "computed" ? `碳水扣掉水分約 ${p.spec.carb}%（用減法算的）`
    : "碳水：包裝沒寫灰分，算不出來";

  return (
    <article style={row}>
      <span style={S.brand}>{p.brand}</span>
      <h3 style={{ fontSize: 17.5, lineHeight: 1.5, margin: "2px 0 10px" }}>{p.name}</h3>

      <div style={tags}>
        <span style={side ? { ...tag, ...tagWarn } : { ...tag, ...tagGood }}>{side ? "副食罐" : "主食罐"}</span>
        <span style={tag}>{stageLabel(p)}</span>
        <span style={tag}>{p.spec.grainFree ? "無穀" : "含穀"}</span>
        {p.spec.singleSource && <span style={{ ...tag, ...tagGood }}>單一蛋白</span>}
        {kc !== null && <span style={tag}>一{canWord(p)} {kc} 大卡</span>}
        <span style={tag}>{p.price.unit}</span>
      </div>

      <p style={{ margin: "0 0 4px", fontSize: 14.5, lineHeight: 1.85 }}>
        <span className="mono">蛋白質 {af?.protein ?? p.spec.protein}%　水分 {p.spec.moisture}%</span>
        <span style={{ color: "var(--muted)" }}>　扣掉水分，蛋白質是 {p.spec.protein}%</span>
      </p>
      <p style={{ margin: "0 0 8px", fontSize: 14, lineHeight: 1.85, color: "var(--muted)" }}>
        {carb}　肉：{meats}
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
            ? live ? "可以買了，用上面的裁決器問" : "連結補好了，開張後就會推薦"
            : p.referenceOnly ? "對照款，不推薦當正餐" : "購買連結補齊中"}
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
const tagWarn: React.CSSProperties = {
  background: "var(--warn-soft)", borderColor: "var(--warn)", color: "var(--ink)",
};
const foot: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "4px 12px",
  borderTop: "1px solid var(--line)", paddingTop: 10, fontSize: 13,
};
