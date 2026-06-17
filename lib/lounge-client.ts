"use client";

// ── ZONE 27 · 會員之間的房間(client actions · migration 0030)──────────────────
// 發言 / 撤回 —— 走 SECURITY DEFINER RPC(伺服器認定 auth.uid() + z27_is_member)。 同 leagues-client
// 姿態:先本地探 session(未登入直接回 'anon' 不打網路)· RPC 錯一律 graceful 映射友善錯誤。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type LoungeError =
  | "anon" // 未登入
  | "members_only" // 登入了但不是付費會員
  | "empty" // 內容空白
  | "too_long" // 超過 1000 字
  | "rate_limit" // 一小時內發太多
  | "unavailable"; // RPC 不可用(0030 未套 / 網路錯)

export type LoungePostResult =
  | { ok: true; id: string }
  | { ok: false; error: LoungeError };

const KNOWN_ERRORS: LoungeError[] = ["members_only", "rate_limit", "too_long", "empty"];

function mapError(message: string | undefined): LoungeError {
  const m = (message ?? "").toLowerCase();
  if (m.includes("auth_required")) return "anon";
  for (const e of KNOWN_ERRORS) {
    if (m.includes(e)) return e;
  }
  return "unavailable";
}

async function withSession(): Promise<ReturnType<
  typeof createSupabaseBrowserClient
> | null> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session ? supabase : null;
}

/** 發一則 · 回 { ok, id } 或友善錯誤。 */
export async function postLoungeMessage(body: string): Promise<LoungePostResult> {
  const v = body.trim();
  if (!v) return { ok: false, error: "empty" };
  if (v.length > 1000) return { ok: false, error: "too_long" };
  try {
    const supabase = await withSession();
    if (!supabase) return { ok: false, error: "anon" };
    const { data, error } = await supabase.rpc("post_lounge_message", {
      p_body: v,
    });
    if (error) return { ok: false, error: mapError(error.message) };
    const id = typeof data === "string" ? data : "";
    return id ? { ok: true, id } : { ok: false, error: "unavailable" };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

/** 撤回一則(自己的)· 'ok' / 'anon' / 'unavailable'。 */
export async function deleteLoungeMessage(
  id: string,
): Promise<"ok" | "anon" | "unavailable"> {
  try {
    const supabase = await withSession();
    if (!supabase) return "anon";
    const { data, error } = await supabase.rpc("delete_lounge_message", {
      p_id: id,
    });
    if (error) return "unavailable";
    return data === "ok" ? "ok" : data === "anon" ? "anon" : "unavailable";
  } catch {
    return "unavailable";
  }
}

/** 友善錯誤文案(中文 · 訪客語氣)。 */
export function loungeErrorText(e: LoungeError): string {
  switch (e) {
    case "anon":
      return "請先登入再發言。";
    case "members_only":
      return "這間房間只給付費會員 · 你的付費身分還沒生效(或還不是會員)。";
    case "empty":
      return "說點什麼吧。";
    case "too_long":
      return "一則最多 1000 字。";
    case "rate_limit":
      return "發得有點快 · 等一下再來(一小時上限 30 則)。";
    case "unavailable":
    default:
      return "房間建置中 · 套用後即開通。";
  }
}
