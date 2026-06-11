// ── ZONE 27 · 俱樂部隊中文名對照(盡力版 · Tim 可校正)──────────────
// football-data.org 給的是英文俱樂部名。 國家隊我自己有中文(teams.ts);但俱樂部
// 上千支、沒有公開中文字典,且**不爬台灣運彩**(紅線 + 動態網頁)。 解法:
//   1. 現在線上的聯賽(巴西甲)先用「盡力版」中文(我最好的猜測)。
//   2. 哪一隊跟台灣運彩不一樣 → Tim 貼給我,我改這張表(一行一隊,超好改)。
//   3. 查不到的 → 卡片自動 fallback 英文(graceful · 不破)。
// key = 資料源的隊名(shortName 優先 · 小寫比對)。 0 外部依賴。
// ─────────────────────────────────────────────────────

// 巴西甲(Brazil Série A)· ✅ Tim 對台灣運彩校正(2026-06-12 · HK/運彩式譯名,賭徒一眼認得)。
// 顯示用;隊徽/Avatar seed 仍用英文原名(顏色穩定 · Tim:隊徽維持英文)· 引擎仍按英文配對。
const CLUB_ZH: Record<string, string> = {
  // ── 本季 20 隊 · 已對運彩積分榜校正 ──
  palmeiras: "彭美拉",
  flamengo: "法林",
  fluminense: "富明",
  paranaense: "帕拉尼恩斯",
  "athletico paranaense": "帕拉尼恩斯",
  bragantino: "紅牛布",
  "red bull bragantino": "紅牛布",
  bahia: "巴希亞",
  coritiba: "哥列迪", // 運彩「哥列迪(巴)」= Coritiba
  "são paulo": "聖保羅",
  "sao paulo": "聖保羅",
  mineiro: "明尼路",
  "atlético mineiro": "明尼路",
  corinthians: "哥連",
  cruzeiro: "高士路",
  botafogo: "保地",
  vitória: "維多利亞BA",
  vitoria: "維多利亞BA",
  internacional: "國際",
  santos: "山度士",
  grêmio: "甘美奧",
  gremio: "甘美奧",
  vasco: "華斯高",
  "vasco da gama": "華斯高",
  remo: "雷默",
  "clube do remo": "雷默",
  mirassol: "米拉索爾",
  chapecoense: "查比科恩斯",
  // ── 非本季 20 隊 · 盡力版未驗證(目前不在巴西甲 · 多半不會顯示;留作 fallback,Tim 之後可校正)──
  fortaleza: "福塔雷薩",
  juventude: "尤文圖德",
  ceará: "塞阿拉",
  ceara: "塞阿拉",
  sport: "累西腓體育",
};

/** 用俱樂部英文名查中文 · 查不到回 null(呼叫端 fallback 英文)。 */
export function getClubZh(name: string): string | null {
  if (!name) return null;
  return CLUB_ZH[name.trim().toLowerCase()] ?? null;
}
