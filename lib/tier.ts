// ── ZONE 27 · Member Tier (R179) ──────────────────────
// 付費會員 tier 存在 Supabase auth user_metadata.tier · 'black' | 'founder'
// (無 tier / 其他值 = 免費)。 付費走手動銀行轉帳 · Tim 確認入帳後手動在
// Supabase Studio 標 user_metadata.tier(0 auto-charge · per /integrity #13)·
// 同 follows / notes / predictions 的 user_metadata pattern · 0 額外 migration。
//
// 用途:標出付費會員身分(支持者金環 + 會員房間 + Tim 親手回信)·
// 絕不 gate 引擎(引擎永遠免費 · per monetization 鐵律 · /lab NO PAYWALL)。
// 付費 = 「身分/支持」· 不是「能多做什麼」· 引擎/功能/驗證標章全免費(R238 收掉賣分析抽成)。
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

// ── Canonical 等級名(R250 · Tim 拍板:GOLD 收掉,只剩 OPEN / BLACK)──
// 單一真相 · 所有顯示等級名的 surface 從這裡取(防 drift)。
// ⚠️ tier KEY 仍是 `founder`(DB user_metadata.tier 舊值 · 不可改,改了會弄壞既有資料)·
// 但 GOLD 付費層已收掉 → 顯示名改成 BLACK:萬一有 vestigial founder 用戶,公開檔顯示 BLACK
// 而不是已不存在的 GOLD。 站上「Tim 是 founder/創辦人」是不同意思,別動。
export const TIER_NAME: Record<MemberTier, string> = {
  free: "OPEN",
  black: "BLACK",
  founder: "BLACK", // R250 · GOLD 收掉 · founder enum 保留、顯示為 BLACK
};

export function tierLabel(tier: MemberTier): string {
  return TIER_NAME[tier];
}
