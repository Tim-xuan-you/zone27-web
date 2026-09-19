import Link from "next/link";
import { catalogOf } from "@/lib/catalog";
import { anchorOf, buyable, cansOf, canWord, formOf, pricePerKg, unitOf } from "@/lib/engine";
import { productHref } from "@/lib/labels";
import { STAMP } from "@/lib/chicken";
import { statusOf } from "@/lib/check";
import type { Form, Product, Species } from "@/lib/types";

/**
 * 只看價錢的話：這一類裡最便宜的三款。
 *
 * 2026-09-18 Tim：「價格取向的用戶如何照顧？」
 *
 * 裁決器問的是狀況，不是預算；講了「想省錢」它才會把價錢的權重拉滿。
 * 可是很多人進站的第一個念頭就是「哪個便宜」，那應該有一條直路，
 * 不用先講自己家那隻的事。
 *
 * 誠實的做法是：便宜就講便宜，旁邊照樣掛有沒有雞的標章，
 * 再寫一句「便宜不代表適合」。我們不會為了衝轉換把它包裝成推薦。
 */

const perOf = (p: Product): { n: number; label: string } | null => {
  const m = anchorOf(p, "safe");
  if (!m) return null;
  const unit = unitOf(p, m);
  if (formOf(p) === "wet") {
    const c = cansOf(unit);
    if (!c) return null;
    return { n: Math.round(m.amount / c.n), label: `每${canWord(p)}` };
  }
  const per = pricePerKg(unit, m.amount);
  return per === null ? null : { n: per, label: "每公斤" };
};

export default function CheapestCard({ species, form }: { species: Species; form: Form }) {
  const rows = catalogOf(species, form)
    .filter((p) => buyable(p) && !p.referenceOnly)
    .map((p) => ({ p, per: perOf(p) }))
    .filter((x): x is { p: Product; per: { n: number; label: string } } => x.per !== null)
    .sort((a, b) => a.per.n - b.per.n)
    .slice(0, 3);
  if (rows.length < 3) return null;

  return (
    <section style={{ marginTop: 34 }}>
      <p style={lbl}>只看價錢的話</p>
      <div style={box}>
        {rows.map(({ p, per }) => {
          const st = STAMP[statusOf(p)];
          return (
            <Link key={p.id} href={productHref(p)} style={row}>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{p.brand}</span>
                <span style={{ display: "block", fontWeight: 700, lineHeight: 1.5 }}>{p.name}</span>
                <span style={{ fontSize: 12.5, color: st.fg, background: st.bg, borderRadius: 8, padding: "2px 7px", display: "inline-block", marginTop: 5 }}>
                  {st.zh}
                </span>
              </span>
              <span className="mono" style={{ whiteSpace: "nowrap", fontSize: 14 }}>
                <b>${per.n.toLocaleString()}</b>
                <span style={{ color: "var(--faint)", fontSize: 12.5 }}>／{per.label.replace("每", "")}</span>
                <span aria-hidden style={{ color: "var(--faint)", marginLeft: 8 }}>›</span>
              </span>
            </Link>
          );
        })}
        <p style={{ margin: "12px 0 0", fontSize: 12.5, color: "var(--faint)", lineHeight: 1.85 }}>
          便宜不代表適合你家那隻。點進去先看「這款什麼時候不要買」，再決定。
        </p>
      </div>
    </section>
  );
}

const lbl: React.CSSProperties = {
  margin: "0 0 10px", fontSize: 12.5, fontWeight: 700, color: "var(--muted)", letterSpacing: ".06em",
};
const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, padding: "6px 18px 16px",
};
const row: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
  padding: "13px 0", borderBottom: "1px solid var(--line)", textDecoration: "none", color: "inherit",
};
