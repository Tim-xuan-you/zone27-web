import type { Metadata } from "next";
import Link from "next/link";
import CategoryCards from "@/components/CategoryCards";
import Decider from "@/components/Decider";
import ReadList from "@/components/ReadList";
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

      <Decider lockSpecies defaultSpecies="cat" />

      <p style={{ ...S.lbl, marginTop: 56 }}>貓的類目</p>
      <CategoryCards cats={categoriesOf("cat")} />

      <p style={S.lbl}>我們自己讀成分表</p>
      <ReadList items={[
        { href: "/cat-food/hidden-chicken", kicker: "乾糧", title: "寫著鮭魚、鴨肉、火雞，成分表裡有雞", line: "有一款叫鴨肉的，雞加起來比鴨還多" },
        { href: "/cat-wet-food/hidden-chicken", kicker: "主食罐", title: "寫著鮭魚、鴨肉的罐頭，很多是雞湯煮的", line: "名字沒寫雞的 8 款，5 款前三項就有雞" },
        { href: "/cat-wet-food/complementary", kicker: "主食罐", title: "副食罐可以當主食嗎", line: "偶爾一餐沒關係，天天當正餐不行" },
      ]} />

      <p style={S.lbl}>先算一下</p>
      <div style={S.relRow}>
        <Link href="/cat-food/how-much" style={S.relLink}>貓一天吃多少乾糧</Link>
        <Link href="/cat-wet-food/how-much" style={S.relLink}>貓一天吃幾罐</Link>
      </div>

    </main>
  );
}
