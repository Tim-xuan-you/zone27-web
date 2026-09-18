import huntData from "@/data/hunt-candidates.json";
import blocked from "@/data/no-affiliate-shops.json";
import storeReg from "@/data/stores.json";

/**
 * 我先查好的候選賣場。只在維護台出現，讀者頁面看不到。
 *
 * 2026-09-18 Tim：「您可以順便給我連結，讓我直接點擊進去。」
 * 同一天他回報：「這兩家無法。」再補一句：「假如我說（汎美力）無法，
 * 代表這家店，他裡頭賣的任何商品都無法。」
 *
 * 所以「產不出連結」是賣場層級的事：
 *   - data/no-affiliate-shops.json：試過不行的，整家封存，之後查哪一款都不再列出來
 *   - data/stores.json：成功產過連結的，任何商品都可以再用，旁邊標「用過」
 *   - 排序照價格，便宜的在前面。商城、優選、一般賣家都一樣看待
 *
 * 資料來自比價站讀到的蝦皮上架快照（data/hunt-candidates.json），
 * 不是爬蝦皮，也沒有用他的帳號。價格會變、庫存看不到，開進去要自己確認。
 */

type Candidate = { shop: string; shopId?: string; known?: boolean; price: number | null; unit: string; url: string };
type Failed = { shop: string; reason: string; at: string };
type Target = { id: string; label: string; why: string; note?: string; candidates: Candidate[]; failed?: Failed[] };

const HUNT = new Map((huntData.targets as Target[]).map((t) => [t.id, t]));

const BLOCKED_IDS = new Set((blocked.shops as { shopId?: string }[]).map((s) => s.shopId).filter(Boolean) as string[]);
const BLOCKED_NAMES = new Set((blocked.shops as { name: string }[]).map((s) => s.name));
const KNOWN_IDS = new Set(Object.keys((storeReg as { stores: Record<string, unknown> }).stores));

const isBlocked = (c: Candidate) => (c.shopId && BLOCKED_IDS.has(c.shopId)) || BLOCKED_NAMES.has(c.shop);

export default function HuntPicks({ id }: { id: string }) {
  const t = HUNT.get(id);
  if (!t) return null;
  // 整家不行的直接不列（Tim 說過那家的任何商品都產不出連結）
  const open = t.candidates.filter((c) => !isBlocked(c)).sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
  const gone = [
    ...t.candidates.filter(isBlocked).map((c) => `${c.shop}（整家產不出連結）`),
    ...(t.failed ?? []).map((f) => `${f.shop}（${f.reason}）`),
  ];
  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
      <p style={{ margin: "0 0 2px", fontSize: 13, color: "var(--faint)", lineHeight: 1.8 }}>
        我查到的（{huntData._meta.checkedAt}），便宜的排前面。產不出連結的話跟我說是哪一家，我整家封存
      </p>
      {t.note && (
        <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--warn)", lineHeight: 1.8 }}>{t.note}</p>
      )}
      {open.length === 0 && (
        <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.8 }}>
          還沒有可以試的賣場。用上面「在（我們用過的賣場）裡找」那幾顆按鈕碰碰運氣，那些家一定產得出連結。
        </p>
      )}
      {open.map((c) => (
        <a key={c.url} href={c.url} target="_blank" rel="noopener noreferrer" style={row}>
          <span style={{ minWidth: 0 }}>
            <b style={{ fontSize: 14.5 }}>{c.shop}</b>
            {(c.known || (c.shopId && KNOWN_IDS.has(c.shopId))) && (
              <span style={{ fontSize: 11.5, color: "var(--keep)", background: "var(--keep-soft)", borderRadius: 6, padding: "2px 7px", marginLeft: 8 }}>
                用過，產得出連結
              </span>
            )}
            <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{c.unit}</span>
          </span>
          <span className="mono" style={{ fontSize: 13.5, whiteSpace: "nowrap" }}>
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

const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
  padding: "9px 0", borderTop: "1px solid var(--line)", textDecoration: "none", color: "inherit",
};
