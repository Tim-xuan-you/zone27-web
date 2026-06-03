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
//     LOCAL_STORAGE_INVENTORY + SOLO_GOLD_PEERS pattern
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
 *  LOCAL_STORAGE_INVENTORY + SOLO_GOLD_PEERS + REFUSAL_RATIONALES)。 */
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
      "6-section audit + 8-binding-NOT-DO + Anthropic Transparency Hub pattern · 統一 surface scattered /audit + /methodology + /coverage + /track-record + /ethics + /steelman trust content into navigable destination · brand IP Disclosure axis 物理 codify(R51 W-D)。 R164 collapsed into /audit canonical hub per Apple discipline。",
    href: "/audit",
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
      "Stripe Status 2012 + Cloudflare 2025 postmortem + Tailscale changelog pattern · ZONE 27 operational artifact surface NEW · per Agent A R76 「biggest invisible gap」 honest answer · APPEND-ONLY log of engine re-runs + receipt corrections + input-staleness + methodology updates · /engine-log IS the「engine alive · someone on it」 signal · cannot fake operational artifact · same single-source pattern as ENGINE_DIFF_BEACONS + NO_PUSH_INVENTORY + RECIPROCITY_LEDGER。 R164 collapsed into /audit canonical hub per Apple discipline。",
    href: "/audit",
  },
  {
    date: "2026-05-23",
    eventType: "receipt-ingest",
    label: "cpbl-260523-01 ingested · 味全 0:2 台鋼 @ 澄清湖 · PROVED ✓",
    detail:
      "Tim 親手 cpbl.com.tw screenshot ingest · 味全龍 vs 台鋼雄鷹 @ 澄清湖棒球場 · final 0-2 home wins · WP 坎南(台鋼)· LP 布雷克(味全)· SV 林詩翔(台鋼)· Engine 賽前 51% home → home wins 2-0 → PROVED ✓ · brand IP「engine 言中」 物理 codify · per /ethics commitment #5 7-day post-final SLA · /track-record N=1→2 finalized。",
    receiptId: "cpbl-260523-01",
    href: "/receipts/cpbl-260523-01",
  },
  {
    date: "2026-05-23",
    eventType: "receipt-ingest",
    label: "cpbl-260523-02 ingested · 富邦 3:1 樂天 @ 樂天桃園 · PROVED ✓",
    detail:
      "Tim 親手 cpbl.com.tw screenshot ingest · 富邦悍將(AWAY 21-15-0)vs 樂天桃猿(HOME 15-20-1)@ 樂天桃園棒球場 · final 1-3 away wins · WP 鈴木駿輔(富邦)· LP 艾菩樂(樂天)· SV 曾峻岳(富邦)· Engine 賽前 54% away → away wins 3-1 → PROVED ✓ · /track-record N=2→3 finalized。",
    receiptId: "cpbl-260523-02",
    href: "/receipts/cpbl-260523-02",
  },
  {
    date: "2026-05-23",
    eventType: "receipt-ingest",
    label: "cpbl-260523-03 ingested · 統一 2:0 兄弟 @ 大巨蛋 · PROVED ✓",
    detail:
      "Tim 親手 cpbl.com.tw screenshot ingest · 統一獅(AWAY 25-13-0 league leader)vs 中信兄弟(HOME 11-25-1 last place)@ 臺北大巨蛋 · final 0-2 away wins · WP 梅賽鎂(統一)· LP 德保拉(兄弟)· SV 林凱威(統一)· Engine 賽前 64% away → away wins 2-0 → PROVED ✓ · 4 consecutive PROVED receipts(cpbl-260521-01 + cpbl-260523-01/02/03)· N=3→4 finalized · brand IP「方法公開 · PROVED + DIVERGED 等大」 axiom 物理 codify · 沒 cherry-pick · 沒 retroactive 加權。",
    receiptId: "cpbl-260523-03",
    href: "/receipts/cpbl-260523-03",
  },
  {
    date: "2026-05-25",
    eventType: "receipt-correction",
    label:
      "cpbl-260524-01 + -02 pre-game team identity ingest error · honest disclosure",
    detail:
      "Tim 賽後 screenshot ingest 2026-05-25 顯示 cpbl-260524-01 + cpbl-260524-02 pre-game 截圖 ingest 時 away team identity 互相 swap · -01 應為「味全龍 with 鋼龍」(pre-game 寫成 統一獅)· -02 應為「統一7-ELEVEn獅 with 高塩將樹」(pre-game 寫成 味全龍 with 胡智為)· 鋼龍 為 味全龍 starter per lib/cpbl-pitchers.ts canonical(acnt 0000006497)· 不是 統一獅 player。 處理 per Costly Signaling immutability axiom + Disclosure axiom dual: pre-game winRate 數字 immutable 不修改 · 不 retroactive 重算 · 但 finalResult 加詳細 inline comment 顯式 surface identity error · /track-record calibration 仍按已 lock-in winRate 計算 home/away side prediction(side-level 判斷不受 team-identity bug 影響)· /engine-log 此 entry 公開記錄 ingest pipeline 改善方向(R110+ Tim pre-game 截圖 + Claude ingest workflow 加入 「pitcher cross-reference cpbl-pitchers.ts team match」 verification step · 不 silently 通過 identity mismatch)。 同 Cloudflare 2025-11 postmortem「我們做了什麼錯 · 不藏 · 不甩鍋」 grammar · per Pratfall 100×。",
    href: "/audit#section-05",
  },
  {
    date: "2026-05-25",
    eventType: "receipt-ingest",
    label:
      "cpbl-260524-01 ingested · 味全 5:0 兄弟 @ 大巨蛋 · PROVED ✓(with team identity disclosure)",
    detail:
      "Tim 親手 cpbl.com.tw screenshot ingest · 賽後實際 away team 味全龍(rec 26-13-0)vs HOME 中信兄弟(rec 11-26-1)@ 臺北大巨蛋 · final 0-5 away wins · WP 鋼龍(味全 · era 2.63 per cpbl-pitchers.ts)· LP 鄭浩均(中信)· Engine 賽前 65% away → away wins 5-0 → PROVED ✓ side prediction · BUT pre-game away team identity 錯掛 「統一獅」(actual 「味全龍」)· per /audit S05 disclosure 不藏 · /receipts/cpbl-260524-01 內 inline 顯式 surface · 同 receipt-correction entry above · /track-record N=4→5 finalized · 5 consecutive PROVED side-level predictions · identity bug 不影響 side-level math。",
    receiptId: "cpbl-260524-01",
    href: "/receipts/cpbl-260524-01",
  },
  {
    date: "2026-05-25",
    eventType: "receipt-ingest",
    label:
      "cpbl-260524-02 ingested · 統一 7:5 台鋼 @ 澄清湖 · DIVERGED ✕(with team identity disclosure)",
    detail:
      "Tim 親手 cpbl.com.tw screenshot ingest · 賽後實際 away team 統一7-ELEVEn獅 vs HOME 台鋼雄鷹 @ 澄清湖棒球場 · final 5-7 away wins · WP 高塩將樹(統一)· LP 林詩翔(台鋼)· SV 鍾允華(統一)· Engine 賽前 52% home(slight favorite)→ away wins 7-5 → DIVERGED ✕ · pre-game away team identity 錯掛 「味全龍 with 胡智為」(actual 「統一獅 with 高塩將樹」)· 同 cpbl-260524-01 swap error · 不藏 · /receipts/cpbl-260524-02 內 inline 顯式 surface · /track-record N=5→6 finalized · 第 1 個 DIVERGED 進入 ledger · 同 PROVED 等大 公開 per /audit S05 disclosure parity axiom · 不 cherry-pick · 不 retroactive 隱藏。",
    receiptId: "cpbl-260524-02",
    href: "/receipts/cpbl-260524-02",
  },
  {
    date: "2026-05-25",
    eventType: "receipt-ingest",
    label: "cpbl-260524-03 ingested · 富邦 1:4 樂天 @ 樂天桃園 · DIVERGED ✕",
    detail:
      "Tim 親手 cpbl.com.tw screenshot ingest · 富邦悍將(AWAY 21-16-0)vs 樂天桃猿(HOME 16-20-1)@ 樂天桃園棒球場 · final 4-1 home wins · WP 陳克羿(樂天)· LP 陳品宏(富邦)· SV 莊昕諺(樂天)· Engine 賽前 55% away(slight favorite)→ home wins 4-1 → DIVERGED ✕ · ✓ clean ingest · 0 identity error(pre-game team identity + pitchers 全 match · CPBL screenshot)· /track-record N=6→7 finalized · 第 2 個 DIVERGED 進 ledger · 同 PROVED 等大 公開 · brand IP「engine 並非全對 · 不藏」 axiom 物理 codify · 信心 ratio 全 transparent。",
    receiptId: "cpbl-260524-03",
    href: "/receipts/cpbl-260524-03",
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
