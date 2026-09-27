import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Stamp from "@/components/Stamp";
import { S } from "@/components/styles";
import { parse } from "@/lib/parse";
import { catalog, constraintsFor } from "@/lib/catalog";
import { adjudicate, dailyGrams, FRESH_DAYS, kgOf, pricePerKg, stageForAge, unitOf } from "@/lib/engine";
import { productHref } from "@/lib/labels";
import { anchorLitter, litters, liveOf, monthlyCost, sizeOf, MATERIAL_ZH, type LitterProduct } from "@/lib/litter";
import type { Form, Merchant, Product } from "@/lib/types";

/**
 * 第一次養貓，先買這幾樣。
 *
 * 2026-09-24 Tim：「有沒有可能第一次養狗、貓，上來使用我們這裁決器的？
 * 專有名詞他都看得懂？還是我們需要建一些知識教學？」
 *
 * 裁決器是給「已經知道自己要什麼」的人：對雞過敏、軟便、有點胖。
 * 第一次養的人要的是另一件事：帶回家那天要買哪幾樣，每一樣買哪一個。
 * 這一頁直接給答案，不教知識。每一樣只講一句為什麼，專有名詞一律換成白話。
 *
 * 答案全部是引擎當場算的，跟裁決器點「幼貓」得到的是同一個答案；
 * 天數、一個月多少錢也是算的。資料一改，這一頁跟著改。
 */

const TITLE = "第一次養貓，先買這幾樣";

/* 示範用的幼貓：2 公斤、4 個月大左右。台灣剛領養的幼貓多半在這個範圍 */
const KITTEN_KG = 2;
const KITTEN_STAGE = stageForAge(0.3, "cat");

function answer(text: string, form: Form = "dry"): Product | null {
  const s = parse(text, "cat", form).situation;
  s.constraints = constraintsFor(s);
  const v = adjudicate(catalog, s);
  return v.stop ? null : v.pick;
}

/** 這一包一隻幼貓吃幾天 */
function daysOf(p: Product, m: Merchant): number | null {
  const kg = kgOf(unitOf(p, m));
  if (!kg || !p.spec.kcal) return null;
  return Math.round((kg * 1000) / dailyGrams(KITTEN_KG, KITTEN_STAGE, "cat", p.spec.kcal));
}

/**
 * 第一次買哪一個大小。
 * 最便宜的常常是大包，但幼貓一包吃超過 45 天會放到氧化。
 * 所以先挑 45 天內吃得完的，裡面每公斤最便宜的；都吃不完就挑最小包。
 */
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

const DRY = answer("幼貓");
const DRY_CHEAP = answer("幼貓，想省錢");
const WET = answer("幼貓", "wet");

/* 貓砂：能少量沖馬桶、有連結的裡面，一個月最便宜的那一款 */
const LITTER = litters
  .filter((p) => p.spec.flushable === "limited" && liveOf(p).length > 0)
  .map((p) => ({ p, m: anchorLitter(p)! }))
  .map((x) => ({ ...x, month: monthlyCost(x.p, x.m)?.cost ?? Infinity }))
  .sort((a, b) => a.month - b.month)[0];
const MINERAL = litters
  .filter((p) => p.spec.material === "mineral" && liveOf(p).length > 0)
  .map((p) => ({ p, month: monthlyCost(p, anchorLitter(p)!)?.cost ?? Infinity }))
  .sort((a, b) => a.month - b.month)[0];

/* 最常買錯的：包裝寫可沖馬桶的，有幾款其實只能少量沖 */
const CLAIM_FLUSH = litters.filter((p) => p.spec.flushClaim === "yes");
const CLAIM_LIMITED = CLAIM_FLUSH.filter((p) => p.spec.flushable === "limited");
/* 能買的貓砂裡，一個月最省的是不是就是上面那一款（不限能不能沖） */
const CHEAPEST_ANY = litters
  .filter((p) => liveOf(p).length > 0)
  .map((p) => ({ p, month: monthlyCost(p, anchorLitter(p)!)?.cost ?? Infinity }))
  .sort((a, b) => a.month - b.month)[0];

export const metadata: Metadata = {
  title: TITLE,
  description:
    `剛把幼貓帶回家，要做決定的只有三件事：吃什麼、在哪裡上廁所、零食要不要給。` +
    `每一樣直接給一個答案，${DRY ? `乾糧是${DRY.brand} ${DRY.name}，` : ""}` +
    `${LITTER ? `貓砂是${LITTER.p.brand} ${LITTER.p.name}，一個月大約 $${LITTER.month}。` : ""}` +
    "還有新手最常買錯的三件事。",
  alternates: { canonical: "/cat/first-time" },
  openGraph: { title: TITLE, type: "article" },
};

export default function Page() {
  const dryBag = DRY && firstBag(DRY);
  const cheapBag = DRY_CHEAP && DRY_CHEAP.id !== DRY?.id ? firstBag(DRY_CHEAP) : null;
  const grams = DRY?.spec.kcal ? dailyGrams(KITTEN_KG, KITTEN_STAGE, "cat", DRY.spec.kcal) : null;
  const dryDays = DRY && dryBag ? daysOf(DRY, dryBag) : null;

  return (
    <main style={S.page}>
      <SiteHeader current="cat" />

      <h1 style={{ fontSize: "clamp(28px,6vw,40px)", lineHeight: 1.45, margin: "0 0 16px" }}>
        第一次養貓，<br />先買這幾樣
      </h1>
      <p style={{ color: "var(--muted)", fontSize: 17, lineHeight: 1.9, margin: "0 0 12px", maxWidth: "42ch" }}>
        剛帶回家的那幾天，真的要做決定的只有三件事：吃什麼、在哪裡上廁所、零食要不要給。
        每一樣直接給你一個答案，其他的照清單買就好。
      </p>
      <p style={{ color: "var(--faint)", fontSize: 14, lineHeight: 1.8, margin: "0 0 8px" }}>
        下面的份量照一隻 {KITTEN_KG} 公斤、4 個月大左右的幼貓算。
      </p>

      {/* ---------------- 1. 吃什麼 ---------------- */}
      <p style={S.lbl}>1. 吃什麼</p>
      {DRY && (
        <Pick
          p={DRY}
          m={dryBag}
          kicker="幼貓專用乾糧"
          why={[
            "一歲以前的貓長得很快，要吃熱量和營養比較高的幼貓飼料。",
            grams ? `一天大約 ${grams} 公克，分成幾餐給。` : "",
            dryBag && dryDays ? `第一包建議買 ${dryBag.unit ?? DRY.price.unit}，大約吃 ${dryDays} 天。` : "",
          ]}
        />
      )}
      {DRY_CHEAP && cheapBag && (
        <Pick
          p={DRY_CHEAP}
          m={cheapBag}
          kicker="想省一點的話"
          why={[
            DRY_CHEAP.spec.lifeStage.includes("all") ? "這一包是全年齡都能吃的，幼貓可以吃，長大也不用換。" : "",
            DRY_CHEAP.spec.lifeStage.includes("puppy") && !DRY_CHEAP.spec.lifeStage.includes("all") ? "" : "差別是它沒有特別為幼貓調整。",
          ]}
          quiet
        />
      )}
      <p style={note}>
        原本在收容所或前飼主那裡吃的那一包，第一個禮拜先不要換，環境已經變了，飼料再換容易拉肚子。
        要換的時候新舊混著吃，大約一個禮拜換完。
        <Link href="/cat-food/how-much" style={link}>照體重和月齡算一天吃多少 →</Link>
      </p>

      <div style={{ ...S.box, marginTop: 14 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>罐頭要不要買？可以不用</p>
        <p style={{ margin: "8px 0 0", fontSize: 15.5, lineHeight: 1.9 }}>
          幼貓乾糧的營養本來就是完整的，只吃乾糧沒問題。想給罐頭，一定要挑包裝寫<b>「主食罐」</b>的。
          寫「副食罐」的是點心，只有肉和湯，長骨頭需要的鈣不夠。
        </p>
        {WET && (
          <p style={{ margin: "10px 0 0", fontSize: 15.5, lineHeight: 1.9 }}>
            幼貓的主食罐，我們的答案是
            <Link href={productHref(WET)} style={{ color: "var(--accent)", fontWeight: 700 }}> {WET.brand} {WET.name}</Link>。
          </p>
        )}
      </div>

      {/* ---------------- 2. 貓砂 ---------------- */}
      <p style={S.lbl}>2. 在哪裡上廁所</p>
      {LITTER && (
        <LitterPick
          p={LITTER.p}
          m={LITTER.m}
          month={LITTER.month}
          mineral={MINERAL ? MINERAL.month : null}
          cheapest={CHEAPEST_ANY?.p.id === LITTER.p.id}
        />
      )}
      <p style={note}>
        砂盆要另外買。每天把結成一團的挖掉，砂變少了再補。
        <Link href="/cat-litter" style={link}>我們讀過的 {litters.length} 款貓砂 →</Link>
      </p>

      {/* ---------------- 3. 零食 ---------------- */}
      <p style={S.lbl}>3. 零食要不要給</p>
      <div style={S.box}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 17 }}>前幾個月可以先不買</p>
        <p style={{ margin: "8px 0 0", fontSize: 15.5, lineHeight: 1.9 }}>
          零食不是必需品。等牠大一點，要剪指甲、要訓練的時候再買就好。
          給的時候記得零食會吃掉正餐的份量，一天有上限。
        </p>
        <Link href="/cat-treat" style={{ ...link, display: "inline-block", marginTop: 8 }}>每一款零食一天可以給幾條，算好的在這裡 →</Link>
      </div>

      {/* ---------------- 最常買錯的 ---------------- */}
      <p style={S.lbl}>新手最常買錯的三件事</p>
      <ol style={{ paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 }}>
        <li style={{ marginBottom: 10 }}>
          <b>把副食罐當正餐。</b>看起來整塊肉、湯很多，很像比較好的罐頭。
          我們讀到的副食罐，鈣不到主食罐的四十分之一，幼貓天天吃會缺鈣。
          <Link href="/cat-wet-food/complementary" style={link}>怎麼分辨 →</Link>
        </li>
        <li style={{ marginBottom: 10 }}>
          <b>第一包就買大包。</b>大包每公斤比較便宜，但飼料開封超過 {FRESH_DAYS} 天會氧化，貓就不愛吃了。
          {grams ? ` 一隻 ${KITTEN_KG} 公斤的幼貓一天吃 ${grams} 公克左右，${FRESH_DAYS} 天大約 ${Math.round((grams * FRESH_DAYS) / 100) / 10} 公斤，第一包不要超過這個重量。` : ""}
        </li>
        <li>
          <b>看到「可沖馬桶」就整盆倒。</b>
          我們讀的 {litters.length} 款貓砂裡，包裝寫可以沖的有 {CLAIM_FLUSH.length} 款，
          {CLAIM_LIMITED.length === CLAIM_FLUSH.length ? "全部" : `其中 ${CLAIM_LIMITED.length} 款`}都只能一次沖一小坨。
          整盆倒下去，老公寓的水管很容易塞。
          <Link href="/cat-litter/flush" style={link}>哪些真的能沖 →</Link>
        </li>
      </ol>

      {/* ---------------- 其他 ---------------- */}
      <p style={S.lbl}>其他要準備的</p>
      <div style={S.box}>
        <p style={{ margin: "0 0 10px", fontSize: 15.5, lineHeight: 1.9 }}>
          這幾樣我們還沒一款一款讀過，先列出來讓你不要漏買：
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["砂盆", "貓砂鏟", "飯碗", "水碗", "貓抓板", "外出籠", "指甲剪", "梳子", "逗貓棒"].map((x) => (
            <span key={x} style={S.tag}>{x}</span>
          ))}
        </div>
      </div>

      <p style={S.lbl}>這幾件要問獸醫</p>
      <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
        打疫苗、驅蟲、什麼時候結紮、要不要做健康檢查，這些我們不講，每隻貓的狀況不一樣。
        另外，貓從 2025 年起也要辦寵物登記（植入晶片），2026 年開始沒辦會被罰。
        帶回家之後，先找一間離家近的獸醫，這幾件一起問、一起辦。
      </p>

      <p style={S.lbl}>之後有狀況的話</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 20 }}>軟便、挑食、對雞過敏</h2>
          <p style={{ margin: 0, fontSize: 15.5, color: "var(--muted)", lineHeight: 1.8 }}>
            點一下牠的年紀和狀況，我們會把不適合的飼料刪掉，剩下的才給你看。
          </p>
        </div>
        <Link style={S.btn} href="/cat">去點點看</Link>
      </div>

      <footer style={S.foot}>
        <p style={{ margin: 0 }}>
          份量是照熱量估的，每隻貓不一樣，看牠的體型調整。價格和容量取自購買連結當時的賣場，以賣場為準。
        </p>
      </footer>
    </main>
  );
}

/* ---------------- 元件 ---------------- */

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

function LitterPick({ p, m, month, mineral, cheapest }: {
  p: LitterProduct; m: Merchant; month: number; mineral: number | null; cheapest: boolean;
}) {
  const size = sizeOf(p, m);
  const use = monthlyCost(p, m)?.use;
  const lasts = size && use ? Math.round((size.total / use) * 10) / 10 : null;
  /* 先試一包：整箱以外、最小的那一個。貓不一定肯用新的砂，第一次不要一口氣買一整箱 */
  const trial = size && size.packs > 1
    ? liveOf(p)
        .filter((x) => x.id !== m.id && (sizeOf(p, x)?.packs ?? 1) === 1)
        .sort((a, b) => a.amount - b.amount)[0]
    : undefined;
  const trialMonth = trial ? monthlyCost(p, trial)?.cost : undefined;
  return (
    <div style={{ ...S.box, borderColor: "var(--accent)" }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--accent)" }}>貓砂：{MATERIAL_ZH[p.spec.material]}</span>
      <p style={{ margin: "4px 0 0", fontSize: 17, fontWeight: 700, lineHeight: 1.55 }}>
        <Link href={`/cat-litter/p/${p.id}`} style={{ color: "inherit", textDecoration: "none" }}>{p.brand} {p.name}</Link>
      </p>
      <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--muted)" }}>
        <span className="mono" style={{ color: "var(--ink)", fontWeight: 700 }}>${m.amount.toLocaleString()}</span>　{m.unit ?? p.price.unit}
        {size && size.packs > 1 ? `　一次要買 ${size.packs} 包` : ""}
      </p>
      <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 15.5, lineHeight: 1.85 }}>
        <li>一隻貓一個月大約 ${month}{cheapest ? "，是我們讀過能買的貓砂裡最省的" : "，是能沖馬桶的裡面最省的"}。</li>
        {lasts && size && size.packs > 1 && <li>一次買 {size.packs} 包，大約用 {lasts} 個月。</li>}
        <li>用過的可以一次一小坨沖馬桶，不用每天包垃圾。</li>
        {mineral !== null && mineral !== Infinity && (
          <li>另一種常見的礦砂不能沖，一個月大約 ${mineral}。</li>
        )}
      </ul>
      <a href={`/go/${m.id}/${p.id}`} rel="nofollow sponsored" style={{ ...S.buy, marginTop: 14, padding: "11px 22px", fontSize: 15.5 }}>
        去蝦皮看這一箱
      </a>
      {trial && (
        <p style={{ margin: "14px 0 0", fontSize: 14, lineHeight: 1.85, color: "var(--muted)" }}>
          想先買一包讓貓試試看：{trial.unit ?? p.price.unit} ${trial.amount}
          {trialMonth ? `，用下去一個月大約 $${trialMonth}` : ""}。貓肯用再買整箱。
          <a href={`/go/${trial.id}/${p.id}`} rel="nofollow sponsored" style={link}>去看這一包 →</a>
        </p>
      )}
    </div>
  );
}

const note: React.CSSProperties = { margin: "4px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 };
const link: React.CSSProperties = { color: "var(--accent)", fontWeight: 600, marginLeft: 4 };
