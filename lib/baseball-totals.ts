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

import { getMatchStartIso, type Match } from "@/lib/matches";
import type { IdentityMatch } from "@/lib/predictions";
import cpblResults from "@/lib/cpbl-results.json";
import mlbLocked from "@/lib/mlb-locked.json";

const REF_ERA = 4.0; // 參考「聯盟均值先發」ERA(揭露常數 · v0.1 · MLB/CPBL 共用近似)
const STARTER_WEIGHT = 0.6; // 先發對單場失分的影響權重(~6/9 局 · 其餘牛棚以均值補)
const CANDIDATE_LINES = [5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5];
// 引擎只開「最接近五五波」的線真的夠接近時才開(|大% − 50| ≤ 此值)· 否則沒有公平線 → 不開
// (同「我們只開算得出的」紀律 · 投手戰極端低分場可能無可開的公平總分線)。
const FAIR_BAND = 16;

function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

// 每個聯盟的真實平均總分 = 資料驅動的得分環境(用我們自己自動鏡像的賽果,不是運彩盤口)·
// module-level 各算一次。 ⚠️ v0.1 不建場館係數(MLB 的 Coors 等大球場影響大 → 之後 v0.2 補)·
// 校準會誠實顯示偏差。
const CPBL_AVG_TOTAL: number = (() => {
  // cpbl-results.json · 一軍例行賽 kindCode "A" · 148+ 場無偏差全季樣本(2026 CPBL ≈ 7.2 · 低得分球季)。
  const games = (cpblResults.games ?? []).filter(
    (g) =>
      g.kindCode === "A" &&
      typeof g.homeScore === "number" &&
      typeof g.awayScore === "number",
  );
  if (games.length < 20) return 7.5;
  const sum = games.reduce((s, g) => s + g.homeScore + g.awayScore, 0);
  return sum / games.length;
})();
const MLB_AVG_TOTAL: number = (() => {
  // mlb-locked.json · 已結算 finalScore · 225+ 場(2026 MLB ≈ 9.6 · 高得分)。
  const preds = (mlbLocked as { predictions?: unknown[] }).predictions ?? [];
  let sum = 0;
  let n = 0;
  for (const p of preds) {
    const fs = (p as { finalScore?: { home?: unknown; away?: unknown } })
      .finalScore;
    if (fs && typeof fs.home === "number" && typeof fs.away === "number") {
      sum += fs.home + fs.away;
      n++;
    }
  }
  return n >= 20 ? sum / n : 8.6;
})();

/** 聯盟得分基準 · null = 引擎不開大小分的聯盟(只棒球 · CPBL/MLB)。 */
function leagueBaseline(league: string): number | null {
  if (league === "CPBL") return CPBL_AVG_TOTAL;
  if (league === "MLB") return MLB_AVG_TOTAL;
  return null;
}

function eraOf(s: string): number {
  const n = Number(s);
  return Number.isFinite(n) && n > 0 ? n : REF_ERA;
}

/** 單場期望總分(v0.1 · 資料驅動聯盟基準 × 兩隊先發品質)。 */
export function expectedTotalRuns(match: Match): number {
  const base = leagueBaseline(match.league) ?? 8.0;
  const qualityFactor = clamp(
    (eraOf(match.home.pitcher.era) + eraOf(match.away.pitcher.era)) /
      (2 * REF_ERA),
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
  if (leagueBaseline(match.league) === null || match.postponed) return null;
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

// ── 玩法併入同一本帳(Tim 2026-06-23 拍板 · 反轉舊「絕不混進誰贏」)─────────────────
/**
 * 把一批比賽裡「已結算棒球」的大小分,做成「虛擬比賽」idMatches(贏家=大小分結果 · 引擎favorite=
 * 引擎那條線的偏向)· 給 aggregateIdentity / 天梯 當一場「誰贏」般對帳 → 大小分跟「誰贏」算同一本帳、
 * 同一個天梯。 虛擬場 id = `{id}~bou{線×10}`,跟 BaseballOverUnderStrip 存的用戶押注場號完全對得上。
 * 線 deterministic(凍 ERA + 全季基準)→ 賽前/賽後算出同一條。 純函式:傳哪些比賽就只處理哪些
 * (各 idMatches builder 用自己的比賽清單 concat 這個 → 跟它的「誰贏」場同源、一致)。
 */
export function baseballPropIdMatches(matches: Match[]): IdentityMatch[] {
  const out: IdentityMatch[] = [];
  for (const m of matches) {
    if (!m.finalResult || (m.league !== "CPBL" && m.league !== "MLB")) continue;
    const total = m.finalResult.homeScore + m.finalResult.awayScore;
    const startISO = getMatchStartIso(m);
    const offered = deriveBaseballTotal(m); // 引擎當下挑的那條線 · 只給它帶 engineFav(alpha 對照)
    // 🔴 對「每條候選線」各發一筆虛擬比賽 → 用戶凍在場號裡(~bou{線×10})的任何線都對得上,
    //   完全消除聯盟基準 running-average drift 造成的「對不上 → 卡 pending」orphan(對抗稽核 low)。
    //   只有「引擎當下那條線」帶 engineFav 進 vs-引擎;其餘線仍正確記勝負,但不進 alpha
    //   (無從重建當時引擎在那條線的偏向)。 .5 線無平手。
    for (const line of CANDIDATE_LINES) {
      out.push({
        id: bouMarketId(m.id, line),
        finalWinner: total > line ? "home" : "away", // 看大=home 過 · 看小=away 過
        engineFav:
          offered && offered.line === line
            ? offered.overPct > 50
              ? "home"
              : offered.overPct < 50
                ? "away"
                : null
            : null,
        startISO,
      });
    }
  }
  return out;
}
