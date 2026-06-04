"use client";

// ── ZONE 27 · Tonight Match Rail ────────────────────────
// R70 W-D · Agent A R70 SHIP 1 · mobile-first persistent match-switcher
// above StickyFoundersCTA · MLB At Bat scoreboard ribbon + Bloomberg
// watchlist rail + The Athletic trending stories horizontal scroll
// pattern。 Brand-pure variant strips live-score(we don't have live
// data)and shows pre-locked engine % instead。
//
// Why this ship · CPBL 80% of nights have 3 games · currently mobile
// visitors who land on game 1 via WhatsApp share have a 4-tap path to
// game 2(back → /matches → tap → scroll)· with rail it's 1 tap ·
// each lateral hop multiplies AnonPickWidget + LensFocusVote
// commitment-ladder by N matches per night。
//
// Layout:
//   - mobile only(sm:hidden); desktop preserves sidebar nav
//   - sits ABOVE StickyFoundersCTA via bottom: calc(safe-area + 76px) offset
//     · NOT via z-index(z-29 < z-30 would actually layer BELOW)· physical
//     y-position is what positions it above the sticky CTA bar(R108 W3 fix)
//   - both share env(safe-area-inset-bottom)
//   - 40px tall · 1 row · horizontal scroll-snap pill grid
//
// Pill content per match:
//   隊 vs 對手 · 18:35 · 62%/38% (current = gold bg · others = mute bg)
//   current match highlighted gold + scaled · tap = jump to /matches/{id}
//
// brand IP fit:
//   - 0 live data · 0 score(per Costly Signaling pre-lock axiom)
//   - 0 「X 人在看」 presence indicator(per Agent A R70 ANTI-1)
//   - 0 push permission ask · pure passive ribbon
//   - per [[feedback-zone27-audience-fans-not-engineers]] · fan-grammar
//     CPBL chinese team names · pre-locked engine % (not live odds)
//   - per StickyFoundersCTA path-aware pattern · usePathname hide on
//     /founders · /lab/custom · 同 spirit
//
// 不做 anti-pattern:
//   ✕ no live score ticker(brand-redline · we pre-lock predictions)
//   ✕ no presence count「N 人在看這場」(11-item NOT-DO #5 redline)
//   ✕ no push permission ask
//   ✕ no auto-scroll / auto-rotation(distracting · per 不打擾 axiom)
//   ✕ no swipe-to-dismiss(persistent muscle-memory · same as Bloomberg)
//
// SSR + hydration:
//   - server-rendered class hidden by default(client toggle visibility)
//   - SSR-safe discriminated union mount per AnonPick R40 W-G pattern
//   - <= 1 today match · component returns null(empty UI)
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export type TonightMatchPillData = {
  /** Match ID · same as URL slug · used in href */
  id: string;
  /** Home team display name(中文)*/
  homeName: string;
  /** Away team display name(中文)*/
  awayName: string;
  /** Pre-locked engine home win % */
  homeWinRate: number;
  /** Pre-locked engine away win % */
  awayWinRate: number;
  /** Start time string · already formatted(e.g. "18:35")*/
  startTime: string;
};

type Props = {
  /** Tonight's matches · pre-fetched server-side and passed in */
  matches: TonightMatchPillData[];
  /** Currently-viewed match ID · highlighted in rail · null = no highlight */
  currentMatchId: string | null;
};

export default function TonightMatchRail({
  matches,
  currentMatchId,
}: Props) {
  const pathname = usePathname();
  // R195 · 登入感知 · 修行動版碰撞(轉換 agent #3):rail 原本固定 +76px 坐在
  // StickyFoundersCTA 之上,但 CTA 對登入會員 return null → 會員看到 rail 懸空 76px、
  // 下面一片空。 會員時 offset 歸 0(貼底)· 訪客時維持 +76px(讓出 CTA 空間)。
  // "checking"(初始 false→effect 後才更新)當訪客處理 · 避免蓋到 CTA。
  const [isMember, setIsMember] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled) setIsMember(!!data.session);
      } catch {
        /* guest fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Same hide rules as StickyFoundersCTA · don't compete with form/conversion pages
  if (pathname === "/founders" || pathname === "/lab/custom") return null;
  // Don't render with <= 1 match · single-game days don't need rail
  if (matches.length < 2) return null;

  return (
    <div
      role="region"
      aria-label="Tonight's matches · 1-tap mobile switcher"
      data-print-hide="true"
      className="fixed inset-x-0 z-29 sm:hidden border-t border-line/60 bg-ink/90 backdrop-blur-md"
      style={{
        // R71 W-E · Agent B audit F2 fix · --sticky-cta-h CSS var was
        // never declared anywhere · fallback 56px < actual CTA height
        // ~76px → visible overlap on mobile. Hard-code measured value ·
        // StickyFoundersCTA at py-3 sm:py-4 + 1px border + content =
        // ~76px on iPhone SE base · matches actual paint on all CPBL
        // 3-game nights · no more z-29-vs-z-30 visual collision。
        bottom: isMember
          ? "env(safe-area-inset-bottom, 0px)"
          : "calc(env(safe-area-inset-bottom, 0px) + 76px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <ul
        /* R159 W2.J3 · Agent J · overscroll-x-contain prevents iOS swipe-back
           gesture trigger when last pill scrolled past · per MDN overscroll-
           behavior canonical pattern · pairs with existing snap-x snap-mandatory。 */
        className="flex gap-2 overflow-x-auto overscroll-x-contain px-3 py-2 snap-x snap-mandatory"
        aria-label="Tonight match pills · horizontal scroll · 1-tap jump"
      >
        {matches.map((m) => {
          const isCurrent = m.id === currentMatchId;
          return (
            <li key={m.id} className="snap-start shrink-0">
              <Link
                href={`/matches/${m.id}`}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`${m.homeName} vs ${m.awayName} · ${m.startTime} · engine ${m.homeWinRate}% / ${m.awayWinRate}%`}
                className={`block min-h-[44px] px-3 py-1.5 border transition-colors ${
                  isCurrent
                    ? "border-gold bg-gold/15 text-gold"
                    : "border-line/60 bg-slate/40 text-mute hover:border-gold/60 hover:text-gold/85"
                }`}
              >
                <span className="block font-mono text-[10px] tabular tracking-[0.15em] leading-tight">
                  {m.homeName}{" "}
                  <span className="text-mute/60 mx-1">vs</span>{" "}
                  {m.awayName}
                </span>
                <span
                  lang="en"
                  className="block font-mono text-[9px] tabular tracking-[0.2em] mt-0.5 opacity-85"
                >
                  {m.startTime} · {m.homeWinRate}/{m.awayWinRate}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
