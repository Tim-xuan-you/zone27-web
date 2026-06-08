// ── ZONE 27 · 足球實力分系統(自建 Elo · 型別公開介面 · 數學在 elo-core.mjs)──────
// 純數學搬到 elo-core.mjs,讓站上(本檔)與賽前鎖定 script 共用同一份 = 算出的實力分零 drift。
// 本檔只負責掛 TypeScript 型別,對外 API 與舊版完全相同(零下游改動)。
// 方法 = World Football Elo 式(含主場 + 大勝加權)· 詳見 elo-core.mjs 說明。
// ─────────────────────────────────────────────────────

import {
  updateOne as updateOneCore,
  buildRatings as buildRatingsCore,
  getRating as getRatingCore,
  gameCounts as gameCountsCore,
  MIN_GAMES_FOR_RATING as MIN_GAMES_FOR_RATING_CORE,
} from "./elo-core.mjs";

export type SoccerResult = {
  /** 主隊代號/ID */
  home: string;
  /** 客隊代號/ID */
  away: string;
  homeGoals: number;
  awayGoals: number;
};

export type EloOptions = {
  /** 基礎 K 係數(一場最多移動多少分 · 預設 24) */
  k?: number;
  /** 主場優勢(以實力分計 · 中立場 0 · 預設 60) */
  homeAdvantage?: number;
  /** 沒見過的隊伍的起始分(預設 1500 = 平庸基準) */
  baseline?: number;
};

/** 用一場結果更新兩隊的分數。 zero-sum:主隊加多少、客隊就扣多少。 */
export const updateOne: (
  eloHome: number,
  eloAway: number,
  homeGoals: number,
  awayGoals: number,
  opts?: EloOptions,
) => { home: number; away: number } = updateOneCore;

/** 餵一串「依時間排序」的歷史戰績 → 算出每支隊伍當前的實力分。 */
export const buildRatings: (
  results: SoccerResult[],
  opts?: EloOptions,
) => Record<string, number> = buildRatingsCore;

/** 查一支隊的實力分 · 沒見過回 baseline(graceful)。 */
export const getRating: (
  ratings: Record<string, number>,
  team: string,
  baseline?: number,
) => number = getRatingCore;

/**
 * 一支隊伍要算進「可誠實預測」門檻的最少場數。 場數太少 = Elo 還沒收斂 = 不該開盤
 * (同棒球 Elo「≥50 場才有訊號」的誠實鐵律 · 足球門檻較低因每場資訊量大)。
 */
export const MIN_GAMES_FOR_RATING: number = MIN_GAMES_FOR_RATING_CORE;

/** 算每支隊出現過幾場(配 MIN_GAMES_FOR_RATING 過濾「資料還不夠、別硬開盤」的隊)。 */
export const gameCounts: (results: SoccerResult[]) => Record<string, number> =
  gameCountsCore;
