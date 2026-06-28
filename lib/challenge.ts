import type { Match } from "@/lib/matches";
import { getMatchById, getMatchStartIso, matchHasStarted } from "@/lib/matches";
import { getMlbMatchById } from "@/lib/mlb-matches";
import {
  getProfileByCode,
  getPredictionsByCode,
  type PublicProfile,
} from "@/lib/profile-server";

// ── ZONE 27 · 戰帖對決 · resolve(server · 單一真相 · 給 /vs 頁 + OG 卡共用)──────────
// 散播命門(2026-06-28 · 真瓶頸是散播不是功能):站上每張「可外傳收據」都是廣播(看我的牌)·
// 廣播只換來一句「讚」就死。 缺的是把分享變成「逼對方回手的戰帖」。 解 = 把今日一戰變一張
// 你會『想』傳給朋友的戰帖:Tim 鎖完一手 → 傳 /vs/<他的碼> → 朋友點開看不到他押誰、得先
// 自己盲押一手、賽後才揭盅誰讀得準。 散播(戰帖是天然的、不像垃圾訊息的邀請)+ 留存(盲押→
// 揭盅→賽後對帳)一個機制全解 · 零紅線(盲押結構上防跟單)· 零 migration(用現成公開 RPC join 同場)。
//
// 這支只做一件事:給一個永久碼,算出「他最近一張還能應戰的戰帖」(= 他最近鎖、還沒開賽的棒球
// 那一手)· /vs 頁與 OG 卡都讀這支 = 卡片跟頁面永遠同一場(防 DRY 漂移)。
//
// 🔴 v1 範圍 = 棒球型(CPBL + MLB · home/away 兩向 · 重用 CardBetStrip 下注流 · 同今日一戰)。
//   足球/網球/羽球/UFC 各有自己的下注元件 · 之後再擴。
// ─────────────────────────────────────────────────────

export type ChallengePhase = "pregame" | "live" | "settled";

export type ChallengeResolution = {
  /** 下戰帖的人(公開身分 · 永久碼 · tier 金環)· 一定有(查無碼 → 整支回 null = 404)。 */
  profile: PublicProfile;
  /** 應戰的那一場(棒球 · 解析得到才有)· null = 他還沒下任何一手可應戰的棒球手。 */
  match: Match | null;
  /** 下戰帖的人在這場押的一手(賽前對訪客封盤 · 揭盅才顯)· match 為 null 時也 null。 */
  challengerPick: "home" | "away" | null;
  /** 這場現在的階段(賽前可應戰 / 已開賽封盤 / 已賽後對帳)· match 為 null 時也 null。 */
  phase: ChallengePhase | null;
  /** 賽果(賽後對帳用 · 棒球和局 = tie = push)· 未結算 / 無 match → null。 */
  finalWinner: "home" | "away" | "tie" | null;
};

// 棒球賽事用 id 解析:CPBL 靜態(sync)· MLB live + 永久鎖定源(async)· 其餘運動 → null(v1 棒球型)。
async function resolveMatch(matchId: string): Promise<Match | null> {
  if (matchId.startsWith("cpbl-")) return getMatchById(matchId) ?? null;
  if (matchId.startsWith("mlb-")) return await getMlbMatchById(matchId);
  return null;
}

function phaseOf(match: Match): ChallengePhase {
  if (match.finalResult) return "settled"; // 結算優先(手動 finalResult 永遠先 · 同全站口徑)
  if (matchHasStarted(getMatchStartIso(match))) return "live"; // 已開賽 · 封盤
  return "pregame"; // 賽前 · 還能應戰
}

/**
 * 用永久碼算出他「最近一張還能應戰的戰帖」。
 * 查無碼 → null(頁面 404)。 有碼但沒可應戰的棒球手 → match=null(頁面顯示誠實空狀態)。
 *
 * 選場規則:① 指定 ?m=(且他真的押過)優先 ② 否則挑「賽前(可應戰)裡最近鎖的一手」
 * ③ 都已開賽/結算 → 挑最近鎖的一手(當「過去的對決」秀賽果)。
 */
export async function resolveChallenge(
  code: string,
  matchIdOverride?: string | null,
): Promise<ChallengeResolution | null> {
  const profile = await getProfileByCode(code);
  if (!profile) return null;

  const empty: ChallengeResolution = {
    profile,
    match: null,
    challengerPick: null,
    phase: null,
    finalWinner: null,
  };

  const { baseball } = await getPredictionsByCode(code);
  // baseball = { [matchId]: { pick: "home"|"away", ts } } · 已是 allowlist(cpbl-/mlb-)· 排除玩法(~)。
  const entries = Object.entries(baseball)
    .filter(([id]) => !id.includes("~"))
    .map(([id, v]) => ({ id, pick: v.pick, ts: v.ts }));
  if (entries.length === 0) return empty;

  // 解析成真賽事(MLB async · 平行)· 解不到的(資料過舊掉出窗等)丟棄。
  const resolved = (
    await Promise.all(
      entries.map(async (e) => {
        const match = await resolveMatch(e.id);
        return match ? { ...e, match } : null;
      }),
    )
  ).filter(Boolean) as {
    id: string;
    pick: "home" | "away";
    ts: string;
    match: Match;
  }[];
  if (resolved.length === 0) return empty;

  // ① 指定 ?m=(且他真的押過該場)優先 —— 讓「就比這場」的精準戰帖連結成立。
  let chosen = matchIdOverride
    ? resolved.find((r) => r.id === matchIdOverride) ?? null
    : null;
  // ② 否則挑賽前(可應戰)裡最近鎖的;③ 沒有賽前的 → 全部裡最近鎖的(秀賽果)。
  if (!chosen) {
    const pregame = resolved.filter((r) => phaseOf(r.match) === "pregame");
    const pool = pregame.length > 0 ? pregame : resolved;
    chosen = pool.reduce((a, b) => (a.ts >= b.ts ? a : b));
  }

  return {
    profile,
    match: chosen.match,
    challengerPick: chosen.pick,
    phase: phaseOf(chosen.match),
    finalWinner: chosen.match.finalResult?.winner ?? null,
  };
}
