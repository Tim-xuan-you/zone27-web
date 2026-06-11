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
import type { UserPredictionsMap } from "@/lib/predictions";

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

/** All of my picks across every match (logged-in) · shaped into the same
 *  UserPredictionsMap the dashboard already grades with
 *  aggregatePredictionStats。 Mirrors the server-side getMyPredictionsMap but
 *  runs in the browser — so ISR pages (homepage · /ladder) can stay static
 *  and hydrate the「你 vs 引擎」strip per-user after load. Returns {} on any
 *  error / anon / pre-migration so the strip just stays hidden. */
export async function getMyPredictionsClient(): Promise<UserPredictionsMap> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_predictions");
    if (error || !Array.isArray(data)) return {};
    const map: UserPredictionsMap = {};
    for (const row of data as {
      match_id?: unknown;
      pick?: unknown;
      created_at?: unknown;
    }[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : null;
      // 🔴 足球(fd-*)走獨立計算 · 不混進棒球帳本(同 predictions-server · 準度分開算)。
      if (!matchId || matchId.startsWith("fd-")) continue;
      const pick =
        row.pick === "home" || row.pick === "away" ? row.pick : null;
      const ts = typeof row.created_at === "string" ? row.created_at : "";
      // ts 缺失/非字串 → 整列丟棄(同 server 版 getMyPredictionsMap)· 讓數天數(streak)
      // 與算準度(identity)對同一壞列一致 · 不留 client/server 不對稱接縫。
      if (pick && ts) map[matchId] = { pick, ts };
    }
    return map;
  } catch {
    return {};
  }
}

export type SubmitResult =
  | { ok: true; pick: "home" | "away" }
  | {
      ok: false;
      reason: "not_logged_in" | "already_predicted" | "invalid" | "error";
    };

/** 賽前宣告「我幾成把握」(校準大師 · 0021)· 一次性(server 已設過不覆蓋)· 失敗 graceful。
 *  跟 submit_prediction 分開的 RPC(set_prediction_confidence)→ 對既有押注路徑零風險。 */
export async function setPredictionConfidence(
  matchId: string,
  confidence: number
): Promise<boolean> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("set_prediction_confidence", {
      p_match_id: matchId,
      p_confidence: confidence,
    });
    return !error;
  } catch {
    return false;
  }
}

export type CalibrationPickRow = {
  matchId: string;
  pick: string;
  confidence: number;
  ts: string;
};

/** 本人所有「有填把握」的押注(跨運動 · 校準大師資料源)· anon/錯 → 空。
 *  走 0021 的 get_my_calibration_picks(只回有 confidence 的列)。 */
export async function getMyCalibrationPicks(): Promise<CalibrationPickRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_calibration_picks");
    if (error || !Array.isArray(data)) return [];
    const out: CalibrationPickRow[] = [];
    for (const row of data as {
      match_id?: unknown;
      pick?: unknown;
      confidence?: unknown;
      created_at?: unknown;
    }[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : "";
      const pick = typeof row.pick === "string" ? row.pick : "";
      const confidence = Number(row.confidence);
      if (!matchId || !pick || !Number.isFinite(confidence)) continue;
      out.push({
        matchId,
        pick,
        confidence,
        ts: typeof row.created_at === "string" ? row.created_at : "",
      });
    }
    return out;
  } catch {
    return [];
  }
}

/** 賽前寫一句「我為什麼看好」(押注理由 · 0024)· 一次性(server 已設過不覆蓋 = 先鎖後結)·
 *  失敗 graceful。 跟 submit_prediction 分開的 RPC(set_prediction_rationale)→ 零風險。 */
export async function setPredictionRationale(
  matchId: string,
  rationale: string
): Promise<boolean> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("set_prediction_rationale", {
      p_match_id: matchId,
      p_rationale: rationale,
    });
    return !error;
  } catch {
    return false;
  }
}

/** 本人所有「有寫理由」的押注 → map(matchId → 理由)· 給收據島蓋上「你賽前寫的理由」。
 *  走 0024 的 get_my_rationales(只回有 rationale 的列)· anon/錯/migration 未套 → 空 map(graceful)。
 *  跨運動(不濾 fd-*)· 收據島自己用 matchId 取。 */
export async function getMyRationales(): Promise<Record<string, string>> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_rationales");
    if (error || !Array.isArray(data)) return {};
    const map: Record<string, string> = {};
    for (const row of data as { match_id?: unknown; rationale?: unknown }[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : null;
      const rationale =
        typeof row.rationale === "string" ? row.rationale.trim() : "";
      if (matchId && rationale) map[matchId] = rationale;
    }
    return map;
  } catch {
    return {};
  }
}

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
