import Link from "next/link";

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
      { label: "常見問題", href: "/faq" },
    ],
  },
  {
    label: "品牌 IP",
    enLabel: "BRAND",
    links: [
      { label: "倒置宣言", href: "/manifesto" },
      { label: "鐵律", href: "/discipline" },
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
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-12">
        {/* ── 4-column grouped grid (Stripe/Linear/Vercel pattern) ──
            Desktop · 4 columns · Tablet · 2 · Mobile · 1
            Each group has English kicker + zh group label + 3-4 items. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10 pb-10">
          {FOOTER_GROUPS.map((group) => (
            <div key={group.enLabel}>
              <p
                lang="en"
                className="font-mono text-gold/80 text-[10px] tracking-[0.35em] mb-1"
              >
                {group.enLabel}
              </p>
              <p className="font-mono text-mute/60 text-[9px] tracking-[0.3em] mb-5">
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

        {/* Funding transparency row · Plausible-inspired anti-VC trust signal.
            Quiet, declarative, single line — visitors scrolling to footer
            silently absorb the financing model without it competing with
            navigation. Matches /manifesto Section II MONETIZATION axiom
            ("we sell identity, not utility"). */}
        <div className="text-center pb-6 border-b border-line/30">
          <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em] leading-relaxed">
            由<span className="text-gold mx-1">創始會員</span>出資
            <span className="mx-2 text-mute/40">·</span>
            無創投 · 無廣告 · 無第三方追蹤
          </p>
          <p
            lang="en"
            className="font-mono text-mute/40 text-[9px] tracking-[0.3em] mt-1.5"
          >
            FUNDED BY FOUNDERS · NO VC · NO ADS · NO TRACKERS
          </p>
        </div>

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
