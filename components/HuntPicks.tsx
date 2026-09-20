import huntData from "@/data/hunt-candidates.json";
import blocked from "@/data/no-affiliate.json";
import storeReg from "@/data/stores.json";
import dogFood from "@/data/dog-food.json";
import catFood from "@/data/cat-food.json";
import catWet from "@/data/cat-wet-food.json";
import litterData from "@/data/cat-litter.json";
import treatData from "@/data/cat-treat.json";
import { CHANNEL_ZH, channelOf, type Channel } from "@/lib/channel";

/**
 * 我先查好的候選賣場。只在維護台出現，讀者頁面看不到。
 *
 * 2026-09-18 Tim：「您可以順便給我連結，讓我直接點擊進去。」
 * 同一天他回報：「這兩家無法。」再補一句：「假如我說（汎美力）無法，
 * 代表這家店，他裡頭賣的任何商品都無法。」
 *
 * 2026-09-19 他自己去驗證後更正：「我剛去查了之前的小BU，其他商品可以耶，
 * 代表是看商品，這商品賣家有開分潤就有。」所以是**商品層級**：
 *   - data/no-affiliate.json：記「哪一款 × 哪一家」產不出來，只藏那一個組合
 *   - 同一家在別款照樣列出來，不會白白封掉還能用的賣場
 *   - data/stores.json：成功產過連結的，旁邊標「用過」，那只是機率高一點，不保證每一款都開
 *   - 排序照價格，便宜的在前面。商城、優選、一般賣家都一樣看待
 *
 * 資料來自比價站讀到的蝦皮上架快照（data/hunt-candidates.json），
 * 不是爬蝦皮，也沒有用他的帳號。價格會變、庫存看不到，開進去要自己確認。
 */

type Candidate = {
  shop: string; shopId?: string; known?: boolean; soldOut?: string;
  price: number | null; unit: string; url: string; channel?: Channel;
};
type Failed = { shop: string; reason: string; at: string };
type Target = { id: string; label: string; why: string; note?: string; candidates: Candidate[]; failed?: Failed[] };

const HUNT = new Map((huntData.targets as Target[]).map((t) => [t.id, t]));

type Pair = { productId: string; shop: string; shopId?: string; note?: string };
const PAIRS = blocked.pairs as Pair[];
const KNOWN_IDS = new Set(Object.keys((storeReg as { stores: Record<string, unknown> }).stores));

/* 商品編號 → 牌子。用來看「同一個牌子在這一家是不是已經失敗過好幾款」 */
const BRAND = new Map<string, string>();
for (const src of [dogFood, catFood, catWet, litterData, treatData]) {
  for (const p of src.products as { id: string; brand: string }[]) BRAND.set(p.id, p.brand);
}
const brandKey = (brand: string) => brand.split(/[（(s]/)[0].trim();

/**
 * 這一家到目前為止的戰績：產出過幾款、失敗過幾款。
 *
 * 2026-09-20：健綠四款在三家一般賣家全滅，十二次白工。
 * 那三家在按下去之前，畫面上只有價格，沒有任何「這家到底開不開得出來」的線索。
 *
 * 現在每一家旁邊直接寫戰績。便宜但 0 成 4 敗，跟貴但 11 成 1 敗，
 * 是完全不同的兩件事，值不值得試由他判斷，不要我替他排序。
 */
function shopRecord(c: Candidate): { ok: number; fail: number } {
  const pairs = new Set<string>();
  for (const src of [dogFood, catFood, catWet, litterData, treatData]) {
    for (const p of src.products as { id: string; price: { merchants: { label: string; dead?: boolean; soldOut?: boolean }[] } }[]) {
      for (const m of p.price.merchants) {
        if (m.dead || m.soldOut || m.label !== c.shop) continue;
        pairs.add(p.id);
      }
    }
  }
  const fail = PAIRS.filter((x) => (c.shopId && x.shopId === c.shopId) || x.shop === c.shop).length;
  return { ok: pairs.size, fail };
}

/**
 * 這個牌子在這一家「產得出來」過幾款。
 *
 * 2026-09-19：汪喵的太空小零嘴一路試到第九家，Tim 問是不是全滅。
 * 不是 —— 毛孩寵物鋪產得出分潤，只是那個口味剛好售完；
 * 汪喵星球官方商城更早就在貓砂那款產過。
 *
 * 失敗要記，成功更要記。已經證明會開的那幾家要排在最前面，
 * 不然每一款都從頭試一次。
 */
function brandWorks(c: Candidate, id: string): number {
  const brand = BRAND.get(id);
  if (!brand) return 0;
  const key = brandKey(brand);
  let n = 0;
  for (const src of [dogFood, catFood, catWet, litterData, treatData]) {
    for (const p of src.products as { id: string; brand: string; price: { merchants: { label: string; dead?: boolean }[] } }[]) {
      if (p.id === id || brandKey(p.brand) !== key) continue;
      if (p.price.merchants.some((m) => !m.dead && m.label === c.shop)) n++;
    }
  }
  return n;
}

/**
 * 這個牌子在這一家已經失敗過幾款。
 *
 * 2026-09-19：汪喵星球的太空小零嘴一次試了四家全滅。
 * 那一系列有七款，如果每一款都要重試四家，就是二十八次白工。
 * 分潤是賣家對「商品」開的，但同一個牌子在同一家店通常是整條線一起開或一起不開，
 * 所以這個數字是很強的線索 —— 不擋，只提醒。
 */
function brandFails(c: Candidate, id: string): number {
  const brand = BRAND.get(id);
  if (!brand) return 0;
  const key = brandKey(brand);
  return PAIRS.filter(
    (x) =>
      x.productId !== id &&
      ((c.shopId && x.shopId === c.shopId) || x.shop === c.shop) &&
      brandKey(BRAND.get(x.productId) ?? "") === key,
  ).length;
}

/** 這一款在這一家試過產不出來？（同一家在別款不受影響） */
const failedFor = (id: string, c: Candidate): Pair | undefined =>
  PAIRS.find((x) => x.productId === id && ((c.shopId && x.shopId === c.shopId) || x.shop === c.shop));

export default function HuntPicks({ id }: { id: string }) {
  const t = HUNT.get(id);
  if (!t) return null;
  // 整家不行的直接不列（Tim 說過那家的任何商品都產不出連結）
  // 售完的排最後（補貨了還是要回去找，所以不刪掉）
  const open = t.candidates
    .filter((c) => !failedFor(id, c))
    .sort(
      (a, b) =>
        // 已經證明這個牌子會開的排最前面，再來才是售完的往後、便宜的往前
        brandWorks(b, id) - brandWorks(a, id) ||
        Number(Boolean(a.soldOut)) - Number(Boolean(b.soldOut)) ||
        (a.price ?? 1e9) - (b.price ?? 1e9),
    );
  // 一整排都是商城代表我查得不夠廣：商城通常比一般賣家貴一截
  const allMall = open.length > 0 && open.every((c) => (c.channel ?? channelOf(c.shop)) === "mall");
  const gone = [
    ...PAIRS.filter((x) => x.productId === id).map((x) => `${x.shop}（${x.note ?? "這一款產不出連結"}）`),
    ...(t.failed ?? []).map((f) => `${f.shop}（${f.reason}）`),
  ];
  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
      <p style={{ margin: "0 0 2px", fontSize: 12.5, color: "var(--faint)", lineHeight: 1.8 }}>
        我查到的（{huntData._meta.checkedAt}），便宜的排前面。產不出連結的話跟我說是哪一家，我只擋這一款的那一家
      </p>
      {open.length > 0 && allMall && (
        <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "var(--warn)", lineHeight: 1.8 }}>
          這一款我只查到商城。商城通常貴一截，如果是這個牌子只在官方賣就沒辦法，不然再撈一次一般賣家
        </p>
      )}
      {t.note && (
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--warn)", lineHeight: 1.8 }}>{t.note}</p>
      )}
      {open.length === 0 && (
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--muted)", lineHeight: 1.8 }}>
          查到的都試過了。用上面「在（我們用過的賣場）裡找」那幾顆按鈕再碰碰運氣：同一家不同商品，開沒開分潤不一樣。
        </p>
      )}
      {open.map((c) => (
        <a key={c.url} href={c.url} target="_blank" rel="noopener noreferrer" style={row}>
          <span style={{ minWidth: 0 }}>
            <b style={{ fontSize: 14 }}>{c.shop}</b>
            {(c.known || (c.shopId && KNOWN_IDS.has(c.shopId))) && (
              <span style={{ fontSize: 12.5, color: "var(--keep)", background: "var(--keep-soft)", borderRadius: 8, padding: "2px 7px", marginLeft: 8 }}>
                用過，產得出連結
              </span>
            )}
            <span style={{ ...chip, ...CH_STYLE[c.channel ?? channelOf(c.shop)] }}>
              {CHANNEL_ZH[c.channel ?? channelOf(c.shop)]}
            </span>
            {brandWorks(c, id) > 0 && (
              <span style={{ ...chip, color: "var(--keep)", background: "var(--keep-soft)" }}>
                這個牌子在這家產出過 {brandWorks(c, id)} 款
              </span>
            )}
            {(() => {
              const r = shopRecord(c);
              if (r.ok + r.fail === 0) return null;
              const good = r.ok > r.fail;
              return (
                <span style={{ ...chip, color: good ? "var(--muted)" : "var(--cut)", background: good ? "var(--sunken)" : "var(--cut-soft)" }}>
                  這家 {r.ok} 成 {r.fail} 敗
                </span>
              );
            })()}
            {brandFails(c, id) > 0 && (
              <span style={{ ...chip, color: "var(--warn)", background: "var(--warn-soft)" }}>
                這個牌子在這家失敗過 {brandFails(c, id)} 款
              </span>
            )}
            <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>
              {c.unit}{c.soldOut ? " · 上次看是售完的，先確認有沒有補貨" : ""}
            </span>
          </span>
          <span className="mono" style={{ fontSize: 14, whiteSpace: "nowrap" }}>
            {c.price === null ? "看頁面" : "$" + c.price.toLocaleString()} ›
          </span>
        </a>
      ))}
      {gone.length > 0 && (
        <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--faint)", lineHeight: 1.85 }}>
          試過的：{gone.join("、")}
        </p>
      )}
    </div>
  );
}

const chip: React.CSSProperties = {
  fontSize: 12.5, borderRadius: 8, padding: "2px 7px", marginLeft: 8, whiteSpace: "nowrap",
};
const CH_STYLE: Record<Channel, React.CSSProperties> = {
  mall: { color: "var(--muted)", background: "var(--sunken)" },
  preferred: { color: "var(--accent)", background: "var(--accent-soft)" },
  seller: { color: "var(--keep)", background: "var(--keep-soft)" },
};

const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
  padding: "9px 0", borderTop: "1px solid var(--line)", textDecoration: "none", color: "inherit",
};
