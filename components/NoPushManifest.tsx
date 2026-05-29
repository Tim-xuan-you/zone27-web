import Link from "next/link";
import { NO_PUSH_INVENTORY, NO_PUSH_COUNT } from "@/lib/no-push-inventory";

// ── ZONE 27 · No-Push Manifest ──────────────────────────
// R73 W-D · Agent A R73 SHIP 2 · Brehm Reactance Theory(1966)+ Deci/
// Ryan Self-Determination Theory(1985)psychology · costly-signaling-
// via-restraint(Spence 1973)· make the 12 deliberate absences PUBLIC
// instead of invisible(Mubi/Calm/Are.na pattern · ZONE 27 differentiator
// is publishing the restraint)。
//
// Patagonia「Don't Buy This Jacket」 2011 NYT ad parallel · anti-
// consumption-as-reciprocity case study · hardcore CPBL fan audience
// burned by LINE 老師 push notifications recognize the inversion
// immediately(audience-fans-not-engineers axiom)。
//
// Mounted on /transparency NEW Section AND /pricing/why §06 · single
// component · 0 server roundtrip · pure typographic restraint。
//
// brand IP fit:
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「here's what we
//     deliberately don't do」 explicit costly signaling
//   - per [[zone27-disclosure-philosophy]] · operational artifact of
//     existing 11 「永遠不做」 axiom · concentrated in 1 view
//   - per /audit S05 PRE-COMMIT clause · append-only discipline · 修改
//     需 30 天 /changelog notice
//   - per audience-fans-not-engineers axiom · 「我們不 push」 fan-grammar
//
// Defaults to「manifest」 variant · /pricing/why §06 may use「compact」 inline。
// ─────────────────────────────────────────────────────

type Props = {
  /** Visual density · "manifest"(full · for /transparency)or "compact"
   *  (1-row dense list · for /pricing/why §06) */
  variant?: "manifest" | "compact";
};

export default function NoPushManifest({ variant = "manifest" }: Props) {
  if (variant === "compact") {
    // Compact inline · single block for /pricing/why §06
    return (
      <section
        aria-label="No-push manifest · 12 deliberate absences · ZONE 27 brand IP restraint"
        className="border border-line/50 bg-slate/30 px-5 sm:px-6 py-4 sm:py-5"
      >
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-3"
        >
          ⚓ NO-PUSH MANIFEST · {NO_PUSH_COUNT} DELIBERATE ABSENCES
        </p>
        <p className="text-mute text-sm leading-relaxed mb-3">
          ZONE 27 NT$ 500/31 天(BLACK CARD CPBL Season Pass)+ NT$ 2,700/年(Founders 27)
          訂閱費 後 · {NO_PUSH_COUNT} 件事我們 binding{" "}
          <strong className="text-bone">永遠不會做</strong> · per /audit S05
          PRE-COMMIT 30-day notice if breaks · Brehm Reactance Theory(1966)
          + Deci/Ryan Self-Determination Theory(1985)· anti-push activates
          resistance not compliance · 同 Mubi + Calm + Are.na + 1Password
          pattern。
        </p>
        <ul className="font-mono text-mute/85 text-[11px] tracking-[0.18em] leading-relaxed space-y-1 tabular">
          {NO_PUSH_INVENTORY.slice(0, 6).map((item, idx) => (
            <li key={idx}>
              <span className="text-loss/60 mr-2" aria-hidden="true">✕</span>
              {item.what}
            </li>
          ))}
          <li className="text-mute/60 italic mt-2">
            + {NO_PUSH_COUNT - 6} more · see{" "}
            <Link
              href="/audit"
              className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
            >
              /audit
            </Link>
          </li>
        </ul>
      </section>
    );
  }

  // Default · manifest full variant · for /transparency section
  return (
    <section
      id="no-push-manifest"
      aria-label="No-push manifest · 12 deliberate absences · ZONE 27 brand IP restraint"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-14 pt-10 border-t border-line/40 scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-3 flex-wrap">
        <span
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.4em]"
        >
          / NO-PUSH MANIFEST
        </span>
        <span
          lang="en"
          className="font-mono text-mute text-[10px] tracking-[0.3em] tabular"
        >
          {NO_PUSH_COUNT} DELIBERATE ABSENCES · APPEND-ONLY
        </span>
      </div>
      <h2 className="text-3xl text-bone font-light tracking-tight mb-4">
        {NO_PUSH_COUNT} 件 ZONE 27{" "}
        <span className="text-gold">永遠不會 ship</span> 的事
      </h2>

      <p className="text-mute leading-relaxed mb-4">
        Mubi / Calm / Are.na / Astral Codex Ten / 1Password · 它們 retain
        paid subscribers at premium price WITHOUT 任何 engagement loop ·{" "}
        <strong className="text-bone">
          因為 anti-push activates trust 不是 reactance
        </strong>{" "}
        · Brehm Reactance Theory(1966)+ Deci/Ryan Self-Determination Theory
        (1985)· extrinsic motivation degrades intrinsic motivation。
      </p>
      <p className="text-mute leading-relaxed mb-6">
        差別是 · 它們 invisible(不講)· ZONE 27{" "}
        <strong className="text-bone">PUBLISH the restraint</strong> ·
        因為 hardcore CPBL fans burned by LINE 老師 daily-spam pattern-match
        absence 即 trust · per Patagonia「Don&apos;t Buy This Jacket」 2011
        NYT 案例 + audience-fans-not-engineers axiom。 同 11「永遠不做」
        CLAUDE.md 已 binding · 此 page 是 operational scaffold。
      </p>

      <ol className="space-y-3 mt-6">
        {NO_PUSH_INVENTORY.map((item, idx) => (
          <li
            key={idx}
            className="border-l-2 border-loss/40 pl-4 py-2 bg-slate/20"
          >
            <div className="flex items-baseline gap-3 flex-wrap mb-1">
              <span
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] tabular"
              >
                ✕ {String(idx + 1).padStart(2, "0")}
              </span>
              <p className="text-bone text-sm sm:text-base leading-snug flex-1">
                <strong>{item.what}</strong>
              </p>
            </div>
            <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
              {item.why}
            </p>
            <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mt-1.5">
              <span aria-hidden="true">▸</span> compete pattern · {item.source}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-8 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
        ⚓ Append-only per /audit S05 PRE-COMMIT clause · 修改任一 entry
        需 30 天前 /changelog 公告 · 同 ENGINE_DIFF_BEACONS R71 W-C +
        founders-stats claimedFounders + lib/diff-commits.ts canonical
        single-source pattern · Costly Signaling 100× per Spence 1973。
      </p>
    </section>
  );
}
