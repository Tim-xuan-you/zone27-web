import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import data from "@/data/cat-hidden-chicken.json";
import { claimReport } from "@/lib/contact";

/**
 * 貓飼料版的「名字寫別的肉，成分表裡有雞」。
 *
 * 貓的情況比狗更明顯：貓飼料幾乎都用「口味」命名，鮭魚、鮪魚、鴨肉，
 * 而雞是最便宜、最常見的肉。一隻對雞過敏的貓，飼主換了三包「鮭魚口味」，
 * 很可能三包都有雞。
 *
 * 紀律跟狗那一頁一樣：每一筆掛可點的來源與查核日期，
 * 而且講清楚「含雞不是缺點，名字跟內容對不上才是」。
 */

const CASES = data.cases;
const ALSO = data.alsoMismatched;
const GRAIN = data.grainLabel;

const TITLE = "寫著鮭魚、鴨肉、火雞，成分表裡有雞";

export const metadata: Metadata = {
  title: TITLE,
  description:
    "台灣架上幾款貓飼料，名字寫的是鴨肉、火雞、鮭魚，成分表前四項就有雞。逐筆核對台灣代理商的中文標示，附來源連結與查核日期。",
  alternates: { canonical: "/cat-food/hidden-chicken" },
  openGraph: { title: TITLE, type: "article" },
};

export default function Page() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "貓飼料寫鮭魚口味或鴨肉口味，就代表沒有雞肉嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "不代表。貓飼料的名字大多是口味，不是成分清單。我們讀過的 ACANA 草原盛宴貓（鴨肉）、紐頓 T22 無穀貓（品名把火雞放前面）、冠能成貓鮮鮭室內化毛，成分表前四項都有雞。要確認只有一個方法：看成分表前五項，再看油脂和香料那兩行。",
        },
      },
      {
        "@type": "Question",
        name: "通路標「無穀」的貓飼料，就一定沒有穀物嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "不一定。我們查到 ACANA 豐盛漁獲貓、田園收穫貓，還有紐頓 I19、I17 被通路歸在無穀分類，但成分表裡有燕麥、糙米或大麥。以成分表為準，不要只看篩選標籤。",
        },
      },
      {
        "@type": "Question",
        name: "成分表裡的雞脂肪，對雞肉過敏的貓有影響嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "脂肪幾乎不含蛋白質，多數對雞過敏的貓吃含雞脂肪的飼料沒有問題。但如果正在做嚴格的排除飲食，或貓對雞的反應很劇烈，先問過獸醫再決定比較安全。",
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

      <SiteHeader current="cat-food" />

      <h1 style={{ fontSize: "clamp(27px,5.4vw,38px)", lineHeight: 1.42, margin: "0 0 18px" }}>
        寫著鮭魚、鴨肉、火雞，<br />成分表裡有雞
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 10px", maxWidth: "42ch" }}>
        貓一直抓下巴、抓脖子，換了三包「鮭魚口味」還是一樣...很可能那三包都有雞。
      </p>
      <p style={{ color: "var(--faint)", fontSize: 13, margin: "0 0 8px" }}>
        {CASES.length + ALSO.length} 款逐筆核對 · 最後查核 {data._meta.checkedAt}
      </p>

      <p style={S.lbl}>問題出在哪</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          <b>貓飼料的名字，幾乎都是口味。</b>
          鮭魚、鮪魚、鴨肉寫在包裝最大的字，雞肉排在成分表前面、字很小。
          雞是最便宜也最常見的肉，出現在各種口味裡一點都不奇怪。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          對大部分的貓來說這沒什麼。<b style={{ color: "var(--ink)" }}>只有正在查過敏原的時候，這件事會讓你白忙好幾個月</b>：
          以為換掉雞了，其實一直在吃雞。
        </p>
      </div>

      <p style={S.lbl}>自己看的話，看三個地方</p>
      <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li style={{ marginBottom: 8 }}>
          <b>成分表前五項。</b>排在前面的才是配方主體，排在後面的蔓越莓不影響什麼。
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>「禽肉」「動物蛋白」這種字。</b>沒寫是哪一種，就等於不能排除，當作有雞比較保險。
        </li>
        <li>
          <b>香料那一行。</b>「口感增強香料（含雞肝）」也算，而且它不會出現在包裝正面。
        </li>
      </ol>

      <p style={S.lbl}>逐筆核對</p>
      {CASES.map((c) => (
        <article key={c.id} style={card}>
          <span style={S.brand}>{c.brand}</span>
          <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 21, lineHeight: 1.45, margin: "2px 0 12px" }}>
            {c.name}
          </h2>
          {c.shelfNames.length > 1 && (
            <p style={{ margin: "0 0 4px", fontSize: 14.5, color: "var(--muted)" }}>
              架上常見的寫法：{c.shelfNames.join("、")}
            </p>
          )}
          <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)" }}>{c.impression}</p>

          <p style={found}>成分表寫的是</p>
          <ul style={{ margin: "0 0 16px", paddingLeft: 18, fontSize: 15, lineHeight: 1.9 }}>
            {c.found.map((f, i) => <li key={i}>{f}</li>)}
          </ul>

          <p style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, lineHeight: 1.75 }}>{c.verdict}</p>
          <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>{c.why}</p>

          {"note" in c && c.note && (
            <p style={{
              margin: "0 0 16px", fontSize: 14, lineHeight: 1.9,
              background: "var(--warn-soft)", border: "1px solid var(--warn)",
              borderRadius: 8, padding: "12px 14px",
            }}>{c.note}</p>
          )}

          <Sources checkedAt={c.checkedAt} sources={c.sources} item={`${c.id} ${c.brand} ${c.name}`} />
        </article>
      ))}

      <p style={S.lbl}>名字跟內容對不上的，還有這兩種</p>
      {ALSO.map((c) => (
        <article key={c.id} style={card}>
          <span style={S.brand}>{c.brand}</span>
          <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 19, lineHeight: 1.45, margin: "2px 0 10px" }}>
            {c.name}
          </h2>
          <p style={{ margin: "0 0 12px", fontSize: 14.5, color: "var(--muted)" }}>{c.impression}</p>
          <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 15, lineHeight: 1.9 }}>
            {c.found.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
          <p style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, lineHeight: 1.75 }}>{c.verdict}</p>
          <Sources checkedAt={c.checkedAt} sources={c.sources} item={`${c.id} ${c.brand} ${c.name}`} />
        </article>
      ))}

      <p style={S.lbl}>順便一提：標「無穀」的也要看</p>
      <div style={box}>
        <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.9 }}>
          我們查資料的時候，發現有幾款被通路歸在「無穀」分類，成分表裡卻有穀物：
        </p>
        <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 15, lineHeight: 1.95 }}>
          {GRAIN.map((g) => (
            <li key={g.name}>
              <b>{g.brand} {g.name}</b>：{g.found}
              <a href={g.url} target="_blank" rel="noopener nofollow" style={{ color: "var(--accent)", fontSize: 13, marginLeft: 6 }}>
                成分表 ↗
              </a>
            </li>
          ))}
        </ul>
        <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.9, color: "var(--muted)" }}>
          含穀本身不是問題，貓對穀物過敏的比例很低。問題是篩選標籤不可靠，要找無穀的話，看成分表比看分類準。
        </p>
      </div>

      <p style={S.lbl}>這不代表這幾款不好</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          含雞肉本身不是缺點，一隻不對雞過敏的貓吃了完全沒問題。
          <b>我們在講的是名字跟內容物對不上這件事</b>，只有在查過敏原的時候它才重要。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          發現寫錯或資料過期，直接跟我們說，我們會改並且標日期。配方會改版，以你手上那一包的標示為準。
        </p>
      </div>

      <p style={S.lbl}>那要買什麼</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把貓的狀況講一句，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            例如「英短三歲，一直抓下巴，換過兩種鮭魚口味都沒改善」。
          </p>
        </div>
        <Link style={S.btn} href="/cat-food">去貓飼料</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/cat-food" style={S.relLink}>我們讀過的貓飼料</Link>
        <Link href="/cat-food/how-much" style={S.relLink}>貓一天吃多少</Link>
        <Link href="/dog-food/hidden-chicken" style={S.relLink}>狗飼料版：寫著低敏，成分表裡有雞</Link>
        <Link href="/how-we-choose" style={S.relLink}>我們怎麼挑</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          成分資料取自台灣通路商品頁上的代理商中文標示，每一筆都附了連結與查核日期。
          配方會改版，以你手上那一包的包裝標示為準。
        </p>
      </footer>
    </main>
  );
}

function Sources({ checkedAt, sources, item }: { checkedAt: string; sources: { label: string; url: string }[]; item: string }) {
  const report = claimReport("/cat-food/hidden-chicken", item);
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
