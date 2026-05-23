import Link from "next/link";
import {
  FOUNDERS_SEATS,
  getClaimedRealCount,
} from "@/lib/founders-seats";

// ── ZONE 27 · Peopling Chip ─────────────────────────────
// R78 W-C · Agent A R77 SHIP E · Defector 2020 launch model(19 worker-
// owners NAMED on launch page · names ARE the announcement)+ Linear 2019
// invite-only(named-invitee signal)+ Stripe Atlas voice(present-not-
// overwhelming)· names-as-announcement axis · pre-launch the chip shows
// single founder「Tim · 台南 · solo-founder · 2026-05」 · 1 name IS the
// announcement · honest about smallness which IS the costly signal per
// Spence 1973。 As real Founders onboard post-payment-infra-ready · names
// append from canonical lib/founders-seats.ts。
//
// The Defector mechanism:
//   - 2020 launch had 19 worker-owner names on launch page
//   - 10K paid subscribers Day 1
//   - The identity of who-is-doing-this WAS the announcement
//   - NOT marketing copy · NOT FOMO · NOT「join 1000+」 social proof
//   - Just names + cities + role
//
// ZONE 27 Year-Zero application:
//   - 0 paying customers · 7 SYSTEM-TEST forged · Tim solo founder
//   - Pre-launch chip = just「Tim · 台南 · solo-founder · 2026-05」
//   - Single name IS the announcement(Defector pattern at Year-Zero)
//   - Post-Founder-#001 onboard · append first 12 real names visible
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · honest smallness · 不藏 0
//     paying customers · 不裝 community of 1000+
//   - per [[feedback-zone27-pratfall-brand-ip]] · publishing 1-name reality
//     IS Pratfall · Aronson 1966 axiom · publish-weakness inverts to trust
//   - per /audit S05 PRE-COMMIT clause · same canonical 7-ledger family
//     append-only discipline · 不可 retroactively edit holder data
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan
//     audience recognizes Tim's solo voice IS the differential · names
//     are real not corporate veil
//
// 不做 anti-pattern(per Agent A R77 SHIP E spec):
//   ✕ NO aggregate puffery(「Join 1000+ ZONE 27 founders」 false claim)
//   ✕ NO 「X people viewing now」 live indicator(11-NEVER #5 live FOMO)
//   ✕ NO avatar images / profile pics(brand IP「不藏 emails 不暴 PII」
//     extends to faces · text-only)
//   ✕ NO link to social profiles(per AGENTS.md social account freeze)
//   ✕ NO email capture「join the founders」 CTA(per NoPushManifest R73 W-D)
//   ✕ NO fake testimonials(per 11-NEVER #11 redline · honest empty preferred)
//
// Visible cap = 12(per Agent A R77 SHIP E spec · avoid scaling pressure
// for future hot-streak founder onboard cadence)· beyond 12 shows count
// remaining · 不 expand inline。
//
// Inspiration sources(per Agent A R77 SHIP E spec):
//   - Defector 2020 launch(19 worker-owners NAMED · names ARE the announcement)
//   - Linear 2019 invite-only(named-invitee signal)
//   - Stripe Atlas voice(present-not-overwhelming · no marketing fluff)
//   - Pinboard 2009 launch(Maciej Cegłowski solo identity)
// ─────────────────────────────────────────────────────

const TIM_FOUNDER_ENTRY = {
  name: "Tim",
  city: "台南",
  role: "solo-founder",
  since: "2026-05",
};

const VISIBLE_CAP = 12;

type Props = {
  /** Visual density · "compact"(1-line inline)or "panel"(stacked vertical
   *  for /audit + /founders top)· same 2-variant pattern as canonical
   *  chip components R67 W-C CadencePulseChip + R73 W-D NoPushManifest +
   *  R75 W-B UnscheduledLetterChip + R78 W-B LetterStampBar。 */
  variant?: "compact" | "panel";
};

export default function PeoplingChip({ variant = "compact" }: Props) {
  const realFounderCount = getClaimedRealCount();
  // Pre-launch state · 0 real founders · just Tim · Defector pattern
  // 「the identity of who-is-doing-this IS the announcement」 · single
  // name is honest disclosure per Pratfall axiom。
  // Future state · append real Founder names from FOUNDERS_SEATS · cap
  // visible at 12 · beyond shows「+N more · /founders/ledger」。
  const claimedSeats = FOUNDERS_SEATS.filter(
    (s) => s.holderName !== null && !s.isSystemTest,
  );
  const visibleSeats = claimedSeats.slice(0, VISIBLE_CAP);
  const hiddenCount = Math.max(0, realFounderCount - VISIBLE_CAP);

  if (variant === "panel") {
    return (
      <aside
        aria-label={`ZONE 27 peopling chip · Tim solo-founder + ${realFounderCount} real founders · Defector 2020 named-launch pattern`}
        className="border-l-2 border-gold/60 bg-slate/30 pl-5 sm:pl-6 py-3 sm:py-4"
      >
        <div className="flex items-baseline gap-3 flex-wrap mb-3">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.35em]"
          >
            ▌ PEOPLING · WHO IS ZONE 27
          </p>
          <p
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em] tabular"
          >
            DEFECTOR 2020 NAMED-LAUNCH PATTERN · APPEND-ONLY
          </p>
        </div>
        <ul className="space-y-1.5 font-mono text-mute/85 text-[11px] tracking-[0.2em] leading-relaxed tabular">
          <li className="flex items-baseline gap-3 flex-wrap">
            <span className="text-gold/85" aria-hidden="true">▸</span>
            <span className="text-bone">{TIM_FOUNDER_ENTRY.name}</span>
            <span className="text-mute/70">· {TIM_FOUNDER_ENTRY.city}</span>
            <span className="text-mute/70">· {TIM_FOUNDER_ENTRY.role}</span>
            <span className="text-mute/60">· since {TIM_FOUNDER_ENTRY.since}</span>
          </li>
          {visibleSeats.length === 0 ? (
            <li className="flex items-baseline gap-3 italic text-mute/60 text-[10px] tracking-[0.18em]">
              <span aria-hidden="true">○</span>
              <span>
                no real Founders yet · 等真實 Founder #001 onboard 後 append
                first 12 names · per Defector 2020 axis honest empty
              </span>
            </li>
          ) : (
            <>
              {visibleSeats.map((seat) => (
                <li
                  key={seat.seatNumber}
                  className="flex items-baseline gap-3 flex-wrap"
                >
                  <span className="text-gold/85" aria-hidden="true">▸</span>
                  <span className="text-bone tabular">
                    #{String(seat.seatNumber).padStart(3, "0")}
                  </span>
                  <span className="text-mute/70">· {seat.holderName}</span>
                  {seat.holderCity && (
                    <span className="text-mute/70">· {seat.holderCity}</span>
                  )}
                  {seat.claimedAt && (
                    <span className="text-mute/60">· {seat.claimedAt}</span>
                  )}
                </li>
              ))}
              {hiddenCount > 0 && (
                <li className="flex items-baseline gap-3 italic text-mute/60 text-[10px] tracking-[0.18em]">
                  <span aria-hidden="true">…</span>
                  <span>
                    + {hiddenCount} more real Founder
                    {hiddenCount === 1 ? "" : "s"} ·{" "}
                    <Link
                      href="/founders/ledger"
                      className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                    >
                      /founders/ledger
                    </Link>{" "}
                    full 270 grid
                  </span>
                </li>
              )}
            </>
          )}
        </ul>
        <p className="font-mono text-mute/65 text-[10px] tracking-[0.2em] leading-relaxed mt-3 pt-3 border-t border-line/40">
          ⚓ Defector 2020 launch had 19 worker-owners NAMED on page ·
          names ARE the announcement(not marketing · not FOMO)· per Agent
          A R77 SHIP E synthesis · ZONE 27 pre-launch = 1 name(Tim 親手 ·
          honest smallness IS the costly signal per Spence 1973)。
        </p>
      </aside>
    );
  }

  // Compact variant · 1-line · Footer-adjacent or inline use
  return (
    <p
      lang="en"
      className="font-mono text-mute/85 text-[10px] tracking-[0.25em] leading-relaxed tabular"
      aria-label={`ZONE 27 peopling · Tim solo-founder + ${realFounderCount} real founders`}
    >
      <span className="text-gold/85" aria-hidden="true">▌</span>{" "}
      PEOPLING ·{" "}
      <span className="text-bone">Tim</span>{" "}
      <span className="text-mute/60">· 台南 · solo-founder · 2026-05</span>
      {realFounderCount > 0 && (
        <>
          {" "}
          <span className="text-mute/50" aria-hidden="true">+</span>{" "}
          <span className="text-bone tabular">{realFounderCount}</span>{" "}
          real founder{realFounderCount === 1 ? "" : "s"}{" "}
          <Link
            href="/founders/ledger"
            className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
          >
            /founders/ledger
          </Link>
        </>
      )}
    </p>
  );
}
