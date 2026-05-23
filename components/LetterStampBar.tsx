import Link from "next/link";
import {
  LAST_EDITED_AT,
  EDIT_HISTORY_COUNT,
  EDIT_HISTORY,
} from "@/lib/letter-content";

// ── ZONE 27 · Letter Stamp Bar ──────────────────────────
// R78 W-B · Agent A R77 SHIP G · Stratechery RSS heartbeat + Wikipedia
// 「last edited」 stamp + UnscheduledLetterChip R75 W-B pattern · pairs
// with /letter R77 W-D singular voice artifact · 1-line bar at top of
// /now + /audit shows「Letter · last edited X · N edits」 · readers see
// heartbeat then choose to read · NOT push notification · NO red dot ·
// NO「NEW」 badge · grayscale only · brand IP「不打擾就是禮物」 axiom 守。
//
// The mechanic:
//   - /letter R77 W-D is replace-in-place artifact (DHH HEY World + Berkshire)
//   - Without LetterStampBar · /letter only discoverable via direct visit
//     OR /now or /changelog UnscheduledLetterChip cross-link
//   - LetterStampBar surfaces heartbeat at top of HIGH-TRAFFIC trust pages
//     (/now + /audit)· readers see edit cadence then pull · 不 push
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · /letter heartbeat surfaced ·
//     visitor see edit cadence transparency
//   - per /audit S05 PRE-COMMIT clause · EDIT_HISTORY append-only · this
//     component is pure derivation · 0 side effect · 0 state
//   - per /now no-weekly-schedule axiom · 「last edited N days ago」 是
//     STATE label NOT schedule promise · same axis as CadencePulseChip
//     R67 W-C reframed
//   - per [[feedback-zone27-pratfall-brand-ip]] · publish edit count
//     including small counts(1 edit so far)· Aronson Pratfall · 不藏
//     low edit cadence pre-launch
//
// 不做 anti-pattern(per Agent A R77 SHIP G spec):
//   ✕ NO red dot / 「NEW」 badge(notification anxiety trigger)
//   ✕ NO「subscribe to letter updates」 CTA(violates 不打擾就是禮物 +
//     NoPushManifest R73 W-D)
//   ✕ NO「since your last visit」 visitor-tracking diff(0 PII per
//     /privacy axiom · 不 track visitor)
//   ✕ NO sticky / always-visible chip(sit at TOP of page · scrolls away)
//   ✕ NO modal popup when letter recently edited(brand IP 11-NEVER #9
//     modal paywall redline)
//
// Placement(per Agent A R77 SHIP G spec):
//   - /now top(above CadencePulseChip + UnscheduledLetterChip 3-chip
//     stack · 4-chip stack with LetterStampBar)
//   - /audit top(above DISCLOSURE block · same heartbeat surfacing axis)
//   - Footer optional(future · per Footer-discoverability axis)
//
// Inspiration sources:
//   - Stratechery RSS heartbeat(2013-now)
//   - Wikipedia「last edited DATE」 stamp(canonical edit transparency)
//   - UnscheduledLetterChip R75 W-B(同 axis · companion chip)
//   - DHH HEY World post-date display(replace-in-place letter pattern)
// ─────────────────────────────────────────────────────

type Props = {
  /** Visual density · "compact"(footer / inline)or "panel"(page top) ·
   *  same 2-variant pattern as R67 W-C CadencePulseChip + R73 W-D
   *  NoPushManifest + R75 W-B UnscheduledLetterChip。 */
  variant?: "compact" | "panel";
};

/** Compute days since last edited · TPE-anchored · derives from canonical
 *  LAST_EDITED_AT · 0 timezone-dependent state · 0 side effect。 */
function daysSinceLastEdit(): number {
  const lastEdit = new Date(`${LAST_EDITED_AT}T00:00:00+08:00`);
  const now = new Date();
  const diffMs = now.getTime() - lastEdit.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}

export default function LetterStampBar({ variant = "compact" }: Props) {
  // Get latest edit summary for inline display · brand IP 公開 edit cadence
  // 不藏 small edit counts · per Pratfall axiom + /audit S05 disclosure parity。
  const latestEdit = EDIT_HISTORY[EDIT_HISTORY.length - 1];
  const daysSince = daysSinceLastEdit();
  const daysSinceLabel =
    daysSince === 0
      ? "今天"
      : daysSince === 1
        ? "1 天前"
        : `${daysSince} 天前`;

  if (variant === "panel") {
    return (
      <aside
        aria-label={`The Letter · last edited ${LAST_EDITED_AT} · ${EDIT_HISTORY_COUNT} total edits · per /audit S05 PRE-COMMIT append-only · pull-based reader-owned arrival per /transparency#no-push-manifest`}
        className="border-l-2 border-gold/50 bg-slate/30 pl-5 sm:pl-6 py-3 sm:py-4 mb-6"
      >
        <div className="flex items-baseline gap-3 flex-wrap mb-2">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.35em]"
          >
            ✉ THE LETTER · LAST EDITED · {LAST_EDITED_AT}
          </p>
          <p
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em] tabular"
          >
            {EDIT_HISTORY_COUNT} TOTAL EDITS · {daysSinceLabel}
          </p>
        </div>
        <p className="text-mute text-sm leading-relaxed mb-2">
          ○ Tim 親手 letter · DHH HEY World + Berkshire annual letter +
          Bret Victor replace-in-place pattern · NOT new post · NOT feed ·{" "}
          <Link
            href="/letter"
            className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
          >
            /letter
          </Link>{" "}
          single artifact · edited-in-place · APPEND-ONLY edit history。
        </p>
        {latestEdit && (
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ Latest edit summary · {latestEdit.summary.slice(0, 80)}
            {latestEdit.summary.length > 80 && "…"}
          </p>
        )}
      </aside>
    );
  }

  // Compact variant · 1-line · Footer-adjacent or page-top inline use
  return (
    <Link
      href="/letter"
      className="inline-flex items-center gap-2 font-mono text-mute/85 hover:text-gold text-[9px] tracking-[0.3em] transition-colors group"
      aria-label={`The Letter · last edited ${LAST_EDITED_AT} · ${EDIT_HISTORY_COUNT} edits · click to read`}
    >
      <span
        className="w-1 h-1 rounded-full bg-gold/70 shrink-0 group-hover:bg-gold transition-colors"
        aria-hidden="true"
      />
      <span lang="en">LETTER</span>
      <span className="text-mute/70" aria-hidden="true">·</span>
      <span className="text-bone/85">{LAST_EDITED_AT}</span>
      <span className="text-mute/70" aria-hidden="true">·</span>
      <span className="text-mute/85 tabular">{daysSinceLabel}</span>
      <span className="text-mute/60" aria-hidden="true">·</span>
      <span className="group-hover:underline underline-offset-4">
        {EDIT_HISTORY_COUNT} edit{EDIT_HISTORY_COUNT === 1 ? "" : "s"}
      </span>
    </Link>
  );
}
