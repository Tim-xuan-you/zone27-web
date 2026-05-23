"use client";

// ── ZONE 27 · Cadence Pulse Chip ────────────────────────
// R67 W-C · Agent R66 ship #4 deferred · Zajonc 1968 Mere Exposure
// 機制 · brand-pure reframe(NOT 「下次更新週四」 cadence promise ·
// /now 已 explicit reject promise pattern · brand IP「不打擾就是禮物」
// axiom 守)。
//
// R68 W-D · Audit F8 fix · 改 client component · 因 server component
// 的「N 天前」 label is computed at build time + SSG 永久 cache · SSG
// 頁面 (track-record · methodology · pricing/why etc) 沒 revalidate
// 故 chip 永久顯示「今天」 even 5 天後 visitor 回訪 = self-falsifiable
// brand IP violation。 修:改 client component · useEffect 在 hydration
// 後 recompute · 每次 visitor 開頁面看到 accurate「X 天前」。 SSR 仍
// render initial fallback「ship」 label 防 CLS。
//
// Surface:
//   ✦ LAST SHIPPED · 2026-05-23 · {N 天前}
//   ○ 節奏由 craft 決定 · 不承諾 · /changelog 有完整 history
//
// Brand IP 全 ✓:
//   - /changelog cross-link · physical history not abstract claim
//   - 0 push · 0 subscribe CTA · 0 countdown
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「不承諾節奏」 = 公開
//     weakness statement · Pratfall pattern · 同 /roadmap 「LOCKED /
//     EXPLORING / BRAND BOUNDARIES」 三層 honesty grammar
//   - Mere Exposure works on visitor seeing「ZONE 27 is shipping things」
//     each return visit · NOT on weekly subscription nag
// ─────────────────────────────────────────────────────

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LAST_SHIPPED_DATE_ISO,
  formatTimeSinceLastShipped,
} from "@/lib/last-shipped";

type Props = {
  /** Visual density · "compact" for Footer · "panel" for /now top */
  variant?: "compact" | "panel";
};

export default function CadencePulseChip({ variant = "compact" }: Props) {
  // R68 W-D audit F8 fix · SSR initial label uses build-time compute
  // (sufficient for first paint · same content as before)· useEffect
  // re-evaluates after hydration · 防止 SSG stale date。 Visitor refresh
  // 5 天後看到 accurate「5 天前」 not stale「今天」。
  const [sinceLabel, setSinceLabel] = useState<string>(() =>
    formatTimeSinceLastShipped(),
  );

  useEffect(() => {
    // Recompute on client mount · cheap (string format only)。 No interval
    // needed · visitor session is short enough that one recompute suffices.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSinceLabel(formatTimeSinceLastShipped());
  }, []);

  if (variant === "panel") {
    return (
      <div className="bg-slate/30 border border-line/50 px-5 sm:px-6 py-4 sm:py-5 mb-8">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.35em]"
          >
            ✦ LAST SHIPPED · {LAST_SHIPPED_DATE_ISO}
          </p>
          <span
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.3em] tabular"
          >
            {sinceLabel}
          </span>
        </div>
        <p className="text-mute text-sm leading-relaxed">
          ○ 節奏由 craft 決定 · 不承諾「每週四 22:30」 ·{" "}
          <Link
            href="/changelog"
            className="text-gold hover:text-gold-soft underline-offset-4 hover:underline transition-colors"
          >
            /changelog
          </Link>{" "}
          有完整物理 commit history · 不藏 cadence variance。
        </p>
      </div>
    );
  }

  // compact variant(Footer)· 1-line · 不佔 Footer vertical real estate
  return (
    <Link
      href="/changelog"
      className="inline-flex items-center gap-2 font-mono text-mute/85 hover:text-gold text-[9px] tracking-[0.3em] transition-colors group"
      aria-label={`Last shipped ${LAST_SHIPPED_DATE_ISO} · ${sinceLabel} · cadence not promised · /changelog for full history`}
    >
      <span
        className="w-1 h-1 rounded-full bg-gold/70 shrink-0 group-hover:bg-gold transition-colors"
        aria-hidden="true"
      />
      <span lang="en">LAST SHIPPED</span>
      <span className="text-bone/85">{LAST_SHIPPED_DATE_ISO}</span>
      <span className="text-mute/70" aria-hidden="true">·</span>
      <span className="text-mute/85 tabular">{sinceLabel}</span>
      <span className="text-mute/60" aria-hidden="true">·</span>
      <span className="group-hover:underline underline-offset-4">節奏不承諾</span>
    </Link>
  );
}
