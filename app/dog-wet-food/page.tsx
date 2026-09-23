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
import { NAME_HAS_CHICKEN } from "@/lib/chicken";
import type { Product } from "@/lib/types";

/**
 * 狗主食罐類目頁。
 *
 * 跟貓主食罐同一個骨架，但這個類目的重點不一樣。
 *
 * 貓那邊最大的坑是「主食罐還是副食罐」，因為台灣架上一半的貓罐頭是副食。
 * 狗這邊我們讀的 12 款全部自稱主食罐，沒有一款寫副食 —— 所以第一刀不在那裡。
 *
 * 狗主食罐真正的坑有兩個，而且都是算出來的，不是講出來的：
 *
 *   1. 名字沒寫雞的 5 款，4 款成分表裡有雞。而且是鹿肉、鱉肉、四種鮮魚
 *      這種「稀有蛋白」的名字，會特地挑這種口味的，常常就是想避開雞。
 *
 *   2. 同樣叫主食罐，罐子上的蛋白質從 5% 到 16.2%，差三倍多。
 *      扣掉水分只差一點五倍，排名還會翻過來（/dog-wet-food/protein）。
 *      蛋白 5% 的那一款自己標「100% 營養完整均衡」，也標了餵食量：
 *      5 公斤的狗一天 5 又 1/3 盒。狗越大，那個數字越可怕。
 *
 * 所以這一頁的排序、數字、款數，全部從資料算，一個都不寫死。
 * 資料一改，頁面跟著改；寫死的數字遲早會變成謊話。
 */

const TITLE = "狗主食罐怎麼選";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "我們一款一款讀過台灣架上的狗罐頭標示。名字沒寫雞的 5 款裡，4 款成分表裡有雞，而且都是鹿肉、鱉肉、四種鮮魚這種稀有蛋白的名字。每一款都寫清楚什麼時候不要買、一罐幾大卡、一天要幾罐。",
  alternates: { canonical: "/dog-wet-food" },
  openGraph: { title: TITLE, type: "website" },
};

/** 一罐幾大卡。規格或熱量缺一個就是 null */
function kcalPerCan(p: Product): number | null {
  const c = cansOf(p.price.unit);
  return c && p.spec.kcal ? Math.round((c.g / 1000) * p.spec.kcal) : null;
}

export default function Page() {
  const all = catalogOf("dog", "wet");
  const live = isLive("dog", "wet");
  const ready = liveCount("dog", "wet");
  const candidates = all.filter((p) => !p.referenceOnly);

  // 名字沒寫雞的有幾款、其中幾款成分表裡有雞。這是這一頁的招牌數字，一定要用算的
  const noChickenName = all.filter((p) => !NAME_HAS_CHICKEN.test(p.name));
  const hidden = noChickenName.filter((p) => p.chicken?.status === "hidden");

  // 蛋白質（照罐子上的標示）差多少
  const proteins = all.map((p) => p.spec.asFed?.protein ?? p.spec.protein);
  const pLo = Math.min(...proteins);
  const pHi = Math.max(...proteins);

  // 12 公斤結紮的成犬全吃罐頭，一天要幾罐
  const need = mer(12, "adultFixed", "dog");
  const perDay = candidates
    .map(kcalPerCan)
    .filter((k): k is number => k !== null)
    .map((k) => need / k);
  // 跟 /how-much、分享圖、llms.txt 用同一種取法（四捨五入到一位），不然同一個數字各頁講的不一樣
  const lo = Math.min(...perDay).toFixed(1);
  const hi = Math.max(...perDay).toFixed(1);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="dog-wet-food" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        {TITLE}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "42ch" }}>
        我們讀的這 {all.length} 款狗罐頭，全部自稱主食罐。
        坑在別的地方：名字寫鹿肉、鱉肉的，成分表前兩項常常是雞。
      </p>

      <Decider lockSpecies defaultSpecies="dog" defaultForm="wet" soonHint={false} />

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
      <CheckCard species="dog" style={{ marginBottom: 14 }} />
      <ReadList items={[
        { href: "/dog-wet-food/hidden-chicken", title: "名字寫鹿肉、鱉肉的狗罐頭，第一二項是雞", line: <>名字沒寫雞的 {noChickenName.length} 款，{hidden.length} 款成分表裡有雞</> },
        { href: "/dog-wet-food/how-much", title: "狗一天要吃幾罐、一個月多少錢", line: <>12 公斤結紮的成犬全吃罐頭，一天 {lo} 到 {hi} 罐</> },
        { href: "/dog-wet-food/protein", title: "罐子上的蛋白質差三倍，大部分是水", line: <>罐子上寫 {pLo}% 到 {pHi}%，扣掉水分排名整個翻過來</> },
      ]} />

      {live && <CheapestCard species="dog" form="wet" />}

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
