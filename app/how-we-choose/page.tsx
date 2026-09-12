import type { Metadata } from "next";
import Link from "next/link";
import { catalog, catalogOf } from "@/lib/catalog";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "我們怎麼挑，錢從哪裡來",
  description:
    "排序只看四件事，佣金不在裡面。我們從購買連結賺分潤，這一頁把規則和利益關係全部寫清楚。",
  alternates: { canonical: "/how-we-choose" },
};

/** 揭露頁自己算，讓數字永遠跟實際資料一致 —— 寫死的數字遲早會過期變成謊話。 */
function stats() {
  return {
    count: catalog.length,
    dogs: catalogOf("dog").length,
    cats: catalogOf("cat").length,
    cans: catalogOf("cat", "wet").length,
    withDealbreaker: catalog.filter((p) => p.dealbreaker?.trim()).length,
  };
}

export default function Page() {
  const s = stats();

  return (
    <main style={{ maxWidth: 660, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current="how-we-choose" />

      <h1 style={{ fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.45, margin: "0 0 18px" }}>
        我們怎麼挑，錢從哪裡來
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 16, margin: "0 0 34px" }}>
        導購網站有個沒人講的問題：<b style={{ color: "var(--ink)" }}>推薦你買什麼，跟我們賺多少，是有利益衝突的。</b>
        這一頁把規則寫死，你隨時可以拿它來檢查我們。
      </p>

      <H>排序只看四件事</H>
      <ol style={{ paddingLeft: 20, margin: "0 0 10px", fontSize: 15.5 }}>
        <li style={{ marginBottom: 6 }}>有沒有踩到你標記的過敏原</li>
        <li style={{ marginBottom: 6 }}>營養組成在不在建議區間（粗蛋白 ≥ 22%、碳水 &lt; 48%）</li>
        <li style={{ marginBottom: 6 }}>是不是單一蛋白源，這讓你下次排查過敏原容易得多</li>
        <li>其他飼主回報好不好吃、會不會軟便</li>
      </ol>
      <Box tone="keep">
        <b>佣金不在裡面，而且我們連記都不記。</b>
        以前我們有一個 <code style={code}>commission</code> 欄位，然後承諾排序不去讀它。
        現在那個欄位<b>整個拿掉了</b>：讀不到一個不存在的東西，比承諾不去讀它可靠。
      </Box>

      <H>為什麼我們不公布每一款抽多少</H>
      <p style={{ fontSize: 15.5, margin: "0 0 14px" }}>
        第一個理由：那沒有幫到你，只會讓你在挑東西的時候去想我們賺多少。
        你該想的是你家那隻啦。
      </p>
      <p style={{ fontSize: 15.5, margin: "0 0 14px" }}>
        第二個理由更實際：<b>那個數字天天在跳。</b>
        我們收的第一款飼料，同一家賣場同一個品牌，前幾天是 9%，隔幾天變成 18%。
        平台在跑活動、費率照級距調，任何我們寫下來的數字，隔天就可能是錯的。
      </p>
      <p style={{ fontSize: 15.5, margin: "0 0 10px", color: "var(--muted)" }}>
        所以我們的原則是：<b style={{ color: "var(--ink)" }}>
        只記兩種資料：你看得到的，和程式要用的。</b>
        價格你看得到（所以我們記，而且標查核日期）；規格程式要用（所以我們記）。
        佣金兩種都不是，那就沒有理由留在我們的資料裡。
      </p>
      <Box tone="keep">
        <b>但你想知道的話，問我們。</b>任何一款你想知道我們抽多少，
        寫信或傳 LINE 問，我們會直接告訴你。這不是機密，只是不該擺在你挑東西的畫面上。
      </Box>

      <H>為什麼我們會叫你買大一點的包裝</H>
      <p style={{ fontSize: 15.5, margin: "0 0 14px" }}>
        因為<b>試糧要跑滿週期才有意義</b>。皮膚問題的排除飲食法一般抓 8 週，
        2 公斤的包裝，一隻 10 公斤的狗大約 12 天就吃完了。在還沒看出結果之前斷糧，
        你會以為是這款沒用，然後再換下一款，永遠得不到答案。
      </p>
      <p style={{ fontSize: 15.5, margin: "0 0 14px", color: "var(--muted)" }}>
        這個建議會讓我們賺比較多，我們知道。所以把算式攤開來：
        天數是用<b style={{ color: "var(--ink)" }}>獸醫的能量公式</b>算的，狗跟貓的係數不一樣，
        算式寫在<Link href="/dog-food/how-much" style={{ color: "var(--accent)" }}>狗</Link>和<Link href="/cat-food/how-much" style={{ color: "var(--accent)" }}>貓</Link>的「一天吃多少」那兩頁，你可以自己驗。
      </p>
      <Box tone="warn">
        <b>同一條規則也會叫你不要買超大包。</b>
        開封後放超過 45 天，乾飼料的油脂會氧化，牠會越來越不愛吃，
        很多人以為是這牌子不好，其實只是放太久了。所以我們推薦的規格
        <b>不會超過 45 天</b>，就算更大包每公斤更便宜、我們抽更多。
        兩個方向都講，這才不是話術。
      </Box>

      <H>我們主動放棄的錢</H>
      <ul style={{ paddingLeft: 20, margin: "0 0 10px", fontSize: 15.5 }}>
        <li style={{ marginBottom: 6 }}><b>不推水貨。</b>平輸沒有台灣代理保固，出問題你找不到人。就算它便宜、佣金高。</li>
        <li style={{ marginBottom: 6 }}><b>不放廣告。</b>廣告靠曝光賺錢，那會慢慢把我們變成一個讓你多點幾頁的網站。</li>
        <li style={{ marginBottom: 6 }}><b>不主動推處方飼料。</b>那需要獸醫診斷，不是我們該賣的。</li>
        <li><b>會叫你先別買。</b>價格在高點的時候我們會這樣講，即使你當下買我們才有錢。</li>
      </ul>

      <H>每一款都寫了「什麼時候不要買」</H>
      <p style={{ fontSize: 15.5, margin: "0 0 10px" }}>
        目前 <b>{s.withDealbreaker}</b> / {s.count} 款寫了。沒寫的不會上架，程式會直接擋下來，不用靠我們記得。
      </p>
      <p style={{ fontSize: 15.5, margin: "0 0 10px", color: "var(--muted)" }}>
        因為勸退不適合的人，比說服適合的人更有用。你知道我們願意講缺點，才會相信我們講的優點。
      </p>

      <H>價格是人工查的，不是即時的</H>
      <p style={{ fontSize: 15.5, margin: "0 0 10px" }}>
        每一個價格旁邊都標了查價日期。我們<b>不爬電商網站</b>，那違反平台條款，
        而且會賠掉整個帳號。所以我們老實告訴你數字是哪一天查的，點進去請以賣場為準。
      </p>

      <H>錢怎麼來的</H>
      <p style={{ fontSize: 15.5, margin: "0 0 10px" }}>
        你透過我們的連結買東西，賣場會分一小部分給我們，<b>你付的價格完全一樣</b>，不會比較貴。
      </p>
      <p style={{ fontSize: 15.5, margin: "0 0 34px", color: "var(--muted)" }}>
        連結都走 <code style={code}>/go/</code> 這個中轉，所以我們的頁面上不會有第三方追蹤程式碼。
      </p>

      <Box tone="warn">
        <b>資料還在長。</b>目前收了 {s.count} 款（狗飼料 {s.dogs}、貓飼料 {s.cats}、貓罐頭 {s.cans}），規格取自品牌與代理商公開資料，
        價格是人工複查、每張卡片都標了日期。有些資料我們還查不到，
        查不到就留白，不會寫湊數的數字。
      </Box>

      <p style={{ marginTop: 34 }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 700 }}>← 回裁決器</Link>
      </p>
    </main>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 18, fontWeight: 700, margin: "34px 0 12px",
      paddingTop: 20, borderTop: "1px solid var(--line)",
    }}>{children}</h2>
  );
}

function Box({ tone, children }: { tone: "keep" | "warn"; children: React.ReactNode }) {
  const c = tone === "keep"
    ? { background: "var(--keep-soft)", borderColor: "var(--keep)" }
    : { background: "var(--warn-soft)", borderColor: "var(--warn)" };
  return (
    <div style={{
      ...c, border: "1px solid", borderRadius: 8,
      padding: "14px 16px", fontSize: 14.5, lineHeight: 1.7, margin: "14px 0 0",
    }}>{children}</div>
  );
}

const code: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: "0.9em",
  background: "var(--sunken)",
  padding: "1px 5px",
  borderRadius: 3,
};
