// ── ZONE 27 · Predictions Market (shared table · migration 0003) ──
// Client-side wrappers for the play-money prediction market. ALL access
// goes through the SECURITY DEFINER RPCs defined in
// supabase/migrations/0003_predictions_market.sql (the `predictions`
// table is RLS-locked · no direct table access). Mirrors the
// lib/follows.ts browser-client pattern.
//
// LEGAL (hard line):
//   · pick = "home" | "away" only · this layer has 0 money · 0 reward ·
//     0 兌換有價物。 Pure-virtual prediction = a game, not gambling
//     (per /audit · 0 sportsbook revenue redline). Winning a pick gets
//     you PUBLIC RECORD + ladder standing — never cash or physical prizes.
//   · Picks are IMMUTABLE (one per match · server-enforced via the
//     one-per-user-match unique index + the already_predicted guard) =
//     先鎖後結 integrity + anti-cheat.
//
// GRACEFUL DEGRADATION: every function swallows errors and returns a safe
// empty/neutral value so the UI never crashes — e.g. before the migration
// is applied, or for anonymous visitors, the crowd line just reads empty.
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type MarketTally = {
  homeCount: number;
  awayCount: number;
  total: number;
  /** home share of decided picks (0-100) · null when 0 picks */
  homePct: number | null;
};

const EMPTY_TALLY: MarketTally = {
  homeCount: 0,
  awayCount: 0,
  total: 0,
  homePct: null,
};

// 群眾市場線最小樣本 · 低於此只報實際人數,不畫百分比 bar。
// 拿 N=1 畫「100% 押 X」= 報馬仔拿小樣本假裝「大盤共識」的手法 · 品牌不做。
// 呼應全站樣本紀律:作者徽章 N≥10 才掛準度、天梯 10 場才上榜、
// methodology N≥30 SAMPLE DEBT。 滿這個數,群眾線才畫得出來。
export const CROWD_LINE_MIN = 5;

/** Public crowd tally for a match (anon-readable). Returns an empty tally
 *  on any error so the UI degrades gracefully. */
export async function getMatchTally(matchId: string): Promise<MarketTally> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_match_prediction_tally", {
      p_match_id: matchId,
    });
    if (error || !Array.isArray(data) || data.length === 0) return EMPTY_TALLY;
    const row = data[0] as {
      home_count: number | string;
      away_count: number | string;
      total: number | string;
    };
    const homeCount = Number(row.home_count) || 0;
    const awayCount = Number(row.away_count) || 0;
    const total = Number(row.total) || 0;
    const decided = homeCount + awayCount;
    return {
      homeCount,
      awayCount,
      total,
      homePct: decided > 0 ? Math.round((homeCount / decided) * 100) : null,
    };
  } catch {
    return EMPTY_TALLY;
  }
}

/** My pick for a match (logged-in). null if none / anon / error. */
export async function getMyPrediction(
  matchId: string
): Promise<"home" | "away" | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_prediction", {
      p_match_id: matchId,
    });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const pick = (data[0] as { pick?: unknown }).pick;
    return pick === "home" || pick === "away" ? pick : null;
  } catch {
    return null;
  }
}

export type SubmitResult =
  | { ok: true; pick: "home" | "away" }
  | {
      ok: false;
      reason: "not_logged_in" | "already_predicted" | "invalid" | "error";
    };

/** Enter the market: submit a pick (logged-in). One per match · immutable
 *  (server-enforced). */
export async function submitPrediction(
  matchId: string,
  pick: "home" | "away"
): Promise<SubmitResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { ok: false, reason: "not_logged_in" };
    const { error } = await supabase.rpc("submit_prediction", {
      p_match_id: matchId,
      p_pick: pick,
    });
    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("not_logged_in")) return { ok: false, reason: "not_logged_in" };
      if (msg.includes("already_predicted")) return { ok: false, reason: "already_predicted" };
      if (msg.includes("invalid")) return { ok: false, reason: "invalid" };
      return { ok: false, reason: "error" };
    }
    return { ok: true, pick };
  } catch {
    return { ok: false, reason: "error" };
  }
}
