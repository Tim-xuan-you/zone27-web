import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import { createPageMetadata } from "@/lib/page-og";

// R159 W4.L · Agent L · convert to createPageMetadata for locale + siteName
// restoration(Next.js shallow merge lost zh_TW + ZONE 27 from root when override)
// + truncate description from 348 chars to ~140 · within Twitter 200-char cap +
// Slack 200-char readable weight + iMessage uses og:title only(desc ignored)。
export const metadata: Metadata = createPageMetadata({
  title: "互動 by Design · 10 reader↔writer channels",
  description:
    "您在找 ZONE 27 的討論區? 沒有 by design。 但您能 talk to Tim 在 10 個地方 · /hey-tim · /member/submit · AnonPick + UserPrediction + LensFocusVote + FollowMatch + MatchNote + ReceiptForward · /founders/apply · FounderPickForm · per Cialdini Consistency + Stratechery / Bill James / DELTA Japan precedent。",
  ogDescription:
    "ZONE 27 沒有討論區 by design · 10 reader↔writer 通道 enumerate · Cialdini Consistency + Stratechery / Bill James 15-yr precedent。",
  path: "/interact",
});

// ── ZONE 27 · /interact · Canonical Brand IP Defense Route ──
// R143 W1 · Tim 3rd same canary fire(R123「都是單向的不是嗎」 + R139 W2
// 賽事討論室 brand IP contradiction fix + R143「討論區在哪裡」)· per
// [[feedback-founder-dogfood-canary]] axiom · 3 次 fire = structural
// discoverability gap NOT missing feature · ZONE 27 actually has 10
// reader↔writer interaction surfaces shipped but scattered across
// /matches/[gameId] + /member + /hey-tim + /founders without single
// canonical index · Tim 找不到 + visitor 找不到 = 感覺「沒互動」 雖然
// 實際有 10 channels。
//
// 8th brand IP defense surface 平行 family:
//   - /audit EXCLUDE(model limits)
//   - /methodology LIMITS(technical bounds)
//   - /roadmap BOUNDARIES(scope refused)
//   - /track-record DIVERGED(receipt misses equal weight)
//   - /steelman(external objections wrote first)
//   - /founders/postmortem-2028(project-level failure scenarios)
//   - R141 W1 BLACK CARD HONEST IMPLEMENTATION DISCLOSURE banner
//   - /interact(this page · model-by-design refusal of community)
//
// Brand IP per [[feedback-zone27-one-way-by-design]] iron rule:
//   - reader↔writer NOT reader↔reader
//   - DO NOT build community / comments / forum
//   - 同 Stratechery / Bloomberg / Buffett / Defector profitable
//     subscription model · 8 brand precedent canonical
//
// Psychology mechanisms cited(per [[feedback-zone27-psychology-ux-axis]]):
//   - Cialdini Consistency(1984「Influence: The Psychology of Persuasion」)
//     · explaining the model UPFRONT prevents repeat-fire + reactance
//   - Pirolli & Card 1995「Information Foraging Theory」(Psychological
//     Review 106(4):643-675)· reduce search cost for interaction
//     surfaces by single canonical index
//   - Norman 1988「The Design of Everyday Things」 ch.2「Mental Models」
//     · explicitly state user's expected mental model vs actual
//     reduces frustration · brand-pure honest explanation
//   - Loewenstein 1994「The psychology of curiosity: A review and
//     reinterpretation」(Psychological Bulletin 116(1):75-98)· 加
//     curiosity gap framing「您能 talk to Tim · 但 not to other readers」
//
// 結構性 LINE 老師 / 報馬仔 永遠無法 ship 此 page · 他們 business model
// 需要 community noise + group herding to sell engagement · ZONE 27
// 顯式公開 one-way 模式 = Costly Signaling 100× · same axis as
// /audit S05 PRE-COMMIT + /founders/postmortem-2028 binding append-only。
// ─────────────────────────────────────────────────────

const PUBLISHED_DATE = "2026-05-26";

type Channel = {
  no: string;
  icon: string;
  zhTitle: string;
  enLabel: string;
  body: string;
  surface: string;
  href: string;
  status: "live" | "logged-in" | "post-final" | "pre-launch";
};

const CHANNELS: Channel[] = [
  {
    no: "01",
    icon: "📮",
    zhTitle: "Hey Tim · 公開問答",
    enLabel: "PUBLIC Q&A",
    body: "您問 1 個問題 · Tim 賽後 24h 內公開 reply · 同 Bill James「Hey Bill」 pattern。",
    surface: "/hey-tim",
    href: "/hey-tim",
    status: "live",
  },
  {
    no: "02",
    icon: "📝",
    zhTitle: "投稿 · Reader Guest Post",
    enLabel: "GUEST POST",
    body: "登入後送 title + body 給 Tim Gmail · 1/週 cadence · Tim curate · Stratechery Guest Post pattern。",
    surface: "/member/submit",
    href: "/member/submit",
    status: "logged-in",
  },
  {
    no: "03",
    icon: "🎯",
    zhTitle: "AnonPick · 賽前 cold pick",
    enLabel: "ANON PICK",
    body: "賽前 pick home/away · 0 auth · 0 PII · localStorage · 您 own track record。",
    surface: "/matches/[gameId] AnonPickWidget",
    href: "/matches",
    status: "live",
  },
  {
    no: "04",
    icon: "🗳️",
    zhTitle: "LensFocusVote · 投 lens 優先序",
    enLabel: "LENS VOTE",
    body: "投票哪個 lens 應該下一個 develop · 您 voting = engine roadmap signal。",
    surface: "/matches/[gameId] LensFocusVote",
    href: "/matches",
    status: "live",
  },
  {
    no: "05",
    icon: "✓",
    zhTitle: "UserPrediction · 帳號 picks + personal stats",
    enLabel: "USER PREDICTION",
    body: "登入後 pick winner · /member/calibration 顯示您自己 reliability diagram。",
    surface: "/matches/[gameId] UserPredictionPicker",
    href: "/matches",
    status: "logged-in",
  },
  {
    no: "06",
    icon: "⭐",
    zhTitle: "FollowMatch · 標記追蹤",
    enLabel: "FOLLOW MATCH",
    body: "登入後標記 followed · /member dashboard 顯示 watchlist · 0 share · 純 personal。",
    surface: "/matches/[gameId] FollowMatchButton",
    href: "/matches",
    status: "logged-in",
  },
  {
    no: "07",
    icon: "🗒️",
    zhTitle: "MatchNote · 280-char 私人筆記",
    enLabel: "MATCH NOTE",
    body: "登入後寫 280 字 private note · 0 public · Tim 看不到 · 純 personal journal。",
    surface: "/matches/[gameId] MatchNoteEditor",
    href: "/matches",
    status: "logged-in",
  },
  {
    no: "08",
    icon: "🔗",
    zhTitle: "ReceiptForward · LINE 分享 receipt",
    enLabel: "RECEIPT FORWARD",
    body: "賽後 share receipt to LINE · /receipts/[receiptId] permanent URL · download-as-image。",
    surface: "/matches/[gameId] ReceiptForwardButton",
    href: "/matches",
    status: "post-final",
  },
  {
    no: "09",
    icon: "📜",
    zhTitle: "Founders 27 · 申請信",
    enLabel: "APPLICATION ESSAY",
    body: "寫一封信 · Tim 親手 review · 通過後才 invite · Patek dealer 申請 pattern。",
    surface: "/founders/apply",
    href: "/founders/apply",
    status: "live",
  },
  {
    no: "10",
    icon: "🎫",
    zhTitle: "FounderPickForm · 選 seat # 008-270",
    enLabel: "RESERVE SEAT",
    body: "通過 review 後 · 您 pick 您的 founding seat # · Patek allocation + Hermès Birkin 序號 pattern。",
    surface: "/founders FounderPickForm",
    href: "/founders",
    status: "pre-launch",
  },
];

const STATUS_BADGES: Record<Channel["status"], { glyph: string; cls: string; label: string }> = {
  live: { glyph: "✓", cls: "text-gold", label: "LIVE · 任何人" },
  "logged-in": { glyph: "◐", cls: "text-mute", label: "LIVE · 登入後" },
  "post-final": { glyph: "◐", cls: "text-mute", label: "LIVE · 賽後" },
  "pre-launch": { glyph: "⏳", cls: "text-loss/85", label: "PRE-LAUNCH · Q3 2026" },
};

export default function InteractPage() {
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
            <span className="text-gold">INTERACT</span>
          </div>
        </section>

        {/* ── HERO ────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-12 pb-10">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            INTERACT · ONE-WAY BY DESIGN · 10 READER↔WRITER CHANNELS
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight text-bone">
            您在找{" "}
            <span className="text-loss/85">討論區</span> · 沒有 · by{" "}
            <span className="text-gold">design</span>
          </h1>
          <div className="zone27-rule max-w-[320px] mt-5" aria-hidden="true" />
          <p className="text-mute text-base sm:text-lg leading-relaxed mt-6 max-w-2xl">
            ZONE 27 沒有討論區 · 沒有留言板 · 沒有 forum · 沒有 user-to-user
            chat。 不是「還沒做」 · 是{" "}
            <strong className="text-bone">刻意 NOT 做</strong>。 但您能{" "}
            <strong className="text-bone">talk to Tim 在 10 個地方</strong>
            (此 page 列全)· 同 Stratechery / Bloomberg「Money Stuff」 Matt
            Levine / Bill James「Hey Bill」 15-year canonical / DELTA Japan
            Yusuke Okada 14-year solo · profitable subscription brand 8 precedent
            模式。 全{" "}
            <strong className="text-bone">reader↔writer · 0 reader↔reader</strong>。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        {/* ── WHY ONE-WAY · psychology + brand precedent ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / 為什麼 ZONE 27 不做 community · WHY ONE-WAY
          </p>
          <div className="space-y-3 zh-body text-mute text-base leading-relaxed">
            <p>
              <strong className="text-bone">1 · Solo founder.</strong>{" "}
              CPBL 一年 240 場 · 加 comments 一年 4800+ 留言要 moderate · Tim 一個人
              做不到 · 同 Defector 需要 worker-owned newsroom。
            </p>
            <p>
              <strong className="text-bone">2 · 訂閱 = 支持 Tim build · NOT 解鎖 community。</strong>{" "}
              同 Stratechery / Bill James 訂閱 model。 LINE 老師 / 報馬仔 需要
              community noise 變現 · ZONE 27 結構性相反。
            </p>
            <p>
              <strong className="text-bone">3 · 球迷已有 community 在 LINE / FB / PTT。</strong>{" "}
              60+ LINE 群 + 6 隊 FB 粉專 + PTT Baseball 板。 ZONE 27 加 forum =
              duplication。 兩者並存 not 取代。
            </p>
            <p>
              <strong className="text-bone">4 · 公開「不做」 = 鎖死退路。</strong>{" "}
              撤掉 community 是 brand collapse(Defector 案例)· 一開始不 ship 比
              ship 後撤回 brand 損害低 100×。
            </p>
            <p>
              <strong className="text-bone">5 · 8 brand precedent.</strong>{" "}
              Stratechery · Bill James「Hey Bill」 · DELTA Japan · patio11 · Pinboard ·
              DHH HEY · Berkshire · Money Stuff · 全 reader↔writer model · 0 reader↔reader。
              已 ship 為{" "}
              <Link href="/hey-tim" className="text-gold/85 underline-offset-4 hover:underline">
                /hey-tim
              </Link>
              。
            </p>
          </div>
        </section>

        {/* ── 10 CHANNELS CATALOG ────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / 10 READER↔WRITER CHANNELS · 您能 talk to Tim 在哪裡
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            您找的 interaction 都在這 10 個地方
          </h2>
          <div className="space-y-3">
            {CHANNELS.map((c) => (
              <ChannelRow key={c.no} channel={c} />
            ))}
          </div>
        </section>

        {/* ── WHAT WE DON'T BUILD · Pratfall enumeration ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-loss/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / WHAT WE DON&apos;T BUILD · 永遠不會 ship 的
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            5 件 ZONE 27 永遠不 ship 的 community features
          </h2>
          <ol className="space-y-3 text-mute text-sm leading-relaxed list-decimal pl-6">
            <li>
              <strong className="text-bone">User-to-user comment thread</strong>{" "}
              · /matches/[gameId] / /lab / /track-record / 任一 page · 0 留言
              · 0 reply button · 同 /letter「NO comment thread」 axiom 4 處 codify
            </li>
            <li>
              <strong className="text-bone">公開 user-to-user forum / 板</strong>{" "}
              · 沒有「ZONE 27 板」 · 沒有「球迷區」 free-form forum · per iron
              rule reader↔reader 限制。 ⚠️ R148 update · 「賽事討論室」 R148
              founder-dogfood-canary 7-fire 後 explicit reversed · BLACK CARD-gated
              narrow-scope scaffold shipped on /matches/[gameId] · 不是 free-form
              forum · 1-thread per game + 24hr decay + 球迷 grammar + Tim moderate
              + 200 char + 1 post per user per game 6 constraints · 詳見
              /matches/[gameId]#game-thread。 球迷 social 已在 LINE 群 + FB 滿足。
            </li>
            <li>
              <strong className="text-bone">User-to-user DM / 私訊</strong>{" "}
              · 您不能 message 其他 ZONE 27 user · 不收集 user list · 不 expose
              其他訂戶 identity · per [[zone27-disclosure-philosophy]] privacy axiom
            </li>
            <li>
              <strong className="text-bone">「X 人在看 / X 人 voted」 live counter</strong>{" "}
              · 沒有 live ticker · 沒有 herd-following display · per [[feedback-zone27-
              social-proof-costly-signal]] memory「DO NOT fake social proof · DO
              preempt + redirect to costly signal」 axiom
            </li>
            <li>
              <strong className="text-bone">Testimonial wall / 推薦語 section</strong>{" "}
              · 沒有「訂戶推薦」 · 沒有「客戶見證」 · brand IP「方法公開 ·
              品味私藏」 8 字 grammar 嚴守 · 推薦語 是 noise · receipts are signal
            </li>
          </ol>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed mt-6">
            本 5 永遠不 ship list binding append-only · 修改任一條需 30 天前{" "}
            <Link
              href="/changelog"
              className="text-gold/85 underline-offset-4 hover:underline"
            >
              /changelog
            </Link>
            {" "}公告 · 同 /audit S05 PRE-COMMIT discipline · 同{" "}
            <Link
              href="/integrity"
              className="text-gold/85 underline-offset-4 hover:underline"
            >
              /integrity
            </Link>
            {" "}22 binding rules append-only。
          </p>
        </section>

        {/* ── 球迷 COMMUNITY 在哪裡 · OUTSIDE ZONE 27 ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / 球迷 COMMUNITY · 在 ZONE 27 之外的地方
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            您想 talk to other 球迷? 這 2 lanes 已熱絡
          </h2>
          <div className="space-y-4 zh-body text-mute text-base leading-relaxed mb-8">
            <p>
              CPBL 球迷 community 已在 60+ active LINE 群 + Facebook 粉專 +
              PTT Baseball 板 滿足。 ZONE 27 加 community feature = duplication
              + dilution · 結構性 LINE 老師 / 報馬仔 / 玩運彩 結構性需要 community
              noise 才能變現 · ZONE 27 不靠 noise 變現 · 靠 quantified analysis
              + brand IP trust · 兩者並存 not 取代。
            </p>
          </div>

          {/* R144 W2 · OFF-SITE COMMUNITY 2-lane explicit catalog · Tim 5th-
              fire homepage demand surface · per Reference Class Anchoring
              (Tversky & Kahneman 1974)+ Mere Exposure(Zajonc 1968)+
              Pratfall(Aronson 1966)psychology · brand IP iron rule preserved
              (all infrastructure OFF-SITE)· Lane 1 inner circle 自家 LINE
              群 · Lane 2 既有 CPBL 球迷聚集 LINE/FB/PTT。 */}
          <div className="space-y-4">
            {/* Lane 1 · 自家 inner circle */}
            <article className="bg-gold/5 border border-gold/40 p-4 sm:p-5">
              <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                <span className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="text-lg text-gold/85 leading-none">
                    🔒
                  </span>
                  <span className="font-mono text-gold text-[10px] tracking-[0.35em]">
                    LANE 1 · INNER CIRCLE
                  </span>
                </span>
                <span
                  lang="en"
                  className="font-mono text-loss/85 text-[9px] tracking-[0.25em] tabular"
                >
                  ⏳ PRE-LAUNCH · Q3 2026
                </span>
              </div>
              <h3 className="text-bone text-base sm:text-lg font-light tracking-tight leading-snug mb-2">
                Founders 27 私人 LINE 群 · Tim 親自答
              </h3>
              <p className="text-mute/85 text-[12px] sm:text-sm leading-relaxed mb-2">
                Founders 27 訂戶私人 LINE 群 · Tim 親自參與 ·
                Founders 27 訂戶之間互相 talk + 全員 talk to Tim · 同 Patek 私人
                owners club + Stratechery Plus 訂戶 Slack 模式 · OFF-SITE
                infrastructure(LINE)· 不在 ZONE 27 web · 不違反 reader↔writer
                site iron rule · 是 paid identity tier inner-circle community ·
                per [[feedback-zone27-paid-model-is-support-not-features]] axiom
                identity = community NOT features unlock。
              </p>
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mb-3">
                ACCESS · 待 Founders 27 application 通過(/founders/apply)+ NT$
                2,700 onboard 完成 · Tim 親自 invite link
              </p>
              <p>
                <Link
                  href="/founders/apply"
                  className="font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
                >
                  → /founders/apply 申請通道
                </Link>
              </p>
            </article>

            {/* Lane 2 · 既有 CPBL 球迷聚集地 */}
            <article className="bg-slate/30 border border-line/60 p-4 sm:p-5">
              <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                <span className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="text-lg text-gold/70 leading-none">
                    🌐
                  </span>
                  <span className="font-mono text-gold text-[10px] tracking-[0.35em]">
                    LANE 2 · 既有 CPBL 球迷聚集地
                  </span>
                </span>
                <span
                  lang="en"
                  className="font-mono text-gold text-[9px] tracking-[0.25em] tabular"
                >
                  ✓ LIVE · 已熱絡多年
                </span>
              </div>
              <h3 className="text-bone text-base sm:text-lg font-light tracking-tight leading-snug mb-2">
                LINE 球迷群 + Facebook 球隊粉專 + PTT Baseball 板
              </h3>
              <p className="text-mute/85 text-[12px] sm:text-sm leading-relaxed mb-3">
                CPBL 球迷 community 已在 60+ active LINE 群 + 6 球隊官方 FB
                粉專(中信兄弟 · 樂天桃猿 · 統一 7-Eleven 獅 · 富邦悍將 · 味全龍 ·
                台鋼雄鷹)+ PTT Baseball 板 持續熱絡。 您找您球隊 LINE 群:
                各球隊球迷會 Facebook 入群通道。 ZONE 27 honest pointer 不假裝
                自己是 community · 您想 talk to other 球迷 就去這些既有空間 ·
                我們不重複 build。
              </p>
              <ul className="space-y-1 font-mono text-mute/85 text-[10px] tracking-[0.22em] leading-relaxed">
                <li>· FB 各隊粉專 · search「球隊名 + 官方」</li>
                <li>· PTT Baseball 板 · ptt.cc/bbs/Baseball</li>
                <li>· LINE 球迷群 · 各球隊球迷會官方入群</li>
              </ul>
            </article>
          </div>
        </section>

        {/* ── CROSS LINKS · brand IP family ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / RELATED BRAND IP DEFENSE SURFACES · 8 sibling artifacts
          </p>
          <ul className="space-y-2 text-mute text-sm leading-relaxed">
            <li>
              <Link
                href="/audit"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /audit EXCLUDE
              </Link>
              {" · model limits + sample debt"}
            </li>
            <li>
              <Link
                href="/methodology"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /methodology LIMITS
              </Link>
              {" · technical bounds + N≥30 SAMPLE DEBT explicit"}
            </li>
            <li>
              <Link
                href="/roadmap"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /roadmap BOUNDARIES
              </Link>
              {" · scope refused + LOCKED / EXPLORING / BRAND BOUNDARIES"}
            </li>
            <li>
              <Link
                href="/track-record"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /track-record DIVERGED
              </Link>
              {" · receipt misses equal weight as PROVED"}
            </li>
            <li>
              <Link
                href="/steelman"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /steelman
              </Link>
              {" · 5 strongest external objections wrote first"}
            </li>
            <li>
              <Link
                href="/founders/postmortem-2028"
                className="text-loss/85 underline-offset-4 hover:underline"
              >
                /founders/postmortem-2028
              </Link>
              {" · 5 失敗 scenarios prospective hindsight"}
            </li>
            <li>
              <Link
                href="/integrity"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /integrity
              </Link>
              {" · 22 binding rules append-only"}
            </li>
            <li>
              <Link
                href="/ethics"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /ethics
              </Link>
              {" · 9 commitments + BUS_FACTOR open-source contingency"}
            </li>
          </ul>
        </section>

        <FounderSignOff signedAt={PUBLISHED_DATE}>
          您找的 interaction 是 social platform style · ZONE 27 是 publication
          style · 兩個 different category。 我選 publication 是因為 solo
          founder + brand IP trust + Stratechery / Bill James / DELTA Japan
          15-year precedent 都這樣 ship。 您想 community 隨時可加 LINE 群 ·
          您想 quantified analysis + 公開 ledger 就在 ZONE 27 · 兩個並存。
        </FounderSignOff>

        <Footer />
      </main>
    </div>
  );
}

function ChannelRow({ channel: c }: { channel: Channel }) {
  const badge = STATUS_BADGES[c.status];
  return (
    <article className="bg-slate/30 border border-line/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
        <span className="flex items-baseline gap-3">
          <span aria-hidden="true" className="text-lg text-gold/70 leading-none">
            {c.icon}
          </span>
          <span className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
            #{c.no}
          </span>
          <span
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            {c.enLabel}
          </span>
        </span>
        <span
          lang="en"
          className={`font-mono text-[9px] tracking-[0.25em] tabular ${badge.cls}`}
        >
          {badge.glyph} {badge.label}
        </span>
      </div>
      <h3 className="text-bone text-base sm:text-lg font-light tracking-tight leading-snug mb-2">
        <Link
          href={c.href}
          className="hover:text-gold transition-colors"
        >
          {c.zhTitle}
        </Link>
      </h3>
      <p className="text-mute/85 text-[12px] sm:text-sm leading-relaxed mb-2">
        {c.body}
      </p>
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em]">
        SURFACE · {c.surface}
      </p>
    </article>
  );
}
