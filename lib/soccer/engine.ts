// ── ZONE 27 · 足球推演引擎 v0.1(型別公開介面 · 數學在 engine-core.mjs)──────
// 純數學搬到 engine-core.mjs(.mjs),讓站上(本檔)與賽前鎖定 script
// (scripts/lock-soccer-predictions.mjs · 跑在 Node)import 同一份 = 站上顯示的數字
// 跟鎖進 lib/soccer-locked.json 的數字保證一致(零 drift)→「你 vs 引擎」對帳才誠實。
// 本檔只負責「把那份核心掛上 TypeScript 型別」,對外 API 與舊版完全相同(零下游改動)。
//
// 方法 = Dixon-Coles 雙變量 Poisson(Dixon & Coles 1997)· 詳見 engine-core.mjs 說明。
// 🔴 紅線:這顆引擎天花板跟棒球一樣低(足球進球少、平手多)· 賣點是誠實校準 + 含輸帳本,
//   不是神準。 任何「我們比莊家準」的話術都禁。
// ─────────────────────────────────────────────────────

import {
  predictSoccer as predictSoccerCore,
  predictFromGoals as predictFromGoalsCore,
  toDisplayPercents as toDisplayPercentsCore,
  deriveSoccerMarkets as deriveSoccerMarketsCore,
} from "./engine-core.mjs";
import { enginePickOf as enginePickOfCore } from "./predict-core.mjs";

export type SoccerScore = {
  home: number;
  away: number;
  /** 此比分的機率 0-1 */
  p: number;
};

export type SoccerPrediction = {
  /** 主隊獲勝機率 0-1 */
  homeWin: number;
  /** 平手機率 0-1 */
  draw: number;
  /** 客隊獲勝機率 0-1 */
  awayWin: number;
  /** 主隊預期進球(λ) */
  xgHome: number;
  /** 客隊預期進球(λ) */
  xgAway: number;
  /** 最可能的幾個終場比分(機率高 → 低,取前 5) */
  topScores: SoccerScore[];
};

export type SoccerEngineParams = {
  /** 主場優勢(以實力分計;中立球場傳 0)。 預設 60。 */
  homeAdvantage?: number;
  /** 本賽事每場平均總進球(世界盃 ≈ 2.6;高分聯賽可調高)。 預設 2.6。 */
  avgTotalGoals?: number;
  /** Dixon-Coles 低比分相依修正 ρ(典型 −0.03 ~ −0.13)。 預設 −0.08。 */
  rho?: number;
  /** 比分表計算上限(每邊 0..maxGoals;再高的機率可忽略)。 預設 8。 */
  maxGoals?: number;
  /** 實力分差 → 預期進球差 的換算(每 100 分 ≈ 0.45 球)。 預設 0.0045。 */
  supremacyPerRating?: number;
};

/**
 * 用兩隊「國際實力分」算出 勝 / 平 / 負 機率 + 預期進球 + 最可能比分。
 * rating 越高越強(國際 Elo 風格:~1500 平庸、~2100 頂尖)。 純函式、deterministic。
 */
export const predictSoccer: (
  ratingHome: number,
  ratingAway: number,
  params?: SoccerEngineParams,
) => SoccerPrediction = predictSoccerCore;

/** 直接用兩邊預期進球 λ 開盤(俱樂部攻防模型 · 進球數隨對戰變)。 */
export const predictFromGoals: (
  xgHome: number,
  xgAway: number,
  params?: SoccerEngineParams,
) => SoccerPrediction = predictFromGoalsCore;

/**
 * 把預測轉成「四捨五入到整數百分比、且三者相加恰為 100」的展示用數字(最大餘數法)。
 */
export const toDisplayPercents: (pred: SoccerPrediction) => {
  homeWin: number;
  draw: number;
  awayWin: number;
} = toDisplayPercentsCore;

/** 引擎看好哪個結果(原始機率 argmax · tie-break 主>和>客)· 卡片「上金的邊」單一真相 ·
 *  不從展示整數%重算(避免四捨五入翻轉 → 金條與「引擎看好 X」打架)。 */
export const enginePickOf: (pred: SoccerPrediction) => "home" | "draw" | "away" =
  enginePickOfCore;

// ── 賭徒熟悉的玩法視角(大小球 / 讓球 / 兩隊進球)· 棒球「讓分 + 大小盤」的足球雙生 ─────
// 數學在 engine-core.mjs(deriveSoccerMarkets)· 從預測自帶的 λ 重建同一張比分表推導 →
// 與卡片上的 勝/平/負 % 同源、零 drift。 🔴 純機率陳述 · 不接盤口、不轉賠率、不出「押這邊」。

/** 大小球機率:對一條總進球線 L(.5)· 大(總進球 > L)vs 小(總進球 < L)· 互補加總 100。 */
export type SoccerOverUnder = {
  line: number;
  overPct: number; // 大 · 0-100
  underPct: number; // 小 · = 100 - overPct
};

/** 讓球機率:對一條讓球線 L(.5)· 主 −L(主隊贏 > L 球)vs 客 +L(受讓守住)· 互補加總 100。 */
export type SoccerHandicap = {
  line: number;
  homePct: number; // 主 −L · 0-100
  awayPct: number; // 客 +L · = 100 - homePct
};

/** 三個賭徒熟悉的足球玩法視角(全是我們引擎自己算的機率 · 零盤口)。 */
export type SoccerMarkets = {
  totals: SoccerOverUnder[];
  handicaps: SoccerHandicap[];
  bttsYesPct: number; // 兩隊進球「是」· 0-100
  bttsNoPct: number; // 兩隊進球「否」· = 100 - bttsYesPct
};

/**
 * 從預測的兩邊預期進球 λ 推導 大小球 / 讓球 / 兩隊進球 機率。
 * 用同一份 DEFAULTS(rho / maxGoals)重建比分表 → 跟 1X2 同源(誠實對帳的前提)。
 */
export const deriveSoccerMarkets: (
  xgHome: number,
  xgAway: number,
  opts?: {
    totalLines?: number[];
    handicapLines?: number[];
    rho?: number;
    maxGoals?: number;
  },
) => SoccerMarkets = deriveSoccerMarketsCore;
