import type { Metadata } from "next";
import Link from "next/link";
import CategoryCards from "@/components/CategoryCards";
import Decider from "@/components/Decider";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { categoriesOf } from "@/lib/categories";

/**
 * 貓的動物頁。
 *
 * 貓有兩個以上的類目之後，導覽列的「貓」連到這裡，不直接進其中一個類目。
 * 這一頁只做三件事：一個裁決器（可以切乾糧、主食罐）、類目卡、我們讀成分表讀到的東西。
 * 類目卡從 lib/categories 讀，貓多一個類目，這裡自己多一張。
 */

export const metadata: Metadata = {
  title: "貓飼料、主食罐、貓砂、零食怎麼選",
  description:
    "乾糧跟主食罐都可以問。點一下你家貓的年紀和狀況，我們先刪掉不適合的；每一款的成分表都讀過，名字跟內容對不上的也標出來了。貓砂照材質判能不能沖馬桶，零食照熱量算一天可以給幾條。",
  alternates: { canonical: "/cat" },
};

export default function Page() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="cat" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        你家的貓，吃乾糧還是罐頭？
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "40ch" }}>
        兩種都可以問。點一下牠的年紀和狀況，我們先把不適合的刪掉，剩下的才給你看。
        貓砂跟零食在下面。
      </p>

      {/* 第一次養的人不知道要點什麼，給他一條直接的路（2026-09-24） */}
      <Link href="/cat/first-time" style={{ display: "inline-block", margin: "0 0 20px", fontSize: 15.5, fontWeight: 700, color: "var(--accent)" }}>
        第一次養貓？先買哪幾樣，直接給你答案 →
      </Link>

      <Decider defaultSpecies="cat" />

      <p style={{ ...S.lbl, marginTop: 56 }}>貓的類目</p>
      <CategoryCards cats={categoriesOf("cat")} />

      <p style={S.lbl}>我們自己讀成分表</p>
      <div style={grid}>
        <Link href="/cat-food/hidden-chicken" style={feature}>
          <span style={kicker}>乾糧</span>
          <h2 style={featureTitle}>寫著鮭魚、鴨肉、火雞，成分表裡有雞</h2>
          <p style={featureBody}>有一款叫鴨肉的，雞加起來比鴨還多。</p>
        </Link>
        <Link href="/cat-wet-food/hidden-chicken" style={feature}>
          <span style={kicker}>主食罐</span>
          <h2 style={featureTitle}>寫著鮭魚、鴨肉的罐頭，很多是雞湯煮的</h2>
          <p style={featureBody}>名字沒寫雞的 8 款罐頭，5 款前三項就有雞。</p>
        </Link>
        <Link href="/cat-wet-food/complementary" style={feature}>
          <span style={kicker}>主食罐</span>
          <h2 style={featureTitle}>副食罐可以當主食嗎</h2>
          <p style={featureBody}>偶爾一餐沒關係，天天當正餐不行。怎麼分辨寫在這裡。</p>
        </Link>
      </div>

      <p style={S.lbl}>先算一下</p>
      <div style={S.relRow}>
        <Link href="/cat-food/how-much" style={S.relLink}>貓一天吃多少乾糧</Link>
        <Link href="/cat-wet-food/how-much" style={S.relLink}>貓一天吃幾罐</Link>
      </div>

    </main>
  );
}

const grid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14,
};
const feature: React.CSSProperties = {
  display: "block", background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
  textDecoration: "none", color: "inherit",
};
const kicker: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace", fontSize: 12.5, fontWeight: 600,
  letterSpacing: ".14em", color: "var(--faint)",
};
const featureTitle: React.CSSProperties = {
  fontFamily: "var(--font-serif), serif", fontSize: 20, margin: "6px 0 8px", lineHeight: 1.5,
};
const featureBody: React.CSSProperties = {
  margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.85,
};
