import type { Metadata } from "next";
import Link from "next/link";
import { catalog, catalogOf, constraintsFor, liveCount } from "@/lib/catalog";
import { CATEGORIES, MIN_LIVE, categoryOfId } from "@/lib/categories";
import {
  adjudicate, buyable, formOf, maintenanceRows, shopeeSubId, CATEGORY_SUB_ID,
  PRICE_FRESH_DAYS, PRICE_STALE_DAYS,
} from "@/lib/engine";
import { allPaths, resolve, situationOf } from "@/lib/slugs";
import type { Form, Product, ProteinSource, Situation, Species } from "@/lib/types";
import { impactMap, overallCutRate, ruleAudit, TIER_WEIGHT, type Impact } from "@/lib/impact";
import health from "@/data/link-health.json";
import storeReg from "@/data/stores.json";
import checkExtra from "@/data/check-extra.json";
import { litters } from "@/lib/litter";
import { treats } from "@/lib/treat";
import HuntPicks from "@/components/HuntPicks";
import huntData from "@/data/hunt-candidates.json";
import { productHref } from "@/lib/labels";

/**
 * 維護台。給 Tim 一個人看的，不給讀者、不給搜尋引擎。
 *
 * v2 的重點是**排序**，不是清單。
 *
 * 一份 300 條的待辦跟沒有待辦一樣 —— 打開就想關掉。
 * 所以先用 impactMap() 算出哪幾款其實在撐這個站，
 * 再把「今天非做不可」跟「先放著沒關係」分開，
 * 而且按賣場分組（同一家一次開一個分頁查完，不要來回跳）。
 *
 * 目標：每次打開只做最上面那一段，剩下的可以安心關掉。
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

  /* 要做的 vs 可以放著。判準是「有沒有人看得到」加上「資料還新不新」。 */
  const todo = rows.filter(
    (r) => r.level === "dead" || (r.impact.tier !== "目前沒機會" && r.level !== "fresh"),
  );
  const later = rows.filter((r) => !todo.includes(r));

  /* 同一家賣場一次查完 —— 來回跳分頁才是真正花時間的地方 */
  const byStore = new Map<string, typeof todo>();
  for (const r of todo) byStore.set(r.label, [...(byStore.get(r.label) ?? []), r]);
  const groups = [...byStore].sort(
    (a, b) => TIER_WEIGHT[a[1][0].impact.tier] - TIER_WEIGHT[b[1][0].impact.tier],
  );

  // 影響力分析跑的是狗飼料的長尾頁，這幾個數字只數狗
  const dogPool = catalogOf("dog");
  const core = dogPool.filter((p) => impact.get(p.id)?.tier === "主力");
  const idle = dogPool.filter((p) => impact.get(p.id)?.tier === "目前沒機會");
  const waiting = catalog.filter((p) => p.awaitingLink);
  const picks = new Map<string, number>(CATEGORIES.flatMap((c) => [...pickCounts(c.species, c.form)]));
  const waitingBy = CATEGORIES
    .map((c) => ({
      cat: c,
      items: waiting
        .filter((p) => p.species === c.species && formOf(p) === c.form)
        // 找過找不到的排最後，其他照「補了會被推薦幾次」排
        .sort((a, b) => Number(Boolean(a.huntNote)) - Number(Boolean(b.huntNote)) || (picks.get(b.id) ?? 0) - (picks.get(a.id) ?? 0)),
      ready: liveCount(c.species, c.form),
    }))
    .filter((g) => g.items.length > 0);

  /* 同一個品牌我們已經在哪幾家買過。
     回去同一家找，通常比重新搜一次快 —— 那家有整條產品線的機率很高。
     賣家越集中，維護成本也越低。 */
  /* 這個品牌我們沒在任何一家買過的時候，退而求其次：給幾家一定產得出連結的賣場，讓他進去搜看看 */
  const fallbackShops = Object.entries((storeReg as { stores: Record<string, { name: string; confirmed: boolean }> }).stores)
    .filter(([, v]) => v.confirmed)
    .slice(-6)
    .map(([shop, v]) => ({ label: v.name, shop }));
  /* 貓砂、零食不在飼料的 catalog 裡，維護台原本看不到這兩個類目缺什麼 */
  const nonFoodGaps = [
    { zh: "貓砂", items: litters.filter((p) => !p.price.merchants.some((m) => !m.dead)) },
    { zh: "貓零食", items: treats.filter((p) => !p.price.merchants.some((m) => !m.dead)) },
  ];
  const sellersOfBrand = (brand: string) => {
    const key = brand.split(/[（(]/)[0].trim();
    const found = new Set<string>();
    for (const p of catalog) {
      if (!p.brand.startsWith(key)) continue;
      for (const m of p.price.merchants) if (!m.dead) found.add(m.label);
    }
    return [...found];
  };
  /* 候選名單裡沒被上面任何一段列到的，補一段收尾，不然我查好的賣場會沒有地方顯示 */
  const huntTargets = (huntData.targets as { id: string; label: string; why: string }[]);
  const shopsFor = (brand: string) => {
    const mine = sellersOfBrand(brand).map((label) => ({ label, shop: shopIds.get(label) })).filter((x) => x.shop);
    return mine.length > 0 ? mine : fallbackShops;
  };
  // 對照款是故意不賣的，不算「買不到」的問題
  const shopIds = shopIdsByLabel();
  /* 查藏雞頁「沒有雞」但沒有連結的那幾款：補了連結就能推薦給對雞過敏的人 */
  type ExtraItem = { id: string; planId?: string; brand: string; name: string; alias?: string; huntNote?: string };
  const noChicken = (checkExtra.items as ExtraItem[])
    .filter((x) => x.planId)
    .map((x) => ({ ...x, planId: x.planId as string, hunt: huntFrom(x.brand, x.name) }));
  // 只剩一家在賣的：那一家賣完，這一款就從網站上消失
  const thinAll = catalog
    .filter((p) => buyable(p) && !p.referenceOnly && new Set(p.price.merchants.filter((m) => !m.dead).map((m) => m.label)).size === 1)
    .sort((a, b) => (picks.get(b.id) ?? 0) - (picks.get(a.id) ?? 0));
  // 全部列出來就變成一面牆。只列真的會被推薦到的，最多 8 款，其他的等它被推到再說
  const thin = thinAll.filter((p) => (picks.get(p.id) ?? 0) > 0).slice(0, 8);
  const unbuyable = catalog.filter((p) => !p.referenceOnly && !p.awaitingLink && (!buyable(p) || p.discontinued));
  const noIssues = catalog.filter((p) => !p.knownIssues?.trim());
  const oldest = Math.max(0, ...rows.map((r) => r.days));
  const cut = overallCutRate();
  const audit = ruleAudit();
  const dead = audit.filter((r) => r.catches === 0);

  return (
    <main style={{ maxWidth: 940, margin: "0 auto", padding: "0 20px 120px" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 14, padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 36,
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16, color: "inherit", textDecoration: "none" }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: "var(--accent)" }} />
          ZONE 27
        </Link>
        <span style={{ fontSize: 12.5, color: "var(--faint)" }}>維護台 · 不對外</span>
      </div>

      <h1 style={{ fontSize: "clamp(24px,5vw,32px)", lineHeight: 1.4, margin: "0 0 12px" }}>
        今天要處理什麼
      </h1>

      {todo.length === 0 ? (
        <div style={{ ...box, borderColor: "var(--keep)", background: "var(--keep-soft)" }}>
          <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>今天沒事，可以關掉了</p>
          <p style={{ margin: "8px 0 0", fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
            {catalog.length} 款、{rows.length} 條連結全部在期限內，最舊的一筆 {oldest} 天。
            另外 {idle.length} 款目前不會被推薦到，不用管。
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: "var(--muted)", fontSize: 15.5, lineHeight: 1.9, margin: "0 0 24px", maxWidth: "48ch" }}>
            <b style={{ color: "var(--ink)" }}>{todo.length} 條</b>要處理，
            已經按賣場分好組了，同一家一次開一個分頁查完，不用來回跳。
            下面「先放著」那一段今天可以完全不看。
          </p>

          {groups.map(([label, items]) => (
            <div key={label} style={box}>
              <div style={{
                display: "flex", alignItems: "baseline", justifyContent: "space-between",
                gap: 12, marginBottom: 14, flexWrap: "wrap",
              }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{label}</h2>
                <span style={{ fontSize: 13, color: "var(--faint)" }}>{items.length} 條</span>
              </div>
              {items.map((r) => (
                <div key={r.merchantId + r.productId} style={line}>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{r.brand}</span>
                    {r.name}
                  </div>
                  <span className="mono" style={{ fontSize: 13, whiteSpace: "nowrap" }}>
                    {r.unit} · ${r.amount}
                  </span>
                  <Chip {...LEVEL[r.level]}>{LEVEL[r.level].zh} {r.days} 天</Chip>
                  <Chip {...TIER[r.impact.tier]}>
                    {r.impact.tier}{r.impact.picks > 0 ? ` · 主答案 ${r.impact.picks} 頁` : ""}
                  </Chip>
                  <a href={r.affiliateUrl} target="_blank" rel="noopener nofollow"
                     style={{ color: "var(--accent)", fontSize: 13.5, whiteSpace: "nowrap" }}>
                    開連結 ↗
                  </a>
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* ── 所有分潤連結：Tim 自己點開檢查、對蝦皮後台說「無效」的是哪一條 ── */}
      <AllLinks />

      {/* ── 這一段是重點：告訴他什麼可以不做 ── */}
      <H>可以不管的</H>
      <div style={box}>
        <p style={{ margin: "0 0 12px", fontSize: 15.5, lineHeight: 1.9 }}>
          裁決器一次只給一個答案。所以商品一多，<b>多數款根本不會出現在任何人的畫面上</b>，
          那些款的價格複不複查，沒有人會知道，也沒有人會受影響。
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Chip {...TIER["主力"]}>主力 {core.length} 款 · 要顧</Chip>
          <Chip {...TIER["會被看到"]}>會被看到 {dogPool.length - core.length - idle.length} 款</Chip>
          <Chip {...TIER["目前沒機會"]}>目前沒機會 {idle.length} 款 · 先放著</Chip>
        </div>
        {idle.length > 0 && (
          <ul style={{ ...ul, marginTop: 14, color: "var(--faint)" }}>
            {idle.map((p) => <li key={p.id}>{p.brand}｜{p.name}</li>)}
          </ul>
        )}
        <p style={{ margin: "14px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
          「目前沒機會」跟它好不好無關，意思是以現在的規則，沒有任何一個組合會推到它。
          等它有機會被推薦，它自己就會跳到上面那一段。
        </p>
      </div>

      {/* ── 這一段回答的是「下一款該進什麼」，不是「要修什麼」 ── */}
      <H>裁決器有沒有在做事</H>
      <div style={{
        ...box,
        borderColor: cut.avgKeep > 0.7 ? "var(--warn)" : "var(--line)",
        background: cut.avgKeep > 0.7 ? "var(--warn-soft)" : "var(--surface)",
      }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>
          全站 {cut.pages} 頁，平均只刪掉 {Math.round((1 - cut.avgKeep) * 100)}%
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 15, lineHeight: 1.9 }}>
          這個站的說服力來自「我們刪掉了什麼」。
          {cut.avgKeep > 0.7 ? (
            <>
              {" "}現在幾乎沒刪到東西，品種頁是 {dogPool.length} 進 {dogPool.length} 留，
              那個刪除過程看起來就像在演。
            </>
          ) : (
            <>{" "}目前的排除幅度是合理的。</>
          )}
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 15, color: "var(--muted)", lineHeight: 1.9 }}>
          原因是選品全部同一種：低敏、單一蛋白、無穀、全齡。它們之間沒有對比，
          所以任何規則都刪不掉東西。<b style={{ color: "var(--ink)" }}>
          下一批該補的，反而是會被刪掉的那種。</b>
        </p>
      </div>

      <H>每條規則刪得掉幾款</H>
      <div style={box}>
        {audit.map((r) => (
          <div key={r.rule} style={{
            ...line,
            borderTop: "1px solid var(--line)",
            color: r.catches === 0 ? "var(--cut)" : "inherit",
          }}>
            <span className="mono" style={{ minWidth: 48, fontWeight: 700 }}>{r.catches} 款</span>
            <span style={{ flex: 1, minWidth: 160 }}>{r.rule}</span>
            {r.catches === 0 && (
              <span style={{ fontSize: 13, color: "var(--muted)", flexBasis: "100%" }}>
                要補：{r.need}
              </span>
            )}
          </div>
        ))}
        {dead.length > 0 && (
          <p style={{ margin: "14px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>
            <b style={{ color: "var(--cut)" }}>{dead.length} 條規則目前是空的</b>，
            規則沒寫錯，只是選品裡還沒有它要擋的東西。
            補進去之後，那一刀才會出現在使用者看到的「怎麼刪的」裡面。
          </p>
        )}
      </div>

      {/* ── 採購清單。連結以外的東西都做完了，這一段是唯一需要 Tim 動手的 ── */}
      <H>分潤怎麼算（選賣場的時候用得到）</H>
      <div style={box}>
        <ul style={ul}>
          <li><b>要同一家店才算。</b>讀者點我們的連結進去，跑去別家買，那筆沒有我們的事。所以連結要指到他最可能直接下單的那一家。</li>
          <li><b>七天內結帳都算，而且不限那一件商品。</b>同一家店裡他順手買的貓砂、罐頭一樣算。東西齊全的賣場因此比便宜五塊的賣場值錢。</li>
          <li><b>七天內他點到別人的連結，就變成別人的。</b>所以頁面要讓人看完就走、直接買，不要逼他再去比價。</li>
          <li><b>產不出連結是「那一款」的事，不是整家的事。</b>賣家可以只幫部分商品開分潤（2026-09-19 驗證：小BU 其他商品產得出來，只有 pidan 那一款不行）。跟商城、優選、官方旗艦館也無關，皇家官方旗艦館一樣產不出來。所以我只擋「那一款 × 那一家」，同一家在別款照樣列。最快的驗法是在分潤後台搜商品，列得出來的才產得出連結。</li>
          <li><b>費率不用挑。</b>蝦皮的費率隨商品、活動、賣家加碼和創作者分級在變，以商品頁當下顯示的為準，我們也不寫在讀者看得到的地方。能控制的只有「他會不會買」。</li>
        </ul>
        <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--faint)", lineHeight: 1.85 }}>
          依蝦皮幫助中心「分潤計畫用戶如何賺取分潤金」與聯盟計畫約定條款（2026-09-18 查）。條款另有規定：禁止機器人與自動抓取、禁止自購，違反可立即終止，所以我們不自動操作你的帳號。
        </p>
      </div>

      {(() => {
        const shown = new Set([...thin.map((p) => p.id), ...noChicken.map((x) => x.planId), ...waiting.map((p) => p.id)]);
        const rest = huntTargets.filter((t) => !shown.has(t.id));
        if (rest.length === 0) return null;
        return (
          <>
            <H>我查好賣場、等你產連結的（{rest.length} 款）</H>
            {rest.map((t) => (
              <div key={t.id} style={box}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <b style={{ fontSize: 16.5 }}>{t.label}</b>
                  <span className="mono" style={{ fontSize: 13, color: "var(--faint)" }}>{t.id}</span>
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.85 }}>{t.why}</p>
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
                  <Line k="產生連結時填">
                    <span className="mono" style={{ fontSize: 14 }}>
                      Sub id 1 = <b>{shopeeSubId(t.id)}</b>　Sub id 2 = <b>{categoryOfId(t.id)?.subId ?? CATEGORY_SUB_ID}</b>
                    </span>
                  </Line>
                  <HuntPicks id={t.id} />
                </div>
              </div>
            ))}
          </>
        );
      })()}

      {thin.length > 0 && (
        <>
          <H>只剩一家在賣（{thin.length} 款）</H>
          <p style={{ margin: "0 0 14px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
            那一家賣完，這一款在網站上就沒地方買。補第二家最快的方法，是回同一個品牌我們買過的賣場找。{thinAll.length > thin.length ? ` 另外還有 ${thinAll.length - thin.length} 款也只有一家，但目前的情況推不到它們，先不用管。` : ""}
          </p>
          {thin.map((p) => (
            <div key={p.id} style={box}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", display: "block" }}>{p.brand}</span>
                  <b style={{ fontSize: 16.5 }}>{p.name}</b>
                </div>
                <span className="mono" style={{ fontSize: 13, color: "var(--faint)" }}>
                  {p.id}{picks.get(p.id) ? ` · 被推薦 ${picks.get(p.id)} 次` : ""}
                </span>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                <Line k="現在這一家">{[...new Set(p.price.merchants.filter((m) => !m.dead).map((m) => m.label))].join("、")}</Line>
                <Line k="產生連結時填">
                  <span className="mono" style={{ fontSize: 14 }}>
                    Sub id 1 = <b>{shopeeSubId(p.id)}</b>　Sub id 2 = <b>{categoryOfId(p.id)?.subId ?? CATEGORY_SUB_ID}</b>
                  </span>
                </Line>
                <HuntLinks keyword={huntKeyword(p)} shops={shopsFor(p.brand)} />
                <HuntPicks id={p.id} />
              </div>
            </div>
          ))}
        </>
      )}

      {noChicken.length > 0 && (
        <>
          <H>查藏雞頁沒有雞、但我們沒連結（{noChicken.length} 款）</H>
          <p style={{ margin: "0 0 14px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
            這幾款我們讀過成分表、確定沒有雞，但沒有連結，所以只能看不能買。
            對雞過敏的人最想買的就是這幾包。連結一到就補成完整商品，裁決器也會開始推。
          </p>
          {noChicken.map((x) => (
            <div key={x.id} style={box}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", display: "block" }}>{x.brand}</span>
                  <b style={{ fontSize: 16.5 }}>{x.name}</b>
                </div>
                <span className="mono" style={{ fontSize: 13, color: "var(--faint)" }}>{x.id} → {x.planId}</span>
              </div>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
                {x.huntNote && (
                  <Line k="找過">
                    <b style={{ color: "var(--cut)" }}>{x.huntNote}</b>
                  </Line>
                )}
                <Line k="產生連結時填">
                  <span className="mono" style={{ fontSize: 14 }}>
                    Sub id 1 = <b>{shopeeSubId(x.planId)}</b>　Sub id 2 = <b>{categoryOfId(x.planId)?.subId ?? CATEGORY_SUB_ID}</b>
                  </span>
                </Line>
                <HuntLinks keyword={x.hunt} shops={shopsFor(x.brand)} />
                <HuntPicks id={x.planId} />
              </div>
            </div>
          ))}
        </>
      )}

      <H>等你補連結的（{waiting.length} 款）</H>
      {waiting.length === 0 ? (
        <p style={ok}>沒有。選好的都上架了。</p>
      ) : (
        <>
          <p style={{ margin: "0 0 14px", fontSize: 15, color: "var(--muted)", lineHeight: 1.9 }}>
            規格、成分、文案都寫好了，<b style={{ color: "var(--ink)" }}>只差分潤連結</b>。
            照下面的關鍵字去蝦皮找賣家，產生連結時把 Sub_id 填上，
            再把那一行貼進 <code style={code}>data/paste.txt</code>，跑 <code style={code}>npm run data:paste</code>。
          </p>
          {waitingBy.map((g) => (
            <div key={g.cat.slug} style={{ marginBottom: 28 }}>
              <p style={{ margin: "0 0 12px", fontSize: 17, fontWeight: 700 }}>
                {g.cat.zh}：{g.items.length} 款
                {g.ready < MIN_LIVE && (
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--accent)", marginLeft: 10 }}>
                    再補 {MIN_LIVE - g.ready} 款就開張
                  </span>
                )}
              </p>
              {g.ready < MIN_LIVE && (
                <p style={{ margin: "0 0 14px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
                  能推薦的款數到 {MIN_LIVE}，{g.cat.zh}的裁決器、長尾頁、分享卡會在下一次部署自己打開。
                  清單已經照「補了之後會被推薦幾頁」排好，從最上面開始補最划算。
                </p>
              )}
          {g.items.map((p) => (
            <div key={p.id} style={box}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: 12.5, color: "var(--muted)", display: "block" }}>{p.brand}</span>
                  <b style={{ fontSize: 16.5 }}>{p.name}</b>
                </div>
                <span className="mono" style={{ fontSize: 13, color: "var(--faint)" }}>
                  {p.id}{picks.get(p.id) ? ` · 補了會被推薦 ${picks.get(p.id)} 次` : " · 目前的情況都輪不到它"}
                </span>
              </div>

              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                {p.huntNote && (
                  <Line k="找過">
                    <b style={{ color: "var(--cut)" }}>{p.huntNote}</b>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
                      先補別款。之後看到有賣場上架再回來補
                    </span>
                  </Line>
                )}
                <Line k="去蝦皮搜這個">
                  <span className="mono" style={{ fontSize: 14 }}>{huntKeyword(p)}</span>
                  <HuntLinks keyword={huntKeyword(p)} shops={shopsFor(p.brand)} />
                  <HuntPicks id={p.id} />
                </Line>
                <Line k="產生連結時填">
                  <span className="mono" style={{ fontSize: 14 }}>
                    Sub id 1 = <b>{shopeeSubId(p.id)}</b>　Sub id 2 = <b>{categoryOfId(p.id)?.subId ?? CATEGORY_SUB_ID}</b>
                  </span>
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
                    蝦皮這個欄位只收英數字，連字號會被擋，所以是 {shopeeSubId(p.id)} 不是 {p.id}。Sub id 3 以後不用填。
                    同一款找到好幾家，每一家都填一樣的
                  </span>
                </Line>
                {sellersOfBrand(p.brand).length > 0 && (
                  <Line k="這個牌子買過的家">
                    <b>{sellersOfBrand(p.brand).join("、")}</b>
                    <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
                      回這幾家找通常最快，有整條產品線的機率很高，而且賣家越集中維護越省
                    </span>
                  </Line>
                )}
                <Line k="要對得上">
                  賣場<b>標題</b>或<b>規格選項</b>裡，要有我們寫的這一款
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
                    一頁多款的賣場可以，網站會提醒讀者點進去選哪一個。只有內文和圖片對得上的不算，退換爭議照標題和規格走
                  </span>
                </Line>
                <Line k="有送東西的">
                  <b>可以收</b>，看同一個大小有沒有比別家便宜
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
                    便宜又送東西就收。只有贈品讓價錢比別家貴，才不要
                  </span>
                </Line>
                <Line k="一款找幾家">
                  多找幾家沒關係，同一包網站會自動給最便宜的那家
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
                    其他家留著當備援，最便宜的賣完了，讀者還有地方買。一款最多 16 條
                  </span>
                </Line>
                <Line k="截圖要拍到">
                  規格的完整名稱、價錢、運費（免運、限宅配、超取限幾包）
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 4 }}>
                    罐頭要看清楚是一罐還是一箱幾罐。規格名稱會原封不動寫給讀者看，點進去才選得對
                  </span>
                </Line>
              </div>
            </div>
          ))}
            </div>
          ))}
        </>
      )}

      <H>貓砂、零食還沒有連結的（{nonFoodGaps.reduce((n, g) => n + g.items.length, 0)} 款）</H>
      <p style={{ margin: "0 0 14px", fontSize: 14.5, color: "var(--muted)", lineHeight: 1.9 }}>
        這兩個類目不走飼料那套引擎，所以沒有「補了會被推薦幾次」可以排。
        順序就是資料的順序，從上面補下來就好。
      </p>
      {nonFoodGaps.map((g) => (
        <div key={g.zh} style={{ marginBottom: 10 }}>
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>
            {g.zh}（{g.items.length} 款）
          </p>
          {g.items.length === 0 ? (
            <p style={ok}>都補齊了。</p>
          ) : (
            g.items.map((p) => (
              <div key={p.id} style={box}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <span style={{ fontSize: 12.5, color: "var(--muted)", display: "block" }}>{p.brand}</span>
                    <b style={{ fontSize: 16.5 }}>{p.name}</b>
                  </div>
                  <span className="mono" style={{ fontSize: 13, color: "var(--faint)" }}>{p.id}</span>
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                  <Line k="去蝦皮搜這個">
                    <span className="mono" style={{ fontSize: 14 }}>{huntFrom(p.brand, p.name, p.searchAs)}</span>
                    <HuntLinks keyword={huntFrom(p.brand, p.name, p.searchAs)} shops={shopsFor(p.brand)} />
                    <HuntPicks id={p.id} />
                  </Line>
                  <Line k="產生連結時填">
                    <span className="mono" style={{ fontSize: 14 }}>
                      Sub id 1 = <b>{shopeeSubId(p.id)}</b>　Sub id 2 = <b>{categoryOfId(p.id)?.subId ?? CATEGORY_SUB_ID}</b>
                    </span>
                  </Line>
                </div>
              </div>
            ))
          )}
        </div>
      ))}

      <H>整款買不到的</H>
      {unbuyable.length === 0
        ? <p style={ok}>沒有。每一款都至少還有一家能買。</p>
        : <ul style={ul}>{unbuyable.map((p) => (
            <li key={p.id}>{p.brand}｜{p.name}：{p.discontinued ? "已標記停產" : "所有賣場都失效"}</li>
          ))}</ul>}

      <H>還沒寫「先知道這件事」的</H>
      {noIssues.length === 0
        ? <p style={ok}>都寫了。</p>
        : <ul style={ul}>{noIssues.map((p) => <li key={p.id}>{p.brand}｜{p.name}</li>)}</ul>}

      <H>先放著的（{later.length} 條）</H>
      <details>
        <summary style={{ cursor: "pointer", fontSize: 14.5, color: "var(--muted)", padding: "6px 0" }}>
          展開看全部
        </summary>
        <div style={{ overflowX: "auto", marginTop: 12 }}>
          <table style={{ width: "100%", minWidth: 620, borderCollapse: "collapse", fontSize: 13.5 }}>
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
      </details>

      <H>規則</H>
      <ul style={ul}>
        <li>{PRICE_FRESH_DAYS} 天內查過 = 新的，價格照常顯示。</li>
        <li>超過 {PRICE_FRESH_DAYS} 天 = 快過期，卡片上多一行「這個價格是 N 天前查的」。</li>
        <li>超過 {PRICE_STALE_DAYS} 天 = 過期，明講我們把它當參考不當承諾。</li>
        <li>賣場標成 <code style={code}>mNDead=1</code>，引擎完全跳過；全部賣場都死，整款不進裁決。</li>
        <li>連結健檢在自己電腦上跑：<code style={code}>npm run links:check</code>。</li>
        <li>新增商品用貼的：把行貼進 <code style={code}>data/paste.txt</code>，跑 <code style={code}>npm run data:paste</code>。</li>
      </ul>

      <p style={{ marginTop: 40 }}>
        <Link href="/" style={{ color: "var(--accent)", fontWeight: 700 }}>← 回裁決器</Link>
      </p>
    </main>
  );
}

/**
 * 所有分潤連結，照賣場分組。
 *
 * 蝦皮分潤後台說某個商品「無效」的時候，後台只給商品名和價錢；
 * 點進去才看得到賣場名稱。所以這張表用賣場分組：拿賣場名稱來對最快。
 *
 * 蝦皮的商品頁不讓程式看（回 403），我們也不繞過，所以「無效、賣完」只能靠人點開看。
 * 這張表就是讓 Tim 在手機上一條一條點的。
 */
/** 這一條在這一款裡的角色：第一條還能買的是主要，其他是備援 */
function roleOf(p: Product, m: Product["price"]["merchants"][number]): "主要" | "備援" {
  const first = p.price.merchants.find((x) => !x.dead);
  return first && first.affiliateUrl === m.affiliateUrl && (first.unit ?? "") === (m.unit ?? "") ? "主要" : "備援";
}

function AllLinks() {
  type HealthRow = { url: string; item: string | null; verdict: string };
  const byUrl = new Map((health.rows as HealthRow[]).map((r) => [r.url, r]));
  const all = catalog.flatMap((p) =>
    p.price.merchants.map((m) => ({ p, m, h: byUrl.get(m.affiliateUrl) })),
  );
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
  const urls = new Set(all.map((x) => x.m.affiliateUrl)).size;

  return (
    <>
      <H>所有分潤連結（{urls} 條，{groups.length} 家賣場）</H>
      {unchecked.length > 0 && (
        <div style={{ ...box, borderColor: "var(--cut)", background: "var(--cut-soft)" }}>
          <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>
            這 {unchecked.length} 家的名字還沒跟你核對
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.85 }}>
            這些名字是 Claude 從截圖讀的，可能讀錯字（「萬倍富」曾經被寫成「萬信富」）。
            讀者會拿這個名字去蝦皮搜，錯一個字就找不到。點下面那家的「點開看」，對一下賣場名稱，
            跟 Claude 說「都對」或哪一家要改。
          </p>
          <ul style={{ ...ul, fontSize: 14.5 }}>
            {unchecked.map((g) => (
              <li key={g.label}>
                <b>{g.label}</b>
                <span style={{ color: "var(--faint)", fontSize: 12.5 }}>
                  {g.shop ? `　蝦皮賣場 ${g.shop}` : "　還沒跑連結健檢"}　·　{[...new Set(g.items.map((x) => x.p.id))].join("、")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div id="links" style={{ ...box, borderColor: "var(--warn)", background: "var(--warn-soft)" }}>
        <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>蝦皮後台說某個商品「無效」的時候</p>
        <ol style={{ ...ul, fontSize: 14.5 }}>
          <li>在蝦皮 App 點進那個無效商品，看<b>賣場名稱</b>。</li>
          <li>在下面找同一個賣場。找不到，就是網站沒用到它，不用管。</li>
          <li>找到了，點那一條的「點開看」。打不開、顯示無效或賣完，就跟 Claude 說「這一條無效」，
            或直接貼另一家的新連結。舊的會標成失效，網站馬上不推那一家。</li>
        </ol>
        <p style={{ margin: "10px 0 0", fontSize: 14, lineHeight: 1.85 }}>
          <b>你給過的連結永遠不刪。</b>新給的放最前面，原本的自動往後當備援；主要那一條壞了，備援自己頂上。
          只有確定無效的會標「失效」：讀者看不到，這裡還留著，哪天恢復了一句話就能放回去。
        </p>
        <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.85 }}>
          自己點開檢查沒關係。要自己買的話不要從這裡下單，多數分潤計畫不算自己買的，還可能被當成異常。
          連結健檢最後一次跑是 {health.checkedAt}：每一條都有轉到商品頁，但商品還在不在、有沒有分潤，蝦皮不讓程式看，要自己點。
        </p>
      </div>
      {groups.map(([label, items]) => (
        <div key={label} style={box}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: 16.5 }}>
              {label}
              {unchecked.some((g) => g.label === label) && (
                <span style={{ marginLeft: 8, fontSize: 12.5, fontWeight: 600, color: "var(--cut)" }}>名字待核對</span>
              )}
            </h3>
            <span style={{ fontSize: 13, color: "var(--faint)" }}>{new Set(items.map((x) => x.m.affiliateUrl)).size} 條</span>
          </div>
          {items.map(({ p, m, h }) => (
            <div key={p.id + m.id} style={{ ...line, borderTop: "1px solid var(--line)" }}>
              <div style={{ flex: 1, minWidth: 190 }}>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>
                  <Link href={productHref(p)} style={{ color: "inherit" }}>{p.id}</Link> · {p.brand}
                  {/* 主要＝卡片上那個按鈕；備援＝收在「其他規格與價格」裡，主要的壞了就自動頂上 */}
                  <b style={{ marginLeft: 8, color: m.dead ? "var(--cut)" : roleOf(p, m) === "主要" ? "var(--keep)" : "var(--muted)" }}>
                    {m.dead ? "失效（讀者看不到）" : roleOf(p, m)}
                  </b>
                </span>
                {p.name}
                <span className="mono" style={{ display: "block", fontSize: 12, color: "var(--faint)" }}>
                  {m.unit ?? p.price.unit} · ${m.amount} · 查價 {m.checkedAt ?? p.price.checkedAt}
                  {h?.item ? ` · 蝦皮商品 ${h.item}` : ""}
                </span>
                {m.sharedPage && (
                  <span style={{ display: "block", fontSize: 12.5, color: "var(--cut)" }}>跟另一款在同一個商品頁，讀者要自己選規格</span>
                )}
              </div>
              <a href={m.affiliateUrl} target="_blank" rel="noopener nofollow"
                 style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
                點開看 ↗
              </a>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function Line({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", padding: "5px 0", fontSize: 14, lineHeight: 1.8 }}>
      <span style={{ color: "var(--faint)", minWidth: "9em", fontSize: 13 }}>{k}</span>
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

function H({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: 17, fontWeight: 700, margin: "40px 0 14px",
      paddingTop: 20, borderTop: "1px solid var(--line)",
    }}>{children}</h2>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "20px 22px", marginBottom: 14,
};
const line: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center",
  padding: "12px 0", borderTop: "1px solid var(--line)", fontSize: 14.5, lineHeight: 1.6,
};
const td: React.CSSProperties = { padding: "10px 12px 10px 0", verticalAlign: "top" };
const ul: React.CSSProperties = { paddingLeft: 20, margin: 0, fontSize: 15, lineHeight: 1.95 };
const ok: React.CSSProperties = { margin: 0, fontSize: 15, color: "var(--keep)" };
const code: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace", fontSize: "0.9em",
  background: "var(--sunken)", padding: "1px 5px", borderRadius: 3,
};

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
  const inShops = shops.filter((s) => s.shop).slice(0, 4);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
      <a href={`https://shopee.tw/search?keyword=${kw}`} target="_blank" rel="noopener noreferrer" style={huntBtn}>
        蝦皮全站搜「{keyword}」
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
  display: "inline-block", padding: "8px 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 700,
  background: "var(--accent)", color: "var(--accent-ink)", textDecoration: "none",
};
const huntBtnSoft: React.CSSProperties = {
  display: "inline-block", padding: "8px 16px", borderRadius: 999, fontSize: 13.5, fontWeight: 600,
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
