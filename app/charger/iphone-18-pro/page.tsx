import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { S } from "@/components/styles";
import { readerNotes } from "@/lib/notes";
import { TIER_TONE, anchorCharger, chargerById, chargers, deviceById, fit, rank, tierZh } from "@/lib/charger";

/**
 * 招牌頁：iPhone 18 Pro 要哪一顆充電器才會最快。
 *
 * 2026-09 iPhone 18 Pro 剛上市，Apple 在規格頁寫了一句大部分人不會注意到的話：
 * 要 15 分鐘到 50%，得用「支援可調式電壓供電（AVS）的 60W 以上」轉接器。
 *
 * 2026-09-26 Tim：「好多用詞有看沒有懂，直接我這款手機推薦我買哪一個能充最快。」
 * 所以這一頁先給答案（哪一顆、多少錢、按鈕），再回答大家會問的三件事：
 * 家裡那顆能不能用、寫了 AVS 是不是就一定快、兩台一起充會怎樣。
 * AVS 這個字只出現在「盒子上會寫」的地方，讓人知道去哪裡看，不解釋規格。
 *
 * 只講 iPhone。用三星的人不會想在這裡看到三星（跟狗貓分開是同一個道理）。
 */

export const metadata: Metadata = {
  title: "iPhone 18 Pro 要哪一顆充電器才會最快",
  description:
    "直接講答案：插上去約 15 分鐘充到一半的是哪幾顆、多少錢。家裡的 65W、70W 可以用嗎？寫了 AVS 就一定最快嗎？兩台一起充會怎樣？一頁講完。",
  alternates: { canonical: "/charger/iphone-18-pro" },
};

export default function Page() {
  const ip = deviceById("ip18pro")!;
  const ranked = rank([ip]);
  const fast = ranked.filter((f) => f.fast === 1);
  const top = fast[0];
  const m = top ? anchorCharger(top.charger) : undefined;
  const kinyo = chargerById("ch-09")!;
  const q67 = chargerById("ch-10")!;
  const pair = q67.combos[0];
  const withAvs = chargers.filter((c) => c.ports.some((p) => p.avs !== undefined)).length;

  return (
    <main style={S.page}>
      <SiteHeader current="charger" />

      <h1 style={{ fontSize: "clamp(26px,5.5vw,36px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        iPhone 18 Pro 要哪一顆充電器才會最快
      </h1>

      <p style={S.lbl}>直接講答案</p>
      <div style={answerBox}>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.85 }}>
          插上去約 <b>15 分鐘充到一半</b>的，我們看過的 {chargers.length} 顆裡有這 {fast.length} 顆：
        </p>
        <div style={{ margin: "10px 0 0" }}>
          {fast.map(({ charger: c }) => {
            const a = anchorCharger(c);
            return (
              <Link key={c.id} href={`/charger/p/${c.id}`} style={pickRow}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{c.brand}</span>
                  <b style={{ display: "block", fontSize: 17, lineHeight: 1.5 }}>{c.name}</b>
                </span>
                <span className="mono" style={{ fontSize: 17, fontWeight: 800, whiteSpace: "nowrap" }}>
                  {a ? `$${a.amount.toLocaleString()}` : "還沒有連結"}
                </span>
              </Link>
            );
          })}
        </div>
        {top && m && (
          <div style={S.buyRow}>
            <a href={`/go/${m.id}/${top.charger.id}`} rel="nofollow sponsored" style={S.btnBuy}>
              去蝦皮看 {top.charger.brand} 那一顆
            </a>
            <p style={S.buyNote}>{[m.label, "$" + m.amount.toLocaleString(), ...readerNotes(m.note, { keepVariant: true })].join(" · ")}</p>
          </div>
        )}
      </div>

      <p style={S.lbl}>家裡那顆 65W、70W 可以用嗎？</p>
      <p style={body}>
        可以充，只是沒這麼快。iPhone 18 Pro 這次用了一種新的快充，充電器的盒子上會寫「AVS」，而且要給到 60W。
        我們看過的 {chargers.length} 顆，只有 {withAvs} 顆寫了 AVS。瓦數再大也不算：Apple 列給 iPhone 18 Pro 最快的，也只有自己的 40W 動態那一顆，70W、140W 都不在裡面。
      </p>

      <p style={S.lbl}>寫了 AVS 就一定最快嗎？</p>
      <p style={body}>
        不一定。有的寫了，但新快充那一段只給到 40W。
      </p>
      <div style={caseBox}>
        <p style={{ margin: 0, fontWeight: 700, lineHeight: 1.7 }}>{kinyo.brand} {kinyo.name}</p>
        <p style={{ margin: "6px 0 0", fontSize: 15.5, lineHeight: 1.85 }}>
          賣場標題寫支援 iPhone 18。規格表翻到背面，新快充最多 40W，iPhone 18 Pro 最快要 60W。
          插得進去，但不是 15 分鐘那個速度。
        </p>
      </div>

      <p style={S.lbl}>兩台一起充呢？</p>
      <p style={body}>
        雙孔的充電器，兩台一起插，每台分到的就變少。{q67.brand} {q67.name}單獨插 iPhone 是最快的，
        兩台一起插變成 {pair.w.C1}W 加 {pair.w.C2}W，iPhone 就沒那麼快了。
        要跟筆電一起充，<Link href="/charger?d=ip18pro,mba" style={{ color: "var(--accent)", fontWeight: 700 }}>點你的裝置算一次</Link>。
      </p>

      <p style={S.lbl}>線也要對</p>
      <p style={body}>
        用盒子裡附的那條就可以。要無線充（MagSafe），轉接器要 35W 以上，約 30 分鐘充到一半。
      </p>

      <details style={S.more}>
        <summary style={S.moreSummary}>
          <span>我們看過的 {chargers.length} 顆，一顆一顆看</span>
          <span style={S.moreHint}>展開</span>
        </summary>
        <div style={{ ...listWrap, marginTop: 12 }}>
          {ranked.map(({ charger: c }, i) => {
            const g = fit(c, [ip]).got![0];
            return (
              <Link key={c.id} href={`/charger/p/${c.id}`} style={{ ...row, borderTop: i ? "1px solid var(--line)" : 0 }}>
                <span style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{c.brand}</span>
                    <b style={{ display: "block", fontSize: 15.5, lineHeight: 1.5 }}>{c.name}</b>
                  </span>
                  <b style={{ fontSize: 14, color: `var(--${TIER_TONE[g.tier]})`, whiteSpace: "nowrap" }}>{tierZh(ip, g.tier)}</b>
                </span>
                <span style={{ display: "block", fontSize: 14, color: "var(--muted)", lineHeight: 1.75, marginTop: 2 }}>{g.why}</span>
              </Link>
            );
          })}
        </div>
      </details>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          充電時間跟條件來自 Apple 的 iPhone 18 Pro 規格和「為 iPhone 快速充電」說明，充電器的數字來自各品牌官網，{chargers[0].checkedAt} 查的。
          沒那麼快的會慢多少，Apple 沒寫，我們也不猜。
        </p>
      </footer>
    </main>
  );
}

const body: React.CSSProperties = { margin: "0 0 14px", fontSize: 15.5, lineHeight: 1.95 };
const answerBox: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--keep)", borderRadius: 14, padding: "18px 20px", boxShadow: "var(--sh-lift)",
};
const pickRow: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "10px 0", borderTop: "1px solid var(--line)", textDecoration: "none", color: "inherit",
};
const caseBox: React.CSSProperties = {
  margin: "0 0 14px", background: "var(--surface)", border: "1px solid var(--line)", borderLeft: "4px solid var(--cut)",
  borderRadius: 14, padding: "14px 18px",
};
const listWrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
const row: React.CSSProperties = { display: "block", padding: "12px 16px", textDecoration: "none", color: "inherit" };
