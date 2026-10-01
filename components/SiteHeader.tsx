import Link from "next/link";
import {
  ANIMALS, animalHref, categoriesOf, categoryBySlug, type CategorySlug,
} from "@/lib/categories";
import type { Species } from "@/lib/types";
import { Squirrel } from "@/components/worksheets/Mascot";

/**
 * 全站頁首。
 *
 * 2026-10-01 網站改成孩子的學習單網站（Tim 決定）。頁首只剩兩個：學習單、關於我們。
 * 以前的狗、貓、充電器、行動電源沒有刪，頁面都還在、搜尋引擎也還找得到，
 * 只是不放在頁首。從 Google 直接點進那些頁面的人，頁首下面會多一排「其他分類」，
 * 讓他在那幾區之間走得到，不會迷路。
 *
 * logo 換成小松鼠：學習單上的那一隻，家長在紙上、在網站上看到的是同一個角色。
 */

type Legacy = CategorySlug | Species | "charger" | "power-bank" | "how-we-choose" | "ask" | "check";
type Current = Legacy | "worksheets" | "about";

const KIDS = new Set<Current>(["worksheets", "about"]);

export default function SiteHeader({ current }: { current?: Current }) {
  const legacy = current !== undefined && !KIDS.has(current);
  // 以前的分類：現在在哪一個動物底下
  const cat = current ? categoryBySlug(current) : undefined;
  const species: Species | undefined =
    cat?.species ?? (current === "dog" || current === "cat" ? current : undefined);
  const subs = species ? categoriesOf(species) : [];

  const items = [
    { href: "/worksheets", label: "學習單", on: current === "worksheets" },
    { href: "/about", label: "關於我們", on: current === "about" },
  ];
  const old = [
    ...ANIMALS.map((a) => ({ href: animalHref(a.species), label: a.zh, on: species === a.species })),
    { href: "/charger", label: "充電器", on: current === "charger" },
    { href: "/power-bank", label: "行動電源", on: current === "power-bank" },
    { href: "/how-we-choose", label: "我們怎麼挑", on: current === "how-we-choose" },
  ];

  return (
    <header style={{ marginBottom: 36 }}>
      <div style={bar}>
        <Link href="/" style={logo} aria-label="ZONE 27 首頁">
          <Squirrel size={38} />
          <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.25 }}>
            <span>ZONE 27</span>
            <span style={tagline}>陪孩子動腦的學習單</span>
          </span>
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

      {legacy && (
        <nav aria-label="其他分類" style={oldBar}>
          <span style={{ color: "var(--faint)" }}>其他分類</span>
          {old.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              aria-current={it.on ? "page" : undefined}
              style={it.on ? { ...oldLink, color: "var(--ink)", fontWeight: 700 } : oldLink}
            >
              {it.label}
            </Link>
          ))}
        </nav>
      )}

      {legacy && subs.length > 1 && (
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
  gap: "10px 14px", padding: "22px 0 18px", borderBottom: "1px solid var(--line)",
};
const logo: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10, fontWeight: 900, fontSize: 17,
  color: "inherit", textDecoration: "none", whiteSpace: "nowrap",
};
const tagline: React.CSSProperties = { fontSize: 12.5, fontWeight: 600, color: "var(--muted)", letterSpacing: ".04em" };
const nav: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "6px 20px", fontSize: 15.5,
};
const link: React.CSSProperties = { color: "var(--muted)", textDecoration: "none", whiteSpace: "nowrap" };

const oldBar: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 14px", padding: "10px 0 0", fontSize: 14,
};
const oldLink: React.CSSProperties = { color: "var(--muted)", textDecoration: "none", whiteSpace: "nowrap" };

const subBar: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 0 0",
};
const pill: React.CSSProperties = {
  fontSize: 14, padding: "5px 14px", borderRadius: 999, textDecoration: "none", whiteSpace: "nowrap",
  color: "var(--muted)", background: "var(--sunken)", border: "1px solid var(--line)",
};
const pillOn: React.CSSProperties = {
  color: "var(--ink)", background: "var(--surface)", fontWeight: 700, boxShadow: "var(--sh)",
};
