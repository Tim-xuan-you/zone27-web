import Link from "next/link";
import Decider from "@/components/Decider";

const navLink = { color: "inherit", textDecoration: "none" } as const;

export default function Home() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 40,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16 }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </div>
        {/* 這裡原本掛著「失敗案例庫」「校準紀錄」兩個沒做的頁 ——
            看起來像連結、點了沒反應，比沒有還糟。
            「分潤政策」也拿掉了：把「分潤」兩個字放在全站導覽列，
            等於在人家還沒開始問問題的時候先講錢。 */}
        <nav style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "6px 16px", fontSize: 12.5, color: "var(--muted)" }}>
          <Link href="/dog-food/hidden-chicken" style={navLink}>成分表裡有雞</Link>
          <Link href="/dog-food" style={navLink}>全部飼料</Link>
          <Link href="/how-we-choose" style={navLink}>我們怎麼挑</Link>
        </nav>
      </div>

      <h1 style={{
        fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px",
      }}>
        你的狗怎麼了？<br />用講的就好
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 32px", maxWidth: "40ch" }}>
        光是低敏飼料，市面上就上百款。你把狀況講完，我們先幫你
        <span style={{ color: "var(--cut)", fontWeight: 700 }}>刪掉</span>
        不適合的，剩下的才給你看。
      </p>

      <Decider />

      <Link href="/dog-food/hidden-chicken" style={{
        display: "block", marginTop: 56,
        background: "var(--surface)", border: "1px solid var(--line)",
        borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
        textDecoration: "none", color: "inherit",
      }}>
        <p style={{
          margin: "0 0 8px", fontFamily: "var(--font-mono), monospace",
          fontSize: 12, fontWeight: 600, letterSpacing: ".14em",
          textTransform: "uppercase", color: "var(--faint)",
        }}>我們自己讀成分表</p>
        <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 20, margin: "0 0 8px", lineHeight: 1.5 }}>
          寫著低敏，成分表裡有雞
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
          換了三種「低敏」飼料狗還是抓，很多時候是那三包裡面都有雞。
          四款逐筆核對，附來源連結 —— 包含我們自己在推的那一款。
        </p>
      </Link>

      <footer style={{
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          價格為人工複查，每張卡片都標了查價日期。點進賣場請以當下標價為準。
        </p>
        <p style={{ margin: "8px 0 0" }}>
          本站透過購買連結取得分潤，這不影響推薦排序 —— <Link href="/how-we-choose" style={{ color: "var(--muted)" }}>規則寫在這裡</Link>。
        </p>
      </footer>
    </main>
  );
}
