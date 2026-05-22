// ── ZONE 27 · Founders 27 — single source of truth ────
// Founders state used everywhere: /leaderboard wall, /founders sales
// page, OG cards, ScarcityStrip site-wide counter.
//
// 為保護隱私,只公布編號與認領日,絕不公布身分。
//
// Status: still hardcoded by design. The 7 founders below are
// placeholder until Tim manually onboards real Founders 27 members
// (per [[zone27-payment-architecture]] memory · manual bank
// transfer · ~Q3 2026 launch). At that point, build a
// `public.founders` Supabase table parallel to `waitlist`, and
// migrate this file to read its `claimedFounders` from a
// SECURITY DEFINER aggregate function (mirror of get_waitlist_count
// pattern in supabase/migrations/0001_waitlist.sql). Every consumer
// of this file imports the derived constants, so the migration
// stays a one-file change.
//
// Note: waitlist DB was migrated to Supabase on 2026-05-20
// (see [[zone27-supabase-architecture]]). The founders table is
// a separate piece of work tied to payment-system launch.
// ─────────────────────────────────────────────────────

export const FOUNDERS_TOTAL = 270;

export type ClaimedFounder = {
  id: number;
  claimedOn: string; // ISO date (YYYY-MM-DD)
  /** 公開 alias · per Round 31 W-V2 Public Roll Call agent ONE sharp call ·
   *  identity signal visible without PII broadcast。 真實 founders Q3 onboard
   *  時自選 · system test placeholders 以 SYSTEM-TEST-N format honest 顯示。 */
  alias?: string;
  /** 公開 rationale · 1-2 句 · 真實 founders Q3 onboard 時 Tim 親手記錄 ·
   *  pre-launch placeholders 標明 system test state · 不假裝是真 founder。 */
  rationale?: string;
};

// Round 31 W-V2 · per [[feedback_zone27_pratfall_brand_ip]] · honest
// disclosure 「7 是 Tim system test placeholders · 真實 Q3 onboard 後 forge
// 取代」 brand IP 同 W-G STAT LITERACY pattern · 不假裝。 alias 用 SYSTEM-TEST
// 自我入罪 · skeptic 看到不會誤判「7 個假人」。
export const claimedFounders: ClaimedFounder[] = [
  {
    id: 1,
    claimedOn: "2026-05-12",
    alias: "SYSTEM-TEST-#001",
    rationale: "Tim 親手 forged · system 開發測試用 placeholder · 真實第一位 founder Q3 onboard 後取代 · 公開記錄 transfer history。",
  },
  {
    id: 2,
    claimedOn: "2026-05-13",
    alias: "SYSTEM-TEST-#002",
    rationale: "system test placeholder · Q3 取代 · brand IP 不藏 placeholder 狀態。",
  },
  {
    id: 3,
    claimedOn: "2026-05-13",
    alias: "SYSTEM-TEST-#003",
    rationale: "system test placeholder · Q3 取代。",
  },
  {
    id: 4,
    claimedOn: "2026-05-14",
    alias: "SYSTEM-TEST-#004",
    rationale: "system test placeholder · Q3 取代。",
  },
  {
    id: 5,
    claimedOn: "2026-05-16",
    alias: "SYSTEM-TEST-#005",
    rationale: "system test placeholder · Q3 取代。",
  },
  {
    id: 6,
    claimedOn: "2026-05-17",
    alias: "SYSTEM-TEST-#006",
    rationale: "system test placeholder · Q3 取代。",
  },
  {
    id: 7,
    claimedOn: "2026-05-18",
    alias: "SYSTEM-TEST-#007",
    rationale: "system test placeholder · Q3 取代。",
  },
];

export const FOUNDERS_CLAIMED = claimedFounders.length;
export const FOUNDERS_REMAINING = FOUNDERS_TOTAL - FOUNDERS_CLAIMED;
export const FOUNDERS_NEXT = FOUNDERS_CLAIMED + 1;
export const FOUNDERS_PROGRESS = FOUNDERS_CLAIMED / FOUNDERS_TOTAL;

export function isClaimed(n: number): boolean {
  return claimedFounders.some((f) => f.id === n);
}

export function formatBadge(n: number): string {
  return `#${String(n).padStart(3, "0")}`;
}
