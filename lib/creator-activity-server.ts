// ── ZONE 27 · 你的東西(server-side read · migration 0016)──────────────
// Tim 2026-06-05 dogfood:買了分析 / 回了留言卻找不回去 = 會員做完即蒸發。
// 在 /member(server component)直接撈本人的「買過 / 回過」→ 無 client 閃爍、
// 隊名在伺服器端解析(不必把賽程 lookup 送到前端)。 同 predictions-server.ts 模式。
//
// GRACEFUL:0016 未套用 / 未登入 / Supabase 不可達 → 回 [] · panel 自動隱藏(不空殼)。
// ─────────────────────────────────────────────────────

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type MyPurchaseRow = {
  postId: string;
  matchId: string;
  title: string;
  handle: string;
  authorCode: string;
  displayName: string;
  pick: "home" | "away";
  priceNtd: number;
  purchasedAt: string; // ISO
};

/** 本人買過的分析(新到舊)· 任何 error → [](panel 隱藏)。 */
export async function getMyPurchases(): Promise<MyPurchaseRow[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_my_purchases");
    if (error || !Array.isArray(data)) return [];
    return data.map((row) => {
      const r = row as Record<string, unknown>;
      return {
        postId: typeof r.post_id === "string" ? r.post_id : "",
        matchId: typeof r.match_id === "string" ? r.match_id : "",
        title: typeof r.title === "string" ? r.title : "",
        handle: typeof r.handle === "string" ? r.handle : "",
        authorCode: typeof r.author_code === "string" ? r.author_code : "",
        displayName: typeof r.display_name === "string" ? r.display_name : "",
        pick: r.pick === "away" ? ("away" as const) : ("home" as const),
        priceNtd: Number(r.price_ntd) || 0,
        purchasedAt: typeof r.purchased_at === "string" ? r.purchased_at : "",
      };
    });
  } catch {
    return [];
  }
}

export type MyCommentRow = {
  commentId: string;
  postId: string;
  matchId: string;
  postTitle: string;
  body: string;
  createdAt: string; // ISO
};

/** 本人回過的留言(新到舊)· 任何 error → [](panel 隱藏)。 */
export async function getMyComments(): Promise<MyCommentRow[]> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_my_comments");
    if (error || !Array.isArray(data)) return [];
    return data.map((row) => {
      const r = row as Record<string, unknown>;
      return {
        commentId: typeof r.comment_id === "string" ? r.comment_id : "",
        postId: typeof r.post_id === "string" ? r.post_id : "",
        matchId: typeof r.match_id === "string" ? r.match_id : "",
        postTitle: typeof r.post_title === "string" ? r.post_title : "",
        body: typeof r.body === "string" ? r.body : "",
        createdAt: typeof r.created_at === "string" ? r.created_at : "",
      };
    });
  } catch {
    return [];
  }
}
