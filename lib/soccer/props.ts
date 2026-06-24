// ── ZONE 27 · 足球玩法併入「你的足球戰績」(同一本帳 · Tim 2026-06-23 拍板)──────────
// 棒球大小分已併入「誰贏」同一本戰績(虛擬比賽法 · lib/baseball-totals.ts baseballPropIdMatches)。
// 這支是足球的對等:把大小分(~ou25)+ 讓分(~ah05)的押注,當「虛擬賽果」餵進 gradeSoccerPicks
// → 玩法跟三向(主勝/和/客勝)算同一本足球戰績(一運動一本)。 2 注都中 = 2 勝。
//
// 為什麼足球走另一支(不是 baseballPropIdMatches):足球「誰贏」管線是 gradeSoccerPicks(吃
// SoccerPickRow + 賽果 outcome map)· 不走棒球的 aggregateIdentity/IdentityMatch。 故這裡產出的是
// 「玩法虛擬賽果 map」(soccerPropResults)+「玩法引擎看好邊」(soccerPropEnginePicks),配上各頁
// 讀到的玩法押注(getMySoccerPropPicks / getPredictionsByCode().soccerProps)一起餵 gradeSoccerPicks。
//
// 🔴 線固定(大小分 2.5 / 讓分 0.5)→ 賽前賽後算出同一條 → **不需把線值凍進場號**(不像棒球大小分
//   線會隨全季得分基線位移、必須凍線 + bouLineFromMarketId 解凍)。 足球玩法後綴本身就是線(~ou25/~ah05)。
// 🔴 隔離邊界仍在:玩法**只**併「你的足球戰績」(gradeSoccerPicks)· 絕不進①校準準度曲線(數學上
//   不能把不同玩法的機率畫在同一條校準線 · profile-server 已用 !isProp 守門)②活動脈動(pulse)
//   ③結算收件匣(settlement-data)④跨用戶天梯(足球本來就不上天梯 · 準度分開算)。
// 🔴 純函式 · 0 I/O。 不 import locked.ts 的資料讀取(soccer-locked.json)→ 可安全在 client 元件
//   (SoccerRecordCard)用 soccerPropResults 而不把整份鎖定檔打進前端 bundle。 引擎看好邊那支吃
//   傳入的鎖定盤陣列(由 server 端 locked.ts getSoccerEnginePicksAll 餵)。
// ─────────────────────────────────────────────────────

import {
  OU_LINE,
  ouMarketId,
  ouResultFromScore,
  ouSideToPick,
  isOuMarketId,
} from "./over-under";
import {
  AH_LINE,
  ahMarketId,
  ahResultFromScore,
  isAhMarketId,
} from "./handicap";
import { deriveSoccerMarkets } from "./engine";
import type { SoccerPick } from "./predictions";
import type { SoccerResult } from "./football-data";
import type { LockedSoccerPrediction } from "./locked";

/** 是否為足球玩法場號(大小分 / 讓分)。 */
export function isSoccerPropMarketId(id: string): boolean {
  return isOuMarketId(id) || isAhMarketId(id);
}

/**
 * 把基礎賽事的終場比分展開成「玩法虛擬賽果」(給 gradeSoccerPicks 對帳)。
 * 每場各發大小分(~ou25)+ 讓分(~ah05)兩筆虛擬賽果:
 *   · ~ou25:看大 = home · 看小 = away(ouSideToPick)· 90 分鐘總分 ≥3 → 大。
 *   · ~ah05:主 −0.5(主隊贏才過)= home · 客 +0.5(贏或和都過)= away(ahResultFromScore)。
 * key = 玩法場號(`{fd-id}~ou25` / `{fd-id}~ah05`)→ 跟用戶押注存的場號完全對得上。
 * kickoffISO 沿用基礎賽事(先鎖後結 late 判定用同一個開賽時戳)。 缺比分 → 略過(graceful)。
 */
export function soccerPropResults(
  results: SoccerResult[],
): Record<string, { outcome: SoccerPick; kickoffISO: string }> {
  const out: Record<string, { outcome: SoccerPick; kickoffISO: string }> = {};
  for (const r of results) {
    if (typeof r.homeGoals !== "number" || typeof r.awayGoals !== "number") continue;
    out[ouMarketId(r.matchId)] = {
      outcome: ouSideToPick(ouResultFromScore(r.homeGoals, r.awayGoals)),
      kickoffISO: r.kickoffISO,
    };
    out[ahMarketId(r.matchId)] = {
      outcome: ahResultFromScore(r.homeGoals, r.awayGoals), // home/away · 讓分本來就隊側
      kickoffISO: r.kickoffISO,
    };
  }
  return out;
}

/**
 * 引擎當初對玩法的看好邊(給「你 vs 引擎」同場對照)。 從鎖定的兩邊預期進球 λ 重建同一張
 * 比分表推導(deriveSoccerMarkets · 固定 2.5 / 0.5 線)→ 與卡片顯示的玩法機率同源、零 drift。
 *   · ~ou25:overPct > 50 → 引擎偏「大」= home · < 50 → 偏「小」= away · 剛好 50 → 不帶(銅板局不灌引擎水)。
 *   · ~ah05:homePct > 50 → 引擎偏「主」= home · < 50 → 偏「客」= away · 50 → 不帶。
 * 舊紀錄(R203 首批世界盃)無 xg → 無從重建玩法線 → 略過(那批場的玩法不進 vs-引擎對照,但
 * 用戶自己這手的對錯照常計入足球戰績 · 同棒球「只有引擎當下那條線帶 engineFav」的紀律)。
 */
export function soccerPropEnginePicks(
  locked: LockedSoccerPrediction[],
): Record<string, SoccerPick> {
  const out: Record<string, SoccerPick> = {};
  for (const p of locked) {
    if (typeof p.xgHome !== "number" || typeof p.xgAway !== "number") continue;
    const m = deriveSoccerMarkets(p.xgHome, p.xgAway, {
      totalLines: [OU_LINE],
      handicapLines: [AH_LINE],
    });
    const ou = m.totals[0];
    if (ou && ou.overPct !== 50) {
      out[ouMarketId(p.matchId)] = ou.overPct > 50 ? "home" : "away";
    }
    const ah = m.handicaps[0];
    if (ah && ah.homePct !== 50) {
      out[ahMarketId(p.matchId)] = ah.homePct > 50 ? "home" : "away";
    }
  }
  return out;
}
