import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import RelatedReading from "@/components/RelatedReading";
import { FOUNDERS_TOTAL } from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "Inheritance · Founders 27 seat 替下一代守",
  description:
    "Patek Philippe 1996「Generations」 tagline localized to Taiwan CPBL fan culture · Hanshin Tigers 二代目ファン pattern · Berkshire shareholder continuity · ZONE 27 Founders 27 seat 永久 transferable to family member · 不開公開市場 · 不 resale · 不 broker · Tim 親手 executor protocol。 您不是買 ZONE 27 · 您只是替下一代守 27 號席位。",
  openGraph: {
    title: "Inheritance · Founders 27 替下一代守 27 號席位",
    description:
      "Patek 1996 Generations + Hanshin 二代目ファン · ZONE 27 seat 永久 transferable · 不開公開市場 · Tim 親手 executor",
    images: ["/founders/opengraph-image"],
  },
};

// ── ZONE 27 · /founders/inheritance ────────────────────
// R75 W-G · Agent A R75 SHIP 3 · Patek Philippe 1996 "Generations" campaign
// + Hanshin Tigers 二代目ファン Japan generational handoff + family-recording-
// coach skill territory(Tim's own 5-year-old son context)+ Berkshire share-
// holder continuity grammar。
//
// The structural axiom:
//   - Founders 27 closed state(SHADOWLESS RUN axiom · R60 W-A)+ NT$ 2,700
//     一次性 終身 + 不開公開市場 = seat is structurally INHERITABLE
//   - Existing /founders + /founders/ledger surfaces don't yet articulate
//     the inheritance protocol · this page closes the gap
//   - Tim's family-recording-coach skill(weekly 父子錄音)signals he
//     understands generational identity grammar viscerally
//
// 4 sections per Agent A R75 SHIP 3 spec:
//   01 · GENERATIONS LINE · Patek 1996 tagline localized
//   02 · SEAT TRANSFER RULES · lifetime · single transfer · family only
//   03 · NOT TRANSFERRED · what survives Tim's personal relationship
//   04 · FOUNDER SIGN-OFF
//
// Brand IP fit:
//   - per [[feedback-zone27-audience-fans-not-engineers]] · CPBL fan
//     audience pattern-match 二代目 generational identity instantly
//   - per [[zone27-monetization-philosophy]] · identity-paid axis 物理
//     codify to inheritance grammar(deepest identity statement)
//   - per [[feedback-zone27-pratfall-brand-ip]] · Section 02 admits Tim
//     mortality risk · publishes seat-transfer-on-death protocol · same
//     Pratfall axis as BUS_FACTOR R69 W-F
//   - per /audit S05 PRE-COMMIT clause · 修改 transfer rules 需 30 天前
//     /changelog 公告 · same append-only Costly Signaling discipline as
//     ENGINE_DIFF_BEACONS + NO_PUSH_INVENTORY + RECIPROCITY_LEDGER pattern
//
// 不做 anti-pattern(per Agent A R75 SHIP 3 spec):
//   ✕ NO MLM · single seat transfer · no affiliate referral
//   ✕ NO public transfer ledger(privacy redline)
//   ✕ NO「passing it down on deathbed」 sentimentality
//   ✕ NO fake testimonial「my son inherited #007」 (no real Founder yet)
//   ✕ NO「annual gift this seat」 upsell
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily revalidate

export default function FoundersInheritancePage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute flex-wrap">
            <Link href="/" className="hover:text-gold transition-colors">
              HOME
            </Link>
            <span className="text-mute/60">/</span>
            <Link
              href="/founders"
              className="hover:text-gold transition-colors"
            >
              FOUNDERS 27
            </Link>
            <span className="text-mute/60">/</span>
            <span className="text-gold">INHERITANCE</span>
          </div>
        </section>

        {/* ── HERO · GENERATIONS LINE ──────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-12 pb-10 text-center">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
            INHERITANCE · 替下一代守 · PATEK 1996 PATTERN
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight text-bone">
            您不是<span className="text-mute/70 line-through">買</span>{" "}
            ZONE 27
            <br />
            <span className="text-gold">您只是替下一代守 27 號席位</span>
          </h1>
          {/* Cold gold hairline · R54 W-C signature moat */}
          <div className="zone27-rule mx-auto max-w-[320px] mt-5" aria-hidden="true" />
          <p
            lang="en"
            className="font-mono text-mute text-xs sm:text-sm tracking-[0.3em] mt-6 sm:mt-8"
          >
            PATEK 1996 GENERATIONS · HANSHIN 二代目ファン · BERKSHIRE
            CONTINUITY
          </p>
          <p className="editorial-dropcap mt-8 max-w-xl mx-auto text-mute leading-relaxed">
            Patek Philippe 1996 「Generations」 campaign canonical:{" "}
            <em className="text-bone not-italic">
              &ldquo;You never actually own a Patek Philippe · you merely
              look after it for the next generation&rdquo;
            </em>
            。 ZONE 27 Founders 27 seat 採同 axis · 一次性 NT$ 2,700 + 終身 +
            closed state(SHADOWLESS RUN axiom)= 結構性 inheritable seat。
          </p>
          <div className="mt-8 flex justify-center">
            <ArticleMeta readingMin={4} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── §01 · GENERATIONS LINE EXPANSION ───── */}
        <Section
          no="01"
          label="GENERATIONS LINE · 為什麼是「守」 不是「買」"
          zh="seat 是 SHADOWLESS RUN 第 N 號 · 不是 SaaS subscription"
        >
          <p>
            傳統 SaaS subscription model · 您 pay 您 use · 您 cancel 您 lose ·
            身份 transactional 不 transferable · 終止即消失。 ZONE 27 Founders
            27 不是 SaaS · 是{" "}
            <Link
              href="/founders/ledger#shadowless-run"
              className="text-gold underline-offset-4 hover:underline"
            >
              Pokemon TCG 1st Edition SHADOWLESS RUN axiom
            </Link>
            (R60 W-A)· 整批 {FOUNDERS_TOTAL} 名 = print-run-of-record · 售完
            永久關閉 · 同 Patek Reference Number 不可重發。
          </p>
          <p>
            這個 structure 帶來一個 emergent property:
            <strong className="text-bone">
              seat 在 Tim 過世後仍然是 seat
            </strong>
            。 Tim 死了 ZONE 27 engine 還在 GitHub MIT licensed(per /ethics
            #3)· /audit + /methodology + /track-record 永久 viewable · seat
            holder 的編號 #001-#{FOUNDERS_TOTAL} 永久在 /founders/ledger
            FoundingMemberLedger grid。
          </p>
          <p>
            兒子問您「為什麼您 follow ZONE 27?」 · 您不是 explain SaaS
            subscription · 您 explain{" "}
            <strong className="text-bone">
              「2026 我 #027 號 · 您將來繼承 #027」
            </strong>{" "}
            · 同 Hanshin Tigers 「二代目阪神ファン」 grammar · 同{" "}
            Berkshire shareholder identity 跨 60 年 continuity。
          </p>
        </Section>

        {/* ── §02 · SEAT TRANSFER RULES ────────── */}
        <Section
          no="02"
          label="SEAT TRANSFER RULES · 4 binding rules"
          zh="lifetime · single transfer · family-member only · 不開公開市場"
        >
          <p>
            ZONE 27 Founders 27 seat transferability 4 條 binding rule ·
            pre-commit · 修改需 30 天前 /changelog 公告 per /audit S05
            PRE-COMMIT clause:
          </p>
          <ol className="space-y-5 mt-6">
            <RuleRow
              no="01"
              title="LIFETIME · 永久 transferable"
              body="您 seat 是永久 · Tim 過世後仍存在 · 您過世後 seat 可由家人繼承(配偶 / 子女 / 兄弟姊妹)。 不需要 Tim 在世 approve · 不需要 ZONE 27 engine 仍在運行 · seat IS the receipt-of-finite-set 證明 forever。"
            />
            <RuleRow
              no="02"
              title="SINGLE TRANSFER · 一次性 transfer 限制"
              body="每個 seat 一生只能 transfer 一次 · 防止資產 flipping。 您 transfer 給家人後 · 該家人是新 owner · 他/她 不能 transfer 給第三人。 transfer 動作物理 codify · 不可 retroactively undo。"
            />
            <RuleRow
              no="03"
              title="FAMILY MEMBER ONLY · 不開公開市場"
              body="seat 只能 transfer 給法定家庭成員(配偶 · 子女 · 兄弟姊妹 · 父母)· 不可 sell · 不可 broker · 不可上 OpenSea · 不可上 eBay。 違反 = seat permanently revoked · /founders/ledger 公開 audit trail。"
            />
            <RuleRow
              no="04"
              title="TIM 親手 EXECUTOR · transfer process"
              body="您要 transfer · email Tim · Tim 親手 verify family relationship + update /founders/ledger weekly cadence。 Tim 過世後 · executor(Tim 配偶 + 2 兄弟姊妹)接管 transfer protocol per /privacy Section 6B emergency contact provision。 不 automate · 不 outsource。"
            />
          </ol>
          <p className="mt-8 font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
            ⚓ 上 4 條 binding rule · 修改需 30 天前{" "}
            <Link
              href="/changelog"
              className="text-gold underline-offset-4 hover:underline"
            >
              /changelog
            </Link>{" "}
            公告 · same Costly Signaling discipline as /audit S05 PRE-COMMIT
            + Founders 27 SHADOWLESS RUN axiom + MultiYearAnchor R75 W-D
            durability statement。
          </p>
        </Section>

        {/* ── §03 · NOT TRANSFERRED · what cannot be inherited ── */}
        <Section
          no="03"
          label="WHAT IS NOT TRANSFERRED"
          zh="Tim 親手 relationship 不可繼承 · 是 personal not structural"
        >
          <p>
            Tim 提供的{" "}
            <strong className="text-bone">親手 onboarding relationship</strong>{" "}
            不可繼承。 您 #027 onboard 時 Tim 親自 reply email + 親自 ship
            welcome kit + 親自 reply 您 future emails — 這個{" "}
            <em className="text-bone not-italic">specific relationship</em>{" "}
            是 between Tim and 您 · Tim 過世後不延續到您家人。
          </p>
          <p>
            Tim 過世後 · executor(配偶 + 2 兄弟姊妹)接管{" "}
            <strong className="text-bone">structural commitments</strong>:
          </p>
          <ul className="space-y-3 mt-4 ml-2 sm:ml-4">
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <span className="flex-1">
                seat 編號 #001-#{FOUNDERS_TOTAL} 永久 binding · 不會被
                retroactively revoked
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <span className="flex-1">
                /founders/ledger public allocation grid 永久 viewable · 不會
                被刪除
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <span className="flex-1">
                engine GitHub repo 30 天 internal open-sources per{" "}
                <Link
                  href="/ethics#bus-factor"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /ethics BUS_FACTOR
                </Link>{" "}
                + R75 W-D MultiYearAnchor row 03 commitment
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span aria-hidden="true" className="text-gold/70">
                ▸
              </span>
              <span className="flex-1">
                /audit + /methodology + /track-record + /coverage 永久
                viewable · NEVER paywalled · per R75 W-D row 02 + MIT license
              </span>
            </li>
          </ul>
          <p className="mt-6">
            這個 distinction 重要:Tim 提供的 personal relationship 是
            limited-time gift · structural commitments(seat 編號 +
            allocation ledger + engine open source + trust artifacts)是
            permanent。 您買的不是 Tim 終身陪伴 · 您買的是 seat 在 SHADOWLESS
            RUN 的位置。
          </p>
        </Section>

        {/* ── §04 · GENERATIONAL ANCHOR ───── */}
        <Section
          no="04"
          label="GENERATIONAL ANCHOR · 您兒子問為什麼"
          zh="一個 27 年 CPBL 球迷的回答 grammar"
        >
          <p>
            您兒子問:「爸 · 您為什麼 follow ZONE 27?」 · 您的回答 grammar
            可以是:
          </p>
          <blockquote className="border-l-2 border-gold/60 pl-5 sm:pl-6 py-3 my-6 bg-slate/30">
            <p className="text-bone text-base sm:text-lg font-light leading-relaxed mb-3">
              「2026 年 · 台灣有一個 solo founder Tim · 親手寫了一個 CPBL
              quantitative engine · NT$ 2,700 一次性 · 只賣 {FOUNDERS_TOTAL}
              人 · 永久關閉。 我 #027 號。」
            </p>
            <p className="text-mute text-sm sm:text-base leading-relaxed mb-3">
              「Tim 不收廣告 · 不接 sponsor · 不分潤博彩 · 不發 push email ·
              不出明牌。 publish 全 model · publish 全 audit · publish 全
              拒絕原因 · publish 全 enterprise state。 是台灣硬核棒球迷的
              Bloomberg。」
            </p>
            <p className="text-mute/85 text-sm leading-relaxed">
              「等 Tim 不在了 · 引擎 open source 給全世界 · 我 #027 seat
              傳給您 · 您未來可以 transfer 給您兒子。 不是 SaaS · 是 receipt
              of finite-set position 跨 generation 永久 binding。」
            </p>
          </blockquote>
          <p>
            這個 grammar 不是 marketing copy · 是 brand IP 結構性 truth · 同
            Hanshin Tigers fan culture 「二代目 · 三代目」 grammar 在 Japan
            是 real identity category · ZONE 27 把同 axis 落到 Taiwan CPBL
            fan culture + Patek 1996 「Generations」 luxury inheritance
            tradition。
          </p>
          <p>
            您不是 buy ZONE 27 · 您是{" "}
            <strong className="text-bone">
              替您家族下一代守 27 號席位
            </strong>{" "}
            · 同 Berkshire shareholder 60-year identity continuity grammar。
            seat IS the receipt-of-finite-set 證明 forever。
          </p>
        </Section>

        <FounderSignOff>
          <p>
            這 page 是 Patek Philippe 1996 「Generations」 campaign 對標 ·
            落地 Taiwan CPBL fan culture grammar。 我 Tim solo founder · 我
            有兒子 · 我懂為什麼 generational identity 比 SaaS subscription
            深。
          </p>
          <p>
            您 #NNN seat 在 SHADOWLESS RUN 第 N 號永久 binding · 不會被
            retroactively revoked。 您過世後家人繼承 seat · 4 條 binding
            transfer rule per Section 02 · 不需要 my approval · 我可能不在了
            · executor 接管。
          </p>
          <p>
            修改 inheritance protocol 需 30 天前{" "}
            <Link
              href="/changelog"
              className="text-gold underline-offset-4 hover:underline"
            >
              /changelog
            </Link>{" "}
            公告 · per /audit S05 PRE-COMMIT clause · 違反 = brand 信用
            collapse 永久 audit trail。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/founders/inheritance" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/founders"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← Founders 27 銷售頁
            </Link>
            <Link
              href="/founders/ledger"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /founders/ledger 公開帳本 →
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
  label,
  zh,
  children,
}: {
  no: string;
  label: string;
  zh: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 border-t border-line/40 cv-auto">
      <div className="flex items-baseline gap-4 mb-2 section-reveal flex-wrap">
        <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / {no}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
          {label}
        </span>
      </div>
      <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-2">
        {zh}
      </h2>
      <div className="space-y-5 text-mute text-base leading-relaxed mt-5">
        {children}
      </div>
    </section>
  );
}

function RuleRow({
  no,
  title,
  body,
}: {
  no: string;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-5">
      <span className="font-mono text-gold/70 text-sm tabular w-8 pt-1 shrink-0">
        {no}
      </span>
      <div className="flex-1">
        <h4 className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
          {title}
        </h4>
        <p className="text-mute text-sm leading-relaxed">{body}</p>
      </div>
    </li>
  );
}
