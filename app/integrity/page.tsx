import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";

export const metadata: Metadata = {
  title: "Integrity · 19 永久不會變的 · ZONE 27 Owner's Manual at Year 0",
  description:
    "Berkshire Hathaway 1996 Owner's Manual Buffett published and never changed · applied to ZONE 27 at Year 0 · single canonical proof page · 11 brand-IP redlines「永遠不做」 + 8 binding ethics commitments = 19 永久 binding rules · dated · Tim signature · per /audit S05 PRE-COMMIT clause · violations trigger /receipts entry · public bond not implicit · 為 years 2-5 brand consistency 物理 codify。",
  openGraph: {
    title: "Integrity · ZONE 27 永久不會變的 19 條",
    description:
      "Berkshire 1996 Owner's Manual pattern · 11 redlines + 8 ethics = 19 永久 binding · public bond not implicit",
    images: ["/transparency/opengraph-image"],
  },
};

// ── ZONE 27 · /integrity · Owner's Manual at Year 0 ────
// R78 W-F-3 · Agent A R78「fourth-pass biggest gap」 honest answer ·
// Berkshire Hathaway 1996 Owner's Manual model(Buffett published one page
// listing「what Berkshire will and will NOT do」 · never changed it ·
// 30 yrs unbroken · public bond not implicit)applied to ZONE 27 at Year 0
// pre-launch · single canonical proof page consolidating:
//   - 11 brand-IP redlines「永遠不做」(from /transparency Section 02 +
//     /audit Section 02 + canonical CLAUDE.md memory)
//   - 8 binding ethics commitments(from /ethics 8 commitments)
//   = 19 永久 binding rules · dated · Tim signature · frozen
//
// The cognitive frame this closes(per Agent A R78 fourth-pass spec):
//   - ZONE 27 currently has 11 redlines + 8 ethics scattered across
//     /audit /methodology /receipts /roadmap /transparency /ethics
//   - Without ONE canonical proof page · every redline is implicit
//   - With this page · every redline is a PUBLIC BOND
//   - Same psychology as Berkshire's 1996「Owner's Manual」 Buffett
//     published and never changed · 30+ years unbroken
//   - The moment fans suspect ZONE 27 might「graduate into」 GA / analytics
//     / social-account / paid-engine after launch · entire Pratfall +
//     costly-signal + Defector-Year-Zero brand collapses
//   - This page is the work that makes years 2-5 of ZONE 27 brand-
//     consistent · not just launch week
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · canonical proof page IS
//     disclosure axis strongest application · scattered → consolidated
//   - per [[feedback-zone27-pratfall-brand-ip]] · publish 19 things we
//     永遠不會 ship IS Costly Signaling 100× per Spence 1973
//   - per /audit S05 PRE-COMMIT clause · 修改任一 rule 需 30 天前
//     /changelog 公告 · violations 觸發 /receipts entry per /ethics
//     commitment #6 SLA · Tim 親手 signed · 永久 binding
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan
//     audience pattern-match Berkshire grammar instantly · Costco /
//     Patek / Buffett all 公開 binding rules · 同 axis
//
// 不做 anti-pattern:
//   ✕ NO「we COULD ship X if necessary」 future-flexibility weasel(
//     Buffett 1996 explicitly REJECTED future flexibility · same axis)
//   ✕ NO「subject to change」 footer disclaimer(brand IP「修改需 30 天
//     前 /changelog 公告」 is the only allowed change mechanism)
//   ✕ NO「except in cases of...」 conditional clauses(brand IP「不藏
//     fine print」 axiom · 不增加 weasel clause)
//   ✕ NO Berkshire mimicry without depth(Buffett earned 30+ yrs · ZONE
//     27 at Year 0 · acknowledge gap explicitly per Pratfall)
//
// Inspiration sources(per Agent A R78 fourth-pass spec):
//   - Berkshire Hathaway 1996「Owner's Manual」 Buffett(canonical model)
//   - Costco 14% margin self-cap public bond
//   - Patek Philippe Reference permanence 200-yr discipline
//   - Defector worker-owned launch commitment statements
//   - Stripe Atlas binding founder commitments(Atlas 6-deliverable model)
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily revalidate

const SIGNED_AT = "2026-05-23";

// 11 brand-IP redlines 「永遠不做」 · verbatim from /transparency Section 02
// + canonical CLAUDE.md memory · 同步 single-source · 修改需 30 天前
// /changelog 公告 per /audit S05 PRE-COMMIT clause。
const REDLINES: ReadonlyArray<{ no: string; rule: string; basis: string }> = [
  {
    no: "01",
    rule: "不 ship user-to-user social platform",
    basis: "no community / no forum / no DM / no chat · brand IP「epistemic mirror not engagement loop」 axiom · per /membership 倒置 SaaS pattern",
  },
  {
    no: "02",
    rule: "不 ship streak / daily-login farming / Days Followed badge",
    basis: "engagement-for-engagement redline · per Tetlock R53 7-tier discipline badge IS the brand-pure substitute · per Duolingo / Snapchat / Robinhood anti-pattern",
  },
  {
    no: "03",
    rule: "不 ship 儲值 wallet / in-app currency",
    basis: "no virtual currency · no points-economy · no in-app credit · per Taiwan 多層次傳銷法 § 29 implicit risk · 不 build pseudo-finance layer",
  },
  {
    no: "04",
    rule: "不 ship cash referral / 多層次傳銷法 § 29 affiliate",
    basis: "no referral codes · no commission · no UTM · no referral bonus · 11-NEVER #4 strictest redline · per Taiwan legal compliance",
  },
  {
    no: "05",
    rule: "不 ship「X of 270 sold」 live FOMO counter",
    basis: "ledger 是 weekly 手寫 不是 live · 0 live count · 0 countdown · per Booking.com / Stripe Atlas applicants ticker anti-pattern · 同 Pinboard ratchet 不適用 axiom",
  },
  {
    no: "06",
    rule: "不 寄生 gambling 平台",
    basis: "0 scrape 玩運彩 / 報馬仔 / 投顧老師 · 0 affiliate / commission · ZONE 27 displacement target NOT enable · per /audit Section 02 displacement axiom",
  },
  {
    no: "07",
    rule: "不 接 AdMob 廣告營收",
    basis: "AdMob 永久封殺 · 0 ads · 0 sponsored content · per /privacy + /audit DISCLOSURE block 「ADS 0」 axiom · /ethics commitment #2 binding",
  },
  {
    no: "08",
    rule: "不 multi-step onboarding wizard",
    basis: "1 個動作 / 1 個 email · 不 multi-screen sign-up · 不 progressive disclosure form · per Stratechery 「1 form 1 button」 + DHH HEY single-action axiom",
  },
  {
    no: "09",
    rule: "不 modal paywall scroll-lock",
    basis: "0 modal · 0 scroll-lock · 0「subscribe to read more」 overlay · per /audit S05 PRE-COMMIT clause + Medium subscribe modal anti-pattern · /transparency NO_PUSH_MANIFEST #10",
  },
  {
    no: "10",
    rule: "不 ship「管它準不準包裝」 fake methodology",
    basis: "engine v0.2/v0.3/v0.4 全 publish · 不藏 estimate · 不藏 DIVERGED · 不藏 sample debt N<30 · per /audit S05 + /methodology Section 04 binding · brand IP soul redline",
  },
  {
    no: "11",
    rule: "不 ship fake testimonials / 偽造 social proof",
    basis: "等真實 Founders Q3+ onboard 後才 publish letter · 0 ghostwritten quote · 0 mock social proof · 0「join 1000+」 inflation · per FoundingMemberLedger R72 W-C + /founders/from-one-current-founder R69 W-B empty scaffold pattern",
  },
];

// 8 binding ethics commitments · verbatim from /audit Section 04
// 「WHAT WE COMMIT TO」 · per /ethics 8 commitments · same single-source。
const ETHICS_COMMITMENTS: ReadonlyArray<{
  no: string;
  rule: string;
  basis: string;
}> = [
  {
    no: "01",
    rule: "0 betting affiliate / 不分潤博彩平台",
    basis: "0 sportsbook commission · 0 affiliate revenue · per /ethics commitment #1 binding · 違反 = brand 信用 collapse 永久 audit trail",
  },
  {
    no: "02",
    rule: "0 ads · AdMob 永久封殺",
    basis: "no Google AdSense · no AdMob · no Meta ads · no display banner · per /ethics commitment #2 + /privacy + /audit DISCLOSURE「ADS 0」 axis",
  },
  {
    no: "03",
    rule: "0 user tracking · GA / Pixel / Hotjar 永遠 0",
    basis: "0 Google Analytics · 0 Facebook Pixel · 0 Hotjar · 0 Plausible · 0 tracking pixel · per /privacy 0-tracker promise + /audit S06 LocalStorage Transparency 11-key inventory binding",
  },
  {
    no: "04",
    rule: "0 fake testimonials · 公開 founders 全名清單(Q3+ onboard 後)",
    basis: "等真實 Founder 6 個月後 publish letter · 0 mock testimonial · /founders/from-one-current-founder R69 W-B empty scaffold pattern · per /audit S05 PRE-COMMIT",
  },
  {
    no: "05",
    rule: "0 DIVERGED 隱藏 · 賽後 receipt 等大列出 · 7 天 ingest SLA",
    basis: "PROVED + DIVERGED same visual weight · 不藏 miss · per /track-record + /audit Section 03 + /steelman pattern · CPBL pipeline ingest deadline",
  },
  {
    no: "06",
    rule: "0 silently model rotation · Lens Lifetime Pledge · 每 ship 過的 engine 永久 viewable",
    basis: "engine v0.2 永久 viewable · v0.3 EXPANSION 永久 viewable · 不 rotate · 不 deprecate · per /methodology Section 04 + Lens Lifetime Pledge canonical",
  },
  {
    no: "07",
    rule: "0「明牌」 framing · prediction = probability 不是 picks",
    basis: "不販售「鐵口直斷」 · 不顯示賠率 · 純機率分布 + Brier score · per /audit + /manifesto + /coverage NEVER list + 11-NEVER #10 fake methodology binding",
  },
  {
    no: "08",
    rule: "0 fine print · 任何 rule modification 30 天前 /changelog 公告",
    basis: "/audit S05 PRE-COMMIT clause · 修改任一 rule 需 30 天前 /changelog 公告 · 此 page integrity 同 binding · 違反 = brand 信用 collapse",
  },
];

export default function IntegrityPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            INTEGRITY · OWNER&apos;S MANUAL AT YEAR 0 · BERKSHIRE 1996 PATTERN
          </p>
          <h1
            className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            19 件 ZONE 27 永久{" "}
            <span className="text-gold">不會變</span>{" "}
            的事
          </h1>
          {/* Cold Gold Hairline · R54 W-C signature moat */}
          <div className="zone27-rule max-w-[280px] mb-6" aria-hidden="true" />
          <p
            lang="en"
            className="font-mono text-mute text-xs tracking-[0.3em] tabular mb-6"
          >
            SIGNED · TIM · {SIGNED_AT} · APPEND-ONLY · 30-DAY /CHANGELOG NOTICE TO MODIFY
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            Berkshire Hathaway 1996 「Owner&rsquo;s Manual」 · Warren
            Buffett 寫了一頁列「Berkshire will and will NOT do」 · 30+ 年
            從未改過 · 公開 binding 不是 implicit assumption。 ZONE 27 採同
            axis at Year 0:11 brand-IP「永遠不做」 redlines + 8 binding
            ethics commitments = 19 件永久不會變的事。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            為什麼此 page 結構性重要:當 future fan 懷疑 ZONE 27 might
            「graduate into」 GA / analytics / social-account / paid-engine
            after launch · 整個 Pratfall + Costly Signaling + Defector-Year-
            Zero brand 會 collapse。 此 page 是 years 2-5 brand consistency
            的 missing organ · 不只 launch week 用。
          </p>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── §01 · 11 永遠不做 redlines ──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §01 · 11 BRAND-IP REDLINES · 永遠不做
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6">
            這 11 件「永遠不做」 是 ZONE 27 displacement-mission against 玩運彩
            + 報馬仔 + LINE 老師生態 的 binding signal。 違反任一 = brand
            自殺 · per /audit S05 PRE-COMMIT clause · 修改需 30 天前
            /changelog 公告。
          </p>
          <ol className="space-y-4 mt-4">
            {REDLINES.map((item) => (
              <RuleEntry key={item.no} no={item.no} rule={item.rule} basis={item.basis} negative />
            ))}
          </ol>
        </section>

        {/* ── §02 · 8 binding ethics ────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §02 · 8 BINDING ETHICS COMMITMENTS · 永遠會做
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6">
            這 8 件 ethics commitments 是 ZONE 27 brand IP「方法公開」 8 字
            grammar 物理 codify · 同步 per /audit Section 04 + /ethics 8
            commitments + canonical single-source。 違反 = Tim 親手 在
            /ethics 紅字標永久 audit trail · 不可 retroactively rebrand。
          </p>
          <ol className="space-y-4 mt-4">
            {ETHICS_COMMITMENTS.map((item) => (
              <RuleEntry key={item.no} no={item.no} rule={item.rule} basis={item.basis} />
            ))}
          </ol>
        </section>

        {/* ── §03 · BERKSHIRE 1996 PATTERN explanation ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §03 · BERKSHIRE 1996 PATTERN
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            Warren Buffett 1996 年寫了一頁「Owner&rsquo;s Manual」 · 列出
            Berkshire Hathaway will and will NOT do。 30+ 年從未改過。 沒有
            「we COULD change if necessary」 weasel · 沒有「subject to
            change」 footer · 沒有「except in cases of...」 conditional。
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            其他 commitment 模式(Costco 14% 毛利上限自綁 · Patek 200-yr
            Reference permanence · Defector worker-owned launch
            commitment)都採同 axis:public bond not implicit assumption。
            讀者 read 完後 audit-able · 違反 = brand 自殺。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            ZONE 27 在 Year 0 採同 axis · 但 honestly 不裝 30+ yrs earned。
            Buffett earned 1996 公信力 from 1965 起算 31 yrs Berkshire
            shareholder letter cadence · ZONE 27 從 2026-05-21 launch ·
            目前 N=4 PROVED · 0 paying customer · 整 brand 是「commitments
            published before earning」 per /year-zero R77 W-C「我們 publish
            commitments not results」 axiom · 此 page 同 axis。
          </p>
        </section>

        {/* ── §04 · PRE-COMMIT MECHANISM ─────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §04 · PRE-COMMIT MECHANISM · 修改 protocol
          </p>
          <p className="text-mute text-sm leading-relaxed mb-3">
            如果 ZONE 27 future 需要修改任一條 19 binding rule · 唯一允許
            mechanism 是:
          </p>
          <ol className="space-y-2.5 text-mute text-sm leading-relaxed ml-4">
            <li>
              <strong className="text-bone">1.</strong> Tim 親手寫 /changelog
              entry · 註明 modify which rule · 為什麼 · 30 天 notice period
              開始 dated。
            </li>
            <li>
              <strong className="text-bone">2.</strong> 30 天內 fan 可以
              read /changelog entry · 公開反對 via GitHub Issue OR email
              tatayngiti@gmail.com · Tim 親手 reply 解釋 reasoning。
            </li>
            <li>
              <strong className="text-bone">3.</strong> 30 天後 IF Tim 仍
              堅持 modify · /integrity page entry 更新 · 並 append /changelog
              second entry「modified, effective YYYY-MM-DD」。
            </li>
            <li>
              <strong className="text-bone">4.</strong> 違反 protocol(silently
              modify · skip 30-day notice · backdate)= brand 信用 collapse
              永久 audit trail · per /ethics commitment #8。
            </li>
          </ol>
          <p className="text-mute/85 text-sm leading-relaxed mt-5">
            此 protocol IS the bond。 Buffett never used Berkshire 1996
            modify mechanism(no rules changed since 1996)· Tim 採同
            discipline at Year 0 · per Pratfall「不藏 modify path · 但
            commit to never use it」 axis。
          </p>
        </section>

        <FounderSignOff signedAt={SIGNED_AT}>
          <p>
            這 19 件不是 marketing copy · 不是 sales pitch · 不是 commitment
            theater · 是 Tim 親手在 {SIGNED_AT} 公開簽名的 binding bond。
            Berkshire 1996 Owner&rsquo;s Manual 30+ 年從未改過 · ZONE 27 採
            同 axis from Year 0。
          </p>
          <p>
            如果未來您看到 ZONE 27 違反任一條 19 binding rule · 您 right to
            challenge · email tatayngiti@gmail.com 直接質問 Tim · 或開
            GitHub Issue 公開 audit trail · 或在 /faq 留言記錄。 brand IP
            「方法公開 · 品味私藏」 8 字 grammar 物理 codify 到 commitment
            bond 層 · 沒有 hidden flexibility。
          </p>
          <p>
            修改任一 rule per /audit S05 PRE-COMMIT clause 30-day /changelog
            notice mechanism。 違反 protocol = brand 信用 collapse · 您
            擁有 永久 audit trail right · 公開 right to challenge。
          </p>
        </FounderSignOff>

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center border-t border-line/40 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/transparency"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /transparency · audit aggregator
            </Link>
            <Link
              href="/ethics"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /ethics · 8 commitments source →
            </Link>
            <Link
              href="/audit#section-02"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /audit § 02 · 11 NEVER source →
            </Link>
            <Link
              href="/changelog"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /changelog · modify protocol →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── RuleEntry · negative or positive variant ──
function RuleEntry({
  no,
  rule,
  basis,
  negative = false,
}: {
  no: string;
  rule: string;
  basis: string;
  negative?: boolean;
}) {
  const colorClass = negative ? "text-loss/85" : "text-gold/85";
  const borderClass = negative ? "border-loss/40" : "border-gold/40";

  return (
    <li className={`border-l-2 ${borderClass} pl-4 py-2`}>
      <div className="flex items-baseline gap-3 flex-wrap mb-1.5">
        <span
          lang="en"
          className={`font-mono ${colorClass} text-[10px] tracking-[0.3em] tabular`}
        >
          {negative ? "✕" : "✓"} {no}
        </span>
        <p className="text-bone text-sm sm:text-base leading-snug flex-1">
          <strong>{rule}</strong>
        </p>
      </div>
      <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
        {basis}
      </p>
    </li>
  );
}
