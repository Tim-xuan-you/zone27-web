import type { Metadata } from "next";
import Link from "next/link";
import CategoryCards from "@/components/CategoryCards";
import Decider from "@/components/Decider";
import ReadList from "@/components/ReadList";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { categoriesOf } from "@/lib/categories";
import { catalogOf } from "@/lib/catalog";
import { NAME_HAS_CHICKEN } from "@/lib/chicken";

const CANS_UNNAMED = catalogOf("dog", "wet").filter((p) => !NAME_HAS_CHICKEN.test(p.name));
const CANS_HIDDEN = CANS_UNNAMED.filter((p) => p.chicken?.status === "hidden");

/**
 * 狗的動物頁。
 *
 * 這一頁欠很久了。lib/categories 的 animalHref 寫得很清楚：
 * 一個動物有兩個以上的類目，導覽列就連到 /狗、/貓 這一層。
 * 狗零食上線的那天，導覽列的「狗」就自動變成連到 /dog ——
 * 但這一頁沒建，所以全站每一頁的第一個連結都是 404。
 *
 * 教訓記在這裡：animalHref 會自己改變，頁面不會自己長出來。
 * 以後任何一個動物新增第二個類目，先建這一頁再上線。
 */

export const metadata: Metadata = {
  title: "狗飼料、狗主食罐、狗零食怎麼選",
  description:
    "點一下你家狗的年紀和狀況，我們先刪掉不適合的。每一款的成分表都讀過，名字寫鴨肉、鹿肉、鱉肉但成分表裡有雞的都標出來了。罐頭算一天要幾罐，零食照熱量算一天可以給幾支。",
  alternates: { canonical: "/dog" },
};

export default function Page() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="dog" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        你家的狗，現在在吃什麼？
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "40ch" }}>
        點一下牠的年紀和狀況，我們先把不適合的刪掉，剩下的才給你看。
        罐頭跟零食在下面，那兩個都要算份量。
      </p>

      {/* 第一次養的人不知道要點什麼，給他一條直接的路（2026-09-24） */}
      <Link href="/dog/first-time" style={{ display: "inline-block", margin: "0 0 20px", fontSize: 15.5, fontWeight: 700, color: "var(--accent)" }}>
        第一次養狗？先買哪幾樣，直接給你答案 →
      </Link>

      <Decider lockSpecies defaultSpecies="dog" />

      <p style={{ ...S.lbl, marginTop: 56 }}>狗的類目</p>
      <CategoryCards cats={categoriesOf("dog")} />

      <p style={S.lbl}>我們自己讀成分表</p>
      <ReadList items={[
        { href: "/dog-food/hidden-chicken", kicker: "飼料", title: "主打低敏、單一口味，成分表裡還是有雞", line: "逐筆核對，包含我們自己在推的那一款" },
        { href: "/dog-wet-food/hidden-chicken", kicker: "主食罐", title: "名字寫鹿肉、鱉肉的狗罐頭，第一二項是雞", line: <>名字沒寫雞的 {CANS_UNNAMED.length} 款，{CANS_HIDDEN.length} 款成分表裡有雞</> },
        { href: "/dog-food/elimination-diet", kicker: "飼料", title: "一直抓、一直舔腳，要怎麼排查", line: "換糧之前先搞清楚要排除什麼" },
        { href: "/dog-treat", kicker: "零食", title: "一支潔牙骨佔掉一天多少額度", line: "有 4 款一支就超過一整天" },
      ]} />

      <p style={S.lbl}>先算一下</p>
      <div style={S.relRow}>
        <Link href="/dog-food/how-much" style={S.relLink}>狗一天吃多少飼料</Link>
        <Link href="/dog-wet-food/how-much" style={S.relLink}>狗一天要吃幾罐</Link>
        <Link href="/dog-food/grain-free" style={S.relLink}>無穀飼料要不要買</Link>
      </div>

    </main>
  );
}
