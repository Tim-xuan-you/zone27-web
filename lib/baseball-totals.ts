// ── ZONE 27 · 棒球大小分(Over/Under)v0.1 · 引擎挑公平線 · 純函式核心 ──────────────
// 大小分是台灣運彩棒球主力玩法(Tim/Ron 已在 /table 手押過「兩隊總分」大小)。 足球大小分固定
// 2.5;棒球總分跳很大(投手戰 5-6 分 vs 大亂鬥 13 分)→ 不能固定一條線,每場讓引擎挑「最接近
// 五五波」的那條(同我們在讓分上學到的:固定線會變成沒人押的死注)。
//
// 模型 v0.1(揭露 · 上 /audit):
//   · 聯盟基準 = 本季「已結算」CPBL 賽事的真實平均總分(資料驅動 · 非拍腦袋的常數)。
//   · 單場期望總分 = 聯盟基準 × 兩隊先發品質係數(先發 ERA 對參考 ERA · 先發佔 ~6/9 局權重 ·
//     其餘牛棚以聯盟均值補)。 好投手對決 → 低於基準;先發正挨打 → 高於基準。
//   · 總分 ~ Poisson(期望總分)→ 對每條 .5 線算「大」機率 → 挑最接近 50% 的那條(真五五波 · 無 push)。
//     ⚠️ 獨立 Poisson 低估棒球總分變異(大局群聚)= v0.1 已知近似;校準會誠實顯示偏差,之後升級。
//
// 🔴 隔離鐵律:押注掛帶後綴場號 `{cpbl-id}~bou{線×10}`(如 ~bou85 = 8.5)· `~` 後綴已被「誰贏」
//   全部消費端守門擋住(predictions-server / predictions-market / profile-server / pulse /
//   settlement-data)→ 絕不污染「誰贏」永久戰績/校準。 線編進場號 = 凍線,賽後對「當初那條線」結算。
// ─────────────────────────────────────────────────────

import type { Match } from "@/lib/matches";
import cpblResults from "@/lib/cpbl-results.json";

const CPBL_REF_ERA = 4.0; // 參考「聯盟均值先發」ERA(揭露常數 · v0.1)
const STARTER_WEIGHT = 0.6; // 先發對單場失分的影響權重(~6/9 局 · 其餘牛棚以均值補)
const FALLBACK_TOTAL = 7.5; // 全季樣本不足(<20 場)時的聯盟基準退路
const CANDIDATE_LINES = [5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5];
// 引擎只開「最接近五五波」的線真的夠接近時才開(|大% − 50| ≤ 此值)· 否則沒有公平線 → 不開
// (同「我們只開算得出的」紀律 · 投手戰極端低分場可能無可開的公平總分線)。
const FAIR_BAND = 16;

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

// 本季「全部官方賽果」的真實平均總分 = 資料驅動的聯盟得分環境(用我們每 3h 自動鏡像的
// cpbl-results.json · 一軍例行賽 kindCode "A" · 148+ 場無偏差樣本 · 不是 curate 的子集、更不是運彩盤口)。
// module-level 算一次。
const LEAGUE_AVG_TOTAL: number = (() => {
  const games = (cpblResults.games ?? []).filter(
    (g) =>
      g.kindCode === "A" &&
      typeof g.homeScore === "number" &&
      typeof g.awayScore === "number",
  );
  if (games.length < 20) return FALLBACK_TOTAL;
  const sum = games.reduce((s, g) => s + g.homeScore + g.awayScore, 0);
  return sum / games.length;
})();

function eraOf(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : CPBL_REF_ERA;
}

/** 單場期望總分(v0.1 · 資料驅動聯盟基準 × 兩隊先發品質)。 */
export function expectedTotalRuns(match: Match): number {
  const base = LEAGUE_AVG_TOTAL;
  const qualityFactor = clamp(
    (eraOf(match.home.pitcher.era) + eraOf(match.away.pitcher.era)) /
      (2 * CPBL_REF_ERA),
    0.55,
    1.6,
  );
  const lambda = base * (STARTER_WEIGHT * qualityFactor + (1 - STARTER_WEIGHT));
  return clamp(lambda, 4, 16);
}

// Poisson P(X ≤ k)
function poissonCdf(k: number, lambda: number): number {
  let term = Math.exp(-lambda);
  let sum = term;
  for (let i = 1; i <= k; i++) {
    term *= lambda / i;
    sum += term;
  }
  return Math.min(1, sum);
}

export type BaseballTotal = {
  line: number; // 7.5 / 8.5 ...
  overPct: number; // 大 · 總分 > 線 · 0-100
  underPct: number; // 小 · = 100 - overPct
};

/** 引擎挑線:每場選「大機率最接近 50%」的 .5 線(真五五波)。 線只看凍住的先發 ERA + 全季基準 →
 *  賽後一樣算得出同一條線(給賽後對帳用)· 所以這裡不擋 finalResult。 null = 非 CPBL / 延賽 / 無公平線。 */
export function deriveBaseballTotal(match: Match): BaseballTotal | null {
  if (match.league !== "CPBL" || match.postponed) return null;
  const lambda = expectedTotalRuns(match);
  let best: BaseballTotal | null = null;
  for (const L of CANDIDATE_LINES) {
    const overPct = Math.round((1 - poissonCdf(Math.floor(L), lambda)) * 100);
    const cand: BaseballTotal = { line: L, overPct, underPct: 100 - overPct };
    if (!best || Math.abs(overPct - 50) < Math.abs(best.overPct - 50))
      best = cand;
  }
  // 🔴 連最接近的線都離五五波太遠 → 沒有公平的總分線可開 → 不開(同「只開算得出的」)。
  if (best && Math.abs(best.overPct - 50) > FAIR_BAND) return null;
  return best;
}

// ── 押注場號(線編進去 → 凍線 · 賽後對那條線結算)──────────────────────────────
export function bouMarketId(matchId: string, line: number): string {
  return `${matchId}~bou${Math.round(line * 10)}`;
}
export function isBouMarketId(id: string): boolean {
  return /~bou\d+$/.test(id);
}
/** 從場號取回凍住的那條線(賽後對帳用)· null = 非大小分場號。 */
export function bouLineFromMarketId(id: string): number | null {
  const m = id.match(/~bou(\d+)$/);
  return m ? Number(m[1]) / 10 : null;
}

export type BouSide = "over" | "under";
/** 內部映射:看大 = home · 看小 = away(二選一塞進既有 home/away · 0 migration · 同足球大小分)。 */
export function bouSideToPick(side: BouSide): "home" | "away" {
  return side === "over" ? "home" : "away";
}
export function pickToBouSide(pick: unknown): BouSide | null {
  if (pick === "home") return "over";
  if (pick === "away") return "under";
  return null;
}
/** 終場總分 → 大/小(.5 線無 push)。 */
export function bouResultFromScore(
  homeScore: number,
  awayScore: number,
  line: number,
): BouSide {
  return homeScore + awayScore > line ? "over" : "under";
}
