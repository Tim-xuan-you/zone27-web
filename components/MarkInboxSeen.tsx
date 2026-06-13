"use client";

import { useEffect, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { markBellSeen } from "@/lib/settlement-bell-cache";

// ── ZONE 27 · 看過收件匣 = 對過帳了(把 last_seen 推到現在)──────────────────────
// last_seen_member 是「上次對帳時刻」的單一真相(同 ReturnedWhileAwayCard 寫的那個 key)。
// 收件匣 server 端用「舊」的 last_seen 算出哪些是「新」→ 這個 island mount 後把它推到「現在」
// → 下次進來、Nav 鈴鐺就乾淨了(對過的不再算新)。 兩處(/member 回訪卡 + 這裡)共用同一個
// 時戳 = 不打架:不管你從哪邊對帳,基準都一起前進。
//
// 同時把 Nav 鈴鐺的 sessionStorage 快取歸零(markBellSeen)→ 徽章當下就消失(不用等 90s TTL 過)。
// graceful:寫失敗靜默(下次再寫)· 純副作用,不 render 任何東西。
// ─────────────────────────────────────────────────────

export default function MarkInboxSeen() {
  const wrote = useRef(false);

  useEffect(() => {
    if (wrote.current) return;
    wrote.current = true;
    // 鈴鐺徽章即時歸零(對過帳了)。
    markBellSeen();
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.updateUser({
          data: { last_seen_member: new Date().toISOString() },
        });
      } catch {
        /* graceful · 寫失敗不影響其他 */
      }
    })();
  }, []);

  return null;
}
