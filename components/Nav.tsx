import Link from "next/link";
import ScarcityStrip from "@/components/ScarcityStrip";
import MobileNavToggle from "@/components/MobileNavToggle";
import CmdKTrigger from "@/components/CmdKTrigger";

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
  // Round 23 label fix → Round 25 路徑 fix(Tim 揭示「我就只看到加入
  // 創始會員的頁面 · 哪裡可以加入一般會員? 頁面在哪裡?」):
  // Round 23 改 label「創始會員」→「會員」但 href 仍 /founders ·
  // /founders 視覺上仍是 Founders 27 sales page · ladder 看不到。
  // Round 25 開新 route /membership = 4-tier ladder 平等視覺權重的
  // 入口頁 · Nav「會員」改指 /membership(inclusive)· /founders
  // 保留為 Founders 27 deep-dive。Key 不改(保持 active state 通用
  // 於 /membership 與 /founders 兩頁 · 都屬「會員」family)。
  { key: "founders", href: "/membership", label: "會員" },
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
              Hidden on phones — mobile has a 2-row layout below.

              Round 22 fix(Tim 問「按哪裡加入會員?」)· 5 nav items 視覺
              等重 · "創始會員" 不像 CTA · 訪客 wayfinding 失敗。Mobile
              已用 gold 填色 pill 凸顯。Desktop 改用 gold-outlined pill
              (less aggressive than mobile filled · 維持 hierarchy 但
              signal CTA) · 一眼可辨「這是 membership 入口」。 */}
          <div className="hidden sm:flex items-center gap-4 sm:gap-6 text-sm">
            {NAV_ITEMS.map((item) => {
              const isMembershipCta = item.key === "founders";
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={active === item.key ? "page" : undefined}
                  aria-label={
                    isMembershipCta ? "加入會員 · FREE TIER 免費訂閱 + BLACK CARD + Founders 27 三層 ladder" : undefined
                  }
                  className={`font-mono text-[10px] sm:text-xs tracking-[0.22em] whitespace-nowrap transition-colors inline-flex items-center gap-1.5 ${
                    isMembershipCta
                      ? active === item.key
                        ? "px-3 py-1.5 border border-gold bg-gold/10 text-gold"
                        : "px-3 py-1.5 border border-gold/50 text-gold hover:bg-gold/5 hover:border-gold"
                      : active === item.key
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
              );
            })}
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
            {NAV_ITEMS.filter((item) => item.key !== "founders").map(
              (item) => (
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
              ),
            )}
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
