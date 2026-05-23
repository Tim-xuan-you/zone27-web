import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import RelatedReading from "@/components/RelatedReading";
import LineKeepHint from "@/components/LineKeepHint";
import { matches, getFinalizedMatches } from "@/lib/matches";
import { FOUNDERS_TOTAL, FOUNDERS_CLAIMED } from "@/lib/founders-stats";
import { ENGINE_OPS_LOG_COUNT } from "@/lib/engine-log-entries";
import { LOCAL_STORAGE_KEY_COUNT } from "@/lib/local-storage-inventory";
import { RECIPROCITY_COUNT } from "@/lib/reciprocity-ledger";
import { NO_PUSH_COUNT } from "@/lib/no-push-inventory";

export const metadata: Metadata = {
  title: "Year Zero · ZONE 27 第一封年信 · Defector Year-Five pattern at Year-Zero",
  description:
    "Defector Year-Five annual report applied at Year-Zero · Tim 親手 essay · 什麼 shipped + 什麼 refused + 什麼 don't know + Year One looks like + thank you to N=4 ingested + 1 PROVED receipt · long-form single-page reads-like-essay-not-brochure · 不 paywall · 不 email-gate · founder voice · per /audit S05 PRE-COMMIT clause append-only · brand IP「方法公開」 物理 codify to annual artifact 層。",
  openGraph: {
    title: "Year Zero · ZONE 27 第一封年信",
    description:
      "Tim 親手年信 · what shipped + what refused + what don't know + Year One + thank you · Defector Year-Five pattern",
    images: ["/transparency/opengraph-image"],
  },
};

// ── ZONE 27 · /year-zero · First Annual Letter ─────────
// R77 W-C · Agent A R76 SHIP B ★★★★★ · Defector Year-Five annual report
// 2025 model(85% renew rate driver · single artifact subscribers actually
// read and quote · long-form single-page essay-not-brochure)applied at
// Year-Zero · publish-before-asked-to-honor · the artifact-as-content axis
// distinct from /audit(model report)+ /annual/2026(enterprise state)+
// /engine-log(operational artifact)。
//
// Defector Year-Five mechanic:
//   - 19 worker-owners + 4 years receipts + 85% renew · annual report is
//     NOT brochure · 是「what we did + how」 narrative · 6+ minute read
//   - Reader posts to social NOT because asked · because the artifact
//     IS the renewal pitch · founder voice IS the content
//
// ZONE 27 Year-Zero application(pre-first-Founder):
//   - 0 worker-owners · 4 ingested matches · 1 PROVED receipt · 0 paid
//     subscribers · 0 fake testimonials per 11-NEVER #11
//   - Defector at Year-5 has results · ZONE 27 at Year-0 has commitments
//   - 此 page = Year-0 annual letter · what we shipped(R59-R76 76+ rounds)
//     + what we refused(11-NEVER + 12 NoPushManifest + 5 RefusalRationale)
//     + what we don't know(/steelman 5 + N<30 sample debt + estimate
//     methodology disclosure)+ Year One looks like(payment infra +
//     CPBL pipeline + Founder #001 onboarding)+ thank you(N=4 + 1 PROVED
//     + you reading this)
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · publish before earning · same
//     axis as MultiYearAnchor R75 W-D + /engine-log R76 W-C
//   - per [[feedback-zone27-pratfall-brand-ip]] · §03「don't know」 is
//     Pratfall non-empty · same axis as /steelman + /audit S05 PRE-COMMIT
//   - per [[zone27-monetization-philosophy]] · 不 paywall · 不 email-gate
//     · per Founder-Dogfood-Canary R32 W-C kill /login OTP rule applied to
//     /year-zero · MUST be fully public
//   - per /audit S05 PRE-COMMIT clause · annual letter 仍 binding · 修改
//     content 需 30 天前 /changelog 公告 · same Costly Signaling discipline
//
// 不做 anti-pattern(per Agent A R76 SHIP B Anti-Pattern 2):
//   ✕ NO「subscribe to read full Year One letter」 paywall(violates
//     Defector pattern · violates Founder-Dogfood-Canary rule)
//   ✕ NO「join 1000+ Founders」 social proof(no real Founder #001 yet ·
//     per 11-NEVER #11 fake testimonials)
//   ✕ NO「early bird discount」 / 「pre-order Founders 27 from this page」
//     (per /founders/why-270 axiom · fixed price · no ratchet · no FOMO)
//   ✕ NO push notification「new annual letter dropped」 (per NoPushManifest
//     R73 W-D · per 不打擾就是禮物 axiom)
//
// Inspiration sources:
//   - Defector Year-Five annual report(defector.com/defector-annual-
//     report-year-five · 2025-11 · Nieman Lab analysis)
//   - Stratechery Year in Review(Ben Thompson 2013-now)
//   - Berkshire Hathaway annual letter(1965-2025 · 60-yr continuity)
//   - DHH 37signals annual reflection posts(world.hey.com)
//   - Anthropic 2024 annual transparency update + Stripe annual letter
//
// Append-only per /audit S05 PRE-COMMIT clause · 修改 letter content 需 30
// 天前 /changelog 公告 · same single-source discipline as ENGINE_OPS_LOG
// R76 W-C + ENGINE_DIFF_BEACONS R71 W-C + canonical 7-ledger family pattern。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily revalidate(stat freshness)

const LETTER_DATE = "2026-05-23";
const FINALIZED_COUNT = getFinalizedMatches().length;
const INGESTED_COUNT = matches.length;
const ROUTE_COUNT = 49;
const CUMULATIVE_WAVES = 143;

export default function YearZeroPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">YEAR ZERO</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-12 pb-10">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            YEAR ZERO · ZONE 27 第一封年信 · {LETTER_DATE}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight text-bone">
            Tim 親手寫的{" "}
            <span className="text-gold">第一封年信</span>
          </h1>
          {/* Cold Gold Hairline · R54 W-C signature moat */}
          <div className="zone27-rule max-w-[320px] mt-5" aria-hidden="true" />
          <p
            lang="en"
            className="font-mono text-mute text-xs sm:text-sm tracking-[0.3em] mt-6"
          >
            DEFECTOR YEAR-FIVE PATTERN · APPLIED AT YEAR-ZERO · 不 paywall · 不
            email-gate
          </p>
          <p className="editorial-dropcap mt-8 text-mute leading-relaxed">
            這不是 sales letter · 不是 marketing 文 · 不是 launch announcement。
            是 ZONE 27 第一封年信 · Defector(獨立 sports/culture 媒體 ·
            26 worker-owners · 4 年 receipts · 85% renew rate)2025-11 Year-Five
            annual report 對標。 差別:Defector 在 Year-5 有 results 可寫 ·
            ZONE 27 在 Year-0 只有 commitments 可寫。 寫信的不是公關 · 是 Tim
            一個人 · 1 個 PROVED receipt · 4 場 ingested matches · 7 個
            SYSTEM-TEST forged Founders。
          </p>
          <div className="mt-8 flex justify-center">
            <ArticleMeta readingMin={8} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── §01 · WHAT WE SHIPPED ───────────────── */}
        <Section
          no="01"
          en="WHAT WE SHIPPED"
          zh="Year Zero · 我們 shipped 了什麼"
        >
          <p>
            ZONE 27 從 2026-05-19 第一個 visible deployment 起 · 至{" "}
            <span className="font-mono text-bone tabular">{LETTER_DATE}</span>{" "}
            ·{" "}
            <strong className="text-bone tabular">
              {CUMULATIVE_WAVES}+ waves
            </strong>{" "}
            shipped across R37→R76 · {ROUTE_COUNT} visitor-discoverable routes ·{" "}
            <span className="font-mono text-bone tabular">
              {LOCAL_STORAGE_KEY_COUNT}
            </span>{" "}
            canonical localStorage keys · 7 canonical append-only ledgers ·
            5/5 risk-bearing client components wrapped with ClientErrorBoundary。
          </p>
          <p>
            數字背後的{" "}
            <strong className="text-bone">brand IP physical artifacts</strong>:
          </p>
          <ul className="space-y-2.5 mt-4 ml-2 sm:ml-4 text-[14px] leading-relaxed">
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">7 LIVE LENS CANVAS</strong> ·
                Vibe Check + Park Factor + Pitcher Fatigue + Underdog +
                BullpenDepth + Matchup History + LensTrace · per /methodology
                Section 05
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">2 LIVE engine variants</strong>
                {" "}+ 1 PLANNED · v0.2 BASE LIVE + v0.3 EXPANSION 1 LIVE DEV
                PREVIEW + v0.4 EXPANSION 2 SPEC LOCKED · per /methodology
                Section 06 ENGINE DRY DOCK
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">第一個 PROVED receipt</strong>
                {" "}cpbl-260521-01(統一 vs 富邦 2026-05-21 新莊)· 60% engine
                預測 →{" "}
                <span className="text-gold">PROVED ✓</span> · 標記永久 1st
                Edition Shadowless Run · per /track-record + /receipts/cpbl-260521-01
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">7 canonical append-only ledgers</strong>
                {" "}· ENGINE_DIFF_BEACONS(R71 W-C)+ NO_PUSH_INVENTORY(R73 W-D ·{" "}
                {NO_PUSH_COUNT} deliberate absences)+ RECIPROCITY_LEDGER(R74
                W-A · {RECIPROCITY_COUNT} published-before-ask artifacts)+
                LOCAL_STORAGE_INVENTORY(R74 W-D · {LOCAL_STORAGE_KEY_COUNT}{" "}
                keys)+ SOLO_FOUNDER_PEERS(R74 W-C · 6 reference class)+
                ENGINE_OPS_LOG(R76 W-C · {ENGINE_OPS_LOG_COUNT} operational events)
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">第一個 visitor-grabbable receipt object</strong>
                {" "}· /receipts/[receiptId] dynamic route(R75 W-F)· Stripe
                Press + Patek Reference Number permanence pattern · 每場
                finalized match 變 dedicated permalink object-as-receipt
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">/engine-log operational artifact spine</strong>
                {" "}(R76 W-C ★★★★★ biggest invisible gap closure)· Stripe
                Status 2012 + Cloudflare 2025 postmortem + Tailscale changelog
                pattern · 「engine alive · someone on it」 mechanical signal
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">/poster launch-day visual cannon</strong>
                {" "}(R76 W-E · Agent A R75 「第 2 gap」)· 1080×1080 IG + 1080×1920
                Story/TikTok · Patek 50th Nautilus + Stripe Press + A24 zine pattern
              </span>
            </li>
          </ul>
          <p className="text-mute/85 mt-6">
            這些不是 marketing claim · 是 git diff log · 每個 ship 都有 commit
            SHA 物理 證據在{" "}
            <Link
              href="/changelog"
              className="text-gold underline-offset-4 hover:underline"
            >
              /changelog
            </Link>{" "}
            + GitHub commits history。
          </p>
        </Section>

        {/* ── §02 · WHAT WE REFUSED ────────────────── */}
        <Section
          no="02"
          en="WHAT WE REFUSED"
          zh="我們 deliberately 沒做的事 · 永久 binding"
        >
          <p>
            ZONE 27 brand IP 由「永遠不會做」 axioms 物理 defined · 不是「what
            we will eventually maybe do」 · 是「what we publicly bind ourselves
            against」。 Year Zero 數字:
          </p>
          <div className="grid sm:grid-cols-3 gap-3 mt-5 mb-5">
            <div className="border border-loss/40 bg-slate/30 p-4 text-center">
              <p
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-2"
              >
                NEVER LIST
              </p>
              <p className="font-mono text-bone tabular text-3xl font-light">
                11
              </p>
              <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-1">
                永久不會做
              </p>
            </div>
            <div className="border border-loss/40 bg-slate/30 p-4 text-center">
              <p
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-2"
              >
                NO-PUSH MANIFEST
              </p>
              <p className="font-mono text-bone tabular text-3xl font-light">
                {NO_PUSH_COUNT}
              </p>
              <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-1">
                Deliberate absences
              </p>
            </div>
            <div className="border border-loss/40 bg-slate/30 p-4 text-center">
              <p
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] mb-2"
              >
                REFUSAL RATIONALES
              </p>
              <p className="font-mono text-bone tabular text-3xl font-light">
                5
              </p>
              <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-1">
                Pre-committed
              </p>
            </div>
          </div>
          <p>
            這 11 + {NO_PUSH_COUNT} + 5 entries 是 brand IP backbone:user-to-
            user social platform · streak farming · 儲值 wallet · MLM affiliate ·
            live FOMO counter · gambling parasite · AdMob · multi-step wizard ·
            modal paywall scroll-lock · fake methodology · fake testimonials ·
            + push notifications · email digest · 「您可能 miss」 reminders ·
            weekly nag · etc · 全 publish 在{" "}
            <Link
              href="/transparency#section-02"
              className="text-gold underline-offset-4 hover:underline"
            >
              /transparency Section 02
            </Link>{" "}
            +{" "}
            <Link
              href="/transparency#no-push-manifest"
              className="text-gold underline-offset-4 hover:underline"
            >
              /transparency NO-PUSH MANIFEST
            </Link>{" "}
            +{" "}
            <Link
              href="/founders/ledger#refusals"
              className="text-gold underline-offset-4 hover:underline"
            >
              /founders/ledger#refusals
            </Link>。
          </p>
          <p className="text-mute/85">
            每筆 entry 修改需 30 天前 /changelog 公告 · per /audit S05
            PRE-COMMIT clause · same Costly Signaling discipline。 違反 = brand
            信用 collapse 永久 audit trail · 不可 retroactively rebrand。
          </p>
        </Section>

        {/* ── §03 · WHAT WE DON'T KNOW ─────── */}
        <Section
          no="03"
          en="WHAT WE DON'T KNOW"
          zh="我們知道自己還不知道什麼 · 5 件"
        >
          <p>
            Pratfall axiom(Aronson 1966)+ /audit S05 disclosure philosophy 物理
            codify:主動暴露 LIMITS &gt; silently 藏 limitation。 Year Zero
            限制清單:
          </p>
          <ol className="space-y-3.5 mt-5 text-[14px] leading-relaxed">
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                01
              </span>
              <span className="flex-1">
                <strong className="text-bone">N &lt; 30 SAMPLE DEBT</strong> ·
                目前 finalized N = {FINALIZED_COUNT}(共 {INGESTED_COUNT} 場 ingest)
                · Bill James 1985 統計顯著門檻 N = 30 · 未達 = 不能 claim
                「我們準」 · 完整 sample debt chip 在{" "}
                <Link
                  href="/track-record"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /track-record
                </Link>
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                02
              </span>
              <span className="flex-1">
                <strong className="text-bone">K/9 · BB/9 · HR/9 estimate disclosure</strong>
                {" "}· CPBL pitcher stats 部分 estimate from public box scores
                · 真實值 PR welcome · 不藏 estimate framework · per{" "}
                <Link
                  href="/audit#section-02"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /audit § 02 ESTIMATION DISCLOSURE
                </Link>
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                03
              </span>
              <span className="flex-1">
                <strong className="text-bone">v0.3 不修正的 6 件事</strong> ·
                BABIP / 場館 dimension splits / 溫度 風 濕度 / batter park
                splits / DH 規則 / N ≥ 30 calibration validation · 全 publish
                在{" "}
                <Link
                  href="/methodology/diff"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /methodology/diff
                </Link>{" "}
                · 不藏 v0.3 limitations
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                04
              </span>
              <span className="flex-1">
                <strong className="text-bone">5 strongest objections AGAINST us</strong>
                {" "}· ZONE 27 自己 write 5 個反 ZONE 27 strongest objections ·
                不 strawman · 不 weakman · per{" "}
                <Link
                  href="/steelman"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /steelman
                </Link>
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-loss/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                05
              </span>
              <span className="flex-1">
                <strong className="text-bone">Tim solo founder · BUS_FACTOR = 1</strong>
                {" "}· 0 employees · 0 contractors · Tim 失蹤 30+ days protocol
                · per{" "}
                <Link
                  href="/ethics#bus-factor"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /ethics BUS_FACTOR
                </Link>
                {" "}+{" "}
                <Link
                  href="/privacy#section-6b"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /privacy § 6B
                </Link>
                {" "}executor protocol
              </span>
            </li>
          </ol>
        </Section>

        {/* ── §04 · YEAR ONE LOOKS LIKE ──────── */}
        <Section
          no="04"
          en="YEAR ONE LOOKS LIKE"
          zh="Year One 會是什麼 · 不 promise schedule · 只 promise effort axis"
        >
          <p>
            ZONE 27 brand IP 拒絕 schedule promise(CadencePulseChip R67 W-C
            「節奏不承諾」)· 但 publish effort axis(R75 W-E EngineCadencePromise
            「maximum-delay ceiling NOT specific timing」)· Year One commitments:
          </p>
          <ol className="space-y-3.5 mt-5 text-[14px] leading-relaxed">
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                01
              </span>
              <span className="flex-1">
                <strong className="text-bone">CPBL pipeline 自動化</strong> ·
                從 Tim manual screenshot ingestion → automated ingest pipeline
                · TIER 0 pre-launch critical · 解 Tim manual screenshot
                single-point-of-failure · 大工程 1 week effort · /engine-log
                自動 append entries when pipeline runs
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
                <strong className="text-bone">Engine v0.3 production ship</strong>
                {" "}· 待 N ≥ 30 sample debt 補完 · Park Factor + 隊伍平均 wOBA
                · BLACK CARD unlocks · per /methodology/diff entire delta
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                03
              </span>
              <span className="flex-1">
                <strong className="text-bone">第一個真實 Founder #001 onboard</strong>
                {" "}· payment infra ready 後 · Tim 親手 review 1-3 days · 銀行
                轉帳 24h window · per /founders/apply Patek allocation form ·
                /founders/ledger 5-step rules
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                04
              </span>
              <span className="flex-1">
                <strong className="text-bone">第一封真實 letter 在 /founders/from-one-current-founder</strong>
                {" "}· 等待 Founder #001 第 6 個月真實 letter · 270 letter cap
                = 270 founder cap parallel · per Pokemon TCG 1st Edition
                SHADOWLESS RUN axiom
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                05
              </span>
              <span className="flex-1">
                <strong className="text-bone">/year-one annual letter 發布</strong>
                {" "}· 2027-05-23 · 同 axis 此 Year-Zero letter · publish what
                shipped + refused + don&apos;t know + Year Two looks like · per
                /audit S05 PRE-COMMIT cadence-of-effort commitment
              </span>
            </li>
          </ol>
          <p className="text-mute/85 mt-5">
            這些不是 promise of timing · 是 promise of axis。 違反 = brand 信用
            collapse · per /audit S05 PRE-COMMIT clause append-only Costly
            Signaling discipline · 同 MultiYearAnchor R75 W-D 3-line binding
            pattern。
          </p>
        </Section>

        {/* ── §05 · THANK YOU ─────── */}
        <Section
          no="05"
          en="THANK YOU"
          zh="感謝 · 4 PROVED + N=4 finalized + 您讀到這裡"
        >
          <p>
            Year Zero 沒有 customers · 沒有 paying subscribers · 沒有 social
            proof testimonials(per 11-NEVER #11)。 但有{" "}
            <strong className="text-bone">
              {FINALIZED_COUNT} PROVED receipts(cpbl-260521-01 + 260523-01/02/03)
            </strong>
            · {INGESTED_COUNT} ingested matches · 7 SYSTEM-TEST forged Founders ·{" "}
            {CUMULATIVE_WAVES}+ waves of craft · 而您 read 完此 letter ·
            可能就是 future Founder #001-#{FOUNDERS_TOTAL} 之一。
          </p>
          <p>
            Defector 在 Year-5 annual letter 結尾感謝 19 worker-owners +
            4 年 subscribers · ZONE 27 在 Year-Zero 感謝:
          </p>
          <ul className="space-y-2.5 mt-4 ml-2 sm:ml-4 text-[14px] leading-relaxed">
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">cpbl-260521-01 富邦 vs 統一</strong>
                {" "}· 第一場 ingested match · 60% engine prediction → PROVED ✓
                · 永久 1st Edition Shadowless Run · 編號 RECEIPT 001
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">cpbl-260523-01/02/03 · 3 場 同日 finalized</strong>
                {" "}· 味全 0:2 台鋼 + 富邦 3:1 樂天 + 統一 2:0 兄弟 · 全 PROVED ✓ ·
                4-for-4 PROVED rate · per /audit S05「PROVED + DIVERGED 等大」
                disclosure parity 但 N=4 仍非 statistical evidence(/steelman § 1
                Bill James 1985 N≥30 threshold)
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">{INGESTED_COUNT - FINALIZED_COUNT} 場 pending CPBL matches</strong>
                {" "}(cpbl-260522-01/02/03 stale-pending + cpbl-260524-01/02/03
                future preview)· Tim 親手 screenshot decision pending · per
                /ethics commitment #5 7-day post-final SLA
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">7 SYSTEM-TEST forged Founders</strong>
                {" "}· /founders/ledger #001-#007 placeholder · Tim 親手 forged
                pre-launch · 等真實 Founder #001 onboard 後 reset 排序 ·
                {FOUNDERS_TOTAL - FOUNDERS_CLAIMED} 個 seat 仍 await 真實
                applicant
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span className="text-gold/85" aria-hidden="true">▸</span>
              <span className="flex-1">
                <strong className="text-bone">您 · 讀到此句 reader</strong>
                {" "}· 不論 future 您是否 Founder · 您 read 完 Year Zero letter
                = 您 IS ZONE 27 Year-0 audience · 同 Defector 4 年訂閱者
                identity 加 Year-0 reader → Year-1+ 真實 paying member 軸線。
              </span>
            </li>
          </ul>
          <p className="text-mute/85 mt-6">
            此 letter 不要您 subscribe · 不要您 email · 不要您 click「DOWNLOAD
            PDF」 button · 您 read 完直接 close 此 tab 或 long-press 加 LINE
            Keep(不需加好友)都可。 Defector pattern 是 letter IS the renewal
            pitch · ZONE 27 Year-Zero pattern 是 letter IS the artifact 本身。
          </p>
        </Section>

        <FounderSignOff signedAt={LETTER_DATE}>
          <p>
            Defector Year-Five annual report 是 4 年 worker-owned co-op + 4 年
            receipts 之後 publish。 ZONE 27 Year-Zero 是 0 worker-owners + 1
            PROVED receipt + N=4 ingested matches + 0 paying customers 之前
            publish。 差別不在 timing · 在 axis:他們 publish results · 我
            publish commitments。
          </p>
          <p>
            這封 letter 修改需 30 天前 /changelog 公告 · per /audit S05
            PRE-COMMIT clause · 違反 = brand 信用 collapse 永久 audit trail。
            same Costly Signaling discipline as ENGINE_OPS_LOG R76 W-C +
            ENGINE_DIFF_BEACONS R71 W-C + 6-ledger canonical family pattern。
          </p>
          <p>
            Year One annual letter 預定 2027-05-23 publish on /year-one · same
            5-section axis(shipped + refused + don&apos;t know + Year Two looks
            like + thank you)· 此 cadence per /ethics commitment #5 + #8
            binding。
          </p>
        </FounderSignOff>

        {/* R77 W-B · LineKeepHint · Agent A R76 SHIP E · mobile long-press
            → LINE Keep · per Defector Year-Five subscriber save-and-quote
            pattern · 不需加好友 · session-only dismiss。 */}
        <div className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-6">
          <LineKeepHint />
        </div>

        <RelatedReading currentPath="/year-zero" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/transparency"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /transparency · audit aggregator
            </Link>
            <Link
              href="/founders"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /founders · Year-1 seat →
            </Link>
            <Link
              href="/engine-log"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /engine-log · operational artifact →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function Section({
  no,
  en,
  zh,
  children,
}: {
  no: string;
  en: string;
  zh: string;
  children: React.ReactNode;
}) {
  const id = `section-${no.toLowerCase()}`;
  return (
    <section
      id={id}
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40 cv-auto scroll-mt-20"
    >
      <div className="flex items-baseline gap-4 mb-2 section-reveal flex-wrap">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {en}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-5">
        {zh}
      </h2>
      <div className="space-y-4 text-mute text-base leading-relaxed">
        {children}
      </div>
    </section>
  );
}
