import Link from "next/link";
import { COMMIT_SHA, COMMIT_PERMALINK } from "@/lib/build-meta";
import { getFinalizedMatches, matches } from "@/lib/matches";

// ── ZONE 27 · Credential Stack ────────────────────────
// R63 W-C · Agent 5 SHIP #3 · Cameron Grove(pitchingbot.com)+ Travis
// Sawchik(travissawchik.substack.com)indie analyst portfolio pattern ·
// 3-credential stacked block · founder above-fold visibility · 「demonstrated
// impact over sales language」 axiom。
//
// Per Agent 5 6-dimension gap matrix · ZONE 27 biggest weakness =
// 「external validation」 · 「Tim is invisible in first viewport of /founders」
// · 「indie analyst monetization ALWAYS leads with the human + their public
// proof artifacts」。
//
// ZONE 27 doesn't have institutional credentials(no MLB front office · no
// Cleveland Guardians consulting · no Durham astrophysics)。 但有 verifiable
// public artifacts + real solo-founder context · stack them honestly:
//
//   #1 · ENGINE · v0.2 LIVE · BUILD {sha}(verifiable commit link to GitHub)
//   #2 · PUBLIC ARTIFACTS · /methodology + /audit + /track-record(clickable)
//   #3 · FOUNDER · TIM · 恆美攝影 × 伶 Kopi(real photography brand)·
//        CPBL fan 27 yr · solo + 0 outside investors(per /audit DISCLOSURE)
//
// Brand IP fit:
//   - [[feedback-zone27-pratfall-brand-ip]] · 不裝 institutional cred · 公開
//     列「solo + 0 investors」 · costly signal that「we have no PR firm」
//   - [[zone27-disclosure-philosophy]] · 每個 credential clickable to artifact
//     · 訪客自己 verify · 不靠 testimonial
//   - [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan 27 yr 是
//     audience-fans grammar(not「sabermetric certification」)· 認同 not
//     authority
//
// Insertion · /founders 中間(SHADOWLESS RUN 後 · DIRECTLY FROM TIM 前)·
// trust establishment 在 founder voice 之前。 Reusable elsewhere as needed。
// ─────────────────────────────────────────────────────

export default function CredentialStack() {
  const finalizedCount = getFinalizedMatches().length;
  const ingestedCount = matches.length;

  return (
    <div className="mt-7 sm:mt-9 max-w-xl mx-auto">
      <p
        lang="en"
        className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4 text-center"
      >
        / 3 CREDENTIALS · 訪客自己 verify(不靠 testimonial)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* #1 · ENGINE BUILD · verifiable commit link */}
        <div className="border border-line/60 bg-slate/30 p-3 sm:p-4">
          <p
            lang="en"
            className="font-mono text-mute text-[9px] tracking-[0.3em] mb-2"
          >
            / 01 · ENGINE
          </p>
          <p className="font-mono text-bone text-[13px] sm:text-sm leading-snug">
            v0.2 LIVE
          </p>
          <p className="font-mono text-mute/85 text-[11px] tracking-[0.15em] mt-1 tabular">
            BUILD{" "}
            <a
              href={COMMIT_PERMALINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
            >
              {COMMIT_SHA}
            </a>
          </p>
          <p className="font-mono text-mute/65 text-[10px] tracking-[0.2em] mt-2">
            N={finalizedCount} receipts · {ingestedCount} ingested
          </p>
        </div>
        {/* #2 · PUBLIC ARTIFACTS · clickable trust artifacts */}
        <div className="border border-line/60 bg-slate/30 p-3 sm:p-4">
          <p
            lang="en"
            className="font-mono text-mute text-[9px] tracking-[0.3em] mb-2"
          >
            / 02 · ARTIFACTS
          </p>
          <p className="font-mono text-bone text-[13px] sm:text-sm leading-snug">
            5 trust docs
          </p>
          <ul className="font-mono text-[11px] tracking-[0.15em] mt-1 leading-relaxed space-y-0.5">
            <li>
              <Link
                href="/methodology"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /methodology
              </Link>
            </li>
            <li>
              <Link
                href="/audit"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /audit
              </Link>
            </li>
            <li>
              <Link
                href="/track-record"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /track-record
              </Link>
            </li>
            <li>
              <Link
                href="/transparency"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /transparency
              </Link>
            </li>
          </ul>
        </div>
        {/* #3 · FOUNDER · honest solo-context */}
        <div className="border border-line/60 bg-slate/30 p-3 sm:p-4">
          <p
            lang="en"
            className="font-mono text-mute text-[9px] tracking-[0.3em] mb-2"
          >
            / 03 · FOUNDER
          </p>
          <p className="font-mono text-bone text-[13px] sm:text-sm leading-snug">
            TIM · solo
          </p>
          <p className="text-mute/85 text-[11px] leading-relaxed mt-1">
            恆美攝影 × 伶 Kopi 創辦人 · CPBL fan 27 yr · 100% solo equity · 0
            outside investors · 0 sponsors · 0 PR firm
          </p>
          <p className="font-mono text-mute/65 text-[10px] tracking-[0.2em] mt-2">
            per{" "}
            <Link
              href="/audit#disclosure"
              className="text-gold/70 hover:text-gold underline-offset-4 hover:underline"
            >
              /audit DISCLOSURE
            </Link>
          </p>
        </div>
      </div>
      <p className="mt-3 text-center font-mono text-mute/65 text-[10px] tracking-[0.25em] leading-relaxed">
        ▸ per Cameron Grove + Travis Sawchik indie analyst portfolio pattern ·
        「demonstrated impact over sales language」 axiom · 不裝 institutional
        cred · 不藏 solo-founder reality
      </p>
    </div>
  );
}
