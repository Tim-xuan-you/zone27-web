import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import CanCalc from "@/components/CanCalc";
import Share from "@/components/Share";
import { S } from "@/components/styles";
import { catalogOf } from "@/lib/catalog";
import { cansOf, mer, KCAL_PER_KG } from "@/lib/engine";
import type { Product } from "@/lib/types";

/**
 * 狗一天要吃幾罐。
 *
 * /dog-food/cans 那一頁回答的是「算式長什麼樣」，給的是計算機。
 * 這一頁不一樣：數字全部從我們自己讀過的 12 款算出來，
 * 每一罐幾大卡是品牌公布的，不是我們估的。
 *
 * 這一題狗跟貓差很多，而且差在一個大家沒想過的地方：
 * 貓罐頭一罐 80 克，貓一天 250 大卡，兩三罐就飽了。
 * 狗罐頭也是 80 到 165 克，但狗一天 722 大卡。
 * 罐子沒有變大，狗變大了。所以罐數會翻到三倍、五倍。
 *
 * 最狠的那個數字不是我們算的，是品牌自己印在包裝上的：
 * 西莎自然素材寫「5 公斤愛犬 1 日建議食用 5 又 1/3 盒」。
 * 我們只是把它換算到 12 公斤，然後乘 30 天。
 */

const KG = 12;
const DAY = Math.round(mer(KG, "adultFixed", "dog"));

/** 一罐幾大卡。品牌沒公布代謝能的就算不出來 */
function kcalPerCan(p: Product): number | null {
  const c = cansOf(p.price.unit);
  return c && p.spec.kcal ? Math.round((c.g / 1000) * p.spec.kcal) : null;
}

const ALL = catalogOf("dog", "wet");
const WITH_KCAL = ALL
  .map((p) => ({ p, kc: kcalPerCan(p) }))
  .filter((x): x is { p: Product; kc: number } => x.kc !== null)
  .map((x) => ({ ...x, cans: DAY / x.kc }))
  .sort((a, b) => a.cans - b.cans);

const FEWEST = WITH_KCAL[0];
const MOST = WITH_KCAL[WITH_KCAL.length - 1];

/* 西莎自然素材：包裝上自己標的餵食量。
   5 公斤的狗一天 5⅓ 盒 → 換算到 12 公斤照 MER 的比例，不是照體重直接乘。
   體重乘 2.4 倍，熱量需求只乘 1.9 倍（代謝率跟體重的 0.75 次方成正比）。 */
const CESAR_KG = 5;
const CESAR_BOX = 16 / 3;
const KCAL_RATIO = mer(KG, "adultFixed", "dog") / mer(CESAR_KG, "adultFixed", "dog");
const CESAR_AT_12 = Math.round(CESAR_BOX * KCAL_RATIO * 10) / 10;

const DRY_G = Math.round((DAY / KCAL_PER_KG) * 1000);

const TITLE = "狗一天要吃幾罐";

export const metadata: Metadata = {
  title: TITLE,
  description:
    `一隻 ${KG} 公斤結紮的成犬一天大約 ${DAY} 大卡。我們讀過的狗主食罐裡，` +
    `熱量最高的一天要 ${FEWEST.cans.toFixed(1)} 罐，最低的要 ${MOST.cans.toFixed(1)} 罐。` +
    `有一款品牌自己標了餵食量：5 公斤的狗一天 5 又 1/3 盒。`,
  alternates: { canonical: "/dog-wet-food/how-much" },
  openGraph: { title: TITLE, type: "article" },
};

export default function Page() {
  return (
    <main style={S.page}>
      <SiteHeader current="dog-wet-food" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        狗一天要吃幾罐
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 18px", maxWidth: "42ch" }}>
        一罐看起來像一餐，其實差很遠。
        一隻 {KG} 公斤的狗一天要 <b style={{ color: "var(--ink)" }}>{DAY} 大卡</b>，罐頭大部分是水，一罐給不了多少熱量。
      </p>

      <div style={S.box}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>算式只有一行</p>
        <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.95 }}>
          一天要幾罐 ＝ <b>一天的熱量</b> ÷ <b>一罐幾大卡</b>
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
          下面的罐數是拿我們讀過的那幾款實際算的。每一罐幾大卡是品牌公布的代謝能乘上淨重，
          不是我們估的。品牌沒公布代謝能的那幾款，這一頁就沒有它們。
        </p>
      </div>

      <p style={S.lbl}>{KG} 公斤結紮成犬，全吃罐頭</p>
      <div style={table}>
        {WITH_KCAL.map(({ p, kc, cans }) => (
          <div key={p.id} style={tr}>
            <span style={{ flex: 1, minWidth: 0 }}>
              <Link href={`/dog-wet-food/p/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                <span style={{ color: "var(--faint)", fontSize: 12.5 }}>{p.brand}</span>
                <br />
                {p.name}
              </Link>
            </span>
            <span style={{ ...num, minWidth: "5.5em" }}>{p.price.unit}<br />
              <span style={{ color: "var(--faint)", fontSize: 12.5 }}>{kc} 大卡</span>
            </span>
            <span style={{ ...num, minWidth: "4.5em", fontWeight: 700, fontSize: 17 }}>
              {cans.toFixed(1)}<span style={{ fontSize: 12.5, fontWeight: 400 }}> 罐</span>
            </span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: 14, color: "var(--faint)", lineHeight: 1.9, margin: "12px 0 0" }}>
        一天 {MOST.cans.toFixed(1)} 罐不是打錯字。那一款一罐 {MOST.p.price.unit}、{MOST.kc} 大卡，
        水分 {MOST.p.spec.moisture}%。體重大的狗吃小罐，數字就是這樣。
      </p>

      <p style={S.lbl}>有一款不用我們算，包裝上寫了</p>
      <div style={{ ...S.box, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          西莎自然素材餐盒的背面印著餵食建議：
          <b>「依據愛犬體重，5 公斤愛犬 1 日建議食用 5 又 1/3 盒。」</b>
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 15.5, lineHeight: 1.9 }}>
          一盒 85 公克。5 又 1/3 盒是 453 公克，這是給一隻 5 公斤的狗。
          換算到 {KG} 公斤，大約是一天 <b>{CESAR_AT_12} 盒</b>。
        </p>
        <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.9 }}>
          換算照代謝率算：體重變 {Math.round((KG / CESAR_KG) * 10) / 10} 倍，熱量需求只變 {Math.round(KCAL_RATIO * 10) / 10} 倍，所以不能照體重直接乘。
          這一款的粗蛋白是不低於 5%，成分表第一項是水。要吃那麼多盒，原因就在這裡。
        </p>
      </div>

      <p style={S.lbl}>跟乾糧比</p>
      <p style={{ fontSize: 15.5, color: "var(--muted)", lineHeight: 1.9, margin: "0 0 14px" }}>
        同一隻 {KG} 公斤的狗，吃乾糧一天 <b style={{ color: "var(--ink)" }}>{DRY_G} 公克</b>，
        大概是一個馬克杯的量。吃罐頭是 {FEWEST.cans.toFixed(1)} 到 {MOST.cans.toFixed(1)} 罐。
        份量差這麼多，原因是水：罐頭有七成到將近九成是水，你買的重量大部分是水的重量。
      </p>
      <div style={S.box}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          所以全吃罐頭一定比乾糧貴很多。原因在水，換哪個牌子都一樣。
          大部分的人最後會走混餵：乾糧當底，罐頭拌一點。
          混餵的比例怎麼抓，用下面的計算機。
        </p>
      </div>

      <p style={S.lbl}>算你家的</p>
      <CanCalc species="dog" />

      <div style={{ marginTop: 26, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>
        <Share
          path="/dog-wet-food/how-much"
          text={`一隻 ${KG} 公斤的狗全吃主食罐，一天要 ${FEWEST.cans.toFixed(1)} 到 ${MOST.cans.toFixed(1)} 罐。算給你看：`}
          label="把這頁傳給朋友"
        />
        <Link href="/dog-wet-food" style={{ fontSize: 14, color: "var(--accent)", fontWeight: 600 }}>
          我們讀過的狗主食罐 →
        </Link>
      </div>

      <p style={S.lbl}>相關的</p>
      <div style={S.relRow}>
        <Link href="/dog-wet-food/hidden-chicken" style={S.relLink}>名字寫鹿肉的，第一二項是雞</Link>
        <Link href="/dog-wet-food/protein" style={S.relLink}>罐子上的蛋白質差三倍，大部分是水</Link>
        <Link href="/dog-food/how-much" style={S.relLink}>狗一天吃多少乾糧</Link>
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          這一頁是估算，不是餵食指示。真正該看的是體態，還有獸醫怎麼說。
          幼犬、懷孕、哺乳、慢性病的狗都不適用上面的係數。
          每一罐的熱量照品牌公布的代謝能算，配方會改版，以你手上那一罐的標示為準。
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
  display: "flex", gap: 14, alignItems: "center", padding: "12px 0",
  borderBottom: "1px solid var(--line)", fontSize: 15.5, lineHeight: 1.6,
};
const num: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace", textAlign: "right", fontSize: 14,
};
