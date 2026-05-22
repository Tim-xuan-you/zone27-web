"use client";

import { useEffect, useState } from "react";

// ── ZONE 27 · Ledger Delta Chip ─────────────────────────
// Round 49 W-A · Agent L R44 GAP-2 ship · per [[feedback-no-waiting-rule]]。
//
// 「X new entries since 2026-05-15」 client-side return engagement chip ·
// localStorage zone27_last_ledger_n_v1 · 0 server · 0 cookies · 0 PII。
//
// Psychology hooks(per Tim「人的心理學很重要!!!」 directive R49):
//   - Endowment Effect · visitor sees own累積 check-ins(brand IP「您 own
//     track record」 framing extended to passive return)
//   - Sunk Cost · returning increments personal counter · 不打擾就是禮物
//     axiom 仍 maintained(0 push · 0 email · 純 client-side recall)
//   - Differential framing · 比起「N=X total」 cold number · 「+3 since
//     last visit」 highlights motion 訪客 own 個人 progression
//
// 設計同 RecentMatchesRow R40 W-G + AnonCalibrationStrip R45 W-C pattern:
//   - SSR-safe discriminated union mount(per R40 W-G)
//   - Conditional render · 不在 first visit 顯示(無 last-seen baseline 等於
//     compare nothing · 無 brand value · 直接 skip)
//   - Update localStorage on render · 「next visit」 baseline established
//
// Brand IP:
//   - per [[zone27-disclosure-philosophy]] · storage key 公開 in /audit S06
//   - per FUNDED BY FOUNDERS · NO TRACKERS axiom · 0 server-side
//   - per /audit S05 PRE-COMMIT · same discipline · LedgerDeltaChip 寫法
//     若改需 30-day notice
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 「+3 since」
//     fan-grammar value not engineering-grammar
// ─────────────────────────────────────────────────────

const STORAGE_KEY = "zone27_last_ledger_n_v1";

type StoredState = {
  lastSeenN: number;
  lastSeenAt: string; // ISO YYYY-MM-DD
};

function readStored(): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed?.lastSeenN === "number" &&
      typeof parsed?.lastSeenAt === "string"
    ) {
      return parsed as StoredState;
    }
    return null;
  } catch {
    return null;
  }
}

function writeStored(n: number): void {
  if (typeof window === "undefined") return;
  try {
    const todayISO = new Date().toISOString().slice(0, 10);
    const next: StoredState = { lastSeenN: n, lastSeenAt: todayISO };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* swallow · localStorage quota or disabled */
  }
}

type Props = {
  /** Current finalized ledger count · passed from server-rendered parent */
  currentN: number;
};

type MountState =
  | { mounted: false }
  | { mounted: true; stored: StoredState | null };

export default function LedgerDeltaChip({ currentN }: Props) {
  const [state, setState] = useState<MountState>({ mounted: false });

  useEffect(() => {
    const stored = readStored();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ mounted: true, stored });
    // Always update storage to current N on visit · brand IP 不藏 · 訪客
    // 下次回來看到的 baseline 是這次 visit 的 N
    writeStored(currentN);
  }, [currentN]);

  // SSR-safe: render nothing during SSR
  if (!state.mounted) return null;

  // First-time visitor · no baseline to compare · 不假裝 delta · 0 noise
  if (!state.stored) return null;

  const delta = currentN - state.stored.lastSeenN;

  // No change · 不 surface(per brand IP「不打擾就是禮物」 axiom · 沒新
  // 資訊不必 alert)
  if (delta === 0) return null;

  // Negative delta · 不應該發生(ledger 只增不減)· 防禦性 hide
  if (delta < 0) return null;

  return (
    <div
      className="inline-flex items-baseline gap-2 px-3 py-1.5 border border-gold/40 bg-gold/5 font-mono text-[10px] tracking-[0.22em] text-bone"
      title={`Ledger delta · last seen N=${state.stored.lastSeenN} on ${state.stored.lastSeenAt} · now N=${currentN}`}
      role="status"
      // Round 52 W-A · Agent 2 #7 fix · WCAG 2.1 Level A 警告 title attr
      // 對 screen reader 不可靠(browser may not expose)· 加 aria-label
      // 明確 announce delta + baseline date · accessible 物理 codify。
      aria-label={`Ledger 新增 ${delta} 場 · 自您上次造訪 ${state.stored.lastSeenAt} · 目前 N=${currentN}`}
    >
      <span
        lang="en"
        className="text-gold/90 text-[9px] tracking-[0.3em]"
      >
        + DELTA
      </span>
      <strong className="font-mono text-gold tabular">
        +{delta}
      </strong>
      <span className="text-mute/80 text-[10px] tracking-[0.2em]">
        since {state.stored.lastSeenAt}
      </span>
    </div>
  );
}
