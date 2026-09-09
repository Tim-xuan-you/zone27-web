import type { Metadata } from "next";
import Link from "next/link";
import { S } from "@/components/styles";
import { ALLERGENS, BREEDS } from "@/lib/slugs";

export const metadata: Metadata = {
  title: "狗飼料怎麼選",
  description:
    "依品種和過敏原，我們先幫你刪掉不適合的，剩下的才給你看。每一款都寫清楚什麼時候不要買。",
  alternates: { canonical: "/dog-food" },
};

export default function Index() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 40,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
      </div>

      <h1 style={{
        fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px",
      }}>
        狗飼料怎麼選
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 8px", maxWidth: "42ch" }}>
        挑品種或過敏原進去，我們把不適合的刪掉再給你看。
        講得出狀況的話，<Link href="/" style={{ color: "var(--accent)" }}>直接用講的更快</Link>。
      </p>

      <p style={S.lbl}>先看這個</p>
      <Link href="/dog-food/hidden-chicken" style={{
        display: "block", background: "var(--surface)", border: "1px solid var(--line)",
        borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
        textDecoration: "none", color: "inherit",
      }}>
        <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 20, margin: "0 0 8px", lineHeight: 1.5 }}>
          寫著低敏，成分表裡有雞
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
          換了三種「低敏」飼料狗還是抓，很多時候是那三包裡面都有雞。逐筆核對，附來源與查核日期。
        </p>
      </Link>

      <Link href="/dog-food/how-much" style={{
        display: "block", marginTop: 14,
        background: "var(--surface)", border: "1px solid var(--line)",
        borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
        textDecoration: "none", color: "inherit",
      }}>
        <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 20, margin: "0 0 8px", lineHeight: 1.5 }}>
          狗一天要吃多少飼料
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
          用獸醫的能量公式算一天幾克、這包吃幾天、一個月多少錢。算式全部寫出來，你可以自己驗。
        </p>
      </Link>

      <Link href="/dog-food/grain-free" style={{
        display: "block", marginTop: 14,
        background: "var(--surface)", border: "1px solid var(--line)",
        borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
        textDecoration: "none", color: "inherit",
      }}>
        <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 20, margin: "0 0 8px", lineHeight: 1.5 }}>
          無穀飼料到底有沒有比較好
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
          「無穀」不等於無雞、不等於低碳水、也不等於豆類少。用我們自己十款的成分表對照。
        </p>
      </Link>

      <Link href="/dog-food/elimination-diet" style={{
        display: "block", marginTop: 14,
        background: "var(--surface)", border: "1px solid var(--line)",
        borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px",
        textDecoration: "none", color: "inherit",
      }}>
        <h2 style={{ fontFamily: "var(--font-serif), serif", fontSize: 20, margin: "0 0 8px", lineHeight: 1.5 }}>
          排除飲食法：怎麼真的找出牠對什麼過敏
        </h2>
        <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
          一直抓癢的狗裡只有約 18% 是食物造成的。要確認得跑滿八週，而且最後要回測。
        </p>
      </Link>

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
        marginTop: 72, paddingTop: 28, borderTop: "1px solid var(--line)",
        fontSize: 13, color: "var(--faint)", lineHeight: 1.9,
      }}>
        <p style={{ margin: 0 }}>
          價格為人工複查，每張卡片都標了查價日期。點進賣場請以當下標價為準。本站透過購買連結取得分潤，這不影響推薦排序。
        </p>
      </footer>
    </main>
  );
}
