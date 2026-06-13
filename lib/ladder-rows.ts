import { cache } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ── ZONE 27 · 全站押注列(0022 get_ladder_entries)· 一次 render 只撈一次 ──────────────
// 首頁同一次 render 同時要:① 熱度的「每場鎖定人數」(lib/match-heat)② 活動脈動的最近鎖定
// (lib/pulse)。 兩邊本來各自打一次同一支 get_ladder_entries(全表掃 · limit 100000)= 重複讀。
// React cache() 把同一 request 內的呼叫去重 → 真正只打一次 RPC、兩邊共用同一份列。
// 🔴 stateless anon client(無 cookie)→ 不破首頁 / 看板 / 脈動的 ISR 靜態 · 任何錯 → []。
// ─────────────────────────────────────────────────────

export type LadderRow = {
  author_code?: unknown;
  handle?: unknown;
  match_id?: unknown;
  pick?: unknown;
  // 0026 起多回的「賽前鎖死的一句理由」(公開)· 0026 未套用前這欄不存在 → undefined
  //（graceful build-ahead:segment 讀不到就不顯示那行,套用後自動亮)。
  rationale?: unknown;
  created_at?: unknown;
};

let client: SupabaseClient | null = null;
function anonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

/** 全站押注列(已按 created_at desc)· 同一次 render 共用(React cache 去重)· 錯 → []。 */
export const fetchLadderRows = cache(async (): Promise<LadderRow[]> => {
  try {
    const supabase = anonClient();
    if (!supabase) return [];
    const { data, error } = await supabase.rpc("get_ladder_entries");
    if (error || !Array.isArray(data)) return [];
    return data as LadderRow[];
  } catch {
    return [];
  }
});
