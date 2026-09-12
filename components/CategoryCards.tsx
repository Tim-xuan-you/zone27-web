import Link from "next/link";
import type { Category } from "@/lib/categories";
import { catalogOf, isLive, liveCount } from "@/lib/catalog";
import { allergensOf, breedsOf } from "@/lib/slugs";

/**
 * 類目卡。首頁、動物頁（/cat）共用。
 *
 * 卡片上的數字全部從資料算，不寫死。
 * 「上架中」會在連結補齊、重新 build 的那一刻自己變成「N 款可以買」。
 */
export default function CategoryCards({ cats, short }: { cats: Category[]; short?: boolean }) {
  return (
    <div style={grid}>
      {cats.map((c) => {
        const live = isLive(c.species, c.form);
        const ready = liveCount(c.species, c.form);
        const read = catalogOf(c.species, c.form).length;
        return (
          <Link key={c.slug} href={`/${c.slug}`} style={card}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>{short ? c.short : c.zh}</h2>
              <span style={live ? liveTag : soonTag}>
                {live ? `${ready} 款可以買` : "上架中"}
              </span>
            </div>
            <p className="keep" style={{ margin: "10px 0 12px", fontSize: 15, color: "var(--muted)", lineHeight: 1.85 }}>
              {c.pitch}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--faint)", lineHeight: 1.8 }}>
              {!live
                ? `${read} 款成分表讀完了，購買連結補齊就開放推薦`
                : c.form === "dry"
                ? `${breedsOf(c.species).length} 個品種 · ${allergensOf(c.species).length} 種過敏原 · 讀過 ${read} 款成分表`
                : `讀過 ${read} 款成分表`}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

const grid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14,
};
const card: React.CSSProperties = {
  display: "block", background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 16, boxShadow: "var(--sh)", padding: "22px 22px 20px",
  textDecoration: "none", color: "inherit",
};
const liveTag: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 700, color: "var(--keep)", whiteSpace: "nowrap",
};
const soonTag: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 700, color: "var(--faint)", whiteSpace: "nowrap",
};
