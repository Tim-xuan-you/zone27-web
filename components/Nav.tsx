import Link from "next/link";
import ScarcityStrip from "@/components/ScarcityStrip";
import MobileNavToggle from "@/components/MobileNavToggle";

type NavKey =
  | "home"
  | "matches"
  | "lab"
  | "leaderboard"
  | "founders"
  | "about";

const NAV_ITEMS: {
  key: Exclude<NavKey, "home">;
  href: string;
  label: string;
  badge?: string;
}[] = [
  { key: "matches", href: "/matches", label: "賽事" },
  { key: "lab", href: "/lab", label: "實驗室", badge: "BETA" },
  { key: "leaderboard", href: "/leaderboard", label: "27 之牆" },
  { key: "founders", href: "/founders", label: "創始會員" },
  { key: "about", href: "/about", label: "關於" },
];

export default function Nav({ active }: { active?: NavKey }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <nav
        aria-label="Primary"
        className="w-full border-b border-line/60 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-6xl px-6 sm:px-10 pt-5 pb-3 sm:py-5 flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="ZONE 27 home"
            lang="en"
            className="flex items-center gap-3 group shrink-0"
          >
            <span className="font-mono text-gold text-xl tracking-[0.22em] font-medium group-hover:opacity-80">
              ZONE
            </span>
            <span className="font-mono text-bone text-xl tracking-[0.22em] font-medium group-hover:opacity-80">
              27
            </span>
          </Link>

          {/* Desktop nav · inline list with 5 items + 登入 button.
              Hidden on phones — mobile has a 2-row layout below. */}
          <div className="hidden sm:flex items-center gap-4 sm:gap-6 text-sm">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active === item.key ? "page" : undefined}
                className={`font-mono text-[10px] sm:text-xs tracking-[0.22em] whitespace-nowrap transition-colors inline-flex items-center gap-1.5 ${
                  active === item.key
                    ? "text-gold"
                    : "text-mute hover:text-gold"
                }`}
              >
                {item.label}
                {item.badge && (
                  <span
                    aria-label={`${item.label} 是 ${item.badge} 階段功能`}
                    className="px-1 py-px text-[8px] tracking-[0.15em] border border-gold/40 text-gold"
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <button
              type="button"
              aria-label="登入(尚未開放,等候 Founders 27 上線)"
              disabled
              className="px-4 py-2 border border-gold/30 text-gold/70 text-xs tracking-[0.18em] hover:bg-gold/10 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              登入
            </button>
          </div>

          {/* Mobile · 創始會員 gold CTA only (always visible). The
              secondary nav lives below on its own row to keep this
              line uncramped. */}
          <MobileNavToggle
            active={active}
            className="sm:hidden"
          />
        </div>

        {/* Mobile · 2nd row: 4 secondary nav links (excluding founders
            which is the always-visible gold pill above). Light,
            breathing, no horizontal-scroll trap. No '更多 ↓' anchor
            — Apple/Stripe/Linear all skip the 'see more' hint on
            mobile marketing pages. Visitors who want deeper pages
            scroll to footer or follow inline content links; we
            don't telegraph 'we have more pages we're hiding' which
            would contradict the [[disclosure-philosophy]] axis. */}
        <div className="sm:hidden mx-auto max-w-6xl px-6 pb-3">
          <ul className="flex items-center justify-between gap-2 text-[10px] font-mono">
            {NAV_ITEMS.filter((item) => item.key !== "founders").map(
              (item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={active === item.key ? "page" : undefined}
                    className={`tracking-[0.18em] whitespace-nowrap transition-colors inline-flex items-center gap-1 ${
                      active === item.key
                        ? "text-gold"
                        : "text-mute hover:text-gold"
                    }`}
                  >
                    {item.label}
                    {item.badge && (
                      <span
                        aria-label={`${item.label} 是 ${item.badge} 階段功能`}
                        className="px-1 py-px text-[8px] tracking-[0.15em] border border-gold/40 text-gold"
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </nav>
      <ScarcityStrip />
    </>
  );
}
