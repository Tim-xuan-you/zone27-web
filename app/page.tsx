import Decider from "@/components/Decider";

export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 18px 90px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "22px 0 16px", borderBottom: "1px solid var(--line)", marginBottom: 34,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16 }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </div>
        <nav style={{ display: "flex", gap: 16, fontSize: 12.5, color: "var(--muted)" }}>
          <span>失敗案例庫</span><span>校準紀錄</span><span>分潤政策</span>
        </nav>
      </div>

      <h1 style={{
        fontSize: "clamp(25px,5vw,34px)", fontWeight: 900, lineHeight: 1.25,
        letterSpacing: "-.02em", margin: "0 0 10px", textWrap: "balance",
      }}>
        你的狗怎麼了？<br />用講的就好
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 15.5, margin: "0 0 26px", maxWidth: "52ch" }}>
        光是低敏飼料，市面上就上百款。你把狀況講完，我們先幫你
        <span style={{ color: "var(--cut)", fontWeight: 700 }}>刪掉</span>
        不適合的，剩下的才給你看。
      </p>

      <Decider />

      <footer style={{
        marginTop: 60, paddingTop: 20, borderTop: "1px solid var(--line)",
        fontSize: 12, color: "var(--faint)", lineHeight: 1.7,
      }}>
        <p style={{ margin: 0 }}>
          目前為建置階段，商品與數據為示範資料。
        </p>
        <p style={{ margin: "8px 0 0" }}>
          本站透過購買連結取得分潤，這不影響推薦排序。
        </p>
      </footer>
    </main>
  );
}
