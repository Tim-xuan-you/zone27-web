// ── ZONE 27 · 會員之間的房間(server-side · migration 0030)──────────────────────
// Defector 式「會員專屬空間」:出錢養著免費引擎的那一群,有一間只有他們進得去的客廳。
// 不是功能、不押注、不影響任何預測能力(那些全免費)= 純身分/社群。 排序純時間,0 連勝/PnL/排名。
//
// 🔴 安全:房門認 z27_is_member(讀 app_metadata · 使用者改不了)· RPC 各自把關(defense in depth)。
// GRACEFUL:0030 未套 / RPC 錯 → state:'unbuilt';登入但非付費會員 → state:'locked';會員 → 'member'。
// ─────────────────────────────────────────────────────────────

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoungeMessage = {
  id: string;
  body: string;
  /** 預先格式化的台北時間「M/D HH:mm」· server 算好傳字串 → 0 hydration mismatch(不用 Intl)。 */
  timeLabel: string;
  authorCode: string;
  authorName: string;
  /** 付費支持者金環(身分標記 · 純裝飾)。 */
  supporter: boolean;
  /** 是不是登入者本人(本人才看得到「撤回」)。 */
  isMine: boolean;
};

export type LoungeResult =
  | { state: "member"; messages: LoungeMessage[] }
  | { state: "locked" } // 登入了但不是付費會員
  | { state: "unbuilt" }; // 0030 未套 / RPC 不可用

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

// 台北固定 UTC+8(無 DST)· 手動格式化 → server / client 逐位元一致(同 ActivityPulse R234⑤ 修法 ·
// SSR 會 render 的時間別用 Intl)。
function taipeiLabel(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const d = new Date(t + 8 * 60 * 60 * 1000);
  const mo = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${mo}/${day} ${hh}:${mm}`;
}

/**
 * 讀房間。 非會員 → 'locked';未套 / 錯 → 'unbuilt';會員 → 'member'(可能 0 則 = 空房間)。
 * 🔴 用 RPC 的結果(權威 · 即時讀 DB)判定會員身分,不靠可能過時的 app_metadata claims。
 */
export async function getLoungeMessages(limit = 50): Promise<LoungeResult> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.rpc("get_lounge_messages", {
      p_limit: limit,
      p_before: null,
    });
    if (error) {
      const m = (error.message ?? "").toLowerCase();
      // plpgsql raise 'members_only' → 登入但非會員。 其餘(函式不存在 / 網路)→ 視為建置中。
      if (m.includes("members_only")) return { state: "locked" };
      return { state: "unbuilt" };
    }
    if (!Array.isArray(data)) return { state: "unbuilt" };
    const messages: LoungeMessage[] = data.map((r) => {
      const row = r as Record<string, unknown>;
      const code = str(row.author_code);
      const tier = str(row.author_tier);
      return {
        id: str(row.id),
        body: str(row.body),
        timeLabel: taipeiLabel(str(row.created_at)),
        authorCode: code,
        authorName: str(row.author_name) || `球迷 #${code}`,
        supporter: tier === "black" || tier === "founder",
        isMine: row.is_mine === true,
      };
    });
    return { state: "member", messages };
  } catch {
    return { state: "unbuilt" };
  }
}
