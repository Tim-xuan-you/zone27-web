import Link from "next/link";
import { LAST_SHIPPED_DATE_ISO } from "@/lib/last-shipped";

// ── ZONE 27 · Engine Cadence Promise ────────────────────
// R75 W-E · Agent A R75 SHIP 4 · Stratechery cadence-discipline + Defector
// annual report + Linear changelog dated commitment · publish CADENCE-of-
// EFFORT pre-commitment(NOT schedule-of-content)。 Reconciles brand IP
// 「no weekly schedule promise」(/now journal axiom)with brand IP「公開
// commitment」(/ethics #5 7-day ingest SLA)by re-framing:
//
//   - Schedule promise = committing to specific timing (e.g.「每週四 22:30」)
//     → brand IP REJECTS this(CadencePulseChip 「節奏不承諾」 R67 W-C)
//   - Cadence-of-effort = committing to MAXIMUM delay between updates
//     → brand IP REQUIRES this(/ethics #5 7-day post-final ingest SLA)
//
// Two binding cadence commitments published BEFORE Tim is asked to honor:
//   01 · DAILY INGEST when matches scheduled · per /ethics commitment #5
//        7-day post-final SLA · 不是 daily-when-no-match-scheduled · 是
//        「有 match · Tim 親手 24h 內 ingest」 maximum-delay axiom
//   02 · ≤7-DAY MAX JOURNAL DELAY · /now journal substantial update ·
//        per /ethics commitment #8「any rule modification 30 天前公告」
//        + same physics-of-time append-only discipline · NOT「weekly
//        promised」 schedule · 是「maximum-7-day max-delay」 ceiling
//
// Pratfall handling:
//   - 違反 commitment 01 = git diff log shows missing ingest dates · 不藏
//   - 違反 commitment 02 = /now LAST_UPDATED date drift · visitor can audit
//   - 主動「MISSED」 surface preferred over silent slip · Aronson 1966
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · publish effort-commitment 是
//     costly signal · same axis as MultiYearAnchor R75 W-D + ENGINE_DIFF_
//     BEACONS R71 W-C
//   - per [[feedback-zone27-pratfall-brand-ip]] · publish maximum delay
//     ceiling exposes future failure risk · Aronson Pratfall pattern
//   - per /now 「no weekly schedule promise」 axiom · maximum-delay !=
//     schedule-promise · two different commitments · this chip explicit
//   - per /audit S05 PRE-COMMIT clause · 修改任 commitment 需 30 天前
//     /changelog 公告 · same single-source append-only discipline
//
// 不做 anti-pattern:
//   ✕ NO「每週四 22:30 update」 schedule promise(violates /now axiom)
//   ✕ NO「subscribe to be notified of MISSED days」 email capture
//   ✕ NO「Engine Cadence Streak: 14 days」 streak gamification(11-NEVER #2)
//   ✕ NO push permission for MISSED-day alerts(NoPushManifest R73 W-D)
//
// Inspiration sources(per Agent A R75 SHIP 4 spec):
//   - Stratechery 2x/week from day one(Ben Thompson cadence discipline)
//   - Defector annual report(60-yr Berkshire-style cadence)
//   - Linear changelog dated commitment(March 2026 UI refresh standard)
//   - Pinboard.in 17-yr maximum-uptime SLA disclosure(solo-founder honesty)
// ─────────────────────────────────────────────────────

const INGEST_CADENCE = "DAILY when matches scheduled";
const JOURNAL_MAX_DELAY_DAYS = 7;

export default function EngineCadencePromise() {
  return (
    <aside
      aria-label="Engine Cadence Promise · maximum-delay commitment · NOT schedule-promise · Stratechery cadence-discipline pattern"
      className="mt-4 max-w-2xl border-l-2 border-gold/60 bg-slate/30 pl-5 sm:pl-6 py-3 sm:py-4"
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.4em]"
        >
          ⚓ ENGINE CADENCE PROMISE · MAX-DELAY NOT SCHEDULE
        </p>
        <p
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em] tabular"
        >
          PER /ETHICS #5 + #8 · APPEND-ONLY
        </p>
      </div>

      <p className="text-mute text-sm leading-relaxed mb-3">
        Stratechery Ben Thompson:{" "}
        <em className="text-bone not-italic">
          &ldquo;I limited myself to 2x/week from day one — I didn&rsquo;t
          want to feel like I&rsquo;m taking stuff away&rdquo;
        </em>{" "}
        · cadence-of-effort 是 trust artifact 不是 schedule-of-content。
        ZONE 27 reconciles 此 axis with{" "}
        <Link
          href="/now"
          className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
        >
          /now journal
        </Link>{" "}
        「no weekly schedule promise」 axiom by publishing{" "}
        <strong className="text-bone">maximum-delay ceiling</strong>(不 specific
        timing)· 兩 binding commitments published BEFORE 被要求 honor:
      </p>

      <ol className="space-y-2.5 text-mute text-[13px] leading-relaxed mb-4">
        <li className="flex gap-3 items-baseline">
          <span
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
          >
            01
          </span>
          <span className="flex-1">
            <strong className="text-bone">{INGEST_CADENCE}</strong>{" "}
            · per{" "}
            <Link
              href="/ethics"
              className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
            >
              /ethics commitment #5
            </Link>{" "}
            7-day post-final SLA · 有 match · Tim 親手 24h 內 ingest · 違反
            = git diff log shows missing ingest dates · 不藏。
          </span>
        </li>
        <li className="flex gap-3 items-baseline">
          <span
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
          >
            02
          </span>
          <span className="flex-1">
            <strong className="text-bone">
              ≤{JOURNAL_MAX_DELAY_DAYS}-DAY MAX JOURNAL DELAY
            </strong>
            {" "}· /now journal substantial update · 不是「每週四 22:30」
            schedule promise · 是「maximum-{JOURNAL_MAX_DELAY_DAYS}-day
            ceiling」 · 違反 = /now LAST_UPDATED date drift · visitor 可 audit
            via git history。
          </span>
        </li>
      </ol>

      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
        ⚓ Last shipped{" "}
        <span className="text-bone tabular">{LAST_SHIPPED_DATE_ISO}</span> ·
        若 Tim 連續 miss N days · /now 主動 MISSED surface(per Aronson 1966
        Pratfall axiom · 主動暴露失敗 &gt; silent slip)·{" "}
        <Link
          href="/changelog"
          className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
        >
          /changelog
        </Link>{" "}
        git history = single source of truth · 修改 commitment 需 30 天前
        公告(/ethics #8)。
      </p>
    </aside>
  );
}
