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
import { CAT_ALLERGENS, CAT_BREEDS } from "@/lib/slugs";

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

export default function Page() {
  const all = catalogOf("cat");
  const live = isLive("cat");
  const ready = liveCount("cat");
  // 候選款在前，對照款在後。對照款要講清楚為什麼放進來

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="cat-food" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        貓飼料怎麼選
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "42ch" }}>
        點一下你家貓的年紀和狀況，我們先把不適合的刪掉，剩下的才給你看。
      </p>

      <Decider lockSpecies defaultSpecies="cat" soonHint={false} />

      {!live && (
        <div style={soonBox}>
          <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 17 }}>還在上架</p>
          <p style={{ margin: "0 0 8px", fontSize: 15.5, lineHeight: 1.9 }}>
            {all.length} 款的成分表我們一款一款讀完了。購買連結補好 {ready} 款，補到 {MIN_LIVE} 款就開放推薦。
          </p>
          <p style={{ margin: 0, fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
            在那之前裁決器先不推薦。推一款你點進去買不到的東西，比不推更糟。讀到的東西先攤開在下面。
          </p>
        </div>
      )}

      <p style={S.lbl}>先看這個</p>
      <CheckCard species="cat" style={{ marginBottom: 14 }} />
      <ReadList items={[
        { href: "/cat-food/hidden-chicken", title: "寫著鮭魚、鴨肉、火雞，成分表裡有雞", line: "對雞過敏的貓換了三包鮭魚口味，可能三包都有雞" },
        { href: "/cat-food/how-much", title: "貓一天要吃多少飼料", line: "結紮的貓照狗的算法會多餵三成" },
      ]} />

      {live && <CheapestCard species="cat" form="dry" />}

      <ProductIndex products={all} />


      {live && (
        <>
          <p style={S.lbl}>按過敏原</p>
          <div style={S.relRow}>
            {CAT_ALLERGENS.map((a) => (
              <Link key={a.slug} href={`/cat-food/${a.slug}`} style={S.relLink}>不含{a.zh}</Link>
            ))}
          </div>
          {/* 品種有二十幾個，攤開佔掉快一個畫面。收起來，摘要先列前三個讓人知道裡面有什麼（2026-09-24） */}
          <details style={{ marginTop: 28 }}>
            <summary style={breedSummary}>按品種找：{CAT_BREEDS.slice(0, 3).map((b) => b.zh).join("、")}等 {CAT_BREEDS.length} 種</summary>
            <div style={{ ...S.relRow, marginTop: 12 }}>
              {CAT_BREEDS.map((b) => (
                <Link key={b.slug} href={`/cat-food/${b.slug}`} style={S.relLink}>{b.zh}</Link>
              ))}
            </div>
          </details>
        </>
      )}

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 12.5, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          成分資料取自台灣代理商的中文標示與品牌官網。
          配方會改版，以你手上那一包的包裝標示為準。
        </p>
      </footer>
    </main>
  );
}


const soonBox: React.CSSProperties = {
  marginTop: 28, background: "var(--sunken)", border: "1px solid var(--line)",
  borderRadius: 14, padding: "18px 22px",
};

const breedSummary: React.CSSProperties = {
  cursor: "pointer", fontSize: 15.5, fontWeight: 700, color: "var(--muted)",
};
