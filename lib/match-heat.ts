import { getCreatorPostCounts } from "@/lib/creator-posts-server";
import { fetchLadderRows } from "@/lib/ladder-rows";

// ── ZONE 27 · 每場「熱度」(讓賭徒一眼看出哪場在燒)· server · 0 migration · ISR-safe ──
// Tim:各場各自討論很對(同 Reddit game thread / StockTwits per-ticker),但要讓人一眼看到
// 哪場熱、從首頁就被導去「有人在的那桌」。 熱度 = 真實活動,不是發文量:
//   · 鎖定人數(get_ladder_entries · 既有 0022 · 一場一人一列 → 數列數)
//   · 賽前分析篇數(getCreatorPostCounts · 既有 get_creator_records)
// 🔴 守紅線:只數真帳本活動(鎖定 + 分析)· 不按 PnL / 連勝 / 粉絲 · 用 stateless anon client
//   (同 creator-posts-server)→ 不讀 cookie、不破首頁 / 看板 ISR 靜態。 任何錯 → 空(graceful)。
// ─────────────────────────────────────────────────────

export type MatchHeat = { locks: number; analyses: number; score: number };
export type HeatDisplay = {
  locks: number;
  analyses: number;
  /** 相對熱度條寬 0-100(對這組最熱那場)· 給卡片畫金色熱度條 */
  barPct: number;
  /** 這組裡最熱、且夠熱(≥ HOTTEST_MIN_SCORE)→ 掛「最熱」標 · 唯一不並列 */
  hottest: boolean;
};

// 一篇賽前分析 = 高用心訊號 → 加權高於單純鎖定一手。
const ANALYSIS_WEIGHT = 3;
// 「最熱」標的門檻(同群眾線「滿 5 才算共識」精神 · 不在冷清時段假裝有最熱場)。
const HOTTEST_MIN_SCORE = 5;

// 每場鎖定人數 · 走共用的 fetchLadderRows(0022 get_ladder_entries · 一場一人一列 = DB-unique)→
// 數每場列數。 fetchLadderRows 經 React cache 去重 → 跟同頁的活動脈動共用同一次 RPC(省一次全表掃)。
async function getLockCounts(): Promise<Record<string, number>> {
  const rows = await fetchLadderRows();
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const id = typeof row.match_id === "string" ? row.match_id : null;
    if (id) counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
}

/** 每場熱度 = 鎖定人數 + 分析篇數(加權)· 0 新 migration · 任何錯 → 空。 */
export async function getMatchHeat(): Promise<Record<string, MatchHeat>> {
  const [locks, analyses] = await Promise.all([
    getLockCounts(),
    getCreatorPostCounts(),
  ]);
  const out: Record<string, MatchHeat> = {};
  for (const id of new Set([...Object.keys(locks), ...Object.keys(analyses)])) {
    const l = locks[id] ?? 0;
    const a = analyses[id] ?? 0;
    out[id] = { locks: l, analyses: a, score: l + a * ANALYSIS_WEIGHT };
  }
  return out;
}

/** 給一組要顯示的場 → 每場的相對熱度條寬 + 誰是最熱(用於卡片標記 + 看板排序)。 純函式。 */
export function heatDisplayFor(
  heat: Record<string, MatchHeat>,
  matchIds: string[],
): Record<string, HeatDisplay> {
  let maxScore = 0;
  let hottestId = "";
  for (const id of matchIds) {
    const s = heat[id]?.score ?? 0;
    if (s > maxScore) {
      maxScore = s;
      hottestId = id;
    }
  }
  const out: Record<string, HeatDisplay> = {};
  for (const id of matchIds) {
    const h = heat[id];
    const score = h?.score ?? 0;
    out[id] = {
      locks: h?.locks ?? 0,
      analyses: h?.analyses ?? 0,
      barPct: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
      hottest: score >= HOTTEST_MIN_SCORE && id === hottestId,
    };
  }
  return out;
}

/** 熱度排序鍵(score 高在前 · 0 活動維持原本順序)· 給看板「按熱度排」。 */
export function heatScore(
  heat: Record<string, MatchHeat>,
  matchId: string,
): number {
  return heat[matchId]?.score ?? 0;
}
