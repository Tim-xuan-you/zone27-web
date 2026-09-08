import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT, hasContact } from "@/lib/contact";

/**
 * 問我們。
 *
 * 這一頁的重點不是「歡迎發問」，是**先把界線畫出來**。
 *
 * 一個人做不到跨類目的專家，這是事實，遮不住。但真正會出事的不是
 * 「答不出來」，是「硬答」—— 有人問狗一直吐怎麼辦，我們給了一個看起來
 * 很有道理的答案，那隻狗因此晚了三天看醫生。
 *
 * 所以把「不回答什麼」寫得跟「回答什麼」一樣大。
 * 講清楚界線的人，界線內的話才有人信。
 */

export const metadata: Metadata = {
  title: "問我們",
  description:
    "我們回答成分、規格、時機這類查得到答案的問題。牠生病了要看醫生 —— 那不該由我們回答。這一頁寫清楚界線，以及怎麼問才問得到答案。",
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
        問我們
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 34px", maxWidth: "42ch" }}>
        先說清楚我們答得了什麼、答不了什麼。<b style={{ color: "var(--ink)" }}>答不了的我們會直接說</b>，
        不會給你一個聽起來很有道理的猜測。
      </p>

      <H>這些我們答得出來</H>
      <ul style={ul}>
        <li><b>這款到底有沒有含雞。</b>我們自己讀成分表，不是看商品名 —— 名字寫火雞、成分第一項是雞肉的，我們遇過三款。</li>
        <li><b>兩款差在哪、為什麼推 A 不推 B。</b>整個排除過程我們可以攤開給你看。</li>
        <li><b>我家的狗這個體重該買哪個規格。</b>算得出來：吃幾天、每公斤多少、會不會放到氧化。</li>
        <li><b>現在買會不會太貴。</b>我們有記價格，看得出來現在在高點還是低點。</li>
      </ul>
      <Box tone="keep">
        這幾類的共同點是<b>查得到、算得出來、可以被你驗證</b>。
        我們的答案永遠會附上是根據什麼講的。
      </Box>

      <H>這些我們不會回答</H>
      <ul style={ul}>
        <li>牠生病了怎麼辦、要不要吃藥、要不要換處方飼料</li>
        <li>這個症狀是不是過敏、是不是腸胃炎、是不是皮膚病</li>
        <li>要不要打疫苗、要不要做什麼檢查</li>
      </ul>
      <Box tone="warn">
        <b>這不是客氣，是真的不該由我們回答。</b>
        我們不是獸醫。猜錯了不是我們承擔，是你的狗。<br />
        牠<b>一直吐、一直拉、突然不吃、精神變差</b> —— 直接去看醫生，先不要換飼料。
        換糧本身就會讓腸胃亂幾天，那會蓋掉真正的症狀，讓醫生更難判斷。
      </Box>

      <H>這樣問，我們才答得出來</H>
      <p style={{ fontSize: 15.5, margin: "0 0 14px" }}>
        「我家狗一直抓，該吃什麼」這樣問，我們只能回你一句廢話。把下面幾項一起講：
      </p>
      <div style={tpl} className="mono">
        品種、年齡、體重<br />
        現在吃什麼牌子，吃多久了<br />
        你觀察到什麼，持續多久了<br />
        看過醫生沒有，醫生怎麼說<br />
        一個月大概能花多少
      </div>
      <p style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9, margin: "14px 0 0" }}>
        皮膚的照片也可以直接傳。講得亂沒關係，資訊有就好。
      </p>

      <H>你會拿到什麼</H>
      <ul style={ul}>
        <li>我們把你的狀況丟進<Link href="/" style={a}>同一個裁決器</Link>，然後告訴你它刪掉了哪幾款、為什麼</li>
        <li>加上針對你那句話的解釋 —— 你在意的那一點，我們會單獨講</li>
        <li><b>如果我們不知道，我們會說不知道。</b>然後告訴你該問誰</li>
      </ul>

      <H>你問的問題會變成網站的一頁</H>
      <p style={{ fontSize: 15.5, margin: "0 0 10px" }}>
        你會來問，代表網站上沒有答案 —— 那是<b>我們的缺口，不是你的問題</b>。
        我們會把它寫成一頁，讓下一個人不用開口就找得到。
      </p>
      <p style={{ fontSize: 15.5, margin: 0, color: "var(--muted)" }}>
        「標榜低敏但含雞肉」那一頁就是這樣來的。
        <Link href="/dog-food/hidden-chicken" style={a}>去看看</Link>。
      </p>

      <H>怎麼找到我們</H>
      {hasContact ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {CONTACT.line && (
            <a href={CONTACT.line} target="_blank" rel="noopener" style={btn}>用 LINE 問</a>
          )}
          {CONTACT.email && (
            <a href={`mailto:${CONTACT.email}`} style={btnGhost}>寄信</a>
          )}
        </div>
      ) : (
        <Box tone="warn">
          <b>聯絡管道還在開通。</b>
          我們不想放一個點下去沒反應的按鈕在這裡 —— 開好了就會出現在這一段。
          在那之前，<Link href="/" style={a}>裁決器</Link>已經可以用，
          它回答的就是上面「答得出來」那四類問題。
        </Box>
      )}

      <p style={{ marginTop: 40 }}>
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
      padding: "14px 16px", fontSize: 14.5, lineHeight: 1.8, margin: "14px 0 0",
    }}>{children}</div>
  );
}

const ul: React.CSSProperties = {
  paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95,
};

const a: React.CSSProperties = { color: "var(--accent)" };

const tpl: React.CSSProperties = {
  background: "var(--sunken)", border: "1px solid var(--line)",
  borderRadius: 10, padding: "16px 18px",
  fontSize: 13.5, lineHeight: 2.1, color: "var(--muted)",
};

const btn: React.CSSProperties = {
  background: "var(--accent)", color: "var(--accent-ink)",
  borderRadius: 999, padding: "12px 26px", fontSize: 15, fontWeight: 700,
  textDecoration: "none", display: "inline-block",
};

const btnGhost: React.CSSProperties = {
  border: "1px solid var(--line)", color: "var(--ink)",
  borderRadius: 999, padding: "11px 25px", fontSize: 15, fontWeight: 600,
  textDecoration: "none", display: "inline-block",
};
