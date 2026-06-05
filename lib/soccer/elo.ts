// ── ZONE 27 · 足球實力分系統(自建 Elo)──────────────────────────
// 「每天全世界的足球都上」的真正瓶頸不是賽程(免費 API 全都有)· 是「實力分」——
// 引擎要預測,得先知道每支隊有多強。 世界盃國家隊有公開排名;但上千支俱樂部隊
// 沒有現成排名 → 我們自己用「歷史戰績」算 Elo:餵每場結果進去,贏的加分、輸的扣分,
// 大勝加更多 → 自動長出每支隊的實力分。 有足夠戰績的聯賽就能誠實預測,沒有的老實標
// 「覆蓋建置中」不硬上假數字(同棒球那顆沒資料的 Elo 引擎按住不發的鐵律)。
//
// 方法 = World Football Elo 式(含主場 + 大勝加權)· 公開標準、可白話解釋、可重現。
// 純函式、0 外部依賴(同 engine.ts · 不碰棒球)。 算出的 rating 直接餵 predictSoccer。
// ─────────────────────────────────────────────────────

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

const ELO_DEFAULTS: Required<EloOptions> = { k: 24, homeAdvantage: 60, baseline: 1500 };

/** A 對 B 的「預期得分」(0-1 · Elo 標準邏輯函數)。 */
function expectedScore(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/** 大勝加權(World Football Elo 式):贏 1 球 ×1、2 球 ×1.5、3 球以上漸增。
 *  讓「2:0」比「1:0」移動更多分,但不無限放大(避免一場屠殺洗壞評分)。 */
function movMultiplier(goalDiff: number): number {
  const g = Math.abs(goalDiff);
  if (g <= 1) return 1;
  if (g === 2) return 1.5;
  return (11 + g) / 8;
}

/** 用一場結果更新兩隊的分數。 zero-sum:主隊加多少、客隊就扣多少。 */
export function updateOne(
  eloHome: number,
  eloAway: number,
  homeGoals: number,
  awayGoals: number,
  opts: EloOptions = {},
): { home: number; away: number } {
  const { k, homeAdvantage } = { ...ELO_DEFAULTS, ...opts };
  const expHome = expectedScore(eloHome + homeAdvantage, eloAway);
  const resultHome =
    homeGoals > awayGoals ? 1 : homeGoals === awayGoals ? 0.5 : 0;
  const mult = movMultiplier(homeGoals - awayGoals);
  const delta = k * mult * (resultHome - expHome);
  return { home: eloHome + delta, away: eloAway - delta };
}

/**
 * 餵一串「依時間排序」的歷史戰績 → 算出每支隊伍當前的實力分。
 * 沒見過的隊從 baseline 起算 · 純 deterministic(同樣戰績永遠同樣評分)。
 */
export function buildRatings(
  results: SoccerResult[],
  opts: EloOptions = {},
): Record<string, number> {
  const { baseline } = { ...ELO_DEFAULTS, ...opts };
  const ratings: Record<string, number> = {};
  const get = (t: string) => ratings[t] ?? baseline;
  for (const r of results) {
    const u = updateOne(get(r.home), get(r.away), r.homeGoals, r.awayGoals, opts);
    ratings[r.home] = u.home;
    ratings[r.away] = u.away;
  }
  return ratings;
}

/** 查一支隊的實力分 · 沒見過回 baseline(graceful · 同棒球估算 fallback)。 */
export function getRating(
  ratings: Record<string, number>,
  team: string,
  baseline = ELO_DEFAULTS.baseline,
): number {
  return ratings[team] ?? baseline;
}

/**
 * 一支隊伍要算進「可誠實預測」門檻的最少場數。 場數太少 = Elo 還沒收斂 =
 * 不該拿來開盤(同棒球 Elo「≥50 場才有訊號」的誠實鐵律 · 足球門檻較低因每場資訊量大)。
 */
export const MIN_GAMES_FOR_RATING = 8;

/** 算每支隊出現過幾場(配 MIN_GAMES_FOR_RATING 過濾「資料還不夠、別硬開盤」的隊)。 */
export function gameCounts(results: SoccerResult[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const r of results) {
    counts[r.home] = (counts[r.home] ?? 0) + 1;
    counts[r.away] = (counts[r.away] ?? 0) + 1;
  }
  return counts;
}
