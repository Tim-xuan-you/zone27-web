import huntData from "@/data/hunt-candidates.json";

/**
 * 我先查好的候選賣場。只在維護台出現，讀者頁面看不到。
 *
 * 2026-09-18 Tim：「您可以順便給我連結，讓我直接點擊進去。」
 * 同一天他回報：「這兩家無法。」—— 不是每一家都產得出分潤連結，
 * 賣場要有參加分潤計畫，而這件事比價站看不出來。
 *
 * 所以這裡照「產得出連結的機率」排：
 *   1. 我們已經成功產過連結的賣場（data/stores.json）
 *   2. 沒用過的，價格便宜的在前面
 *   3. 試過產不出來的，留著但標起來，不要再試第二次
 *
 * 資料來自比價站讀到的蝦皮上架快照（data/hunt-candidates.json），
 * 不是爬蝦皮，也沒有用他的帳號。價格會變、庫存看不到，開進去要自己確認。
 */

type Candidate = { shop: string; shopId?: string; known?: boolean; price: number | null; unit: string; url: string };
type Failed = { shop: string; reason: string; at: string };
type Target = { id: string; label: string; why: string; note?: string; candidates: Candidate[]; failed?: Failed[] };

const HUNT = new Map((huntData.targets as Target[]).map((t) => [t.id, t]));

export default function HuntPicks({ id }: { id: string }) {
  const t = HUNT.get(id);
  if (!t) return null;
  const sorted = [...t.candidates].sort(
    (a, b) => Number(Boolean(b.known)) - Number(Boolean(a.known)) || (a.price ?? 1e9) - (b.price ?? 1e9),
  );
  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
      <p style={{ margin: "0 0 2px", fontSize: 13, color: "var(--faint)", lineHeight: 1.8 }}>
        我查到的（{huntData._meta.checkedAt}）。價格會變、庫存看不到，開進去確認再產生連結
      </p>
      {t.note && (
        <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--warn)", lineHeight: 1.8 }}>{t.note}</p>
      )}
      {sorted.map((c) => (
        <a key={c.url} href={c.url} target="_blank" rel="noopener noreferrer" style={row}>
          <span style={{ minWidth: 0 }}>
            <b style={{ fontSize: 14.5 }}>{c.shop}</b>
            {c.known && (
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
      {t.failed && t.failed.length > 0 && (
        <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "var(--faint)", lineHeight: 1.85 }}>
          試過產不出連結的（不用再試）：{t.failed.map((f) => f.shop).join("、")}
        </p>
      )}
    </div>
  );
}

const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
  padding: "9px 0", borderTop: "1px solid var(--line)", textDecoration: "none", color: "inherit",
};
