// ── ZONE 27 · 點數錢包(儲值 → 買文章 · migration 0009)──────────
// Client wrappers · 全走 SECURITY DEFINER RPC(wallet_ledger RLS-locked)。
// 餘額 = ledger 加總(server 算 · 不可竄改)。 儲值 = 手動轉帳(Tim 在 Studio
// 記 'topup')。 點數單向 · 只能買內容 · 永遠不能換現金(per zone27-legal-redline)。
// GRACEFUL:0009 未套用 / anon → 餘額 0 · 不 crash。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

/** 本人錢包餘額(NT$ · 1 點 = NT$1)· 0 on error/anon/未套用。 */
export async function getWalletBalance(): Promise<number> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("get_wallet_balance");
    if (error || typeof data !== "number") return 0;
    return data;
  } catch {
    return 0;
  }
}

export type BuyResult =
  | { ok: true; reason: "ok" | "already_purchased"; balance: number }
  | {
      ok: false;
      reason:
        | "not_logged_in"
        | "not_found"
        | "free"
        | "own_post"
        | "insufficient"
        | "error";
      balance: number;
    };

/** 用點數買一篇付費分析(原子扣款 · server 端檢查餘額)。 */
export async function buyCreatorPost(postId: string): Promise<BuyResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("buy_creator_post", {
      p_post_id: postId,
    });
    if (error || !Array.isArray(data) || data.length === 0) {
      return { ok: false, reason: "error", balance: 0 };
    }
    const r = data[0] as {
      ok?: unknown;
      reason?: unknown;
      new_balance?: unknown;
    };
    const balance = Number(r.new_balance) || 0;
    const reason = typeof r.reason === "string" ? r.reason : "error";
    if (r.ok === true) {
      return {
        ok: true,
        reason: reason === "already_purchased" ? "already_purchased" : "ok",
        balance,
      };
    }
    const failReasons = [
      "not_logged_in",
      "not_found",
      "free",
      "own_post",
      "insufficient",
    ] as const;
    const failReason = (failReasons as readonly string[]).includes(reason)
      ? (reason as (typeof failReasons)[number])
      : "error";
    return { ok: false, reason: failReason, balance };
  } catch {
    return { ok: false, reason: "error", balance: 0 };
  }
}
