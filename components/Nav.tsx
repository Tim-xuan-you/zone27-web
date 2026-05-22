import Link from "next/link";
import ScarcityStrip from "@/components/ScarcityStrip";
import MobileNavToggle from "@/components/MobileNavToggle";
import MembershipNavCTA from "@/components/MembershipNavCTA";
import CmdKTrigger from "@/components/CmdKTrigger";

type NavKey =
  | "home"
  | "matches"
  | "lab"
  | "leaderboard"
  | "founders"
  | "about";

// Round 32 W-D · "founders" entry 從 NAV_ITEMS 移到 MembershipNavCTA
// (auth-aware client island)· 因 Nav 是 server component 但需要 session-
// dependent href / label · Nav 整個 async 化會 break /login「use client」
// 的 import 結構。 留 4 個 static items · founders 用 MembershipNavCTA。
const NAV_ITEMS: {
  key: Exclude<NavKey, "home" | "founders">;
  href: string;
  label: string;
  badge?: string;
}[] = [
  { key: "matches", href: "/matches", label: "賽事" },
  { key: "lab", href: "/lab", label: "實驗室", badge: "BETA" },
  { key: "leaderboard", href: "/leaderboard", label: "27 之牆" },
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

          {/* Desktop nav · 4 static items + auth-aware MembershipNavCTA +
              Cmd-K trigger. Hidden on phones — mobile has a 2-row layout
              below.

              Round 22 fix(Tim 問「按哪裡加入會員?」)· 5 nav items 視覺
              等重 · "創始會員" 不像 CTA · 訪客 wayfinding 失敗。Mobile
              已用 gold 填色 pill 凸顯。Desktop 改用 gold-outlined pill
              (less aggressive than mobile filled · 維持 hierarchy 但
              signal CTA) · 一眼可辨「這是 membership 入口」。

              Round 32 W-D fix(Tim founder-dogfood 2nd canary):「已登入
              的人點會員 button 跑到 /membership ladder · 回不去 /member」
              · MembershipNavCTA client island session probe · logged-in
              切 /member + label「您的引擎 →」。 */}
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
            <MembershipNavCTA
              active={active === "founders"}
              variant="desktop"
            />
            <CmdKTrigger />
            {/* 登入 button removed in Round 3 (Apple-minimalism pass):
                disabled button is a choice-paradox item (visitor sees it,
                wonders why, gets no payoff). Login UI returns when
                Founders 27 Q3 2026 onboarding requires it. */}
          </div>

          {/* Mobile · 創始會員 gold CTA only (always visible). The
              secondary nav lives below on its own row to keep this
              line uncramped. */}
          <MobileNavToggle
            active={active}
            className="sm:hidden"
          />
        </div>

        {/* Mobile · 2nd row: 4 secondary nav links + ⌕ palette trigger.
            Round 9 hid '更多 ↓' anchor (Apple/Stripe/Linear pattern).
            Round 12 funnel-audit: mobile visitors had NO way to access
            the 24-route Cmd-K palette (CmdKTrigger was desktop-only).
            Skeptics on phones couldn't reach /manifesto · /audit ·
            /methodology without footer-digging. Adding a tiny ⌕ icon
            as the 5th item exposes verification routes without
            telegraphing "we have hidden pages" (icon-only · power-
            user signal · same affordance as Linear / Notion / Raycast
            mobile pattern). */}
        <div className="sm:hidden mx-auto max-w-6xl px-6 pb-3">
          <ul className="flex items-center justify-between gap-2 text-[10px] font-mono">
            {NAV_ITEMS.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active === item.key ? "page" : undefined}
                  /* Round 9: py-2.5 ensures ≥44px tap target per
                     Apple HIG / WCAG 2.5.5. Was zero v-padding · agent
                     flagged 14-16px tap target. */
                  className={`py-2.5 -my-1.5 tracking-[0.18em] whitespace-nowrap transition-colors inline-flex items-center gap-1 ${
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
            ))}
            <li>
              <CmdKTrigger variant="icon" />
            </li>
          </ul>
        </div>
      </nav>
      <ScarcityStrip />
    </>
  );
}
