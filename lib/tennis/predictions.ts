// ── ZONE 27 · 網球兩向押注 + 戰績(client · 共用 0003 predictions 表)──────────────
// 網球無和局 = 兩向(A 勝 / B 勝)· 走跟棒球 / 足球同一張 predictions 表 + 同一組 RPC
// (sport-agnostic)· 用 match_id 開頭 `tn-` 分運動 · A→home / B→away 映射存表(同棒球兩向)。
//
// 法律邊界(同 0003):純精神預測 = 遊戲 · 0 金額 · 押了不可改(committed)· 贏只換公開
//   戰績 + 天梯地位,永不換現金 / 有價物。 GRACEFUL:未登入 / 錯 → 安全空值,UI 不 crash。
// 🔴 含輸:✕ 跟 ✓ 一樣進分母 · 不藏(品牌命門)。 先鎖後結:開賽後才押不計入戰績。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type TennisPick = "a" | "b";

// 兩向存進共用表的 home/away 槽(同棒球)· A=home、B=away。
function toStored(p: TennisPick): "home" | "away" {
  return p === "a" ? "home" : "away";
}
function fromStored(v: unknown): TennisPick | null {
  return v === "home" ? "a" : v === "away" ? "b" : null;
}

export type TennisTally = { aCount: number; bCount: number; total: number };
const EMPTY_TALLY: TennisTally = { aCount: 0, bCount: 0, total: 0 };

// 群眾市場線最小樣本(同棒球 / 足球 CROWD_MIN)· 低於此只報人數不畫線(防小樣本假裝大盤)。
export const TENNIS_CROWD_MIN = 5;

/** 某場群眾押注計數(兩向 · anon 可讀)· 錯誤回空(graceful)。 */
export async function getTennisTally(matchId: string): Promise<TennisTally> {
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
export function crowdPercents(t: TennisTally): { a: number; b: number } {
  const total = t.total || 1;
  const a = Math.round((t.aCount / total) * 100);
  return { a, b: 100 - a };
}

/** 我對某場的押注(登入)· 無 / anon / 錯 → null。 */
export async function getMyTennisPrediction(matchId: string): Promise<TennisPick | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_prediction", { p_match_id: matchId });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    return fromStored((data[0] as { pick?: unknown }).pick);
  } catch {
    return null;
  }
}

export type TennisPickRow = { matchId: string; pick: TennisPick; ts: string };

/** 我所有的網球押注(tn-* · 兩向 · 登入)· 給「你的網球戰績」對帳。 錯 / anon → 空陣列。 */
export async function getMyTennisPicks(): Promise<TennisPickRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_predictions");
    if (error || !Array.isArray(data)) return [];
    const out: TennisPickRow[] = [];
    for (const row of data as { match_id?: unknown; pick?: unknown; created_at?: unknown }[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : "";
      // 隔離:tn- 開頭 · 排除 `~` 玩法後綴(之後若加)· pick 必為 home/away。
      if (!matchId.startsWith("tn-") || matchId.includes("~")) continue;
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

export type TennisRecord = {
  /** 已結算場數(先鎖後結 · 不含 pending) */
  n: number;
  hits: number;
  misses: number;
  rate: number | null;
  /** 還沒結算 */
  pending: number;
  /** 開賽後才押 · 誠實剔除(看得見) */
  late: number;
  // ── 你 vs 引擎(同批已結算、且引擎當初有開盤的場)──
  vsN: number;
  vsYouHits: number;
  vsEngineHits: number;
  vsYouRate: number | null;
  vsEngineRate: number | null;
};

/**
 * 兩向對帳(A 勝 / B 勝)· **先鎖後結**:押注時間 ≥ 開賽 → 不計入(同棒球 / 足球)。
 * results:{ [matchId]: { outcome, startISO } }。 enginePicks:matchId → 引擎當初看好邊。
 * 純函式 deterministic。 🔴 含輸:✕ 跟 ✓ 一樣進分母。
 */
export function gradeTennisPicks(
  picks: TennisPickRow[],
  results: Record<string, { outcome: TennisPick; startISO: string }>,
  enginePicks: Record<string, TennisPick> = {},
): TennisRecord {
  let n = 0;
  let hits = 0;
  let pending = 0;
  let late = 0;
  let vsN = 0;
  let vsYouHits = 0;
  let vsEngineHits = 0;
  for (const p of picks) {
    const r = results[p.matchId];
    if (!r) {
      pending += 1;
      continue;
    }
    const t = Date.parse(p.ts);
    const k = Date.parse(r.startISO);
    if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) {
      late += 1;
      continue;
    }
    n += 1;
    const youHit = p.pick === r.outcome;
    if (youHit) hits += 1;
    const ePick = enginePicks[p.matchId];
    if (ePick === "a" || ePick === "b") {
      vsN += 1;
      if (youHit) vsYouHits += 1;
      if (ePick === r.outcome) vsEngineHits += 1;
    }
  }
  return {
    n,
    hits,
    misses: n - hits,
    rate: n > 0 ? Math.round((hits / n) * 100) : null,
    pending,
    late,
    vsN,
    vsYouHits,
    vsEngineHits,
    vsYouRate: vsN > 0 ? Math.round((vsYouHits / vsN) * 100) : null,
    vsEngineRate: vsN > 0 ? Math.round((vsEngineHits / vsN) * 100) : null,
  };
}

/** 賽前宣告把握(校準 · sport-agnostic RPC)· 一次性 · graceful。 */
export async function setTennisConfidence(matchId: string, confidence: number): Promise<boolean> {
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
export async function setTennisRationale(matchId: string, rationale: string): Promise<boolean> {
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

export type TennisSubmitResult =
  | { ok: true; pick: TennisPick }
  | { ok: false; reason: "not_logged_in" | "already_predicted" | "invalid" | "error" };

/** 進場押一邊(登入)· 一場一次 · 不可改(server 端 0003 把關)。 */
export async function submitTennisPrediction(
  matchId: string,
  pick: TennisPick,
): Promise<TennisSubmitResult> {
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
