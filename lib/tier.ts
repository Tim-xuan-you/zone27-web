// ── ZONE 27 · Member Tier (R179) ──────────────────────
// 付費會員 tier 存在 Supabase auth user_metadata.tier · 'black' | 'founder'
// (無 tier / 其他值 = 免費)。 付費走手動銀行轉帳 · Tim 確認入帳後手動在
// Supabase Studio 標 user_metadata.tier(0 auto-charge · per /integrity #13)·
// 同 follows / notes / predictions 的 user_metadata pattern · 0 額外 migration。
//
// 用途:解鎖付費會員「優越」(賣分析標價 + 抽成更低 + 未來 verified 標章)·
// 絕不 gate 引擎(引擎永遠免費 · per monetization 鐵律 · /lab NO PAYWALL)。
// 付費優越 = 「能多做什麼(賣分析賺錢)」+「身分」· 不是「免費被砍」。
// ─────────────────────────────────────────────────────

export type MemberTier = "free" | "black" | "founder";

/** Read tier from Supabase user_metadata. Defaults to free on any mismatch. */
export function readTier(
  meta: Record<string, unknown> | null | undefined,
): MemberTier {
  const t = meta?.tier;
  return t === "black" || t === "founder" ? t : "free";
}

export function isPaid(tier: MemberTier): boolean {
  return tier !== "free";
}

/** 平台賣分析抽傭 % · Founders 5% · BLACK 10% · per /membership canonical。 */
export function creatorFeePct(tier: MemberTier): number {
  return tier === "founder" ? 5 : 10;
}

/** 賣家分潤 %(100 − 抽傭)· Founders 拿 95% · BLACK 拿 90%。 */
export function creatorTakePct(tier: MemberTier): number {
  return 100 - creatorFeePct(tier);
}

// ── Canonical 等級名(R189 · Tim 拍板 Polymarket 極簡 OPEN/BLACK/FOUNDER)──
// 單一真相 · 所有顯示等級名的 surface 從這裡取 · 改名只動這一處(防 drift)。
// 心理學:地位 = 身份不是價格。「免費」是價格標籤(把最大群用戶貼成「沒付錢」)
// → 換成「OPEN」身份。 王牌留單一粗體字 · 留白即自信(Amex 黑卡不打廣告 ·
// 真正的優越感安靜到別人偷不走)。「FOUNDER 會員」稀缺機制不動(那是 perk
// 不是等級名)。
export const TIER_NAME: Record<MemberTier, string> = {
  free: "OPEN",
  black: "BLACK",
  founder: "FOUNDER",
};

export function tierLabel(tier: MemberTier): string {
  return TIER_NAME[tier];
}
