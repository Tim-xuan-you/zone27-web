// ── ZONE 27 · Admin Console wrappers (migration 0011) ──────
// WordPress 式點擊後台的 client 端。 全走 SECURITY DEFINER RPC(is_admin() gate
// 在 server 端把關 · 非 admin 直接打也擋掉)。 GRACEFUL:0011 未套用 / 非 admin →
// 回安全預設、不 crash。 「手動金流」= Tim 點按鈕確認每筆(不是自動扣款 · per #13)。
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type AdminStatus = {
  loggedIn: boolean;
  isAdmin: boolean;
  hasAnyAdmin: boolean;
};

/** 問「我登入了嗎 / 我是 admin 嗎 / 有沒有人認領過 admin」。 */
export async function getAdminStatus(): Promise<AdminStatus> {
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { loggedIn: false, isAdmin: false, hasAnyAdmin: false };
    const { data, error } = await supabase.rpc("am_i_admin");
    if (error || !Array.isArray(data) || data.length === 0) {
      return { loggedIn: true, isAdmin: false, hasAnyAdmin: false };
    }
    const r = data[0] as { is_admin?: unknown; has_any_admin?: unknown };
    return {
      loggedIn: true,
      isAdmin: r.is_admin === true,
      hasAnyAdmin: r.has_any_admin === true,
    };
  } catch {
    return { loggedIn: false, isAdmin: false, hasAnyAdmin: false };
  }
}

/** 認領第一個 admin(表空才可)。 true = 認領成功。 */
export async function claimAdmin(): Promise<boolean> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("claim_admin");
    return !error && data === true;
  } catch {
    return false;
  }
}

type ActionResult = { ok: true } | { ok: false; msg: string };

function explain(rawMsg: string): string {
  const m = (rawMsg || "").toLowerCase();
  if (m.includes("not_admin")) return "你不是管理員。";
  if (m.includes("user_not_found")) return "找不到這個 email 的會員。";
  if (m.includes("invalid_amount")) return "金額不能是 0 或空白。";
  if (m.includes("invalid_tier")) return "等級只能是 OPEN / BLACK。";
  if (m.includes("function") && m.includes("does not exist"))
    return "後台功能還沒開通(請先在 Supabase 套用 0011)。";
  return "操作失敗 · 請再試一次。";
}

/** 加點數(儲值)。 */
export async function adminGivePoints(
  email: string,
  amount: number,
  ref: string
): Promise<ActionResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("admin_give_points", {
      p_email: email,
      p_amount: Math.round(amount),
      p_ref: ref,
    });
    return error ? { ok: false, msg: explain(error.message) } : { ok: true };
  } catch {
    return { ok: false, msg: "操作失敗 · 請再試一次。" };
  }
}

/** 標記付費等級 · free | black | founder。 */
export async function adminSetTier(
  email: string,
  tier: "free" | "black" | "founder"
): Promise<ActionResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("admin_set_tier", {
      p_email: email,
      p_tier: tier,
    });
    return error ? { ok: false, msg: explain(error.message) } : { ok: true };
  } catch {
    return { ok: false, msg: "操作失敗 · 請再試一次。" };
  }
}

export type AdminMember = {
  email: string;
  tier: string;
  balanceNtd: number;
  memberUntil: string; // "YYYY-MM-DD" · 空字串 = 免費 / 未設定(0031 前)
  createdAt: string;
};

/** 全會員列表。 空陣列 on error。 */
export async function adminMembers(): Promise<AdminMember[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("admin_members");
    if (error || !Array.isArray(data)) return [];
    return data.map((row) => {
      const r = row as {
        email?: unknown;
        tier?: unknown;
        balance_ntd?: unknown;
        member_until?: unknown;
        created_at?: unknown;
      };
      return {
        email: typeof r.email === "string" ? r.email : "—",
        tier: typeof r.tier === "string" ? r.tier : "free",
        balanceNtd: Number(r.balance_ntd) || 0,
        memberUntil: typeof r.member_until === "string" ? r.member_until : "",
        createdAt: typeof r.created_at === "string" ? r.created_at : "",
      };
    });
  } catch {
    return [];
  }
}

export type AdminContentRow = {
  kind: "creator_post" | "creator_comment" | "game_post";
  id: string;
  handle: string;
  snippet: string;
  createdAt: string;
};

/** 最近文章/留言/發言(審核用)。 空陣列 on error。 */
export async function adminRecentContent(): Promise<AdminContentRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("admin_recent_content");
    if (error || !Array.isArray(data)) return [];
    return data.map((row) => {
      const r = row as {
        kind?: unknown;
        id?: unknown;
        handle?: unknown;
        snippet?: unknown;
        created_at?: unknown;
      };
      const kind =
        r.kind === "creator_comment" || r.kind === "game_post"
          ? r.kind
          : "creator_post";
      return {
        kind,
        id: typeof r.id === "string" ? r.id : "",
        handle: typeof r.handle === "string" ? r.handle : "球迷",
        snippet: typeof r.snippet === "string" ? r.snippet : "",
        createdAt: typeof r.created_at === "string" ? r.created_at : "",
      };
    });
  } catch {
    return [];
  }
}

export type AdminFullContent = {
  kind: AdminContentRow["kind"];
  id: string;
  handle: string;
  title: string;
  body: string;
  ref: string; // match_id / post_id / game_id
  priceNtd: number | null; // 付費分析的價格 · null = 留言/討論室
  createdAt: string;
};

/** 看完整內文(含付費分析 body · admin override 付費牆 · migration 0017)。
 *  null = 0017 未套用 / 非 admin / 找不到(UI 退回顯示 snippet)。 */
export async function adminViewContent(
  kind: AdminContentRow["kind"],
  id: string
): Promise<AdminFullContent | null> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("admin_view_content", {
      p_kind: kind,
      p_id: id,
    });
    if (error || !Array.isArray(data) || data.length === 0) return null;
    const r = data[0] as Record<string, unknown>;
    return {
      kind:
        r.kind === "creator_comment" || r.kind === "game_post"
          ? r.kind
          : "creator_post",
      id: typeof r.id === "string" ? r.id : id,
      handle: typeof r.handle === "string" ? r.handle : "球迷",
      title: typeof r.title === "string" ? r.title : "",
      body: typeof r.body === "string" ? r.body : "",
      ref: typeof r.ref === "string" ? r.ref : "",
      priceNtd: typeof r.price_ntd === "number" ? r.price_ntd : null,
      createdAt: typeof r.created_at === "string" ? r.created_at : "",
    };
  } catch {
    return null;
  }
}

/** 刪一篇/一則 + 留痕(原因)。 留痕版(0017)優先 · 未套用 → fall back 裸刪(0011)。 */
export async function adminDelete(
  kind: AdminContentRow["kind"],
  id: string,
  reason = ""
): Promise<ActionResult> {
  try {
    const supabase = createSupabaseBrowserClient();
    // 留痕版(admin_delete_logged · 0017)優先
    const logged = await supabase.rpc("admin_delete_logged", {
      p_kind: kind,
      p_id: id,
      p_reason: reason,
    });
    if (!logged.error) return { ok: true };
    // PGRST202 = schema cache 找不到函式(0017 未套)→ fall back 裸刪 0011
    if ((logged.error as { code?: string }).code === "PGRST202") {
      const { error } = await supabase.rpc("admin_delete", {
        p_kind: kind,
        p_id: id,
      });
      return error ? { ok: false, msg: explain(error.message) } : { ok: true };
    }
    return { ok: false, msg: explain(logged.error.message) };
  } catch {
    return { ok: false, msg: "操作失敗 · 請再試一次。" };
  }
}

export type AdminAuditRow = {
  action: string;
  targetKind: string;
  targetSnippet: string;
  reason: string;
  createdAt: string;
};

/** 最近審核紀錄(刪除留痕 · 透明)。 空陣列 = 0017 未套 / 無紀錄。 */
export async function adminAuditRecent(): Promise<AdminAuditRow[]> {
  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.rpc("admin_audit_recent");
    if (error || !Array.isArray(data)) return [];
    return data.map((row) => {
      const r = row as Record<string, unknown>;
      return {
        action: typeof r.action === "string" ? r.action : "",
        targetKind: typeof r.target_kind === "string" ? r.target_kind : "",
        targetSnippet:
          typeof r.target_snippet === "string" ? r.target_snippet : "",
        reason: typeof r.reason === "string" ? r.reason : "",
        createdAt: typeof r.created_at === "string" ? r.created_at : "",
      };
    });
  } catch {
    return [];
  }
}
