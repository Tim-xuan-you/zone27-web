import Link from "next/link";
import { checkItems, checkStats } from "@/lib/check";
import type { Species } from "@/lib/types";

const ITEMS = checkItems();
const ALL = checkStats(ITEMS);
const BY: Record<Species, ReturnType<typeof checkStats>> = {
  dog: checkStats(ITEMS.filter((x) => x.species === "dog")),
  cat: checkStats(ITEMS.filter((x) => x.species === "cat")),
};

/**
 * 「你家那包有沒有藏雞」的入口小卡。首頁以外的類目頁、商品頁共用。
 * 數字從資料算：讀的款數一變，這裡跟著變。
 *
 * 2026-09-24 Tim：「點狗，就是只有養狗的人呀！貓的任何相關東西都不用出現吧？」
 * 所以在狗的頁面只算狗的、點進去只看狗的（/check?sp=dog）；貓也一樣。
 * 沒給 species 的（首頁）才是狗貓一起。
 */
export default function CheckCard({ style, species }: { style?: React.CSSProperties; species?: Species }) {
  const st = species ? BY[species] : ALL;
  const who = species === "dog" ? "狗的" : species === "cat" ? "貓的" : "";
  return (
    <Link href={species ? `/check?sp=${species}` : "/check"} style={{ ...card, ...style }}>
      <span style={kicker}>查成分</span>
      <span style={title}>你家那包，有沒有藏雞？</span>
      <span style={body}>
        {who}名字沒寫雞的 {st.unnamed} 款，有 <b style={{ color: "var(--cut)" }}>{st.hidden} 款</b>成分表裡有雞。打名字就查得到。
      </span>
      <span style={more}>打名字查 →</span>
    </Link>
  );
}

const card: React.CSSProperties = {
  display: "block", background: "var(--surface)", border: "1px solid var(--line)", borderLeft: "4px solid var(--cut)",
  borderRadius: 14, boxShadow: "var(--sh)", padding: "18px 22px", textDecoration: "none", color: "inherit",
};
const kicker: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 12.5, fontWeight: 600, letterSpacing: ".14em", color: "var(--cut)",
};
const title: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-serif), serif", fontSize: 20, fontWeight: 700, margin: "6px 0 6px", lineHeight: 1.5,
};
const body: React.CSSProperties = { display: "block", fontSize: 15.5, color: "var(--muted)", lineHeight: 1.85 };
const more: React.CSSProperties = { display: "inline-block", marginTop: 8, fontWeight: 700, color: "var(--accent)" };
