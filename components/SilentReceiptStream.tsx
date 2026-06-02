import Link from "next/link";
import type { Match } from "@/lib/matches";
import { getCalibration, getEnginePctOnWinner } from "@/lib/matches";

// ── ZONE 27 · Silent Receipt Stream ─────────────────────
// R70 W-C · Agent A R69 SHIP 4 deferred · Pinboard.in archive view +
// Tom Tango blog chronological list + Cameron Grove receipt index
// pattern。 「ledger paper」 aesthetic · single-line typographic rows ·
// no filter · no search · no pagination · ASCENDING(oldest first ·
// sub-pinned-card)reverse-chronological 是 LedgerRow Bloomberg-grid
// surface · this is parallel ARCHIVE INDEX axis · ledger paper as PDF
// page · screenshot-friendly。
//
// Building NOW(while N=1)means it lives in the architecture before
// sample debt closes · same physics-of-time discipline as /founders/
// ledger empty scaffold(R31 W-S)+ /annual/2026 Year 0 empty(R33 W-E)+
// /founders/from-one-current-founder(R69 W-B)。 Pinboard.in shipped at
// user-count=0 with same UI as user-count=1M。
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · every receipt indexed ·
//     0 curation · 0 cherry-pick · DIVERGED rows publicly listed
//   - per [[feedback-zone27-pratfall-brand-ip]] · 0 visual celebration
//     of PROVED over DIVERGED · same row height + typography for both
//   - per Costly Signaling · 0 filter UI to hide bad receipts(不 ship
//     「show only PROVED」 toggle = brand-pure)
//   - per Pokemon TCG「ledger paper」 mental model · sub-anchored card
//     anatomy + REPRINT POLICY 0 axiom
//
// 不做 anti-pattern:
//   ✕ no「show only PROVED · filter DIVERGED」 toggle(curation redline)
//   ✕ no「sort by accuracy」 dropdown(manufactures ranking)
//   ✕ no「export as CSV / download」 (would imply data needs exporting · 同
//     [[zone27-disclosure-philosophy]] visitor can DevTools view directly)
//   ✕ no row-level「share」 button(QuietHandoffCard + ReceiptForwardButton
//     handle that on /matches/[gameId] · not duplicated here)
// ─────────────────────────────────────────────────────

type Props = {
  /** All finalized matches · server-provided · pre-filtered · component
   *  does NOT enforce sorting itself · caller hands in chronological asc
   *  order(oldest first)per Pinboard.in archive paradigm。 */
  finalizedMatches: Match[];
};

export default function SilentReceiptStream({ finalizedMatches }: Props) {
  // N=0 · empty state handled elsewhere(EmptyLedger on /track-record)
  // · this component returns null
  if (finalizedMatches.length === 0) return null;

  // Sort ASCENDING(oldest first · ledger paper paradigm · opposite of
  // newest-first Bloomberg ledger LedgerRow)。 Caller may pre-sort but
  // this is the canonical guarantee。
  const sorted = [...finalizedMatches].sort((a, b) =>
    (a.finalResult?.ingestedAt ?? "").localeCompare(
      b.finalResult?.ingestedAt ?? "",
    ),
  );

  return (
    <section
      aria-label="Silent receipt stream · archive index · oldest first"
      className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-20"
    >
      <header className="mb-6 flex items-baseline justify-between gap-3 flex-wrap">
        <p className="font-mono text-gold/85 text-[10px] tracking-[0.4em]">
          / 收據總表 · 依時間排序 · 最舊在前
        </p>
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em] tabular">
          N = {sorted.length} · 純列表 · 不篩選
        </p>
      </header>

      <ol className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] tabular leading-relaxed space-y-1.5">
        {sorted.map((m, idx) => {
          const cal = getCalibration(m);
          const fr = m.finalResult;
          if (!fr || !cal) return null;
          const enginePct = getEnginePctOnWinner(m);
          const verdictLabel =
            cal === "proved"
              ? "✓ PROVED"
              : cal === "diverged"
                ? "✕ DIVERGED"
                : "▪ PUSH";
          const verdictColor =
            cal === "proved"
              ? "text-gold"
              : cal === "diverged"
                ? "text-loss/85"
                : "text-mute";
          const cardNum = String(idx + 1).padStart(3, "0");
          const winnerLabel =
            fr.winner === "home"
              ? m.home.en
              : fr.winner === "away"
                ? m.away.en
                : "TIE";
          return (
            <li key={m.id}>
              <Link
                href={`/matches/${m.id}`}
                className="block py-1 px-1 -mx-1 hover:bg-slate/40 transition-colors group"
              >
                <span className="text-mute/70 mr-3">RECEIPT {cardNum}</span>
                <span className="text-mute/70 mr-3">·</span>
                <span className="text-mute/70 mr-3">CPBL</span>
                <span className="text-mute/70 mr-3">·</span>
                <span className="text-bone mr-3">{m.date}</span>
                <span className="text-mute/70 mr-3">·</span>
                <span className="text-bone mr-3 group-hover:text-gold transition-colors">
                  {m.home.en} {fr.homeScore}
                </span>
                <span className="text-mute/70 mr-3">vs</span>
                <span className="text-bone mr-3 group-hover:text-gold transition-colors">
                  {m.away.en} {fr.awayScore}
                </span>
                <span className="text-mute/70 mr-3">·</span>
                <span className="text-mute mr-3">
                  ENGINE {enginePct !== null ? `${enginePct}%` : "—"}
                </span>
                <span className="text-mute/70 mr-3">·</span>
                <span className={`${verdictColor} font-medium`}>
                  {verdictLabel}
                </span>
                {fr.winner !== "tie" && (
                  <>
                    <span className="text-mute/70 mr-3 ml-3">·</span>
                    <span className="text-mute/85">{winnerLabel} W</span>
                  </>
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      <p className="mt-6 font-mono text-mute/60 text-[9px] tracking-[0.25em] leading-relaxed">
        ⚓ 依時間順序 · 最舊在最前 · 不篩選 / 不搜尋 / 不分頁 ·
        每一筆收據都永久保留、永不重發 · 第一筆永遠是第一筆。
      </p>
    </section>
  );
}
