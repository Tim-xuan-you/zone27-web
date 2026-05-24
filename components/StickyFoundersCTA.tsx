"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FOUNDERS_CLAIMED,
  FOUNDERS_TOTAL,
  FOUNDERS_REMAINING,
} from "@/lib/founders-stats";

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

  useEffect(() => {
    if (!isHomepage) return;
    const onScroll = () => {
      if (window.scrollY > 600) setScrolledPastHero(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomepage]);

  if (pathname === "/founders" || pathname === "/lab/custom") return null;
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
        <Link
          href="/founders"
          className="flex items-center justify-between gap-3 px-4 py-3 group flex-1 min-w-0"
          aria-label={`加入 Founders 27 · ${FOUNDERS_CLAIMED} 已認領 · ${FOUNDERS_REMAINING} 剩 · NT$ 2,700 終身`}
        >
          <div className="flex flex-col min-w-0 flex-1">
            <span
              lang="en"
              className="font-mono text-gold text-[9px] tracking-[0.3em] leading-tight"
            >
              FOUNDERS 27 · NT$ 2,700 終身
            </span>
            <span className="font-mono text-bone text-[11px] tracking-[0.15em] tabular leading-snug mt-0.5">
              <span className="text-gold">{FOUNDERS_CLAIMED}</span>
              <span className="text-mute/60"> / </span>
              <span>{FOUNDERS_TOTAL}</span>
              <span className="text-mute/60 mx-1.5">·</span>
              <span>{FOUNDERS_REMAINING} 席</span>
              <span className="text-mute/60 mx-1.5">·</span>
              <span className="text-mute">永久關閉</span>
            </span>
          </div>
          <span
            aria-hidden="true"
            className="shrink-0 px-3 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.25em] group-active:bg-gold-soft transition-colors"
          >
            加入 →
          </span>
        </Link>

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
          className="shrink-0 border-l border-line/60 px-3 py-2 flex flex-col items-center justify-center group"
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
