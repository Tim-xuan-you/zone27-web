import Link from "next/link";

// ── ZONE 27 · Unscheduled Letter Chip ──────────────────
// R75 W-B · Agent A R72 SHIP 7 deferred · DHH world.hey.com letter pattern ·
// CadencePulseChip(R67 W-C)extension · framing layer not state layer ·
// 「ZONE 27 ships UNSCHEDULED letters · 不是 blog · 不訂 weekly · pull-
// based · 您 OWN arrival」 grammar amplifier。
//
// The cognitive frame this rewrites:
//   - Visitor's default for「changelog / now / journal」 = SaaS blog ·
//     subscribe to be notified · push email · timed publishing schedule
//   - ZONE 27 inverts:no schedule promise · no email capture for digest ·
//     no push permission asked · visitor pulls(visit OR RSS)· asymmetric
//     ownership of arrival
//
// brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · publish the asymmetry · most
//     blogs hide their「we send to you」 framing · ZONE 27 makes it explicit
//   - per [[feedback-zone27-pratfall-brand-ip]] · publish-weakness axiom ·
//     「we don't have your email」 is a feature not a deficit
//   - per /audit S05 PRE-COMMIT clause · cadence-not-promised is binding ·
//     same axis as CadencePulseChip 「節奏不承諾」 grammar
//   - per [[feedback-no-waiting-rule]] · arrival pull-based aligns with
//     visitor autonomy · NOT obligation-to-respond
//
// 不做 anti-pattern:
//   ✕ NO「subscribe to never miss」 newsletter CTA(violates 不打擾 axiom)
//   ✕ NO live letter-count animation(would convert framing into engagement)
//   ✕ NO「last letter X days ago · 還沒回家?」 nag(per 11-NEVER list #5)
//   ✕ NO「join 1000+ readers」 social proof(fake testimonials redline)
//
// Inspiration sources(per Agent A R72 SHIP 7 spec):
//   - DHH world.hey.com 「I write letters not blog posts」(2022-now · solo)
//   - Patrick McKenzie patio11 「I write what I want when I want」(2010-now)
//   - Stratechery Free Daily Update(give before paywall · pull-based)
//   - Linear changelog(publish only when shipped · no schedule promise)
//   - DLs Bartoli Substack(no email digest cadence promise)
// ─────────────────────────────────────────────────────

type Props = {
  /** Visual density · "panel"(/now or /changelog top header)or "compact"
   *  (single-line for /track-record / Footer adjacent surfaces)· same
   *  2-variant pattern as R67 W-C CadencePulseChip + R73 W-D NoPushManifest +
   *  R74 W-A ReciprocityLedger + R74 W-D LocalStorageReceipt。 */
  variant?: "panel" | "compact";
};

export default function UnscheduledLetterChip({ variant = "panel" }: Props) {
  if (variant === "compact") {
    // Compact variant · single-line · for Footer-adjacent or inline use
    return (
      <p
        lang="en"
        className="font-mono text-mute/85 text-[10px] tracking-[0.25em] leading-relaxed"
        aria-label="ZONE 27 ships unscheduled letters · pull-based RSS · 0 push permission asked · 0 email digest"
      >
        <span className="text-gold/85" aria-hidden="true">○</span>{" "}
        UNSCHEDULED LETTERS · 您 OWN arrival ·{" "}
        <Link
          href="/feed.xml"
          className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
        >
          RSS pull
        </Link>{" "}
        / {" "}
        <Link
          href="/changelog"
          className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
        >
          /changelog
        </Link>{" "}
        · 0 email · 0 push
      </p>
    );
  }

  // Default · panel variant · for /now and /changelog top header surface
  return (
    <aside
      aria-label="Unscheduled Letter Chip · pull-based arrival · DHH world.hey.com pattern · ZONE 27 letter-not-blog grammar"
      className="border-l-2 border-gold/60 bg-slate/30 pl-5 sm:pl-6 py-3 sm:py-4 mb-6"
    >
      <div className="flex items-baseline gap-3 mb-2 flex-wrap">
        <p
          lang="en"
          className="font-mono text-gold/85 text-[10px] tracking-[0.4em]"
        >
          / UNSCHEDULED LETTERS · NOT A BLOG · NOT A NEWSLETTER
        </p>
        <p
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          PULL-BASED · DHH WORLD.HEY.COM PATTERN
        </p>
      </div>
      <p className="text-mute text-sm leading-relaxed mb-3">
        DHH(37signals 創辦人)2022 起 world.hey.com:{" "}
        <em className="text-bone not-italic">
          &ldquo;I write letters · not blog posts · letters are mailed when
          there&rsquo;s something to say&rdquo;
        </em>{" "}
        · ZONE 27 採同 pattern · 此 page 不是 blog · 不是 newsletter · 不訂
        weekly digest schedule · visitor{" "}
        <strong className="text-bone">OWN arrival</strong>(直接 visit OR{" "}
        <Link
          href="/feed.xml"
          className="text-gold hover:text-gold-soft underline-offset-4 hover:underline"
        >
          RSS pull
        </Link>
        )· ZONE 27 0 您的 email · 0 push permission asked。
      </p>
      <p className="text-mute/85 text-[12px] sm:text-sm leading-relaxed mb-3">
        差別不在 cadence(我們也{" "}
        <em className="text-bone not-italic">無</em> cadence promise)·
        差別在{" "}
        <strong className="text-bone">arrival ownership 不對稱</strong> ·
        LINE 老師 / 報馬仔 / 投顧老師 model 是「they 推 TO you」 · ZONE 27
        model 是「you GO to them OR RSS pull」 · 訪客 autonomy 物理 codify。
      </p>
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
        ⚓ per /audit S05 PRE-COMMIT clause · 不訂 weekly cadence + 不發
        digest email + 不要 push permission · 修改任一 commitment 需 30 天前{" "}
        <Link
          href="/changelog"
          className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
        >
          /changelog
        </Link>{" "}
        公告 · 同 NoPushManifest R73 W-D + CadencePulseChip R67 W-C single-
        source brand IP axis。
      </p>
    </aside>
  );
}
