// ── ZONE 27 · 俱樂部隊中文名對照(盡力版 · Tim 可校正)──────────────
// football-data.org 給的是英文俱樂部名。 國家隊我自己有中文(teams.ts);但俱樂部
// 上千支、沒有公開中文字典,且**不爬台灣運彩**(紅線 + 動態網頁)。 解法:
//   1. 現在線上的聯賽(巴西甲)先用「盡力版」中文(我最好的猜測)。
//   2. 哪一隊跟台灣運彩不一樣 → Tim 貼給我,我改這張表(一行一隊,超好改)。
//   3. 查不到的 → 卡片自動 fallback 英文(graceful · 不破)。
// key = 資料源的隊名(shortName 優先 · 小寫比對)。 0 外部依賴。
// ─────────────────────────────────────────────────────

// 巴西甲(Brazil Série A)· 盡力版 · ⚠️ 待 Tim 對台灣運彩校正
const CLUB_ZH: Record<string, string> = {
  palmeiras: "帕梅拉斯",
  flamengo: "弗拉門戈",
  botafogo: "博塔弗戈",
  santos: "桑托斯",
  corinthians: "哥林多人",
  mineiro: "米內羅競技",
  "atlético mineiro": "米內羅競技",
  bahia: "巴伊亞",
  chapecoense: "沙佩科恩斯",
  coritiba: "庫里提巴",
  "clube do remo": "雷莫",
  remo: "雷莫",
  cruzeiro: "克魯塞羅",
  fluminense: "弗魯米嫩塞",
  paranaense: "巴拉納競技",
  "athletico paranaense": "巴拉納競技",
  bragantino: "布拉甘蒂諾",
  "red bull bragantino": "布拉甘蒂諾",
  fortaleza: "福塔雷薩",
  grêmio: "格雷米奧",
  gremio: "格雷米奧",
  internacional: "國際",
  "são paulo": "聖保羅",
  "sao paulo": "聖保羅",
  vasco: "瓦斯科",
  "vasco da gama": "瓦斯科",
  juventude: "尤文圖德",
  mirassol: "米拉索爾",
  vitória: "維多利亞",
  vitoria: "維多利亞",
  ceará: "塞阿拉",
  ceara: "塞阿拉",
  sport: "累西腓體育",
};

/** 用俱樂部英文名查中文 · 查不到回 null(呼叫端 fallback 英文)。 */
export function getClubZh(name: string): string | null {
  if (!name) return null;
  return CLUB_ZH[name.trim().toLowerCase()] ?? null;
}
