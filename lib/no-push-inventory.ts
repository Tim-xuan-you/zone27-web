// ── ZONE 27 · No-Push Inventory(deliberate absences)──────
// R73 W-D · Agent A R73 SHIP 2 · single-source array of 11+ engagement
// patterns ZONE 27 has DELIBERATELY not built · Brehm Reactance Theory
// (1966)+ Deci/Ryan Self-Determination Theory(1985)psychology · anti-
// push activates resistance not compliance · autonomy-support → premium
// retention superior to extrinsic motivators。
//
// Mubi(curated cinema · no algorithm · 30-film monthly slate · 100k+
// subscribers)+ Calm(no notification streaks · 4M paid)+ Are.na(slow-
// web · 50k+ paid)+ Astral Codex Ten(no comments · no push · 100k+ paid)
// + 1Password(no telemetry · subscription-only)pattern · publishing the
// restraint as costly signal(Spence 1973)· not invisible like competitors。
//
// What looks like nothing is the most expensive 11 lines on the site。
//
// brand IP fit:
//   - per 11 「永遠不做」 CLAUDE.md list · operational scaffold(promote
//     existing brand axiom into public artifact)
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「here's what we
//     deliberately don't do」 explicit costly signaling
//   - per [[zone27-disclosure-philosophy]] · same disclosure axis as
//     /audit S05 PRE-COMMIT + /transparency 11-item NEVER list
//   - per Patagonia「Don't Buy This Jacket」 2011 anti-consumption-as-
//     reciprocity NYT case study
//
// 不做 anti-pattern:
//   ✕ NO「instead we have BETTER alternative XYZ」(would convert
//     restraint into sales pitch · violates costly-signaling-via-
//     restraint axiom)
//   ✕ NO emoji ✕✕✕ stack(grammar should be quiet typographic restraint
//     not visual SHOUT)
//   ✕ NO "Coming Soon: feature X"(brand IP rejects future-promise)
//
// Append-only discipline per /audit S05 PRE-COMMIT clause · remove an
// entry = 30-day /changelog notice · same physics-of-time as ENGINE_DIFF_
// BEACONS(R71 W-C)+ founders-stats claimedFounders + lib/diff-commits.ts。
// ─────────────────────────────────────────────────────

export type NoPushItem = {
  /** Short imperative title · what ZONE 27 doesn't do · max ~25 chars zh */
  what: string;
  /** 1-line rationale · cite mainstream brand that DOES this + 11-list
   *  redline reference or brand-IP rationale */
  why: string;
  /** Inspiration source · concrete brand that uses this pattern · we don't */
  source: string;
};

/** 12 deliberate absences · brand-pure restraint inventory · append-only
 *  per /audit S05 PRE-COMMIT clause discipline · 修改需 30 天 /changelog 公告。 */
export const NO_PUSH_INVENTORY: ReadonlyArray<NoPushItem> = [
  {
    what: "Push notifications · ever",
    why: "iOS/Android push permission ask = 第一個 trust collapse · /audit S06 0-tracker promise + 不打擾就是禮物 axiom 永久 binding",
    source: "MLB At Bat / The Athletic / Robinhood all push by default",
  },
  {
    what: "Email digest / newsletter cadence",
    why: "「每週四 22:30」 cadence promise 違反 /now「無 weekly schedule promise」 axiom · only RSS /feed.xml pull-based(R51 W-E)· 不 push email",
    source: "Substack / Stratechery / The Athletic Plus all email-digest weekly",
  },
  {
    what: "Streak counter / 連勝 X 場 badge",
    why: "11 「永遠不做」 #2 daily-login farming redline · Duolingo / Snapchat / Robinhood streak farming = engagement loop ≠ epistemic discipline · R53 7-tier badge IS the brand-pure substitute",
    source: "Duolingo 365-day streak · Snapchat ❤️ streak",
  },
  {
    what: "Days Followed badge",
    why: "Same axis as streak · 「您 follow this match X 天 · 解鎖 Y」 = engagement-for-discount inversion of subscription economics",
    source: "Patreon tier-by-loyalty · Discord activity badges",
  },
  {
    what: "「您可能 miss」 reminder copy",
    why: "FOMO manufactured urgency = reactance trigger(Brehm 1966)· hardcore CPBL fans burned by LINE 老師 pattern-match this as suspicious",
    source: "Booking.com / Hotels.com / Airbnb live FOMO banners",
  },
  {
    what: "Weekly「we just shipped」 nag email",
    why: "Newsletter cadence + push hybrid · 推 visitor 回 site = extrinsic motivation overpowers intrinsic · DECI/RYAN 1985 SDT 違反",
    source: "Linear changelog email · Notion weekly recap",
  },
  {
    what: "Unlock-this-feature CTA in app",
    why: "「升級 BLACK CARD 解鎖 X feature」 = engagement-farming for upsell · BLACK CARD 是 identity tier 不是 functionality gate · per [[zone27-monetization-philosophy]] engine FREE forever",
    source: "Notion AI 解鎖 · Linear Plus 解鎖 · Figma Pro 解鎖",
  },
  {
    what: "Calibration anniversary",
    why: "「您 join 365 天 · 慶祝」 = engagement-loop celebration · 同 streak axis · 同 daily-login farming axis · brand IP rejects identity-via-time-served",
    source: "GitHub Sponsors anniversary · LinkedIn work anniversary",
  },
  {
    what: "Live presence indicator(「X 人在看這場」)",
    why: "11 「永遠不做」 #5 live FOMO counter redline · presence indicators = manufactured social proof · ZONE 27 audience pattern-match 報馬仔",
    source: "Booking.com 「X people viewing now」 · Stripe Atlas applicants ticker",
  },
  {
    what: "「Subscribe to be notified」 modal",
    why: "11 「永遠不做」 #9 modal paywall scroll-lock redline · scroll-lock 即 reactance trigger · /audit S05 PRE-COMMIT 永久 binding",
    source: "Medium subscribe modal · Substack email overlay",
  },
  {
    what: "Welcome animation / confetti",
    why: "MemberHomeHero R70 W-A explicit footer「NO welcome animation」 + 不打擾就是禮物 axiom · animation = extrinsic dopamine spike · audience-fans-not-engineers 不需 SaaS celebration",
    source: "Notion onboarding confetti · Linear welcome 動畫",
  },
  {
    what: "Countdown to apply / countdown to anything",
    why: "Loss aversion countdown(Kahneman 1979)= manufactured deadline · 11 「永遠不做」 #5 spirit · /founders/ledger empty roll IS the scarcity signal · countdown 反 brand IP",
    source: "Tesla pre-order timer · Stripe Optimizely conversion timer · Booking.com",
  },
];

/** Computed count · used by component header chip · per inventory append
 *  size · brand IP「what looks like nothing is the most expensive N lines」
 *  surface · transparency-friendly explicit counter。 */
export const NO_PUSH_COUNT = NO_PUSH_INVENTORY.length;
