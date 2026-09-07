import type { CSSProperties } from "react";

/**
 * 共用樣式。決策器（client）和程序化決策頁（server）共用同一套，
 * 兩邊長得一樣是刻意的 —— 使用者從搜尋結果進來看到的，
 * 要跟他自己輸入得到的是同一個東西。
 */
export const S: Record<string, CSSProperties> = {
  lbl: { fontFamily: "var(--font-mono), monospace", fontSize: 10.5, fontWeight: 600, letterSpacing: ".14em", color: "var(--faint)", margin: "34px 0 10px", textTransform: "uppercase" },
  parsed: { display: "flex", flexWrap: "wrap", gap: 7 },
  cons: { background: "var(--accent-soft)", color: "var(--accent)", borderRadius: 4, padding: "5px 11px", fontSize: 12.5, fontWeight: 600 },
  consNeg: { background: "var(--cut-soft)", color: "var(--cut)", borderRadius: 4, padding: "5px 11px", fontSize: 12.5, fontWeight: 600 },

  cascade: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--sh)", padding: "24px 24px 20px" },
  cascTop: { display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 },
  bignum: { fontSize: 46, fontWeight: 600, lineHeight: 1, letterSpacing: "-.03em" },
  cascCap: { fontSize: 13.5, color: "var(--muted)" },
  cutRow: { display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 12, alignItems: "baseline", padding: "9px 0", borderTop: "1px dashed var(--line)" },
  cutN: { fontWeight: 600, color: "var(--cut)", fontSize: 14, whiteSpace: "nowrap" },
  cutWhy: { fontSize: 14, color: "var(--muted)", textDecoration: "line-through", textDecorationColor: "var(--cut)" },
  cutTag: { fontSize: 10.5, fontWeight: 600, background: "var(--cut-soft)", color: "var(--cut)", padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap" },
  keepRow: { display: "flex", alignItems: "baseline", gap: 12, borderTop: "2px solid var(--ink)", marginTop: 12, paddingTop: 14 },
  keepN: { fontSize: 26, fontWeight: 600, color: "var(--keep)" },

  card: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--sh)", overflow: "hidden" },
  cardPick: { borderColor: "var(--keep)", borderWidth: 1.5 },
  cardH: { display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 18px", width: "100%", textAlign: "left", background: "none", border: 0, color: "inherit" },
  thumb: { width: 46, height: 46, borderRadius: 5, background: "var(--sunken)", flex: "none", display: "grid", placeItems: "center", fontSize: 21 },
  cardR1: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 },
  pname: { fontWeight: 700, fontSize: 15.5 },
  badgeBest: { fontSize: 10, fontWeight: 600, letterSpacing: ".09em", padding: "2.5px 7px", borderRadius: 3, background: "var(--keep-soft)", color: "var(--keep)" },
  specs: { display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12.5, color: "var(--muted)" },
  k: { color: "var(--faint)" },
  cardR: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flex: "none" },
  price: { fontWeight: 600, fontSize: 17 },
  // 每公斤單價 —— 不同規格唯一能比的數字，所以給它比查價日期更高的視覺權重
  perKg: { fontSize: 12, fontWeight: 600, color: "var(--accent)" },
  checked: { fontSize: 10.5, color: "var(--faint)" },
  deal: { display: "flex", gap: 9, alignItems: "flex-start", background: "var(--cut-soft)", color: "var(--cut)", padding: "9px 18px", fontSize: 12.5, fontWeight: 600, lineHeight: 1.5 },

  anch: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: "1px solid var(--line)", borderRadius: 6, padding: "12px 14px", background: "var(--surface)" },
  anchK: { display: "block", fontSize: 10, fontWeight: 600, letterSpacing: ".12em", color: "var(--faint)" },
  anchV: { display: "block", fontSize: 13.5, fontWeight: 600 },
  anchN: { display: "block", fontSize: 12, color: "var(--muted)" },
  btn: { border: "1px solid var(--accent)", background: "var(--accent)", color: "var(--accent-ink)", borderRadius: 5, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" },
  btnGhost: { border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", borderRadius: 5, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", textDecoration: "none" },

  emptyBox: { background: "var(--warn-soft)", border: "1px solid var(--warn)", borderRadius: 8, padding: "16px 18px", margin: "16px 0" },
  landing: { background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8, boxShadow: "var(--sh)", padding: "22px 24px", display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" },
  // 一頁多口味的警告 —— 風險真正發生的地方是「點進去之後」，所以貼著按鈕放
  store: { border: "1px solid var(--line)", borderRadius: 6, padding: "12px 14px", background: "var(--surface)" },
  storeHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 },
  storeName: { fontSize: 13.5, fontWeight: 700 },
  optTable: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  optUnit: { padding: "4px 0", color: "var(--muted)", whiteSpace: "nowrap" },
  // 可吃天數 —— 貼在規格底下，因為它跟「這包多大」是同一件事的兩面
  dur: { display: "block", fontSize: 10.5, fontWeight: 500, marginTop: 1 },
  optAmt: { padding: "4px 0", textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" },
  optKg: { padding: "4px 0 4px 14px", color: "var(--accent)", fontWeight: 600, whiteSpace: "nowrap" },
  optSave: { padding: "4px 0 4px 14px", color: "var(--keep)", fontSize: 12, whiteSpace: "nowrap", textAlign: "right" },
  btnSmall: { border: "1px solid var(--accent)", background: "transparent", color: "var(--accent)", borderRadius: 4, padding: "3px 10px", fontSize: 12, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap" },
  freshWarn: { background: "var(--warn-soft)", color: "var(--warn)", borderRadius: 5, padding: "9px 11px", fontSize: 12, lineHeight: 1.65, margin: "10px 0 0" },
  storeNote: { margin: "10px 0 0", fontSize: 12, color: "var(--muted)", lineHeight: 1.6 },
  variantWarn: { background: "var(--warn-soft)", color: "var(--warn)", border: "1px solid var(--warn)", borderRadius: 6, padding: "10px 12px", fontSize: 12.5, lineHeight: 1.6, marginTop: 12 },
  reports: { fontSize: 12, color: "var(--faint)", marginTop: 12, paddingTop: 11, borderTop: "1px dashed var(--line)" },
  why: { margin: "0 0 14px", fontSize: 13.5, color: "var(--muted)" },
  drawer: { borderTop: "1px solid var(--line)", padding: 18, background: "var(--raise)" },

  relRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  relLink: { border: "1px solid var(--line)", background: "var(--surface)", color: "var(--muted)", borderRadius: 99, padding: "6px 14px", fontSize: 13, textDecoration: "none" },
};
