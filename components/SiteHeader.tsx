import Link from "next/link";
import {
  ANIMALS, animalHref, categoriesOf, categoryBySlug, type CategorySlug,
} from "@/lib/categories";
import type { Species } from "@/lib/types";

/**
 * 全站頁首。
 *
 * 以前每一頁各寫一份，導覽列掛的是狗飼料的四篇文章。
 * 有了第二個類目之後那排字就塞不下了，而且貓飼料的讀者點進來，
 * 看到「成分表裡有雞」「排除飲食法」會以為走錯站。
 *
 * 所以頂層只放「狗」「貓」，類目收進第二排。
 * 類目會一直加（貓乾糧、貓罐頭，以後可能有貓砂、零食），
 * 導覽列要是每加一個類目就多一個字，到第五個類目手機上就斷成三行。
 * 先分動物、再分類目，這一排永遠是四個字加兩個連結。
 *
 * 第二排只有在那個動物有兩個以上的類目時才出現。
 */

type Current = CategorySlug | Species | "how-we-choose" | "ask";

export default function SiteHeader({ current }: { current?: Current }) {
  // 現在在哪一個動物底下：類目頁算那個類目的動物，動物頁算自己
  const cat = current ? categoryBySlug(current) : undefined;
  const species: Species | undefined =
    cat?.species ?? (current === "dog" || current === "cat" ? current : undefined);
  const subs = species ? categoriesOf(species) : [];

  const items: { href: string; label: string; on: boolean }[] = [
    ...ANIMALS.map((a) => ({ href: animalHref(a.species), label: a.zh, on: species === a.species })),
    { href: "/how-we-choose", label: "我們怎麼挑", on: current === "how-we-choose" },
    { href: "/ask", label: "問我們", on: current === "ask" },
  ];

  return (
    <header style={{ marginBottom: 40 }}>
      <div style={bar}>
        <Link href="/" style={logo}>
          <span style={dot} />
          ZONE 27
        </Link>
        <nav aria-label="主選單" style={nav}>
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              aria-current={it.on ? "page" : undefined}
              style={it.on ? { ...link, color: "var(--ink)", fontWeight: 700 } : link}
            >
              {it.label}
            </Link>
          ))}
        </nav>
      </div>

      {subs.length > 1 && (
        <nav aria-label={`${ANIMALS.find((a) => a.species === species)?.zh}的類目`} style={subBar}>
          {subs.map((c) => {
            const on = cat?.slug === c.slug;
            return (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                aria-current={on ? "page" : undefined}
                style={on ? { ...pill, ...pillOn } : pill}
              >
                {c.zh}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

const bar: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
  gap: "10px 14px", padding: "28px 0 20px", borderBottom: "1px solid var(--line)",
};
const logo: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16,
  color: "inherit", textDecoration: "none", whiteSpace: "nowrap",
};
const dot: React.CSSProperties = { width: 9, height: 9, borderRadius: 2, background: "var(--accent)" };
const nav: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "6px 18px",
  fontSize: 14, color: "var(--muted)",
};
const link: React.CSSProperties = { color: "var(--muted)", textDecoration: "none", whiteSpace: "nowrap" };

const subBar: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 0 0",
};
const pill: React.CSSProperties = {
  fontSize: 13.5, padding: "5px 14px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap",
  color: "var(--muted)", background: "var(--sunken)", border: "1px solid var(--line)",
};
const pillOn: React.CSSProperties = {
  color: "var(--ink)", background: "var(--surface)", fontWeight: 700, boxShadow: "var(--sh)",
};
