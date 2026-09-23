import Link from "next/link";

/**
 * 「先看這個」「我們自己讀成分表」那種文章入口，排成一張目錄。
 *
 * 2026-09-24 Tim：「有些頁面好長好長，怎麼划都划不到底。」
 * 量過：狗飼料頁光是五張文章卡就佔掉 1,100px，每一張都是一個有陰影的大框、一段兩三行的說明。
 * 手機上滑過去，讀者看到的是一個接一個長得一樣的框，不知道還有多少。
 *
 * 改成同一個框裡一行一篇：標題加一行短說明，像書的目錄。
 * 一眼看得到總共幾篇，想看哪篇點哪篇。說明留一行，只講「點進去會知道什麼」。
 */
export default function ReadList({ items, style }: {
  items: { href: string; title: string; line?: React.ReactNode; kicker?: string }[];
  style?: React.CSSProperties;
}) {
  return (
    <div style={{ ...wrap, ...style }}>
      {items.map((x, i) => (
        <Link key={x.href} href={x.href} style={{ ...row, borderTop: i ? "1px solid var(--line)" : 0 }}>
          <span style={{ flex: 1, minWidth: 0 }}>
            {x.kicker && <span style={kicker}>{x.kicker}</span>}
            <span style={title}>{x.title}</span>
            {x.line && <span style={line}>{x.line}</span>}
          </span>
          <span aria-hidden style={arrow}>›</span>
        </Link>
      ))}
    </div>
  );
}

const wrap: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 14, overflow: "hidden",
};
const row: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
  textDecoration: "none", color: "inherit",
};
const kicker: React.CSSProperties = {
  display: "block", fontSize: 12.5, fontWeight: 600, color: "var(--faint)", marginBottom: 2,
};
const title: React.CSSProperties = {
  display: "block", fontSize: 17, fontWeight: 700, lineHeight: 1.5,
};
const line: React.CSSProperties = {
  display: "block", fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginTop: 2,
};
const arrow: React.CSSProperties = { fontSize: 20, color: "var(--faint)", flex: "none" };
