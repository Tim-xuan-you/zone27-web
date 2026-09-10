import type { Metadata } from "next";
import Link from "next/link";
import { S } from "@/components/styles";
import { catalog } from "@/lib/catalog";
import { recommendable } from "@/lib/engine";

/**
 * 排除飲食法。
 *
 * 這是整個裁決邏輯的底層 —— 我們之所以那麼看重「單一蛋白源」，
 * 就是因為這套流程。讀者理解了這一頁，才會理解我們為什麼推那一款。
 *
 * 但這一頁最重要的一句話，對我們自己不利：
 *
 *   一直抓癢的狗裡，只有大約 18% 是食物造成的。
 *
 * 一個賣低敏飼料的網站把這個數字放在最上面，看起來是自斷生路。
 * 實際上正好相反 —— 那 18% 的人會相信我們接下來講的每一句話，
 * 而剩下的 80% 本來也不會因為買了飼料就好，他們只會在三個月後
 * 覺得被騙。留住一個永遠不會滿意的客人，不是生意。
 */

export const metadata: Metadata = {
  title: "排除飲食法：怎麼真的找出牠對什麼過敏",
  description:
    "一直抓癢的狗裡只有約 18% 是食物造成的。要確認是不是，得跑滿八週、期間完全乾淨、而且最後要把舊飼料餵回去回測。少了最後那一步，你永遠不會知道答案。",
  alternates: { canonical: "/dog-food/elimination-diet" },
  openGraph: { title: "排除飲食法：怎麼真的找出牠對什麼過敏", type: "article" },
};

export default function Page() {
  const live = catalog.filter(recommendable);
  const single = live.filter((p) => p.spec.singleSource);

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "狗一直抓癢，是食物過敏嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "多數不是。以搔癢為主訴就診的狗，食物過敏大約占 18%（不同研究落在 9% 到 40%）。更常見的是環境過敏（異位性皮膚炎）和跳蚤過敏。所以換飼料有相當高的機率不會解決問題。要先做跳蚤預防，並且讓獸醫排除其他原因。",
        },
      },
      {
        "@type": "Question",
        name: "排除飲食法要做多久？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "一般是八週。期間只能吃選定的那一種飼料，不能有零食、潔牙骨、人的食物、有調味的藥錠。八週之後如果有改善，還要做「回測」：把原本的飼料餵回去。症狀回來才算確認是食物過敏，症狀沒回來就代表當初的改善另有原因。",
        },
      },
      {
        "@type": "Question",
        name: "為什麼一定要回測？直接繼續吃新飼料不行嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "因為不回測你永遠不知道是不是飼料的功勞。搔癢會隨季節起伏，同時期你可能也換了洗澡頻率、加了跳蚤預防、或牠本來就在好轉。把舊飼料餵回去，症狀回來，那才是證據。少了這一步，你只是換了一包比較貴的飼料，然後每次牠再抓就要重新猜一次。",
        },
      },
      {
        "@type": "Question",
        name: "為什麼要選單一蛋白源的飼料？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "因為變因要少。一包裡有雞、火雞、鴨、鮭魚四種肉，就算八週後有改善，你也不知道原本的問題出在哪一種，下次選飼料還是在猜。單一蛋白源讓這次的結果可以用在下一次。",
        },
      },
    ],
  };

  const howto = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "排除飲食法：確認狗是不是食物過敏",
    description: "以單一新蛋白源飼料跑滿約八週，期間完全不給其他食物，最後以原飼料回測確認。",
    totalTime: "P10W",
    step: [
      { "@type": "HowToStep", position: 1, name: "選一款牠沒吃過的蛋白源",
        text: "要選狗的免疫系統沒見過的肉，包裝寫不寫「低敏」不重要。或由獸醫開立水解蛋白處方飼料。" },
      { "@type": "HowToStep", position: 2, name: "跑滿八週，期間完全乾淨",
        text: "只吃選定的那一款。零食、潔牙骨、人的食物、有調味的藥錠都不能給。" },
      { "@type": "HowToStep", position: 3, name: "八週後評估",
        text: "有明顯改善進入回測；完全沒改善多半不是食物問題，請找皮膚科獸醫。" },
      { "@type": "HowToStep", position: 4, name: "回測：把原本的飼料餵回去",
        text: "症狀回來才確認是食物過敏；症狀沒回來代表先前的改善另有原因。" },
    ],
  };

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "0 20px 120px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howto) }}
      />

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 40,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
        <Link href="/dog-food" style={{ fontSize: 12.5, color: "var(--muted)", textDecoration: "none" }}>
          全部狗飼料
        </Link>
      </div>

      <h1 style={{ fontSize: "clamp(25px,5vw,34px)", lineHeight: 1.45, margin: "0 0 18px" }}>
        排除飲食法：怎麼真的找出牠對什麼過敏
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 32px", maxWidth: "42ch" }}>
        我們賣的是飼料，但這一頁要先講一個對我們不利的數字。
      </p>

      {/* ── 壞消息先講 ── */}
      <div style={{ ...box, borderColor: "var(--cut)", borderWidth: 2 }}>
        <p style={{
          margin: 0, fontFamily: "var(--font-serif), serif",
          fontSize: 24, lineHeight: 1.55, fontWeight: 700,
        }}>
          一直抓癢的狗裡，<br />
          只有大約 <span style={{ color: "var(--cut)" }}>18%</span> 是食物造成的。
        </p>
        <p style={{ margin: "16px 0 0", fontSize: 15.5, lineHeight: 1.95 }}>
          這是以搔癢為主訴就診的狗的統計，不同研究落在 <b>9% 到 40%</b> 之間。
          更常見的是<b>環境過敏（異位性皮膚炎）</b>和<b>跳蚤過敏</b>。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
          換句話說：<b style={{ color: "var(--ink)" }}>換飼料有相當高的機率不會解決你的問題。</b>
          知道這件事再開始，比花八週之後才失望好。
        </p>
      </div>

      <p style={S.lbl}>那為什麼還要做</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          因為那 18% 是<b>你自己就能處理的那一部分</b>，而且做完你會真的知道答案，
          不會只停在「好像有比較好」。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.95 }}>
          而且就算最後證明不是食物，你也把一個變因排掉了。
          帶著「食物已經排除過」去看皮膚科獸醫，比什麼都沒做有用得多。
        </p>
      </div>

      {/* ── 開始之前 ── */}
      <p style={S.lbl}>開始之前，先做兩件事</p>
      <ol style={list}>
        <li style={li}>
          <b>跳蚤預防要到位。</b>跳蚤過敏性皮膚炎非常常見，而且一隻跳蚤就夠。
          沒做預防就開始排除飲食法，八週後你還是不知道答案。
        </li>
        <li>
          <b>讓獸醫先看一次。</b>疥癬、黴菌、細菌感染、內分泌問題都會讓狗抓。
          那幾種換飼料一輩子也不會好，而且拖越久越難處理。
        </li>
      </ol>

      {/* ── 四步 ── */}
      <p style={S.lbl}>流程，四步</p>

      <Step n={1} title="選一款「牠沒吃過的蛋白源」">
        要找的是<b>牠的免疫系統沒見過</b>的肉，包裝上寫不寫「低敏」其實不重要。
        吃了三年雞肉的狗，換另一包雞肉配方沒有意義。
        <br />
        獸醫也可能開<b>水解蛋白</b>處方飼料，那是把蛋白質切碎到免疫系統認不出來。
        那需要處方，我們不賣也不推。
      </Step>

      <Step n={2} title="跑滿八週，期間完全乾淨">
        八週是一般建議的長度，皮膚要跟著生長週期走，急不來。
        <br />
        <b>期間只能吃那一款飼料。</b>零食、潔牙骨、人的食物、公園裡別人給的、
        有調味的藥錠和保健品，全部都算喔。
        <b style={{ color: "var(--cut)" }}>一根雞肉零食就毀掉整個八週。</b>
      </Step>

      <Step n={3} title="八週後評估">
        有明顯改善 → 進第四步。
        <br />
        完全沒改善 → 很可能不是食物，或是同時還有別的問題。
        去找皮膚科獸醫，把你做過的八週告訴他，那是有用的資訊。
      </Step>

      <Step n={4} title="回測：把舊飼料餵回去" last accent>
        <b>這一步最多人跳過，而少了它前面八週等於白做。</b>
        <br />
        把原本的飼料餵回去。<b>症狀回來 → 確認是食物過敏。</b>
        症狀沒回來 → 當初的改善另有原因。
        <br />
        確認之後再換回新飼料，症狀再次消失，這才是完整的證據鏈。
      </Step>

      {/* ── 回測為什麼重要 ── */}
      <Box tone="warn">
        <b>為什麼非回測不可？</b>
        因為搔癢本來就會隨季節起伏。這八週裡你可能也換了洗澡頻率、
        加了跳蚤預防、或牠本來就在好轉。
        <br />
        不回測，你只是換了一包比較貴的飼料，然後<b>每次牠再抓，你都要重新猜一次</b>。
        回測一次，你換來的是往後好幾年都用得上的答案。
      </Box>

      {/* ── 三個失敗原因 ── */}
      <p style={S.lbl}>做失敗的，幾乎都是這三個原因</p>
      <ol style={list}>
        <li style={li}><b>零食沒斷。</b>最常見。家人偷餵、去公園有人給、藥錠是雞肉口味的。</li>
        <li style={li}><b>時間不夠。</b>兩三個禮拜沒改善就放棄換下一款，永遠跑不完一輪。</li>
        <li><b>沒有回測。</b>看起來有效就繼續吃，結果幾個月後又抓，只好從頭猜。</li>
      </ol>

      {/* ── 單一蛋白源在這裡的角色 ── */}
      <p style={S.lbl}>「單一蛋白源」在這裡的角色</p>
      <div style={box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
          變因要少。一包裡有雞、火雞、鴨、鮭魚四種肉，就算八週後有改善，
          <b>你也不知道問題出在哪一種</b>，下次挑飼料還是在猜。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.95 }}>
          單一蛋白源讓<b>這次的結果可以用在下一次</b>。這就是為什麼我們的排序
          把它放得那麼重，因為它讓你學得到東西，跟高不高級沒關係。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
          我們目前能買到的 {live.length} 款裡，有 <b>{single.length} 款</b>是單一蛋白源。
          <Link href="/dog-food/hidden-chicken" style={{ color: "var(--accent)" }}>
            但商品名寫單一口味不代表成分表只有一種肉
          </Link>
          ，那是另一件要小心的事。
        </p>
      </div>

      {/* ── 什麼時候停 ── */}
      <p style={S.lbl}>什麼時候該停下來去看醫生</p>
      <Box tone="warn">
        抓到<b>流血、脫毛、皮膚有味道或滲液</b>、
        <b>耳朵反覆發炎</b>、
        <b>連續軟便超過三天</b>、
        <b>精神變差或體重掉</b>，就不要繼續跑你的八週了，直接看醫生。
        <br />
        排除飲食法是給「持續在抓但整體狀況穩定」的狗做的，不是給正在惡化的狗。
      </Box>

      {/* ── 我們能幫上什麼 ── */}
      <p style={S.lbl}>我們能幫上什麼、幫不上什麼</p>
      <div style={box}>
        <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.95 }}>
          <b>幫得上：</b>幫你挑一款單一蛋白源、避開你標記的過敏原、
          規格夠你跑滿八週不斷糧的飼料。成分表我們自己讀過。
        </p>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.95, color: "var(--muted)" }}>
          <b style={{ color: "var(--ink)" }}>幫不上：</b>判斷牠到底是不是食物過敏。
          那要靠你跑完流程，或靠獸醫。我們不會、也不該替你下這個判斷。
        </p>
      </div>

      <p style={S.lbl}>要開始的話</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>講一句牠的狀況，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            例如「柴犬五歲，一直抓癢，換過兩種雞肉飼料都沒改善」。
            我們會順便算哪個規格夠你跑完八週。
          </p>
        </div>
        <Link style={S.btn} href="/">去裁決器</Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/dog-food/hidden-chicken" style={S.relLink}>寫著低敏，成分表裡有雞</Link>
        <Link href="/dog-food/grain-free" style={S.relLink}>無穀好不好</Link>
        <Link href="/dog-food/how-much" style={S.relLink}>一天要吃多少</Link>
        <Link href="/dog-food/no-chicken" style={S.relLink}>不含雞肉的飼料</Link>
      </div>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          這一頁整理自獸醫皮膚科與營養學的公開資料，是流程說明，不是診斷。
          牠的狀況要由看得到牠的獸醫判斷。
          八週那個數字是一般建議，你的獸醫給的長度優先。
        </p>
      </footer>
    </main>
  );
}

function Step({
  n, title, children, last, accent,
}: {
  n: number; title: string; children: React.ReactNode; last?: boolean; accent?: boolean;
}) {
  return (
    <div style={{
      ...box,
      marginBottom: last ? 0 : 12,
      ...(accent ? { borderColor: "var(--accent)", borderWidth: 2 } : null),
    }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span
          className="mono"
          style={{
            flexShrink: 0, width: 26, height: 26, borderRadius: 999,
            background: accent ? "var(--accent)" : "var(--accent-soft)",
            color: accent ? "var(--accent-ink)" : "var(--accent)",
            fontSize: 13, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            marginTop: 2,
          }}
        >{n}</span>
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 16.5, fontWeight: 700, lineHeight: 1.6 }}>
            {title}
          </p>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.95 }}>
            {children}
          </p>
        </div>
      </div>
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
      padding: "14px 16px", fontSize: 14.5, lineHeight: 1.9, margin: "14px 0 0",
    }}>{children}</div>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
};
const list: React.CSSProperties = {
  paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95,
};
const li: React.CSSProperties = { marginBottom: 10 };
