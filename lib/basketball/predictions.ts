// ── ZONE 27 · 籃球兩向押注 + 戰績(client · 共用 0003 predictions 表)──────────────
// 籃球「誰贏」= 兩向(主勝 / 客勝)· 走跟棒球/足球/網球/羽球/MMA 同一張 predictions 表 + 同一組 RPC
// (sport-agnostic)· 用 match_id 開頭 `bk-` 分運動。 🔴 籃球 pick 本來就是 home/away(同棒球 ·
// 不像網球/羽球/MMA 要 a/b↔home/away 轉換)→ toStored/fromStored = identity,最單純的一條。
// 🔴 籃球無和局(延長賽分勝負)→ 沒有 push / null pick(比 MMA 更簡單:不留「銅板」例外)。
//
// 法律邊界(同 0003):純精神預測 = 遊戲 · 0 金額 · 押了不可改 · 贏只換公開戰績 + 天梯地位,永不換現金。
// 🔴 含輸:✕ 跟 ✓ 一樣進分母 · 先鎖後結:開賽後才押不計入戰績。 GRACEFUL:未登入 / 錯 → 安全空值。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { BasketballPick } from "@/lib/basketball/engine";

export type { BasketballPick };

import { gradeBasketballPicks } from "@/lib/basketball/matches";
import type {
  BasketballPickRow,
  BasketballRecord,
  BasketballResult,
} from "@/lib/basketball/matches";
export { gradeBasketballPicks };
export type { BasketballPickRow, BasketballRecord, BasketballResult };

// 籃球 pick 就是存表的 home/away(無轉換 · 同棒球)。
function fromStored(v: unknown): BasketballPick | null {
  return v === "home" ? "home" : v === "away" ? "away" : null;
}

export type BasketballTally = { homeCount: number; awayCount: number; total: number };
const EMPTY_TALLY: BasketballTally = { homeCount: 0, awayCount: 0, total: 0 };

export const BASKETBALL_CROWD_MIN = 5;

/** 某場群眾押注計數(兩向 · anon 可讀)· 錯誤回空(graceful)。 */
export async function getBasketballTally(gameId: string): Promise<BasketballTally> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_match_prediction_tally", {
      p_match_id: gameId,
    });
    if (error || !Array.isArray(data) || data.length === 0) return EMPTY_TALLY;
    const r = data[0] as { home_count?: unknown; away_count?: unknown; total?: unknown };
    return {
      homeCount: Number(r.home_count) || 0,
      awayCount: Number(r.away_count) || 0,
      total: Number(r.total) || 0,
    };
  } catch {
    return EMPTY_TALLY;
  }
}

/** 兩向人數 → 整數百分比、相加恰 100。 */
export function crowdPercents(t: BasketballTally): { home: number; away: number } {
  const total = t.total || 1;
  const home = Math.round((t.homeCount / total) * 100);
  return { home, away: 100 - home };
}

/** 我對某場的押注(登入)· 無 / anon / 錯 → null。 */
export async function getMyBasketballPrediction(gameId: string): Promise<BasketballPick | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_prediction", { p_match_id: gameId });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    return fromStored((data[0] as { pick?: unknown }).pick);
  } catch {
    return null;
  }
}

/** 我所有的籃球押注(bk-* · 兩向 · 登入)· 給「你的籃球戰績」對帳。 錯 / anon → 空陣列。 */
export async function getMyBasketballPicks(): Promise<BasketballPickRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_predictions");
    if (error || !Array.isArray(data)) return [];
    const out: BasketballPickRow[] = [];
    for (const row of data as { match_id?: unknown; pick?: unknown; created_at?: unknown }[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : "";
      // 隔離:bk- 開頭 · 排除 `~` 玩法後綴(之後若加大小分)· pick 必為 home/away。
      if (!matchId.startsWith("bk-") || matchId.includes("~")) continue;
      const pick = fromStored(row.pick);
      if (!pick) continue;
      out.push({
        matchId,
        pick,
        ts: typeof row.created_at === "string" ? row.created_at : "",
      });
    }
    return out;
  } catch {
    return [];
  }
}

/** 賽前宣告把握(校準 · sport-agnostic RPC)· 一次性 · graceful。 */
export async function setBasketballConfidence(gameId: string, confidence: number): Promise<boolean> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("set_prediction_confidence", {
      p_match_id: gameId,
      p_confidence: confidence,
    });
    return !error;
  } catch {
    return false;
  }
}

/** 賽前寫一句押注理由 · 一次性 · graceful。 */
export async function setBasketballRationale(gameId: string, rationale: string): Promise<boolean> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("set_prediction_rationale", {
      p_match_id: gameId,
      p_rationale: rationale,
    });
    return !error;
  } catch {
    return false;
  }
}

export type BasketballSubmitResult =
  | { ok: true; pick: BasketballPick }
  | { ok: false; reason: "not_logged_in" | "already_predicted" | "invalid" | "error" };

/** 進場押一邊(登入)· 一場一次 · 不可改(server 端 0003 把關)。 */
export async function submitBasketballPrediction(
  gameId: string,
  pick: BasketballPick,
): Promise<BasketballSubmitResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { ok: false, reason: "not_logged_in" };
    const { error } = await supabase.rpc("submit_prediction", {
      p_match_id: gameId,
      p_pick: pick, // 籃球 pick 即存表值(home/away · 無轉換)
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
