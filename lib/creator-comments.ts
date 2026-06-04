// ── ZONE 27 · Creator Post Comments (分析下的回覆串 · migration 0010) ──
// 創作者分析底下的對話層。 把「一場一篇、不能互動」補成「分析下面可以討論」·
// 同時不動「選邊鎖死、賽後自動評」的問責根基(那是 ✓已驗證準度 章的命脈)。
//
// 全走 SECURITY DEFINER RPC(creator_comments RLS-locked)· 同 lib/game-posts.ts /
// lib/creator-posts.ts 模式。 GRACEFUL:migration 0010 未套用 / anon → 讀空陣列、
// submit 回 error(前端顯示「討論功能開通中」· 不 crash)。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type CreatorComment = {
  handle: string; // 「球迷 #XXXX」· 0 PII · 跟分析署名同碼 · 顯示 fallback(0015 前)+ @mention
  authorCode: string; // 永久碼(0015 · 舊 RPC → "")· 顯示永久身分章
  displayName: string; // 會員自填顯示名(0015 · 舊 RPC → "")
  isAuthor: boolean; // 回覆者是否為原分析作者 → UI 標「作者」
  body: string;
  createdAt: string; // ISO
};

/** 一篇分析的回覆串(anon 可讀)· 舊到新 · 空陣列 on any error/未套用。 */
export async function getCreatorComments(postId: string): Promise<CreatorComment[]> {
  if (!postId) return [];
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_creator_comments", {
      p_post_id: postId,
    });
    if (error || !Array.isArray(data)) return [];
    return data
      .map((row) => {
        const r = row as {
          handle?: unknown;
          author_code?: unknown;
          display_name?: unknown;
          is_author?: unknown;
          body?: unknown;
          created_at?: unknown;
        };
        return {
          handle: typeof r.handle === "string" ? r.handle : "球迷",
          // 0015 未套用的舊 RPC 無這兩欄 → ""(creatorIdentity fallback 用 handle)
          authorCode: typeof r.author_code === "string" ? r.author_code : "",
          displayName: typeof r.display_name === "string" ? r.display_name : "",
          isAuthor: r.is_author === true,
          body: typeof r.body === "string" ? r.body : "",
          createdAt: typeof r.created_at === "string" ? r.created_at : "",
        };
      })
      .filter((c) => c.body.length > 0);
  } catch {
    return [];
  }
}

export type SubmitCommentResult =
  | { ok: true }
  | { ok: false; reason: "not_logged_in" | "invalid" | "error" };

/** 對一篇分析回覆(登入)· ≤500 字 · 可多次回覆(無一場一篇限制)。 */
export async function submitCreatorComment(
  postId: string,
  body: string
): Promise<SubmitCommentResult> {
  if (!postId) return { ok: false, reason: "error" };
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { ok: false, reason: "not_logged_in" };
    const { error } = await supabase.rpc("submit_creator_comment", {
      p_post_id: postId,
      p_body: body,
    });
    if (error) {
      const msg = (error.message || "").toLowerCase();
      if (msg.includes("not_logged_in")) return { ok: false, reason: "not_logged_in" };
      if (msg.includes("invalid")) return { ok: false, reason: "invalid" };
      return { ok: false, reason: "error" };
    }
    return { ok: true };
  } catch {
    return { ok: false, reason: "error" };
  }
}
