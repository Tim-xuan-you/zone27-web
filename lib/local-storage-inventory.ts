// ── ZONE 27 · LocalStorage Inventory(canonical 11-key ledger)──
// R74 W-D · Agent A R73 SHIP 1 · Loewenstein & Issacharoff endowment-via-
// inventory(1994)· extract /audit S06 11-key DataTable into a single-source
// lib · same single-source append-only architecture as ENGINE_DIFF_BEACONS
// (R71 W-C)+ NO_PUSH_INVENTORY(R73 W-D)+ RECIPROCITY_LEDGER(R74 W-A)·
// closes the drift risk explicitly flagged in /audit S06「新 localStorage
// key 加入時 此表必須同步 update · drift = brand IP 自殺」 clause。
//
// Content fidelity:
//   - 11 keys verbatim from /audit S06 R43 W-B verified ground truth
//   - SAME labels · SAME notes · SAME order · no policy change
//   - per /audit S05 PRE-COMMIT clause this is REFACTOR not POLICY MODIFICATION
//   - rules stay binding · architecture improves · drift impossible
//
// The endowment mechanic(Loewenstein/Issacharoff 1994):
//   - visitor's localStorage holds their personal ZONE 27 state
//   - SEEING the inventory surfaces ownership cognition
//   - 「these 11 rows are MY data on MY device」 = endowment effect activated
//   - same axis as Letterboxd diary(R70 W-B DailyReturnRail)+ Pinboard
//     archive view(R70 W-C SilentReceiptStream)· client-state-as-receipt
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · /audit S06 「方法公開 延伸 到
//     client-side state」 grammar 物理 codify · 升級 到 component-level
//   - per [[zone27-monetization-philosophy]] · client-side data ownership
//     reinforces 「engine FREE forever」 · 0 server lock-in
//   - per /audit S05 PRE-COMMIT clause · append-only · 修改任一 key 需
//     30 天前 /changelog 公告 · 同 ENGINE_DIFF_BEACONS axiom
//   - per [[feedback-zone27-pratfall-brand-ip]] · expose every key visitor
//     can verify with DevTools · drift = 5-second self-debunk
//
// 不做 anti-pattern:
//   ✕ NO「CLEAR ALL ZONE 27 DATA」 button(brand IP「我們不會在您 clear
//     後試圖重新寫入」 · clear is DevTools browser-level operation · we
//     don't intervene)
//   ✕ NO「export your data」 CTA(brand IP 「不誇大 GDPR」 · localStorage
//     is YOUR data already · you DevTools right-click → copy is the export)
//   ✕ NO actual value preview(brand IP「不藏不假裝」 ≠ leak visitor state
//     into UI · component shows SCHEMA not VALUE)
//   ✕ NO localStorage USAGE counter(brand IP「0 telemetry」 · we cannot
//     and will not count visitor's localStorage activity)
// ─────────────────────────────────────────────────────

export type LocalStorageKeyEntry = {
  /** Exact localStorage key string · 5-second DevTools verify · must match source code */
  key: string;
  /** User-facing description · what this key stores · 1 line zh */
  value: string;
  /** Detailed rationale · which component writes / reads · source-of-truth lib file · ship round number */
  note: string;
  /** Round shipped in · for chronology display · e.g. "R41" or "R67 W-A" */
  shippedIn: string;
};

/** 11 canonical localStorage keys ZONE 27 writes to visitor's browser ·
 *  verbatim from /audit S06 R43 W-B verified ground truth · refactored
 *  into single-source append-only ledger per R74 W-D · canonical drift
 *  control pattern same as ENGINE_DIFF_BEACONS / NO_PUSH_INVENTORY /
 *  RECIPROCITY_LEDGER。 */
export const LOCAL_STORAGE_INVENTORY: ReadonlyArray<LocalStorageKeyEntry> = [
  {
    key: "z27_team",
    value: "您支持的 CPBL 隊伍",
    note: "6 隊 enum · TeamPickPanel 寫入 · /track-record + /matches/[gameId] 讀取(per lib/teams.ts)",
    shippedIn: "R13",
  },
  {
    key: "zone27_recent_matches_v1",
    value: "您最近看過的賽事(capped 10)",
    note: "MatchViewTracker 寫入 · homepage RecentMatchesRow 讀取 · JSON array {gameId, title, viewedAt}(per lib/recent-matches.ts)",
    shippedIn: "R28",
  },
  {
    key: "zone27_sim_history_v1",
    value: "您 /lab 跑過的模擬結果",
    note: "MatchSimulator 寫入 · /member dashboard preview 讀取 · 11 fields with Number.isFinite validation(per lib/sim-history.ts)",
    shippedIn: "R29",
  },
  {
    key: "zone27_engine_voting_v1",
    value: "您 BLACK CARD voting 排序",
    note: "RoadmapVotingPanel 寫入 · drag-rank schema-versioned · /member Section 03 IKEA Effect(per MemberDashboardPreview.tsx)",
    shippedIn: "R29",
  },
  {
    key: "zone27_preview_tier",
    value: "Tim designer dev tool · 預覽 active tier",
    note: "PreviewModeBanner 寫入 · Tim 開發用 · 訪客不會 trigger · 0 PII",
    shippedIn: "R30",
  },
  {
    key: "zone27_last_login_email",
    value: "您上次 /login email 預填",
    note: "LoginForm 寫入 · 您下次回 /login 自動預填 email · 0 server transit · purely UX 便利",
    shippedIn: "R30 W-5",
  },
  {
    key: "zone27_anon_picks_v1",
    value: "您 anonymous picks · 個人 calibration vs engine",
    note: "AnonPickWidget 寫入 · /matches/[gameId] 訪客 pick before peeking · AnonCalibrationStrip 讀 · 0 server · 0 PII · /calibration + homepage 只在您裝置 render · R45 W-A",
    shippedIn: "R45 W-A",
  },
  {
    key: "zone27_last_ledger_n_v1",
    value: "您上次看 /track-record 時的 N · 用於 delta chip 顯示",
    note: "LedgerDeltaChip 寫入 + 讀取 · 每次訪 /track-record 看到「+X since YYYY-MM-DD」 · 純 Endowment effect 心理 hook · 0 server · 0 PII · R49 W-A",
    shippedIn: "R49 W-A",
  },
  {
    key: "zone27_lens_focus_votes_v1",
    value: "您 pre-canvas 1-tap lens vote · per-match commitment artifact",
    note: "LensFocusVote 寫入 · /matches/[gameId] pre /02 LENS CANVAS hub · 6 lens 選 1 個您認為最 matter · 一旦選定就維持一致 · 0 server · 0 PII · 0 leaderboard · 純您裝置 · R67 W-A",
    shippedIn: "R67 W-A",
  },
  {
    key: "zone27_shortcut_hint_seen_v1",
    value: "您是否已看過 g-mode 鍵盤 jump 提示(ONE-shot flag)",
    note: "GlobalShortcuts 寫入 · 訪客第一次 visit 8 秒後 surface ⚡ G+M tip 5 秒自動消失 · 設此 flag 後永不再顯示 · per Raycast/Arc/Linear 「don't teach bouncing visitors」 pattern · 0 server · 0 PII · 0 tracking · R69 W-F",
    shippedIn: "R69 W-F",
  },
  {
    key: "zone27_last_visit_v1",
    value: "您上次訪 ZONE 27 的日期(YYYY-MM-DD · TPE-anchored)",
    note: "DailyReturnRail 寫入 + 讀取 · 訪客 1+ 天後回訪看到「上次您來 X 天前」 honest chip · NOT streak counter · NOT daily-login farming · NO daily reward · 純 Letterboxd diary + Pinboard.in past-tense check-in pattern · 0 server · 0 PII · ONE chip per session · dismiss with × · R70 W-B",
    shippedIn: "R70 W-B",
  },
];

/** Canonical key count · used by component header chip · brand IP「11 keys」
 *  surface · 5-second DevTools verifiable claim · drift = self-debunk。 */
export const LOCAL_STORAGE_KEY_COUNT = LOCAL_STORAGE_INVENTORY.length;
