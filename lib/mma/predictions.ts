// ── ZONE 27 · MMA 兩向押注 + 戰績(client · 共用 0003 predictions 表)──────────────
// MMA「誰贏」= 兩向(A 勝 / B 勝)· 走跟棒球/足球/網球/羽球同一張 predictions 表 + 同一組 RPC
// (sport-agnostic)· 用 match_id 開頭 `mma-` 分運動 · A→home / B→away 映射存表(同網球/羽球兩向)。
// 和局 / 無效比賽罕見:押注本身只能押 A 或 B;真出和局 → 賽果 results 不含該場 → 自然落 pending(誠實)。
//
// 法律邊界(同 0003):純精神預測 = 遊戲 · 0 金額 · 押了不可改 · 贏只換公開戰績 + 天梯地位,永不換現金。
// 🔴 含輸:✕ 跟 ✓ 一樣進分母 · 先鎖後結:開賽後才押不計入戰績。 GRACEFUL:未登入 / 錯 → 安全空值。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type MmaPick = "a" | "b";

import { gradeMmaPicks } from "@/lib/mma/matches";
import type { MmaPickRow, MmaRecord, MmaResult } from "@/lib/mma/matches";
export { gradeMmaPicks };
export type { MmaPickRow, MmaRecord, MmaResult };

function toStored(p: MmaPick): "home" | "away" {
  return p === "a" ? "home" : "away";
}
function fromStored(v: unknown): MmaPick | null {
  return v === "home" ? "a" : v === "away" ? "b" : null;
}

export type MmaTally = { aCount: number; bCount: number; total: number };
const EMPTY_TALLY: MmaTally = { aCount: 0, bCount: 0, total: 0 };

export const MMA_CROWD_MIN = 5;

/** 某場群眾押注計數(兩向 · anon 可讀)· 錯誤回空(graceful)。 */
export async function getMmaTally(matchId: string): Promise<MmaTally> {
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

/** 兩向人數 → 整數百分比、相加恰 100。 */
export function crowdPercents(t: MmaTally): { a: number; b: number } {
  const total = t.total || 1;
  const a = Math.round((t.aCount / total) * 100);
  return { a, b: 100 - a };
}

/** 我對某場的押注(登入)· 無 / anon / 錯 → null。 */
export async function getMyMmaPrediction(matchId: string): Promise<MmaPick | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_prediction", { p_match_id: matchId });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    return fromStored((data[0] as { pick?: unknown }).pick);
  } catch {
    return null;
  }
}

/** 我所有的 MMA 押注(mma-* · 兩向 · 登入)· 給「你的 UFC 戰績」對帳。 錯 / anon → 空陣列。 */
export async function getMyMmaPicks(): Promise<MmaPickRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_predictions");
    if (error || !Array.isArray(data)) return [];
    const out: MmaPickRow[] = [];
    for (const row of data as { match_id?: unknown; pick?: unknown; created_at?: unknown }[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : "";
      // 隔離:mma- 開頭 · 排除 `~` 玩法後綴(之後若加)· pick 必為 home/away。
      if (!matchId.startsWith("mma-") || matchId.includes("~")) continue;
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
export async function setMmaConfidence(matchId: string, confidence: number): Promise<boolean> {
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
export async function setMmaRationale(matchId: string, rationale: string): Promise<boolean> {
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

export type MmaSubmitResult =
  | { ok: true; pick: MmaPick }
  | { ok: false; reason: "not_logged_in" | "already_predicted" | "invalid" | "error" };

/** 進場押一邊(登入)· 一場一次 · 不可改(server 端 0003 把關)。 */
export async function submitMmaPrediction(
  matchId: string,
  pick: MmaPick,
): Promise<MmaSubmitResult> {
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
