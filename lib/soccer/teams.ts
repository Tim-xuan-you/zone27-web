// ── ZONE 27 · 國家隊實力分 seed(型別公開介面 · 資料 + 查詢在 teams-data.mjs)──────
// seed 資料 + 所有查詢(實力分 / 中文名 / 三碼代號)搬到 teams-data.mjs(.mjs),站上(本檔)
// 與賽前鎖定 script 共用同一份 = 國家隊賽事的引擎開盤 + 顯示名零 drift。 本檔只掛 TypeScript
// 型別並 re-export,對外 API 與舊版完全相同(零下游改動)。
// ─────────────────────────────────────────────────────

import {
  SOCCER_TEAMS as SOCCER_TEAMS_CORE,
  getRatingByName as getRatingByNameCore,
  getNationalZh as getNationalZhCore,
  getNationalCode as getNationalCodeCore,
  getSoccerTeam as getSoccerTeamCore,
  SOCCER_RATING_BASELINE as SOCCER_RATING_BASELINE_CORE,
} from "./teams-data.mjs";

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

// 2026 世界盃 48 隊(資料在 teams-data.mjs · 此處掛型別)。
export const SOCCER_TEAMS: SoccerTeam[] = SOCCER_TEAMS_CORE;

/** 用三碼代號查隊伍 · 查不到回 null(graceful)。 */
export const getSoccerTeam: (code: string) => SoccerTeam | null = getSoccerTeamCore;

/** 用英文隊名查 seed 實力分(國家隊賽事用 · 查不到回 null → 呼叫端用 baseline fallback)。 */
export const getRatingByName: (name: string) => number | null = getRatingByNameCore;

/** 用英文隊名查中文顯示名(國家隊 · 對齊台灣運彩寫法)· 查不到回 null。 */
export const getNationalZh: (name: string) => string | null = getNationalZhCore;

/** 用英文隊名查三碼國際代號(隊徽 glyph 用 · 國家隊辨識度遠高於前兩字)· 查不到回 null。 */
export const getNationalCode: (name: string) => string | null = getNationalCodeCore;

/** 全表平均實力分 · 給未列隊伍的 fallback(誠實的「中位水準」基準)。 */
export const SOCCER_RATING_BASELINE: number = SOCCER_RATING_BASELINE_CORE;
