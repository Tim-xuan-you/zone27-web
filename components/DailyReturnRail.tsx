"use client";

// ── ZONE 27 · Daily Return Rail ─────────────────────────
// R70 W-B · Agent A R69 SHIP 2 deferred · Letterboxd diary entry pattern +
// Are.na slow-web + Pinboard.in「your last login: X days ago」 honest chip。
// Returning daily visitors want low-stimulation acknowledgment that
// something moved · NOT a「welcome back!」 confetti · NOT streak counter ·
// NOT daily-login farming(11-item NOT-DO redline #2)。
//
// localStorage zone27_last_visit_v1(11th key)· /audit S06 disclose ·
// SSR-safe discriminated union mount per AnonPick R40 W-G + R43 W-B
// pattern · 不 push · 不 nag · honest「上次您來 X 天前」 1-sentence chip。
//
// Conditional render:
//   - first-time visitor(lastVisitDate === null)· renders NOTHING(empty)
//   - same-day return(lastVisitDate === today)· renders NOTHING
//   - returning visitor(N >= 1 day)· renders chip
//
// brand IP 全 ✓:
//   - per [[feedback-zone27-pratfall-brand-ip]] · honest reframe per
//     /now「無 weekly schedule promise」 axiom · 「上次 X 天前」 是 past
//     tense fact · NOT「next update Thursday」 cadence promise
//   - per 「不打擾就是禮物」 axiom · 1 sentence · dismiss with × · no nag
//   - per Are.na slow-web · 0 streak count accumulating · 不 fire on
//     first visit · 不 surface 連勝 X 天 dopamine
//   - per [[zone27-disclosure-philosophy]] · localStorage key 公開 /audit
//     S06 · 訪客可 verify devtools application tab
//   - per 11-item NOT-DO list #2 daily-login farming redline · 此 chip
//     不 reward · 不 unlock · 不 badge · 純 honest past-tense check-in
//
// 不做 anti-pattern:
//   ✕ NO「You're on a X-day streak!」 streak count
//   ✕ NO「Visit again tomorrow to earn...」 push CTA
//   ✕ NO sticky banner · only inline 1-row chip · dismiss anytime
//   ✕ NO push notification permission ask
//   ✕ NO sound · NO animation · NO toast
//
// Set 機制:
//   - On mount(after first paint)· read existing zone27_last_visit_v1
//   - If null OR same-day · setHasReturned(false)· no UI
//   - If >=1 day · setHasReturned(true)· display chip · update key to today
//   - Update happens IMMEDIATELY on display · 不 wait dismiss · ONE-shot per day
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import { LAST_SHIPPED_DATE_ISO } from "@/lib/last-shipped";

const STORAGE_KEY = "zone27_last_visit_v1";

type RailState =
  | { mounted: false }
  | { mounted: true; daysSince: number | null; dismissed: boolean };

/** Get today's date string in YYYY-MM-DD format · TPE-anchored to match
 *  brand-wide Asia/Taipei convention(per CadencePulseChip + Footer). */
function getTodayIso(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

/** Compute integer days between two YYYY-MM-DD strings · null if invalid */
function daysBetween(earlier: string, later: string): number | null {
  const eDate = new Date(`${earlier}T00:00:00+08:00`);
  const lDate = new Date(`${later}T00:00:00+08:00`);
  if (Number.isNaN(eDate.getTime()) || Number.isNaN(lDate.getTime())) {
    return null;
  }
  const ms = lDate.getTime() - eDate.getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function formatDaysAgo(n: number): string {
  if (n === 1) return "1 天前";
  if (n < 7) return `${n} 天前`;
  if (n < 14) return "1 週前";
  if (n < 30) return `${Math.floor(n / 7)} 週前`;
  if (n < 60) return "1 個月前";
  return `${Math.floor(n / 30)} 個月前`;
}

export default function DailyReturnRail() {
  const [state, setState] = useState<RailState>({ mounted: false });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const today = getTodayIso();
    let priorVisit: string | null = null;
    try {
      priorVisit = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // localStorage disabled · silently no-op · 不 push
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ mounted: true, daysSince: null, dismissed: false });
      return;
    }

    // First-time visitor: silently store today's date · render nothing
    if (!priorVisit) {
      try {
        window.localStorage.setItem(STORAGE_KEY, today);
      } catch {
        /* swallow · key set 不 critical */
      }
      setState({ mounted: true, daysSince: null, dismissed: false });
      return;
    }

    // Same-day return: 不 update · 不 render
    if (priorVisit === today) {
      setState({ mounted: true, daysSince: null, dismissed: false });
      return;
    }

    // Returning visitor 1+ days · render + update key
    const days = daysBetween(priorVisit, today);
    try {
      window.localStorage.setItem(STORAGE_KEY, today);
    } catch {
      /* swallow */
    }
    setState({ mounted: true, daysSince: days, dismissed: false });
  }, []);

  // SSR + first-time + same-day · render nothing
  if (!state.mounted) return null;
  if (state.daysSince === null) return null;
  if (state.dismissed) return null;

  const handleDismiss = () => {
    setState({ ...state, dismissed: true });
  };

  return (
    <section
      aria-label="Daily return rail · honest past-tense check-in"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-3"
    >
      <div className="border border-line/40 bg-slate/20 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 flex-wrap">
        <p className="font-mono text-mute/85 text-[11px] tracking-[0.22em] leading-relaxed tabular flex-1">
          <span aria-hidden="true" className="text-gold/70 mr-2">
            ✦
          </span>
          上次您來是{" "}
          <strong className="text-bone tabular">
            {formatDaysAgo(state.daysSince)}
          </strong>{" "}
          · 期間我們 ship 的更新{" "}
          <Link
            href="/changelog"
            className="text-gold/85 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            /changelog
          </Link>{" "}
          · 最近 ship · <span className="text-bone">{LAST_SHIPPED_DATE_ISO}</span>
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss daily return chip"
          className="font-mono text-mute/60 hover:text-gold text-[12px] tracking-[0.2em] tabular shrink-0 transition-colors"
        >
          ×
        </button>
      </div>
      <p className="font-mono text-mute/60 text-[9px] tracking-[0.22em] leading-relaxed mt-1.5 px-1">
        ⚓ 不是 streak counter · 不是 daily-login farming · 純 past-tense
        honest check-in · localStorage zone27_last_visit_v1 11th key · per
        /audit S06 + 不打擾就是禮物 axiom
      </p>
    </section>
  );
}
