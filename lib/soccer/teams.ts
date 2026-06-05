// ── ZONE 27 · 國家隊實力分 seed(足球引擎輸入)──────────────────
// 跟棒球的投手數據一樣 = 靜態 curate 的資料 seed,引擎吃它算勝率。
//
// rating = World Football Elo 風格實力分(真實量級:頂尖 ~1880、強 ~1780、
//   中 ~1700、弱 ~1550)。 2026 世界盃全 48 隊。 數值錨定 eloratings.net 2026-06
//   公開值(西班牙 1876 / 阿根廷 1875 / 英格蘭 1826 ...)· 其餘按相對實力校準。
// ⚠️ 仍是「近似 curate 值」(同棒球估算逐步換真實數據的揭露原則 · /audit
//   ESTIMATION DISCLOSURE)· 之後可接公開排名自動更新。
// 🔴 紅線:絕不抄博弈盤口換算 —— 用公開中立的國際排名來源。
//
// en 必須對齊資料源(football-data.org)的隊名,getRatingByName 才查得到
//   (例:United States / South Korea / Bosnia-Herzegovina / Czechia / Curaçao)。
// 本檔 0 外部依賴,純資料 + 純查詢。
// ─────────────────────────────────────────────────────

export type SoccerTeam = {
  /** 三碼國際代號(FIFA/IOC 風格) */
  code: string;
  /** 中文隊名 */
  name: string;
  /** 英文隊名 · 必須對齊資料源隊名 */
  en: string;
  /** Elo 風格實力分(近似 seed · 待校準) */
  rating: number;
  /** 品牌化隊色(隊徽用 · 可省 · 現卡片用 seed 衍生色) */
  color?: string;
};

// 2026 世界盃 48 隊(eloratings 2026-06 量級 · 近似校準)。
export const SOCCER_TEAMS: SoccerTeam[] = [
  { code: "ESP", name: "西班牙", en: "Spain", rating: 1876 },
  { code: "ARG", name: "阿根廷", en: "Argentina", rating: 1875 },
  { code: "FRA", name: "法國", en: "France", rating: 1852 },
  { code: "ENG", name: "英格蘭", en: "England", rating: 1826 },
  { code: "NED", name: "荷蘭", en: "Netherlands", rating: 1792 },
  { code: "BRA", name: "巴西", en: "Brazil", rating: 1790 },
  { code: "POR", name: "葡萄牙", en: "Portugal", rating: 1788 },
  { code: "GER", name: "德國", en: "Germany", rating: 1786 },
  { code: "CRO", name: "克羅埃西亞", en: "Croatia", rating: 1772 },
  { code: "MAR", name: "摩洛哥", en: "Morocco", rating: 1768 },
  { code: "BEL", name: "比利時", en: "Belgium", rating: 1764 },
  { code: "SUI", name: "瑞士", en: "Switzerland", rating: 1762 },
  { code: "COL", name: "哥倫比亞", en: "Colombia", rating: 1758 },
  { code: "URY", name: "烏拉圭", en: "Uruguay", rating: 1756 },
  { code: "NOR", name: "挪威", en: "Norway", rating: 1735 },
  { code: "AUT", name: "奧地利", en: "Austria", rating: 1732 },
  { code: "JPN", name: "日本", en: "Japan", rating: 1722 },
  { code: "CZE", name: "捷克", en: "Czechia", rating: 1718 },
  { code: "TUR", name: "土耳其", en: "Turkey", rating: 1716 },
  { code: "ECU", name: "厄瓜多", en: "Ecuador", rating: 1714 },
  { code: "SEN", name: "塞內加爾", en: "Senegal", rating: 1708 },
  { code: "MEX", name: "墨西哥", en: "Mexico", rating: 1702 },
  { code: "KOR", name: "南韓", en: "South Korea", rating: 1701 },
  { code: "SCO", name: "蘇格蘭", en: "Scotland", rating: 1700 },
  { code: "ALG", name: "阿爾及利亞", en: "Algeria", rating: 1699 },
  { code: "BIH", name: "波赫", en: "Bosnia-Herzegovina", rating: 1698 },
  { code: "CAN", name: "加拿大", en: "Canada", rating: 1696 },
  { code: "SWE", name: "瑞典", en: "Sweden", rating: 1694 },
  { code: "USA", name: "美國", en: "United States", rating: 1692 },
  { code: "CIV", name: "象牙海岸", en: "Ivory Coast", rating: 1688 },
  { code: "IRN", name: "伊朗", en: "Iran", rating: 1684 },
  { code: "GHA", name: "迦納", en: "Ghana", rating: 1674 },
  { code: "AUS", name: "澳洲", en: "Australia", rating: 1670 },
  { code: "EGY", name: "埃及", en: "Egypt", rating: 1666 },
  { code: "PAR", name: "巴拉圭", en: "Paraguay", rating: 1660 },
  { code: "TUN", name: "突尼西亞", en: "Tunisia", rating: 1654 },
  { code: "COD", name: "民主剛果", en: "Congo DR", rating: 1648 },
  { code: "RSA", name: "南非", en: "South Africa", rating: 1636 },
  { code: "PAN", name: "巴拿馬", en: "Panama", rating: 1626 },
  { code: "QAT", name: "卡達", en: "Qatar", rating: 1620 },
  { code: "UZB", name: "烏茲別克", en: "Uzbekistan", rating: 1616 },
  { code: "KSA", name: "沙烏地阿拉伯", en: "Saudi Arabia", rating: 1612 },
  { code: "IRQ", name: "伊拉克", en: "Iraq", rating: 1598 },
  { code: "JOR", name: "約旦", en: "Jordan", rating: 1586 },
  { code: "CPV", name: "維德角", en: "Cape Verde Islands", rating: 1582 },
  { code: "HAI", name: "海地", en: "Haiti", rating: 1548 },
  { code: "CUW", name: "古拉索", en: "Curaçao", rating: 1532 },
  { code: "NZL", name: "紐西蘭", en: "New Zealand", rating: 1508 },
];

const BY_CODE: Record<string, SoccerTeam> = Object.fromEntries(
  SOCCER_TEAMS.map((t) => [t.code, t]),
);

/** 用三碼代號查隊伍 · 查不到回 null(graceful)。 */
export function getSoccerTeam(code: string): SoccerTeam | null {
  return BY_CODE[code] ?? null;
}

// 資料源隊名 → seed 別名(萬一資料源用不同寫法時的安全網)。
const NAME_ALIASES: Record<string, string> = {
  usa: "united states",
  "korea republic": "south korea",
  "republic of korea": "south korea",
  "bosnia and herzegovina": "bosnia-herzegovina",
  türkiye: "turkey",
  "côte d'ivoire": "ivory coast",
};

const BY_EN: Record<string, number> = Object.fromEntries(
  SOCCER_TEAMS.map((t) => [t.en.toLowerCase(), t.rating]),
);

/** 用英文隊名查 seed 實力分(國家隊賽事用 · 查不到回 null → 呼叫端用 baseline fallback)。 */
export function getRatingByName(name: string): number | null {
  const k = name.trim().toLowerCase();
  if (BY_EN[k] != null) return BY_EN[k];
  const alias = NAME_ALIASES[k];
  if (alias && BY_EN[alias] != null) return BY_EN[alias];
  return null;
}

const BY_EN_ZH: Record<string, string> = Object.fromEntries(
  SOCCER_TEAMS.map((t) => [t.en.toLowerCase(), t.name]),
);

/** 用英文隊名查中文顯示名(國家隊 · 對齊台灣運彩寫法)· 查不到回 null。 */
export function getNationalZh(name: string): string | null {
  const k = name.trim().toLowerCase();
  if (BY_EN_ZH[k] != null) return BY_EN_ZH[k];
  const alias = NAME_ALIASES[k];
  if (alias && BY_EN_ZH[alias] != null) return BY_EN_ZH[alias];
  return null;
}

const BY_EN_CODE: Record<string, string> = Object.fromEntries(
  SOCCER_TEAMS.map((t) => [t.en.toLowerCase(), t.code]),
);

/** 用英文隊名查三碼國際代號(隊徽 glyph 用 · 國家隊辨識度遠高於前兩字)· 查不到回 null。 */
export function getNationalCode(name: string): string | null {
  const k = name.trim().toLowerCase();
  if (BY_EN_CODE[k] != null) return BY_EN_CODE[k];
  const alias = NAME_ALIASES[k];
  if (alias && BY_EN_CODE[alias] != null) return BY_EN_CODE[alias];
  return null;
}

/** 全表平均實力分 · 給未列隊伍的 fallback(誠實的「中位水準」基準)。 */
export const SOCCER_RATING_BASELINE = Math.round(
  SOCCER_TEAMS.reduce((s, t) => s + t.rating, 0) / SOCCER_TEAMS.length,
);
