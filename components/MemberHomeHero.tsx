import Link from "next/link";
import { LAST_SHIPPED_DATE_ISO } from "@/lib/last-shipped";
import type { Match } from "@/lib/matches";
import { getCalibration, getEnginePctOnWinner } from "@/lib/matches";
import type { UserPredictionsMap } from "@/lib/predictions";
import { computeUserVerdict } from "@/lib/predictions";

// ── ZONE 27 · Member Home Hero ──────────────────────────
// R70 W-A · Agent A R69 SHIP 1 deferred · ★★★★★ HIGHEST priority ·
// Bloomberg 3-quadrant /member dashboard drop-in · post-login premium
// feel · vs FREE TIER preview-card style · 「you are home」 = density +
// recency + zero greeting noise。
//
// 3 quadrants(mobile stacks vertically · desktop 3-col):
//   01 · YOUR LAST PICK    · pulls latest entry from UserPredictionsMap ·
//        shows match name + your pick + verdict status(PENDING / PROVED /
//        DIVERGED)· click → /matches/[gameId]
//   02 · ENGINE STATE      · single LIVE chip showing ENGINE v0.2 ·
//        LAST SHIPPED date · LAST RECEIPT N=X · click → /methodology/diff
//   03 · RECENT RECEIPTS   · last 3 finalized matches as compact rows ·
//        click → /matches/[gameId]
//
// typography density: Geist Mono · tracking-[0.3em] · text-[10px] section
// headers · Bloomberg amber-equivalent = 冷金 #D4AF37(per /globals.css)。
//
// 不做 anti-pattern(per Agent A R69 redline check + 11-item NOT-DO list):
//   ✕ NO welcome animation · NO「Welcome back, Tim!」 greeting header
//     (that's the FREE TIER preview move · this is PREMIUM signal)
//   ✕ NO daysSinceJoin confetti(streak farming redline)
//   ✕ NO「Top member picks」 leaderboard(manufactured social proof
//     redline · per R69 Agent A ANTI-3)
//   ✕ NO「Your weekly digest」 push CTA(notification creep redline)
//
// Server component(props pre-computed)· renders ONLY when session exists ·
// MemberPage already auth-gates · 此 component 假設 logged-in caller。
// ─────────────────────────────────────────────────────

type Props = {
  /** Logged-in user's predictions(may be empty)*/
  predictions: UserPredictionsMap;
  /** All matches with finalResult populated · used to compute last-pick verdict + recent receipts */
  allMatches: Match[];
  /** Engine version string · per EngineStamp lib · default v0.2 */
  engineVersion?: string;
};

export default function MemberHomeHero({
  predictions,
  allMatches,
  engineVersion = "v0.2",
}: Props) {
  // ── Quadrant 01 · YOUR LAST PICK ──────────────────────
  // Find most-recent prediction(by ts)· enrich with match data + verdict
  const lastPredictionEntries = Object.entries(predictions);
  let lastPick: {
    matchId: string;
    pick: "home" | "away" | "skip";
    match: Match | null;
    verdict: ReturnType<typeof computeUserVerdict>;
  } | null = null;

  if (lastPredictionEntries.length > 0) {
    const sorted = lastPredictionEntries.sort((a, b) =>
      b[1].ts.localeCompare(a[1].ts),
    );
    const [matchId, pred] = sorted[0];
    const m = allMatches.find((mm) => mm.id === matchId) ?? null;
    lastPick = {
      matchId,
      pick: pred.pick,
      match: m,
      verdict: computeUserVerdict(
        pred.pick,
        m?.finalResult?.winner ?? null,
      ),
    };
  }

  // ── Quadrant 02 · ENGINE STATE ───────────────────────
  const finalizedMatches = allMatches.filter((m) => !!m.finalResult);
  const engineN = finalizedMatches.length;

  // ── Quadrant 03 · RECENT RECEIPTS ─────────────────────
  // Last 3 finalized matches sorted by date DESC(newest first)
  const recentReceipts = [...finalizedMatches]
    .sort((a, b) =>
      (b.finalResult?.ingestedAt ?? "").localeCompare(
        a.finalResult?.ingestedAt ?? "",
      ),
    )
    .slice(0, 3);

  return (
    <aside
      aria-label="Member home hero · Bloomberg 3-quadrant dashboard"
      className="border border-line/60 bg-slate/20"
    >
      {/* Top status bar · Bloomberg-style dense info row */}
      <header className="flex items-baseline justify-between gap-3 flex-wrap px-4 sm:px-5 py-2.5 border-b border-line/40 bg-slate/40">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.4em]"
        >
          / MEMBER HOME · 您的 dashboard
        </p>
        <p
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em] tabular"
        >
          BLOOMBERG-DENSITY · NO GREETING · DATA FIRST
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-line/40">
        {/* ── QUADRANT 01 · YOUR LAST PICK ─────────── */}
        <section
          aria-label="Your last pick"
          className="px-4 sm:px-5 py-4 sm:py-5"
        >
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-3"
          >
            / 01 · YOUR LAST PICK
          </p>
          {lastPick && lastPick.match ? (
            <div>
              <p className="text-bone text-sm leading-snug mb-1.5">
                {lastPick.pick === "skip" ? (
                  <span className="text-mute">您 skip 不押</span>
                ) : (
                  <>
                    <span className="text-gold tabular">
                      {lastPick.pick === "home"
                        ? lastPick.match.home.name
                        : lastPick.match.away.name}
                    </span>
                  </>
                )}
              </p>
              <p className="font-mono text-mute/85 text-[10px] tracking-[0.22em] tabular mb-3">
                {lastPick.match.home.name} vs {lastPick.match.away.name}
              </p>
              {/* R71 W-E · Agent B audit F4 fix · skip-pick guard ·
                  visitor 顯示「skip 不押」 在 upper block · 不該 attribute
                  verdict 到 non-pick · per /audit S05 disclosure parity
                  axiom · only show verdict block when visitor actually picked。 */}
              {lastPick.pick === "skip" ? (
                <p
                  lang="en"
                  className="font-mono text-mute/60 text-[10px] tracking-[0.3em]"
                >
                  ◌ NO VERDICT · 您 skip · 引擎 verdict 不 attribute 到 non-pick
                </p>
              ) : lastPick.verdict === null ? (
                <p
                  lang="en"
                  className="font-mono text-mute/70 text-[10px] tracking-[0.3em]"
                >
                  ◌ PENDING · 賽後 update
                </p>
              ) : lastPick.verdict === "proved" ? (
                <p
                  lang="en"
                  className="font-mono text-gold text-[10px] tracking-[0.3em]"
                >
                  ✓ PROVED
                </p>
              ) : lastPick.verdict === "diverged" ? (
                <p
                  lang="en"
                  className="font-mono text-loss/85 text-[10px] tracking-[0.3em]"
                >
                  ✕ DIVERGED
                </p>
              ) : (
                <p
                  lang="en"
                  className="font-mono text-mute text-[10px] tracking-[0.3em]"
                >
                  ▪ PUSH · 平局/無 favorite
                </p>
              )}
              <Link
                href={`/matches/${lastPick.matchId}`}
                className="block mt-3 font-mono text-mute hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
              >
                完整 breakdown →
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-mute text-sm leading-relaxed mb-2">
                您還沒 pick 過任何賽事
              </p>
              <Link
                href="/matches"
                className="block font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
              >
                看今日 CPBL → 第一個 pick
              </Link>
            </div>
          )}
        </section>

        {/* ── QUADRANT 02 · ENGINE STATE ───────────── */}
        <section
          aria-label="Engine state"
          className="px-4 sm:px-5 py-4 sm:py-5"
        >
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-3"
          >
            / 02 · ENGINE STATE
          </p>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <p
                lang="en"
                className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
              >
                VERSION
              </p>
              <p
                lang="en"
                className="font-mono text-bone text-sm tabular tracking-tight"
              >
                {engineVersion}
              </p>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p
                lang="en"
                className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
              >
                LAST SHIPPED
              </p>
              <p
                lang="en"
                className="font-mono text-bone text-xs tabular"
              >
                {LAST_SHIPPED_DATE_ISO}
              </p>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p
                lang="en"
                className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
              >
                RECEIPTS · N
              </p>
              <p
                lang="en"
                className="font-mono text-gold text-sm tabular"
              >
                {engineN}
                {/* R71 W-E · Agent B audit F11 fix · N=30 threshold acknowledgment ·
                    之前 silent disappearance · 修:engineN < 30 show countdown · engineN
                    >= 30 swap to「N≥30 · STATISTICALLY MEANINGFUL」 anchor · 同
                    /track-record + Bill James 慣例 + /calibration linkout。 */}
                {engineN < 30 ? (
                  <span className="text-mute/60 text-[9px] tracking-[0.25em] ml-1.5">
                    · {30 - engineN} TO N=30
                  </span>
                ) : (
                  <span className="text-gold/85 text-[9px] tracking-[0.25em] ml-1.5">
                    · N≥30 · STATISTICALLY MEANINGFUL
                  </span>
                )}
              </p>
            </div>
          </div>
          <Link
            href="/methodology/diff"
            className="block mt-4 font-mono text-mute hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
          >
            v0.2 → v0.3 diff →
          </Link>
        </section>

        {/* ── QUADRANT 03 · RECENT RECEIPTS ─────────── */}
        <section
          aria-label="Recent receipts"
          className="px-4 sm:px-5 py-4 sm:py-5"
        >
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-3"
          >
            / 03 · RECENT RECEIPTS · 最近 3 場
          </p>
          {recentReceipts.length === 0 ? (
            <p className="text-mute text-sm leading-relaxed">
              ledger 還是空的 · 第一筆 receipt 即將 ingest
            </p>
          ) : (
            <ul className="space-y-2.5">
              {recentReceipts.map((m) => {
                const cal = getCalibration(m);
                const enginePct = getEnginePctOnWinner(m);
                const verdictIcon =
                  cal === "proved" ? "✓" : cal === "diverged" ? "✕" : "▪";
                const verdictColor =
                  cal === "proved"
                    ? "text-gold"
                    : cal === "diverged"
                      ? "text-loss/85"
                      : "text-mute";
                return (
                  <li key={m.id}>
                    <Link
                      href={`/matches/${m.id}`}
                      className="block group"
                    >
                      <p
                        lang="en"
                        className="font-mono text-mute/85 text-[9px] tracking-[0.22em] tabular mb-0.5"
                      >
                        {m.date}
                      </p>
                      <p className="text-bone group-hover:text-gold text-xs leading-snug transition-colors mb-0.5">
                        {m.home.name} vs {m.away.name}
                      </p>
                      <p
                        lang="en"
                        className={`font-mono ${verdictColor} text-[9px] tracking-[0.25em] tabular`}
                      >
                        {verdictIcon}{" "}
                        {enginePct !== null ? `${enginePct}%` : "—"} ·{" "}
                        {cal === "proved"
                          ? "PROVED"
                          : cal === "diverged"
                            ? "DIVERGED"
                            : "PUSH"}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <Link
            href="/track-record"
            className="block mt-4 font-mono text-mute hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
          >
            完整 ledger →
          </Link>
        </section>
      </div>

      {/* Bottom honest footer · Bloomberg-style fine print */}
      <footer className="px-4 sm:px-5 py-2.5 border-t border-line/40 bg-slate/30">
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.22em] leading-relaxed">
          ⚓ NO welcome animation · NO daysSinceJoin counter · NO leaderboard
          · NO recommended picks · 純 data-first · 同 Bloomberg Terminal home
          screen + Pieter Levels nomadlist member dashboard pattern
        </p>
      </footer>
    </aside>
  );
}
