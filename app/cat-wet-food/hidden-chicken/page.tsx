import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import data from "@/data/cat-wet-hidden-chicken.json";
import { claimReport } from "@/lib/contact";

/**
 * 罐頭版的「名字寫別的肉，成分表裡有雞」。
 *
 * 罐頭跟乾糧不一樣的地方是湯。罐頭要有湯汁，雞湯是最常見的湯底，
 * 所以一罐寫著鮭魚的罐頭，第一項是雞湯並不奇怪 —— 只是包裝正面看不出來。
 *
 * 紀律跟乾糧那兩頁一樣：每一筆掛可點的來源與查核日期，
 * 講清楚「含雞不是缺點，名字跟內容對不上才是」，
 * 而且也列出名字跟內容對得上的，讓讀者知道乾淨的標示長什麼樣子。
 */

const CASES = data.cases;
const CLEAN = data.clean;
const PATH = "/cat-wet-food/hidden-chicken";

const TITLE = "寫著鮭魚、鴨肉的貓罐頭，很多是雞湯煮的";

export const metadata: Metadata = {
  title: TITLE,
  description:
    `${data._meta.tally}逐筆核對台灣通路與品牌官網的中文標示，附來源連結與查核日期。`,
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
        name: "貓罐頭寫鮭魚口味，就代表沒有雞肉嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `不代表。${data._meta.tally}罐頭要有湯汁，雞湯是很常見的湯底。要確認只能翻到背面，看成分表的前三項。`,
        },
      },
      {
        "@type": "Question",
        name: "雞湯也算雞肉嗎？對雞過敏的貓可以喝嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "算。雞湯是用雞熬出來的，裡面有雞的蛋白質。正在查過敏原、或已經知道對雞過敏的貓，含雞湯的罐頭要一起避開。",
        },
      },
      {
        "@type": "Question",
        name: "寫「低敏」的罐頭，就一定適合過敏的貓嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "不一定。「低敏」多半是品牌自己的說法，不是檢驗結果。我們讀到一款叫低敏鴨肉的主食罐，成分表第二項就是雞肉。還是要看成分表。",
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

      <h1 style={{ fontSize: "clamp(27px,5.4vw,38px)", lineHeight: 1.42, margin: "0 0 18px" }}>
        寫著鮭魚、鴨肉的貓罐頭，<br />很多是雞湯煮的
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 10px", maxWidth: "42ch" }}>
        乾糧換掉雞了，罐頭也挑了鮭魚口味，貓還是在抓...先把罐頭翻到背面看第一項。
      </p>
      <p style={{ color: "var(--faint)", fontSize: 13, margin: "0 0 8px" }}>
        {CASES.length} 款逐筆核對 · 最後查核 {data._meta.checkedAt}
      </p>

      <p style={S.lbl}>我們讀到的</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.9, fontWeight: 700 }}>
          {data._meta.tally}
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          罐頭要有湯汁，雞湯香，貓也愛喝，是很常見的湯底。
          包裝正面寫的是口味，湯底寫在背面第一行，字很小。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          對大部分的貓來說這沒什麼。<b style={{ color: "var(--ink)" }}>只有正在查過敏原的時候，這件事會讓你白忙好幾個月</b>：
          乾糧換掉雞了，每天那一罐還在給雞。
        </p>
      </div>

      <p style={S.lbl}>自己看的話，看三個地方</p>
      <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li style={{ marginBottom: 8 }}>
          <b>第一項是什麼湯。</b>雞湯、肉湯、高湯都要看清楚，「魚湯」才是魚。只寫「水」的最單純。
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>前三項。</b>罐頭的成分表常常很長，排在前面的才是主體，後面的蔓越莓、南瓜份量很少。
        </li>
        <li>
          <b>「肉類」「動物蛋白」「水解蛋白」這種字。</b>沒寫是哪一種，就等於不能排除，要查過敏原的話先避開。
        </li>
      </ol>

      <p style={S.lbl}>逐筆核對</p>
      {CASES.map((c) => (
        <article key={c.id} style={card}>
          <span style={S.brand}>{c.brand}</span>
          <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 21, lineHeight: 1.45, margin: "2px 0 12px" }}>
            {c.name}
          </h2>
          <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)" }}>{c.impression}</p>

          <p style={found}>成分表寫的是</p>
          <ul style={{ margin: "0 0 16px", paddingLeft: 18, fontSize: 15, lineHeight: 1.9 }}>
            {c.found.map((f, i) => <li key={i}>{f}</li>)}
          </ul>

          <p style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, lineHeight: 1.75 }}>{c.verdict}</p>
          <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>{c.why}</p>

          <Sources checkedAt={c.checkedAt} sources={c.sources} item={`${c.id} ${c.brand} ${c.name}`} />
        </article>
      ))}

      <p style={S.lbl}>名字跟內容對得上的，長這樣</p>
      <div style={box}>
        <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.9 }}>
          不是每一罐都這樣。這三款寫什麼肉，裡面就是什麼肉：
        </p>
        <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 15, lineHeight: 1.95 }}>
          {CLEAN.map((g) => (
            <li key={g.name}>
              <b>{g.brand} {g.name}</b>：{g.found}
              <a href={g.url} target="_blank" rel="noopener nofollow" style={{ color: "var(--accent)", fontSize: 13, marginLeft: 6 }}>
                成分表 ↗
              </a>
            </li>
          ))}
        </ul>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.9, color: "var(--muted)" }}>
          最後那一款是副食罐，當點心可以，不能當正餐。
          <Link href="/cat-wet-food/complementary" style={{ color: "var(--accent)" }}>副食罐為什麼不能當正餐 →</Link>
        </p>
      </div>

      <p style={S.lbl}>這不代表這幾款不好</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          用雞湯煮不是缺點，一隻不對雞過敏的貓吃了完全沒問題。
          <b>我們在講的是名字跟內容物對不上這件事</b>，只有在查過敏原的時候它才重要。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          發現寫錯或資料過期，直接跟我們說，我們會改並且標日期。配方會改版，以你手上那一罐的標示為準。
        </p>
      </div>

      <p style={S.lbl}>那要買什麼</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把貓的狀況講一句，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            例如「英短三歲，對雞肉過敏，想找主食罐」。
          </p>
        </div>
        <Link style={S.btn} href="/cat-wet-food">去貓主食罐</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/cat-wet-food" style={S.relLink}>我們讀過的貓主食罐</Link>
        <Link href="/cat-wet-food/complementary" style={S.relLink}>副食罐可以當主食嗎</Link>
        <Link href="/cat-food/hidden-chicken" style={S.relLink}>乾糧版：寫著鮭魚、鴨肉、火雞，成分表裡有雞</Link>
        <Link href="/how-we-choose" style={S.relLink}>我們怎麼挑</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          成分資料取自台灣通路商品頁與品牌台灣官網的中文標示，每一筆都附了連結與查核日期。
          配方會改版，以你手上那一罐的標示為準。
        </p>
      </footer>
    </main>
  );
}

function Sources({ checkedAt, sources, item }: { checkedAt: string; sources: { label: string; url: string }[]; item: string }) {
  const report = claimReport(PATH, item);
  return (
    <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
      <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--faint)" }}>
        查核 {checkedAt} · 你可以自己點進去對
      </p>
      {sources.map((s) => (
        <a
          key={s.url}
          href={s.url}
          target="_blank"
          rel="noopener nofollow"
          style={{ display: "block", fontSize: 13, color: "var(--accent)", lineHeight: 1.9 }}
        >
          {s.label} ↗
        </a>
      ))}
      {report && (
        <a
          href={report}
          style={{ display: "inline-block", marginTop: 6, fontSize: 12.5, color: "var(--faint)", textDecoration: "underline", textUnderlineOffset: 3 }}
        >這一筆寫錯了？跟我們說</a>
      )}
    </div>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
};

const card: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "22px 22px 18px",
  marginBottom: 16,
};

const found: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 12, fontWeight: 600, letterSpacing: ".12em",
  textTransform: "uppercase", color: "var(--faint)", margin: "0 0 8px",
};
