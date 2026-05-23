// ── ZONE 27 · Engine Operations Log Entries ─────────────
// R76 W-C · Agent A R76 SHIP A ★★★★★ · Stripe Status 2012(Amber Feng
// week-1 hire · status page as brand artifact #1)+ Cloudflare 2025-11-18
// postmortem template + Anthropic 2025-09 postmortem + Tailscale changelog
// dated-entries pattern。 The「biggest invisible gap」 per Agent A R76:
// ZONE 27 has 46 routes describing the engine · but NONE recording the
// engine's OPERATIONAL LIFE。 Stripe shipped status page in week 1 of being
// a company BEFORE first paying customer · because operational artifact IS
// the proof-of-realness · marketing pages aren't。
//
// Distinct from ENGINE_DIFF_BEACONS(R71 W-C):
//   - ENGINE_DIFF_BEACONS = engine evolution events for deep-link from
//     return visits(DailyReturnRail R70 W-B + DiffCommitChip R71 W-C)
//     · 4 entries · ASCENDING chronological · forward-looking
//   - ENGINE_OPS_LOG = full operational artifact · includes re-runs +
//     receipt corrections + input-staleness + methodology updates · NEW
//     spine for all future trust events · backward-looking + present-state
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · publishes weakness · re-runs
//     admitted not hidden · same Pratfall axis as /track-record DIVERGED
//     等大 + /audit S05 PRE-COMMIT
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「engine alive · someone
//     on it」 signal · Costly Signaling 100× per Spence 1973 · cannot fake
//     operational artifact
//   - per /audit S05 PRE-COMMIT clause · log entries APPEND-ONLY · NEVER
//     retroactively edit / delete · same single-source append-only as
//     ENGINE_DIFF_BEACONS + NO_PUSH_INVENTORY + RECIPROCITY_LEDGER +
//     LOCAL_STORAGE_INVENTORY + SOLO_FOUNDER_PEERS pattern
//   - per /ethics commitment #5 · 7-day post-final ingest SLA · /engine-log
//     entries 物理 codify the SLA discharge events
//
// 不做 anti-pattern:
//   ✕ NO live uptime monitor / availability dashboard(static text only ·
//     不 dynamic · 不 monitoring · 不 server cost)
//   ✕ NO 「subscribe to engine status email digest」 CTA(violates 不打擾)
//   ✕ NO push notification for new log entries(per NoPushManifest R73 W-D)
//   ✕ NO public engine error count / error rate(per /privacy 0-telemetry)
//   ✕ NO blame / point-fingers grammar in postmortem entries(brand IP
//     「不藏錯但不 assign blame」 · Tim solo founder · errors are Tim errors)
//
// Inspiration sources(per Agent A R76 SHIP A spec):
//   - Stripe Status(2012 · Amber Feng week-1 hire · brand artifact #1)
//   - Cloudflare Nov 2025 postmortem(UTC-stamped narrative · root cause)
//   - Anthropic Sept 2025 postmortem(7-week delay = trust spent on speed)
//   - Tailscale Changelog(dated · public · monthly · no marketing)
//   - Linear changelog Now-Next-Later(roadmap horizons NOT calendar dates)
//
// Append-only rule:
//   ✕ NEVER edit existing entry's date(timestamps physical truth)
//   ✕ NEVER delete entry(if event reverted · add NEW reverse entry)
//   ✕ NEVER reorder(canonical ASCENDING chronological)
//   ✓ Append NEW entry when engine event occurs(re-run · correction ·
//     input-staleness · methodology update · receipt re-ingest etc)
//   ✓ Each entry MUST cite receipt-id OR methodology section OR commit SHA
//     OR /now journal entry · NOT inline marketing
// ─────────────────────────────────────────────────────

export type EngineOpsEventType =
  | "engine-launch" // initial engine version ship(v0.2 BASE etc)
  | "engine-evolution" // v0.3 Park Factor DEV PREVIEW · methodology update
  | "receipt-ingest" // new match finalized + receipt landed
  | "receipt-correction" // existing receipt re-ran due to input correction
  | "input-staleness" // input data source went stale · re-ingest required
  | "methodology-update" // /methodology section update
  | "ops-log-meta" // meta-event about the log itself(e.g. initialization);

export type EngineOpsLogEntry = {
  /** ISO YYYY-MM-DD · TPE-anchored · physical event date */
  date: string;
  /** Event type · enum above · enables filtered views in future */
  eventType: EngineOpsEventType;
  /** Short user-visible label · max ~80 chars · brand-pure(no marketing) */
  label: string;
  /** 2-3 sentence detail · what happened + why + impact · brand-pure honest */
  detail: string;
  /** Optional receipt ID if event ties to specific match(cpbl-260521-01) */
  receiptId?: string;
  /** Optional deep link · /methodology section · /now journal · etc */
  href?: string;
  /** Optional commit SHA · GitHub permalink to physical change */
  commitSha?: string;
};

/** Engine operations log · APPEND-ONLY · ASCENDING chronological · per
 *  /audit S05 PRE-COMMIT clause extension · 修改任 entry 需 30 天前
 *  /changelog 公告 · same Costly Signaling discipline as canonical pattern
 *  (ENGINE_DIFF_BEACONS + NO_PUSH_INVENTORY + RECIPROCITY_LEDGER +
 *  LOCAL_STORAGE_INVENTORY + SOLO_FOUNDER_PEERS + REFUSAL_RATIONALES)。 */
export const ENGINE_OPS_LOG: ReadonlyArray<EngineOpsLogEntry> = [
  {
    date: "2026-05-21",
    eventType: "engine-launch",
    label: "v0.2 BASE engine first production ship",
    detail:
      "ZONE 27 engine v0.2 Pitcher-Only Monte Carlo first production deployment · cpbl-260521-01 統一 vs 富邦 · Tim 親手 screenshot cpbl.com.tw box score · Claude 解析 · git commit · finalResult ingested into lib/matches.ts · per /ethics commitment #5 7-day post-final SLA · first PROVED receipt landed on /track-record。",
    receiptId: "cpbl-260521-01",
    href: "/methodology",
  },
  {
    date: "2026-05-22",
    eventType: "engine-evolution",
    label: "v0.3 EXPANSION 1 · Park Factor · 4 場館 calibrated · DEV PREVIEW",
    detail:
      "Engine v0.3 ships Park Factor adjustment for 4 CPBL 場館(新莊 / 台中 / 高雄 / 桃園)· HR rate sensitivity coefficient calibrated · DEV PREVIEW state(per /methodology#section-06 ENGINE DRY DOCK)· production ship waits N≥30 sample · /methodology/diff entire v0.2→v0.3 logic delta published(R50 W-A)。",
    href: "/methodology/diff#park-factor",
  },
  {
    date: "2026-05-22",
    eventType: "methodology-update",
    label: "/transparency aggregator route published",
    detail:
      "6-section audit + 8-binding-NOT-DO + Anthropic Transparency Hub pattern · 統一 surface scattered /audit + /methodology + /coverage + /track-record + /ethics + /steelman trust content into navigable destination · brand IP Disclosure axis 物理 codify(R51 W-D)。",
    href: "/transparency",
  },
  {
    date: "2026-05-23",
    eventType: "methodology-update",
    label: "/methodology Section 06 ENGINE DRY DOCK state machine published",
    detail:
      "DHH HEY「inbox state IS the dashboard」 grammar · 4 single-status-per-row chips(v0.2 LIVE · v0.3 DEV PREVIEW · v0.4 SPEC LOCKED · NEXT SHIP NOT YET COMMITTED)· NO progress bar / NO ETA / NO marketing copy · per Agent A R69 SHIP 3 deferred shipped R71 W-A。",
    href: "/methodology#section-06",
  },
  {
    date: "2026-05-23",
    eventType: "ops-log-meta",
    label: "/engine-log operational artifact spine initialized",
    detail:
      "Stripe Status 2012 + Cloudflare 2025 postmortem + Tailscale changelog pattern · ZONE 27 operational artifact surface NEW · per Agent A R76 「biggest invisible gap」 honest answer · APPEND-ONLY log of engine re-runs + receipt corrections + input-staleness + methodology updates · /engine-log IS the「engine alive · someone on it」 signal · cannot fake operational artifact · same single-source pattern as ENGINE_DIFF_BEACONS + NO_PUSH_INVENTORY + RECIPROCITY_LEDGER。",
    href: "/engine-log",
  },
];

/** Computed count · used by component header chip · brand IP「N operational
 *  events since launch」 surface · 5-second DevTools verifiable claim · drift
 *  = brand IP self-debunk per /audit S05 PRE-COMMIT axiom。 */
export const ENGINE_OPS_LOG_COUNT = ENGINE_OPS_LOG.length;

/** Get entries filtered by event type · enables future filtered views ·
 *  brand-pure data accessor · no business logic。 */
export function getEntriesByType(
  type: EngineOpsEventType,
): ReadonlyArray<EngineOpsLogEntry> {
  return ENGINE_OPS_LOG.filter((e) => e.eventType === type);
}

/** Get latest entry · used for /engine-log hero chip · brand-pure data
 *  accessor · returns null if log empty(impossible state · but defensive)。 */
export function getLatestEntry(): EngineOpsLogEntry | null {
  if (ENGINE_OPS_LOG.length === 0) return null;
  return ENGINE_OPS_LOG[ENGINE_OPS_LOG.length - 1];
}
