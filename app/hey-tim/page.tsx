import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import RelatedReading from "@/components/RelatedReading";
import { createPageMetadata } from "@/lib/page-og";
import {
  HEY_TIM_ENTRIES,
  HEY_TIM_COUNT,
  HEY_TIM_PENDING_COUNT,
  HEY_TIM_WRONG_THEN_CORRECTED_COUNT,
  HEY_TIM_UNCERTAIN_COUNT,
  formatCertaintyLabel,
  formatCertaintyClass,
  type HeyTimEntry,
} from "@/lib/hey-tim-entries";

export const metadata = createPageMetadata({
  title: "Hey Tim · subscriber Q&A ledger · Bill James pattern · 您 ask · Tim 親手 reply",
  description:
    "Bill James「Hey Bill」 2009 起 15+ 年 canonical pattern · 球迷 email questions → Tim 親手 reply → 公開 ledger 不藏 · 包括 Tim 答錯後的 correction。Defector Funbag + Stratechery Daily Update + Tom Tango comments + patio11 reader-reply 同 axis · canonical 8th in ZONE 27 append-only ledger family · 0 cherry-pick · 0 retroactive delete · 同 /integrity rule #9 mandatory-ledger discipline 物理 codify。",
  ogTitle: "Hey Tim · subscriber Q&A · Bill James 15-yr pattern · ZONE 27",
  ogDescription:
    "您 ask · Tim 親手 reply · 公開 ledger · 不藏「我答錯了」 correction · Bill James + Defector + Stratechery pattern",
  path: "/hey-tim",
});

// ── ZONE 27 · /hey-tim · Subscriber Q&A Ledger ─────────
// R80 W-H · Agent A R80 BIGGEST GAP closure · Bill James「Hey Bill」
// 15-year canonical pattern + Defector Funbag staff-reply + Stratechery
// Daily Update reply + Tom Tango comments dialogue + patio11 reader-reply
// ethic。 ZONE 27 had 22 binding rules + receipts + letters + Year-Zero
// 但 0 recurring proof that Tim is on the other end of a line · 整 brand
// IP 是「trust the human」 但無 visible 「Tim 親手 reply」 ritual。
// 此 page closes structural gap。
//
// The cognitive frame this closes(per Agent A R80 honest answer):
//   - Founders 27 spending NT$ 2,700 應該看到 Tim's name on dated replies
//     before deciding · 不是 marketing「我們很懂台灣棒球」 self-claim
//   - Bill James Online sub renews because Bill replies on Hey Bill ·
//     not because predictions are 100% right
//   - Q&A artifact = trust-the-human IS the brand · 不是 stat ledger 是
//     human-on-other-end artifact
//
// Distinct from existing trust artifacts:
//   - /faq = Tim pre-anticipated 14 questions · monologue · already
//     known answers
//   - /hey-tim = visitor-generated questions · dialogue · including
//     「我答錯了」 corrections · pratfall + reciprocity layer
//   - /letter = Tim singular voice · essay-style · NO comment thread ·
//     reader pulls
//   - /track-record = engine predictions ledger · not human-voice ledger
//
// Pre-launch Year-0 honest empty state:
//   - 1 SEED entry(meta · self-question 「為什麼有這個 page」)showing
//     format · 同 /year-zero / /founders/from-one-current-founder /
//     FoundingMemberLedger pattern「空的 ledger 也是 ledger · 空 = signal」
//   - Visitor inbound questions → Tim 親手 reply · append to lib/
//     hey-tim-entries.ts → public via this page
//   - 7-day SLA per /ethics commitment #05 + /integrity rule #9
//     mandatory-ledger discipline extended to Q&A layer
//
// Brand IP triple-fire:
//   - per [[zone27-disclosure-philosophy]] · publish Q&A dialogue 同
//     /audit Section 05 PRE-COMMIT axis
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「wrong-then-corrected」
//     entries 是 Pratfall axiom 物理 codify · 同 /steelman + /audit
//     DIVERGED 等大 pattern
//   - per [[feedback-zone27-audience-fans-not-engineers]] · Chinese
//     fan-grammar dialogue · NOT engineering jargon · CPBL fan voice
//
// 不做 anti-pattern(per Agent A R80 SHIP #1 spec + 11 NEVER list):
//   ✕ NO comment thread / discussion / reply-button(同 /letter axiom
//     · pull not push · 11-NEVER #1 user-to-user social platform)
//   ✕ NO email subscribe form for new Q&A(per NoPushManifest #1-2 ·
//     reader pulls 不 push)
//   ✕ NO Discord / forum / chat for live Q&A(per Agent A R80 anti-pattern
//     #1 · Pinboard Cegłowski 17-yr solo 拒絕 community · brand pure)
//   ✕ NO「Top-rated Q」 sorting / voting / popularity surface(per 11-
//     NEVER #2 streak/engagement-farming axiom · APPEND-ONLY chronological
//     only)
//   ✕ NO ghostwritten reply / AI-generated reply / outsourced reply
//     (per 11-NEVER #11 fake testimonials · Tim 親手 only · 0 outsource)
//   ✕ NO retroactive edit of past Q or A(append-only · correction =
//     NEW entry with certainty「wrong-then-corrected」 referencing prior
//     slug · 同 git commit history pattern)
//
// Inspiration sources:
//   - Bill James「Hey Bill」 2009-(billjamesonline.com/hey_bill · 15+ yrs
//     · #1 retention driver per Bill James Online subscriber surveys)
//   - Defector「Funbag」 2020-(defector.com/funbag · worker-coop reply)
//   - Stratechery Daily Update 2013-(stratechery.com · sub-2% churn)
//   - Tom Tango Tangotiger blog 2003-(tangotiger.com comments dialogue)
//   - patio11 Kalzumeus reply ethic(x.com/patio11)
//   - SABR Q&A interview series(sabr.org)
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily revalidate

const PAGE_PATH = "/hey-tim";

export default function HeyTimPage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / HEY-TIM · SUBSCRIBER Q&amp;A LEDGER
            </p>
            <span
              lang="en"
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                HEY_TIM_COUNT === 1
                  ? "border-gold/60 text-gold shimmer glow-gold"
                  : "border-gold/40 text-gold/80"
              }`}
              title={
                HEY_TIM_COUNT === 1
                  ? "Year 0 pre-launch · 1 SEED entry showing format · waiting for first real visitor Q"
                  : `${HEY_TIM_COUNT} entries · APPEND-ONLY · 0 retroactive delete`
              }
            >
              {HEY_TIM_COUNT === 1
                ? `WAITING · ${HEY_TIM_COUNT} SEED`
                : `LEDGER · ${HEY_TIM_COUNT} entries`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-tight max-w-2xl mb-4">
            您 <span className="text-gold">ask</span> · Tim
            親手 <span className="text-gold">reply</span> · 公開 ledger
          </h1>
          <div className="zone27-rule max-w-[280px] mb-6" aria-hidden="true" />
          <p
            className="text-mute text-base leading-relaxed max-w-2xl mb-4"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            Bill James 2009 起 ship「Hey Bill」 — 球迷 email questions ·
            Bill 親手 reply · 公開 ledger 不藏。 15+ 年來這個 page 是 Bill
            James Online subscription 第 1 retention driver(讓人續訂的不是
            預測準度 · 是「Bill 在另一頭」 的感覺)。 ZONE 27 採同 axis
            from Year 0。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed max-w-2xl"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            包括 Tim 答錯後的 correction(certainty =「wrong-then-corrected」
            · 同 /audit DIVERGED 等大 axis)。 APPEND-ONLY · 0 retroactive
            delete · 同 /integrity rule #9(R80)mandatory-ledger discipline
            extended to Q&amp;A artifact layer · 同 Berkshire 70-year
            annual letter「無論好年壞年 都 mandatory publish」 pattern。
          </p>
          <div className="mt-6 mb-2">
            <ArticleMeta
              readingMin={3}
              sample={{ current: HEY_TIM_COUNT, threshold: 30 }}
            />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── §01 · HOW TO ASK ─────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §01 · HOW TO ASK
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6">
            兩條路徑 · 都 OK · 都 Tim 親手 reply。 1-week typical reply · 0
            reply within 7 days = published 「PENDING TIM · 7-day SLA」
            status per /integrity rule #9 binding。
          </p>
          <ol className="space-y-4 mt-4">
            <li className="border-l-2 border-gold/40 pl-4 py-2">
              <p
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-1.5"
              >
                ✉ 01 · EMAIL
              </p>
              <p className="text-bone text-sm sm:text-base leading-snug mb-1.5">
                <a
                  href="mailto:tatayngiti@gmail.com?subject=%5Bhey-tim%5D%20Your%20question%20here"
                  className="text-gold hover:underline underline-offset-4"
                >
                  tatayngiti@gmail.com
                </a>{" "}
                · subject「[hey-tim] Your Q」
              </p>
              <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
                您 OK 用全名 / 暱稱 / Anonymous · Tim publish 時 honor 您
                give 的 attribution。 0 ghostwritten reply · 0 outsourcing。
              </p>
            </li>
            <li className="border-l-2 border-gold/40 pl-4 py-2">
              <p
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-1.5"
              >
                ⌨ 02 · GITHUB ISSUE
              </p>
              <p className="text-bone text-sm sm:text-base leading-snug mb-1.5">
                <a
                  href="https://github.com/Tim-xuan-you/zone27-web/issues/new?labels=hey-tim&title=%5Bhey-tim%5D%20"
                  target="_blank"
                  rel="noopener"
                  className="text-gold hover:underline underline-offset-4"
                >
                  GitHub Issue · 標籤 hey-tim
                </a>
              </p>
              <p className="text-mute text-[12px] sm:text-sm leading-relaxed">
                公開可見 · 您 GitHub handle 自動 attribution · transparent
                from start。 Tim reply on the issue + append to ledger。
              </p>
            </li>
          </ol>
        </section>

        {/* ── §02 · LEDGER ───────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §02 · LEDGER · APPEND-ONLY · {HEY_TIM_COUNT} ENTRIES
          </p>
          <div className="mb-6 flex items-baseline gap-3 flex-wrap text-mute text-xs sm:text-sm">
            <span>
              <strong className="text-bone">{HEY_TIM_COUNT}</strong> total
            </span>
            <span className="text-mute/60">·</span>
            <span>
              <strong className="text-bone">{HEY_TIM_PENDING_COUNT}</strong>{" "}
              pending
            </span>
            <span className="text-mute/60">·</span>
            <span>
              <strong className="text-loss/85">
                {HEY_TIM_WRONG_THEN_CORRECTED_COUNT}
              </strong>{" "}
              wrong-then-corrected
            </span>
            <span className="text-mute/60">·</span>
            <span>
              <strong className="text-mute">{HEY_TIM_UNCERTAIN_COUNT}</strong>{" "}
              uncertain
            </span>
          </div>
          <ol className="space-y-8 mt-4">
            {HEY_TIM_ENTRIES.map((entry) => (
              <HeyTimEntryCard key={entry.slug} entry={entry} />
            ))}
          </ol>
          {HEY_TIM_COUNT === 1 && (
            <p
              className="text-mute/85 text-sm leading-relaxed mt-8 italic"
              style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
            >
              ⚓ Year 0 · 1 SEED entry showing format · waiting for first
              real visitor Q。 同 /year-zero + /founders/from-one-current-
              founder + FoundingMemberLedger 263 empty seats pattern · 空
              的 ledger 也是 ledger · 空 = signal。 不 fake testimonials per
              /integrity rule #11 · 不 manufacture inbound per /audit S05
              PRE-COMMIT · 等 真實 Q in。
            </p>
          )}
        </section>

        {/* ── §03 · WHY THIS PAGE ──────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §03 · WHY THIS PAGE EXISTS
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            ZONE 27 有 22 binding rules + 8 canonical ledgers + receipts +
            /letter + /year-zero · 但 0 recurring proof that Tim 是 someone
            on the other end of a line。 整 brand IP 是「trust the human」
            · 但無 visible 「Tim 親手 reply」 ritual。 此 page closes structural
            gap · 為 years 2-5 brand consistency 物理 codify · 不只 launch
            week 用。
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            Founders 27 spending NT$ 2,700 應該看到 Tim 親手 reply on dated
            entries before deciding · 不是 marketing「我們很懂台灣棒球」
            self-claim · 是 dialogue artifact 物理 codify。 Bill James
            Online sub renews 15+ years 不是因為預測 100% 對 · 是因為
            Bill 親手 reply on Hey Bill。 ZONE 27 採同 axis from Year 0。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            這也是 8th in ZONE 27 canonical append-only ledger family
            (ENGINE_OPS_LOG · ENGINE_DIFF_BEACONS · NO_PUSH_INVENTORY ·
            RECIPROCITY_LEDGER · LOCAL_STORAGE_INVENTORY · SOLO_FOUNDER_PEERS
            · LETTER_BODY/EDIT_HISTORY · HEY_TIM_ENTRIES)· 同 discipline ·
            同 Costly Signaling per Spence 1973 · 無人能 fake 200-entry
            reply log over 18 months without actually replying。
          </p>
        </section>

        {/* ── §04 · 不做 anti-pattern ─────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / §04 · 不做 ANTI-PATTERN
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6">
            此 page 結構性拒絕的 6 件事 · 配對 11 NEVER + NoPushManifest +
            22 binding rules · 不藏 hidden flexibility。
          </p>
          <ul className="space-y-3 text-mute text-sm leading-relaxed">
            <NotDoItem>
              <strong>NO comment thread / reply-button</strong> · pull not
              push · 同 /letter axiom + 11-NEVER #1 user-to-user social
              platform
            </NotDoItem>
            <NotDoItem>
              <strong>NO email subscribe form for new Q&amp;A</strong> ·
              per NoPushManifest #1-2 · reader pulls 不 push
            </NotDoItem>
            <NotDoItem>
              <strong>NO Discord / forum / live chat</strong> · 同 Pinboard
              Cegłowski 17-yr solo 拒絕 community · brand pure solo voice
            </NotDoItem>
            <NotDoItem>
              <strong>NO「Top-rated Q」 sorting / voting / popularity</strong> ·
              11-NEVER #2 streak/engagement-farming · APPEND-ONLY chronological
            </NotDoItem>
            <NotDoItem>
              <strong>NO ghostwritten / AI-generated / outsourced reply</strong> ·
              11-NEVER #11 fake testimonials · Tim 親手 only · 0 outsource
            </NotDoItem>
            <NotDoItem>
              <strong>NO retroactive edit of past Q or A</strong> · APPEND-ONLY
              · correction = NEW entry「wrong-then-corrected」 referencing
              prior slug · 同 git commit history pattern
            </NotDoItem>
          </ul>
        </section>

        <FounderSignOff signedAt="2026-05-23">
          <p>
            這個 page 是 ZONE 27 R80 W-H 「BIGGEST GAP」 closure · 沒有
            這個 page · 整個 brand IP「trust the human」 沒有 recurring proof。
            Bill James 15+ 年的 Hey Bill · 是 Bill James Online subscription
            第 1 retention driver。 我採同 axis at Year 0。
          </p>
          <p>
            您 ask · 我親手 reply · 公開 ledger · 包括我答錯的 correction。
            7-day SLA · 0 ghostwritten · 0 outsourcing · APPEND-ONLY 不
            retroactive delete · 同 /integrity rule #9 binding。
          </p>
          <p>
            如果 7 天後您沒收到 reply · 此 ledger 會顯示「PENDING TIM ·
            7-DAY SLA」 status · 違反 SLA 觸發 /receipts 紅字 entry per
            /ethics commitment #5 + #8 binding。 brand IP「方法公開 · 品味
            私藏」 8 字 grammar 物理 codify 到 dialogue artifact 層。
          </p>
        </FounderSignOff>

        {/* ── RELATED ─────────────────────────────────── */}
        <RelatedReading currentPath={PAGE_PATH} />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center border-t border-line/40 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/letter"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /letter · Tim singular voice
            </Link>
            <Link
              href="/faq"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /faq · 14 pre-anticipated Qs →
            </Link>
            <Link
              href="/integrity"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /integrity · 22 binding rules →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── HeyTimEntryCard ──
function HeyTimEntryCard({ entry }: { entry: HeyTimEntry }) {
  const certaintyLabel = formatCertaintyLabel(entry.certainty);
  const certaintyClass = formatCertaintyClass(entry.certainty);

  return (
    <li
      id={entry.slug}
      className="border-l-2 border-gold/40 pl-5 py-3 scroll-mt-20"
    >
      {/* META · date + asker + certainty */}
      <div className="flex items-baseline gap-3 flex-wrap mb-3">
        <span
          lang="en"
          className="font-mono text-mute/70 text-[10px] tracking-[0.25em] tabular"
        >
          {entry.asked}
        </span>
        <span className="text-mute/40 text-[10px]">·</span>
        <span className="font-mono text-bone/85 text-[11px] tracking-[0.15em]">
          {entry.asker}
        </span>
        <span
          lang="en"
          className={`font-mono text-[9px] tracking-[0.25em] px-1.5 py-0.5 border ${certaintyClass}`}
        >
          {certaintyLabel}
        </span>
      </div>

      {/* QUESTION */}
      <div className="mb-4">
        <p
          lang="en"
          className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-1.5"
        >
          Q · {entry.asker} asks
        </p>
        <p
          className="text-bone text-base leading-relaxed"
          style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
        >
          {entry.question}
        </p>
      </div>

      {/* ANSWER */}
      <div>
        <p
          lang="en"
          className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-1.5"
        >
          A · Tim {entry.answered ? `replied ${entry.answered}` : "pending"}
        </p>
        {entry.answered ? (
          <div className="text-mute text-sm sm:text-base leading-relaxed space-y-3">
            {entry.answer.split("\n\n").map((para, i) => (
              <p
                key={i}
                style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
              >
                {para}
              </p>
            ))}
          </div>
        ) : (
          <p
            className="text-mute/70 text-sm italic leading-relaxed"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            ⌛ PENDING TIM · 7-day SLA · 答案 published 此處 within 7 days
            of {entry.asked} · per /integrity rule #9 binding。
          </p>
        )}
      </div>

      {/* TAGS */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              lang="en"
              className="font-mono text-mute/60 text-[9px] tracking-[0.25em] px-1.5 py-0.5 border border-line/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

function NotDoItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        lang="en"
        className="font-mono text-loss/70 text-[12px] mt-0.5 shrink-0"
      >
        ✕
      </span>
      <span className="flex-1">{children}</span>
    </li>
  );
}
