import Link from "next/link";
import MobileNavToggle from "@/components/MobileNavToggle";
import MembershipNavCTA from "@/components/MembershipNavCTA";
import TierBadge from "@/components/TierBadge";
import SettlementBell from "@/components/SettlementBell";
import { getTodayMatches } from "@/lib/matches";

type NavKey =
  | "home"
  | "matches"
  | "soccer"
  | "pulse"
  | "discuss"
  | "lab"
  | "founders"
  | "about"
  | "member"
  | "membership";

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
// + BLACK-gated brand IP 維持 minimum-violation。
const NAV_ITEMS_STATIC: {
  key: Exclude<NavKey, "home" | "founders" | "discuss" | "soccer">;
  href: string;
  label: string;
  badge?: string;
}[] = [
  // R234 · 收掉重複的運動切換 + 修分類學(Tim 截圖抱怨「為什麼有 2 組棒球+足球」)。
  //  原本「棒球」「足球」兩格,與頁內 SportTabs(棒球 | 足球)連到完全相同的 /matches、
  //  /soccer = 同一個切換器出現兩次;而且把「運動」(內容分類)跟「脈動/實驗室/關於」
  //  (功能)混在同一排。 收成單一「賽事」入口(Polymarket / Sofascore 式:頂層是市場,
  //  棒球|足球 是市場底下、由頁內「唯一」SportTabs 切的次級分類)· 頂 Nav 一排只代表功能。
  //  世界盃可發現性改由 首頁世界盃 rail + 脈動 + Cmd-K 三路承載(比頂 Nav 一個小字更醒目)。
  { key: "matches", href: "/matches", label: "賽事" },
  // R230 · 活動脈動 = 社群 / liveness 的心臟(誰賽前鎖了哪一手、引擎對帳了哪場)· 功能層。
  //  純靜態連結 · 不在 render 時 fetch(守 R207「Nav 不 render-fetch」鐵律)。
  { key: "pulse", href: "/pulse", label: "脈動" },
  // R197 · 拿掉「實驗室 BETA」badge(蒙地卡羅是全世界在用的成熟方法 · 不是 beta)。
  { key: "lab", href: "/lab", label: "實驗室" },
  { key: "about", href: "/about", label: "關於" },
];

export default function Nav({ active }: { active?: NavKey }) {
  // 🔴 R207 CRITICAL fix · Nav 全站每頁都有。 原本 `await getTodayMatchesAllLeagues()`
  // 在 render 期間 fetch MLB。 當 Nav 被「client component」頁面(如 /login)render 時,
  // 這個 render-time async = uncached promise → React 每次 re-render 都 re-suspend →
  // 打字每個鍵都讓輸入框失焦(Tim「每打一字就跳掉、要用滑鼠重點才能打下一字」的真 bug ·
  // 全站客戶端頁面通用 · console 報 "A component was suspended by an uncached promise")。
  // 改成「同步」算今日場數:只 CPBL(getTodayMatches · 同 aria-label「CPBL 賽事」· 0 場
  // 自動 collapse)· Nav 不再 render 時 fetch · MLB 在 /matches 看板上仍完整顯示。
  const tonightCount = getTodayMatches().length;
  // R175 Polymarket pivot · 移除 💬 討論室 nav item(+ 舊 #game-thread dead
  // anchor)· 討論已併入賽事頁的「看法 · 分析」(CreatorAnalysis)· 點任一場
  // 賽事即達 · nav 回到 market-first 乾淨 3 軸。
  const NAV_ITEMS = NAV_ITEMS_STATIC;

  // R234 · /matches · /soccer · /matches/mlb 都收在單一「賽事」入口底下(運動切換交給頁內
  //  SportTabs)→ 任一進來都高亮「賽事」那一格(soccer 的 active 映射到 matches)。
  const isActive = (key: string) =>
    active === key || (key === "matches" && active === "soccer");

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
              等重 · "會員" 不像 CTA · 訪客 wayfinding 失敗。Mobile
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
                  aria-current={isActive(item.key) ? "page" : undefined}
                  className={`font-mono text-[10px] sm:text-xs tracking-[0.22em] whitespace-nowrap transition-colors inline-flex items-center gap-1.5 ${
                    isActive(item.key)
                      ? "text-gold"
                      : "text-mute hover:text-gold"
                  }`}
                >
                  {item.label}
                  {showTonightChip && (
                    <span
                      aria-label={`今日 ${tonightCount} 場 CPBL 賽事可看`}
                      className="px-1 py-px text-[8px] tracking-[0.15em] border border-mute/40 text-mute tabular"
                    >
                      今日 {tonightCount}
                    </span>
                  )}
                  {item.badge && (
                    <span
                      aria-label={`${item.label} 是 ${item.badge} 階段功能`}
                      className="px-1 py-px text-[8px] tracking-[0.15em] border border-mute/40 text-mute/70"
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
            {/* R231 · 結算鈴鐺(client island · R207-safe · 登入且有新結算才顯)· 擺在
                會員入口左邊 = 像每個 app 的帳號旁通知數 · anon/0 新自動隱藏。 */}
            <SettlementBell />
            {/* R199 · 單一 auth 鈕(anon「登入」→ /login · 登入後「您的引擎」→ /member)·
                原本另一顆 NavLoginCTA「登入」已刪(Tim「兩顆同一件事 · 選一個」)。 */}
            <MembershipNavCTA
              active={active === "founders"}
              variant="desktop"
            />
          </div>

          {/* Mobile · 單一 auth gold CTA(MobileNavToggle = MembershipNavCTA mobile)·
              anon「登入」→ /login · 登入後「您的引擎」→ /member。 R199 收掉重複的
              NavLoginCTA(Tim「登入 + 會員 兩顆同一件事 · 選一個」)· 仍永遠 visible。 */}
          <div className="sm:hidden flex items-center gap-2 shrink-0">
            {/* R231 · 結算鈴鐺 mobile(登入且有新結算才顯 · 擺在會員 CTA 左邊)。 */}
            <SettlementBell />
            <MobileNavToggle active={active} />
          </div>
        </div>

        {/* Mobile · 2nd row: secondary nav links（R255 砍掉整層鍵盤 power-user
            殼:⌘K 快搜 chip + 手機 ⌕ + g-mode 捷徑全移除 —— Tim「國小生想逛 ·
            Polymarket 沒這套 · 工程師感」· 一般球迷用點的、不用搜)。 */}
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
                    aria-current={isActive(item.key) ? "page" : undefined}
                    /* Round 9: py-2.5 ensures ≥44px tap target per
                       Apple HIG / WCAG 2.5.5. Was zero v-padding · agent
                       flagged 14-16px tap target. */
                    className={`py-2.5 -my-1.5 tracking-[0.18em] whitespace-nowrap transition-colors inline-flex items-center gap-1 ${
                      isActive(item.key)
                        ? "text-gold"
                        : "text-mute hover:text-gold"
                    }`}
                  >
                    {item.label}
                    {showTonightChip && (
                      <span
                        aria-label={`今日 ${tonightCount} 場 CPBL 賽事可看`}
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
          </ul>
        </div>
      </nav>
      {/* R187 · 整個移除頂部「7/270 創始編號」稀缺條(ScarcityStrip)· per Tim
          dogfood「不想要前 270 · 太複雜 · 用戶一頭霧水」· chrome 改 Polymarket 式乾淨。
          稀有感改由 /membership「BLACK 會員」承載 · 不再用全站倒數條轟炸。 */}
    </>
  );
}
