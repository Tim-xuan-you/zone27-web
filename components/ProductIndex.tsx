import Link from "next/link";
import { S } from "./styles";
import { cheapest, recommendable } from "@/lib/engine";
import { meatsOf, productHref, stageOf } from "@/lib/labels";
import type { Product } from "@/lib/types";

/**
 * 類目頁底下「我們讀過的 N 款」：每一款一行，點進去是那一款的商品頁。
 *
 * 狗飼料頁以前沒有這一段，裁決器當不上主答案的那 8 款，
 * 在整個網站上幾乎找不到入口（2026-09-13 Tim：「給了連結，怎麼搜都搜不到」）。
 * 能買的排前面，還在補的、對照款放後面。
 */
export default function ProductIndex({ products, title }: { products: Product[]; title?: string }) {
  const rank = (p: Product) => (recommendable(p) ? 0 : p.referenceOnly ? 2 : 1);
  const list = [...products].sort((a, b) => rank(a) - rank(b));
  return (
    <>
      <p style={S.lbl}>{title ?? `我們讀過的 ${products.length} 款`}</p>
      <div style={{ display: "grid", gap: 10 }}>
        {list.map((p) => {
          const ok = recommendable(p);
          return (
            <Link key={p.id} href={productHref(p)} style={row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{p.brand}</span>
                <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, lineHeight: 1.5 }}>{p.name}</span>
                <span style={{ display: "block", fontSize: 13, color: "var(--faint)", marginTop: 2 }}>
                  {stageOf(p)}{meatsOf(p) ? ` · 肉：${meatsOf(p)}` : ""}
                </span>
              </div>
              <span className="mono" style={{ fontSize: 13.5, whiteSpace: "nowrap", color: ok ? "var(--keep)" : "var(--faint)", fontWeight: ok ? 700 : 500 }}>
                {ok ? `$${cheapest(p).toLocaleString()} 起` : p.referenceOnly ? "對照款" : "補連結中"}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

const row: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12,
  background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 12, padding: "12px 16px", textDecoration: "none", color: "inherit",
};
