import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import RelatedReading from "@/components/RelatedReading";
import { createPageMetadata } from "@/lib/page-og";
import { FOUNDERS_TOTAL } from "@/lib/founders-stats";

export const metadata = createPageMetadata({
  title: "From One Current Founder · 等待 #001 真實 6 個月 letter",
  description:
    "此頁 RESERVED FOR Founder #001 第 6 個月的真實 letter · 不是 fake testimonial · 不是 mock quote · pre-launch empty state IS the receipt that this page is reserved for one real voice。 270 個席位 = 270 封 letter 未來。",
  ogTitle: "From One Current Founder · 等待 #001 真實 letter · ZONE 27",
  ogDescription:
    "Pre-launch empty scaffold · 不是 fake testimonial · 等真實 Founder #001 6 個月後 ship · 270 席 = 270 封 letter",
  path: "/founders/from-one-current-founder",
});

// ── R69 W-B · From One Current Founder · Empty Scaffold ──
// Agent A R68 SHIP 4 deferred · Substack Year-In-Review pattern + Mubi
// monthly cinema curation letter + Patek family-archive owner letter ·
// pre-launch state IS the receipt that this page is reserved for one
// real voice。
//
// brand IP fit:
//   - per [[feedback-zone27-pratfall-brand-ip]] · empty scaffold IS the
//     signal · matches /founders/ledger pre-launch pattern · matches
//     /annual/2026 Year 0 honest empty state pattern
//   - per [[zone27-disclosure-philosophy]] · 我們 explicit pre-commit:
//     此頁 RESERVED FOR Founder #001 真實 letter · 不 fake · 不 mock ·
//     unfilled = brand IP discipline 物理 codify
//   - per fake testimonials redline #11 · page sits EMPTY until real
//     Founder onboards · 不 violate
//   - per Costly Signaling · limit 270 letters cap = marketing surface
//     finite · 不 manufacture fake「voices」 to fill the page
//   - per Pokemon TCG 1st Edition mechanic · 270 letters cap = parallel
//     to 270 founders cap · same SHADOWLESS RUN axiom · 1 founder =
//     1 letter forever · 不 reprint · 不 ghostwrite
//
// 不做 anti-pattern:
//   ✕ no fake quotes from「ANONYMOUS FOUNDER」 stub voices
//   ✕ no mock testimonial「FOUNDER #001 SAYS...」 placeholder text
//   ✕ no「coming soon · subscribe to be notified」 push
//   ✕ no countdown to launch · per /transparency milestone-triggered
//
// Page becomes a real letter when Founder #001 onboards in their 6th
// month · Tim adds letter inline · scaffold gracefully transitions ·
// adding letter is single PR · per /audit S05 PRE-COMMIT pattern。
//
// Placement:
//   - Cmd-K palette entry「from-one-current-founder」 入門 group
//   - /founders RELATED_LINKS · 訪客 see 此頁 from sales page
//   - /founders/ledger RELATED_LINKS · 同 process-transparency axis
// ─────────────────────────────────────────────────────

export default function FromOneCurrentFounderPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="founders" />

      <main id="main">
        {/* ── BREADCRUMB ──────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute">
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
            <span className="text-gold">FROM ONE CURRENT FOUNDER</span>
          </div>
        </section>

        {/* ── HERO ──────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-10 pb-10">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            FROM ONE CURRENT FOUNDER · 等待 #001 真實 LETTER
          </p>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight">
            等待 Founder #001 ·{" "}
            <span className="text-gold">第 6 個月的真實 letter</span>
          </h1>
          <p className="mt-6 text-mute leading-relaxed text-base sm:text-lg">
            此頁 RESERVED FOR Founder #001 第 6 個月的真實 letter。{" "}
            <strong className="text-bone">
              不是 fake testimonial · 不是 mock quote · 不是 ghostwritten
              placeholder
            </strong>
            。
          </p>
          <p className="mt-3 text-mute/85 text-sm leading-relaxed">
            ⚓ 此頁 pre-launch empty state IS the receipt · 訪客看到 empty =
            訪客看到 ZONE 27 brand IP discipline 物理 codify · per /audit
            S05 PRE-COMMIT pattern。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={3} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── EMPTY STATE · THE RECEIPT ───────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border-2 border-gold/40 bg-slate/40 p-8 sm:p-10">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6 text-center"
            >
              N = 0 · NO FOUNDER LETTER YET · BY DESIGN
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4 text-center">
              第 1 封 letter 在 Founder #001 onboard{" "}
              <span className="text-gold">第 6 個月</span> 出現
            </h2>
            <p className="text-mute leading-relaxed text-center mb-6 max-w-2xl mx-auto">
              ZONE 27 不 backfill 假 testimonial · 不 ghostwrite member voice ·
              不在 sales page 放「FOUNDER #001 SAYS...」 mock quote box。
              此頁 sits EMPTY 直到第一位真實 Founder 滿 6 個月後 親手 ship
              own letter。
            </p>
            <p className="text-mute leading-relaxed text-center max-w-2xl mx-auto">
              <strong className="text-bone">為什麼 6 個月?</strong>{" "}
              短期(1-3 個月)只能說「我剛加入 · 期待」 — 不是 useful
              signal。 6 個月後您看完 1 個 CPBL 季 NT$ 1,500/season 等價 BLACK
              CARD value · 您看 60+ matches engine track record · 您
              experience 完整 Tim 親手 onboarding choreography · 您 own
              opinion 有 backing · 那才是 worth writing letter 的 moment。
            </p>
          </div>
        </section>

        {/* ── THE TEMPLATE ───────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6">
            <p className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3">
              / FUTURE LETTER TEMPLATE · 不 randomize · 不 ghostwrite
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4">
              270 封 letter · same template · same restraint
            </h2>
            <p className="text-mute leading-relaxed mb-4">
              每封 letter 用 same structure:
            </p>
            <ol className="space-y-3 text-mute text-sm leading-relaxed">
              <li>
                <span className="font-mono text-bone tabular mr-2">01</span>
                <strong className="text-bone">您 ID</strong> · #NNN · 您
                Founder number · 鎖定 buy-date
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">02</span>
                <strong className="text-bone">您 buy-date</strong> · 您 wire
                arrival timestamp · per /founders/ledger row
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">03</span>
                <strong className="text-bone">您 6-month experience</strong>{" "}
                · what surprised you(positive 或 negative · brand IP「不藏
                negative experience」)
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">04</span>
                <strong className="text-bone">最 valuable engine call</strong>{" "}
                · 您過去 6 個月最 valuable PROVED 或 DIVERGED match · 您
                親自 verify 的 receipt
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">05</span>
                <strong className="text-bone">您 would recommend?</strong>{" "}
                · 給 prospective Founders 27 applicant 您 honest advice ·
                yes / no / it depends · 不 sugar-coat
              </li>
            </ol>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mt-5 leading-relaxed">
              {/* R70 W-F · Agent B audit F3 fix · 移除 phantom MEMBER_VOICE
                  clause reference · 之前 R69 W-B 寫 ref but /ethics 沒
                  此 clause · self-falsifiable in 30 seconds via Ctrl-F。
                  改 cite 已存在的 /ethics 9 commitments + /audit S05
                  PRE-COMMIT pattern + bus-factor R70 W-F · binding remains
                  intact 不靠 phantom 名稱。 */}
              ⚓ Tim 不 edit letter content · 不 polish prose · 不 remove
              negative · 您寫什麼 ship 什麼 · per{" "}
              <Link
                href="/ethics"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /ethics 8 binding commitments
              </Link>
              {" "}+{" "}
              <Link
                href="/audit#section-05"
                className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
              >
                /audit S05 PRE-COMMIT
              </Link>
              {" "}pattern · 違反 = 紅字 alert 永久標 /ethics · 不刪。 您
              signed name 或 handle 都 OK · per /privacy member privacy default。
            </p>
          </div>
        </section>

        {/* ── 270 CAP DISCLOSURE ──────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="bg-slate/30 border border-line/50 p-6 sm:p-8">
            <p
              lang="en"
              className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4 text-center"
            >
              ⚓ COSTLY SIGNALING · 270 LETTER CAP · SHADOWLESS RUN
            </p>
            <p className="text-mute leading-relaxed mb-4">
              此 page 累積 max{" "}
              <strong className="text-bone">
                {FOUNDERS_TOTAL} 封 letter
              </strong>{" "}
              · 1 founder = 1 letter forever。 NOT「guest writer」 · NOT
              「rolling content」 · NOT「monthly issue」 · 270 個 Founder
              成為 270 個 voice · 每位 owner 自己的 6-month 時間 anchor。
            </p>
            <p className="text-mute leading-relaxed mb-4">
              CARD 001/270 · CARD 002/270 · ... · CARD 270/270 ·
              <strong className="text-bone"> 不重印 · 不 ghostwrite · 不 anonymize</strong>。
            </p>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] leading-relaxed">
              同 Pokemon TCG 1st Edition Shadowless Run 不可重印 mechanic ·
              per R60 W-A SHADOWLESS RUN axiom · per /founders/ledger
              #shadowless-run · 此 page 將來 270 封 letter = 270 個 1st
              Edition collectible voice artifact。
            </p>
          </div>
        </section>

        {/* ── HOW THIS PAGE CHANGES ─────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="border-l-2 border-gold/60 pl-5 sm:pl-6">
            <p className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-3">
              / WHEN DOES THIS PAGE CHANGE? · 不裝 mystery
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-4">
              透明 milestone trigger · 不藏 ETA
            </h2>
            <ol className="space-y-3 text-mute text-sm leading-relaxed">
              <li>
                <span className="font-mono text-bone tabular mr-2">M1</span>
                <strong className="text-bone">第 1 位真實 Founder onboard</strong>{" "}
                · Tim 通過{" "}
                <Link
                  href="/founders/apply"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /founders/apply
                </Link>{" "}
                application + wire 完成 + Founder ID #008 鎖定
                (#001-#007 是 Tim system-test placeholders per /founders/ledger)
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">M2</span>
                <strong className="text-bone">+6 個月</strong> · Founder
                experience 滿足 6-month signal threshold · Tim email 邀請
                ship letter
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">M3</span>
                <strong className="text-bone">Founder ship letter</strong> ·
                Tim merge letter into this page · single PR · per /audit
                S05 PRE-COMMIT 30-day announcement clause
              </li>
              <li>
                <span className="font-mono text-bone tabular mr-2">M4</span>
                此 empty state header → CARD 001/270 typographic frame ·
                empty state copy moves to footer historical reference
              </li>
            </ol>
            <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mt-5 leading-relaxed">
              ⚓ Q3 2026 application channel opens(per payment infra
              milestone)· 首位 Founder onboard 約 Q3 末-Q4 · 第一封 letter
              約 Q1 2027 · 此 ETA 不綁日期 · milestone-triggered。
            </p>
          </div>
        </section>

        {/* ── FOUNDER SIGN-OFF ─────────────────────── */}
        <FounderSignOff signedAt="2026-05-23">
          <p>
            我 ship 這頁 BEFORE 第一位 Founder 報名 · 不是 BACKFILL 假
            testimonials · 是{" "}
            <strong>pre-commit 我永遠不會 ghostwrite member voice</strong>。
          </p>
          <p>
            您現在看到的 empty state · 就是 brand IP receipt 本身 · 同{" "}
            <Link
              href="/founders/ledger"
              className="text-gold underline-offset-4 hover:underline"
            >
              /founders/ledger
            </Link>{" "}
            empty scaffold + {" "}
            <Link
              href="/annual/2026"
              className="text-gold underline-offset-4 hover:underline"
            >
              /annual/2026
            </Link>{" "}
            Year 0 empty 同 axiom · Costly Signaling 物理 codify。
          </p>
          <p>
            <strong>270 個席位 = 270 封 letter</strong> · 不會多 · 不會少 ·
            不會 anonymize · 不會 ghost。 每位 Founder own 自己的 voice ·
            這頁將來會是 270 個 1st Edition collectible voice artifact 集合
            · 同 Pokemon Shadowless Run mechanic per R60 W-A。
          </p>
        </FounderSignOff>

        {/* ── RELATED READING ──────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <RelatedReading currentPath="/founders/from-one-current-founder" />
        </section>
      </main>

      <Footer />
    </div>
  );
}
