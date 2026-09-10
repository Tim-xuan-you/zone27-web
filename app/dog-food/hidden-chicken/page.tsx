import type { Metadata } from "next";
import Link from "next/link";
import { S } from "@/components/styles";
import data from "@/data/hidden-chicken.json";
import SiteHeader from "@/components/SiteHeader";

/**
 * 「標榜低敏但含雞肉」。
 *
 * 這一頁抄不走 —— 要抄的人得自己一款一款去讀成分表。
 * 那正是它的價值：搜尋「XX 飼料 有雞肉嗎」的人現在找不到答案，
 * 因為沒有人願意做這種苦工。
 *
 * 兩條紀律：
 * 1. 每一筆都掛可點的來源與查核日期。指名道姓寫錯就是我們的責任。
 * 2. 我們自己推薦的那款也要寫進來（hc-04）。少了它，這一頁就只是打對手。
 */

const CASES = data.cases;

export const metadata: Metadata = {
  title: "寫著低敏，成分表裡有雞",
  description:
    "台灣架上幾款主打低敏或單一口味的狗飼料，成分表其實有雞。逐筆核對，附成分表位置、來源連結與查核日期，也包含我們自己推薦的那一款。",
  alternates: { canonical: "/dog-food/hidden-chicken" },
  openGraph: { title: "寫著低敏，成分表裡有雞", type: "article" },
};

export default function Page() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "飼料名字寫火雞或鴨肉，就代表沒有雞肉嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "不代表。商品名上的肉是口味標籤，不是成分清單。台灣通路的品名還常常跟原廠不一樣，同一款有的寫「火雞+雞肉」，有的只寫「火雞」。要確認只有一個方法：看成分表前五項，再看油脂和香料那兩行。",
        },
      },
      {
        "@type": "Question",
        name: "「無穀」是不是就等於「低敏」？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "不是。無穀講的是沒有小麥玉米這類穀物，跟雞肉沒有關係。狗最常見的食物過敏原是動物蛋白，不是穀物。一包無穀飼料裡有雞肉粉、雞脂肪、雞肉香料，完全正常。",
        },
      },
      {
        "@type": "Question",
        name: "成分表裡的雞脂肪，對雞肉過敏的狗有影響嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "有品牌主張雞脂肪經過離心分離、不含雞蛋白，因此不會引發雞肉過敏反應。這是品牌的說法，我們沒有能力驗證。如果你的狗對雞的反應很劇烈，把這一行納入考慮再決定比較安全。",
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

      <SiteHeader current="dog-food" />

      <h1 style={{ fontSize: "clamp(27px,5.4vw,38px)", lineHeight: 1.42, margin: "0 0 18px" }}>
        寫著低敏，成分表裡有雞
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 10px", maxWidth: "42ch" }}>
        換了三種「低敏」飼料，狗還是抓...很多時候是那三包裡面都有雞。
      </p>
      <p style={{ color: "var(--faint)", fontSize: 13, margin: "0 0 8px" }}>
        {CASES.length} 款逐筆核對 · 最後查核 {data._meta.checkedAt}
      </p>

      {/* ── 先講原理，不然下面的清單只是四則八卦 ── */}
      <p style={S.lbl}>問題出在哪</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          <b>商品名上的那塊肉是口味，不是成分清單。</b>
          原廠的配方名跟台灣通路掛的品名常常對不上。同一款飼料，有的賣場老實寫「火雞+雞肉」，
          有的就只留「火雞」兩個字。你在哪一家看到，決定你會不會踩到。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          另一個常見的誤會：<b style={{ color: "var(--ink)" }}>「無穀」不等於「無雞」</b>。
          無穀講的是沒有小麥玉米，跟雞肉一點關係都沒有。
        </p>
      </div>

      <p style={S.lbl}>自己看的話，看三個地方</p>
      <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li style={{ marginBottom: 8 }}>
          <b>成分表前五項。</b>排在前面的才是配方主體，排在第 20 名的那顆藍莓不影響什麼。
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>油脂那一行。</b>「雞脂肪」很常見，就算蛋白源完全沒有雞。
        </li>
        <li>
          <b>香料那一行。</b>「天然雞肉香料」也算，而且它幾乎不會出現在商品名上。
        </li>
      </ol>

      {/* ── 清單 ── */}
      <p style={S.lbl}>逐筆核對</p>
      {CASES.map((c) => (
        <article key={c.id} style={{ ...card, ...(("ours" in c && c.ours) ? oursCard : null) }}>
          {"ours" in c && c.ours && <p style={oursTag}>這款我們自己在推</p>}

          <span style={S.brand}>{c.brand}</span>
          <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 21, lineHeight: 1.45, margin: "2px 0 12px" }}>
            {c.name}
          </h2>

          <p style={{ margin: "0 0 4px", fontSize: 14.5, color: "var(--muted)" }}>
            架上常見的寫法：{c.shelfNames.join("、")}
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)" }}>
            {c.impression}
          </p>

          <p style={found}>成分表寫的是</p>
          <ul style={{ margin: "0 0 16px", paddingLeft: 18, fontSize: 15, lineHeight: 1.9 }}>
            {c.found.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>

          <p style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 700, lineHeight: 1.75 }}>
            {c.verdict}
          </p>
          <p style={{ margin: "0 0 16px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
            {c.why}
          </p>

          {"note" in c && c.note && (
            <p style={{
              margin: "0 0 16px", fontSize: 14, lineHeight: 1.9,
              background: "var(--warn-soft)", border: "1px solid var(--warn)",
              borderRadius: 8, padding: "12px 14px",
            }}>{c.note}</p>
          )}

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: "var(--faint)" }}>
              查核 {c.checkedAt} · 你可以自己點進去對
            </p>
            {c.sources.map((s) => (
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
          </div>
        </article>
      ))}

      {/* ── 不要讓這一頁變成「這些飼料很爛」 ── */}
      <p style={S.lbl}>這不代表這幾款不好</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          含雞肉本身不是缺點。上面幾款有的品質很好，一隻不對雞過敏的狗吃了完全沒問題。
          <b>我們在講的是名字跟內容物對不上這件事</b>。只有當你正在排查過敏原、
          或已經確定你的狗對雞有反應的時候，這才是問題。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          發現寫錯或資料過期，直接跟我們說，我們會改並且標日期。成分表會改版，我們不會假裝這一頁永遠是對的。
        </p>
      </div>

      <p style={S.lbl}>那要買什麼</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把狗的狀況講一句，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            例如「柴犬五歲，一直抓癢，換過兩種雞肉飼料都沒改善」。
          </p>
        </div>
        <Link style={S.btn} href="/">去裁決器</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/dog-food/no-chicken" style={S.relLink}>所有不含雞肉的飼料</Link>
        <Link href="/dog-food/grain-free" style={S.relLink}>無穀好不好</Link>
        <Link href="/dog-food/elimination-diet" style={S.relLink}>排除飲食法</Link>
        <Link href="/dog-food" style={S.relLink}>全部狗飼料</Link>
        <Link href="/how-we-choose" style={S.relLink}>我們怎麼挑</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          成分資料取自品牌官網與通路商品頁，每一筆都附了連結與查核日期。
          配方會改版，以你手上那一包的包裝標示為準。
        </p>
      </footer>
    </main>
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

const oursCard: React.CSSProperties = {
  borderColor: "var(--accent)", borderWidth: 2,
};

const oursTag: React.CSSProperties = {
  display: "inline-block", margin: "0 0 12px",
  background: "var(--accent-soft)", color: "var(--accent)",
  borderRadius: 999, padding: "5px 13px", fontSize: 12.5, fontWeight: 600,
};

const found: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 12, fontWeight: 600, letterSpacing: ".12em",
  textTransform: "uppercase", color: "var(--faint)", margin: "0 0 8px",
};
