import type { Metadata } from "next";
import Link from "next/link";
import { S } from "@/components/styles";
import { catalogOf } from "@/lib/catalog";

// 這一頁講的是狗飼料，統計只數狗的
const catalog = catalogOf("dog");
import SiteHeader from "@/components/SiteHeader";

/**
 * 無穀飼料到底有沒有比較好。
 *
 * 這一頁的骨幹是我們自己的資料，不是意見 —— 而資料剛好講出一個
 * 反直覺的故事：含穀的平價糧沒有豆類，無穀的高級糧豆類最多。
 *
 * 兩條紀律：
 *
 * 1. DCM 那一段要精準。FDA 2022 年 12 月結束調查、說沒有證據支持
 *    因果關係，這是事實；獸醫營養學界認為飲食相關 DCM 是有紀錄的
 *    病例類型、機轉未明，這也是事實。兩邊都要寫，而且要寫清楚
 *    指向的是「豆類含量高」不是「無穀」。少寫一邊都是在帶風向。
 *
 * 2. 我們自己推的第一名就是豆類多的那一款。要寫出來。
 *    只拿資料打別人的頁面，讀者一眼就看得出動機。
 */

export const metadata: Metadata = {
  title: "無穀飼料到底有沒有比較好",
  description:
    "「無穀」不等於無雞、不等於低碳水、也不等於豆類少。用我們自己十款飼料的成分表對照，順便把 FDA 和獸醫營養學界對心臟病那件事的說法講清楚。",
  alternates: { canonical: "/dog-food/grain-free" },
  openGraph: { title: "無穀飼料到底有沒有比較好", type: "article" },
};

export default function Page() {
  const total = catalog.length;
  const gf = catalog.filter((p) => p.spec.grainFree);
  const gfPulses = gf.filter((p) => p.spec.pulses === "high");
  const gfNoPulses = gf.filter((p) => p.spec.pulses === "none");
  const grainy = catalog.filter((p) => !p.spec.grainFree);
  const grainyNoPulses = grainy.filter((p) => p.spec.pulses === "none");
  const grainyPulses = grainy.filter((p) => p.spec.pulses === "high");
  const gfChicken = gf.filter((p) =>
    p.spec.proteinSources.some((s) => s === "chicken" || s === "poultry"),
  );
  const gfHighCarb = gf.filter((p) => p.spec.carb >= 40);
  const unchecked = catalog.filter((p) => !p.spec.pulses || p.spec.pulses === "unknown");

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "無穀飼料比較好嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "「無穀」只說明沒有小麥玉米這類穀物，它不保證任何其他事。狗最常見的食物過敏原是動物蛋白不是穀物，所以無穀不等於低敏；無穀配方常用馬鈴薯、木薯、豆類補碳水，所以無穀也不等於低碳水。除非你的狗確定對特定穀物有反應，否則穀物本身不是需要避開的東西。",
        },
      },
      {
        "@type": "Question",
        name: "無穀飼料會造成狗的心臟病嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "FDA 在 2018 年開始調查，2022 年 12 月結束，表示沒有證據支持無穀飼料會造成或加重擴張性心肌病。但獸醫營養學界的立場是，飲食相關的擴張性心肌病是有紀錄的病例類型，已有三十幾篇研究，機轉尚未查明。目前的線索指向豆類（豌豆、扁豆、鷹嘴豆、各種 bean）含量高的配方，含穀的飼料一樣可能豆類很高。所以該做的是去看成分表，不用急著換飼料。狗出現咳嗽、呼吸困難、無力要看獸醫，那不是飼料問題。",
        },
      },
      {
        "@type": "Question",
        name: "怎麼知道一包飼料的豆類多不多？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "看成分表前八項有沒有豌豆、扁豆、鷹嘴豆、斑豆、白腰豆這些字。成分表是照重量由多到少排的，排在前面就代表份量不小。包裝正面的「無穀」兩個字完全不會告訴你這件事。",
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

      <h1 style={{ fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.45, margin: "0 0 18px" }}>
        無穀飼料到底有沒有比較好
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 10px", maxWidth: "42ch" }}>
        短答案：<b style={{ color: "var(--ink)" }}>「無穀」是行銷詞，不是健康保證。</b>
        它沒有回答任何一個你真正在意的問題。
      </p>
      <p style={{ color: "var(--faint)", fontSize: 13, margin: "0 0 8px" }}>
        用我們自己收的 {total} 款成分表對照 · 其中 {total - unchecked.length} 款查過豆類含量
      </p>

      {/* ── 資料先講話 ── */}
      <p style={S.lbl}>我們自己十款的數字</p>
      <div style={box}>
        <Stat n={gf.length} d={total} label="是無穀的" />
        <Stat n={gfChicken.length} d={gf.length} label="無穀，但含雞肉或只寫「禽肉」" tone="cut" />
        <Stat n={gfHighCarb.length} d={gf.length} label="無穀，但碳水仍在 40% 以上" tone="cut" />
        <Stat n={gfPulses.length} d={gf.length} label="無穀，而且豆類排在成分表前段" tone="cut" last />
        <p style={{ margin: "16px 0 0", fontSize: 15, lineHeight: 1.95 }}>
          換句話說：<b>無穀不等於無雞、不等於低碳水、也不等於豆類少。</b>
          這三件事才是你真正在意的，而包裝正面那兩個字一件都沒回答。
        </p>
      </div>

      {/* ── 反直覺的那一段 ── */}
      {grainyNoPulses.length > 0 && gfPulses.length > 0 && (
        <>
          <p style={S.lbl}>最反直覺的一件事</p>
          <div style={{ ...box, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
              我們收的款裡，<b>豆類最多的反而是那幾款無穀高價糧</b>
              （{[...new Set(gfPulses.map((p) => p.brand))].slice(0, 3).join("、")}⋯）。
            </p>
            {grainyPulses.length > 0 && (
              <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.95 }}>
                而我們收的<b>兩款含穀糧剛好落在兩個極端</b>：
                <b>{grainyNoPulses[0].brand}</b> 成分表裡一顆豆都沒有，
                <b>{grainyPulses[0].brand}</b> 的黃豌豆和豌豆蛋白卻排在第六、第七項。
                <br />
                <b style={{ color: "var(--cut)" }}>
                  也就是說：有沒有穀物，跟豆類多不多，根本是兩件獨立的事。
                </b>
              </p>
            )}
            <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
              無穀那邊的原因很單純：把穀物拿掉之後，碳水總要有東西來補，
              補進去的通常就是馬鈴薯、木薯或豆類。
              含穀那邊則是各家配方自己的選擇，包裝正面完全看不出來。
            </p>
          </div>
        </>
      )}

      {/* ── DCM，精準版 ── */}
      <p style={S.lbl}>那個心臟病的說法，到底怎麼回事</p>
      <div style={box}>
        <p style={{ margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.95 }}>
          2018 年美國 FDA 開始調查無穀飼料跟犬隻<b>擴張性心肌病（DCM）</b>的關聯。
          <b>2022 年 12 月，FDA 結束調查</b>，表示沒有證據支持無穀或那類配方會造成、
          或加重 DCM。
        </p>
        <p style={{ margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.95 }}>
          但故事沒有到此為止。獸醫營養學界的立場是：
          <b>飲食相關的 DCM 是有紀錄的病例類型</b>，已經累積三十幾篇研究，
          機轉還沒查清楚。目前的線索指向的是
          <b style={{ color: "var(--cut)" }}>豆類含量高的配方</b>，跟有沒有穀物關係不大。
        </p>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          關鍵在這裡：<b>含穀的飼料一樣可能豆類很高。</b>
          所以「換回含穀的就沒事」是誤解，「無穀所以危險」也是誤解。
          真正該看的是成分表前八項有沒有豌豆、扁豆、鷹嘴豆這些字。
        </p>
      </div>
      <Box tone="warn">
        <b>這不是叫你現在去換飼料。</b>
        目前沒有人能告訴你確切的機轉，恐慌換糧只會讓你的狗腸胃亂幾天。
        <br />
        <b>狗出現咳嗽、呼吸變喘、容易累、無力，那要看獸醫，換飼料解決不了。</b>
        心臟的事我們沒有資格判斷。
      </Box>

      {/* ── 我們自己也在名單上 ── */}
      {gfPulses.length > 0 && (
        <>
          <p style={S.lbl}>我們自己推的那款也在名單上</p>
          <div style={{ ...box, borderColor: "var(--accent)", borderWidth: 2 }}>
            <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
              我們的裁決器目前最常推的是 <b>{gfPulses[0].brand}｜{gfPulses[0].name}</b>。
              它的成分表裡<b>鷹嘴豆和扁豆都排在前八項</b>。
            </p>
            <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
              我們還是推它，因為以「單一蛋白源、方便排查過敏原」這個目的來說它確實合適。
              但這一行你有權利知道。只拿資料打別人、不寫自己，那種頁面你一眼就看得出動機。
            </p>
            {gfNoPulses.length > 0 && (
              <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.95 }}>
                如果你就是想避開豆類：我們收的款裡，
                <b>{gfNoPulses[0].brand}｜{gfNoPulses[0].name}</b> 是無穀而且不含豆類的
                （品牌明確標示 pea free，碳水用馬鈴薯）。
              </p>
            )}
          </div>
        </>
      )}

      <p style={S.lbl}>所以該怎麼看一包飼料</p>
      <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li style={{ marginBottom: 8 }}>
          <b>把「無穀」兩個字當成沒看到。</b>它不回答過敏、碳水、豆類任何一項。
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>看成分表前八項。</b>那是照重量排的。有沒有豌豆、扁豆、鷹嘴豆，一眼就知道。
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>穀物本身不是敵人。</b>狗最常見的食物過敏原是動物蛋白，不是穀物。
          除非你的狗確定對特定穀物有反應，不然沒有理由特地避開。
        </li>
        <li>
          <b>有心臟症狀就去看醫生。</b>那不是換飼料能處理的事。
        </li>
      </ol>

      {unchecked.length > 0 && (
        <Box tone="warn">
          <b>我們還沒查完。</b>
          {total} 款裡有 {unchecked.length} 款的豆類含量還沒核對
          （{unchecked.map((p) => p.brand).join("、")}），
          所以上面的比例只算已查的那些。查完會更新，而且會標日期。
          我們不會為了讓數字好看就先寫上去。
        </Box>
      )}

      <p style={S.lbl}>那要買什麼</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把狗的狀況講一句，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            我們不會因為一款是無穀就加分，那個欄位在排序裡不佔任何權重。
          </p>
        </div>
        <Link style={S.btn} href="/">去裁決器</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/dog-food/hidden-chicken" style={S.relLink}>寫著低敏，成分表裡有雞</Link>
        <Link href="/dog-food/how-much" style={S.relLink}>一天要吃多少</Link>
        <Link href="/dog-food/elimination-diet" style={S.relLink}>排除飲食法</Link>
        <Link href="/dog-food" style={S.relLink}>全部狗飼料</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          這一頁的比例是從我們自己的商品資料算出來的，商品增加數字就會跟著變，
          沒有寫死。成分會改版，以你手上那一包的標示為準。
          心臟相關的判斷請交給獸醫。
        </p>
      </footer>
    </main>
  );
}

function Stat({
  n, d, label, tone, last,
}: { n: number; d: number; label: string; tone?: "cut"; last?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "baseline", gap: 12,
      padding: "12px 0",
      borderBottom: last ? 0 : "1px solid var(--line)",
    }}>
      <span
        className="mono"
        style={{
          fontFamily: "var(--font-serif), serif",
          fontSize: 26, fontWeight: 700, minWidth: "3.2em",
          color: tone ? "var(--cut)" : "var(--ink)",
        }}
      >{n} / {d}</span>
      <span style={{ fontSize: 15, lineHeight: 1.7 }}>{label}</span>
    </div>
  );
}

function Box({ tone, children }: { tone: "keep" | "warn"; children: React.ReactNode }) {
  const c = tone === "keep"
    ? { background: "var(--keep-soft)", borderColor: "var(--keep)" }
    : { background: "var(--warn-soft)", borderColor: "var(--warn)" };
  return (
    <div style={{
      ...c, border: "1px solid", borderRadius: 8,
      padding: "14px 16px", fontSize: 14.5, lineHeight: 1.85, margin: "14px 0 0",
    }}>{children}</div>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
};
