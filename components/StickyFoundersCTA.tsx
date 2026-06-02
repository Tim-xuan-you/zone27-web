"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FOUNDERS_REMAINING } from "@/lib/founders-stats";
import { readAnonPicks } from "@/lib/anon-picks";

// Sticky Founders 27 CTA Bar(mobile-only)· hidden on /founders + /lab/custom
// · hidden when sold out · homepage `/` 加 first-viewport scroll-depth gate
// (per agent 不打擾就是禮物 + Tim founder-dogfood-canary axiom · first-touch
// 30-second 不催 · scroll 過 first viewport 後才出現 = visitor 已 engage)。

export default function StickyFoundersCTA() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  // Homepage first-touch: gate sticky bar until visitor scrolls past first
  // viewport (~600px). Non-homepage routes show immediately.
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  // 漸進式 ask:沒押過的新訪客先推「免費押一邊」· 押過(已 engage)才推付費
  // (research #14 + UX L5:別對 0 經驗訪客一上來就推最貴的 Founders 2,700)。
  // SSR-safe:default false = 新訪客版 · client mount 後讀 localStorage 才切。
  const [hasEngaged, setHasEngaged] = useState(false);

  useEffect(() => {
    try {
      if (readAnonPicks().length > 0) setHasEngaged(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!isHomepage) return;
    // R125 W6 · Agent C R125 Friction 3 · scroll gate 600→400 px · per audit
    // 「homepage hero is ~400px on mobile · sticky bar at 600px misses 200px window」
    // · Apple HIG「persistent bottom bars should activate when primary CTA is
    // scrolled out of view · NOT 200px later」 · sticky CTA 更早 appear。
    //
    // R142 W7 · perf · Agent B Core Web Vitals TOP win · 之前 listener fires
    // on EVERY scroll tick · 即使 state 已 flip to true setter 是 no-op · 但
    // event 仍 cost · one-shot listener pattern · 第一次 trigger 後 self-
    // detach · 同 Vercel/Linear 標準 pattern · INP 改善 + 100s redundant
    // callbacks/session eliminated。 removed flag 防 double-remove · cleanup
    // function still handles unmount-before-trigger case。
    let removed = false;
    const onScroll = () => {
      if (window.scrollY > 400) {
        setScrolledPastHero(true);
        if (!removed) {
          removed = true;
          window.removeEventListener("scroll", onScroll);
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (!removed) {
        window.removeEventListener("scroll", onScroll);
      }
    };
  }, [isHomepage]);

  // /member* = 會員自己的儀表板 · 不對已是會員的人推招募 bar(Tim canary)
  if (
    pathname === "/founders" ||
    pathname === "/lab/custom" ||
    pathname.startsWith("/member")
  )
    return null;
  if (FOUNDERS_REMAINING === 0) return null;
  if (isHomepage && !scrolledPastHero) return null;

  return (
    <div
      role="region"
      aria-label="Sticky Founders 27 conversion CTA"
      data-print-hide="true"
      className="fixed bottom-0 inset-x-0 z-30 sm:hidden border-t border-gold/40 bg-ink/85 backdrop-blur-md"
      style={{
        // All four insets honored for landscape iPhone notches (USB-C
        // side cutout). Apple HIG requires safe-area on every edge,
        // not just bottom. Round 12 a11y sweep finding.
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <div className="flex items-stretch">
        {hasEngaged ? (
          <Link
            href="/founders"
            className="flex items-center justify-between gap-3 px-4 py-3 group flex-1 min-w-0"
            aria-label="加入 Founders 27 · NT$ 2,700 / 365 天 · 你拿 95% · 全站最低抽成"
          >
            <div className="flex flex-col min-w-0 flex-1">
              <span
                lang="en"
                className="font-mono text-gold text-[9px] tracking-[0.3em] leading-tight"
              >
                FOUNDERS 27 · NT$ 2,700 / 365 天
              </span>
              <span className="font-mono text-bone text-[11px] tracking-[0.15em] leading-snug mt-0.5">
                解鎖賣分析賺錢 · 你拿 95% · 全站最低抽成
              </span>
            </div>
            <span
              aria-hidden="true"
              className="shrink-0 px-3 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.25em] group-active:bg-gold-soft transition-colors"
            >
              加入 →
            </span>
          </Link>
        ) : (
          <Link
            href="/matches"
            className="flex items-center justify-between gap-3 px-4 py-3 group flex-1 min-w-0"
            aria-label="先免費押一邊 · 不用註冊 · 賽後看你贏不贏引擎"
          >
            <div className="flex flex-col min-w-0 flex-1">
              <span
                lang="en"
                className="font-mono text-gold text-[9px] tracking-[0.3em] leading-tight"
              >
                FREE · 不用註冊
              </span>
              <span className="font-mono text-bone text-[11px] tracking-[0.15em] leading-snug mt-0.5">
                先免費押一邊 · 賽後看你贏不贏引擎
              </span>
            </div>
            <span
              aria-hidden="true"
              className="shrink-0 px-3 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.25em] group-active:bg-gold-soft transition-colors"
            >
              押一注 →
            </span>
          </Link>
        )}

        {/* Round 50 W-B · secondary「已是會員 → 登入」 mini chip ·
            Tim 26+ canary fire UX root cause · sticky CTA mobile-only 唯一
            persistent bottom bar 之前 100% push Founders 27 · 0 alternative
            path · 已 logged-in 看到也不協調 · 未 logged-in 想登入也找不到
            entry。 加 mini login chip(border-l divider · text-only · 不
            破壞主 CTA hierarchy)· 訪客 1 tap 到 /login。 同 Apple App
            Store「Already have an account? Sign in」 pattern 延伸到 mobile
            sticky bar layer。 */}
        <Link
          href="/login"
          aria-label="已是會員 · 登入"
          /* R159 W2.J5 · Agent J · WCAG 2.5.5 Target Size + Apple HIG 44pt +
             Material 48dp · 之前 px-3 py-2 ≈ 28px tall · sub-44px tap target on
             canonical conversion bar · 加 min-h-[44px] · same standard as
             TonightMatchRail pills(R70 W-D 已遵守)。 */
          className="shrink-0 min-h-[44px] border-l border-line/60 px-3 py-2 flex flex-col items-center justify-center group"
        >
          <span
            lang="en"
            className="font-mono text-mute/70 group-active:text-gold text-[8px] tracking-[0.3em] leading-tight"
          >
            ALREADY MEMBER
          </span>
          <span className="font-mono text-mute group-active:text-gold text-[10px] tracking-[0.2em] mt-0.5 transition-colors">
            登入
          </span>
        </Link>
      </div>
    </div>
  );
}
