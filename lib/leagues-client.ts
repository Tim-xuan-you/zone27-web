"use client";

// ── ZONE 27 · 私人預測聯盟(client actions · migration 0029)──────────────────
// 建立 / 加入 / 退出盟 —— 走 SECURITY DEFINER RPC(伺服器認定 auth.uid())。 同 follows-client
// 姿態:先本地探 session(未登入直接回 'anon' 不打網路)· RPC 錯一律 graceful 映射友善錯誤。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type LeagueError =
  | "anon" // 未登入
  | "bad_name" // 盟名空 / 太長
  | "bad_code" // 邀請碼格式錯
  | "no_such_league" // 查無此碼
  | "league_full" // 盟員已滿
  | "too_many_leagues" // 自建盟太多
  | "too_many_joined" // 加入太多盟
  | "unavailable"; // RPC 不可用(0029 未套 / 網路錯)

export type LeagueOk = { ok: true; id: string; name: string; inviteCode: string };
export type LeagueResult = LeagueOk | { ok: false; error: LeagueError };

const KNOWN_ERRORS: LeagueError[] = [
  "anon",
  "bad_name",
  "bad_code",
  "no_such_league",
  "league_full",
  "too_many_leagues",
  "too_many_joined",
];

// plpgsql raise exception 的訊息會塞進 error.message(可能帶前綴)· 命中已知關鍵字才映射,否則 unavailable。
function mapError(message: string | undefined): LeagueError {
  const m = (message ?? "").toLowerCase();
  for (const e of KNOWN_ERRORS) {
    if (m.includes(e)) return e;
  }
  return "unavailable";
}

function parseRow(data: unknown): LeagueOk | null {
  if (!Array.isArray(data) || data.length === 0) return null;
  const row = data[0] as Record<string, unknown>;
  const id = typeof row.id === "string" ? row.id : "";
  const name = typeof row.name === "string" ? row.name : "";
  const inviteCode = typeof row.invite_code === "string" ? row.invite_code : "";
  if (!id) return null;
  return { ok: true, id, name, inviteCode };
}

async function hasSession(): Promise<ReturnType<typeof createSupabaseBrowserClient> | null> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session ? supabase : null;
}

/** 建立一個盟 · 回新盟(含邀請碼)或友善錯誤。 */
export async function createLeague(name: string): Promise<LeagueResult> {
  const v = name.trim();
  if (!v) return { ok: false, error: "bad_name" };
  try {
    const supabase = await hasSession();
    if (!supabase) return { ok: false, error: "anon" };
    const { data, error } = await supabase.rpc("create_league", { p_name: v });
    if (error) return { ok: false, error: mapError(error.message) };
    const row = parseRow(data);
    return row ?? { ok: false, error: "unavailable" };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

/** 用邀請碼加入 · 回盟或友善錯誤(已在盟內 = 冪等成功)。 */
export async function joinLeague(code: string): Promise<LeagueResult> {
  const v = code.trim().toUpperCase();
  if (!/^[0-9A-F]{6}$/.test(v)) return { ok: false, error: "bad_code" };
  try {
    const supabase = await hasSession();
    if (!supabase) return { ok: false, error: "anon" };
    const { data, error } = await supabase.rpc("join_league", {
      p_invite_code: v,
    });
    if (error) return { ok: false, error: mapError(error.message) };
    const row = parseRow(data);
    return row ?? { ok: false, error: "unavailable" };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

/** 退出一個盟 · 'left' / 'anon' / 'unavailable'。 */
export async function leaveLeague(
  leagueId: string,
): Promise<"left" | "anon" | "unavailable"> {
  try {
    const supabase = await hasSession();
    if (!supabase) return "anon";
    const { data, error } = await supabase.rpc("leave_league", {
      p_league_id: leagueId,
    });
    if (error) return "unavailable";
    return data === "left" ? "left" : data === "anon" ? "anon" : "unavailable";
  } catch {
    return "unavailable";
  }
}

/** 友善錯誤文案(中文 · 訪客語氣)。 */
export function leagueErrorText(e: LeagueError): string {
  switch (e) {
    case "anon":
      return "請先登入(免費)再建立 / 加入聯盟。";
    case "bad_name":
      return "盟名長度 1–40 字。";
    case "bad_code":
      return "邀請碼是 6 碼英數(例如 A3F90C)。";
    case "no_such_league":
      return "查無此邀請碼 · 跟揪你的人再確認一次。";
    case "league_full":
      return "這個盟人數已滿(上限 100)。";
    case "too_many_leagues":
      return "你自建的盟太多了(上限 30)。";
    case "too_many_joined":
      return "你加入的盟太多了(上限 50)。";
    case "unavailable":
    default:
      return "聯盟功能建置中 · 套用後即開通。";
  }
}
