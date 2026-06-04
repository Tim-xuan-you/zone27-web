import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── ZONE 27 · 看板創作者分析數(server · 無 cookie · ISR-safe)──────────
// Tim:看板這麼多場 · 用戶想跟單卻看不出「哪場有大神分析可看/買」= 漏掉抽傭的錢。
// 解:每張市場卡標「N 篇分析」· 一眼看出哪場有人分析 → 點進去看/買 → 平台抽傭。
//
// 工程:用「無 cookie 的 anon client」打 anon-readable 的 get_creator_records
// (回所有貼文的 match_id · 同徽章資料源 · 0 新 migration)· 數每場篇數。
//   ⚠ 不能用 createSupabaseServerClient(它讀 cookies → 頁面退化成 dynamic ·
//     破壞首頁 / 看板的 ISR 靜態快取)。 這支用 stateless anon client = 頁面維持靜態。
// GRACEFUL:env 缺 / RPC 未套 / anon / 錯 → {} · 看板不顯示 badge(不破任何東西)。
// ─────────────────────────────────────────────────────

let cached: SupabaseClient | null = null;
function anonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

/** 每場有幾篇創作者分析 · `{ [matchId]: count }` · 空物件 on any error/未套用。 */
export async function getCreatorPostCounts(): Promise<Record<string, number>> {
  try {
    const supabase = anonClient();
    if (!supabase) return {};
    const { data, error } = await supabase.rpc("get_creator_records");
    if (error || !Array.isArray(data)) return {};
    const counts: Record<string, number> = {};
    for (const row of data as { match_id?: unknown }[]) {
      const id = typeof row.match_id === "string" ? row.match_id : null;
      if (id) counts[id] = (counts[id] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}
