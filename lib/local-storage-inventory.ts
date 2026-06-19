// ── ZONE 27 · LocalStorage Inventory(canonical 11-key ledger)──
// R74 W-D · Agent A R73 SHIP 1 · Loewenstein & Issacharoff endowment-via-
// inventory(1994)· extract /audit S06 11-key DataTable into a single-source
// lib · same single-source append-only architecture as ENGINE_DIFF_BEACONS
// (R71 W-C)+ NO_PUSH_INVENTORY(R73 W-D)+ RECIPROCITY_LEDGER(R74 W-A)·
// closes the drift risk explicitly flagged in /audit S06「新 localStorage
// key 加入時 此表必須同步 update · drift = brand IP 自殺」 clause。
//
// Content fidelity:
//   - keys verbatim from /audit S06 R43 W-B verified ground truth
//   - SAME labels · SAME notes · SAME order · no policy change
//   - per /audit S05 PRE-COMMIT clause this is REFACTOR not POLICY MODIFICATION
//   - rules stay binding · architecture improves · drift impossible
//   - R189(2026-06-03)· removed zone27_anon_picks_v1 entry · R188 註冊閘門
//     拿掉免登入押注後沒人再寫這 key · 留著=drift(訪客 DevTools 驗不到)·
//     刪 anon-picks 死碼整串時同步移除此條 · count 自動 11→10
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
    note: "記你支持的球隊 · 在 /track-record 跟賽事頁顯示 · 只存在你的瀏覽器",
    shippedIn: "R13",
  },
  {
    key: "zone27_recent_matches_v1",
    value: "您最近看過的賽事(capped 10)",
    note: "記你最近看過的賽事 · 首頁用來顯示「最近看過」 · 只存在你的瀏覽器",
    shippedIn: "R28",
  },
  {
    key: "zone27_sim_history_v1",
    value: "您 /lab 跑過的模擬結果",
    note: "記你在 /lab 跑過的模擬 · 會員頁用來顯示你的紀錄 · 只存在你的瀏覽器",
    shippedIn: "R29",
  },
  {
    key: "zone27_preview_tier",
    value: "Tim designer dev tool · 預覽 active tier",
    note: "Tim 開發用的預覽工具 · 一般訪客不會用到 · 不含任何個資",
    shippedIn: "R30",
  },
  {
    key: "zone27_last_login_email",
    value: "您上次 /login email 預填",
    note: "記你上次登入的 email · 下次回登入頁自動帶入 · 不會傳到我們伺服器 · 純粹方便你",
    shippedIn: "R30 W-5",
  },
  {
    key: "zone27_last_ledger_n_v1",
    value: "您上次看 /track-record 時的 N · 用於 delta chip 顯示",
    note: "記你上次看公開戰績時的場數 · 讓你下次看到「自從上次又多了幾場」 · 不會傳到我們伺服器 · 不含個資",
    shippedIn: "R49 W-A",
  },
  {
    key: "zone27_shortcut_hint_seen_v1",
    value: "您是否已看過 g-mode 鍵盤 jump 提示(ONE-shot flag)",
    note: "記你是否看過鍵盤快捷鍵的小提示 · 看過一次後就不再跳出 · 不會傳到我們伺服器 · 不含個資 · 不做任何追蹤",
    shippedIn: "R69 W-F",
  },
  {
    key: "zone27_last_visit_v1",
    value: "您上次訪 ZONE 27 的日期(YYYY-MM-DD · TPE-anchored)",
    note: "記你上次來的日期 · 隔天以上回來會看到「上次你來是 X 天前」 · 不是連續登入打卡、沒有每日獎勵 · 不會傳到我們伺服器 · 不含個資",
    shippedIn: "R70 W-B",
  },
];

/** Canonical key count · used by component header chip · the rendered count
 *  is always derived from the array length (never hardcoded) · 5-second
 *  DevTools verifiable claim · drift = self-debunk。 */
export const LOCAL_STORAGE_KEY_COUNT = LOCAL_STORAGE_INVENTORY.length;
