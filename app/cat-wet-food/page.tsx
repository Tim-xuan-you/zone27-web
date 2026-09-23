import type { Metadata } from "next";
import CheapestCard from "@/components/CheapestCard";
import Link from "next/link";
import Decider from "@/components/Decider";
import SiteHeader from "@/components/SiteHeader";
import ProductIndex from "@/components/ProductIndex";
import CheckCard from "@/components/CheckCard";
import ReadList from "@/components/ReadList";
import { S } from "@/components/styles";
import { catalogOf, isLive, liveCount } from "@/lib/catalog";
import { MIN_LIVE } from "@/lib/categories";
import { cansOf, mer } from "@/lib/engine";
import type { Product } from "@/lib/types";

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
        罐頭先翻到背面，看兩件事：是主食還是副食，第一項是不是雞湯。剩下的，點一下你家貓的年紀和狀況，我們先刪掉不適合的。
      </p>

      <Decider lockSpecies defaultSpecies="cat" defaultForm="wet" soonHint={false} />

      {!live && (
        <div style={soonBox}>
          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 17 }}>還在上架</p>
          <p style={{ margin: "0 0 8px", fontSize: 15.5, lineHeight: 1.9 }}>
            {all.length} 款的標示我們一款一款讀完了。購買連結補好 {ready} 款，補到 {MIN_LIVE} 款就開放推薦。
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
            在那之前裁決器先不推薦。推一款你點進去買不到的東西，比不推更糟。讀到的東西先攤開在下面。
          </p>
        </div>
      )}

      <p style={S.lbl}>先看這個</p>
      <CheckCard species="cat" style={{ marginBottom: 14 }} />
      <ReadList items={[
        { href: "/cat-wet-food/complementary", title: "副食罐可以當主食嗎", line: "偶爾一餐沒關係，天天當正餐不行" },
        { href: "/cat-wet-food/hidden-chicken", title: "寫著鮭魚、鴨肉的罐頭，很多是雞湯煮的", line: "名字沒寫雞的 8 款，5 款前三項就有雞" },
        { href: "/cat-wet-food/how-much", title: "貓一天要吃幾罐", line: <>4 公斤結紮的貓全吃罐頭，一天 {lo} 到 {hi} 罐</> },
      ]} />

      {live && <CheapestCard species="cat" form="wet" />}

      <ProductIndex products={all} />


      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 12.5, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          標示資料取自台灣通路與品牌台灣官網的中文標示。
          配方會改版，以你手上那一罐的標示為準。
        </p>
      </footer>
    </main>
  );
}


const soonBox: React.CSSProperties = {
  marginTop: 28, background: "var(--sunken)", border: "1px solid var(--line)",
  borderRadius: 14, padding: "18px 22px",
};
