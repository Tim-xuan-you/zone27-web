import Link from "next/link";
import Decider from "@/components/Decider";

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
        <nav style={{ display: "flex", gap: 16, fontSize: 12.5, color: "var(--muted)" }}>
          <span>失敗案例庫</span><span>校準紀錄</span>
          <Link href="/how-we-choose" style={{ color: "inherit", textDecoration: "none" }}>分潤政策</Link>
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
