import Link from "next/link";
import { FOUNDERS_CLAIMED, FOUNDERS_TOTAL } from "@/lib/founders-stats";
import CadencePulseChip from "@/components/CadencePulseChip";

// Server-side Taipei today. Footer is a server component, so this
// re-evaluates on each render — meaning every static-built page is
// fresh as of the most recent deploy, and every ISR page is fresh
// as of the most recent revalidate. Replaces a hardcoded date that
// was already 1+ day stale by the time anyone saw it.
function getTaipeiTodayChip(): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Taipei",
  }).format(new Date());
}

// ── Footer link groups · 4-column grid pattern ───────────
// Research source: Stripe.com, Linear.app, Vercel.com all use
// multi-column grouped footers (Stripe Sessions 2026 docs +
// Vercel Geist design system). Previous single-row flex-wrap
// got cluttered at 13 links — visitors scanning Footer have
// no logical anchors, just an alphabet soup.
//
// Grouping principle: by user intent + journey stage:
//   ENTRY · for newcomers landing for the first time
//   BRAND IP · the philosophy / canon pages
//   TRUST DOCS · the verification / disclosure artifacts
//   ENGINE · the actual product + reference + external
// ─────────────────────────────────────────────────────

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterGroup = {
  label: string;
  enLabel: string;
  links: FooterLink[];
};

// Round 50 W-E · 2026-05-22 evening · Footer F-pattern reorder · per
// Nielsen Norman 1997 canonical「visitors don't read · they scan」 +
// Tim 26+ canary fire 高情緒「點出來的頁面都是無關緊要的」 surface 真實
// footer-order bug:
//   - 原 column 1 = ENTRY(6 個 onboarding items 第一眼)
//   - 原 column 4 = ENGINE(3 個 product items 反而最後)
//   - 「/matches」 routes(/matches · /matches/mlb · /matches/cpbl-260521-01)
//     completely missing from footer · 訪客 scroll 到底 footer 找不到「賽事」
//
// W-E fix · F-pattern reading aligned to fan-first audience axiom:
//   - column 1 = PRODUCT(賽事 · 引擎)· 5 items 含 /matches + /lab + 等
//   - column 2 = DOCS(信任文件)· 8 trust artifacts(W-A 加 /methodology/diff)
//   - column 3 = ENTRY(入門)· 6 onboarding items
//   - column 4 = BRAND(品牌 IP)· 5 identity items
//
// 訪客 F-pattern desktop scan left-to-right · 第一眼 product · 第二 trust ·
// 第三 onboarding · 第四 identity。 Mobile flatten 同樣順序。 對 fan
// filter-in:product first ✓ · trust second ✓。 對 賭徒 filter-out:column
// 2 trust artifacts(/audit + /ethics + /steelman 等)第二眼出現 = 自然
// filter-out signal。
//
// Brand IP unchanged:
//   · BRAND 5 items 完整保留(只 column position 從 column 2 → column 4)
//   · 不違反 [[feedback-zone27-audience-fans-not-engineers]]
//   · 對齊 R50 W-C homepage funnel invert · 同 pattern「product-first 順序」
//     物理 codify 到 footer layer
const FOOTER_GROUPS: FooterGroup[] = [
  {
    // Round 52 W-A · Agent 3 #8 fix · Footer PRODUCT column 升 column 1
    // 是 R50 W-E ship 已修 · 但 visitor 沒 sense「why product first」 ·
    // 加 enLabel「FOR FANS」 explicit framing · 對 hardcore baseball fan
    // audience grammar 「我們先 surface 賽事 因為您是 fan 不是 engineer」 ·
    // brand IP「audience-fans-not-engineers」 axiom 物理 codify 到 footer。
    label: "賽事 · 引擎",
    enLabel: "FOR FANS",
    links: [
      // Round 50 W-E · 加 /matches + /matches/mlb 兩個 footer product
      // entries · 之前 footer 0 個賽事入口 · 訪客 scroll 到底 完全
      // 找不到「今日 CPBL」。 修。 Order priority:今日賽事 > MLB > 引擎 >
      // 早報 > GitHub > RSS。
      { label: "今日 CPBL 賽事", href: "/matches" },
      { label: "MLB · 即時資料", href: "/matches/mlb" },
      { label: "模擬實驗室 · 1 萬次跑", href: "/lab" },
      { label: "CPBL 投手排行 · 6 stats", href: "/cpbl-pitchers" },
      { label: "CPBL 6 隊伍 · aggregation", href: "/cpbl-teams" },
      { label: "海選天梯 · 準度排行", href: "/ladder" },
      // R167 W1b · /signal-board DELETED · daily promise we don't keep · per Agent P TIER B #7 + Tim canary 3
      // Round 51 W-E · Atom RSS /feed.xml ship · 給 hardcore fan RSS reader
      // audience subscribe · 同 Stratechery / FanGraphs / Baseball Savant
      // pattern · 0 tracking · client-pulled · 不靠 email。
      { label: "RSS · Atom feed", href: "/feed.xml", external: true },
      {
        label: "GitHub 開源",
        href: "https://github.com/Tim-xuan-you/zone27-web",
        external: true,
      },
    ],
  },
  {
    // R88 simplification · DOCS column 10 → 6 essentials cut per Tim
    // 「不要那麼雜」 mandate · 4 secondary entries移除 from primary footer
    // surface · 仍可 access via Cmd-K palette + Transparency aggregator
    // cross-links · brand IP 守住 per pratfall axiom(pages exist · 只
    // 不 surface in primary footer)。 cut:
    //   - 引擎 diff · v0.2 → v0.3(deep technical · /methodology cross-link)
    //   - 覆蓋範圍(/coverage · /audit cross-link)
    //   - 引擎自評(/calibration · /track-record cross-link)
    //   - 27 種進階指標(/glossary · /learn cross-link)
    label: "信任文件",
    enLabel: "DOCS",
    links: [
      { label: "模型報告", href: "/audit" },
      { label: "技術白皮書", href: "/methodology" },
      { label: "公開戰績", href: "/track-record" },
      { label: "引擎自評 · 準不準", href: "/calibration" },
      { label: "Ethics Policy", href: "/ethics" },
      { label: "Steelman", href: "/steelman" },
      // R109 W3 · Agent conversion audit finding · /integrity orphaned from
      // primary footer · canonical 22 binding rules + 13 redlines + 9
      // commitments page · 違反「方法公開」 axiom 把最 binding Pratfall
      // artifact 藏在 Cmd-K · 加入 DOCS column 與其他 trust artifact 並列。
      { label: "永遠不變 22 件事", href: "/integrity" },
      // R116 W2 · per R115 agent「brand-IP-pure social proof」 research Ship 1
      // · /annual NEW Berkshire-pattern 10-year chronological index page(R116
      // W1)· 未發行 placeholders 公開 binding 未來 Tim · 同 berkshirehathaway.com/
      // letters/letters.html 60-year pattern · trust artifact category · 加入
      // DOCS column 與 其他 binding pages 並列。
      { label: "Annual Reports · 10 年連續", href: "/annual" },
    ],
  },
  {
    label: "入門",
    enLabel: "ENTRY",
    links: [
      { label: "5 分鐘入門", href: "/learn" },
      // R160 W2.O5 · Agent O Gap 5 · /interact to Footer ENTRY column ·
      // canonical reader↔writer 10 channels surface(per [[feedback-zone27-
      // one-way-by-design]] R148 narrowed scope)· 之前只 Cmd-K + homepage
      // inline link · footer 滾到底 訪客 找「怎麼聯繫 Tim」 dead-end · /interact
      // section 03 cross-links to /hey-tim solving 2 navigation gaps with 1 ship。
      { label: "與 Tim 互動 · Hey Tim", href: "/interact" },
      { label: "關於 ZONE 27", href: "/about" },
      // Round 50 W-B · 2026-05-22 · Tim 26+ canary fire UX root cause ·
      // /login footer entry 是 Nav LOGIN button + Cmd-K 之外的第三條路 ·
      // 訪客滾到 footer 找 ACCOUNT entry 是 Apple/Stripe 訪客行為標準 ·
      // 此 entry 必須存在。
      { label: "登入 / 註冊", href: "/login" },
      // Round 27 · /membership 加入 footer ENTRY group · 訪客滾到 footer
      // 也能看到 4-tier ladder 入口 · 不只靠 Nav pill 進入。
      { label: "會員制 · 4 tier", href: "/membership" },
      // Round 29 Wave 2 · /member NEW · FREE TIER dashboard preview ·
      // Tim 反覆被問「會員頁面在哪?」這是答案 entry。
      { label: "您的儀表板", href: "/member" },
      { label: "常見問題", href: "/faq" },
    ],
  },
  {
    label: "品牌 IP",
    enLabel: "BRAND",
    links: [
      { label: "倒置宣言", href: "/manifesto" },
      { label: "鐵律", href: "/discipline" },
      { label: "公開路線圖", href: "/roadmap" },
      { label: "版本紀錄", href: "/changelog" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "隱私政策", href: "/privacy" },
  { label: "服務條款", href: "/terms" },
];

export default function Footer() {
  return (
    <footer
      id="site-footer"
      className="mt-auto border-t border-line/40 scroll-mt-4"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-8 sm:py-12">
        {/* ── 4-column grouped grid (Stripe/Linear/Vercel pattern) ──
            Desktop · 4 columns · Tablet · 2 · Mobile · HIDDEN
            Round 5: stacking 18 links on mobile = 1.5 viewport of
            scroll for the footer alone. Nav already has mobile
            bottom row with 4 main items; this grid duplicates that.
            Mobile users navigate via Nav + Cmd-K + sticky CTA;
            footer on mobile = legal + brand only. */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 pb-10">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.enLabel}>
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-1"
              >
                {group.enLabel}
              </p>
              <p className="font-mono text-mute/80 text-[9px] tracking-[0.3em] mb-5">
                {group.label}
              </p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-mute hover:text-gold text-[11px] tracking-[0.18em] transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-mono text-mute hover:text-gold text-[11px] tracking-[0.18em] transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal links row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-6 pb-3 border-t border-line/30">
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-mute hover:text-gold text-[9px] tracking-[0.35em] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Funding transparency row · Plausible/HEY anti-VC trust signal.
            Quiet, declarative — visitors scrolling to footer silently
            absorb the financing model. Matches /manifesto Section II
            MONETIZATION axiom ("we sell identity, not utility").

            Round 12 brand-IP amplification (Agent A #3 · HEY Spy Trackers
            pattern): upgrade from generic "無第三方追蹤" to SPECIFIC
            tracker names (GA · FB Pixel · Hotjar). Each named absence
            is a hardcoded commitment we can never quietly install
            later · the specificity IS the trophy. Whole strip links
            to /privacy where the full anti-tracker inventory lives. */}
        <Link
          href="/privacy"
          className="block text-center pb-6 border-b border-line/30 group hover:bg-slate/10 transition-colors -mx-6 sm:-mx-10 px-6 sm:px-10 py-2"
          aria-label="我們不追蹤您 · 完整 anti-tracker inventory 見 /privacy Section 03"
        >
          {/* Round 51 W-C · Agent 2 #3 WCAG AA fix · text-mute/60-70 at 9px
              on navy bg fail 4.5:1 contrast。 Bump text-mute/70 → text-mute/85
              (5.2:1 ✓ AA pass)· text-mute/60 → text-mute/85 同步。 Decorative
              `·` divider 加 aria-hidden="true" 防 screen reader spurious read。 */}
          {/* Round 56 W-A · Agent A Vector 4 fix · CRITICAL · 之前「0 cookies
              set」 是 publicly indefensible · Supabase Auth 設 sb-access-token +
              sb-refresh-token session cookies(essential for /login flow)·
              devtools 5 秒可 debunk · 違反 brand IP「方法公開 · 不誇大」 axiom。
              改為「0 tracking cookies」 + explicit auth session disclosure ·
              brand-IP-pure transparency · 不藏 essential infrastructure cookie。 */}
          <p className="font-mono text-mute/85 group-hover:text-mute text-[9px] tracking-[0.3em] leading-relaxed transition-colors">
            由<span className="text-gold mx-1">創始會員</span>出資
            <span aria-hidden="true" className="mx-2 text-mute/60">·</span>
            <span lang="en">0 GA · 0 FB Pixel · 0 Hotjar · 0 tracking cookies</span>
          </p>
          <p
            lang="en"
            className="font-mono text-mute/85 group-hover:text-mute text-[9px] tracking-[0.3em] mt-1.5 transition-colors"
          >
            FUNDED BY FOUNDERS · NO GA · NO PIXEL · NO HOTJAR · NO TRACKING COOKIES
          </p>
          {/* Round 33 W-B · regulatory framing per agent verdict:
              positions ZONE 27 in 「data publisher」 category not 「advisor」 ·
              Taiwan 投顧 license analogy defense + brand IP「方法公開 ·
              不分潤博彩」 redline 物理 codify · 同 /coverage NEVER list 延伸。 */}
          <p
            lang="en"
            className="font-mono text-mute/85 group-hover:text-mute text-[9px] tracking-[0.3em] mt-1.5 transition-colors"
          >
            公開可驗證 · 不收下注佣 · 不推薦投注 · OPEN ENGINE · NO COMMISSION · NO BET ADVICE
          </p>
          {/* R78 W-F-2 · BequestLine · Agent A R78 SHIP D · Patek 1996「you
              never own · look after for next generation」 + Belk 1988 Extended
              Self bequeathal mechanism + R77 ENGINE_OPS_LOG continuity ·
              1-line footer addendum site-wide · Belk bequeathal activates
              for EVERY page visitor passively(not just /heritage explicit
              readers)· solo-founder Pratfall + Patek Generations 在 literal
              footer 物理 codify · per /ethics #3 GitHub MIT licensed binding
              + R75 W-D MultiYearAnchor「Tim 失蹤 30 days → GitHub repo open-
              sources within 30 days」 multi-year durability statement。 */}
          <p className="font-mono text-mute/80 group-hover:text-mute text-[9px] tracking-[0.28em] mt-1.5 transition-colors leading-relaxed">
            <span aria-hidden="true" className="text-gold/70 mr-1">▌</span>
            ZONE 27 ledger 將在 Tim 退場後由社群繼承 · 程式碼公開 · 帳本附加 · 球迷世代延續
          </p>
        </Link>

        {/* ── Round 38 W-F · Founders count static row · Agent A #5 ship
            Plausible「18k subscribers · 260B pageviews」 + Are.na「18,791
            people support Are.na」 pattern · 公開 數字 但 NOT 動畫 · NOT
            live counter · NOT FOMO · 靜態 · Costly Signaling「小數字也願
            意公開」 brand IP · 同 [[zone27-disclosure-philosophy]] 延伸 ·
            一旦真實 founders Q3 onboard 後此 row 數字自動更新(因 import
            from claimedFounders.length)· 不需 component change。 */}
        <Link
          href="/founders/ledger"
          className="block text-center pt-2 pb-3 group hover:bg-slate/10 transition-colors -mx-6 sm:-mx-10 px-6 sm:px-10"
          aria-label="Founders 27 公開分配帳本 · /founders/ledger 完整 process transparency"
        >
          <p className="font-mono text-mute/70 group-hover:text-mute text-[9px] tracking-[0.3em] transition-colors">
            <span lang="en" className="text-gold">{FOUNDERS_CLAIMED}</span>{" "}
            / {FOUNDERS_TOTAL} 創始編號 ·{" "}
            <span lang="en">SYSTEM-TEST PLACEHOLDERS · Q3 取代</span>
            <span className="mx-2 text-mute/60">·</span>
            <span lang="en" className="text-mute/80 group-hover:text-gold underline-offset-4 group-hover:underline transition-colors">
              PUBLIC LEDGER →
            </span>
          </p>
        </Link>

        {/* R67 W-C · CadencePulseChip compact · between Founders row +
            brand bottom row · Zajonc Mere Exposure reframed · NOT「下週
            更新」 cadence promise(/now 已 explicit reject pattern)·
            純 「LAST SHIPPED · X 天前 · 節奏不承諾 · /changelog」 honest
            anchor。 訪客每次 scroll 到 Footer 看到 ship date(無聲 Mere
            Exposure)without subscription CTA。 */}
        <div className="flex items-center justify-center pt-4 pb-3 border-t border-line/30">
          <CadencePulseChip variant="compact" />
        </div>

        {/* Bottom row: brand + tagline + version chip */}
        {/* R134 W1 · Stratechery「by [Founder]」 solo-author identity signal
            pattern · Agent A R125 SHIP 5 deferred · finally transplant · 加
            「by Tim」 byline 到 Footer brand bottom row · Stratechery「by Ben
            Thompson」 + patio11「by Patrick McKenzie」 + Substack「by [author]」
            pattern · solo-founder identity = trust signal at every page bottom ·
            brand IP「方法公開」 axiom · founder personal accountability 物理
            codify · per [[feedback-zone27-paid-model-is-support-not-features]]
            memory canonical「pay to fund Tim build · NOT to unlock features」
            same axis · single-word addition · 0 chrome bloat。 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-gold text-sm tracking-[0.22em]">ZONE</span>
            <span className="font-mono text-bone text-sm tracking-[0.22em]">27</span>
            <span className="text-mute text-xs ml-2">© 2026</span>
            <span aria-hidden="true" className="text-mute/40 text-xs">·</span>
            <span
              lang="en"
              className="font-mono text-mute/85 text-[10px] tracking-[0.22em]"
              title="ZONE 27 by Tim · solo founder · per /audit DISCLOSURE 100% TIM solo equity · same axis as Stratechery by Ben Thompson · 404 Media by 4 journalists · DELTA Japan by Yusuke Okada"
            >
              by Tim
            </span>
          </div>
          <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] text-center">
            為讀懂數字的人而建 ·{" "}
            <span lang="en">BUILT FOR THOSE WHO READ THE NUMBERS</span>
            <br className="sm:hidden" />
            <span className="sm:ml-3">
              發現 bug / 建議 →{" "}
              <a
                href="https://github.com/Tim-xuan-you/zone27-web/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mute hover:text-gold underline-offset-4 hover:underline transition-colors"
                title="發現問題或建議 · 開一個 GitHub Issue 給 Tim"
              >
                GitHub Issue
              </a>
            </span>
          </p>
          <a
            href="https://github.com/Tim-xuan-you/zone27-web/commits/main"
            target="_blank"
            rel="noopener noreferrer"
            className="chip-pop inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute hover:text-gold transition-colors"
            title="完整版本歷史 — GitHub commits (source of truth)"
          >
            <span className="chip-dot w-1.5 h-1.5 rounded-full bg-gold/70 glow-gold" />
            <span>
              v0.29 · {getTaipeiTodayChip()} TPE
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
