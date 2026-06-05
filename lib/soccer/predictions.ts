// ── ZONE 27 · 足球三向押注(client · 共用 0003 表 + 0018 draw)──────────
// 足球是三向:主勝 / 和 / 客勝。 走跟棒球同一張 predictions 表 + 同一組 RPC
// (0018 已放寬 pick 允許 'draw')· 用 match_id 開頭分運動(fd-*=足球)。
//
// 法律邊界(同 0003):純精神預測 = 遊戲 · 0 金額 · 押了不可改(committed)·
//   贏只換公開戰績 + 天梯地位,永不換現金/有價物。
// GRACEFUL:0018 未套 / 未登入 / 錯 → 安全空值,UI 不 crash。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type SoccerPick = "home" | "draw" | "away";

export type SoccerTally = {
  homeCount: number;
  drawCount: number;
  awayCount: number;
  total: number;
};

const EMPTY_TALLY: SoccerTally = { homeCount: 0, drawCount: 0, awayCount: 0, total: 0 };

// 群眾市場線最小樣本(同棒球 CROWD_LINE_MIN)· 低於此只報人數不畫 bar
// (防小樣本假裝大盤共識 = 報馬仔手法)。
export const SOCCER_CROWD_MIN = 5;

function isPick(v: unknown): v is SoccerPick {
  return v === "home" || v === "draw" || v === "away";
}

/** 某場的群眾押注計數(三向 · anon 可讀)· 錯誤回空(graceful)。 */
export async function getSoccerTally(matchId: string): Promise<SoccerTally> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_match_prediction_tally", {
      p_match_id: matchId,
    });
    if (error || !Array.isArray(data) || data.length === 0) return EMPTY_TALLY;
    const r = data[0] as {
      home_count?: unknown;
      draw_count?: unknown;
      away_count?: unknown;
      total?: unknown;
    };
    return {
      homeCount: Number(r.home_count) || 0,
      // 0018 未套的舊 tally 無 draw_count → 0(graceful)
      drawCount: Number(r.draw_count) || 0,
      awayCount: Number(r.away_count) || 0,
      total: Number(r.total) || 0,
    };
  } catch {
    return EMPTY_TALLY;
  }
}

/** 三向人數 → 整數百分比、且三者相加恰為 100(最大餘數法 · 同引擎 toDisplayPercents ·
 *  避免「33/33/33=99」或「34/33/34=101」跟上方引擎開盤的精準顯示打架)。 */
export function crowdPercents(t: SoccerTally): {
  home: number;
  draw: number;
  away: number;
} {
  const total = t.total || 1;
  const raw = [
    { k: "home" as const, v: (t.homeCount / total) * 100 },
    { k: "draw" as const, v: (t.drawCount / total) * 100 },
    { k: "away" as const, v: (t.awayCount / total) * 100 },
  ];
  const floored = raw.map((r) => ({ ...r, f: Math.floor(r.v), rem: r.v - Math.floor(r.v) }));
  let rem = 100 - floored.reduce((s, r) => s + r.f, 0);
  floored
    .slice()
    .sort((a, b) => b.rem - a.rem)
    .forEach((r) => {
      if (rem > 0) {
        r.f += 1;
        rem -= 1;
      }
    });
  const out = { home: 0, draw: 0, away: 0 };
  for (const r of floored) out[r.k] = r.f;
  return out;
}

/** 我對某場的押注(登入)· 無 / anon / 錯 → null。 */
export async function getMySoccerPrediction(
  matchId: string,
): Promise<SoccerPick | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_prediction", {
      p_match_id: matchId,
    });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const pick = (data[0] as { pick?: unknown }).pick;
    return isPick(pick) ? pick : null;
  } catch {
    return null;
  }
}

export type SoccerPickRow = { matchId: string; pick: SoccerPick; ts: string };

/** 我所有的足球押注(fd-* · 三向 · 登入)· 給「你的足球戰績」對帳。 錯/anon → 空陣列。
 *  注意:棒球的 getMyPredictionsMap 已把 fd-* 排除(準度分開算)· 這支專讀 fd-*。 */
export async function getMySoccerPicks(): Promise<SoccerPickRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_predictions");
    if (error || !Array.isArray(data)) return [];
    const out: SoccerPickRow[] = [];
    for (const row of data as {
      match_id?: unknown;
      pick?: unknown;
      created_at?: unknown;
    }[]) {
      const matchId = typeof row.match_id === "string" ? row.match_id : "";
      if (!matchId.startsWith("fd-") || !isPick(row.pick)) continue;
      out.push({
        matchId,
        pick: row.pick,
        ts: typeof row.created_at === "string" ? row.created_at : "",
      });
    }
    return out;
  } catch {
    return [];
  }
}

export type SoccerRecord = {
  /** 已結算場數(先鎖後結後 · 不含平台 pending) */
  n: number;
  hits: number;
  misses: number;
  /** 命中率 0-100 · null 當 n=0 */
  rate: number | null;
  /** 還沒結算(比賽還沒打完 / 結果還沒回來) */
  pending: number;
};

/**
 * 三向對帳(主勝/和/客勝)· **先鎖後結**:開賽後才下的不計入(同棒球 isLatePick)。
 * results:{ [matchId]: { outcome, kickoffISO } }。 純函式 deterministic。
 * 🔴 含輸:✕ 跟 ✓ 一樣進分母 · 不藏(品牌命門)。
 */
export function gradeSoccerPicks(
  picks: SoccerPickRow[],
  results: Record<string, { outcome: SoccerPick; kickoffISO: string }>,
): SoccerRecord {
  let n = 0;
  let hits = 0;
  let pending = 0;
  for (const p of picks) {
    const r = results[p.matchId];
    if (!r) {
      pending += 1; // 還沒結算
      continue;
    }
    // 先鎖後結:押注時間 ≥ 開賽 → 賽後補登,不算進戰績(防作弊 · 同棒球)
    const t = Date.parse(p.ts);
    const k = Date.parse(r.kickoffISO);
    if (!Number.isNaN(t) && !Number.isNaN(k) && t >= k) continue;
    n += 1;
    if (p.pick === r.outcome) hits += 1;
  }
  return {
    n,
    hits,
    misses: n - hits,
    rate: n > 0 ? Math.round((hits / n) * 100) : null,
    pending,
  };
}

export type SoccerSubmitResult =
  | { ok: true; pick: SoccerPick }
  | { ok: false; reason: "not_logged_in" | "already_predicted" | "invalid" | "error" };

/** 進場押一邊(登入)· 一場一次 · 不可改(server 端 0003 把關)。 */
export async function submitSoccerPrediction(
  matchId: string,
  pick: SoccerPick,
): Promise<SoccerSubmitResult> {
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
