import Link from "next/link";

// ── ZONE 27 · Multi-Year Anchor ─────────────────────────
// R75 W-D · Agent A R75 SHIP 2 ★★★★★ · FanGraphs 3-year tier solo-founder
// durability signal + Patek Philippe "Generations" 1996 campaign + Stratechery
// cadence-promise discipline · 3-year founder pre-commitment shelf · NOT a
// payment tier · 是 durability statement。 Costly Signaling 100× per Spence
// 1973 · publish multi-year promise BEFORE payment infra is ready · 違反 =
// brand 信用 collapse 永久 audit trail。
//
// The mechanic:
//   - SaaS subscriptions decay trust via auto-renew + price hike pattern
//   - Patek/Berkshire signal durability via 60-200 year continuity statements
//   - FanGraphs publishes 3-year tier($200)· solo-founder credibility moat
//   - ZONE 27 doesn't need payment-tier · just NEEDS the durability statement
//     PUBLISHED before being asked to honor it
//
// Three binding lines:
//   01 · engine FREE through 2029-12-31(per /pricing/why §02 「engine FREE
//        forever」 axiom 多年 commitment 物理 codify)
//   02 · /audit + /methodology + /track-record NEVER paywalled(disclosure
//        philosophy axis extended into multi-year commitment)
//   03 · 若 Tim 失蹤 30+ days · GitHub repo open-sources within 30 days per
//        /ethics #03 + BUS_FACTOR contingency · Pinboard/Patek solo-founder
//        honesty pattern
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · multi-year publish IS the
//     costly signal · 不藏 future commitment
//   - per [[feedback-zone27-pratfall-brand-ip]] · row 03 publishes-weakness
//     (Tim mortality risk explicit)· Aronson 1966 Pratfall pattern
//   - per [[zone27-monetization-philosophy]] · engine FREE forever 軸線
//     物理延伸 to 2029-12-31 dated cliff(violators = revert)
//   - per /audit S05 PRE-COMMIT clause · 修改任一 row 需 30 天前 /changelog
//     公告 · same append-only Costly Signaling discipline as
//     ENGINE_DIFF_BEACONS R71 W-C + NO_PUSH_INVENTORY R73 W-D + RECIPROCITY_
//     LEDGER R74 W-A + LOCAL_STORAGE_INVENTORY R74 W-D pattern
//
// 不做 anti-pattern:
//   ✕ NO「lock-in pricing」 framing(brand IP 不靠 lock-in 賺)
//   ✕ NO「subscribe NOW before price hike」(11-NEVER #5 live FOMO redline)
//   ✕ NO「3-year trust badge」 with seal icons(violates 不打擾就是禮物)
//   ✕ NO「join future Founders」 vanity counter
//
// Inspiration sources(per Agent A R75 SHIP 2 spec):
//   - FanGraphs Membership($200/3yr 多年 tier · solo-founder credibility)
//   - Patek Philippe "Generations" 1996 campaign(60-year continuity)
//   - Berkshire 1965-2025 annual letter publish discipline(60 years cadence)
//   - Pinboard.in 17-year solo continuity(public retention disclosure)
//   - Tarsnap 18-year solo invite-only cryptographic provability
// ─────────────────────────────────────────────────────

export default function MultiYearAnchor() {
  const currentYear = new Date().getFullYear();
  const commitmentYear = 2029;
  const yearsAhead = commitmentYear - currentYear;

  return (
    <section
      aria-label="Multi-Year Anchor · 3-line solo-founder durability statement · engine FREE through 2029 · open-source contingency"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-10"
    >
      <div className="border border-gold/40 bg-slate/30 p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em]"
          >
            ⚓ MULTI-YEAR ANCHOR · {yearsAhead}-YEAR PRE-COMMITMENT
          </p>
          <p
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em] tabular"
          >
            SIGNED · TIM · {currentYear}
          </p>
        </div>

        <h3 className="text-bone text-lg sm:text-xl font-light tracking-tight mb-4">
          Tim 親手{" "}
          <span className="text-gold">{yearsAhead} 年 pre-commitment</span> · 不
          payment-tier · 是 durability statement
        </h3>

        <ol className="space-y-3.5 text-mute text-sm sm:text-base leading-relaxed">
          <li className="flex gap-3 sm:gap-4 items-baseline">
            <span
              lang="en"
              className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
            >
              01
            </span>
            <span className="flex-1">
              <strong className="text-bone">
                ENGINE FREE 持續到 {commitmentYear}-12-31
              </strong>
              {" "}· per{" "}
              <Link
                href="/pricing/why"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /pricing/why
              </Link>{" "}
              「engine FREE forever」 axiom · 多年 commitment 物理 codify ·
              v0.2 + v0.3 + v0.4 全免費 access · 不會在 BLACK CARD 推出後
              退化為 paywall · 違反 = brand 信用 collapse 永久 audit trail。
            </span>
          </li>

          <li className="flex gap-3 sm:gap-4 items-baseline">
            <span
              lang="en"
              className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
            >
              02
            </span>
            <span className="flex-1">
              <strong className="text-bone">
                /audit + /methodology + /track-record 永不 paywall
              </strong>
              {" "}· 同 commitment 軸線 · disclosure philosophy 物理延伸 ·
              無論 BLACK CARD 或 Founders 27 訂閱 · trust artifacts 永遠
              全 visitor 可讀 · GitHub source MIT licensed forever · 不可
              retroactively revoke。
            </span>
          </li>

          <li className="flex gap-3 sm:gap-4 items-baseline">
            <span
              lang="en"
              className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
            >
              03
            </span>
            <span className="flex-1">
              <strong className="text-bone">
                Tim 失蹤 30+ days · GitHub repo open-sources within 30 days
              </strong>
              {" "}· per{" "}
              <Link
                href="/ethics#bus-factor"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /ethics BUS_FACTOR
              </Link>{" "}
              + /privacy Section 6B executor 接管 protocol · Tim 配偶 + 2
              兄弟姊妹 executor · Pinboard/Patek/Berkshire solo-founder
              honesty pattern · Aronson Pratfall 物理 codify。
            </span>
          </li>
        </ol>

        <p className="mt-5 pt-4 border-t border-line/40 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
          ⚓ Per /audit S05 PRE-COMMIT clause · 上 3 條 binding rule · 修改
          任一 row 需 30 天前{" "}
          <Link
            href="/changelog"
            className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
          >
            /changelog
          </Link>{" "}
          公告 · same append-only Costly Signaling discipline as ENGINE_DIFF_
          BEACONS R71 W-C + NO_PUSH_INVENTORY R73 W-D + RECIPROCITY_LEDGER
          R74 W-A · per Spence 1973 publish-restraint = 100× costly signal。
        </p>

        <p className="mt-3 font-mono text-mute/60 text-[9px] tracking-[0.25em] leading-relaxed">
          ⚓ 對比 FanGraphs $200/3yr tier(solo-founder credibility)+ Patek
          Philippe「Generations」 1996(60-year continuity)+ Berkshire
          1965-2025(60 年 annual letter discipline)· ZONE 27 不 sell
          multi-year tier · ZONE 27 publish multi-year promise · 不收費 ·
          不 lock-in · 是 statement of intent。
        </p>
      </div>
    </section>
  );
}
