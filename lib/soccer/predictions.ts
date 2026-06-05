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
