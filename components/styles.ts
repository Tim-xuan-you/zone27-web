import type { CSSProperties } from "react";

/**
 * 共用樣式。決策器（client）和程序化決策頁（server）共用同一套 ——
 * 使用者從搜尋進來看到的，要跟他自己輸入得到的是同一個東西。
 *
 * 設計紀律（這些是規則，不是偏好）：
 *
 * 1. 手機優先。九成使用者在手機上，桌機是附加。
 *    卡片一律直向堆疊，不用會在窄螢幕擠爆的多欄 flex。
 *
 * 2. 字級只有五階。「什麼都差一點點」等於沒有層次。
 *
 * 3. 間距只用 4 的倍數。間距亂掉是「還沒做完」最明顯的徵兆。
 *
 * 4. 顏色只有三種用途：內容、語意（好／壞／注意）、強調。
 *    不為了好看而上色。
 */

const T = { xl: 22, lg: 16, md: 14, sm: 12.5, xs: 11 };
const G = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };

export const S: Record<string, CSSProperties> = {
  /* ---------- 區段標題 ---------- */
  lbl: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: T.xs, fontWeight: 600, letterSpacing: ".14em",
    textTransform: "uppercase", color: "var(--faint)",
    margin: `${G.xxl}px 0 ${G.md}px`,
  },

  /* ---------- 條件 chip ---------- */
  parsed: { display: "flex", flexWrap: "wrap", gap: G.sm },
  cons: {
    background: "var(--accent-soft)", color: "var(--accent)",
    borderRadius: 4, padding: "5px 10px", fontSize: T.sm, fontWeight: 600,
  },
  consNeg: {
    background: "var(--cut-soft)", color: "var(--cut)",
    borderRadius: 4, padding: "5px 10px", fontSize: T.sm, fontWeight: 600,
  },

  /* ---------- 裁決過程 ---------- */
  cascade: {
    background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: 10, boxShadow: "var(--sh)", padding: G.xl,
  },
  cascTop: { display: "flex", alignItems: "baseline", gap: G.md, marginBottom: G.lg },
  bignum: { fontSize: 40, fontWeight: 600, lineHeight: 1, letterSpacing: "-.03em" },
  cascCap: { fontSize: T.md, color: "var(--muted)" },
  cutRow: {
    display: "flex", flexWrap: "wrap", alignItems: "baseline",
    gap: `${G.xs}px ${G.md}px`, padding: `${G.sm}px 0`,
    borderTop: "1px dashed var(--line)",
  },
  cutN: { fontWeight: 600, color: "var(--cut)", fontSize: T.md, whiteSpace: "nowrap" },
  cutWhy: {
    flex: 1, minWidth: "8em", fontSize: T.md, color: "var(--muted)",
    textDecoration: "line-through", textDecorationColor: "var(--cut)",
  },
  cutTag: {
    fontSize: T.xs, fontWeight: 600, background: "var(--cut-soft)",
    color: "var(--cut)", padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap",
  },
  keepRow: {
    display: "flex", alignItems: "baseline", gap: G.md,
    borderTop: "2px solid var(--ink)", marginTop: G.md, paddingTop: G.lg,
  },
  keepN: { fontSize: 26, fontWeight: 600, color: "var(--keep)" },

  /* ---------- 商品卡 ----------
     手機直向堆疊：徽章 → 品牌 → 品名 → 價格 → 規格。
     原本用三欄 flex，窄螢幕會把品名擠成四行還撞到價格。 */
  card: {
    background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: 10, boxShadow: "var(--sh)", overflow: "hidden",
  },
  cardPick: { borderColor: "var(--keep)", borderWidth: 1.5 },
  cardH: {
    display: "block", width: "100%", textAlign: "left",
    padding: `${G.lg}px ${G.lg}px ${G.md}px`,
    background: "none", border: 0, color: "inherit", cursor: "pointer",
  },
  rankRow: { display: "flex", alignItems: "center", gap: G.sm, marginBottom: G.sm },
  rank: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: T.xs, fontWeight: 600, color: "var(--faint)", minWidth: "1.6em",
  },
  badgeBest: {
    fontSize: T.xs, fontWeight: 700, letterSpacing: ".08em",
    padding: "3px 8px", borderRadius: 3,
    background: "var(--keep-soft)", color: "var(--keep)",
  },
  brand: { display: "block", fontSize: T.sm, color: "var(--muted)", marginBottom: 2 },
  pname: {
    display: "block", fontSize: T.lg, fontWeight: 700,
    lineHeight: 1.4, textWrap: "balance", margin: 0,
  },
  priceRow: {
    display: "flex", alignItems: "baseline", flexWrap: "wrap",
    gap: `${G.xs}px ${G.md}px`, marginTop: G.md,
  },
  price: { fontSize: 20, fontWeight: 700, letterSpacing: "-.02em" },
  perKg: { fontSize: T.md, fontWeight: 600, color: "var(--accent)" },
  checked: { fontSize: T.xs, color: "var(--faint)" },
  specRow: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: G.md },
  spec: {
    fontSize: T.sm, color: "var(--muted)",
    background: "var(--sunken)", borderRadius: 4, padding: "3px 8px",
  },
  specGood: {
    fontSize: T.sm, fontWeight: 600, color: "var(--keep)",
    background: "var(--keep-soft)", borderRadius: 4, padding: "3px 8px",
  },

  /* ---------- 紅線 ---------- */
  deal: {
    display: "flex", gap: G.sm, alignItems: "flex-start",
    background: "var(--cut-soft)", color: "var(--cut)",
    padding: `${G.md}px ${G.lg}px`, fontSize: T.sm, fontWeight: 600, lineHeight: 1.6,
  },

  /* ---------- 展開區 ---------- */
  drawer: {
    borderTop: "1px solid var(--line)", padding: G.lg, background: "var(--raise)",
    display: "flex", flexDirection: "column", gap: G.md,
  },
  why: { margin: 0, fontSize: T.md, color: "var(--muted)", lineHeight: 1.7 },

  /* ---------- 賣場 ---------- */
  store: {
    border: "1px solid var(--line)", borderRadius: 8,
    padding: `${G.md}px ${G.lg}px ${G.lg}px`, background: "var(--surface)",
  },
  storeHead: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: G.md, marginBottom: G.sm, flexWrap: "wrap",
  },
  storeName: { fontSize: T.md, fontWeight: 700 },

  /* 規格表。每一格都要有左右間距 —— 價格跟每公斤黏在一起就是漏了這個。 */
  optTable: { width: "100%", borderCollapse: "collapse", fontSize: T.sm },
  optUnit: {
    padding: `${G.sm}px ${G.md}px ${G.sm}px 0`, color: "var(--ink)",
    fontWeight: 600, whiteSpace: "nowrap",
    borderTop: "1px solid var(--line)", verticalAlign: "top",
  },
  dur: { display: "block", fontSize: T.xs, fontWeight: 400, marginTop: 2 },
  optAmt: {
    padding: `${G.sm}px ${G.md}px`, textAlign: "right", fontWeight: 600,
    whiteSpace: "nowrap", borderTop: "1px solid var(--line)", verticalAlign: "top",
  },
  optKg: {
    padding: `${G.sm}px ${G.md}px`, color: "var(--accent)", fontWeight: 600,
    whiteSpace: "nowrap", borderTop: "1px solid var(--line)", verticalAlign: "top",
  },
  optSave: {
    padding: `${G.sm}px 0`, fontSize: T.xs, whiteSpace: "nowrap",
    textAlign: "right", borderTop: "1px solid var(--line)", verticalAlign: "top",
  },
  storeNote: { margin: `${G.md}px 0 0`, fontSize: T.sm, color: "var(--muted)", lineHeight: 1.6 },

  /* ---------- 按鈕 ---------- */
  btn: {
    border: "1px solid var(--accent)", background: "var(--accent)",
    color: "var(--accent-ink)", borderRadius: 6, padding: "8px 16px",
    fontSize: T.md, fontWeight: 700, cursor: "pointer",
    whiteSpace: "nowrap", textDecoration: "none",
  },
  btnSmall: {
    border: "1px solid var(--accent)", background: "transparent",
    color: "var(--accent)", borderRadius: 5, padding: "4px 12px",
    fontSize: T.sm, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
  },

  /* ---------- 提示區塊 ---------- */
  freshWarn: {
    background: "var(--warn-soft)", color: "var(--warn)", borderRadius: 6,
    padding: G.md, fontSize: T.sm, lineHeight: 1.7, margin: `${G.md}px 0 0`,
  },
  variantWarn: {
    background: "var(--warn-soft)", color: "var(--warn)",
    border: "1px solid var(--warn)", borderRadius: 6,
    padding: G.md, fontSize: T.sm, lineHeight: 1.7, margin: 0,
  },
  reports: { margin: 0, fontSize: T.sm, color: "var(--faint)", lineHeight: 1.7 },
  emptyBox: {
    background: "var(--warn-soft)", border: "1px solid var(--warn)",
    borderRadius: 8, padding: G.lg, margin: `${G.lg}px 0`,
  },

  /* ---------- 收單 ---------- */
  landing: {
    background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: 10, boxShadow: "var(--sh)", padding: G.xl,
    display: "flex", gap: G.lg, alignItems: "center",
    flexWrap: "wrap", justifyContent: "space-between",
  },

  /* ---------- 相關連結 ---------- */
  relRow: { display: "flex", flexWrap: "wrap", gap: G.sm },
  relLink: {
    border: "1px solid var(--line)", background: "var(--surface)",
    color: "var(--muted)", borderRadius: 99, padding: "6px 14px",
    fontSize: T.sm, textDecoration: "none",
  },
};
