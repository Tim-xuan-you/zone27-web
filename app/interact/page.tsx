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
  title: "互動 · 綁戰績的討論 · 不是匿名嘴砲論壇",
  description:
    "ZONE 27 的討論綁你的戰績:押的賽前鎖死、賽後自動算帳、你的話掛在你的準度旁,嘴砲要付代價。 不做匿名免責的閒聊論壇(那 LINE / FB 已經有)。 賽事押注、分析討論、Hey Tim 公開問答、投稿、Founders 申請,全部公開可究責。",
  ogDescription:
    "ZONE 27 的討論綁戰績 · 押了賽前鎖死、賽後自動算帳、嘴砲付代價 · 不做匿名免責的閒聊論壇。",
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
//   - R141 W1 BLACK HONEST IMPLEMENTATION DISCLOSURE banner
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

// R181 · 只列真實存在的管道。 砍掉廣告已刪元件的鬼功能(LensFocusVote ·
// FollowMatchButton · MatchNoteEditor · AnonPickWidget 已刪 — 免登入押注的
// 功能 R182 併進 UserPredictionPicker / CardBetStrip · FounderPickForm 不存在)·
// 避免訪客照著去找卻什麼都沒有(比 404 更糟)。
const CHANNELS: Channel[] = [
  {
    no: "01",
    icon: "📝",
    zhTitle: "投稿 · 讀者客座",
    enLabel: "GUEST POST",
    body: "登入後把標題 + 內文寄給 Tim · Tim 親手挑選刊出。",
    surface: "/member/submit",
    href: "/member/submit",
    status: "logged-in",
  },
  {
    no: "02",
    icon: "✓",
    zhTitle: "押注 · 選一邊",
    enLabel: "PICK A SIDE",
    body: "登入後押 home/away · 賽後自動評準度(刪不掉)· 累積上海選天梯。",
    surface: "/matches",
    href: "/matches",
    status: "logged-in",
  },
  {
    no: "03",
    icon: "🗒️",
    zhTitle: "發表分析 · 選邊 + 寫看法",
    enLabel: "POST ANALYSIS",
    body: "登入後每場發一篇分析 · 押的邊賽後自動掛準/不準 · 賴不掉。",
    surface: "/matches",
    href: "/matches",
    status: "logged-in",
  },
  {
    no: "04",
    icon: "🔗",
    zhTitle: "分享賽後收據",
    enLabel: "SHARE RECEIPT",
    body: "賽後把引擎收據分享到 LINE · 永久連結 · 可存成圖。",
    surface: "/matches",
    href: "/matches",
    status: "post-final",
  },
  {
    no: "05",
    icon: "📜",
    zhTitle: "GOLD · 申請信",
    enLabel: "APPLICATION",
    body: "寫一封信 · Tim 親手審核 · 通過後才邀請加入。",
    surface: "/founders/apply",
    href: "/founders/apply",
    status: "live",
  },
];

const STATUS_BADGES: Record<Channel["status"], { glyph: string; cls: string; label: string }> = {
  live: { glyph: "✓", cls: "text-gold", label: "LIVE · 任何人" },
  "logged-in": { glyph: "◐", cls: "text-mute", label: "LIVE · 登入後" },
  "post-final": { glyph: "◐", cls: "text-mute", label: "LIVE · 賽後" },
  "pre-launch": { glyph: "⏳", cls: "text-loss/85", label: "PRE-LAUNCH · 付費上線後開放" },
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
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            互動 · 綁戰績的討論 · 不是嘴砲論壇
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.05] tracking-tight text-bone">
            這裡的討論{" "}
            <span className="text-gold">綁你的戰績</span> · 不是匿名嘴砲
          </h1>
          <div className="zone27-rule max-w-[320px] mt-5" aria-hidden="true" />
          <p className="text-mute text-base sm:text-lg leading-relaxed mt-6 max-w-2xl">
            ZONE 27 有討論 —— 但跟一般論壇不一樣:你押的{" "}
            <strong className="text-bone">賽前鎖死</strong> · 賽後{" "}
            <strong className="text-bone">自動算帳</strong> · 你寫的分析、留言都
            掛在你的<strong className="text-bone">準度旁</strong>,嘴砲要付代價。
            我們不做的是<strong className="text-bone">匿名免責的閒聊論壇</strong>
            (那個 LINE / FB / PTT 已經有)。
          </p>
          <div className="mt-6">
            <ArticleMeta readingMin={5} />
          </div>
        </section>

        {/* ── WHY ONE-WAY · psychology + brand precedent ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / 為什麼是「綁戰績」而不是「開閒聊論壇」
          </p>
          <div className="space-y-3 zh-body text-mute text-base leading-relaxed">
            <p>
              <strong className="text-bone">1 · 一個人做。</strong>{" "}
              CPBL 一年 240 場 · 開留言一年要管 4800+ 則 · Tim 一個人
              做不到。
            </p>
            <p>
              <strong className="text-bone">2 · 訂閱是支持 Tim 做下去 · 不是解鎖社群。</strong>{" "}
              靠賣明牌的生意要靠群組熱度變現 · ZONE 27 剛好相反。
            </p>
            <p>
              <strong className="text-bone">3 · 球迷的社群已經在 LINE / FB / PTT。</strong>{" "}
              60+ LINE 群 + 6 隊 FB 粉專 + PTT 棒球板。 ZONE 27 再開論壇是
              重複。 兩者並存 · 不取代。
            </p>
            <p>
              <strong className="text-bone">4 · 公開說「不做」 · 等於鎖死退路。</strong>{" "}
              開了社群再收掉 · 對品牌的傷害很大 · 一開始就不做 · 比做了再撤回
              安全得多。
            </p>
            <p>
              <strong className="text-bone">5 · 討論綁問責 · 不綁熱度。</strong>{" "}
              一般論壇靠匿名嘴砲衝熱度;ZONE 27 的討論綁在你賽前鎖死的那一手上 ——
              賽後自動算帳、賴不掉。 拿戰績說話的討論才留得下。
            </p>
          </div>
        </section>

        {/* ── CHANNELS CATALOG ────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10 border-t border-line/40">
          <p
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / 5 個參與管道 · 你能在哪裡出手
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            你的互動都在這 5 個地方
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
            className="font-mono text-loss/85 text-[10px] tracking-[0.4em] mb-4"
          >
            / 我們仍然不做的
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            就算開了討論 · 這幾件我們還是不做
          </h2>
          <ol className="space-y-3 text-mute text-sm leading-relaxed list-decimal pl-6">
            <li>
              <strong className="text-bone">匿名、不綁立場的閒聊留言</strong>{" "}
              · 你能在分析底下討論、回覆作者,但那是綁在你賽前鎖死的那一手上的
              —— 沒有「不押也能來嘴、輸了不認」的匿名免責留言。
              <span className="block mt-1 font-mono text-gold/55 text-[10px] tracking-[0.15em]">
                ↻ 2026 pivot 修訂:原文「0 留言 0 回覆鍵」· 開了綁戰績的分析討論後 · 如實改成這條界線。
              </span>
            </li>
            <li>
              <strong className="text-bone">公開的使用者論壇 / 討論板</strong>{" "}
              · 沒有「ZONE 27 板」 · 沒有自由發文的「球迷區」。
              唯一例外是 BLACK 訂閱者的「賽事討論室」 · 範圍很窄 ·
              每場一串 + 24 小時後關閉 + 200 字 + 每人每場限一篇 + Tim 親手把關 ·
              不是自由論壇 · 詳見 /matches/[gameId]#game-thread。
              球迷社群已在 LINE 群 + FB 滿足。
            </li>
            <li>
              <strong className="text-bone">使用者之間的私訊</strong>{" "}
              · 您不能傳訊息給其他 ZONE 27 使用者 · 我們不收集使用者名單 ·
              不公開其他訂戶的身分。
            </li>
            <li>
              <strong className="text-bone">「X 人在看 / X 人投票了」即時計數器</strong>{" "}
              · 沒有即時跑動的數字 · 沒有製造從眾感的顯示。
              我們不做假的社群熱度。
            </li>
            <li>
              <strong className="text-bone">推薦語牆 / 客戶見證區</strong>{" "}
              · 沒有「訂戶推薦」 · 沒有「客戶見證」。 推薦語是雜訊 ·
              公開的賽後收據才是真訊號。
            </li>
          </ol>
          <p className="font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed mt-6">
            這 5 條只增不刪 · 修改任一條需 30 天前在{" "}
            <a
              href="https://github.com/Tim-xuan-you/zone27-web/commits/main"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/85 underline-offset-4 hover:underline"
            >
              公開 GitHub commit 史
            </a>
            {" "}公告 · 同 /audit 的事前承諾做法一致 · 同{" "}
            <Link
              href="/integrity"
              className="text-gold/85 underline-offset-4 hover:underline"
            >
              /integrity
            </Link>
            {" "}的綁定規則一樣只增不刪。
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
            您想跟其他球迷聊? 這 2 條路已經很熱絡
          </h2>
          <div className="space-y-4 zh-body text-mute text-base leading-relaxed mb-8">
            <p>
              想<strong className="text-bone">純閒聊</strong>?CPBL 球迷社群已在
              60+ 個 LINE 群 + Facebook 粉專 + PTT 棒球板 —— ZONE 27 再開一個
              閒聊論壇只是重複又稀釋。 我們站內的討論不一樣:綁賽事、綁你賽前鎖死的
              那一手、賽後算帳。 靠賣明牌的生意要靠群組熱度變現,ZONE 27 不靠熱度 ·
              靠量化分析 + 公開可信。 兩者並存 · 不取代。
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
                  ⏳ PRE-LAUNCH · 付費上線後開放
                </span>
              </div>
              <h3 className="text-bone text-base sm:text-lg font-light tracking-tight leading-snug mb-2">
                GOLD 私人 LINE 群 · Tim 親自答
              </h3>
              <p className="text-mute/85 text-[12px] sm:text-sm leading-relaxed mb-2">
                GOLD 訂戶私人 LINE 群 · Tim 親自參與 ·
                訂戶之間可以互相聊 · 也能一起找 Tim。 群組開在 LINE 上 ·
                不在 ZONE 27 網站內 —— 站內是綁戰績的討論 · 這個 LINE 群是純內圈交流 ·
                兩種剛好互補。 加入身分本身就包含這個圈子 · 不是另外解鎖的功能。
              </p>
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] mb-3">
                ACCESS · 待 GOLD application 通過(/founders/apply)+ NT$
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
            / 延伸閱讀 · 我們公開弱點的其他頁面
          </p>
          <ul className="space-y-2 text-mute text-sm leading-relaxed">
            <li>
              <Link
                href="/audit"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /audit EXCLUDE
              </Link>
              {" · 模型限制 + 樣本不足"}
            </li>
            <li>
              <Link
                href="/methodology"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /methodology LIMITS
              </Link>
              {" · 技術限制 + 滿 30 場才有統計意義"}
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
                href="/integrity"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /integrity
              </Link>
              {" · 22 binding rules · 只增不刪"}
            </li>
            <li>
              <Link
                href="/ethics"
                className="text-gold/85 underline-offset-4 hover:underline"
              >
                /ethics
              </Link>
              {" · 9 項承諾 + 萬一我出事的開源備案"}
            </li>
          </ul>
        </section>

        <FounderSignOff signedAt={PUBLISHED_DATE}>
          您找的互動比較像社群平台 · ZONE 27 比較像一份刊物 · 是兩種不同的東西。
          我選刊物 · 是因為一個人做 · 也因為這樣才守得住公開可信。
          您想要社群 · 隨時可以加 LINE 群 · 您想要量化分析 + 公開戰績 ·
          就在 ZONE 27。 兩個並存。
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
