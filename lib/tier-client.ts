// ── ZONE 27 · 用永久碼查付費身分(client · 看得見的支持者金環)──────────
// 0023 get_tier_by_code 的瀏覽器端包裝 · 給創作者署名 / 留言用(server-render 的
// 海選天梯直接在 lib/ladder-server.ts 解析 · 不走這支)。 同一人會出現在多篇分析 /
// 多則留言 → in-memory cache + inflight 去重,整頁只打一次 RPC。
//
// 🔴 紅線:這金環是「贊助開放引擎」的身分標記,**不是準度** —— 永不暗示付費比較準
//    (守 57% 誠實王牌 · 同 components/Avatar.tsx supporter prop header)。
// GRACEFUL:空碼 / 非永久碼(舊 RPC)/ 0023 未套 / RPC 錯 / 非付費 → 'free'(不顯示金環)。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { isProfileCode } from "@/lib/profile-code";
import type { MemberTier } from "@/lib/tier";

// 已解析的確定值(含 'free')快取 · code → tier。 tier 走手動轉帳極少變動 → 整頁 session 快取安全。
const cache = new Map<string, MemberTier>();
// 進行中的 promise · 同碼並發只打一次(N 篇分析同作者 → 1 次 RPC)。
const inflight = new Map<string, Promise<MemberTier>>();

/**
 * 用永久碼查付費 tier(client)。 非永久碼 / 查無 / 錯 → 'free'(graceful · 不顯示金環)。
 * RPC 真錯不快取(0023 可能還沒套 → 容後重試);成功(含 'free')才快取避免重打。
 */
export async function resolveTierByCode(code: string): Promise<MemberTier> {
  const c = (code ?? "").trim().toLowerCase();
  if (!c || !isProfileCode(c)) return "free"; // 舊 RPC 無永久碼 / 髒輸入 → 不查
  const hit = cache.get(c);
  if (hit) return hit;
  const flying = inflight.get(c);
  if (flying) return flying;
  const p = (async (): Promise<MemberTier> => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.rpc("get_tier_by_code", {
        p_code: c,
      });
      if (error) return "free"; // 0023 未套 / 暫時錯 → 不快取 · 下次重試
      const t = typeof data === "string" ? data : "";
      const tier: MemberTier = t === "black" || t === "founder" ? t : "free";
      cache.set(c, tier); // 確定值(含 free)才快取
      return tier;
    } catch {
      return "free";
    } finally {
      inflight.delete(c);
    }
  })();
  inflight.set(c, p);
  return p;
}
