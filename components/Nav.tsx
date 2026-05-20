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
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-5 flex items-center justify-between gap-4">
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

          {/* Desktop nav · inline list. Hidden on phones to avoid the
              horizontal-scroll overcrowding that previously hid items
              behind a non-discoverable swipe gesture. */}
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

          {/* Mobile · primary CTA + hamburger overlay (client component) */}
          <MobileNavToggle
            items={NAV_ITEMS}
            active={active}
            className="sm:hidden"
          />
        </div>
      </nav>
      <ScarcityStrip />
    </>
  );
}
