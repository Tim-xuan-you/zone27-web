import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import RelatedReading from "@/components/RelatedReading";
import IdentityCovenant from "@/components/IdentityCovenant";
import { FOUNDERS_TOTAL } from "@/lib/founders-stats";

export const metadata: Metadata = {
  title: "Why 270 · Founders 27 Decision Log",
  description:
    "Pinboard ratchet pricing + Pieter Levels public revenue + Pratfall axiom · ZONE 27 publish the historical reasoning behind 270 seats · NT$ 2,700 · 一次性 · 銀行轉帳 · 不開公開市場 · 6 questions answered with the math + the doubts · static decision log NOT live counter · brand IP triple-fire(Pratfall + Costly Signaling + Disclosure)。",
  openGraph: {
    title: "Why 270 · Founders 27 Decision Log",
    description:
      "Pinboard + Pieter Levels + Pratfall · 6 honest questions answered · static decision log · 不藏 doubts",
    images: ["/founders/opengraph-image"],
  },
};

// ── ZONE 27 · /founders/why-270 ────────────────────────
// R76 W-D · Agent A R76 SHIP C ★★★★ · Pinboard pricing ratchet history +
// Pieter Levels public revenue ratchet pattern + Pratfall axiom · ZONE 27
// publishes the historical reasoning behind 270 seats / NT$ 2,700 / one-time
// / manual bank transfer · static decision log NOT live counter · same
//「publish-the-math + publish-the-doubts」 axis as /audit S05 + /steelman。
//
// Pattern source:
//   - Pinboard.in pricing $2 + $0.01/400 signups · price IS the throttle ·
//     IS spam filter · IS visible-counter story · public mechanical no-
//     FOMO-theatre(Maciej 2010-now)
//   - Pieter Levels nomadlist $5 → $25 → $50 → $65 → annual · Twitter-public
//     price history IS the receipt of「people kept joining」(2013-now)
//   - patio11 Kalzumeus landing page → 18-28% conversion · publish landing
//     page principles + the math(2009-now)
//   - DHH/Basecamp removed signup form from homepage 2014 · page is
//     editorial NOT conversion
//
// ZONE 27 Founders 27 is FIXED 270-seat ceiling at NT$ 2,700 one-time(NOT
// ratchet)· so Pinboard ratchet mechanic unavailable · BUT Pieter Levels
// lesson IS available · publish the HISTORICAL DECISION LOG of「why 270 +
// why 2,700 + why one-time + why bank transfer」 · static reasoning · the
// math + the doubts。
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · publish reasoning visible to
//     visitor · same Defector-worker-ownership axis applied to allocation math
//   - per [[feedback-zone27-pratfall-brand-ip]] · explicitly includes doubts
//     (「what if ceiling」 + 「what if never」)· Aronson 1966 Pratfall
//   - per /audit S05 PRE-COMMIT clause · 修改任 reasoning 需 30 天前
//     /changelog 公告 · append-only Costly Signaling discipline
//   - per [[feedback-zone27-pratfall-brand-ip]] anti-pattern explicit ·
//     NOT live FOMO counter · NOT「X seats remaining」 · static decision log
//
// 不做 anti-pattern(per Agent A R76 explicit warning):
//   ✕ NO live seat counter · 11-NEVER #5 redline 永久 binding
//   ✕ NO ratchet price hike(Pinboard-style)· ZONE 27 is fixed price
//   ✕ NO scarcity theatre 「only X left · expires in Y minutes」
//   ✕ NO 「join 1000+ Founders」 social proof(no real Founder #001 yet)
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // daily revalidate

export default function FoundersWhy270Page() {
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
            <span className="text-gold">WHY 270</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-12 pb-10">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            DECISION LOG · WHY 270 · WHY 2,700 · WHY ONE-TIME · WHY BANK TRANSFER
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight text-bone">
            為什麼是{" "}
            <span className="text-gold tabular">{FOUNDERS_TOTAL}</span>{" "}
            · 不是 100 · 不是 1000?
          </h1>
          {/* Cold Gold Hairline · R54 W-C signature moat */}
          <div className="zone27-rule max-w-[320px] mt-5" aria-hidden="true" />
          <p
            lang="en"
            className="font-mono text-mute text-xs sm:text-sm tracking-[0.3em] mt-6"
          >
            PINBOARD RATCHET + PIETER LEVELS PUBLIC REVENUE + PRATFALL DOUBTS
          </p>
          <p className="editorial-dropcap mt-8 text-mute leading-relaxed">
            Pinboard.in pricing ratchet · Pieter Levels nomadlist 公開
            revenue 變動軌跡 · patio11 Kalzumeus landing page 物理數字 · 三人
            都 publish 自己的{" "}
            <strong className="text-bone">decision math + doubts</strong> ·
            ZONE 27 採同 axis · 此 page 是 {FOUNDERS_TOTAL}-seat allocation
            的 historical reasoning · 6 questions answered with the math +
            the doubts。 NOT a live counter · NOT scarcity theatre · 是
            static decision log per /audit S05 PRE-COMMIT。
          </p>
          <div className="mt-8">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── §01 · WHY 270 NOT 100 NOT 1000 ───── */}
        <Section no="01" en="WHY 270" zh="為什麼是 270 · 不是 100 · 不是 1000">
          <p>
            棒球 1 場 = 27 個出局數(perfect game)· 270 = 10 倍 · 同 ZONE 27
            brand 數字哲學 — 不是 round 100/200 行銷數字 · 是棒球數字 anchor。
          </p>
          <p>
            但 deeper reasoning:Tim 一個人 1 年能 親手 review + 親手 onboard
            的 ceiling 是多少?{" "}
            <strong className="text-bone">
              365 天 ÷ 1.35 hr per 親手 reply + audit ≈ 270 人 ceiling
            </strong>
            。 超過 270 = Tim sustainable 不來 · seat 變{" "}
            <span className="text-loss/80">空頭支票</span> · 那是 brand 自殺。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 1:Tim 可能會 hire 助理 expand 270 → 1000?{" "}
            <strong className="text-bone">不會</strong> · 11-「永遠不做」 #1
            「user-to-user social platform」 redline 衍生:Tim 不外包 onboarding ·
            違反 = brand 自殺 · per /audit S05 PRE-COMMIT。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 2:270 太少 ZONE 27 養不活?{" "}
            <strong className="text-bone">真實 case</strong> · 270 × NT$ 2,700
            = NT$ 729,000 一次性 收入 + BLACK CARD CPBL Season Pass NT$ 1,500 × N 累積 ·
            Pinboard 17 年 14K paid users 可以 sustain solo · Tarsnap 18 年
            usage-billed 可以 sustain solo · ZONE 27 採同 economic axis。
          </p>
        </Section>

        {/* ── §02 · WHY 2,700 NOT 999 NOT 9999 ─── */}
        <Section
          no="02"
          en="WHY 2,700"
          zh="為什麼是 NT$ 2,700 · 不是 NT$ 999 · 不是 NT$ 9,999"
        >
          <p>
            27 × 100 = 2,700 · 同 brand 數字哲學 anchor。 但 deeper math:
          </p>
          <p>
            BLACK CARD CPBL Season Pass NT$ 1,500/season · Founders 27 是 lifetime ·
            2-season 達 損益平衡(NT$ 2,700 ÷ NT$ 1,500 ≈ 2 seasons break-even ·
            R81 pivot 自 NT$ 299/月 · 過去 9-month break-even retired)· per
            /founders BreakEvenCell bento。
          </p>
          <p>
            R56 W-B Agent A Vector 5「9× ratio 是 INTENTIONAL」 axiom 物理 codify:
            前 {FOUNDERS_TOTAL} 人不是 customer · 是{" "}
            <strong className="text-bone">brand 共同作者</strong> + lifetime
            mission anchor · Costco 模式 應 5-10x annual fee 但 ZONE 27 刻意
            under-price · 因為買的是 identity 不是 utility。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 1:為什麼不是 NT$ 9,999 luxury tier?{" "}
            <strong className="text-bone">Defector 對標</strong> · Defector
            $79/yr ≈ NT$ 2,400/年 · Stratechery $120/yr 學生折扣到 $50/yr ·
            Ben Thompson:「I keep price low to ensure accessibility」 ·
            ZONE 27 採同 axis · NT$ 2,700 一次 ≈ NT$ 225/月 over 1 year ·
            indie sports subscription band 中段 sweet spot。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 2:為什麼不是 NT$ 999 entry-level?{" "}
            <strong className="text-bone">filter axiom</strong> · NT$ 999 too
            low = 不 filter 賭徒 / LINE 老師 audience expecting「明牌」 · NT$
            2,700 IS the filter · 不買「便宜試試」 心態的 visitor。
          </p>
        </Section>

        {/* R78 W-D · IdentityCovenant · Agent A R77 SHIP C · Bottega 1978
            「When your own initials are enough」 + Patek 1996 + Weinstein
            1963 altercasting · 4-line negative-space block · 「您會讀到這裡
            · 不是因為 ___ · 是因為 ___」 pre-casts visitor identity · drop-
            in between Section 02(WHY 2,700)+ Section 03(WHY ONE-TIME)·
            Pratfall self-selection filter · per /audit S05 PRE-COMMIT。 */}
        <IdentityCovenant />

        {/* ── §03 · WHY ONE-TIME NOT SUBSCRIPTION ── */}
        <Section
          no="03"
          en="WHY ONE-TIME"
          zh="為什麼是一次性 NT$ 2,700 · 不是 NT$ 199/月訂閱"
        >
          <p>
            Pokemon TCG 1st Edition SHADOWLESS RUN(R60 W-A)+ Patek Philippe
            Reference Number permanence(R75 W-F /receipts/[receiptId])+
            Berkshire shareholder identity 60-yr continuity grammar = ZONE 27
            Founders 27 closed-state 軸線。
          </p>
          <p>
            如果是 NT$ 199/月訂閱 · 您 cancel = identity 消失 · 編號 release ·
            transactional 不 transferable。 NT$ 2,700 一次性 closed state =
            seat permanent · 永久 binding · seat 在 Tim 過世後仍然是 seat ·
            seat 可以 transfer 給家人(per /founders/inheritance Patek
            Generations 1996 grammar)。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 1:訂閱模式 SaaS 標準 recurring revenue 更穩?{" "}
            <strong className="text-bone">brand IP「倒置 SaaS」 axiom</strong> ·
            ZONE 27 顯式 reject SaaS recurring + auto-renew · BLACK CARD
            月卡 ALSO manual ECPay(per /membership/black-card)· 不靠 lock-in
            賺 · 靠 craft 賺。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 2:NT$ 2,700 一次性 = Tim 一年只能拿 NT$ 729K · churn-proof
            但 growth cap?{" "}
            <strong className="text-bone">真實 trade-off</strong> · 是的 ·
            growth cap IS the feature 不是 bug · per /founders 「我們不靠創投
            退場」 axiom · 不需要 hockey-stick chart · 270 = Tim 1 年 ceiling。
          </p>
        </Section>

        {/* ── §04 · WHY BANK TRANSFER NOT TAPPAY ── */}
        <Section
          no="04"
          en="WHY BANK TRANSFER"
          zh="為什麼是手動銀行轉帳 · 不是 TapPay / 綠界 一鍵付款"
        >
          <p>
            Taiwan 文化 default:手動轉帳是 friction · 不是 feature。 但 ZONE 27
            把 friction 顯式 reframe 為{" "}
            <strong className="text-bone">Costly Signaling ritual</strong> ·
            per /founders「Apple Pay 一秒鐘的 commitment · 跟 10 分鐘手工匯款
            的 commitment 不是同一個東西」 axiom。
          </p>
          <p>
            10 分鐘手工匯款 + Tim 24h 內 親手 verify wire + 親手 DM ZONE27-#NNN
            = handshake not checkout。 filter the right people · 不對「明牌」
            audience 友善 · 是 intentional。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 1:TapPay 設定費 NT$ 1-3K + 2-3% per transaction · 為什麼
            不接受 small 成本?{" "}
            <strong className="text-bone">brand IP axiom</strong> · 不是成本
            問題 · 是「自動化 conversion path 對 ZONE 27 brand 是 anti-pattern」
            · per [[zone27-payment-architecture]] 「Founders 27 = 稀缺手工 ·
            BLACK CARD + 未來 commerce = 自動」 倒置 SaaS axiom 物理 codify。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 2:訪客信用卡更習慣?{" "}
            <strong className="text-bone">Pratfall surface</strong> · 是的 ·
            部分訪客會 abandon 在 wire-transfer 步驟 · 那是 brand-pure 結果 ·
            我們不對所有訪客 friendly · 對「正確 audience」 friendly ·
            per /audit S05 disclosure parity。
          </p>
        </Section>

        {/* ── §05 · WHAT IF CEILING ─────── */}
        <Section
          no="05"
          en="WHAT IF CEILING"
          zh="若 270 額滿了 · 接下來怎麼辦?"
        >
          <p>
            <strong className="text-bone">永久關閉</strong> · 不會有第二批 ·
            不會 ratchet price hike · 不會 reprint · 不會 grandfather 既有
            holders into Founders 28(不存在)。 per Pokemon TCG 1st Edition
            SHADOWLESS RUN axiom 物理 binding。
          </p>
          <p>
            265 之後 1 名 onboard · 第 270 名 onboard 後 / · /founders/ledger
            自動 close · /founders WaitlistForm 改 sunset state · BLACK CARD
            繼續 open · 整個 ZONE 27 engine 繼續 publish(per /pricing/why
            「engine FREE forever」 + R75 W-D MultiYearAnchor 2029-12-31
            durability)。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 1:錢可能 sustain 不夠 long-term?{" "}
            <strong className="text-bone">honest disclosure</strong> · 270 一
            次性 + BLACK CARD 月卡 N · 真實 sustainability 依賴 BLACK CARD ·
            per Pinboard 17-yr + Tarsnap 18-yr + Sublime Text 19-yr solo
            indie precedent(R74 W-C NonComparableAnchor 6 peers)。
          </p>
        </Section>

        {/* ── §06 · WHAT IF NEVER ───────── */}
        <Section
          no="06"
          en="WHAT IF NEVER"
          zh="若一年內 270 sell 不到一半 · 怎麼辦?"
        >
          <p>
            ZONE 27 engine 繼續 publish · /audit + /methodology + /track-record
            永久 viewable · GitHub MIT licensed · 不會 paywall · 不會 pivot
            · 不會關站 · engine FREE through 2029 binding。
          </p>
          <p>
            Tim 一年只 onboard 30 個 Founders · 那就 30 個 · 不慶祝 · 不哀號 ·
            不 adjust 270 ceiling 求 quick sell-out。 brand IP「方法公開 ·
            品味私藏」 axiom 物理 codify:速度不是 metric · craft 才是。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 1:slower-than-expected = Tim 失去 motivation?{" "}
            <strong className="text-bone">honest disclosure</strong> · Tim
            親手 reply 30 個 Founder 跟 270 個 Founder 同 commitment level ·
            per /ethics commitment #5 + 6 binding。 失去 motivation 是 Tim
            的問題 · 不轉嫁給 visitor。
          </p>
          <p className="text-mute/85 text-[13px] italic">
            ↳ doubt 2:如果 Tim 過世前 270 沒填滿?{" "}
            <strong className="text-bone">executor protocol</strong> ·
            per /ethics BUS_FACTOR + /privacy Section 6B + R75 W-G
            /founders/inheritance · Tim 配偶 + 2 兄弟姊妹 executor 接管 ·
            ledger 永久 viewable · 未填 seats 仍 open OR 凍結(executor
            decision)。 不會被 silently revoked。
          </p>
        </Section>

        <FounderSignOff>
          <p>
            這頁是 Pinboard ratchet pricing history + Pieter Levels public
            revenue ratchet + patio11 Kalzumeus landing-page-math + Pratfall
            「publish-the-doubts」 axiom 4 patterns 合成。 不是 marketing
            justification · 不是 sales objection-handling FAQ · 是 historical
            decision log + the math + the doubts。
          </p>
          <p>
            6 questions answered with explicit doubts surface · per /audit
            S05 disclosure parity。 您 read 完 6 sections · 您 conclude 自己
            ZONE 27 fit · 我 Tim 不 sell。
          </p>
          <p>
            修改 reasoning 需 30 天前{" "}
            <Link
              href="/changelog"
              className="text-gold underline-offset-4 hover:underline"
            >
              /changelog
            </Link>{" "}
            公告 · per /audit S05 PRE-COMMIT clause · 違反 = brand 信用
            collapse 永久 audit trail · same Costly Signaling discipline as
            ENGINE_DIFF_BEACONS R71 W-C + NO_PUSH_INVENTORY R73 W-D +
            RECIPROCITY_LEDGER R74 W-A + ENGINE_OPS_LOG R76 W-C pattern。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/founders/why-270" />

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
            <Link
              href="/founders/inheritance"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /founders/inheritance · Patek Generations →
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
