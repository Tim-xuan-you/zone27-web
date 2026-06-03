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
  title: "Hey Tim · 訂閱者問答帳本 · 您問 · Tim 親手回",
  description:
    "您寄 email 來問 · Tim 親手回 · 答案公開在這 · 不藏 · 包括 Tim 答錯後的更正。只增不刪 · 不回頭刪掉 · 同 /integrity 第 9 條 · 無論問題好壞都一定公開。",
  ogTitle: "Hey Tim · 訂閱者問答 · 您問 · Tim 親手回 · ZONE 27",
  ogDescription:
    "您問 · Tim 親手回 · 公開帳本 · 不藏「我答錯了」的更正",
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
//   - FOUNDER spending NT$ 2,700 應該看到 Tim's name on dated replies
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
                  : `${HEY_TIM_COUNT} entries · 只增不刪 · 0 回頭刪改`
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
            您寄 email 來問問題 · Tim 親手回 · 答案公開在這 · 不藏。
            讓人留下來的不是預測有多準 · 是知道「另一頭真的有個人在」。
            ZONE 27 從第一天就這樣做。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed max-w-2xl"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            包括 Tim 答錯之後的更正(標記成「答錯已更正」 · 跟 /audit
            把失準的預測一樣大方公開同一個態度)。 只增不刪 · 不回頭刪掉 ·
            同 /integrity 第 9 條 · 無論問題好壞都一定公開。
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
            兩條路徑 · 都可以 · 都是 Tim 親手回。 通常一週內回 ·
            若 7 天還沒回 · 這份紀錄會公開標成「等待 Tim 回覆 · 7 天內」 ·
            見 /integrity 第 9 條。
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
            / §02 · LEDGER · 只增不刪 · {HEY_TIM_COUNT} ENTRIES
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
              ⚓ 開站第一年 · 目前只有 1 則示範 · 在等第一個真實提問。
              空的帳本也是帳本 · 空本身就是一種訊號。 我們不假造推薦 ·
              不自導自演問題 · 就等真實的問題進來。
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
            ZONE 27 有很多公開規則、公開帳本、公開收據 · 但一直沒有一個
            能持續證明「Tim 真的在另一頭」的地方。 整個品牌講的是
            「相信這個人」 · 卻沒有一個看得到「Tim 親手回覆」的固定儀式。
            這頁補上這個缺口 · 不只開站那週用 · 是往後好幾年都在。
          </p>
          <p
            className="text-mute text-base leading-relaxed mb-4"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            花 NT$ 2,700 加入 GOLD 的人 · 在決定前應該看得到 Tim
            親手、有日期的回覆 · 而不是一句「我們很懂台灣棒球」的廣告詞。
            讓人年復一年留下來的 · 從來不是預測 100% 命中 · 是有人真的會回你。
          </p>
          <p
            className="text-mute/85 text-sm leading-relaxed"
            style={{ fontFamily: "Georgia, serif", textWrap: "pretty" }}
          >
            這也是 ZONE 27 一系列「只增不刪」公開紀錄的其中一份 · 同樣的紀律。
            沒有人能假造一份累積 18 個月、上百則親手回覆的問答紀錄 ·
            除非他真的每一則都親手回了。
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
            這頁刻意不做的 6 件事 · 都先講明白 · 不留模糊空間。
          </p>
          <ul className="space-y-3 text-mute text-sm leading-relaxed">
            <NotDoItem>
              <strong>不做留言串 / 回覆鍵</strong> · 您拉內容來看 ·
              我們不推播 · 這裡不是讓使用者互相留言的社群平台
            </NotDoItem>
            <NotDoItem>
              <strong>不做新問答的 email 訂閱表單</strong> ·
              您主動來看 · 我們不推播
            </NotDoItem>
            <NotDoItem>
              <strong>不做 Discord / 論壇 / 即時聊天室</strong> ·
              一個人做 · 不開社群 · 保持單純
            </NotDoItem>
            <NotDoItem>
              <strong>不做「熱門問題」排序 / 投票 / 人氣榜</strong> ·
              只按時間順序 · 只增不刪
            </NotDoItem>
            <NotDoItem>
              <strong>不做代筆 / AI 生成 / 外包的回覆</strong> ·
              全部 Tim 親手 · 不外包
            </NotDoItem>
            <NotDoItem>
              <strong>不回頭修改過去的問與答</strong> · 只增不刪 ·
              要更正就新增一則「答錯已更正」 · 連回前一則
            </NotDoItem>
          </ul>
        </section>

        <FounderSignOff signedAt="2026-05-23">
          <p>
            沒有這頁 · 整個「相信這個人」的品牌就少了一個能持續證明的地方。
            讓人年復一年留下來的 · 不是預測多準 · 是有人真的會回你。
            ZONE 27 從第一天就這樣做。
          </p>
          <p>
            您問 · 我親手回 · 公開在這 · 包括我答錯的更正。
            7 天內回 · 不代筆 · 不外包 · 只增不刪 · 同 /integrity 第 9 條。
          </p>
          <p>
            如果 7 天後您還沒收到回覆 · 這份紀錄會標成「等待 Tim 回覆 ·
            7 天內」 · 逾時就在 /receipts 留下紅字 · 見 /ethics 第 5 與第 8 條。
            「方法公開 · 品味私藏」這 8 個字 · 一路落實到問答這一層。
          </p>
        </FounderSignOff>

        {/* ── RELATED ─────────────────────────────────── */}
        <RelatedReading currentPath={PAGE_PATH} />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center border-t border-line/40 pt-12">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /about · Tim singular voice · 7-chapter methodology
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
