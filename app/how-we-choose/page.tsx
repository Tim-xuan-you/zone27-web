import type { Metadata } from "next";
import Link from "next/link";
import { catalog } from "@/lib/catalog";

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
    withDealbreaker: catalog.filter((p) => p.dealbreaker?.trim()).length,
  };
}

export default function Page() {
  const s = stats();

  return (
    <main style={{ maxWidth: 660, margin: "0 auto", padding: "0 20px 120px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 40,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
      </div>

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
        <li style={{ marginBottom: 6 }}>是不是單一蛋白源 —— 這讓你下次排查過敏原容易得多</li>
        <li>其他飼主回報好不好吃、會不會軟便</li>
      </ol>
      <Box tone="keep">
        <b>佣金不在裡面。</b>演算法讀不到那個欄位 ——
        這不是承諾，是程式碼寫成那樣。<code style={code}>lib/engine.ts</code> 的評分函式沒有碰
        <code style={code}>commission</code>。
      </Box>

      <H>為什麼我們不公布每一款抽多少</H>
      <p style={{ fontSize: 15.5, margin: "0 0 14px" }}>
        因為那沒有幫到你，只會讓你在挑東西的時候去想我們賺多少 ——
        該想的是你的狗。而且費率會變，寫死的數字遲早過期變成錯的。
      </p>
      <p style={{ fontSize: 15.5, margin: "0 0 10px", color: "var(--muted)" }}>
        更有用的保證是上面那一條：<b style={{ color: "var(--ink)" }}>程式碼讀不到佣金欄位</b>。
        那是結構性的，不是我們的自我宣告。
      </p>
      <Box tone="keep">
        <b>但你想知道的話，問我們。</b>任何一款你想知道我們抽多少，
        寫信或傳 LINE 問，我們會直接告訴你。這不是機密，只是不該擺在你挑東西的畫面上。
      </Box>

      <H>為什麼我們會叫你買大一點的包裝</H>
      <p style={{ fontSize: 15.5, margin: "0 0 14px" }}>
        因為<b>試糧要跑滿週期才有意義</b>。皮膚問題的排除飲食法一般抓 8 週 ——
        2 公斤的包裝，一隻 10 公斤的狗吃 10 天就沒了。在還沒看出結果之前斷糧，
        你會以為是這款沒用，然後再換下一款，永遠得不到答案。
      </p>
      <p style={{ fontSize: 15.5, margin: "0 0 14px", color: "var(--muted)" }}>
        這個建議會讓我們賺比較多，我們知道。所以把算式攤開來：
        天數是用<b style={{ color: "var(--ink)" }}>體重 × 2%</b> 估的日食量算出來的，
        你可以自己驗。
      </p>
      <Box tone="warn">
        <b>同一條規則也會叫你不要買超大包。</b>
        開封後放超過 45 天，乾飼料的油脂會氧化，狗會越來越不愛吃 ——
        很多人以為是「這牌子不好」，其實是放太久。所以我們推薦的規格
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

      <H>每一款都有一句「不要買，如果⋯」</H>
      <p style={{ fontSize: 15.5, margin: "0 0 10px" }}>
        目前 <b>{s.withDealbreaker}</b> / {s.count} 款寫了。沒寫的不會上架 —— 這是系統擋下的，不是我們自律。
      </p>
      <p style={{ fontSize: 15.5, margin: "0 0 10px", color: "var(--muted)" }}>
        因為勸退不適合的人，比說服適合的人更有用。你知道我們願意講缺點，才會相信我們講的優點。
      </p>

      <H>價格是人工查的，不是即時的</H>
      <p style={{ fontSize: 15.5, margin: "0 0 10px" }}>
        每一個價格旁邊都標了查價日期。我們<b>不爬電商網站</b> —— 那違反平台條款，
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
        <b>資料還在長。</b>目前收了 {s.count} 款，規格取自品牌與代理商公開資料，
        價格是人工複查、每張卡片都標了日期。飼主回報那一欄多數還是空的 ——
        我們寧可寫「還沒整理」，也不寫湊數的數字。
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
