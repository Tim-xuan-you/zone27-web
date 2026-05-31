import Link from "next/link";
import ScarcityStrip from "@/components/ScarcityStrip";
import MobileNavToggle from "@/components/MobileNavToggle";
import MembershipNavCTA from "@/components/MembershipNavCTA";
import NavLoginCTA from "@/components/NavLoginCTA";
import TierBadge from "@/components/TierBadge";
import CmdKTrigger from "@/components/CmdKTrigger";
import { getTodayMatches } from "@/lib/matches";

type NavKey =
  | "home"
  | "matches"
  | "discuss"
  | "lab"
  | "founders"
  | "about";

// Round 50 W-D · 三軸線 visual hierarchy codify · 2026-05-22 evening:
//   - conversion path = gold-outlined pill(「會員 →」 · Round 22 fix · 不動)
//   - product path    = mono text + dynamic / static status chip
//                       「賽事 · TONIGHT N」 + 「實驗室 · BETA」
//   - identity path   = pure mute text(「27 之牆」 / 「關於」)
//   - auth path       = pure mute text(「登入」 · NavLoginCTA NEW R50 W-B)
//   - power user      = icon(Cmd-K · 不在 NAV_ITEMS)
//
// Tim 26+ canary fire 高情緒 push:「點出來的頁面都是無關緊要的!」
// surface 真實 Nav cognitive load bug · 5 nav items 視覺等重 mute text ·
// 訪客 first-glance 無法 distinguish path · 必須逐字 read 中文 才能決定 ·
// O(N) cognitive 而非 O(1) visual scanning。 此 W-D ship 物理 codify 4
// nav-axis hierarchy · 訪客 1 微秒可 parse path。
//
// 「TONIGHT N」 dynamic chip 設計:
//   - server-side getTodayMatches() count(Nav 是 server component · 同
//     Footer datestamp 模式 · 0 client overhead)
//   - count > 0 顯 chip · count === 0 fallback plain「賽事」(週一 CPBL
//     off day · 季外時 自動 collapse)
//   - 80% time visible(CPBL 球季 3-11 月 · 一週 5-6 場日)· 20% time
//     hidden(off day + 季外)
//   - 不是 FOMO counter · 不違反 11 「不做」 list 第 5 條(「X of 270 sold」
//     live counter)· 賽事 數量 不是稀缺(天天有)
//
// Round 32 W-D 註解:「founders」 entry 從 NAV_ITEMS 移到 MembershipNavCTA
// (auth-aware client island)· 因 Nav 是 server component 但需要 session-
// dependent href / label。 留 4 個 static items · founders 用 MembershipNavCTA。
// R151 W1 · NUCLEAR · Tim 11-fire same canary「(賽事討論室)在哪裡? 每個人
// 在首頁就能看到!」 · 4 prior R148-R150 surfaces 不夠 visible · ADD 💬 討論室
// to Nav permanent · 永遠 visible on EVERY page · 同 axis as 賽事 / 實驗室 /
// 27 之牆 / 關於 · Tim cannot miss this · Nav 是 highest visibility surface
// 全 site。 dynamic href to today's first match #game-thread anchor ·
// fallback /interact when 0 matches today · per R148 6-constraint scaffold
// + BLACK CARD-gated brand IP 維持 minimum-violation。
const NAV_ITEMS_STATIC: {
  key: Exclude<NavKey, "home" | "founders" | "discuss">;
  href: string;
  label: string;
  badge?: string;
}[] = [
  { key: "matches", href: "/matches", label: "賽事" },
  { key: "lab", href: "/lab", label: "實驗室", badge: "BETA" },
  { key: "about", href: "/about", label: "關於" },
];

export default function Nav({ active }: { active?: NavKey }) {
  // Round 50 W-D · server-side today's match count for「賽事」 dynamic chip。
  // 0 場日子 chip 自動 hidden · Nav fallback plain「賽事」。
  const todayMatches = getTodayMatches();
  const tonightCount = todayMatches.length;
  // R175 Polymarket pivot · 移除 💬 討論室 nav item(+ 舊 #game-thread dead
  // anchor)· 討論已併入賽事頁的「看法 · 分析」(CreatorAnalysis)· 點任一場
  // 賽事即達 · nav 回到 market-first 乾淨 3 軸。
  const NAV_ITEMS = NAV_ITEMS_STATIC;

  return (
    <>
      {/* R142 W6 · skip-link moved to app/layout.tsx · WCAG 2.4.1 Bypass Blocks
          · 之前 skip-link 在 Nav 內 · 但 PreviewModeBanner renders BEFORE Nav
          in layout.tsx · 訪客 first Tab 落在 PreviewModeBanner Cancel button
          不是 skip-link · 違反 WCAG「first focusable element should be skip-
          link」 · fix · move skip-link to layout.tsx top of body before any
          other interactive element · brand IP a11y discipline 嚴肅看待。 */}
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
            {NAV_ITEMS.map((item) => {
              // Round 50 W-D · 「賽事」 dynamic「TONIGHT N」 chip · server-
              // side count from getTodayMatches · 0 場日子 collapse 回 plain。
              const showTonightChip =
                item.key === "matches" && tonightCount > 0;
              return (
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
                  {showTonightChip && (
                    <span
                      aria-label={`今晚 ${tonightCount} 場 CPBL 賽事 prediction 可看`}
                      className="px-1 py-px text-[8px] tracking-[0.15em] border border-gold/40 text-gold tabular"
                    >
                      <span lang="en">TONIGHT </span>
                      {tonightCount}
                    </span>
                  )}
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
            {/* Round 50 W-B · NavLoginCTA(auth-aware client island)·
                anonymous 顯「登入」 mono link · logged-in 隱藏(因
                MembershipNavCTA 已切「您的引擎 →」)· per 26+ canary
                fire UX root cause · Apple/Stripe/Linear/Vercel standard
                Sign-in entry 永遠 visible 模式 物理 codify。 */}
            {/* R111 W2 · TierBadge · Notion-style passive tier indicator ·
                only render when preview tier active(designer preview mode)·
                public visitor 看不到 noise · per agent locked-preview research
                Pattern 3。 */}
            <TierBadge />
            <NavLoginCTA variant="desktop" />
            <MembershipNavCTA
              active={active === "founders"}
              variant="desktop"
            />
            <CmdKTrigger />
          </div>

          {/* Mobile · LOGIN + 創始會員 gold CTA · The secondary nav
              lives below on its own row to keep this line uncramped.
              Round 50 W-B · 加 NavLoginCTA mobile variant 左邊 ·
              Apple-pattern「登入」 永遠 visible · 不再隱藏 essential entry。 */}
          <div className="sm:hidden flex items-center gap-2 shrink-0">
            <NavLoginCTA variant="mobile" />
            <MobileNavToggle active={active} />
          </div>
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
            {NAV_ITEMS.map((item) => {
              // Round 50 W-D · mobile 2nd row 同步 desktop chip pattern。
              const showTonightChip =
                item.key === "matches" && tonightCount > 0;
              return (
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
                    {showTonightChip && (
                      <span
                        aria-label={`今晚 ${tonightCount} 場 CPBL 賽事 prediction 可看`}
                        className="px-1 py-px text-[8px] tracking-[0.15em] border border-gold/40 text-gold tabular"
                      >
                        {tonightCount}
                      </span>
                    )}
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
              );
            })}
            <li>
              <CmdKTrigger variant="icon" />
            </li>
          </ul>
        </div>
      </nav>
      {/* R175 · ScarcityStrip 退出首頁(市場優先)· R178 再退出 /matches + 賽事頁
          (Polymarket:市場相關頁頂部要乾淨 · 不讓 founder 募資條變噪音擠掉市場)·
          brand 頁(/about /founders /membership 等)仍顯示 founder 稀缺條。 */}
      {active !== "home" && active !== "matches" && <ScarcityStrip />}
    </>
  );
}
