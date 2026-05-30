// ── ZONE 27 · Game Posts (賽事討論室 · migration 0004) ──────
// Client-side wrappers for the OPEN game-discussion thread. ALL access
// goes through the SECURITY DEFINER RPCs in
// supabase/migrations/0004_game_posts.sql (the `game_posts` table is
// RLS-locked · no direct table access). Mirrors lib/predictions-market.ts.
//
// R174 Polymarket pivot · 討論「打開:免費看 + 登入發言」· 不再 BLACK CARD
// 付費牆(舊精品設定)· 門檻 = 登入 + 信用(海選天梯名次)· per
// memory/project_zone27_polymarket_pivot.md。
//
// LEGAL (hard line · memory/project_zone27_legal_redline.md):
//   · 純文字討論 · 0 金額 · 0 金流。 真錢只在「賣分析內容」那側(完全分離)。
//
// GRACEFUL DEGRADATION: every function swallows errors and returns a safe
// empty/neutral value so the UI never crashes — e.g. before migration 0004
// is applied, or for anonymous visitors, the thread just reads empty.
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type GamePost = {
  handle: string; // 「球迷 #XXXX」· 0 PII · user_id 衍生短碼
  body: string;
  createdAt: string; // ISO
};

/** Public discussion for a game (anon-readable · 免費看). Returns an empty
 *  array on any error so the UI degrades gracefully. Newest first. */
export async function getGamePosts(gameId: string): Promise<GamePost[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_game_posts", {
      p_game_id: gameId,
    });
    if (error || !Array.isArray(data)) return [];
    return data
      .map((row) => {
        const r = row as {
          handle?: unknown;
          body?: unknown;
          created_at?: unknown;
        };
        return {
          handle: typeof r.handle === "string" ? r.handle : "球迷",
          body: typeof r.body === "string" ? r.body : "",
          createdAt: typeof r.created_at === "string" ? r.created_at : "",
        };
      })
      .filter((p) => p.body.length > 0);
  } catch {
    return [];
  }
}

/** My post for a game (logged-in). null if none / anon / error. */
export async function getMyGamePost(
  gameId: string
): Promise<{ body: string; createdAt: string } | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_game_post", {
      p_game_id: gameId,
    });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const r = data[0] as { body?: unknown; created_at?: unknown };
    if (typeof r.body !== "string") return null;
    return {
      body: r.body,
      createdAt: typeof r.created_at === "string" ? r.created_at : "",
    };
  } catch {
    return null;
  }
}

export type SubmitPostResult =
  | { ok: true }
  | {
      ok: false;
      reason: "not_logged_in" | "already_posted" | "invalid" | "error";
    };

/** Post to the thread (logged-in). One per game · ≤200 chars (server-enforced). */
export async function submitGamePost(
  gameId: string,
  body: string
): Promise<SubmitPostResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { ok: false, reason: "not_logged_in" };
    const { error } = await supabase.rpc("submit_game_post", {
      p_game_id: gameId,
      p_body: body,
    });
    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("not_logged_in")) return { ok: false, reason: "not_logged_in" };
      if (msg.includes("already_posted")) return { ok: false, reason: "already_posted" };
      if (msg.includes("invalid")) return { ok: false, reason: "invalid" };
      return { ok: false, reason: "error" };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
