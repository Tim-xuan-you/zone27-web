import type { Metadata } from "next";
import CheapestCard from "@/components/CheapestCard";
import Link from "next/link";
import { S } from "@/components/styles";
import { ALLERGENS, BREEDS } from "@/lib/slugs";
import SiteHeader from "@/components/SiteHeader";
import CheckCard from "@/components/CheckCard";
import ReadList from "@/components/ReadList";
import Decider from "@/components/Decider";
import ProductIndex from "@/components/ProductIndex";
import { catalogOf } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "狗飼料怎麼選",
  description:
    "依品種和過敏原，我們先幫你刪掉不適合的，剩下的才給你看。每一款都寫清楚什麼時候不要買。",
  alternates: { canonical: "/dog-food" },
};

export default function Index() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="dog-food" />

      <h1 style={{
        fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px",
      }}>
        狗飼料怎麼選
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 28px", maxWidth: "42ch" }}>
        點一下你家狗的年紀和狀況，我們先把不適合的刪掉，剩下的才給你看。
        不知道怎麼講的話，下面也可以直接挑品種或過敏原。
      </p>

      <Decider lockSpecies defaultSpecies="dog" />

      <p style={S.lbl}>先看這個</p>
      <CheckCard species="dog" style={{ marginBottom: 14 }} />
      <ReadList items={[
        { href: "/dog-food/hidden-chicken", title: "寫著低敏，成分表裡有雞", line: "換了三種低敏飼料還在抓，可能三包都有雞" },
        { href: "/dog-food/how-much", title: "狗一天要吃多少飼料", line: "一天幾克、這包吃幾天、一個月多少錢" },
        { href: "/dog-food/cans", title: "狗吃主食罐，一天要幾罐", line: "一罐看起來像一餐，其實要好幾罐" },
        { href: "/dog-food/grain-free", title: "無穀飼料到底有沒有比較好", line: "無穀不等於沒有雞，也不等於碳水比較低" },
        { href: "/dog-food/elimination-diet", title: "排除飲食法：找出牠對什麼過敏", line: "要跑滿八週，最後還要回測" },
      ]} />

      <CheapestCard species="dog" form="dry" />

      <ProductIndex products={catalogOf("dog")} />

      <p style={S.lbl}>按過敏原</p>
      <div style={S.relRow}>
        {ALLERGENS.map((a) => (
          <Link key={a.slug} href={`/dog-food/${a.slug}`} style={S.relLink}>
            不含{a.zh}
          </Link>
        ))}
      </div>

      {/* 品種有二十幾個，攤開佔掉快一個畫面。收起來，摘要先列前三個讓人知道裡面有什麼（2026-09-24） */}
      <details style={{ marginTop: 28 }}>
        <summary style={breedSummary}>按品種找：{BREEDS.slice(0, 3).map((b) => b.zh).join("、")}等 {BREEDS.length} 種</summary>
        <div style={{ ...S.relRow, marginTop: 12 }}>
          {BREEDS.map((b) => (
            <Link key={b.slug} href={`/dog-food/${b.slug}`} style={S.relLink}>{b.zh}</Link>
          ))}
        </div>
      </details>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 12.5, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          價格是人工查的，點進賣場以當下的標價為準。
        </p>
      </footer>
    </main>
  );
}

const breedSummary: React.CSSProperties = {
  cursor: "pointer", fontSize: 15.5, fontWeight: 700, color: "var(--muted)",
};
