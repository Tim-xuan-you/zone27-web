"use client";

import { useCallback, useEffect, useState } from "react";

// ── ZONE 27 · useLocalStorage hook · canonical React 19 idiom ──
// R78 W-E · Code improvement #5 deferred from R66 W-C psychology agent
// research · centralize SSR-safe + try/catch + JSON parse pattern from
// 11+ ad-hoc useEffect+state patterns scattered across:
//   - AnonPickWidget(R45 W-B · zone27_anon_picks_v1)
//   - LensFocusVote(R67 W-A · zone27_lens_focus_votes_v1)
//   - DailyReturnRail(R70 W-B · zone27_last_visit_v1)
//   - AnonCalibrationStrip(R45 W-C)
//   - RaycastJumpHint(R69 W-F · in GlobalShortcuts.tsx)
//   - LedgerDeltaChip(R49 W-A · zone27_last_ledger_n_v1)
//   - TeamPickPanel(R13 · z27_team via lib/teams.ts)
//   - MemberDashboardPreview(R29 · zone27_engine_voting_v1)
//   - PreviewModeBanner(R30 · zone27_preview_tier)
//   - LoginForm(R30 W-5 · zone27_last_login_email)
//   - LineKeepHint(R77 W-B · uses sessionStorage variant)
//
// Each component currently has ~30-50 lines of SSR-safe boilerplate:
//   - typeof window !== "undefined" guard
//   - try/catch for localStorage quota / disabled
//   - JSON.parse with fallback on corruption
//   - useState + useEffect dual-state(SSR initial + post-hydration value)
//
// This hook centralizes the pattern into a single canonical implementation
// · React 19 idiom · 0 new dep · 0 PII transit · pure derivation。
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · code-quality refactor 物理
//     codify · single-source pattern matches canonical 7-ledger family
//     (ENGINE_OPS_LOG · ENGINE_DIFF_BEACONS · NO_PUSH_INVENTORY · etc)
//   - per /audit S06 LOCAL STORAGE TRANSPARENCY · 11-key inventory still
//     binding · this hook 不增加 keys · 只是 centralize 寫入 pattern
//   - per [[zone27-payment-architecture]] · 0 server transit · 0 PII · client
//     state isolation · same axis as existing localStorage usage
//
// 不做 anti-pattern:
//   ✕ NO automatic versioning / migration logic(brand IP「不藏 schema
//     evolution」 · let component owners handle their own schema)
//   ✕ NO cross-tab sync(per /privacy「視覺 your device only」 axis ·
//     不 trigger storage events · 不 broadcast cross-tabs)
//   ✕ NO TTL / expiry logic(per /audit S06 「我們不會 tracking pixel
//     restore」 · localStorage 是 visitor 自己控制 · 不 enforce expiry)
//   ✕ NO encryption(per /privacy 0-server-transit promise · visitor's
//     own device · 不需 encryption · attack vector is DevTools-level)
//
// Usage example(post-hook · per R78 W-E refactor pattern):
//   const [picks, setPicks, clearPicks] = useLocalStorage<AnonPick[]>(
//     "zone27_anon_picks_v1",
//     [],
//   );
//
// Existing components remain working unchanged · this hook is OPT-IN for
// future component migrations · per R57+ 不過度 spawn discipline · 不 force
// big-bang refactor。
// ─────────────────────────────────────────────────────

type UseLocalStorageOptions<T> = {
  /** Custom serializer · defaults to JSON.stringify · use for non-JSON
   *  values e.g. plain strings(skip JSON quoting overhead)。 */
  serialize?: (value: T) => string;
  /** Custom deserializer · defaults to JSON.parse · use for plain strings
   *  or schema validation · throw to trigger defaultValue fallback。 */
  deserialize?: (raw: string) => T;
  /** sessionStorage instead of localStorage · per R77 W-B LineKeepHint
   *  pattern · session-only dismiss · 不增加 12th localStorage key 違反
   *  R70 W-B 11-key cap discipline。 */
  storage?: "local" | "session";
};

/** Canonical SSR-safe localStorage React hook · returns [value, setter,
 *  clear] tuple · same shape as useState + remove function · React 19
 *  idiom · 0 new dependency · 0 PII transit · pure derivation。
 *
 *  - SSR-safe(returns defaultValue during server render · hydrates after
 *    mount via useEffect · same axis as R68 W-D CadencePulseChip SSG-stale-
 *    date fix pattern)
 *  - try/catch for quota / disabled / parse errors · silently fallback
 *    to defaultValue · per /privacy 0-PII discipline · 不 expose errors
 *  - Setter accepts value OR updater function(useState API parity)
 *  - Clear removes the storage entry without triggering re-render
 *
 *  Brand IP「不藏 broken state」 axiom per [[zone27-disclosure-philosophy]]
 *  · errors silently logged to console.error · NOT visible to visitor ·
 *  same axis as R73 W-A ClientErrorBoundary fallback pattern。
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {},
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    storage = "local",
  } = options;

  // SSR-safe initial state · returns defaultValue during server render
  // · useEffect re-hydrates from localStorage after mount。 Per R68 W-D
  // CadencePulseChip pattern · prevent SSG-stale-state where
  // server-render value diverges from client-render value。
  const [value, setValue] = useState<T>(defaultValue);

  // Hydrate from storage on mount · runs once · subsequent updates flow
  // through setter wrapped below。 Try/catch silently falls back to
  // defaultValue · per /audit S05 「不藏 broken state but 不 panic」 axis。
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const store =
        storage === "session" ? window.sessionStorage : window.localStorage;
      const raw = store.getItem(key);
      if (raw === null) return;
      const parsed = deserialize(raw);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(parsed);
    } catch (err) {
      // Storage disabled / quota exceeded / parse error · silently fall
      // back to defaultValue · per /privacy 0-server-transit + ClientError
      // Boundary R73 W-A 「console.error server-side log NOT visitor-facing」
      // axiom。
      console.error(
        `[ZONE27 · useLocalStorage] read failed for key=${key} storage=${storage}`,
        err,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Setter wraps useState + writes to storage · accepts value or updater
  // function(useState API parity)· silently catches storage write errors
  // · per Aronson Pratfall「不藏 broken state but 不 panic」 axis。
  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        if (typeof window !== "undefined") {
          try {
            const store =
              storage === "session"
                ? window.sessionStorage
                : window.localStorage;
            store.setItem(key, serialize(resolved));
          } catch (err) {
            // Quota exceeded / disabled · per /audit S06「我們不會在您
            // clear 後試圖重新寫入」 axiom · respect failure · log only。
            console.error(
              `[ZONE27 · useLocalStorage] write failed for key=${key} storage=${storage}`,
              err,
            );
          }
        }
        return resolved;
      });
    },
    [key, serialize, storage],
  );

  // Clear removes the storage entry · same axis as R45 W-B AnonPickWidget
  // clearAll() pattern · 0 side effect beyond storage removal · resets
  // state to defaultValue · per /audit S06「清除 localStorage 完全是您
  // 的選擇」 visitor-control axiom。
  const clearStoredValue = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const store =
          storage === "session" ? window.sessionStorage : window.localStorage;
        store.removeItem(key);
      } catch (err) {
        console.error(
          `[ZONE27 · useLocalStorage] clear failed for key=${key} storage=${storage}`,
          err,
        );
      }
    }
    setValue(defaultValue);
  }, [key, storage, defaultValue]);

  return [value, setStoredValue, clearStoredValue];
}
