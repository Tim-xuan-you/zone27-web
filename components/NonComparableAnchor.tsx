import Link from "next/link";
import { SOLO_FOUNDER_PEERS, SOLO_FOUNDER_PEERS_COUNT } from "@/lib/solo-founder-anchor";

// ── ZONE 27 · Non-Comparable Anchor ─────────────────────
// R74 W-C · Agent A R73 SHIP 4 · Samuelson & Zeckhauser Status Quo Bias
// (1988)· counter the default「SaaS-with-team」 comparison frame · anchor
// ZONE 27 against solo-durable-premium-indie reference class · not SaaS。
//
// Placement: /founders BETWEEN PreTransferReceipt(R68 W-G handshake choreo)
// AND WaitlistForm · so visitor reads:
//   1. Hero(offer)
//   2. PreTransferReceipt(what happens AFTER click · handshake)
//   3. NonComparableAnchor(reference class anchor · 「we're solo durable
//      indie · NOT SaaS · here are the 6 peers we anchor against」)
//   4. WaitlistForm(form)
//
// brand IP fit:
//   - per [[feedback-zone27-pratfall-brand-ip]] · publish-the-category-mismatch
//   - per [[zone27-disclosure-philosophy]] · publish our reference class
//     while competitors hide theirs
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan audience
//     recognizes solo-voice IS the differential
//   - per [[feedback-zone27-mobile-first]] · 6-row tight typography ·
//     mobile-readable · ≤ 1 viewport
//
// 不做 anti-pattern:
//   ✕ NO「we're better than Stripe」 direct competitor framing
//   ✕ NO specific user count claims for peers(we don't own those numbers)
//   ✕ NO「join the indie movement」 community framing(redline)
//   ✕ NO 「Look how lonely indie founders are」 hagiography
// ─────────────────────────────────────────────────────

export default function NonComparableAnchor() {
  return (
    <section
      aria-label="Non-comparable anchor · 6 solo-durable-indie peers · Samuelson/Zeckhauser Status Quo Bias counter"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 pt-2"
    >
      <div className="border-l-2 border-gold/60 pl-5 sm:pl-6 py-2">
        <div className="flex items-baseline gap-3 mb-4 flex-wrap">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em]"
          >
            / NON-COMPARABLE ANCHOR
          </p>
          <p
            lang="en"
            className="font-mono text-mute text-[10px] tracking-[0.3em] tabular"
          >
            {SOLO_FOUNDER_PEERS_COUNT} SOLO-DURABLE PEERS · NOT SAAS
          </p>
        </div>

        <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-snug mb-4">
          您 default 用{" "}
          <span className="text-mute/70 line-through">SaaS-with-team</span>{" "}
          的尺 量 ZONE 27 · {" "}
          <span className="text-gold">不同 reference class</span>
        </h2>

        <p className="text-mute text-base leading-relaxed mb-4">
          訪客 System 1 default reference class for「web subscription」 = Stripe /
          Notion / Linear / Vercel · all team-funded SaaS · 用此尺量 ZONE 27 ·
          Tim 一個人{" "}
          <strong className="text-bone">seems under-resourced 風險高</strong> ·
          這是 Status Quo Bias(Samuelson & Zeckhauser 1988)cognitive trap。
        </p>
        <p className="text-mute text-base leading-relaxed mb-4">
          但 ZONE 27 actual reference class 不是 SaaS · 是{" "}
          <strong className="text-bone">solo-durable-premium indie</strong> ·
          下面 6 個 peers 平均 durable{" "}
          <strong className="text-bone">10-23 年</strong> · 全部 0 VC · 0
          employees · publish-revenue · run by 1 個人。 您 NT$ 2,700 不是 buy
          into「SaaS with smaller team」 · 是 buy into{" "}
          <strong className="text-bone">不同 category 的 unit economics</strong>。
        </p>

        <ol className="mt-7 grid sm:grid-cols-2 gap-3 sm:gap-4">
          {SOLO_FOUNDER_PEERS.map((peer, idx) => (
            <li
              key={idx}
              className="border border-line/50 bg-slate/30 p-4 sm:p-5"
            >
              <div className="flex items-baseline justify-between gap-2 flex-wrap mb-2">
                <p className="text-bone font-light text-base leading-tight">
                  {peer.brand}
                </p>
                <span
                  lang="en"
                  className="font-mono text-gold/80 text-[9px] tracking-[0.25em] tabular"
                >
                  SINCE {peer.since}
                </span>
              </div>
              <p
                lang="en"
                className="font-mono text-mute/70 text-[10px] tracking-[0.22em] mb-2"
              >
                {peer.founder} · {peer.category}
              </p>
              <p className="text-mute/85 text-[12px] leading-relaxed mb-2">
                <strong className="text-bone">{peer.pricing}</strong>
              </p>
              <p className="text-mute/80 text-[12px] leading-relaxed mb-2.5">
                {peer.anchor}
              </p>
              <a
                href={peer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-gold/85 hover:text-gold text-[9px] tracking-[0.22em] underline-offset-4 hover:underline"
              >
                → {peer.url.replace(/^https?:\/\//, "")}
              </a>
            </li>
          ))}
        </ol>

        <p className="text-mute/85 text-sm sm:text-base leading-relaxed mt-7">
          ZONE 27 與這 {SOLO_FOUNDER_PEERS_COUNT} 個 peers 的{" "}
          <strong className="text-bone">unit economics 同 axis</strong> · 不是
          「SaaS minus team」 · 是 sustainability-not-growth + 1-author-voice
          + craft-not-headcount-leverage 的 category。 hardcore CPBL fan audience
          燒於 LINE 老師 / 報馬仔 不可能 publish 同 page · 因為它們{" "}
          <strong className="text-bone">結構性不存在 reference class</strong>{" "}
          · 它們是 ad-broker · 不是 product。
        </p>

        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mt-6 leading-relaxed">
          ⚓ 6 peers 是 reference class anchor · 不是 hero worship · 不是「join
          the indie movement」 community framing · 不是直接 competitor benchmark。
          ZONE 27 brand IP{" "}
          <strong className="text-bone">「不 ship user-to-user social」</strong>{" "}
          redline · 我們只是公開 reference class · per /audit S05 PRE-COMMIT
          clause · 修改此 peer list 需 30 天 /changelog 公告。
        </p>
        {/* R74 W-G · M3 fix · internal cross-link tail · visitor 看完 6 peers
            想 verify「ZONE 27 確 fit this category」 · 提供 path 到 /about
            Chapter 07 OPERATIONS(Tim solo workflow + cadence)+ /audit
            disclosure block(enterprise position 8 facts)· 不 leave 訪客 dead-
            end paragraph · 同 RelatedReading axis 但 inline at decision-moment。 */}
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mt-3 leading-relaxed flex items-baseline gap-3 flex-wrap">
          <span aria-hidden="true">→</span>
          <Link
            href="/about#operations"
            className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
          >
            /about Chapter 07 OPERATIONS · Tim solo workflow + cadence
          </Link>
          <span className="text-mute/50">·</span>
          <Link
            href="/audit#disclosure"
            className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
          >
            /audit DISCLOSURE block · 8 enterprise facts
          </Link>
        </p>
      </div>
    </section>
  );
}
