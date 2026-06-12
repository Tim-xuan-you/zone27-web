// ── ZONE 27 · 追蹤(follow)· client RPC 合約 ──────────────────────────────
// migration 0025 的三支函式的瀏覽器端唯一入口。 用 cookie-aware 的 browser client
// (帶登入 session)打 RPC · 把 0025 的回傳收斂成型別。 只給 client component 用。
//
// 🔴 紅線:這裡不算任何人的 md5、不知道任何人是誰 —— 身分認定全在 server(auth.uid())。
//   不存在「某人有幾個粉絲」的呼叫 · 你追了誰也只有你自己問得到(get_my_following 私密)。
//
// graceful:0025 未套 / RPC 錯 / 例外 → 一律收斂成 'unavailable' 或 anon ·
//   呼叫端據此「隱藏鈕 / 退空狀態」· 永不 throw、頁面不破。
// ─────────────────────────────────────────────────────
"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/** 一份帳本相對「我」的追蹤狀態。 'unavailable' = 0025 未套 / 錯(呼叫端隱藏鈕)。 */
export type FollowState =
  | "anon"
  | "self"
  | "following"
  | "not_following"
  | "unavailable";

function asFollowState(v: unknown): FollowState | null {
  return v === "anon" ||
    v === "self" ||
    v === "following" ||
    v === "not_following"
    ? v
    : null;
}

/** 查這份帳本(永久碼)目前對我的追蹤狀態。 用於 FollowLedgerButton 初始狀態。
 *  未登入由本地 session 先攔下回 'anon'(三支 RPC 都 authenticated-only · 不讓 anon 打)。 */
export async function getFollowState(code: string): Promise<FollowState> {
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return "anon"; // 未登入 → 不打 RPC · 顯示登入提示
    const { data, error } = await supabase.rpc("get_follow_state", {
      p_code: code,
    });
    if (error) return "unavailable"; // 0025 未套 → 隱藏鈕
    // 正常回 following / not_following / self · 若 getSession 與 RPC 之間 session 剛好過期,RPC 也可能回 'anon'(fallback)。
    return asFollowState(data) ?? "unavailable";
  } catch {
    return "unavailable";
  }
}

/** 切換追蹤 / 取消追蹤。 回傳切換後的新狀態('following' / 'not_following' / 'self' / 'anon')。 */
export async function toggleFollow(code: string): Promise<FollowState> {
  try {
    const supabase = createSupabaseBrowserClient();
    // session 中途過期 → 本地先攔 → 回 'anon'(呼叫端重現登入提示 · 不假裝追蹤成功)。
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return "anon";
    const { data, error } = await supabase.rpc("toggle_follow", {
      p_code: code,
    });
    if (error) return "unavailable";
    return asFollowState(data) ?? "unavailable";
  } catch {
    return "unavailable";
  }
}

/** 「我追蹤的」碼集合查詢結果 · 分三態給 pulse 篩選顯示不同空狀態。 */
export type FollowingResult =
  | { status: "anon" } // 未登入
  | { status: "unavailable" } // 0025 未套 / 錯
  | { status: "ok"; codes: Set<string> }; // 已登入(codes 可空 = 還沒追任何人)

/** 取「我追蹤的」永久碼集合(私密)· 用於 /pulse「只看我追的」篩選。 */
export async function getMyFollowing(): Promise<FollowingResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return { status: "anon" }; // 未登入 → 不打 RPC(authenticated-only)
    const { data, error } = await supabase.rpc("get_my_following");
    if (error || !Array.isArray(data)) return { status: "unavailable" };
    const codes = new Set<string>();
    for (const row of data as { followed_code?: unknown }[]) {
      if (typeof row.followed_code === "string") codes.add(row.followed_code);
    }
    return { status: "ok", codes };
  } catch {
    return { status: "unavailable" };
  }
}
