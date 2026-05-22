"use client";

// ── ZONE 27 · Recent Matches Row ────────────────────────
// Round 40 W-G · Agent F #5 ship · client component · reads localStorage
// recent-matches list · renders inline row only if has entries · 0 SSR
// (per SSR-safe + hydration-safe mount flag pattern)· 0 cookies ·
// 0 tracking · 純 visitor 自己的 device。
//
// 渲染 placement:homepage 第 2 viewport(per Agent F)· conditional ·
// 無 entries = 不 render(progressive enhancement)。 brand IP「homepage =
// ONE thing」 守護 — 只在訪客已 build local memory 後才 surface。
//
// 不在 SSR pre-render · 完全 client-side hydration · 避免 SSR/CSR mismatch
// + 同 sim-history client mount flag pattern。
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  readRecentMatches,
  formatRelativeTime,
  type RecentMatch,
} from "@/lib/recent-matches";

type MountState =
  | { mounted: false }
  | { mounted: true; matches: RecentMatch[] };

export default function RecentMatchesRow() {
  // SSR-safe single-setState mount flag · combines mounted+matches into
  // discriminated union · avoids react-hooks/set-state-in-effect 2x flag。
  const [state, setState] = useState<MountState>({ mounted: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ mounted: true, matches: readRecentMatches() });
  }, []);

  // SSR-safe: render nothing during SSR / first paint
  if (!state.mounted) return null;
  const { matches } = state;

  // Conditional: render nothing if no entries · progressive enhancement
  if (matches.length === 0) return null;

  return (
    <section
      className="mx-auto max-w-3xl px-6 sm:px-10 pb-10 sm:pb-12"
      aria-label="您最近看過的賽事"
    >
      <div className="border border-line/60 bg-slate/30 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <p
            lang="en"
            className="font-mono text-gold/90 text-[10px] tracking-[0.35em]"
          >
            / RECENTLY VIEWED · {matches.length} 場
          </p>
          <span
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            LOCAL ONLY · 0 SERVER STATE
          </span>
        </div>
        <ul className="space-y-2">
          {matches.slice(0, 5).map((m) => (
            <li key={m.gameId}>
              <Link
                href={`/matches/${m.gameId}`}
                className="grid grid-cols-[1fr_auto] items-baseline gap-3 py-1.5 hover:bg-slate/30 -mx-2 px-2 transition-colors group"
              >
                <span className="text-bone text-sm group-hover:text-gold transition-colors truncate">
                  {m.title}
                </span>
                <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em] whitespace-nowrap">
                  {formatRelativeTime(m.viewedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-mute/60 text-[9px] tracking-[0.22em] leading-relaxed">
          ⚓ 此清單在您裝置 localStorage · 我們的 server 看不到 · 您可清除 /audit
          見 storage key 公開。
        </p>
      </div>
    </section>
  );
}
