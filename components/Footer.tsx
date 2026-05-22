import Link from "next/link";
import { FOUNDERS_CLAIMED, FOUNDERS_TOTAL } from "@/lib/founders-stats";

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

const FOOTER_GROUPS: FooterGroup[] = [
  {
    label: "入門",
    enLabel: "ENTRY",
    links: [
      { label: "5 分鐘入門", href: "/learn" },
      { label: "關於 ZONE 27", href: "/about" },
      // Round 27 · /membership 加入 footer ENTRY group · 訪客滾到 footer
      // 也能看到 4-tier ladder 入口 · 不只靠 Nav pill 進入。
      { label: "會員制 · 4 tier", href: "/membership" },
      // Round 29 Wave 2 · /member NEW · FREE TIER dashboard preview ·
      // Tim 反覆被問「會員頁面在哪?」這是答案 entry。
      { label: "會員儀表板預覽", href: "/member" },
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
      // Round 28 Wave 4 · /now NEW · craft journal 現在 · 位於
      // /changelog(過去)+ /roadmap(未來)中間。Linear /now + Derek
      // Sivers /now movement 對標 · 倒置 SaaS scheduled marketing。
      { label: "現在 · craft journal", href: "/now" },
      { label: "版本紀錄", href: "/changelog" },
    ],
  },
  {
    label: "信任文件",
    enLabel: "DOCS",
    links: [
      { label: "模型報告", href: "/audit" },
      { label: "技術白皮書", href: "/methodology" },
      { label: "覆蓋範圍", href: "/coverage" },
      { label: "公開戰績", href: "/track-record" },
      { label: "引擎自評", href: "/calibration" },
      { label: "Ethics Policy", href: "/ethics" },
      { label: "27 種進階指標", href: "/glossary" },
    ],
  },
  {
    label: "工具",
    enLabel: "ENGINE",
    links: [
      { label: "實驗室", href: "/lab" },
      { label: "每日早報", href: "/signal-board" },
      {
        label: "GitHub 開源",
        href: "https://github.com/Tim-xuan-you/zone27-web",
        external: true,
      },
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
          <p className="font-mono text-mute/70 group-hover:text-mute text-[9px] tracking-[0.3em] leading-relaxed transition-colors">
            由<span className="text-gold mx-1">創始會員</span>出資
            <span className="mx-2 text-mute/60">·</span>
            <span lang="en">0 GA · 0 FB Pixel · 0 Hotjar · 0 cookies set</span>
          </p>
          <p
            lang="en"
            className="font-mono text-mute/70 group-hover:text-mute text-[9px] tracking-[0.3em] mt-1.5 transition-colors"
          >
            FUNDED BY FOUNDERS · NO GA · NO PIXEL · NO HOTJAR · 0 COOKIES SET
          </p>
          {/* Round 33 W-B · regulatory framing per agent verdict:
              positions ZONE 27 in 「data publisher」 category not 「advisor」 ·
              Taiwan 投顧 license analogy defense + brand IP「方法公開 ·
              不分潤博彩」 redline 物理 codify · 同 /coverage NEVER list 延伸。 */}
          <p
            lang="en"
            className="font-mono text-mute/60 group-hover:text-mute text-[9px] tracking-[0.3em] mt-1.5 transition-colors"
          >
            公開可驗證 · 不收下注佣 · 不推薦投注 · OPEN ENGINE · NO COMMISSION · NO BET ADVICE
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
            / {FOUNDERS_TOTAL} 創始席位 ·{" "}
            <span lang="en">SYSTEM-TEST PLACEHOLDERS · Q3 取代</span>
            <span className="mx-2 text-mute/60">·</span>
            <span lang="en" className="text-mute/80 group-hover:text-gold underline-offset-4 group-hover:underline transition-colors">
              PUBLIC LEDGER →
            </span>
          </p>
        </Link>

        {/* Bottom row: brand + tagline + version chip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-gold text-sm tracking-[0.22em]">ZONE</span>
            <span className="font-mono text-bone text-sm tracking-[0.22em]">27</span>
            <span className="text-mute text-xs ml-2">© 2026</span>
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
                title="GitHub Issues · 公開 audit trail · 同 Pratfall + Disclosure axiom"
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
              v0.28 · {getTaipeiTodayChip()} TPE
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
