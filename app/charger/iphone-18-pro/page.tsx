import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { TIER_TONE, TIER_ZH, chargerById, chargers, deviceById, fit } from "@/lib/charger";

/**
 * 招牌頁：iPhone 18 Pro 要哪一顆充電器才會最快。
 *
 * 2026-09 iPhone 18 Pro 剛上市，Apple 在規格頁寫了一句大部分人不會注意到的話：
 * 要 15 分鐘到 50%，得用「支援可調式電壓供電（AVS）的 60W 以上」轉接器。
 * 家裡那顆 65W、70W 規格上沒寫 AVS，插上去能充，但不是這個速度。
 *
 * 蝦皮上寫 AVS 的也一堆，其中有的 AVS 那一檔只有 40W（KINYO 60W 官方規格：20V 2A）。
 * 這一頁只寫官方寫的：Apple 怎麼說、每一顆的規格表怎麼寫。我們沒有儀器，不寫實測。
 *
 * 只講 iPhone。養三星的人不會想在這裡看到三星（跟狗貓分開是同一個道理）。
 */

export const metadata: Metadata = {
  title: "iPhone 18 Pro 要哪一顆充電器才會最快",
  description:
    "Apple 寫的：iPhone 18 Pro 約 15 分鐘充到 50%，要 60W 以上、支援 AVS 的轉接器。65W、70W 沒寫 AVS 的不算；寫了 AVS 的，也要看 AVS 那一檔到幾瓦。我們讀了 11 顆的官方規格，一顆一顆列出來。",
  alternates: { canonical: "/charger/iphone-18-pro" },
};

export default function Page() {
  const ip = deviceById("ip18pro")!;
  const rows = chargers
    .map((c) => ({ c, g: fit(c, [ip]).got![0] }))
    .sort((a, b) => Number(b.g.tier === "fast") - Number(a.g.tier === "fast") || b.g.w - a.g.w);
  const fast = rows.filter((r) => r.g.tier === "fast");
  const kinyo = chargerById("ch-09")!;
  const q67 = chargerById("ch-10")!;

  return (
    <main style={S.page}>
      <SiteHeader current="charger" />

      <h1 style={{ fontSize: "clamp(26px,5.5vw,36px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        iPhone 18 Pro 要哪一顆充電器才會最快
      </h1>
      <p style={lead}>
        Apple 寫的：iPhone 18 Pro 和 Pro Max 約 15 分鐘到 50%，條件是 <b>60W 以上、支援 AVS 的轉接器</b>。
        家裡那顆 65W、70W 如果規格上沒寫 AVS，插上去照樣能充，只是不是這個速度。
      </p>
      <p style={{ ...S.hint, margin: "0 0 8px" }}>最後查核 {chargers[0].checkedAt} · 我們讀了 {chargers.length} 顆的官方規格</p>

      <p style={S.lbl}>直接講答案</p>
      <div style={answerBox}>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.85 }}>
          我們讀過的 {chargers.length} 顆裡，單獨插 iPhone 18 Pro 能到 Apple 寫的最快速度的有 {fast.length} 顆：
        </p>
        <ul style={{ margin: "10px 0 0", paddingLeft: 20, fontSize: 15.5, lineHeight: 1.9 }}>
          {fast.map(({ c }) => (
            <li key={c.id}>
              <Link href={`/charger/p/${c.id}`} style={{ color: "var(--accent)", fontWeight: 700 }}>{c.brand} {c.name}</Link>
              <span style={{ color: "var(--muted)" }}>：{c.back}</span>
            </li>
          ))}
        </ul>
      </div>

      <p style={S.lbl}>AVS 是什麼</p>
      <p style={body}>
        全名是可調式電壓供電（Adjustable Voltage Supply），USB PD 裡比較新的一種供電方式。
        Apple 這次把它寫進 iPhone 18 Pro 的快充條件：第三方的轉接器要「60W 以上、使用 AVS、支援 USB PD 3.2」。
        Apple 自己的 40W 動態電源轉接器（最高輸出 60W）官方寫了支援 AVS，名字寫 40W，其實最高給到 60W。
      </p>

      <p style={S.lbl}>寫了 AVS 的，也要看那一檔幾瓦</p>
      <p style={body}>
        蝦皮上現在很多充電器標題寫「AVS」「支援 iPhone 18」。規格表要翻到背面看：
      </p>
      <div style={caseBox}>
        <p style={{ margin: 0, fontWeight: 700, lineHeight: 1.7 }}>{kinyo.brand} {kinyo.name}</p>
        <p style={{ margin: "6px 0 0", fontSize: 15.5, lineHeight: 1.85 }}>
          包裝寫 60W、寫 AVS。官方規格表的 AVS 那一行是 15V 2.67A、20V 2A，乘起來都是 40W。
          一般 USB PD 模式可以到 60W，但 Apple 要的是 AVS 那一檔到 60W。
        </p>
      </div>
      <p style={body}>
        也有寫得很老實的。ONPRO Q48 有 AVS，官方直接寫「支援 iPhone 40W 快充」，沒有硬說 60W；它整顆最多 48W。
      </p>

      <p style={S.lbl}>兩個孔一起插，就不是 60W 了</p>
      <p style={body}>
        {q67.brand} {q67.name}單孔插 iPhone 18 Pro 有 AVS 60W。
        兩個孔一起用，官方寫的是 45W＋20W，而且沒寫那時候 AVS 還在不在。
        要同時充筆電跟 iPhone，又兩台都要最快，一顆雙孔做不到，
        <Link href="/charger?d=ip18pro,mba" style={{ color: "var(--accent)", fontWeight: 700 }}>點你的裝置算一次</Link>會看到怎麼配。
      </p>

      <p style={S.lbl}>線也要對</p>
      <p style={body}>
        Apple 的測試條件寫的是「支援 60W 以上的 USB-C 連接線」。iPhone 18 Pro 盒子裡附的那條可以。
        用 MagSafe 無線充的話，要 35W 以上的轉接器，約 30 分鐘到 50%。
      </p>

      <p style={S.lbl}>{chargers.length} 顆一顆一顆看</p>
      <div style={listWrap}>
        {rows.map(({ c, g }, i) => (
          <Link key={c.id} href={`/charger/p/${c.id}`} style={{ ...row, borderTop: i ? "1px solid var(--line)" : 0 }}>
            <span style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{c.brand}</span>
                <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, lineHeight: 1.5 }}>{c.name}</span>
              </span>
              <b style={{ fontSize: 14, color: `var(--${TIER_TONE[g.tier]})`, whiteSpace: "nowrap" }}>{TIER_ZH[g.tier]}</b>
            </span>
            <span style={{ display: "block", fontSize: 14, color: "var(--muted)", lineHeight: 1.75, marginTop: 2 }}>{g.why}</span>
          </Link>
        ))}
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          iPhone 18 Pro 的條件取自 Apple 台灣規格頁與 Apple 支援「為 iPhone 快速充電」；充電器規格取自各品牌官網。
          我們沒有實測。「能充，不是最快」的意思是規格上沒寫 AVS 或 AVS 不到 60W，會慢多少 Apple 沒寫，我們也不猜。
        </p>
      </footer>
    </main>
  );
}

const lead: React.CSSProperties = { color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 10px", maxWidth: "42ch" };
const body: React.CSSProperties = { margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.95 };
const answerBox: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--keep)", borderRadius: 14, padding: "18px 20px",
};
const caseBox: React.CSSProperties = {
  margin: "0 0 14px", background: "var(--surface)", border: "1px solid var(--line)", borderLeft: "4px solid var(--cut)",
  borderRadius: 14, padding: "14px 18px",
};
const listWrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
const row: React.CSSProperties = { display: "block", padding: "12px 16px", textDecoration: "none", color: "inherit" };
