import Link from "next/link";
import { CATEGORIES, type CategorySlug } from "@/lib/categories";

/**
 * 全站頁首。
 *
 * 以前每一頁各寫一份，導覽列掛的是狗飼料的四篇文章。
 * 有了第二個類目之後那排字就塞不下了，而且貓飼料的讀者點進來，
 * 看到「成分表裡有雞」「排除飲食法」會以為走錯站。
 *
 * 所以頂層只放類目，文章收進各自的類目頁。
 * 這也是 PCPartPicker、RTINGS 的做法：先選「哪一類」，再進去找。
 */

type Current = CategorySlug | "how-we-choose" | "ask";

export default function SiteHeader({ current }: { current?: Current }) {
  const items: { href: string; label: string; key: Current }[] = [
    ...CATEGORIES.map((c) => ({ href: `/${c.slug}`, label: c.zh, key: c.slug as Current })),
    { href: "/how-we-choose", label: "我們怎麼挑", key: "how-we-choose" },
    { href: "/ask", label: "問我們", key: "ask" },
  ];

  return (
    <header style={bar}>
      <Link href="/" style={logo}>
        <span style={dot} />
        ZONE 27
      </Link>
      <nav aria-label="主選單" style={nav}>
        {items.map((it) => {
          const on = current === it.key;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={on ? "page" : undefined}
              style={on ? { ...link, color: "var(--ink)", fontWeight: 700 } : link}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}

const bar: React.CSSProperties = {
  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
  gap: "10px 14px", padding: "28px 0 20px", borderBottom: "1px solid var(--line)", marginBottom: 40,
};
const logo: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 9, fontWeight: 900, fontSize: 16,
  color: "inherit", textDecoration: "none", whiteSpace: "nowrap",
};
const dot: React.CSSProperties = { width: 9, height: 9, borderRadius: 2, background: "var(--accent)" };
const nav: React.CSSProperties = {
  display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "6px 16px",
  fontSize: 13, color: "var(--muted)",
};
const link: React.CSSProperties = { color: "var(--muted)", textDecoration: "none", whiteSpace: "nowrap" };
