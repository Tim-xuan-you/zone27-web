import { G, R, T } from "@/components/styles";

/**
 * 給家長的四件事：每一張學習單都做到的。首頁、學習單首頁共用，寫一次就好。
 * 只寫做得到、看得到的事，不寫「激發潛能」這種講不清楚的話（2026-10-01 跟 Tim 討論過）。
 */
const ITEMS = [
  ["說明都有注音", "孩子自己讀得懂規則，不用每一句都等大人唸。"],
  ["不用寫國字", "畫路線、圈起來、寫注音，就是不用寫國字。我家孩子以前最常卡在寫不出字，就整題放棄。"],
  ["卡住有提示", "掃學習單右下角的 QR code。迷宮的提示一次只開一段，看完讓孩子接著自己畫。"],
  ["每題只有一個答案", "迷宮用程式把所有走法算過一遍，注音一個一個跟教育部國語辭典對過。兩個答案都對的題目，一題都不會出現。"],
] as const;

/** 一個框、一件一行（2026-10-01 手機上四張卡片太長，首頁超過兩個畫面） */
export default function Promises() {
  return (
    <div style={box}>
      {ITEMS.map(([t, d], i) => (
        <div key={t} style={{ display: "flex", gap: G.md, padding: `${G.md}px 0`, borderTop: i ? "1px solid var(--line)" : 0 }}>
          <span style={num}>{i + 1}</span>
          <span style={{ minWidth: 0 }}>
            <span style={{ display: "block", fontWeight: 700, fontSize: T.md }}>{t}</span>
            <span style={{ display: "block", fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8 }}>{d}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

const box: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--line)", borderRadius: R.md, padding: `${G.xs}px ${G.lg + 2}px`,
};
const num: React.CSSProperties = {
  display: "inline-grid", placeItems: "center", width: 26, height: 26, borderRadius: R.pill, flex: "none", marginTop: 2,
  background: "var(--pop-soft)", color: "var(--pop)", fontWeight: 800, fontSize: T.sm,
};
