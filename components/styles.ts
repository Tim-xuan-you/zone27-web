import type { CSSProperties } from "react";

/**
 * 共用樣式 · v2
 *
 * v1 走暗色儀表板美學，Tim 的回饋是「擠、沒有美感、不討喜」——
 * 他是對的。那套美學適合 3C 和開發者工具，不適合擔心狗一直抓癢的飼主。
 *
 * v2 的紀律：
 *
 * 1. 留白比密度重要。 這裡沒有人要在一屏內看完所有東西，
 *    他要的是「有人幫我想過」的感覺。
 *
 * 2. 一行一件事。 價格、每公斤、規格、日期擠在同一行看起來像亂碼，
 *    分開放才讀得懂。
 *
 * 3. 字級五階，間距只用 4 的倍數。
 *
 * 4. 顏色只有三種用途：內容、語意（好／壞／注意）、強調。
 */

/**
 * 字級、間距、圓角。**一定要 export。**
 *
 * 這三行以前是檔案私有的，結果新做的頁面（貓砂、貓零食）各自在檔尾
 * 重寫一份 box / lbl / row，數字全靠手抄。全站就長出 14、14.5、15、15.5
 * 四種內文字級，圓角六種。單看每一頁都整齊，放在一起就是四套系統。
 *
 * 拿不到的東西沒有人會用。所以規則很簡單：**新頁面不自己定數字，只從這裡拿。**
 * npm run ui:check 會把沒照做的地方列出來。
 */
export const T = { h1: 28, h2: 22, xxl: 26, xl: 20, lg: 17, md: 15.5, sm: 14, xs: 12.5 };
export const G = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, huge: 48 };
/** 圓角只有三階：小標籤、卡片、藥丸。中間值不要再發明了 */
export const R = { sm: 8, md: 14, pill: 999 };

export const S: Record<string, CSSProperties> = {
  /* ---------- 版面骨架：每一頁最外層都長一樣 ---------- */
  page: { maxWidth: 720, margin: "0 auto", padding: "0 20px 120px" },
  /** 比較寬的版型（有表格、有卡片牆的頁） */
  pageWide: { maxWidth: 760, margin: "0 auto", padding: "0 20px 120px" },

  /* ---------- 方塊：整站只有這一種 ---------- */
  box: {
    background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: R.md, padding: `${G.lg + 2}px ${G.xl - 4}px`,
  },

  /* ---------- 小標籤（材質、型態那種） ---------- */
  tag: {
    fontSize: T.xs, color: "var(--muted)", background: "var(--sunken)",
    borderRadius: R.sm, padding: "5px 10px", whiteSpace: "nowrap",
  },

  /* ---------- 主按鈕：去賣場的那一顆 ---------- */
  buy: {
    display: "inline-block", padding: "13px 28px", borderRadius: R.pill,
    background: "var(--accent)", color: "var(--accent-ink)",
    fontWeight: 700, fontSize: 16, textDecoration: "none",
  },

  /* ---------- 清單列：左邊內容、右邊數字 ---------- */
  listRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: G.md,
    padding: `${G.md + 2}px 0`, borderBottom: "1px solid var(--line)",
    textDecoration: "none", color: "inherit",
  },
  /** 同一款的別家賣場，線在上面，跟清單列區分開 */
  storeRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: G.md,
    padding: `${G.md}px 0`, borderTop: "1px solid var(--line)",
    textDecoration: "none", color: "inherit", fontSize: T.sm + 1,
  },

  /* ---------- 大數字（價格） ---------- */
  priceBig: { margin: `0 0 ${G.sm - 2}px`, fontSize: 28, fontWeight: 800 },
  priceUnit: { fontSize: T.sm + 0.5, color: "var(--muted)", fontWeight: 500, marginLeft: 10 },

  /* ---------- 註腳 ---------- */
  foot: {
    marginTop: G.huge + 12, paddingTop: G.xl, borderTop: "1px solid var(--line)",
    fontSize: T.sm, color: "var(--faint)", lineHeight: 1.9,
  },

  /* ---------- 區段標題 ---------- */
  lbl: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: T.xs, fontWeight: 600, letterSpacing: ".16em",
    textTransform: "uppercase", color: "var(--faint)",
    margin: `${G.xxl}px 0 ${G.md}px`,
  },

  /* ---------- 輸入區（只有裁決器用，但放一起才不會分岔） ---------- */
  ask: {
    background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: 14, boxShadow: "var(--sh)", padding: 6,
    marginBottom: 12, display: "flex", gap: 6, alignItems: "flex-end",
  },
  ta: {
    flex: 1, border: 0, background: "transparent", color: "var(--ink)",
    resize: "none", font: "inherit", fontSize: 16, lineHeight: 1.7,
    padding: "16px 16px 12px", outline: "none",
  },
  go: {
    border: 0, borderRadius: 999, background: "var(--accent)",
    color: "var(--accent-ink)", fontWeight: 600, fontSize: 14,
    padding: "12px 24px", cursor: "pointer", margin: "0 6px 6px 0",
  },
  chipRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  example: {
    border: "1px solid var(--line)", background: "var(--surface)",
    color: "var(--muted)", borderRadius: 999, padding: "7px 16px",
    fontSize: 13.5, cursor: "pointer",
  },
  hint: { fontSize: 13, color: "var(--faint)", margin: "0 0 8px", lineHeight: 1.8 },
  stage: { marginTop: 8 },

  /* ---------- 條件 chip ---------- */
  parsed: { display: "flex", flexWrap: "wrap", gap: G.sm },
  cons: {
    background: "var(--accent-soft)", color: "var(--accent)",
    borderRadius: 999, padding: "6px 14px", fontSize: T.sm, fontWeight: 500,
  },
  consNeg: {
    background: "var(--cut-soft)", color: "var(--cut)",
    borderRadius: 999, padding: "6px 14px", fontSize: T.sm, fontWeight: 500,
  },

  /* 讀到但用不到的訊號。低調，但一定要看得見。 */
  unusedList: {
    listStyle: "none", margin: `${G.md}px 0 0`, padding: 0,
  },
  unusedItem: {
    fontSize: T.xs, color: "var(--faint)", lineHeight: 1.85,
    paddingLeft: G.lg, position: "relative",
  },

  /* ---------- 不回答 ----------
     刻意做得比商品卡更大、更空。這是整頁最重要的一句話。 */
  stopBox: {
    background: "var(--surface)", border: "2px solid var(--cut)",
    borderRadius: 14, boxShadow: "var(--sh)",
    padding: `${G.xl}px ${G.xl}px ${G.lg}px`,
  },
  stopMark: {
    margin: 0, color: "var(--cut)", fontSize: T.lg, fontWeight: 700, lineHeight: 1,
  },
  stopTitle: {
    fontFamily: "var(--font-serif), serif",
    fontSize: 22, lineHeight: 1.5, margin: `${G.sm}px 0 ${G.md}px`,
  },
  stopBody: { margin: 0, fontSize: T.md, lineHeight: 1.95 },
  stopNext: {
    margin: `${G.md}px 0 0`, fontSize: T.md, lineHeight: 1.95, color: "var(--muted)",
  },
  stopActions: {
    display: "flex", flexWrap: "wrap", gap: G.sm, marginTop: G.lg,
    paddingTop: G.lg, borderTop: "1px solid var(--line)",
  },

  /* 有商品可推，但有前提要先講 */
  noticeBar: {
    background: "var(--warn-soft)", border: "1px solid var(--warn)",
    borderRadius: 10, padding: `${G.md}px ${G.lg}px`,
    fontSize: T.sm, lineHeight: 1.85, margin: `0 0 ${G.lg}px`,
  },

  /* ---------- 裁決過程 ---------- */
  cascade: {
    background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: 14, boxShadow: "var(--sh)", padding: `${G.lg}px ${G.lg}px ${G.md}px`,
  },
  cascTop: { display: "flex", alignItems: "baseline", gap: G.sm, marginBottom: G.md },
  bignum: {
    fontFamily: "var(--font-serif), serif",
    fontSize: 30, fontWeight: 700, lineHeight: 1, letterSpacing: "-.03em",
  },
  cascCap: { fontSize: T.md, color: "var(--muted)" },
  cutRow: {
    display: "flex", flexWrap: "wrap", alignItems: "baseline",
    gap: `${G.xs}px ${G.md}px`, padding: `${G.sm}px 0`,
    borderTop: "1px solid var(--line)",
  },
  cutN: { fontWeight: 600, color: "var(--cut)", fontSize: T.md, whiteSpace: "nowrap", minWidth: "2.6em" },
  cutWhy: {
    flex: 1, minWidth: "9em", fontSize: T.md, color: "var(--muted)",
    textDecoration: "line-through", textDecorationColor: "var(--cut)",
    textDecorationThickness: 1,
  },
  cutTag: {
    fontSize: T.xs, background: "var(--cut-soft)", color: "var(--cut)",
    padding: "3px 10px", borderRadius: 999, whiteSpace: "nowrap",
  },
  keepRow: {
    display: "flex", alignItems: "baseline", gap: G.md,
    borderTop: "2px solid var(--ink)", marginTop: G.md, paddingTop: G.md,
  },
  keepN: {
    fontFamily: "var(--font-serif), serif",
    fontSize: 22, fontWeight: 700, color: "var(--keep)",
  },

  /* ---------- 主答案 ----------
     整個結果頁只有這一塊是「答案」，其餘都是備援。
     所以它有粗邊框、最大的字，而且獨佔一個區塊 ——
     使用者問「我該買哪個」，就該只看到一個。 */
  answer: {
    background: "var(--surface)",
    border: "2px solid var(--keep)",
    borderRadius: 16, boxShadow: "var(--sh-lift)", overflow: "hidden",
  },
  answerBody: { padding: G.xl },
  answerName: {
    display: "block", fontFamily: "var(--font-serif), serif",
    fontSize: 24, fontWeight: 700, lineHeight: 1.4, margin: `0 0 ${G.lg}px`,
  },
  answerWhy: {
    margin: `${G.lg}px 0 0`, fontSize: T.md, lineHeight: 1.9, color: "var(--muted)",
  },
  buyRow: { display: "flex", flexDirection: "column", gap: G.sm, marginTop: G.xl },
  btnBuy: {
    display: "block", textAlign: "center", border: 0,
    background: "var(--accent)", color: "var(--accent-ink)",
    borderRadius: 999, padding: "16px 24px",
    fontSize: T.lg, fontWeight: 700, textDecoration: "none",
  },
  buyNote: { fontSize: T.xs, color: "var(--faint)", textAlign: "center", lineHeight: 1.7 },

  /* ---------- 展開區（原生 details，不用 JS，SSG 也能用） ---------- */
  detailBlock: { borderTop: "1px solid var(--line)" },
  detailSummary: {
    padding: `${G.lg}px ${G.xl}px`, fontSize: T.sm,
    color: "var(--muted)", cursor: "pointer",
  },
  more: { marginTop: G.xl },
  moreSummary: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: G.md, padding: `${G.lg}px ${G.xl}px`,
    background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: 12, fontSize: T.md, cursor: "pointer",
  },
  moreHint: {
    fontSize: T.xs, color: "var(--accent)",
    border: "1px solid var(--line)", borderRadius: 999, padding: "4px 14px",
  },
  moreBody: { display: "flex", flexDirection: "column", gap: G.lg, marginTop: G.lg },

  /* ---------- 商品卡（備選用） ---------- */
  card: {
    background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: 14, boxShadow: "var(--sh)", overflow: "hidden",
  },
  cardPick: { borderColor: "var(--keep)", boxShadow: "var(--sh-lift)" },
  cardH: {
    display: "block", width: "100%", textAlign: "left",
    padding: `${G.xl}px ${G.xl}px ${G.lg}px`,
    background: "none", border: 0, color: "inherit", cursor: "pointer",
  },
  rankRow: { display: "flex", alignItems: "center", gap: G.md, marginBottom: G.md },
  rank: {
    fontFamily: "var(--font-mono), monospace",
    fontSize: T.xs, color: "var(--faint)", letterSpacing: ".08em",
  },
  badgeBest: {
    fontSize: T.xs, fontWeight: 600, letterSpacing: ".06em",
    padding: "4px 12px", borderRadius: 999,
    background: "var(--keep-soft)", color: "var(--keep)",
  },
  brand: {
    display: "block", fontSize: T.sm, color: "var(--muted)",
    letterSpacing: ".02em", marginBottom: G.xs,
  },
  pname: {
    display: "block", fontFamily: "var(--font-serif), serif",
    fontSize: T.xl, fontWeight: 700, lineHeight: 1.45,
    letterSpacing: "-.01em", margin: 0,
  },

  /* 價格自成一區。之前跟規格、日期擠在同一行，讀起來像亂碼。 */
  priceRow: {
    display: "flex", alignItems: "baseline", flexWrap: "wrap",
    gap: `${G.xs}px ${G.md}px`, marginTop: G.lg,
  },
  price: {
    fontFamily: "var(--font-serif), serif",
    fontSize: T.xxl, fontWeight: 700, letterSpacing: "-.02em", lineHeight: 1.2,
  },
  perKg: { fontSize: T.md, fontWeight: 500, color: "var(--accent)" },
  checked: {
    display: "block", width: "100%",
    fontSize: T.xs, color: "var(--faint)", marginTop: G.xs,
  },

  specRow: { display: "flex", flexWrap: "wrap", gap: G.sm, marginTop: G.lg },
  spec: {
    fontSize: T.sm, color: "var(--muted)",
    background: "var(--sunken)", borderRadius: 999, padding: "5px 12px",
  },
  specGood: {
    fontSize: T.sm, fontWeight: 500, color: "var(--keep)",
    background: "var(--keep-soft)", borderRadius: 999, padding: "5px 12px",
  },

  /* ---------- 紅線 ---------- */
  /* 原本寫成「✕ 不要買，如果：你的狗曾對羊肉起疹」——
     那是英文的 Don't buy if... 直翻，中文不這樣講條件句。
     Tim 的原話是「完全看不懂」。改成標題在上、條件在下的兩行。 */
  deal: {
    background: "var(--cut-soft)", color: "var(--cut)",
    padding: `${G.lg}px ${G.xl}px`,
  },
  dealHead: {
    margin: 0, fontSize: T.sm, fontWeight: 700, letterSpacing: ".02em",
  },
  dealBody: {
    margin: `${G.xs}px 0 0`, fontSize: T.sm, lineHeight: 1.85,
  },
  freshNote: {
    margin: `${G.sm}px 0 0`, fontSize: T.xs, color: "var(--faint)", lineHeight: 1.75,
  },

  /* ---------- 展開區 ---------- */
  drawer: {
    borderTop: "1px solid var(--line)", padding: G.xl, background: "var(--raise)",
    display: "flex", flexDirection: "column", gap: G.lg,
  },
  why: { margin: 0, fontSize: T.md, color: "var(--muted)", lineHeight: 1.9 },

  /* ---------- 賣場 ---------- */
  store: {
    border: "1px solid var(--line)", borderRadius: 12,
    padding: `${G.lg}px ${G.lg}px ${G.xl}px`, background: "var(--surface)",
  },
  storeHead: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: G.md, marginBottom: G.md, flexWrap: "wrap",
  },
  storeName: { fontSize: T.md, fontWeight: 700 },

  /* 規格列。
     原本用 4 欄表格，375px 上「每公斤省 X%」會被切到螢幕外 ——
     改成兩行的彈性列：第一行是規格與價格，第二行是天數與省幅。 */
  optList: { display: "flex", flexDirection: "column" },
  optRow: { padding: `${G.md}px 0`, borderTop: "1px solid var(--line)" },
  optMain: {
    display: "flex", alignItems: "baseline", gap: G.md, flexWrap: "wrap",
  },
  optUnit: { fontSize: T.md, fontWeight: 600, minWidth: "4.5em" },
  optAmt: { fontSize: T.md, fontWeight: 600, marginLeft: "auto" },
  optKg: { fontSize: T.sm, color: "var(--accent)", fontWeight: 500, minWidth: "5.5em", textAlign: "right" },
  optMeta: {
    display: "flex", alignItems: "center", gap: G.md, flexWrap: "wrap",
    marginTop: G.xs, fontSize: T.xs, lineHeight: 1.7,
  },
  storeNote: {
    margin: `${G.lg}px 0 0`, fontSize: T.sm, color: "var(--muted)", lineHeight: 1.8,
  },

  /* ---------- 佣金稽核表 ----------
     Tim 截圖裡最擠的就是這一段：長品名 + 右側百分比，中間什麼都沒有。
     加上列分隔線與足夠的行高，並讓品名可以換行。 */
  auditTable: { width: "100%", borderCollapse: "collapse", fontSize: T.sm },
  auditName: {
    padding: `${G.md}px ${G.lg}px ${G.md}px 0`,
    borderTop: "1px solid var(--line)", lineHeight: 1.7,
  },
  auditRate: {
    padding: `${G.md}px 0`, textAlign: "right", whiteSpace: "nowrap",
    fontWeight: 600, borderTop: "1px solid var(--line)", verticalAlign: "top",
  },

  /* ---------- 驗證列 ---------- */
  verifyBar: {
    display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
    background: "none", border: 0, padding: 0, color: "var(--muted)",
    fontSize: 13.5, cursor: "pointer", textAlign: "left",
  },
  verifyTag: {
    fontSize: 12, fontWeight: 600, letterSpacing: ".06em", color: "var(--accent)",
    border: "1px solid var(--line)", borderRadius: 999, padding: "3px 12px",
  },

  /* ---------- 按鈕 ---------- */
  btn: {
    display: "inline-block",
    border: "1px solid var(--accent)", background: "var(--accent)",
    color: "var(--accent-ink)", borderRadius: 999, padding: "10px 22px",
    fontSize: T.sm, fontWeight: 600, cursor: "pointer",
    whiteSpace: "nowrap", textDecoration: "none",
  },
  btnSmall: {
    display: "inline-block",
    border: "1px solid var(--rule)", background: "transparent",
    color: "var(--accent)", borderRadius: 999, padding: "5px 14px",
    fontSize: T.xs, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
  },

  /* ---------- 提示區塊 ---------- */
  freshWarn: {
    background: "var(--warn-soft)", color: "var(--warn)", borderRadius: 10,
    padding: G.lg, fontSize: T.sm, lineHeight: 1.9, margin: `${G.lg}px 0 0`,
  },
  variantWarn: {
    background: "var(--warn-soft)", color: "var(--warn)", borderRadius: 10,
    padding: G.lg, fontSize: T.sm, lineHeight: 1.9, margin: 0,
  },
  reports: { margin: 0, fontSize: T.sm, color: "var(--faint)", lineHeight: 1.9 },
  emptyBox: {
    background: "var(--warn-soft)", border: "1px solid var(--warn)",
    borderRadius: 12, padding: G.xl, margin: `${G.lg}px 0`,
  },

  /* ---------- 收單 ---------- */
  landing: {
    background: "var(--surface)", border: "1px solid var(--line)",
    borderRadius: 14, boxShadow: "var(--sh)", padding: G.xl,
    display: "flex", gap: G.lg, alignItems: "center",
    flexWrap: "wrap", justifyContent: "space-between",
  },

  /* ---------- 相關連結 ---------- */
  relRow: { display: "flex", flexWrap: "wrap", gap: G.sm },
  relLink: {
    border: "1px solid var(--line)", background: "var(--surface)",
    color: "var(--muted)", borderRadius: 999, padding: "8px 16px",
    fontSize: T.sm, textDecoration: "none",
  },
};
