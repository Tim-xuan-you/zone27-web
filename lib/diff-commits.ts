// ── ZONE 27 · Engine Diff Beacons ───────────────────────
// R71 W-C · Agent A R71 SHIP 1 · Berkshire annual letter delivery cadence
// + React.dev changelog pattern + Anthropic model card revision pattern。
//
// Append-only array of dated engine-evolution beacons · used by:
//   - DailyReturnRail(R70 W-B)to surface「自您上次來 · 引擎更新 1 件」
//     deep-link when daysSince >= 7
//   - DiffCommitChip(R71 W-C)reusable component
//   - SilentReceiptStream header(R70 W-C)to parallel deep-return acknowledge
//   - /audit S05 PRE-COMMIT discipline · append-only · no retroactive edits
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · array publicly inspectable in
//     GitHub source · same grammar as /methodology/diff R50 W-A entire
//     v0.2→v0.3 delta · append-only physics
//   - per [[feedback-zone27-pratfall-brand-ip]] · beacons can include
//     DIVERGED matches + brand IP self-correction events(not just PROVED
//     PR victories)· disclosure-parity Pratfall surface
//   - per 不打擾就是禮物 · only fires when visitor return >=7 days · 不 nag
//     daily returners(per DailyReturnRail R70 W-B conditional render)
//
// Append-only rule(/audit S05 PRE-COMMIT extension):
//   ✕ NEVER edit existing beacon's date(timestamps are physical truth)
//   ✕ NEVER delete a beacon(if a ship was reverted · add NEW reverse beacon)
//   ✕ NEVER reorder(canonical ASCENDING chronological)
//   ✓ Append NEW beacon when wave introduces engine evolution worth deep-link
//   ✓ Beacons MUST cross-link to existing /methodology/diff anchor OR
//     /now journal entry OR /audit S05 section · NOT inline marketing
//
// Sort guarantee · ASCENDING(oldest first)· same as SilentReceiptStream
// archive paradigm · consumers may filter by ISO date >= cutoff and pick
// most-recent for return-visitor surface。
// ─────────────────────────────────────────────────────

export type EngineDiffBeacon = {
  /** ISO YYYY-MM-DD · TPE-anchored · physical ship date */
  date: string;
  /** Short user-visible label · max ~80 chars · brand-pure(no marketing copy) */
  label: string;
  /** Deep link to /methodology/diff anchor · /now journal entry · or /audit section */
  href: string;
};

/** Engine evolution beacons · APPEND-ONLY · ASCENDING chronological order ·
 *  per /audit S05 PRE-COMMIT clause extension · modifications require 30-day
 *  /changelog announcement(per existing discipline)。 */
export const ENGINE_DIFF_BEACONS: ReadonlyArray<EngineDiffBeacon> = [
  {
    date: "2026-05-21",
    label: "v0.2 BASE LIVE · cpbl-260521-01 first PROVED receipt(N=1 launch)",
    href: "/track-record",
  },
  {
    date: "2026-05-22",
    label: "v0.3 EXPANSION 1 · PARK FACTOR · 4 場館 calibrated · DEV PREVIEW",
    href: "/methodology/diff#park-factor",
  },
  {
    date: "2026-05-22",
    label: "/transparency aggregator · 6-section audit + 8-binding-NOT-DO grid",
    href: "/transparency",
  },
  {
    date: "2026-05-23",
    label: "/methodology Section 06 · ENGINE DRY DOCK · v0.2/v0.3/v0.4 state machine",
    href: "/methodology#section-06",
  },
];

/** Find the most-recent beacon since a given ISO date(exclusive)· returns
 *  null if no newer beacons exist · used by DailyReturnRail to surface
 *  「since your last visit · 1 engine update:[label] →」 chip。 */
export function findBeaconSince(
  sinceIso: string,
): EngineDiffBeacon | null {
  // Walk ASCENDING list · find first beacon > sinceIso · then continue to
  // find newest beacon。 Linear walk fine because array stays small.
  let newest: EngineDiffBeacon | null = null;
  for (const b of ENGINE_DIFF_BEACONS) {
    if (b.date > sinceIso) {
      // Walk past 直到最新一筆 · keep updating newest
      if (newest === null || b.date >= newest.date) {
        newest = b;
      }
    }
  }
  return newest;
}

/** Count beacons since a given ISO date · used to surface「since your last
 *  visit · N engine updates」 framing when multiple beacons accumulated。 */
export function countBeaconsSince(sinceIso: string): number {
  return ENGINE_DIFF_BEACONS.filter((b) => b.date > sinceIso).length;
}
