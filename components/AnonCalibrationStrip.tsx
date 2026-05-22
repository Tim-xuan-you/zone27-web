"use client";

// ── ZONE 27 · Anonymous Calibration Strip ───────────────
// Round 45 W-C · Agent L DEEPEST sharp call · client component for
// rendering visitor's own anon-picks track record vs engine。
//
// Mounted on /calibration after Brier section + homepage(below F6 strip
// when has picks)· conditional render only when localStorage has picks ·
// per progressive enhancement axiom 同 RecentMatchesRow pattern from R40。
//
// brand IP 物理 codify:
//   - 0 PII / 0 server / 0 cookies / 純 localStorage
//   - per [[zone27-disclosure-philosophy]] · 此 strip 只 client-render ·
//     server 不知道 visitor pick 內容 · 看不到 individual delta
//   - per Pratfall · 同 N=0 empty state pattern from /calibration page ·
//     此 strip 只在 N≥1 後 surface · 不 render empty fake numbers
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 「您 N picks ·
//     ✓Y PROVED · ✕Z DIVERGED」 fan-grammar value
//
// Variant prop:
//   - "calibration" · 大 stack version on /calibration page · 3-col stat
//   - "homepage" · compact inline version 在 F6 strip 下方 · 1-line summary
//
// SSR-safe(typeof window guard)+ hydration-safe(discriminated union mount)
// 同 R43 W-B RecentMatchesRow pattern。
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  readAnonPicks,
  computeAnonStats,
  type AnonPick,
} from "@/lib/anon-picks";

type Variant = "calibration" | "homepage";

type Props = {
  variant: Variant;
};

type MountState =
  | { mounted: false }
  | { mounted: true; picks: AnonPick[] };

export default function AnonCalibrationStrip({ variant }: Props) {
  const [state, setState] = useState<MountState>({ mounted: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ mounted: true, picks: readAnonPicks() });
  }, []);

  // SSR-safe: render nothing during SSR
  if (!state.mounted) return null;
  const { picks } = state;

  // Conditional: render nothing if 0 picks · progressive enhancement
  if (picks.length === 0) return null;

  const stats = computeAnonStats(picks);

  // ── HOMEPAGE COMPACT VARIANT ──────────────────────────
  if (variant === "homepage") {
    return (
      <section
        className="mx-auto max-w-3xl px-6 sm:px-10 pb-10"
        aria-label="您的個人 calibration strip"
      >
        <Link
          href="/calibration"
          className="block border border-gold/40 bg-slate/30 p-4 sm:p-5 hover:bg-slate/40 hover:border-gold/60 transition-colors group"
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <p
              lang="en"
              className="font-mono text-gold/90 text-[10px] tracking-[0.3em]"
            >
              ⚡ EPISTEMIC GYM · 您的 track record
            </p>
            <span
              lang="en"
              className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
            >
              LOCAL ONLY · 0 SERVER
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-4 flex-wrap text-sm">
            <span className="text-bone">
              <strong className="font-mono text-gold tabular text-lg">
                {stats.total}
              </strong>{" "}
              picks
            </span>
            {stats.proved + stats.diverged > 0 && (
              <>
                <span aria-hidden="true" className="text-mute/40">·</span>
                <span className="text-mute">
                  <span className="font-mono text-gold tabular">
                    ✓{stats.proved}
                  </span>{" "}
                  <span className="font-mono text-loss/85 tabular">
                    ✕{stats.diverged}
                  </span>
                </span>
                <span aria-hidden="true" className="text-mute/40">·</span>
                <span className="text-mute">
                  您 acc{" "}
                  <strong className="font-mono text-bone tabular">
                    {stats.yourAccuracyLabel}
                  </strong>
                </span>
                <span aria-hidden="true" className="text-mute/40">·</span>
                <span className="text-mute">
                  engine acc{" "}
                  <strong className="font-mono text-bone tabular">
                    {stats.engineAccuracyLabel}
                  </strong>
                </span>
                {stats.proved + stats.diverged >= 3 && (
                  <>
                    <span aria-hidden="true" className="text-mute/40">·</span>
                    <span
                      className={
                        stats.delta > 0
                          ? "text-gold"
                          : stats.delta < 0
                          ? "text-loss/85"
                          : "text-mute"
                      }
                    >
                      Δ{" "}
                      <strong className="font-mono tabular">
                        {stats.delta > 0 ? "+" : ""}
                        {Math.round(stats.delta)}pp
                      </strong>{" "}
                      vs engine
                    </span>
                  </>
                )}
              </>
            )}
          </div>
          <p className="mt-2 font-mono text-mute/70 text-[9px] tracking-[0.25em]">
            完整 strip 在 /calibration · 您 own data 永遠在您裝置 →
          </p>
        </Link>
      </section>
    );
  }

  // ── CALIBRATION FULL STACK VARIANT ────────────────────
  return (
    <section
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12"
      aria-label="您的個人 vs engine calibration"
    >
      <p
        lang="en"
        className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
      >
        / EPISTEMIC GYM · 您 vs ENGINE · 個人 strip
      </p>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3 leading-tight">
        您的 picks · 永遠在您裝置 · <span className="text-gold">ZONE 27 看不到</span>
      </h2>
      <p className="text-mute leading-relaxed mb-6">
        此 strip 只在您裝置 client-render · 您的 individual picks 從未 sent
        to ZONE 27 server · 此頁的 global Brier(上方)跟此 strip(您
        personal)兩個 layer independently · 不交叉。
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatBox
          label="TOTAL PICKS"
          value={String(stats.total)}
          sub={`${stats.pending} pending`}
          tone="bone"
        />
        <StatBox
          label="您 ACCURACY"
          value={stats.yourAccuracyLabel}
          sub={
            stats.proved + stats.diverged > 0
              ? `✓${stats.proved} ✕${stats.diverged}`
              : "N=0 finalized"
          }
          tone={stats.proved > stats.diverged ? "gold" : "bone"}
        />
        <StatBox
          label="ENGINE ACCURACY"
          value={stats.engineAccuracyLabel}
          sub="same finalized picks"
          tone="mute"
        />
        <StatBox
          label="Δ vs ENGINE"
          value={
            stats.proved + stats.diverged >= 3
              ? `${stats.delta > 0 ? "+" : ""}${Math.round(stats.delta)}pp`
              : "wait N≥3"
          }
          sub={
            stats.proved + stats.diverged >= 3
              ? stats.delta > 0
                ? "您 ahead"
                : stats.delta < 0
                ? "engine ahead"
                : "tied"
              : "more picks needed"
          }
          tone={
            stats.proved + stats.diverged >= 3
              ? stats.delta > 0
                ? "gold"
                : stats.delta < 0
                ? "loss"
                : "bone"
              : "mute"
          }
        />
      </div>

      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed mb-3">
        ⚓ N≥30 個 finalized picks 後 此 strip 才 statistically meaningful ·
        per /track-record SAMPLE DEBT axiom · 目前{" "}
        <strong className="text-bone">
          {stats.proved + stats.diverged}
        </strong>{" "}
        finalized · 還需{" "}
        <strong className="text-bone">
          {Math.max(0, 30 - (stats.proved + stats.diverged))}
        </strong>{" "}
        場 hit threshold。
      </p>

      <p className="text-mute/85 text-sm leading-relaxed">
        想累積此 strip · 在{" "}
        <Link
          href="/matches"
          className="text-gold underline-offset-4 hover:underline"
        >
          /matches
        </Link>{" "}
        每場 picks before peeking engine · 您 own private track record vs
        engine · 不需 auth · 不傳 server · 不 broadcast。 純 「epistemic
        gym」 練習 · brand IP「不打擾就是禮物」 axiom 守。
      </p>
    </section>
  );
}

// ── Sub-components ─────────────────────────────────────

function StatBox({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "gold" | "bone" | "mute" | "loss";
}) {
  const valueColor = {
    gold: "text-gold",
    bone: "text-bone",
    mute: "text-mute",
    loss: "text-loss/85",
  }[tone];

  const borderColor = {
    gold: "border-gold/40 bg-slate/40",
    bone: "border-line/60 bg-slate/30",
    mute: "border-line/40 bg-slate/20",
    loss: "border-loss/30 bg-loss/5",
  }[tone];

  return (
    <div className={`border ${borderColor} p-3`}>
      <p
        lang="en"
        className="font-mono text-mute/70 text-[9px] tracking-[0.25em] mb-1"
      >
        {label}
      </p>
      <p
        className={`font-mono tabular text-2xl sm:text-3xl tracking-tight ${valueColor}`}
      >
        {value}
      </p>
      <p
        lang="en"
        className="font-mono text-mute/70 text-[9px] tracking-[0.22em] mt-1"
      >
        {sub}
      </p>
    </div>
  );
}
