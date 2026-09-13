import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "./SiteHeader";
import { ProductCard } from "./Result";
import { S } from "./styles";
import { byId, catalogOf } from "@/lib/catalog";
import { categoryOf } from "@/lib/categories";
import { anchorOf, cansOf, canWord, formOf, recommendable } from "@/lib/engine";
import { meatsOf, productHref, stageOf } from "@/lib/labels";
import type { Product } from "@/lib/types";
import dogChicken from "@/data/hidden-chicken.json";
import catChicken from "@/data/cat-hidden-chicken.json";
import canChicken from "@/data/cat-wet-hidden-chicken.json";

/**
 * 每一款的商品頁：/dog-food/p/df-01。
 *
 * 為什麼要有：裁決器一次只給一個主答案，狗飼料 12 款裡有 8 款在任何情況都當不上主答案，
 * 只能收在「還有 N 款」裡。Tim 給了連結，自己卻怎麼找都找不到（2026-09-13）。
 * 讀者也一樣：搜「紐頓 T22 有雞嗎」「希爾思 高齡活力 成分」的人，
 * 要的就是這一款的資料，不是先講一句狀況再等我們推薦。
 *
 * 所以每一款都有自己的一頁，照極簡的原則只放讀者要的：
 * 什麼時候不要買、肉有哪些、每一家的價格、去賣場的按鈕。
 * 沒有連結的（對照款、還在補的）一樣有頁面，但不放購買按鈕，改指向同一類可以買的。
 */

type Params = { id: string };

const CASES: { path: string; cases: { productId?: string; verdict: string }[] }[] = [
  { path: "/dog-food/hidden-chicken", cases: dogChicken.cases },
  { path: "/cat-food/hidden-chicken", cases: [...catChicken.cases, ...catChicken.alsoMismatched] },
  { path: "/cat-wet-food/hidden-chicken", cases: canChicken.cases },
];

/** 這一款有沒有被寫進「名字跟成分表對不上」那幾頁 */
function mismatchOf(p: Product): { path: string; verdict: string } | null {
  for (const g of CASES) {
    const c = g.cases.find((x) => x.productId === p.id);
    if (c) return { path: g.path, verdict: c.verdict };
  }
  return null;
}

export function productParams(species: Product["species"], form: Product["form"] = "dry"): Params[] {
  return catalogOf(species, form).map((p) => ({ id: p.id }));
}

export function productMetadata(id: string): Metadata {
  const p = byId(id);
  if (!p) return {};
  const title = `${p.brand} ${p.name}`;
  const facts = [meatsOf(p) && `肉：${meatsOf(p)}`, p.spec.grainFree ? "無穀" : "含穀", stageOf(p)].filter(Boolean).join("、");
  return {
    title,
    description: `${facts}。什麼時候不要買：${p.dealbreaker}`.slice(0, 150),
    alternates: { canonical: productHref(p) },
    openGraph: { title, type: "article" },
  };
}

export default function ProductPage({ id, species, form = "dry" }: { id: string; species: Product["species"]; form?: Product["form"] }) {
  const p = byId(id);
  if (!p || p.species !== species || formOf(p) !== (form ?? "dry")) notFound();
  const cat = categoryOf(p.species, formOf(p));
  const ok = recommendable(p);
  const mismatch = mismatchOf(p);
  const animal = p.species === "cat" ? "貓" : "狗";

  // 同一類的其他款：能買的、年齡對得上的放前面
  const others = catalogOf(p.species, formOf(p))
    .filter((x) => x.id !== p.id && recommendable(x))
    .sort((a, b) => Number(sameStage(b, p)) - Number(sameStage(a, p)))
    .slice(0, 5);

  const can = formOf(p) === "wet" ? cansOf(anchorOf(p, "safe")?.unit ?? p.price.unit) : null;
  const perCan = can && p.spec.kcal ? Math.round((can.g / 1000) * p.spec.kcal) : null;

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" }}>
      <SiteHeader current={cat.slug} />

      <span style={S.brand}>{p.brand}</span>
      <h1 style={{ fontSize: "clamp(24px,5vw,34px)", lineHeight: 1.45, margin: "4px 0 14px" }}>{p.name}</h1>

      <div style={tags}>
        {formOf(p) === "wet" && (
          <span style={p.spec.complete === false ? { ...tag, ...warn } : { ...tag, ...good }}>
            {p.spec.complete === false ? "副食罐" : "主食罐"}
          </span>
        )}
        <span style={tag}>{stageOf(p)}</span>
        {meatsOf(p) && <span style={tag}>肉：{meatsOf(p)}</span>}
        <span style={tag}>{p.spec.grainFree ? "無穀" : "含穀"}</span>
        {p.spec.singleSource && <span style={{ ...tag, ...good }}>單一蛋白</span>}
        {perCan !== null && <span style={tag}>一{canWord(p)} {perCan} 大卡</span>}
        {formOf(p) === "dry" && p.spec.kcal && <span style={tag}>{p.spec.kcal.toLocaleString()} 大卡／公斤</span>}
      </div>

      {ok ? (
        <div style={{ marginTop: 18 }}>
          <ProductCard p={p} />
        </div>
      ) : (
        <div style={statusBox}>
          <p style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 700, color: "var(--muted)" }}>
            {p.referenceOnly ? "這一款我們不推薦，放進來是為了比較" : "購買連結還在補"}
          </p>
          <p style={{ margin: "0 0 10px", fontSize: 15.5, lineHeight: 1.85 }}>
            <b style={{ color: "var(--cut)" }}>什麼時候不要買：</b>{p.dealbreaker}
          </p>
          {p.knownIssues && (
            <p style={{ margin: 0, fontSize: 14.5, color: "var(--muted)", lineHeight: 1.85 }}>{p.knownIssues}</p>
          )}
        </div>
      )}

      {mismatch && (
        <Link href={mismatch.path} style={mismatchBox}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--cut)" }}>名字跟成分表對不上</span>
          <span style={{ display: "block", marginTop: 4, fontSize: 15, lineHeight: 1.8 }}>{mismatch.verdict}</span>
          <span style={{ display: "block", marginTop: 4, fontSize: 13.5, color: "var(--accent)" }}>看逐筆核對 →</span>
        </Link>
      )}

      <p style={S.lbl}>適不適合你家的{animal}</p>
      <div style={S.landing}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18 }}>把牠的狀況講一句，我們刪給你看</h2>
          <p style={{ margin: 0, fontSize: 15, color: "var(--muted)", lineHeight: 1.8 }}>
            過敏、年紀、胖瘦都算進去，這一款會不會被刪，一眼就知道。
          </p>
        </div>
        <Link style={S.btn} href={`/${cat.slug}`}>去{cat.zh}</Link>
      </div>

      {others.length > 0 && (
        <>
          <p style={S.lbl}>{ok ? "同一類的其他款" : "同一類可以買的"}</p>
          <div style={{ display: "grid", gap: 10 }}>
            {others.map((x) => (
              <Link key={x.id} href={productHref(x)} style={otherRow}>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{x.brand}</span>
                <span style={{ display: "block", fontSize: 15.5, fontWeight: 700, lineHeight: 1.5 }}>{x.name}</span>
                <span style={{ display: "block", fontSize: 13, color: "var(--faint)", marginTop: 2 }}>
                  {stageOf(x)}{meatsOf(x) ? ` · 肉：${meatsOf(x)}` : ""}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function sameStage(a: Product, b: Product): boolean {
  const s = (x: Product) => x.spec.lifeStage;
  return s(a).includes("all") || s(b).includes("all") || s(a).some((k) => s(b).includes(k));
}

const tags: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: 6 };
const tag: React.CSSProperties = {
  fontSize: 13, padding: "4px 11px", borderRadius: 999,
  background: "var(--sunken)", border: "1px solid var(--line)", color: "var(--muted)",
};
const good: React.CSSProperties = { background: "var(--keep-soft)", borderColor: "var(--keep)", color: "var(--keep)" };
const warn: React.CSSProperties = { background: "var(--warn-soft)", borderColor: "var(--warn)", color: "var(--ink)" };
const statusBox: React.CSSProperties = {
  marginTop: 18, background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 14, padding: "18px 20px",
};
const mismatchBox: React.CSSProperties = {
  display: "block", marginTop: 14, background: "var(--cut-soft)", border: "1px solid var(--cut)",
  borderRadius: 14, padding: "14px 18px", textDecoration: "none", color: "inherit",
};
const otherRow: React.CSSProperties = {
  display: "block", background: "var(--surface)", border: "1px solid var(--line)",
  borderRadius: 12, padding: "12px 16px", textDecoration: "none", color: "inherit",
};
