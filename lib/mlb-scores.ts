// ── ZONE 27 · MLB 最可能比分(卜瓦松推導 · 對齊鎖定勝率)──────────────────────
// MLB 引擎是 Log5(只出主隊勝率)· 本檔把「賽前鎖定的勝率 + 兩隊先發 ERA」推導成一張
// 最可能終局比分表(同 CPBL 詳情頁那段 TOP 5)—— 賭徒最想要的「給我一個比分」。
//
// 🔴 誠實 / 一致(disclosure philosophy · 絕不開出第二個跟勝率打架的數字):
//   · 兩隊先發 ERA → 決定「總得分節奏」(兩王牌 = 低分局 · 兩爛投 = 高分局)。
//   · 賽前鎖定的勝率 → 決定「誰領先多少」:校準 δ 讓卜瓦松算出的 P(主勝) 正好等於鎖定勝率。
//   → 比分表是「鎖定勝率」的形狀,不是另開一個盤。 任一 ERA 缺(投手未定)→ 回 []
//     (詳情頁該段自動隱藏 · graceful)。
//   · 9 局正規賽投影 · 排除平手(MLB 延長賽分勝負 · 平局不是終局比分)· 純函式 deterministic
//     (同 lib/soccer 的 Dixon-Coles 卜瓦松精神 · 開源可稽核)。
// ─────────────────────────────────────────────────────

import type { ScoreBucket } from "@/lib/matches";

// ERA 只算自責分 + 多半只到先發退場 → 略放大成「全場兩隊總得分」的錨點。 clamp 防極端。
const ERA_SUM_FACTOR = 1.15;
const TOTAL_MIN = 5.5;
const TOTAL_MAX = 13;

function poisson(k: number, lambda: number): number {
  if (lambda <= 0) return k === 0 ? 1 : 0;
  let p = Math.exp(-lambda); // e^-λ · λ^k / k!
  for (let i = 1; i <= k; i++) p *= lambda / i;
  return p;
}

/**
 * P(主隊「贏這場球」)· 獨立卜瓦松 Poisson(λh)/Poisson(λa)。
 * 🔴 對齊 engineWinHomePct 的語意 = P(home wins the GAME)· MLB 不會平手:9 局打平 → 延長賽
 *   分勝負 ≈ 五五波,故正規賽平手的機率質量分一半給主隊(pHome + pTie/2)。 之前只算
 *   P(正規賽主隊得分 > 客隊)= 把 ~12% 平手質量當「沒人贏」→ 真實 game-win 比鎖定勝率高 5-8 點
 *   (對抗稽核抓到)。 δ 對此值單調遞增 → 二分搜尋仍有效。
 */
function pHomeWinGame(lh: number, la: number, maxRuns = 18): number {
  let pHome = 0;
  let pTie = 0;
  for (let h = 0; h <= maxRuns; h++) {
    const ph = poisson(h, lh);
    for (let a = 0; a <= maxRuns; a++) {
      const p = ph * poisson(a, la);
      if (h > a) pHome += p;
      else if (h === a) pTie += p;
    }
  }
  return pHome + pTie * 0.5;
}

/**
 * 推導 MLB 最可能比分 TOP 5(home : away 格式 · probability 0-100)。
 * homeWinPct = 賽前鎖定的主隊勝率(0-100)· homeEra/awayEra = 兩隊先發 ERA 字串。
 * 任一 ERA 非數字(投手未定 / "—")→ 回 []。
 */
export function deriveMlbTopScores(
  homeWinPct: number,
  homeEra: string,
  awayEra: string,
): ScoreBucket[] {
  const he = parseFloat(homeEra);
  const ae = parseFloat(awayEra);
  if (!Number.isFinite(he) || !Number.isFinite(ae)) return [];
  if (!Number.isFinite(homeWinPct)) return []; // 防禦:勝率壞 → 退空表(詳情頁該段自動隱藏)

  // 1 · 總得分節奏(兩隊 ERA 和 → 全場總分 · clamp 防極端)。
  const total = Math.max(TOTAL_MIN, Math.min(TOTAL_MAX, (he + ae) * ERA_SUM_FACTOR));
  const half = total / 2;

  // 2 · 校準 δ:讓卜瓦松的 P(主隊贏這場) = 鎖定勝率(二分搜尋 · pHomeWinGame 對 δ 單調)。
  const target = Math.max(0.05, Math.min(0.95, homeWinPct / 100));
  let lo = -half + 0.4;
  let hi = half - 0.4;
  let delta = 0;
  for (let iter = 0; iter < 40; iter++) {
    delta = (lo + hi) / 2;
    if (pHomeWinGame(half + delta, half - delta) < target) lo = delta;
    else hi = delta;
  }
  const lambdaHome = Math.max(0.4, half + delta);
  const lambdaAway = Math.max(0.4, half - delta);

  // 3 · 比分網格 → 取前 5 名「決勝」比分(排除平手 · 主 : 客)。
  const buckets: ScoreBucket[] = [];
  for (let h = 0; h <= 14; h++) {
    const ph = poisson(h, lambdaHome);
    for (let a = 0; a <= 14; a++) {
      if (h === a) continue; // 平手非 MLB 終局(延長賽分勝負)
      buckets.push({ score: `${h} : ${a}`, probability: ph * poisson(a, lambdaAway) * 100 });
    }
  }
  buckets.sort((x, y) => y.probability - x.probability);
  return buckets
    .slice(0, 5)
    .map((b) => ({ score: b.score, probability: Math.round(b.probability * 10) / 10 }));
}
