import type { Metadata } from "next";
import Link from "next/link";
import { S } from "@/components/styles";
import { ALLERGENS, BREEDS } from "@/lib/slugs";

export const metadata: Metadata = {
  title: "狗飼料怎麼選",
  description:
    "依品種和過敏原，我們先幫你刪掉不適合的，剩下的才給你看。每一款都寫了「不要買，如果⋯」，排序不看佣金。",
  alternates: { canonical: "/dog-food" },
};

export default function Index() {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "0 18px 90px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "22px 0 16px", borderBottom: "1px solid var(--line)", marginBottom: 26,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
      </div>

      <h1 style={{
        fontSize: "clamp(25px,5vw,34px)", fontWeight: 900, lineHeight: 1.25,
        letterSpacing: "-.02em", margin: "0 0 10px",
      }}>
        狗飼料怎麼選
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 15.5, margin: "0 0 8px", maxWidth: "52ch" }}>
        挑品種或過敏原進去，我們把不適合的刪掉再給你看。
        講得出狀況的話，<Link href="/" style={{ color: "var(--accent)" }}>直接用講的更快</Link>。
      </p>

      <p style={S.lbl}>按過敏原</p>
      <div style={S.relRow}>
        {ALLERGENS.map((a) => (
          <Link key={a.slug} href={`/dog-food/${a.slug}`} style={S.relLink}>
            不含{a.zh}
          </Link>
        ))}
      </div>

      <p style={S.lbl}>按品種</p>
      <div style={S.relRow}>
        {BREEDS.map((b) => (
          <Link key={b.slug} href={`/dog-food/${b.slug}`} style={S.relLink}>
            {b.zh}
          </Link>
        ))}
      </div>

      <footer style={{
        marginTop: 50, paddingTop: 20, borderTop: "1px solid var(--line)",
        fontSize: 12, color: "var(--faint)", lineHeight: 1.7,
      }}>
        <p style={{ margin: 0 }}>
          目前為建置階段，商品與數據為示範資料。本站透過購買連結取得分潤，這不影響推薦排序。
        </p>
      </footer>
    </main>
  );
}
