// ── ZONE 27 · Creator Posts (創作者賣分析 · migration 0005) ──
// Client-side wrappers for creator analysis posts. ALL access via the
// SECURITY DEFINER RPCs in supabase/migrations/0005_creator_posts.sql
// (creator_posts table RLS-locked). Mirrors lib/game-posts.ts.
//
// 每篇分析綁一個 match + 一個 pick(home/away)· 賽後 app-side 對 finalResult
// 自動 grade(準/不準)= 賴不掉的戰績(報馬仔 displacement)。 per
// memory/project_zone27_polymarket_pivot.md + zone27-legal-redline.md。
//
// v1 全免費(price_ntd 0)· 賣文章「購買=手動銀行轉帳」flow = Phase 2(需 Tim
// 收款帳戶到 Vercel 私密 env)。 GRACEFUL: migration 未套用 / anon → 讀空陣列。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type CreatorPost = {
  handle: string; // 「球迷 #XXXX」· 0 PII
  title: string;
  body: string;
  pick: "home" | "away";
  priceNtd: number; // 0 = 免費
  createdAt: string; // ISO
};

/** Creator analyses for a match (anon-readable). Empty array on any error. */
export async function getCreatorPosts(matchId: string): Promise<CreatorPost[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_creator_posts", {
      p_match_id: matchId,
    });
    if (error || !Array.isArray(data)) return [];
    return data
      .map((row) => {
        const r = row as {
          handle?: unknown;
          title?: unknown;
          body?: unknown;
          pick?: unknown;
          price_ntd?: unknown;
          created_at?: unknown;
        };
        const pick: "home" | "away" = r.pick === "away" ? "away" : "home";
        return {
          handle: typeof r.handle === "string" ? r.handle : "球迷",
          title: typeof r.title === "string" ? r.title : "",
          body: typeof r.body === "string" ? r.body : "",
          pick,
          priceNtd: Number(r.price_ntd) || 0,
          createdAt: typeof r.created_at === "string" ? r.created_at : "",
        };
      })
      .filter((p) => p.title.length > 0 && p.body.length > 0);
  } catch {
    return [];
  }
}

/** My analysis for a match (logged-in). null if none / anon / error. */
export async function getMyCreatorPost(
  matchId: string
): Promise<{ title: string; body: string; pick: "home" | "away" } | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_my_creator_post", {
      p_match_id: matchId,
    });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const r = data[0] as { title?: unknown; body?: unknown; pick?: unknown };
    if (typeof r.title !== "string" || typeof r.body !== "string") return null;
    const pick: "home" | "away" = r.pick === "away" ? "away" : "home";
    return { title: r.title, body: r.body, pick };
  } catch {
    return null;
  }
}

// ── 作者公開戰績(每篇分析旁的 credibility badge · migration 0007)──
// 撈所有創作者鎖過的 (handle, match_id, pick) · app 端對 finalResult 自動評
// 準/不準 → 算每位作者命中率。 報馬仔挑窗 + 刪輸的文;這裡全撈、連輸的都算。
// GRACEFUL:0007 未套用 / anon → 空陣列 · badge 自動退成「新分析師」。

export type CreatorPickRow = {
  handle: string;
  matchId: string;
  pick: "home" | "away";
};

/** 所有創作者的選邊紀錄(anon-readable)· 空陣列 on any error/未套用。 */
export async function getCreatorRecords(): Promise<CreatorPickRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_creator_records");
    if (error || !Array.isArray(data)) return [];
    return data.map((row) => {
      const r = row as { handle?: unknown; match_id?: unknown; pick?: unknown };
      return {
        handle: typeof r.handle === "string" ? r.handle : "球迷",
        matchId: typeof r.match_id === "string" ? r.match_id : "",
        pick: r.pick === "away" ? ("away" as const) : ("home" as const),
      };
    });
  } catch {
    return [];
  }
}

export type AuthorRecord = {
  /** 已結算(非平局)的場數 */
  n: number;
  hits: number;
  /** 命中率 0-100 · null 當 n=0 */
  rate: number | null;
  /** 累積 ≥10 場 = 已上海選天梯(同 /ladder ROOKIE 門檻)*/
  onLadder: boolean;
};

const LADDER_MIN = 10; // 同 /ladder 新秀門檻

/** 把選邊紀錄對 finalResult map 評分 → 每位作者(handle)的命中戰績。
 *  finals:{ [matchId]: "home"|"away"|"tie" } · 平局不計入分母。 */
export function gradeAuthorRecords(
  rows: CreatorPickRow[],
  finals: Record<string, "home" | "away" | "tie">
): Record<string, AuthorRecord> {
  const acc: Record<string, { n: number; hits: number }> = {};
  for (const r of rows) {
    const w = finals[r.matchId];
    if (!w || w === "tie") continue; // 只算已結算、非平局
    const a = acc[r.handle] ?? { n: 0, hits: 0 };
    a.n += 1;
    if (r.pick === w) a.hits += 1;
    acc[r.handle] = a;
  }
  const out: Record<string, AuthorRecord> = {};
  for (const h of Object.keys(acc)) {
    const { n, hits } = acc[h];
    out[h] = {
      n,
      hits,
      rate: n > 0 ? Math.round((hits / n) * 100) : null,
      onLadder: n >= LADDER_MIN,
    };
  }
  return out;
}

export type SubmitCreatorResult =
  | { ok: true }
  | {
      ok: false;
      reason: "not_logged_in" | "already_posted" | "invalid" | "error";
    };

/** Publish an analysis (logged-in). One per match. v1 free (price 0). */
export async function submitCreatorPost(
  matchId: string,
  title: string,
  body: string,
  pick: "home" | "away",
  priceNtd = 0
): Promise<SubmitCreatorResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { ok: false, reason: "not_logged_in" };
    const { error } = await supabase.rpc("submit_creator_post", {
      p_match_id: matchId,
      p_title: title,
      p_body: body,
      p_pick: pick,
      p_price: Math.max(0, Math.round(priceNtd)),
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
