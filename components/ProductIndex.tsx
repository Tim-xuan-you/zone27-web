import Link from "next/link";
import { S } from "./styles";
import { cheapest, recommendable } from "@/lib/engine";
import { meatsOf, productHref, stageOf } from "@/lib/labels";
import Stamp from "./Stamp";
import type { Product } from "@/lib/types";

/**
 * 類目頁底下「我們讀過的 N 款」：每一款一行，點進去是那一款的商品頁。
 *
 * 狗飼料頁以前沒有這一段，裁決器當不上主答案的那 8 款，
 * 在整個網站上幾乎找不到入口（2026-09-13 Tim：「給了連結，怎麼搜都搜不到」）。
 * 能買的排前面，還在補的、對照款放後面。
 *
 * 2026-09-24 Tim：「有些頁面好長好長，怎麼划都划不到底。」
 * 狗飼料頁光這一段就 1,700px。讀者來這裡是要買，買不到的那幾款先收起來，
 * 想看再點開。收起來的還在頁面上（<details>），搜尋引擎一樣讀得到。
 * 一款都還買不到的類目，全部攤開，不然這一段是空的。
 */
export default function ProductIndex({ products, title }: { products: Product[]; title?: string }) {
  const rank = (p: Product) => (recommendable(p) ? 0 : p.referenceOnly ? 2 : 1);
  const list = [...products].sort((a, b) => rank(a) - rank(b));
  const ok = list.filter((p) => recommendable(p));
  const rest = list.filter((p) => !recommendable(p));
  const fold = ok.length > 0 && rest.length > 0;
  const waiting = rest.filter((p) => !p.referenceOnly).length;
  const refs = rest.length - waiting;
  return (
    <>
      <p style={S.lbl}>{title ?? `我們讀過的 ${products.length} 款`}</p>
      <Rows items={fold ? ok : list} />
      {fold && (
        <details style={foldBox}>
          <summary style={foldSummary}>
            {[waiting && `還沒有購買連結的 ${waiting} 款`, refs && `對照款 ${refs} 款`].filter(Boolean).join("、")}
          </summary>
          <Rows items={rest} style={{ marginTop: 12 }} />
        </details>
      )}
    </>
  );
}

function Rows({ items, style }: { items: Product[]; style?: React.CSSProperties }) {
  return (
    <div style={{ ...wrap, ...style }}>
      {items.map((p, i) => {
        const ok = recommendable(p);
        return (
          <Link key={p.id} href={productHref(p)} style={{ ...row, borderTop: i ? "1px solid var(--line)" : 0 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--muted)" }}>
                {p.brand}<Stamp p={p} />
              </span>
              <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, lineHeight: 1.5 }}>{p.name}</span>
              <span style={{ display: "block", fontSize: 12.5, color: "var(--faint)", marginTop: 2 }}>
                {stageOf(p)}{meatsOf(p) ? ` · 肉：${meatsOf(p)}` : ""}
              </span>
            </div>
            <span className="mono" style={{ fontSize: 14, whiteSpace: "nowrap", color: ok ? "var(--keep)" : "var(--faint)", fontWeight: ok ? 700 : 500 }}>
              {ok ? `$${cheapest(p).toLocaleString()} 起` : p.referenceOnly ? "對照款" : "補連結中"}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

const wrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
const row: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12,
  padding: "12px 16px", textDecoration: "none", color: "inherit",
};
const foldBox: React.CSSProperties = {
  marginTop: 12, background: "var(--sunken)", border: "1px solid var(--line)", borderRadius: 14, padding: "14px 16px",
};
const foldSummary: React.CSSProperties = { cursor: "pointer", fontSize: 14, fontWeight: 700, color: "var(--muted)" };
