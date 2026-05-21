// ── ZONE 27 · Follow Match · cloud-synced list ─────────
// Round 30 Wave 6 · 2026-05-21 · first unlock feature。
//
// 設計決定: 用 Supabase auth.users.user_metadata.followed_matches 存 ·
// 不開新 table · 0 migration · 0 Tim 動作。 user_metadata 是 JSONB ·
// 自己可讀可寫 · cross-device sync via auth session。 限制:
//   - ~100KB recommended size(我們塞 string[] · 270 場 ingest 上限
//     OK · 不會超過)
//   - 沒 aggregate query(無法問「N 個人 follow 這場」)· MVP 不需要
//
// 跟 RLS-locked waitlist 一致設計:
//   - Visitors 匿名 = 沒有 follows(localStorage 也沒)· 純 visitor
//     看 /matches/[gameId] 看不到 FollowMatchButton
//   - Logged-in members = follow 透過此 lib · 寫進自己 user_metadata
//   - 0 tracking · 0 cross-user visibility · per /privacy
//
// Usage:
//   import { getMyFollows, toggleFollow, isFollowing } from "@/lib/follows"
//   - 在 client component(uses createSupabaseBrowserClient)
//   - 不在 server component(server 讀 user_metadata via getSession()
//     return value 直接 inspect)
// ─────────────────────────────────────────────────────

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const META_KEY = "followed_matches";

/** Get my followed match IDs (client-side, browser client) */
export async function getMyFollows(): Promise<string[]> {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return [];
  const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
  const raw = meta[META_KEY];
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}

/** Toggle follow state for a match ID. Returns the new state (true =
 *  now following, false = unfollowed). Throws if not logged in. */
export async function toggleFollow(matchId: string): Promise<boolean> {
  const supabase = createSupabaseBrowserClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    throw new Error("not_logged_in");
  }
  const meta = (userData.user.user_metadata ?? {}) as Record<string, unknown>;
  const current = Array.isArray(meta[META_KEY])
    ? (meta[META_KEY] as unknown[]).filter(
        (x): x is string => typeof x === "string"
      )
    : [];

  const wasFollowing = current.includes(matchId);
  const next = wasFollowing
    ? current.filter((id) => id !== matchId)
    : [...current, matchId];

  const { error: updateErr } = await supabase.auth.updateUser({
    data: { [META_KEY]: next },
  });
  if (updateErr) {
    throw new Error(updateErr.message || "update_failed");
  }
  return !wasFollowing;
}

/** Check if a specific match is followed. Convenience for UI render. */
export function isFollowing(follows: string[], matchId: string): boolean {
  return follows.includes(matchId);
}

/** Read follows from a server-side session.user.user_metadata directly.
 *  Used by /member server component(no extra auth round-trip)。 */
export function readFollowsFromMeta(
  meta: Record<string, unknown> | null | undefined
): string[] {
  if (!meta) return [];
  const raw = meta[META_KEY];
  if (!Array.isArray(raw)) return [];
  return raw.filter((x): x is string => typeof x === "string");
}
