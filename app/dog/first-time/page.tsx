import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Stamp from "@/components/Stamp";
import { S } from "@/components/styles";
import { parse } from "@/lib/parse";
import { catalog, catalogOf, constraintsFor } from "@/lib/catalog";
import { adjudicate, cansOf, dailyGrams, FRESH_DAYS, kgOf, KCAL_PER_KG, mer, pricePerKg, stageForAge, unitOf } from "@/lib/engine";
import { productHref } from "@/lib/labels";
import { shareAtLowEnd, treatsOf } from "@/lib/treat";
import type { Merchant, Product } from "@/lib/types";

/**
 * 第一次養狗，先買這幾樣。
 *
 * 跟 /cat/first-time 同一個想法：第一次養的人要的是答案，不是知識。
 * 狗跟貓差在兩個地方：
 *   1. 幼犬的體重差很多，一隻吉娃娃幼犬 1 公斤，一隻米克斯幼犬可能 8 公斤，
 *      所以份量給一張小表，不給一個數字
 *   2. 狗不用貓砂，第二件事換成零食：潔牙骨一支的熱量常常超過一整天的零食額度
 *
 * 答案全部是引擎當場算的，跟裁決器點「幼犬」是同一個答案。
 */

const TITLE = "第一次養狗，先買這幾樣";

/* 示範用的幼犬：5 公斤、4 個月大左右。台灣剛領養的米克斯幼犬多半在這個範圍 */
const PUPPY_KG = 5;
const PUPPY_STAGE = stageForAge(0.3, "dog");
const TABLE_KG = [2, 5, 10];

function kcalOf(p: Product): number {
  return p.spec.kcal ?? KCAL_PER_KG;
}
function gramsFor(p: Product, kg: number): number {
  return dailyGrams(kg, PUPPY_STAGE, "dog", kcalOf(p));
}
function daysOf(p: Product, m: Merchant): number | null {
  const kg = kgOf(unitOf(p, m));
  return kg ? Math.round((kg * 1000) / gramsFor(p, PUPPY_KG)) : null;
}

/** 第一次買哪一個大小：45 天內吃得完的裡面每公斤最便宜的；都吃不完就挑最小包 */
function firstBag(p: Product): Merchant | null {
  const live = p.price.merchants.filter((m) => !m.dead && !m.soldOut && m.affiliateUrl);
  if (!live.length) return null;
  const withKg = live.map((m) => ({ m, kg: kgOf(unitOf(p, m)) ?? 0, days: daysOf(p, m) ?? 999 })).filter((x) => x.kg > 0);
  if (!withKg.length) return live[0];
  const fresh = withKg.filter((x) => x.days <= FRESH_DAYS);
  const pool = fresh.length ? fresh : [withKg.reduce((a, b) => (b.kg < a.kg ? b : a))];
  const per = (x: { kg: number; m: Merchant }) => x.m.amount / x.kg;
  return pool.reduce((a, b) => (per(b) < per(a) ? b : a)).m;
}

const V = (() => {
  const s = parse("幼犬", "dog", "dry").situation;
  s.constraints = constraintsFor(s);
  return adjudicate(catalog, s);
})();
const DRY = V.stop ? null : V.pick;
/* 想省一點：引擎給的「便宜兩成以上、一樣符合條件」那一款 */
const CHEAP = V.alt?.kind === "cheaper" ? V.alt.p : null;

/* 潔牙骨：照品牌標的體重下限算，一支就超過一整天零食額度的有幾款 */
const CHEWS = treatsOf("dog").map((p) => shareAtLowEnd(p)).filter((x) => x !== null);
const CHEW_OVER = CHEWS.filter((x) => x!.share > 100).length;

/* 狗罐頭：一隻 12 公斤的成犬全吃罐頭，一天要幾罐 */
const ADULT_KCAL = mer(12, "adultFixed", "dog");
const CANS = catalogOf("dog", "wet")
  .map((p) => { const c = cansOf(p.price.unit); return c && p.spec.kcal ? ADULT_KCAL / ((c.g / 1000) * p.spec.kcal) : null; })
  .filter((n): n is number => n !== null);

export const metadata: Metadata = {
  title: TITLE,
  description:
    "剛把幼犬帶回家，要做決定的只有兩件事：吃什麼、零食要不要給。" +
    `${DRY ? `乾糧直接給答案：${DRY.brand} ${DRY.name}，` : ""}份量照幼犬體重列一張表。` +
    "還有新手最常買錯的三件事。",
  alternates: { canonical: "/dog/first-time" },
  openGraph: { title: TITLE, type: "article" },
};

export default function Page() {
  const bag = DRY && firstBag(DRY);
  const cheapBag = CHEAP ? firstBag(CHEAP) : null;
  const days = DRY && bag ? daysOf(DRY, bag) : null;
  const noKcal = DRY && !DRY.spec.kcal;

  return (
    <main style={S.page}>
      <SiteHeader current="dog" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        第一次養狗，<br />先買這幾樣
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 12px", maxWidth: "42ch" }}>
        剛帶回家的那幾天，真的要做決定的只有兩件事：吃什麼、零食要不要給。
        每一樣直接給你一個答案，其他的照清單買就好。
      </p>

      {/* ---------------- 1. 吃什麼 ---------------- */}
      <p style={S.lbl}>1. 吃什麼</p>
      {DRY && (
        <Pick
          p={DRY}
          m={bag}
          kicker="幼犬專用乾糧"
          why={[
            "一歲以前的狗長得很快，要吃熱量和營養比較高的幼犬飼料。",
            DRY.spec.bodySize.length === 3 ? "大型、中型、小型的幼犬都能吃。" : "",
            bag && days ? `第一包建議買 ${bag.unit ?? DRY.price.unit}，一隻 ${PUPPY_KG} 公斤的幼犬大約吃 ${days} 天。` : "",
          ]}
        />
      )}
      {CHEAP && cheapBag && (
        <Pick
          p={CHEAP}
          m={cheapBag}
          kicker="想省一點的話"
          why={[
            CHEAP.spec.lifeStage.includes("all") ? "這一包是全年齡都能吃的，幼犬可以吃，長大也不用換。" : "",
            "差別是它沒有特別為幼犬調整。",
          ]}
          quiet
        />
      )}

      {DRY && (
        <div style={{ ...S.box, marginTop: 4 }}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 17 }}>一天吃多少</p>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
            幼犬的體重差很多，照牠現在幾公斤看，4 個月大左右的份量：
          </p>
          <div style={{ display: "grid", gap: 6 }}>
            {TABLE_KG.map((kg) => (
              <div key={kg} style={{ display: "flex", justifyContent: "space-between", fontSize: 15.5, borderBottom: "1px solid var(--line)", padding: "6px 0" }}>
                <span>{kg} 公斤</span>
                <span className="mono" style={{ fontWeight: 700 }}>一天約 {gramsFor(DRY, kg)} 公克</span>
              </div>
            ))}
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
            分成幾餐給。
            {noKcal ? `這一包我們查不到熱量，先照一般乾糧每公斤 ${KCAL_PER_KG.toLocaleString()} 大卡估，實際以包裝上的建議量為準。` : ""}
            <Link href="/dog-food/how-much" style={link}>照體重和月齡算 →</Link>
          </p>
        </div>
      )}
      <p style={note}>
        原本在收容所或前飼主那裡吃的那一包，第一個禮拜先不要換，環境已經變了，飼料再換容易拉肚子。
        要換的時候新舊混著吃，大約一個禮拜換完。
      </p>

      <div style={{ ...S.box, marginTop: 14 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>罐頭要不要買？可以不用</p>
        <p style={{ margin: "8px 0 0", fontSize: 15.5, lineHeight: 1.9 }}>
          幼犬乾糧的營養本來就是完整的，只吃乾糧沒問題。想給罐頭，挑包裝寫<b>「主食罐」</b>的，
          當配菜拌一點就好。
        </p>
        <Link href="/dog-wet-food" style={{ ...link, display: "inline-block", marginTop: 8, marginLeft: 0 }}>我們讀過的狗主食罐 →</Link>
      </div>

      {/* ---------------- 2. 零食 ---------------- */}
      <p style={S.lbl}>2. 零食要不要給</p>
      <div style={S.box}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>前幾個月可以先不買</p>
        <p style={{ margin: "8px 0 0", fontSize: 15.5, lineHeight: 1.9 }}>
          零食不是必需品。要訓練牠坐下、上廁所的時候，拿平常的飼料一顆一顆當獎勵就可以。
          零食會吃掉正餐的份量，一天有上限。
        </p>
        <Link href="/dog-treat" style={{ ...link, display: "inline-block", marginTop: 8, marginLeft: 0 }}>每一款零食佔掉一天多少額度 →</Link>
      </div>

      {/* ---------------- 最常買錯的 ---------------- */}
      <p style={S.lbl}>新手最常買錯的三件事</p>
      <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li style={{ marginBottom: 10 }}>
          <b>第一包就買大包。</b>大包每公斤比較便宜，但飼料開封超過 {FRESH_DAYS} 天會氧化，狗就不愛吃了。
          {DRY ? ` 一隻 ${PUPPY_KG} 公斤的幼犬一天吃 ${gramsFor(DRY, PUPPY_KG)} 公克左右，${FRESH_DAYS} 天大約 ${Math.round((gramsFor(DRY, PUPPY_KG) * FRESH_DAYS) / 100) / 10} 公斤，第一包不要超過這個重量。` : ""}
        </li>
        {CHEWS.length > 0 && (
          <li style={{ marginBottom: 10 }}>
            <b>潔牙骨當成點心天天給。</b>潔牙骨一支的熱量很高。
            我們讀的 {CHEWS.length} 款潔牙骨，照品牌自己標的適用體重算，有 {CHEW_OVER} 款一支就超過那隻狗一整天的零食額度。
            <Link href="/dog-treat" style={link}>算給你看 →</Link>
          </li>
        )}
        {CANS.length > 0 && (
          <li>
            <b>以為一罐罐頭就是一餐。</b>狗罐頭跟貓罐頭差不多大，但狗吃得多很多。
            一隻 12 公斤的成犬全吃罐頭，一天要 {Math.min(...CANS).toFixed(1)} 到 {Math.max(...CANS).toFixed(1)} 罐。
            <Link href="/dog-wet-food/how-much" style={link}>一天要幾罐 →</Link>
          </li>
        )}
      </ol>

      {/* ---------------- 其他 ---------------- */}
      <p style={S.lbl}>其他要準備的</p>
      <div style={S.box}>
        <p style={{ margin: "0 0 10px", fontSize: 15.5, lineHeight: 1.9 }}>
          這幾樣我們還沒一款一款讀過，先列出來讓你不要漏買：
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["尿布墊", "飯碗", "水碗", "項圈或胸背帶", "牽繩", "外出籠", "睡墊", "指甲剪", "梳子", "玩具"].map((x) => (
            <span key={x} style={S.tag}>{x}</span>
          ))}
        </div>
      </div>

      <p style={S.lbl}>這幾件要問獸醫</p>
      <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
        打疫苗、驅蟲、什麼時候可以出門散步、什麼時候結紮，這些我們不講，每隻狗的狀況不一樣。
        另外，狗依法要辦寵物登記（植入晶片），沒辦會被罰。
        帶回家之後，先找一間離家近的獸醫，這幾件一起問、一起辦。
      </p>

      <p style={S.lbl}>之後有狀況的話</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>軟便、一直抓癢、對雞過敏</h2>
          <p style={{ margin: 0, fontSize: 15.5, color: "var(--muted)", lineHeight: 1.8 }}>
            點一下牠的年紀和狀況，我們會把不適合的飼料刪掉，剩下的才給你看。
          </p>
        </div>
        <Link style={S.btn} href="/dog">去點點看</Link>
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          份量是照熱量估的，每隻狗不一樣，看牠的體型調整。價格和容量取自購買連結當時的賣場，以賣場為準。
        </p>
      </footer>
    </main>
  );
}

function Pick({ p, m, kicker, why, quiet = false }: {
  p: Product; m: Merchant | null; kicker: string; why: string[]; quiet?: boolean;
}) {
  const buy = m ? `/go/${m.id}/${p.id}` : null;
  const per = m ? pricePerKg(unitOf(p, m), m.amount) : null;
  return (
    <div style={{ ...S.box, marginBottom: 12, borderColor: quiet ? "var(--line)" : "var(--accent)" }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: quiet ? "var(--muted)" : "var(--accent)" }}>{kicker}</span>
      <p style={{ margin: "4px 0 2px", display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--muted)" }}>
        {p.brand}<Stamp p={p} />
      </p>
      <p style={{ margin: 0, fontSize: 17, fontWeight: 700, lineHeight: 1.55 }}>
        <Link href={productHref(p)} style={{ color: "inherit", textDecoration: "none" }}>{p.name}</Link>
      </p>
      {m && (
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--muted)" }}>
          <span className="mono" style={{ color: "var(--ink)", fontWeight: 700 }}>${m.amount.toLocaleString()}</span>
          　{m.unit ?? p.price.unit}{per ? `　每公斤 $${per}` : ""}
        </p>
      )}
      <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 15.5, lineHeight: 1.85 }}>
        {why.filter(Boolean).map((w) => <li key={w}>{w}</li>)}
      </ul>
      {buy && (
        <a href={buy} rel="nofollow sponsored" style={{ ...S.buy, marginTop: 14, padding: "11px 22px", fontSize: 15.5 }}>
          去蝦皮看這一包
        </a>
      )}
    </div>
  );
}

const note: React.CSSProperties = { margin: "4px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 };
const link: React.CSSProperties = { color: "var(--accent)", fontWeight: 600, marginLeft: 4 };
