// ── ZONE 27 · BLACK 會員到期狀態(R252)──────────────────
// 從 user_metadata 的 tier + member_until 推「有效到哪天 / 還有幾天 / 狀態」。
// 🔴 Defector 式:誠實日期、零催繳。 不做焦慮倒數、不紅字、不 FOMO。 「還有 N 天」是平靜的
//    資訊,不是跳動的倒數鐘。 不自動扣款(/integrity #13)→ 到期靠 Tim 親手提醒 + 會員自己決定。
// 到期日存 user_metadata(顯示用 · 會員改了只騙自己 · 真正的 access 邊界靠 app_metadata.tier
//    + z27_is_member,使用者改不到 · 見 migration 0030/0031)。
// ─────────────────────────────────────────────────────

import { readTier, type MemberTier } from "@/lib/tier";

export type MembershipState =
  | "none" // 免費 / 未登入 → 不顯示到期卡
  | "active" // 付費 · 還有 8 天以上
  | "expiring" // 付費 · 7 天內(含今天)到期 —— 平靜提醒,不催
  | "expired" // 付費 tier 還掛著但日期已過(Tim 手動降級前的誠實狀態)
  | "undated"; // 付費但沒有到期日(這功能上線前的舊會員)→ 待補

export type MembershipStatus = {
  tier: MemberTier;
  paid: boolean;
  until: string | null; // "YYYY-MM-DD"
  daysLeft: number | null; // 平靜資訊 · undated → null
  state: MembershipState;
};

const DAY_MS = 86_400_000;
const TPE_OFFSET_MS = 8 * 3_600_000; // 台北固定 UTC+8 · 無 DST

/** 台北「今天」00:00 對應的 UTC 毫秒。 用固定 offset 算術(不用 Intl)→ server/client 逐位一致。 */
function taipeiMidnightUtcMs(now: Date): number {
  const tpe = new Date(now.getTime() + TPE_OFFSET_MS);
  return Date.UTC(tpe.getUTCFullYear(), tpe.getUTCMonth(), tpe.getUTCDate()) - TPE_OFFSET_MS;
}

/** "YYYY-MM-DD" → 該日 00:00(台北)的 UTC 毫秒;格式不對回 null。 */
function parseUntilUtcMs(s: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return Date.UTC(y, mo - 1, d) - TPE_OFFSET_MS;
}

export function getMembershipStatus(
  meta: Record<string, unknown> | null | undefined,
  now: Date = new Date(),
): MembershipStatus {
  const tier = readTier(meta);
  const paid = tier !== "free";
  if (!paid) return { tier, paid: false, until: null, daysLeft: null, state: "none" };

  const raw = typeof meta?.member_until === "string" ? meta.member_until : "";
  const untilMs = raw ? parseUntilUtcMs(raw) : null;
  if (untilMs === null) {
    return { tier, paid: true, until: null, daysLeft: null, state: "undated" };
  }

  const todayMs = taipeiMidnightUtcMs(now);
  // 「有效到 X」= 含當天 → 到期日當天 daysLeft=0 仍算有效(expiring),隔天才 expired。
  const daysLeft = Math.round((untilMs - todayMs) / DAY_MS);
  const state: MembershipState =
    daysLeft < 0 ? "expired" : daysLeft <= 7 ? "expiring" : "active";

  return { tier, paid: true, until: raw, daysLeft, state };
}

/** 「現在這一刻」實際生效的 tier:付費但已過期 → 自動當免費(顯示層自動回退 · 不用手動降級、也不收錢)。
 *  active / expiring / undated(舊會員沒日期)→ 維持付費;expired → free;免費本來就 free。
 *  🔴 這是「顯示用」自動回退;真正的房間 access 邊界由 z27_is_member 在 DB 端即時把關(migration 0032)。 */
export function effectiveTier(
  meta: Record<string, unknown> | null | undefined,
  now: Date = new Date(),
): MemberTier {
  const s = getMembershipStatus(meta, now);
  return s.state === "expired" ? "free" : s.tier;
}

/** "2026-07-20" → "7/20"(會員卡平靜顯示)。 格式不對原樣回。 */
export function formatUntilShort(until: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(until);
  if (!m) return until;
  return `${Number(m[2])}/${Number(m[3])}`;
}
