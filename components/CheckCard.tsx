import Link from "next/link";
import { checkItems, checkStats } from "@/lib/check";

const ST = checkStats(checkItems());

/**
 * 「你家那包有沒有藏雞」的入口小卡。首頁以外的類目頁、商品頁共用。
 * 數字從資料算：讀的款數一變，這裡跟著變。
 */
export default function CheckCard({ style }: { style?: React.CSSProperties }) {
  return (
    <Link href="/check" style={{ ...card, ...style }}>
      <span style={kicker}>查成分</span>
      <span style={title}>你家那包，有沒有藏雞？</span>
      <span style={body}>
        名字沒寫雞的 {ST.unnamed} 款，有 <b style={{ color: "var(--cut)" }}>{ST.hidden} 款</b>成分表裡有雞。打名字就查得到。
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
  display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 12, fontWeight: 600, letterSpacing: ".14em", color: "var(--cut)",
};
const title: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-serif), serif", fontSize: 20, fontWeight: 700, margin: "6px 0 6px", lineHeight: 1.5,
};
const body: React.CSSProperties = { display: "block", fontSize: 15, color: "var(--muted)", lineHeight: 1.85 };
const more: React.CSSProperties = { display: "inline-block", marginTop: 8, fontWeight: 700, color: "var(--accent)" };
