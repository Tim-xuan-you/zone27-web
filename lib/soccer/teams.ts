// ── ZONE 27 · 國家隊實力分 seed(足球引擎輸入)──────────────────
// 跟棒球的投手數據一樣 = 靜態 curate 的資料 seed,引擎吃它算勝率。
//
// rating = 國際 Elo 風格的實力分(~1500 平庸、~1800 強、~2100 世界頂尖)。
// ⚠️ 誠實標註:這批是「近似初始值」(approximate seed),用來先把引擎跑起來 +
//    驗證。 正式上線前會用公開的國際排名/近期戰績校準到當前數值(同棒球「估算值
//    逐步換成真實數據」的揭露原則 · 見 /audit ESTIMATION DISCLOSURE)。
// 🔴 紅線:絕不抄博弈平台盤口換算的隱含實力 —— 用公開中立的國際排名來源。
//
// color = 品牌化隊徽色(無紅綠刺眼對撞 · 守暗金品牌)· 之後接 Avatar 隊徽用。
// 本檔 0 外部依賴,純資料 + 純查詢。
// ─────────────────────────────────────────────────────

export type SoccerTeam = {
  /** 三碼國際代號(FIFA/IOC 風格 · 隊徽縮寫用) */
  code: string;
  /** 中文隊名 */
  name: string;
  /** 英文隊名 */
  en: string;
  /** 國際 Elo 風格實力分(近似 seed · 待校準) */
  rating: number;
  /** 品牌化隊色(隊徽用 · 避開刺眼紅綠對撞) */
  color: string;
};

// 近似初始值(2026 量級 · 待用公開排名校準)。 涵蓋世界盃主要競爭者 +
// 台灣球迷熟悉的亞洲隊 + 地主。 之後補滿 48 隊。
export const SOCCER_TEAMS: SoccerTeam[] = [
  { code: "ARG", name: "阿根廷", en: "Argentina", rating: 2105, color: "#74A9E8" },
  { code: "FRA", name: "法國", en: "France", rating: 2055, color: "#4F7FD0" },
  { code: "ESP", name: "西班牙", en: "Spain", rating: 2050, color: "#E8B04B" },
  { code: "BRA", name: "巴西", en: "Brazil", rating: 2020, color: "#E8C24B" },
  { code: "ENG", name: "英格蘭", en: "England", rating: 1985, color: "#9FB4D8" },
  { code: "POR", name: "葡萄牙", en: "Portugal", rating: 1990, color: "#C85765" },
  { code: "NED", name: "荷蘭", en: "Netherlands", rating: 1965, color: "#E8923C" },
  { code: "BEL", name: "比利時", en: "Belgium", rating: 1925, color: "#D4A23C" },
  { code: "GER", name: "德國", en: "Germany", rating: 1930, color: "#B9C2CC" },
  { code: "CRO", name: "克羅埃西亞", en: "Croatia", rating: 1900, color: "#C75D6A" },
  { code: "URU", name: "烏拉圭", en: "Uruguay", rating: 1895, color: "#7FB0E0" },
  { code: "COL", name: "哥倫比亞", en: "Colombia", rating: 1875, color: "#E8C24B" },
  { code: "MAR", name: "摩洛哥", en: "Morocco", rating: 1865, color: "#C85765" },
  { code: "USA", name: "美國", en: "USA", rating: 1835, color: "#6F8FC8" },
  { code: "MEX", name: "墨西哥", en: "Mexico", rating: 1805, color: "#5BA88C" },
  { code: "JPN", name: "日本", en: "Japan", rating: 1840, color: "#7FA8DC" },
  { code: "KOR", name: "南韓", en: "South Korea", rating: 1785, color: "#7FB0E0" },
  { code: "SEN", name: "塞內加爾", en: "Senegal", rating: 1830, color: "#5BA88C" },
  { code: "CAN", name: "加拿大", en: "Canada", rating: 1780, color: "#D86A6A" },
  { code: "AUS", name: "澳洲", en: "Australia", rating: 1750, color: "#D4A23C" },
  { code: "SUI", name: "瑞士", en: "Switzerland", rating: 1840, color: "#D86A6A" },
  { code: "DEN", name: "丹麥", en: "Denmark", rating: 1830, color: "#C85765" },
  { code: "SRB", name: "塞爾維亞", en: "Serbia", rating: 1810, color: "#9FB4D8" },
  { code: "SA", name: "南非", en: "South Africa", rating: 1660, color: "#5BA88C" },
];

const BY_CODE: Record<string, SoccerTeam> = Object.fromEntries(
  SOCCER_TEAMS.map((t) => [t.code, t]),
);

/** 用三碼代號查隊伍 · 查不到回 null(graceful)。 */
export function getSoccerTeam(code: string): SoccerTeam | null {
  return BY_CODE[code] ?? null;
}

/** 全聯盟平均實力分 · 給未列隊伍的 fallback 用(誠實的「中位水準」基準)。 */
export const SOCCER_RATING_BASELINE = Math.round(
  SOCCER_TEAMS.reduce((s, t) => s + t.rating, 0) / SOCCER_TEAMS.length,
);
