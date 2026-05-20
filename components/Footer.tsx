import Link from "next/link";

const SECONDARY_LINKS = [
  { label: "關於", href: "/about", external: false },
  { label: "方法論", href: "/methodology", external: false },
  { label: "模型報告", href: "/audit", external: false },
  { label: "覆蓋範圍", href: "/coverage", external: false },
  { label: "詞彙表", href: "/glossary", external: false },
  { label: "常見問題", href: "/faq", external: false },
  { label: "版本紀錄", href: "/changelog", external: false },
  { label: "實驗室", href: "/lab", external: false },
  { label: "每日早報", href: "/signal-board", external: false },
  { label: "GitHub 開源", href: "https://github.com/Tim-xuan-you/zone27-web", external: true },
];

const LEGAL_LINKS = [
  { label: "隱私政策", href: "/privacy" },
  { label: "服務條款", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line/40">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 py-10">
        {/* Top row: secondary links */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pb-4">
          {SECONDARY_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Legal links row */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-6 border-b border-line/30">
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
            href="/changelog"
            className="chip-pop inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-mute hover:text-gold transition-colors"
            title="View full changelog"
          >
            <span className="chip-dot w-1.5 h-1.5 rounded-full bg-gold/70 glow-gold" />
            <span>v0.27 · 2026-05-19 TPE · MLB × 引擎合體</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
