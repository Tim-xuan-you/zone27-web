import Link from "next/link";
import {
  findBeaconSince,
  countBeaconsSince,
  type EngineDiffBeacon,
} from "@/lib/diff-commits";

// ── ZONE 27 · Diff Commit Chip ──────────────────────────
// R71 W-C · Agent A R71 SHIP 1 · reusable component · surfaces「自您上次
// 來 · X 件 engine update」 deep-link to /methodology/diff anchor。 Used
// in:
//   - DailyReturnRail(R70 W-B)· when daysSince >= 7
//   - SilentReceiptStream header(R70 W-C)· optional parallel surface
//   - future /member dashboard 4th quadrant(R72+)
//
// Reads ENGINE_DIFF_BEACONS append-only single-source · ZERO state · pure
// derive from sinceIso prop · returns null if no newer beacon。
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · deep link forces visitor INTO
//     the diff artifact · NOT summary card · 不藏 actual delta
//   - per [[feedback-zone27-pratfall-brand-ip]] · beacons include
//     reversals + DIVERGED events when relevant · same visual weight
//   - per Berkshire annual letter pattern · ONE high-density artifact
//     compresses period since visitor's last visit · NOT scroll-list
//
// 不做 anti-pattern:
//   ✕ NO「subscribe to get notified about new diff」 push CTA
//   ✕ NO badge / unlock / streak on accumulating beacons
//   ✕ NO「Tim shipped X commits this week」 metric vanity surface
// ─────────────────────────────────────────────────────

type Props = {
  /** ISO YYYY-MM-DD · visitor's last visit date · beacons after this date
   *  surface · null means「show nothing」 · pass for SSR fallback. */
  sinceIso: string | null;
  /** Visual density · "inline"(default · 1-line)or "block"(2-line stacked)*/
  variant?: "inline" | "block";
};

export default function DiffCommitChip({
  sinceIso,
  variant = "inline",
}: Props) {
  if (!sinceIso) return null;
  const beacon: EngineDiffBeacon | null = findBeaconSince(sinceIso);
  if (!beacon) return null;
  const totalCount = countBeaconsSince(sinceIso);

  if (variant === "block") {
    return (
      <div className="border-l-2 border-gold/60 pl-3 py-1 my-2">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-1"
        >
          ✦ ENGINE UPDATE SINCE YOUR LAST VISIT{" "}
          {totalCount > 1 ? `· ${totalCount} 件 · latest:` : "· latest:"}
        </p>
        <p className="text-mute text-sm leading-relaxed">
          <span className="font-mono text-bone tabular text-[11px] mr-2">
            {beacon.date}
          </span>
          {beacon.label}{" "}
          <Link
            href={beacon.href}
            className="text-gold underline-offset-4 hover:underline transition-colors"
          >
            →
          </Link>
        </p>
      </div>
    );
  }

  // inline variant · 1-line · for DailyReturnRail
  return (
    <p className="font-mono text-mute/80 text-[10px] tracking-[0.22em] leading-relaxed">
      <span className="text-gold/70 mr-2" aria-hidden="true">
        ✦
      </span>
      {totalCount > 1 ? `${totalCount} 件 ` : ""}engine update ·{" "}
      <Link
        href={beacon.href}
        className="text-gold/85 hover:text-gold underline-offset-4 hover:underline transition-colors"
      >
        {beacon.label} →
      </Link>
    </p>
  );
}
