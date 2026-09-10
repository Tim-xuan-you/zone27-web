import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/contact";

/**
 * 這個問題該問誰。
 *
 * 上一版把這頁做成客服台，那是做過頭了 —— 我們不是賣家，看不到人家的
 * 訂單和庫存，接進來只會變成一個沒有權限的客服；而沒人回的訊息
 * 比沒有訊息管道更傷。
 *
 * 這一版是**路由頁**：把問題分到對的人手上，寫完就一直在那裡分流，
 * 零人力。順便讓讀者看見我們知道這個生態怎麼運作 ——
 * 「這題不是我們能答的」講得出理由，比裝忙有說服力。
 */

export const metadata: Metadata = {
  title: "這個問題該問誰",
  description:
    "出貨缺貨退換問賣場、生病問獸醫、成分規格用裁決器、我們寫錯了寄信給我們。問對人才省時間。",
  alternates: { canonical: "/ask" },
};

export default function Page() {
  return (
    <main style={{ maxWidth: 660, margin: "0 auto", padding: "0 20px 120px" }}>
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

      <h1 style={{ fontSize: "clamp(26px,5vw,36px)", lineHeight: 1.45, margin: "0 0 18px" }}>
        這個問題該問誰
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 34px", maxWidth: "42ch" }}>
        我們是介紹的人，不是賣東西的人。<b style={{ color: "var(--ink)" }}>問對人，你會快很多。</b>
      </p>

      <Row
        q="什麼時候出貨、還有沒有貨、是不是正品、要退換、要發票"
        who="賣場的「聊聊」"
        why="我們看不到你的訂單，也看不到他們的庫存。這幾題只有賣家答得了，我們轉一手只會更慢。"
        tone="muted"
      />

      <Row
        q="牠一直吐、一直拉、突然不吃、精神變差、這是不是過敏"
        who="獸醫"
        why="我們不是獸醫，猜錯了是你的狗承擔。而且先不要換飼料，換糧本身就會讓腸胃亂幾天，那會蓋掉真正的症狀，讓醫生更難判斷。"
        tone="warn"
      />

      <Row
        q="這款到底有沒有含雞、兩款差在哪、我的狗該買哪個規格、現在買貴不貴"
        who="網站上就有"
        why="這四類是我們唯一比別人強的地方：查得到、算得出來、你可以自己驗證。"
        tone="keep"
        actions={[
          { href: "/", label: "用裁決器問" },
          { href: "/dog-food/hidden-chicken", label: "成分表裡有雞" },
        ]}
      />

      <Row
        q="你們寫錯了、這個連結壞了、價格跟賣場對不上"
        who="寄信給我們"
        why="這是整個網站唯一真的只有我們能修的事。收到會改，而且會在頁面上標新的查核日期。"
        tone="keep"
        mail
      />

      <div style={{
        marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--line)",
        fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9,
      }}>
        <p style={{ margin: "0 0 10px" }}>
          <b style={{ color: "var(--ink)" }}>我們沒有客服。</b>
          一個人做的網站，開 LINE 最後只會變成三天才回你，
          所以我們乾脆不開，把該問誰寫清楚比較實在。
        </p>
        <p style={{ margin: 0 }}>
          你找不到答案，代表網站上少了一頁。那是我們該補的。
          寄信告訴我們，我們會補上，讓下一個人不用開口。
          <Link href="/dog-food/hidden-chicken" style={{ color: "var(--accent)" }}>「成分表裡有雞」</Link>
          那一頁就是這樣來的。
        </p>
      </div>

      <p style={{ marginTop: 36 }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 700 }}>← 回裁決器</Link>
      </p>
    </main>
  );
}

function Row({
  q, who, why, tone, actions, mail,
}: {
  q: string;
  who: string;
  why: string;
  tone: "keep" | "warn" | "muted";
  actions?: { href: string; label: string }[];
  mail?: boolean;
}) {
  const c =
    tone === "keep" ? "var(--keep)" : tone === "warn" ? "var(--cut)" : "var(--muted)";

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--line)",
      borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px", marginBottom: 14,
      borderLeft: `3px solid ${c}`,
    }}>
      <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.8 }}>{q}</p>
      <p style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 700, color: c }}>→ {who}</p>
      <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>{why}</p>

      {actions && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
          {actions.map((a) => (
            <Link key={a.href} href={a.href} style={pill}>{a.label}</Link>
          ))}
        </div>
      )}

      {mail && CONTACT.email && (
        <div style={{ marginTop: 14 }}>
          <a
            href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("ZONE 27 資料回報")}`}
            style={pill}
          >{CONTACT.email}</a>
        </div>
      )}
    </div>
  );
}

const pill: React.CSSProperties = {
  border: "1px solid var(--line)", background: "var(--sunken)",
  color: "var(--ink)", borderRadius: 999, padding: "9px 18px",
  fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block",
};
