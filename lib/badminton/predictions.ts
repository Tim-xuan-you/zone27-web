// ── ZONE 27 · 羽球兩向押注 + 戰績(client · 共用 0003 predictions 表)──────────────
// 羽球無和局 = 兩向(A 勝 / B 勝)· 走跟棒球 / 足球 / 網球同一張 predictions 表 + 同一組 RPC
// (sport-agnostic)· 用 match_id 開頭 `bd-` 分運動 · A→home / B→away 映射存表(同網球兩向)。
//
// 法律邊界(同 0003):純精神預測 = 遊戲 · 0 金額 · 押了不可改(committed)· 贏只換公開
//   戰績 + 天梯地位,永不換現金 / 有價物。 GRACEFUL:未登入 / 錯 → 安全空值,UI 不 crash。
// 🔴 含輸:✕ 跟 ✓ 一樣進分母 · 不藏(品牌命門)。 先鎖後結:開賽後才押不計入戰績。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type BadmintonPick = "a" | "b";

// 戰績算法 + 型別放在 server-safe 的 lib/badminton/matches(那支不 import browser client →
// 可進 server component 如 /u 公開檔)· 這裡 re-export 給 client 卡(BadmintonRecordCard)沿用 —
// 一份算法兩處共用,零 drift。
import { gradeBadmintonPicks } from "@/lib/badminton/matches";
import type { BadmintonPickRow, BadmintonRecord } from "@/lib/badminton/matches";
export { gradeBadmintonPicks };
export type { BadmintonPickRow, BadmintonRecord };

// 兩向存進共用表的 home/away 槽(同網球)· A=home、B=away。
function toStored(p: BadmintonPick): "home" | "away" {
  return p === "a" ? "home" : "away";
}
function fromStored(v: unknown): BadmintonPick | null {
  return v === "home" ? "a" : v === "away" ? "b" : null;
}

export type BadmintonTally = { aCount: number; bCount: number; total: number };
const EMPTY_TALLY: BadmintonTally = { aCount: 0, bCount: 0, total: 0 };

// 群眾市場線最小樣本(同棒球 / 足球 / 網球 CROWD_MIN)· 低於此只報人數不畫線。
export const BADMINTON_CROWD_MIN = 5;

/** 某場群眾押注計數(兩向 · anon 可讀)· 錯誤回空(graceful)。 */
export async function getBadmintonTally(matchId: string): Promise<BadmintonTally> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_match_prediction_tally", {
      p_match_id: matchId,
    });
    if (error || !Array.isArray(data) || data.length === 0) return EMPTY_TALLY;
    const r = data[0] as { home_count?: unknown; away_count?: unknown; total?: unknown };
    return {
      aCount: Number(r.home_count) || 0,
      bCount: Number(r.away_count) || 0,
      total: Number(r.total) || 0,
    };
  } catch {
    return EMPTY_TALLY;
  }
}

/** 兩向人數 → 整數百分比、相加恰 100(最大餘數法 · 同引擎)。 */
export function crowdPercents(t: BadmintonTally): { a: number; b: number } {
  const total = t.total || 1;
  const a = Math.round((t.aCount / total) * 100);
  return { a, b: 100 - a };
}

/** 我對某場的押注(登入)· 無 / anon / 錯 → null。 */
export async function getMyBadmintonPrediction(
  matchId: string,
): Promise<BadmintonPick | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_prediction", { p_match_id: matchId });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    return fromStored((data[0] as { pick?: unknown }).pick);
  } catch {
    return null;
  }
}

/** 我所有的羽球押注(bd-* · 兩向 · 登入)· 給「你的羽球戰績」對帳。 錯 / anon → 空陣列。 */
export async function getMyBadmintonPicks(): Promise<BadmintonPickRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_predictions");
    if (error || !Array.isArray(data)) return [];
    const out: BadmintonPickRow[] = [];
    for (const row of data as { match_id?: unknown; pick?: unknown; created_at?: unknown }[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : "";
      // 隔離:bd- 開頭 · 排除 `~` 玩法後綴(之後若加)· pick 必為 home/away。
      if (!matchId.startsWith("bd-") || matchId.includes("~")) continue;
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
export async function setBadmintonConfidence(
  matchId: string,
  confidence: number,
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

/** 賽前寫一句押注理由 · 一次性 · graceful。 */
export async function setBadmintonRationale(
  matchId: string,
  rationale: string,
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

export type BadmintonSubmitResult =
  | { ok: true; pick: BadmintonPick }
  | { ok: false; reason: "not_logged_in" | "already_predicted" | "invalid" | "error" };

/** 進場押一邊(登入)· 一場一次 · 不可改(server 端 0003 把關)。 */
export async function submitBadmintonPrediction(
  matchId: string,
  pick: BadmintonPick,
): Promise<BadmintonSubmitResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { ok: false, reason: "not_logged_in" };
    const { error } = await supabase.rpc("submit_prediction", {
      p_match_id: matchId,
      p_pick: toStored(pick),
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
