import type { Metadata } from "next";
import Link from "next/link";
import CanCalc from "@/components/CanCalc";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { catalogOf } from "@/lib/catalog";
import { cansOf, canWord, mer } from "@/lib/engine";
import type { Product } from "@/lib/types";

/**
 * 貓一天要吃幾罐。
 *
 * 跟乾糧那一頁同一條公式，差在最後除的是一罐幾大卡。
 * 這一頁最有用的是下面那張表：我們讀過的主食罐，一罐幾大卡、4 公斤的貓一天幾罐。
 * 同樣 85 克，一包 57 大卡跟一罐 131 大卡都有，差兩倍多，照罐子大小估一定估錯。
 */

const TITLE = "貓一天要吃幾罐";
const PATH = "/cat-wet-food/how-much";
const EX_KG = 4;
const DAY = Math.round(mer(EX_KG, "adultFixed", "cat"));

function perCan(p: Product): number | null {
  const c = cansOf(p.price.unit);
  return c && p.spec.kcal ? Math.round((c.g / 1000) * p.spec.kcal) : null;
}

const TABLE = catalogOf("cat", "wet")
  .filter((p) => p.spec.complete !== false)
  .map((p) => ({ p, kcal: perCan(p) }))
  .filter((x): x is { p: Product; kcal: number } => x.kcal !== null)
  .sort((a, b) => a.kcal - b.kcal);

const LO = TABLE.length ? Math.floor((DAY / TABLE[TABLE.length - 1].kcal) * 10) / 10 : 0;
const HI = TABLE.length ? Math.ceil((DAY / TABLE[0].kcal) * 10) / 10 : 0;

export const metadata: Metadata = {
  title: TITLE,
  description:
    `看那一罐的熱量，不是看罐子大小。4 公斤已結紮的貓一天大約 ${DAY} 大卡，全吃主食罐一天要 ${LO} 到 ${HI} 罐。一個月多少錢、乾濕混餵怎麼算，計算機和算式都在這裡。`,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, type: "article" },
};

export default function Page() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "貓一天要吃幾罐主食罐？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `先算一天要多少熱量，再除以一罐的熱量。4 公斤已結紮的成貓一天大約 ${DAY} 大卡。我們讀過的主食罐一罐從 ${TABLE[0]?.kcal} 到 ${TABLE[TABLE.length - 1]?.kcal} 大卡，所以全吃罐頭一天要 ${LO} 到 ${HI} 罐。`,
        },
      },
      {
        "@type": "Question",
        name: "乾濕混餵要怎麼算？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "先算一天的總熱量，扣掉罐頭給的那一份，剩下的才換成乾飼料的克數。乾飼料照原本的量、罐頭另外加，等於一天多吃一餐，很多貓是這樣變胖的。",
        },
      },
      {
        "@type": "Question",
        name: "開過的罐頭可以放多久？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "蓋起來冰冷藏，一天內吃完。放在室溫的，吃不完的部分幾個小時內收起來。冰過的先回溫再給，很多貓不吃冷的。",
        },
      },
    ],
  };

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px 120px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />

      <SiteHeader current="cat-wet-food" />

      <h1 style={{ fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.45, margin: "0 0 18px" }}>
        {TITLE}
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 32px", maxWidth: "42ch" }}>
        看那一罐的熱量，不是看罐子大小。同樣 85 克，一包 57 大卡、一罐 131 大卡的都有。
        <b style={{ color: "var(--ink)" }}>算式寫在下面，你可以自己驗。</b>
      </p>

      <CanCalc />

      <p style={S.lbl}>我們讀過的主食罐，一罐幾大卡</p>
      <p style={{ margin: "0 0 12px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
        右邊是一隻 {EX_KG} 公斤、已結紮的成貓全吃這一款，一天要幾罐。熱量照包裝或品牌公布的數字。
      </p>
      {/* 手機上三欄會擠出畫面，所以規格和熱量收進左邊那一格，右邊只放答案 */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14.5 }}>
        <tbody>
          {TABLE.map(({ p, kcal }) => (
            <tr key={p.id} style={{ borderTop: "1px solid var(--line)" }}>
              <td style={td}>
                <span style={{ display: "block", fontSize: 12, color: "var(--faint)" }}>{p.brand}</span>
                {p.name}
                <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }} className="mono">
                  {p.price.unit} · 一{canWord(p)} {kcal} 大卡
                </span>
              </td>
              <td style={{ ...td, textAlign: "right", fontWeight: 700, whiteSpace: "nowrap", fontSize: 17, verticalAlign: "middle" }} className="mono">
                {(Math.round((DAY / kcal) * 10) / 10)} {canWord(p)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ margin: "12px 0 0", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.9 }}>
        皇家 A30+11W 官網沒寫熱量，不在表上。每一款的標示和來源在
        <Link href="/cat-wet-food" style={{ color: "var(--accent)" }}>貓主食罐</Link>那一頁。
      </p>

      <p style={S.lbl}>我們怎麼算的</p>
      <div style={box}>
        <div style={formula} className="mono">
          RER = 70 × 體重<sup>0.75</sup><br />
          MER = RER × 生命階段係數<br />
          一天幾罐 = MER ÷ 一罐的熱量
        </div>
        <p style={{ margin: "14px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
          跟<Link href="/cat-food/how-much" style={{ color: "var(--accent)" }}>乾糧的計算機</Link>是同一條公式、同一組係數，
          已結紮的成貓乘 1.2。罐頭的熱量是連水一起算的，所以一罐 80 克只有乾糧 20 多克的熱量。
        </p>
      </div>

      <p style={S.lbl}>乾濕混餵的話</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          先算一天的總熱量，<b>扣掉罐頭給的那一份</b>，剩下的才換成乾糧。上面的計算機選「一天一罐」就會幫你算。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
          很多貓變胖是這樣來的：乾糧照原本的量，罐頭另外加，等於一天多吃一餐。
        </p>
      </div>

      <p style={S.lbl}>開過的罐頭</p>
      <ul style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li>蓋起來冰冷藏，<b>一天內吃完</b>。</li>
        <li>放在碗裡沒吃完的，幾個小時內收起來，天氣熱的時候更要快。</li>
        <li>冰過的先回溫再給。很多貓不吃冷的，不是不喜歡這一款。</li>
      </ul>

      <p style={S.lbl}>誠實的邊界</p>
      <ul style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li><b>包裝背面的餵食建議比我們準</b>，只是記得結紮的貓要往下修。</li>
        <li>真正的依據是<b>體態</b>。照數字餵卻越來越胖，相信你的眼睛。</li>
        <li>貓完全不吃東西超過一天，不要等，直接看醫生。</li>
        <li>懷孕、哺乳、生病、手術後，都不適用這個算式。</li>
      </ul>

      <p style={S.lbl}>那要買哪一款</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把貓的狀況講一句，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            講了每月預算，我們會用同一個算式，把全吃罐頭會超過預算的先刪掉。
          </p>
        </div>
        <Link style={S.btn} href="/cat-wet-food">去貓主食罐</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/cat-wet-food/complementary" style={S.relLink}>副食罐可以當主食嗎</Link>
        <Link href="/cat-wet-food/hidden-chicken" style={S.relLink}>寫著鮭魚、鴨肉的罐頭，很多是雞湯煮的</Link>
        <Link href="/cat-food/how-much" style={S.relLink}>貓一天吃多少乾糧</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          這一頁的算式跟商品卡上的「一天大約幾罐」是同一個函式，不會給你兩種答案。
          估算不是餵食指示，牠的體態和你的獸醫才是依據。
        </p>
      </footer>
    </main>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
};
const formula: React.CSSProperties = {
  background: "var(--sunken)", border: "1px solid var(--line)",
  borderRadius: 10, padding: "16px 18px",
  fontSize: 14, lineHeight: 2.1,
};
const td: React.CSSProperties = { padding: "11px 10px 11px 0", lineHeight: 1.6 };
