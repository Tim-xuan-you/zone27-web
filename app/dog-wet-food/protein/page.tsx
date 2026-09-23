import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Share from "@/components/Share";
import { S } from "@/components/styles";
import { catalogOf } from "@/lib/catalog";
import type { Product } from "@/lib/types";

/**
 * 罐子上的蛋白質，為什麼不能直接比。
 *
 * 這一頁一開始想寫的標題是「同樣叫主食罐，蛋白質差三倍」。
 * 資料攤開之後發現那句話只對一半：罐子上印的數字確實從 5% 到 16.2%，
 * 但扣掉水分，差距只剩一點五倍，而且排名整個翻過來 ——
 * 罐子上寫 10% 的那一款，扣掉水分是 12 款裡最高的。
 *
 * 所以這一頁講的是反過來那件事：三倍的差距大部分是水。
 * 標題照資料改，不照原本想講的。
 *
 * 每一個數字都從 data/dog-wet-food.json 算。
 */

type Row = { p: Product; asFed: number; dm: number; water: number; bound: boolean };

/** 標示寫「最少」「最多」「不低於」的，算出來只是大概 */
const BOUND = /最低|最高|最少|最多|不低於|不高於/;

const ROWS: Row[] = catalogOf("dog", "wet")
  .map((p) => ({
    p,
    asFed: p.spec.asFed?.protein ?? p.spec.protein,
    dm: p.spec.protein,
    water: p.spec.moisture ?? 0,
    bound: BOUND.test(p.knownIssues ?? ""),
  }))
  .sort((a, b) => b.dm - a.dm);

const byAsFed = [...ROWS].sort((a, b) => b.asFed - a.asFed);
const AF_HI = byAsFed[0];
const AF_LO = byAsFed[byAsFed.length - 1];
const DM_HI = ROWS[0];
const DM_LO = ROWS[ROWS.length - 1];
/** 下面「最低的那一款」那一框有兩句是照西莎的標示寫的。最低的換人了，那兩句就不能講 */
const LO_IS_CESAR = DM_LO.p.id === "dw-12";

const AF_RATIO = Math.round((AF_HI.asFed / AF_LO.asFed) * 10) / 10;
const DM_RATIO = Math.round((DM_HI.dm / DM_LO.dm) * 10) / 10;
/** 罐子上排第幾名 → 扣掉水分排第幾名，拿最戲劇化的那一款來講 */
const rankAsFed = (r: Row) => byAsFed.findIndex((x) => x.p.id === r.p.id) + 1;
/** 水分排第幾高。「是最高的」這種話一定要算過才能講 */
const byWater = [...ROWS].sort((a, b) => b.water - a.water);
const rankWater = (r: Row) => byWater.findIndex((x) => x.p.id === r.p.id) + 1;
const W_LO = byWater[byWater.length - 1].water;
const W_HI = byWater[0].water;

const TITLE = "罐子上的蛋白質差三倍，大部分是水";

export const metadata: Metadata = {
  title: TITLE,
  description:
    `我們讀的 ${ROWS.length} 款狗主食罐，罐子上的蛋白質從 ${AF_LO.asFed}% 到 ${AF_HI.asFed}%，差 ${AF_RATIO} 倍。` +
    `扣掉水分之後是 ${DM_LO.dm}% 到 ${DM_HI.dm}%，只差 ${DM_RATIO} 倍，而且排名整個翻過來。`,
  alternates: { canonical: "/dog-wet-food/protein" },
  openGraph: { title: TITLE, type: "article" },
};

export default function Page() {
  return (
    <main style={S.page}>
      <SiteHeader current="dog-wet-food" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        罐子上的蛋白質差三倍，<br />大部分是水
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 18px", maxWidth: "42ch" }}>
        兩罐並排，一罐寫蛋白質 {AF_HI.asFed}%，一罐寫 {AF_LO.asFed}%。
        直覺會選前面那一罐。先別急，翻過去看水分那一行。
      </p>

      <div style={S.box}>
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.9, fontWeight: 700 }}>
          罐子上差 {AF_RATIO} 倍，扣掉水分只差 {DM_RATIO} 倍。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9, color: "var(--muted)" }}>
          這 {ROWS.length} 款的水分從 {W_LO}% 到 {W_HI}%。水多的那一罐，每一口吃進去的肉就少，
          罐子上的蛋白質自然低。把水拿掉，只看剩下的乾物質，才是在比配方本身。
        </p>
      </div>

      <p style={S.lbl}>最明顯的一款</p>
      <div style={{ ...S.box, borderColor: "var(--keep)" }}>
        <span style={S.brand}>{DM_HI.p.brand}</span>
        <p style={{ margin: "2px 0 10px", fontSize: 17, fontWeight: 700, lineHeight: 1.6 }}>{DM_HI.p.name}</p>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          罐子上寫蛋白質 {DM_HI.asFed}%，在 {ROWS.length} 款裡排第 {rankAsFed(DM_HI)}。
          水分 {DM_HI.water}%，{rankWater(DM_HI) === 1 ? "是最高的" : `排第 ${rankWater(DM_HI)} 高`}。扣掉水分，蛋白質是 <b>{DM_HI.dm}%</b>，排第一。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.9, color: "var(--muted)" }}>
          蛋白質比例高，不代表一罐很營養：它的脂肪也很低，一罐熱量很少，
          一隻中型犬要吃很多罐才夠一天。比例是比例，份量是份量，兩件事分開看。
        </p>
      </div>

      <p style={S.lbl}>{ROWS.length} 款，照扣掉水分之後的蛋白質排</p>
      <div style={table}>
        <div style={{ ...tr, color: "var(--faint)", fontSize: 12.5, paddingTop: 8 }}>
          <span style={{ flex: 1 }}>商品</span>
          <span style={{ ...num, fontSize: 12.5 }}>罐子上</span>
          <span style={{ ...num, fontSize: 12.5 }}>水分</span>
          <span style={{ ...num, fontSize: 12.5 }}>扣掉水分</span>
        </div>
        {ROWS.map((r) => (
          <div key={r.p.id} style={tr}>
            <span style={{ flex: 1, minWidth: 0, lineHeight: 1.55 }}>
              <Link href={`/dog-wet-food/p/${r.p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                <span style={{ color: "var(--faint)", fontSize: 12.5 }}>{r.p.brand}</span>
                <br />
                <span style={{ fontSize: 14 }}>{r.p.name}</span>
              </Link>
              {r.bound && <span style={{ color: "var(--faint)", fontSize: 12.5 }}>　大概</span>}
            </span>
            <span style={num}>{r.asFed}%</span>
            <span style={{ ...num, color: "var(--faint)" }}>{r.water}%</span>
            <span style={{ ...num, fontWeight: 700 }}>{r.dm}%</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 14, color: "var(--faint)", lineHeight: 1.9, margin: "12px 0 0" }}>
        標「大概」的那幾款，品牌公布的是「蛋白質最少多少、水分最多多少」這種範圍，不是實測值。
        拿範圍去除，算出來只能當參考。
      </p>

      <p style={S.lbl}>最低的那一款，兩種算法都最低</p>
      <div style={{ ...S.box, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
        <span style={S.brand}>{DM_LO.p.brand}</span>
        <p style={{ margin: "2px 0 10px", fontSize: 17, fontWeight: 700, lineHeight: 1.6 }}>{DM_LO.p.name}</p>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          罐子上 {DM_LO.asFed}%，扣掉水分 {DM_LO.dm}%，不管怎麼算都排最後。
          {LO_IS_CESAR && "成分表第一項是水，肉寫的是「肉類及其副產品」。"}
        </p>
        {LO_IS_CESAR ? (
          <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.9 }}>
            它標的是「100% 營養完整均衡」，這一點我們沒有理由懷疑。
            只是要吃到一天的量，份量會很驚人。
            <Link href="/dog-wet-food/how-much" style={{ color: "var(--accent)" }}>品牌自己標了一天幾盒 →</Link>
          </p>
        ) : DM_LO.p.knownIssues && (
          <p style={{ margin: "12px 0 0", fontSize: 14, lineHeight: 1.9 }}>{DM_LO.p.knownIssues}</p>
        )}
      </div>

      <p style={S.lbl}>自己在店裡比的話</p>
      <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li style={{ marginBottom: 8 }}>
          <b>找到蛋白質和水分兩行。</b>罐頭一定會寫水分，沒寫的那一罐根本沒辦法比，先放下。
        </li>
        <li style={{ marginBottom: 8 }}>
          <b>蛋白質 ÷（100 − 水分）。</b>水分 80% 就除以 20，水分 75% 就除以 25。
          罐子上寫 10%、水分 80% 的，扣掉水分是 50%。
        </li>
        <li>
          <b>比完比例，再看一罐幾大卡。</b>比例高、熱量低的罐頭一天要吃很多罐，
          最後花的錢跟你想的不一樣。
        </li>
      </ol>

      <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Share
          path="/dog-wet-food/protein"
          text={`狗罐頭上的蛋白質差 ${AF_RATIO} 倍，扣掉水分只差 ${DM_RATIO} 倍。罐子上寫 ${DM_HI.asFed}% 的那一款，扣掉水分反而最高：`}
          label="把這頁傳給朋友"
        />
        <Link href="/dog-wet-food" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
          我們讀過的狗主食罐 →
        </Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/dog-wet-food/hidden-chicken" style={S.relLink}>名字寫鹿肉的，第一二項是雞</Link>
        <Link href="/dog-wet-food/how-much" style={S.relLink}>狗一天要吃幾罐</Link>
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          數字取自台灣通路商品頁上的中文標示。蛋白質是粗蛋白，不是可消化蛋白，
          品質好壞要看成分表，這一頁只比份量。配方會改版，以你手上那一罐的標示為準。
        </p>
      </footer>
    </main>
  );
}

const table: React.CSSProperties = {
  border: "1px solid var(--line)", borderRadius: 14,
  background: "var(--surface)", padding: "4px 18px 8px",
};
const tr: React.CSSProperties = {
  display: "flex", gap: 12, alignItems: "center", padding: "11px 0",
  borderBottom: "1px solid var(--line)", fontSize: 15.5,
};
const num: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace", textAlign: "right", fontSize: 14, minWidth: "4.2em",
};
