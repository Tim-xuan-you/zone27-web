import type { Metadata } from "next";
import Link from "next/link";
import { catalog, catalogOf, constraintsFor, liveCount } from "@/lib/catalog";
import { CATEGORIES, MIN_LIVE, categoryOfId } from "@/lib/categories";
import {
  adjudicate, buyable, maintenanceRows, shopeeSubId, CATEGORY_SUB_ID,
  PRICE_FRESH_DAYS, PRICE_STALE_DAYS,
} from "@/lib/engine";
import { allPaths, resolve, situationOf } from "@/lib/slugs";
import type { Form, Product, ProteinSource, Situation, Species } from "@/lib/types";
import { impactMap, overallCutRate, ruleAudit, TIER_WEIGHT, type Impact } from "@/lib/impact";
import health from "@/data/link-health.json";
import storeReg from "@/data/stores.json";
import checkExtra from "@/data/check-extra.json";
import { CHANNEL_ZH, isMall } from "@/lib/channel";
import { channelStats } from "@/lib/channel-stats";
import { litters } from "@/lib/litter";
import { treats } from "@/lib/treat";
import { CHARGER_SUB_ID, DEVICES, chargers, fit } from "@/lib/charger";
import HuntPicks, { openPicks } from "@/components/HuntPicks";
import huntData from "@/data/hunt-candidates.json";
import { productHref } from "@/lib/labels";

/**
 * 維護台。給 Tim 一個人看的，不給讀者、不給搜尋引擎。
 *
 * v3（2026-09-24）Tim：「我們的後台也太雜！太長了吧！有些重複的東西，是不是不用寫那麼多次？
 * 至少第一眼不要厭惡吧！不然連想使用都不可能呀！」
 *
 * 改之前量過：桌機 52,700px，大約 62 個畫面。
 *   - 「要對得上、有送東西的、一款找幾家、截圖要拍到」這四條規矩，在 16 張卡片裡各寫一次
 *   - 同一款貓砂出現在「我查好賣場」跟「貓砂零食沒連結」兩段；「只剩一家」跟「只有商城」也重疊
 *   - 開頭寫「還沒做完的 47 款」，下一行又寫「今天沒事，可以關掉了」，自己打架
 *
 * 現在的規矩：
 *   1. 打開只看到「今天做這幾件」，而且一款只出現一次，在它最該被做的那一段
 *   2. 每張卡片只放跟那一款有關的東西（名字、為什麼先做、Sub id、我查好的賣場）
 *      大家都一樣的規矩寫一次，收在最上面
 *   3. 一次只攤開最值得做的 6 款，其他收起來。清單越長，越沒有人想開始
 *   4. 查資料用的（所有連結、分潤規則、裁決器健康）全部收進最下面的抽屜，平常不用打開
 *   5. 數字全部從資料算，補一條連結就自己少一件，做完的自己消失
 */

export const metadata: Metadata = {
  title: "維護台",
  robots: { index: false, follow: false },
};

export const revalidate = 86400;

const LEVEL = {
  dead: { bg: "var(--cut-soft)", fg: "var(--cut)", zh: "連結已死" },
  stale: { bg: "var(--warn-soft)", fg: "var(--warn)", zh: "過期" },
  aging: { bg: "var(--sunken)", fg: "var(--muted)", zh: "快過期" },
  fresh: { bg: "var(--keep-soft)", fg: "var(--keep)", zh: "新的" },
} as const;

/** 一次攤開幾款。其他的收起來，做完上面的自己會補上來 */
const SHOW = 6;

/**
 * 還在等連結的款，假設全部補齊之後，各自會被推薦幾次。
 *
 * 等連結的清單一長，從哪一款開始補就很重要：
 * 有的補了會出現在二十幾頁，有的補了一次都輪不到。先補前者。
 *
 * 只算長尾頁不夠：長尾頁全是「3 歲成年」，幼貓、老貓、胖貓永遠算不到，
 * 幼貓專用、高齡專用的那幾款就會永遠排最後。所以再加一組裁決器裡常見的情況：
 * 三種過敏原 × 三個年紀 × 四種症狀。
 */
function pickCounts(sp: Species, form: Form = "dry"): Map<string, number> {
  const opened: Product[] = catalogOf(sp, form).map((p) =>
    p.awaitingLink
      ? {
          ...p,
          awaitingLink: false,
          price: {
            ...p.price,
            merchants: [{ id: "m1", label: "（模擬）", amount: 1, note: "", affiliateUrl: "https://example.com", anchor: "safe" as const }],
          },
        }
      : p,
  );
  const count = new Map<string, number>();
  // 長尾頁只有乾糧有。罐頭只跑下面那組常見情況
  for (const slug of form === "dry" ? allPaths(sp) : []) {
    const page = resolve(slug, sp);
    if (!page) continue;
    const st = situationOf(page, sp);
    st.constraints = constraintsFor(st);
    const v = adjudicate(opened, st);
    if (v.pick) count.set(v.pick.id, (count.get(v.pick.id) ?? 0) + 1);
  }
  const fish: ProteinSource[] = ["salmon", "whitefish", "fish"];
  for (const avoid of [[], ["chicken"], fish] as ProteinSource[][]) {
    for (const ageYears of sp === "cat" ? [0.5, 3, 12] : [0.5, 3, 10]) {
      for (const symptoms of [[], ["體重"], ["腸胃問題"], ["皮膚搔癢"]]) {
        const st: Situation = { species: sp, form, ageYears, weightKg: sp === "cat" ? 4 : 12, avoid, symptoms, constraints: [] };
        st.constraints = constraintsFor(st);
        const v = adjudicate(opened, st);
        if (v.pick) count.set(v.pick.id, (count.get(v.pick.id) ?? 0) + 1);
      }
    }
  }
  return count;
}

const TIER = {
  主力: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  會被看到: { bg: "var(--sunken)", fg: "var(--muted)" },
  目前沒機會: { bg: "transparent", fg: "var(--faint)" },
} as const;

type Merchant = Product["price"]["merchants"][number];
type Item = { id: string; brand: string; name: string; searchAs?: string; ms: Merchant[] };

/** 一件要 Tim 動手產連結的事。一款只會有一件 */
type Task = {
  id: string;
  brand: string;
  name: string;
  why?: React.ReactNode;
  huntNote?: string;
  keyword: string;
  shops: { label: string; shop?: string }[];
  rank: number;
};

export default function Page() {
  // 狗跟貓各算各的：貓的連結一補上，維護台就要讀得到它的影響力，不然整頁會掛
  const impact = new Map<string, Impact>([
    ...impactMap(catalogOf("dog"), "dog"),
    ...impactMap(catalogOf("cat"), "cat"),
  ]);
  const NONE: Impact = { picks: 0, appears: 0, totalPages: 0, tier: "目前沒機會" };
  const rows = maintenanceRows(catalog).map((r) => ({
    ...r,
    impact: impact.get(r.productId) ?? NONE,
  }));

  /* 要重查的 vs 可以放著。判準是「有沒有人看得到」加上「資料還新不新」。 */
  const stale = rows.filter(
    (r) => r.level === "dead" || (r.impact.tier !== "目前沒機會" && r.level !== "fresh"),
  );
  const later = rows.filter((r) => !stale.includes(r));

  /* 同一家賣場一次查完：來回跳分頁才是真正花時間的地方 */
  const byStore = new Map<string, typeof stale>();
  for (const r of stale) byStore.set(r.label, [...(byStore.get(r.label) ?? []), r]);
  const staleGroups = [...byStore].sort(
    (a, b) => TIER_WEIGHT[a[1][0].impact.tier] - TIER_WEIGHT[b[1][0].impact.tier],
  );

  // 影響力分析跑的是狗飼料的長尾頁，這幾個數字只數狗
  const dogPool = catalogOf("dog");
  const core = dogPool.filter((p) => impact.get(p.id)?.tier === "主力");
  const idle = dogPool.filter((p) => impact.get(p.id)?.tier === "目前沒機會");
  const picks = new Map<string, number>(CATEGORIES.flatMap((c) => [...pickCounts(c.species, c.form)]));

  const everything: Item[] = [
    ...catalog.map((p) => ({ id: p.id, brand: p.brand, name: p.name, searchAs: p.searchAs, ms: p.price.merchants })),
    ...litters.map((p) => ({ id: p.id, brand: p.brand, name: p.name, searchAs: p.searchAs, ms: p.price.merchants as Merchant[] })),
    ...treats.map((p) => ({ id: p.id, brand: p.brand, name: p.name, searchAs: p.searchAs, ms: p.price.merchants as Merchant[] })),
    ...chargers.map((p) => ({ id: p.id, brand: p.brand, name: p.name, searchAs: p.searchAs, ms: p.price.merchants })),
  ];
  const byId = new Map(everything.map((x) => [x.id, x]));
  const live = (x: Item) => x.ms.filter((m) => !m.dead && !m.soldOut);

  /* 同一個品牌我們已經在哪幾家買過。回去同一家找，通常比重新搜一次快 */
  const shopIds = shopIdsByLabel();
  const fallbackShops = Object.entries((storeReg as { stores: Record<string, { name: string; confirmed: boolean }> }).stores)
    .filter(([, v]) => v.confirmed)
    .slice(-6)
    .map(([shop, v]) => ({ label: v.name, shop }));
  const shopsFor = (brand: string) => {
    const key = brand.split(/[（(]/)[0].trim();
    const found = new Set<string>();
    for (const p of catalog) {
      if (!p.brand.startsWith(key)) continue;
      for (const m of p.price.merchants) if (!m.dead) found.add(m.label);
    }
    const mine = [...found].map((label) => ({ label, shop: shopIds.get(label) })).filter((x) => x.shop);
    return mine.length > 0 ? mine : fallbackShops;
  };

  /* ── 1. 等你產連結的：四個來源併成一張清單，一款只出現一次 ── */
  // 只有飼料、罐頭有「補到 5 款才開張」這件事；貓砂、零食不走這套
  const opening = new Map(CATEGORIES.filter((c) => c.form === "dry" || c.form === "wet").map((c) => [c.slug, MIN_LIVE - liveCount(c.species, c.form)]));
  const tasks = new Map<string, Task>();
  const add = (t: Omit<Task, "rank"> & { value?: number }) => {
    if (tasks.has(t.id)) return;
    const c = categoryOfId(t.id);
    const need = c ? opening.get(c.slug) ?? 0 : 0;
    const rank =
      (t.huntNote ? -1000 : 0) +            // 找過找不到的排最後
      (openPicks(t.id) > 0 ? 200 : 0) +     // 我已經查好賣場的，開了就能做
      (need > 0 ? 100 : 0) +                // 補了就能讓一個類目開張
      (t.value ?? 0);
    tasks.set(t.id, { ...t, rank });
  };
  // 飼料、罐頭：補了會被推薦幾次
  for (const p of catalog.filter((p) => p.awaitingLink)) {
    const c = categoryOfId(p.id);
    const need = c ? opening.get(c.slug) ?? 0 : 0;
    const n = picks.get(p.id) ?? 0;
    add({
      id: p.id, brand: p.brand, name: p.name, huntNote: p.huntNote, value: n,
      keyword: huntKeyword(p), shops: shopsFor(p.brand),
      why: need > 0
        ? <>{c?.zh}再補 {need} 款就開張{n > 0 ? `，這款補了會被推薦 ${n} 次` : ""}</>
        : n > 0 ? `補了會被推薦 ${n} 次` : "目前的情況都輪不到它，不急",
    });
  }
  // 查藏雞頁寫了沒有雞、但我們沒連結的
  type ExtraItem = { id: string; planId?: string; brand: string; name: string; huntNote?: string };
  for (const x of (checkExtra.items as ExtraItem[]).filter((x) => x.planId)) {
    add({
      id: x.planId as string, brand: x.brand, name: x.name, huntNote: x.huntNote, value: 5,
      keyword: huntFrom(x.brand, x.name), shops: shopsFor(x.brand),
      why: "查藏雞頁寫了沒有雞。對雞過敏的人最想買的就是這種",
    });
  }
  // 貓砂、零食：不走裁決器，沒有推薦次數，照資料順序。只剩賣完的那幾款放在「看補貨」那一段
  for (const p of [...litters, ...treats]) {
    const x = byId.get(p.id)!;
    if (live(x).length > 0 || x.ms.some((m) => m.soldOut)) continue;
    add({ id: p.id, brand: p.brand, name: p.name, keyword: huntFrom(p.brand, p.name, p.searchAs), shops: shopsFor(p.brand) });
  }
  // 充電器：對幾台裝置是官方寫的最快，就先補哪一顆（iPhone 18 Pro、S26 Ultra 最快的那幾顆最搶手）
  for (const c of chargers) {
    const x = byId.get(c.id)!;
    if (live(x).length > 0 || x.ms.some((m) => m.soldOut)) continue;
    const best = DEVICES.filter((d) => fit(c, [d]).got![0].tier === "fast");
    add({
      id: c.id, brand: c.brand, name: c.name, value: best.length * 5,
      keyword: c.searchAs ?? huntFrom(c.brand, c.name), shops: shopsFor(c.brand),
      why: `${c.back}。單獨插最快的：${best.map((d) => d.zh).join("、") || "沒有"}`,
    });
  }
  // 我查好賣場、但上面都沒列到的
  for (const t of huntData.targets as { id: string; label: string; why: string }[]) {
    const x = byId.get(t.id);
    if (x && (live(x).length > 0 || x.ms.some((m) => m.soldOut))) continue;
    add({
      id: t.id, brand: x?.brand ?? "", name: x?.name ?? t.label, why: t.why,
      keyword: x ? huntFrom(x.brand, x.name, x.searchAs) : t.label, shops: x ? shopsFor(x.brand) : [],
    });
  }
  const make = [...tasks.values()].sort((a, b) => b.rank - a.rank);

  /* ── 2. 有連結但賣完了：連結是好的，補貨就能開 ── */
  const soldOut = everything
    .map((x) => ({ ...x, sold: x.ms.filter((m) => m.soldOut) }))
    .filter((x) => x.sold.length > 0 && live(x).length === 0);

  /* ── 3. 賣場名字還沒跟 Tim 核對的 ── */
  const links = linkIndex();

  /* ── 4. 有空再做：只剩一家、只有商城。同一款兩種都中，併成一張 ── */
  const backup = new Map<string, { x: Item; reasons: string[]; n: number }>();
  const addBackup = (x: Item, reason: string) => {
    const b = backup.get(x.id) ?? { x, reasons: [], n: picks.get(x.id) ?? 0 };
    b.reasons.push(reason);
    backup.set(x.id, b);
  };
  for (const p of catalog.filter((p) => buyable(p) && !p.referenceOnly && (picks.get(p.id) ?? 0) > 0)) {
    const shops = new Set(p.price.merchants.filter((m) => !m.dead).map((m) => m.label));
    if (shops.size === 1) addBackup(byId.get(p.id)!, `只剩一家：${[...shops][0]}`);
  }
  for (const x of everything) {
    const l = live(x);
    if (l.length > 0 && l.every((m) => isMall(m.label))) addBackup(x, `只有商城：${[...new Set(l.map((m) => m.label))].join("、")}`);
  }
  const backupList = [...backup.values()].sort((a, b) => b.n - a.n);

  const unbuyable = catalog.filter((p) => !p.referenceOnly && !p.awaitingLink && (!buyable(p) || p.discontinued));
  const noIssues = catalog.filter((p) => !p.knownIssues?.trim());
  const oldest = Math.max(0, ...rows.map((r) => r.days));
  const cut = overallCutRate();
  const audit = ruleAudit();
  const deadRules = audit.filter((r) => r.catches === 0);

  const todo = [
    { n: make.length, zh: "等你產連結", href: "#make" },
    { n: stale.length, zh: "連結要重查", href: "#stale" },
    { n: soldOut.length, zh: "賣完了，看補貨了沒", href: "#sold-out" },
    { n: links.unchecked.length, zh: "賣場名字要核對", href: "#names", unit: "家" },
  ].filter((x) => x.n > 0);

  const card = (t: Task) => (
    <div key={t.id} style={box}>
      <div style={head}>
        <div style={{ minWidth: 0 }}>
          <span style={catTag}>{catZh(t.id)}</span>
          {t.brand && <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{t.brand}</span>}
          <b style={{ display: "block", fontSize: 17, lineHeight: 1.5, marginTop: 2 }}>{t.name}</b>
        </div>
        <span className="mono" style={{ fontSize: 12.5, color: "var(--faint)" }}>{t.id}</span>
      </div>
      {t.why && <p style={why}>{t.why}</p>}
      {t.huntNote && <p style={{ ...why, color: "var(--cut)", fontWeight: 700 }}>找過：{t.huntNote}</p>}
      <SubIds id={t.id} />
      <HuntPicks id={t.id} />
      {openPicks(t.id) === 0 && <HuntLinks keyword={t.keyword} shops={t.shops} />}
    </div>
  );

  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "0 20px 120px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 32,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 17, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
        <span style={{ fontSize: 12.5, color: "var(--faint)" }}>維護台 · 不對外</span>
      </div>

      <h1 style={{ fontSize: "clamp(24px,5vw,28px)", lineHeight: 1.4, margin: "0 0 20px" }}>
        {todo.length === 0 ? "今天沒事，可以關掉了" : "今天要處理什麼"}
      </h1>

      {/* 第一眼：還剩幾件，點了直接跳。做完一件就自己少一件 */}
      {todo.length > 0 ? (
        <div style={{ ...box, padding: "6px 22px" }}>
          {todo.map((x, i) => (
            <a key={x.zh} href={x.href} style={{ ...jump, borderTop: i ? "1px solid var(--line)" : 0 }}>
              <span>{x.zh}</span>
              <span className="mono" style={{ fontWeight: 700 }}>{x.n} {x.unit ?? "款"} ›</span>
            </a>
          ))}
        </div>
      ) : (
        <p style={{ ...why, fontSize: 15.5 }}>
          {catalog.length} 款、{rows.length} 條連結都在期限內，最舊的一筆 {oldest} 天。
        </p>
      )}

      {/* 每一款都一樣的規矩，寫一次就好 */}
      <details style={rules}>
        <summary style={rulesSum}>找連結的規矩（忘了再點開）</summary>
        <div style={{ marginTop: 10 }}>
          <Line k="Sub id">
            每張卡片上都寫好了，照抄。蝦皮只收英數字，所以是 DF13 不是 df-13。Sub id 3 以後不用填。同一款找到好幾家，每一家都填一樣的
          </Line>
          <Line k="要對得上">
            賣場<b>標題</b>或<b>規格選項</b>裡，要有卡片上的這一款。一頁多款可以，網站會提醒讀者選哪一個。只有內文和圖片對得上的不算
          </Line>
          <Line k="有送東西的">
            <b>可以收</b>，看同一個大小有沒有比別家便宜。只有贈品讓價錢比別家貴，才不要
          </Line>
          <Line k="一款找幾家">
            多找幾家沒關係，網站自動給最便宜的那家，其他留著當備援。一款最多 16 條
          </Line>
          <Line k="截圖要拍到">
            規格的完整名稱、價錢、運費（免運、限宅配、超取限幾包）。罐頭看清楚是一罐還是一箱幾罐
          </Line>
          <Line k="我查好的賣場">
            便宜的排前面。產不出連結就跟我說是哪一家，我只擋這一款的那一家，同一家別款照樣列
          </Line>
          <Line k="做完之後">
            連結和截圖貼給 Claude。補好的會從這一頁自己消失
          </Line>
        </div>
      </details>

      {make.length > 0 && (
        <>
          <H id="make" n={make.length}>等你產連結的</H>
          <p style={lead}>照順序做就好：我查好賣場的、補了能讓類目開張的、會被推薦最多次的排前面。</p>
          {make.slice(0, SHOW).map(card)}
          {make.length > SHOW && (
            <details style={more}>
              <summary style={moreSum}>還有 {make.length - SHOW} 款，做完上面的再打開</summary>
              <div style={{ marginTop: 14 }}>{make.slice(SHOW).map(card)}</div>
            </details>
          )}
        </>
      )}

      {stale.length > 0 && (
        <>
          <H id="stale" n={stale.length} unit="條">連結要重查</H>
          <p style={lead}>已經按賣場分好組，同一家一次開一個分頁查完。</p>
          {staleGroups.map(([label, items]) => (
            <div key={label} style={box}>
              <div style={head}>
                <b style={{ fontSize: 17 }}>{label}</b>
                <span style={{ fontSize: 12.5, color: "var(--faint)" }}>{items.length} 條</span>
              </div>
              {items.map((r) => (
                <div key={r.merchantId + r.productId} style={line}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{r.brand}</span>
                    {r.name}
                  </div>
                  <span className="mono" style={{ fontSize: 12.5, whiteSpace: "nowrap" }}>{r.unit} · ${r.amount}</span>
                  <Chip {...LEVEL[r.level]}>{LEVEL[r.level].zh} {r.days} 天</Chip>
                  <a href={r.affiliateUrl} target="_blank" rel="noopener nofollow" style={openLink}>開連結 ↗</a>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {soldOut.length > 0 && (
        <>
          <H id="sold-out" n={soldOut.length}>賣完了，看補貨了沒</H>
          <p style={lead}>連結是好的，讀者暫時看不到。看到有貨跟我說一聲，就放回去。</p>
          <div style={{ ...box, padding: "6px 22px" }}>
            {soldOut.flatMap((p) => p.sold.map((m) => ({ p, m }))).map(({ p, m }, i) => (
              <div key={p.id + m.id} style={{ ...line, borderTop: i ? "1px solid var(--line)" : 0 }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{p.brand} · {m.label}</span>
                  {p.name}
                </div>
                <span className="mono" style={{ fontSize: 12.5, whiteSpace: "nowrap" }}>{m.unit} · ${m.amount}</span>
                <a href={m.affiliateUrl} target="_blank" rel="noopener nofollow" style={openLink}>開連結 ↗</a>
              </div>
            ))}
          </div>
        </>
      )}

      {links.unchecked.length > 0 && (
        <>
          <H id="names" n={links.unchecked.length} unit="家">賣場名字要核對</H>
          <p style={lead}>
            這些名字是我從截圖讀的，可能讀錯字（萬倍富曾經被寫成萬信富）。讀者會拿這個名字去蝦皮搜，錯一個字就找不到。
            點開對一下賣場名稱，跟我說「都對」或哪一家要改。
          </p>
          <div style={{ ...box, padding: "6px 22px" }}>
            {links.unchecked.map((g, i) => (
              <div key={g.label} style={{ ...line, borderTop: i ? "1px solid var(--line)" : 0 }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <b>{g.label}</b>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)" }}>
                    {g.shop ? `蝦皮賣場 ${g.shop}` : "還沒跑連結健檢"} · {[...new Set(g.items.map((x) => x.p.id))].join("、")}
                  </span>
                </div>
                <a href={g.items[0].m.affiliateUrl} target="_blank" rel="noopener nofollow" style={openLink}>點開看 ↗</a>
              </div>
            ))}
          </div>
        </>
      )}

      {backupList.length > 0 && (
        <details style={{ ...more, marginTop: 40 }}>
          <summary style={moreSum}>有空再做：補第二家、補便宜的一家（{backupList.length} 款）</summary>
          <p style={{ ...lead, marginTop: 12 }}>
            現在買得到，不急。只剩一家的，那一家賣完就沒地方買；只有商城的，同一包常常貴一截（臭味滾 7L 商城 $223，一般賣家 $100）。
            被推薦越多次的排越前面。
          </p>
          {backupList.map(({ x, reasons, n }) => (
            <div key={x.id} style={box}>
              <div style={head}>
                <div style={{ minWidth: 0 }}>
                  <span style={catTag}>{catZh(x.id)}</span>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{x.brand}</span>
                  <b style={{ display: "block", fontSize: 17, lineHeight: 1.5, marginTop: 2 }}>{x.name}</b>
                </div>
                <span className="mono" style={{ fontSize: 12.5, color: "var(--faint)" }}>{x.id}{n ? ` · 被推薦 ${n} 次` : ""}</span>
              </div>
              <p style={why}>{reasons.join("　")}</p>
              <SubIds id={x.id} />
              <HuntPicks id={x.id} />
              {openPicks(x.id) === 0 && <HuntLinks keyword={huntFrom(x.brand, x.name, x.searchAs)} shops={shopsFor(x.brand)} />}
            </div>
          ))}
        </details>
      )}

      {/* ── 以下是查資料用的，平常不用打開 ── */}
      <p style={{ ...lead, margin: "56px 0 10px", fontSize: 12.5, fontWeight: 700, color: "var(--faint)" }}>
        查資料用的，平常不用打開
      </p>

      <Drawer title="所有分潤連結" count={`${links.urls} 條 · ${links.groups.length} 家`}>
        <div style={{ ...box, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
          <p style={{ margin: "0 0 8px", fontSize: 15.5, fontWeight: 700 }}>蝦皮後台說某個商品「無效」的時候</p>
          <ol style={{ ...ul, fontSize: 14 }}>
            <li>在蝦皮 App 點進那個無效商品，看<b>賣場名稱</b>。</li>
            <li>在下面找同一個賣場。找不到，就是網站沒用到它，不用管。</li>
            <li>找到了，點那一條的「點開看」。打不開、顯示無效或賣完，就跟我說「這一條無效」，或直接貼另一家的新連結。</li>
          </ol>
          <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.85 }}>
            <b>你給過的連結永遠不刪。</b>新的放最前面，原本的往後當備援；主要那一條壞了，備援自己頂上。
            確定無效的才標「失效」：讀者看不到，這裡還留著。
          </p>
          <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
            自己點開檢查沒關係，但不要從這裡下單，多數分潤計畫不算自己買的。
            連結健檢最後一次跑是 {health.checkedAt}，商品還在不在要自己點。
          </p>
        </div>
        {links.groups.map(([label, items]) => (
          <div key={label} style={box}>
            <div style={head}>
              <b style={{ fontSize: 17 }}>
                {label}
                {links.unchecked.some((g) => g.label === label) && (
                  <span style={{ marginLeft: 8, fontSize: 12.5, fontWeight: 600, color: "var(--cut)" }}>名字待核對</span>
                )}
              </b>
              <span style={{ fontSize: 12.5, color: "var(--faint)" }}>{new Set(items.map((x) => x.m.affiliateUrl)).size} 條</span>
            </div>
            {items.map(({ p, m, h }) => (
              <div key={p.id + m.id} style={line}>
                <div style={{ flex: 1, minWidth: 190 }}>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>
                    <Link href={productHref(p)} style={{ color: "inherit" }}>{p.id}</Link> · {p.brand}
                    {/* 主要＝卡片上那個按鈕；備援＝收在「其他規格與價格」裡，主要的壞了就自動頂上 */}
                    <b style={{ marginLeft: 8, color: m.dead ? "var(--cut)" : roleOf(p, m) === "主要" ? "var(--keep)" : "var(--muted)" }}>
                      {m.dead ? "失效（讀者看不到）" : roleOf(p, m)}
                    </b>
                  </span>
                  {p.name}
                  <span className="mono" style={{ display: "block", fontSize: 12.5, color: "var(--faint)" }}>
                    {m.unit ?? p.price.unit} · ${m.amount} · 查價 {m.checkedAt ?? p.price.checkedAt}
                    {h?.item ? ` · 蝦皮商品 ${h.item}` : ""}
                  </span>
                  {m.sharedPage && (
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--cut)" }}>跟另一款在同一個商品頁，讀者要自己選規格</span>
                  )}
                </div>
                <a href={m.affiliateUrl} target="_blank" rel="noopener nofollow" style={openLink}>點開看 ↗</a>
              </div>
            ))}
          </div>
        ))}
      </Drawer>

      <Drawer title="分潤怎麼算" count="選賣場時用得到">
        <ul style={ul}>
          <li><b>要同一家店才算。</b>讀者點我們的連結進去，跑去別家買，那筆沒有我們的事。所以連結要指到他最可能直接下單的那一家。</li>
          <li><b>七天內結帳都算，而且不限那一件商品。</b>同一家店裡他順手買的貓砂、罐頭一樣算。東西齊全的賣場因此比便宜五塊的賣場值錢。</li>
          <li><b>七天內他點到別人的連結，就變成別人的。</b>所以頁面要讓人看完就走、直接買，不要逼他再去比價。</li>
          <li><b>產不出連結是「那一款」的事，不是整家的事。</b>賣家可以只幫部分商品開分潤。所以我只擋「那一款 × 那一家」，同一家在別款照樣列。</li>
          <li><b>費率不用挑。</b>蝦皮的費率一直在變，以商品頁當下顯示的為準。能控制的只有「他會不會買」。</li>
        </ul>
        <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "var(--faint)", lineHeight: 1.85 }}>
          依蝦皮幫助中心與聯盟計畫約定條款（2026-09-18 查）。條款禁止機器人與自動抓取、禁止自購，違反可立即終止，所以我們不自動操作你的帳號。
        </p>
      </Drawer>

      <Drawer title="哪一種賣場產得出連結" count="成功率">
        <p style={{ ...lead, marginTop: 0 }}>
          一般賣家常常便宜一半，但不一定開得出分潤。所以一般賣家要一次多給幾家，商城跟優選留著保底。
        </p>
        {channelStats().map((s2) => (
          <Line key={s2.channel} k={CHANNEL_ZH[s2.channel]}>
            <span className="mono">
              產出 {s2.ok}　失敗 {s2.fail}
              <b style={{ color: (s2.rate ?? 0) >= 60 ? "var(--keep)" : "var(--cut)" }}>
                {s2.rate === null ? "還沒試過" : `成功率 ${s2.rate}%`}
              </b>
            </span>
          </Line>
        ))}
      </Drawer>

      <Drawer title="裁決器有沒有在做事" count={`平均刪掉 ${Math.round((1 - cut.avgKeep) * 100)}%`}>
        <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.9 }}>
          全站 {cut.pages} 頁，平均刪掉 {Math.round((1 - cut.avgKeep) * 100)}%。這個站的說服力來自「我們刪掉了什麼」。
          {cut.avgKeep > 0.7
            ? ` 現在幾乎沒刪到東西，品種頁是 ${dogPool.length} 進 ${dogPool.length} 留。下一批該補的，是會被刪掉的那種。`
            : " 目前的排除幅度是合理的。"}
        </p>
        <p style={{ margin: "18px 0 6px", fontSize: 14, fontWeight: 700, color: "var(--muted)" }}>每條規則刪得掉幾款</p>
        {audit.map((r) => (
          <div key={r.rule} style={{ ...line, color: r.catches === 0 ? "var(--cut)" : "inherit" }}>
            <span className="mono" style={{ minWidth: 48, fontWeight: 700 }}>{r.catches} 款</span>
            <span style={{ flex: 1, minWidth: 160 }}>{r.rule}</span>
            {r.catches === 0 && (
              <span style={{ fontSize: 12.5, color: "var(--muted)", flexBasis: "100%" }}>要補：{r.need}</span>
            )}
          </div>
        ))}
        {deadRules.length > 0 && (
          <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
            {deadRules.length} 條規則目前是空的：規則沒寫錯，只是選品裡還沒有它要擋的東西。
          </p>
        )}
        <p style={{ margin: "18px 0 6px", fontSize: 14, fontWeight: 700, color: "var(--muted)" }}>哪幾款其實沒人看得到（狗飼料）</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Chip {...TIER["主力"]}>主力 {core.length} 款 · 要顧</Chip>
          <Chip {...TIER["會被看到"]}>會被看到 {dogPool.length - core.length - idle.length} 款</Chip>
          <Chip {...TIER["目前沒機會"]}>目前沒機會 {idle.length} 款 · 先放著</Chip>
        </div>
        {idle.length > 0 && (
          <p style={{ margin: "10px 0 0", fontSize: 14, color: "var(--faint)", lineHeight: 1.85 }}>
            {idle.map((p) => `${p.brand}｜${p.name}`).join("、")}。以現在的規則，沒有任何一個組合會推到它們，跟好不好無關。
          </p>
        )}
      </Drawer>

      <Drawer title="我這邊還沒做完的" count={`${unbuyable.length + noIssues.length} 款`}>
        <p style={{ ...lead, marginTop: 0 }}>這一段是 Claude 的功課，你不用動手。</p>
        <Line k="整款買不到">
          {unbuyable.length === 0 ? "沒有" : unbuyable.map((p) => `${p.brand}｜${p.name}（${p.discontinued ? "停產" : "所有賣場都失效"}）`).join("、")}
        </Line>
        <Line k="還沒寫缺點">
          {noIssues.length === 0 ? "都寫了" : noIssues.map((p) => `${p.brand}｜${p.name}`).join("、")}
        </Line>
      </Drawer>

      <Drawer title="先放著的連結" count={`${later.length} 條`}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse", fontSize: 14 }}>
            <tbody>
              {later.map((r) => (
                <tr key={r.merchantId + r.productId} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={td}>{r.brand}｜{r.name}</td>
                  <td style={{ ...td, color: "var(--muted)" }}>{r.label}</td>
                  <td style={{ ...td, whiteSpace: "nowrap" }} className="mono">{r.unit} · ${r.amount}</td>
                  <td style={{ ...td, whiteSpace: "nowrap", color: "var(--faint)" }}>{r.days} 天</td>
                  <td style={{ ...td, color: "var(--faint)" }}>{r.impact.tier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Drawer>

      <Drawer title="價格多久算過期" count={`${PRICE_FRESH_DAYS} / ${PRICE_STALE_DAYS} 天`}>
        <ul style={ul}>
          <li>{PRICE_FRESH_DAYS} 天內查過 = 新的，價格照常顯示。</li>
          <li>超過 {PRICE_FRESH_DAYS} 天 = 快過期，卡片上多一行「這個價格是 N 天前查的」。</li>
          <li>超過 {PRICE_STALE_DAYS} 天 = 過期，明講我們把它當參考不當承諾。</li>
          <li>賣場標成失效，引擎完全跳過；全部賣場都失效，整款不進裁決。</li>
        </ul>
      </Drawer>

      <p style={{ marginTop: 40 }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 700 }}>← 回網站</Link>
      </p>
    </main>
  );
}

/** 這一條在這一款裡的角色：第一條還能買的是主要，其他是備援 */
function roleOf(p: Product, m: Merchant): "主要" | "備援" {
  const first = p.price.merchants.find((x) => !x.dead);
  return first && first.affiliateUrl === m.affiliateUrl && (first.unit ?? "") === (m.unit ?? "") ? "主要" : "備援";
}

/**
 * 所有分潤連結，照賣場分組；順便找出名字還沒跟 Tim 核對的賣場。
 *
 * 蝦皮分潤後台說某個商品「無效」的時候，後台只給商品名和價錢，點進去才看得到賣場名稱。
 * 所以用賣場分組：拿賣場名稱來對最快。
 * 蝦皮的商品頁不讓程式看（回 403），我們也不繞過，所以「無效、賣完」只能靠人點開看。
 */
function linkIndex() {
  type HealthRow = { url: string; item: string | null; verdict: string };
  const byUrl = new Map((health.rows as HealthRow[]).map((r) => [r.url, r]));
  const all = catalog.flatMap((p) => p.price.merchants.map((m) => ({ p, m, h: byUrl.get(m.affiliateUrl) })));
  const stores = new Map<string, typeof all>();
  for (const x of all) stores.set(x.m.label, [...(stores.get(x.m.label) ?? []), x]);
  const groups = [...stores].sort((a, b) => a[0].localeCompare(b[0], "zh-Hant"));
  // 賣場名稱核對：從連結健檢拿到蝦皮賣場編號，再對 data/stores.json 看 Tim 核對過沒有
  const reg = storeReg.stores as Record<string, { name: string; confirmed: boolean }>;
  const shopOfLabel = new Map<string, string>();
  for (const x of all) {
    const shop = x.h?.item?.split("/")[0];
    if (shop && !shopOfLabel.has(x.m.label)) shopOfLabel.set(x.m.label, shop);
  }
  const unchecked = groups
    .map(([label, items]) => ({ label, shop: shopOfLabel.get(label), items }))
    .filter((g) => !g.shop || !reg[g.shop]?.confirmed);
  return { groups, unchecked, urls: new Set(all.map((x) => x.m.affiliateUrl)).size };
}

/** 卡片左上角那個類目名。充電器不在寵物的類目表裡 */
const catZh = (id: string) => (id.startsWith("ch-") ? "充電器" : categoryOfId(id)?.zh ?? "其他");

function SubIds({ id }: { id: string }) {
  return (
    <p className="mono" style={{ margin: "10px 0 0", fontSize: 14 }}>
      <span style={{ color: "var(--faint)", fontSize: 12.5 }}>Sub id 1 </span><b>{shopeeSubId(id)}</b>
      <span style={{ color: "var(--faint)", fontSize: 12.5, marginLeft: 16 }}>Sub id 2 </span><b>{id.startsWith("ch-") ? CHARGER_SUB_ID : categoryOfId(id)?.subId ?? CATEGORY_SUB_ID}</b>
    </p>
  );
}

function Line({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: "6px 0", fontSize: 14, lineHeight: 1.8 }}>
      <span style={{ color: "var(--faint)", minWidth: "7em", fontSize: 12.5 }}>{k}</span>
      <span style={{ flex: 1, minWidth: 200 }}>{children}</span>
    </div>
  );
}

function Chip({ bg, fg, children }: { bg: string; fg: string; children: React.ReactNode }) {
  return (
    <span style={{
      background: bg, color: fg, borderRadius: 999, padding: "4px 12px",
      fontSize: 12.5, whiteSpace: "nowrap", fontWeight: 600,
      border: bg === "transparent" ? "1px solid var(--line)" : "none",
    }}>{children}</span>
  );
}

function H({ children, id, n, unit = "款" }: { children: React.ReactNode; id?: string; n?: number; unit?: string }) {
  return (
    <h2 id={id} style={{
      display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12,
      fontSize: 20, fontWeight: 700, margin: "44px 0 8px", scrollMarginTop: 16,
    }}>
      <span>{children}</span>
      {n !== undefined && <span className="mono" style={{ fontSize: 14, color: "var(--faint)" }}>{n} {unit}</span>}
    </h2>
  );
}

/** 查資料用的抽屜：一行標題、右邊一個數字，點開才有內容 */
function Drawer({ title, count, children }: { title: string; count: string; children: React.ReactNode }) {
  return (
    <details style={{ borderTop: "1px solid var(--line)" }}>
      <summary style={drawerSum}>
        <span style={{ flex: 1 }}>{title}</span>
        <span className="mono" style={{ fontSize: 12.5, color: "var(--faint)", fontWeight: 500 }}>{count}</span>
      </summary>
      <div style={{ padding: "4px 0 24px" }}>{children}</div>
    </details>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, padding: "18px 22px", marginBottom: 12,
};
const head: React.CSSProperties = {
  display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
};
const catTag: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 700, color: "var(--accent)", marginRight: 8,
};
const why: React.CSSProperties = { margin: "6px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.8 };
const lead: React.CSSProperties = { margin: "0 0 14px", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 };
const jump: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "12px 0", textDecoration: "none", color: "inherit", fontSize: 15.5,
};
const rules: React.CSSProperties = {
  marginTop: 14, background: "var(--sunken)", border: "1px solid var(--line)", borderRadius: 14, padding: "12px 22px",
};
const rulesSum: React.CSSProperties = { cursor: "pointer", fontSize: 14, fontWeight: 700, color: "var(--muted)" };
const more: React.CSSProperties = { marginTop: 4 };
const moreSum: React.CSSProperties = {
  cursor: "pointer", fontSize: 15.5, fontWeight: 700, color: "var(--muted)", padding: "10px 0",
};
const drawerSum: React.CSSProperties = {
  display: "flex", alignItems: "baseline", gap: 12, cursor: "pointer",
  padding: "16px 0", fontSize: 15.5, fontWeight: 700,
};
const line: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center",
  padding: "12px 0", borderTop: "1px solid var(--line)", fontSize: 14, lineHeight: 1.6,
};
const openLink: React.CSSProperties = { color: "var(--accent)", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "10px 12px 10px 0", verticalAlign: "top" };
const ul: React.CSSProperties = { paddingLeft: 20, margin: 0, fontSize: 15.5, lineHeight: 1.95 };

/* ------------------------------------------------------------------ */
/* 找賣場：把「我要去哪一家找」變成一次點擊                              */
/*                                                                    */
/* 2026-09-18 Tim：「時間都浪費在，我去選哪一個店家有賣此商品。」        */
/*                                                                    */
/* 蝦皮的商品頁對程式回 403，我們不爬、也不用 Tim 的帳號自動點（那是他  */
/* 唯一的收入來源，被判定異常就沒了）。能幫的是把「開哪一頁」先排好：   */
/* 全站搜一次，再加上我們已經買過這個品牌的那幾家（有整條產品線的機率   */
/* 最高）。Tim 只要開、挑、產生連結。                                   */
/*                                                                    */
/* 這些是蝦皮的「搜尋頁」，不是商品頁，也不是給讀者看的：/status 不對外、*/
/* 不進搜尋引擎。讀者頁面一律只連分潤連結，那條規矩沒有變。             */
/* 2026-09-24 起：我已經查好賣場的款，就不再給搜尋按鈕（兩套一起列太吵）。 */
/* ------------------------------------------------------------------ */

/** 賣場名稱 → 蝦皮賣場編號（從連結健檢的 shopId/itemId 拿） */
function shopIdsByLabel(): Map<string, string> {
  type HealthRow = { url: string; item: string | null };
  const byUrl = new Map((health.rows as HealthRow[]).map((r) => [r.url, r]));
  const out = new Map<string, string>();
  for (const p of catalog) {
    for (const m of p.price.merchants) {
      const shop = byUrl.get(m.affiliateUrl)?.item?.split("/")[0];
      if (shop && !out.has(m.label)) out.set(m.label, shop);
    }
  }
  return out;
}

function HuntLinks({ keyword, shops }: { keyword: string; shops: { label: string; shop?: string }[] }) {
  const kw = encodeURIComponent(keyword);
  const inShops = shops.filter((s) => s.shop).slice(0, 3);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
      <a href={`https://shopee.tw/search?keyword=${kw}`} target="_blank" rel="noopener noreferrer" style={huntBtn}>
        蝦皮搜「{keyword}」
      </a>
      {inShops.map((s) => (
        <a
          key={s.label}
          href={`https://shopee.tw/shop/${s.shop}/search?keyword=${kw}`}
          target="_blank"
          rel="noopener noreferrer"
          style={huntBtnSoft}
        >
          在 {s.label} 裡找
        </a>
      ))}
    </div>
  );
}

const huntBtn: React.CSSProperties = {
  display: "inline-block", padding: "8px 16px", borderRadius: 999, fontSize: 14, fontWeight: 700,
  background: "var(--accent)", color: "var(--accent-ink)", textDecoration: "none",
};
const huntBtnSoft: React.CSSProperties = {
  display: "inline-block", padding: "8px 16px", borderRadius: 999, fontSize: 14, fontWeight: 600,
  background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)", textDecoration: "none",
};

/**
 * 蝦皮搜尋用的字。
 *
 * 關鍵字長反而搜不到：蝦皮是逐詞比對，整串完整品名幾乎沒有賣場會照著打。
 * 所以只留兩段：品牌的中文，加上最好認的那一段（型號優先，其次口味）。
 * 「紐頓 T24」「皇家 A30+11」「愛肯拿 美膚羊肉」這種，搜得到的機率最高。
 */
function huntFrom(brand: string, name: string, searchAs?: string): string {
  const CJK = /[一-鿿]+/;
  // 品牌只取中文那一段：Hill's 希爾思 → 希爾思，ORIJEN 歐睿健（原渴望）→ 歐睿健
  const zh = brand.match(CJK)?.[0] ?? brand.split(/\s+/)[0];
  const model = name.match(/[A-Z]{1,3}\d{2,3}(?:\+\d+W?)?/)?.[0];
  // 口味那一段：跳過英文字和品牌本身，有肉的那一段優先，再把「全貓配方」這種尾巴切掉
  const MEAT = /(羊|鴨|鮭|鱒|鯖|鮪|鱈|雞|牛|鹿|魚|豬|鵪鶉)/;
  const tokens = (searchAs ?? name)
    .split(/[\s+＋（()]/)
    .map((t) => t.trim())
    .filter((t) => CJK.test(t) && !zh.includes(t) && !t.includes(zh));
  const flavor = (tokens.find((t) => MEAT.test(t)) ?? tokens[0])
    ?.replace(/(全貓|全犬|成貓|成犬|幼貓|幼犬|老貓|高齡|挑嘴|配方|專用).*$/, "")
    .slice(0, 6);
  const tail = model ?? flavor ?? "";
  return `${zh} ${tail}`.trim();
}

function huntKeyword(p: Product): string {
  return huntFrom(p.brand, p.name, p.searchAs);
}
