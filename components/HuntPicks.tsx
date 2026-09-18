import huntData from "@/data/hunt-candidates.json";

/**
 * 我先查好的候選賣場。只在維護台出現，讀者頁面看不到。
 *
 * 2026-09-18 Tim：「您可以順便給我連結，讓我直接點擊進去。」
 *
 * 資料來自比價站讀到的蝦皮上架快照（data/hunt-candidates.json），
 * 不是爬蝦皮，也沒有用他的帳號。價格會變、庫存看不到，
 * 所以每一組都寫清楚要自己開一次確認再產生分潤連結。
 */

type Candidate = { shop: string; price: number | null; unit: string; url: string };
type Target = { id: string; label: string; why: string; candidates: Candidate[] };

const HUNT = new Map((huntData.targets as Target[]).map((t) => [t.id, t]));

export default function HuntPicks({ id }: { id: string }) {
  const t = HUNT.get(id);
  if (!t) return null;
  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--line)" }}>
      <p style={{ margin: "0 0 2px", fontSize: 13, color: "var(--faint)", lineHeight: 1.8 }}>
        我查到的：{huntData._meta.checkedAt} 的比價站快照。價格會變、庫存看不到，開進去確認再產生連結
      </p>
      {t.candidates.map((c) => (
        <a key={c.url} href={c.url} target="_blank" rel="noopener noreferrer" style={row}>
          <span style={{ minWidth: 0 }}>
            <b style={{ fontSize: 14.5 }}>{c.shop}</b>
            <span style={{ fontSize: 12.5, color: "var(--muted)", marginLeft: 8 }}>{c.unit}</span>
          </span>
          <span className="mono" style={{ fontSize: 13.5, whiteSpace: "nowrap" }}>
            {c.price === null ? "看頁面" : "$" + c.price.toLocaleString()} ›
          </span>
        </a>
      ))}
    </div>
  );
}

const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
  padding: "9px 0", borderTop: "1px solid var(--line)", textDecoration: "none", color: "inherit",
};
