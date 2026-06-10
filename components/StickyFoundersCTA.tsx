"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// ── Sticky 免費加入 CTA Bar(mobile-only)· R188 · 登入感知 ───────────
// R188(2026-06-03 · Tim「要註冊才能押」)· 押注 + 跑引擎都要免費會員 → 這條
// mobile sticky bar 從舊的「先免費押一邊(免登入)」改成「免費加入會員」前門:
//   · 沒登入 → 推「免費加入 · 押注+跑引擎」→ /login(整站的免費前門)
//   · 已登入 → 不顯示(不對已是會員的人推入會 · per 會員介面極簡鐵律)
// hidden on /founders + /lab/custom + /member · homepage 加 first-viewport
// scroll-depth gate(first-touch 30 秒不催 · scroll 過 hero 才出現)。
// 之前用 anon-picks 判斷 hasEngaged · 免登入押注拿掉後改用 session 判斷。
export default function StickyFoundersCTA() {
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  // Homepage first-touch: gate sticky bar until visitor scrolls past first
  // viewport (~400px). Non-homepage routes show immediately.
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  // 登入感知:checking → 不顯示(避免閃錯狀態)· guest → 顯示前門 · member → 不催。
  // SSR-safe:default "checking" · client mount 後 probe session 才切。
  const [memberState, setMemberState] = useState<"checking" | "guest" | "member">(
    "checking",
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled) setMemberState(data.session ? "member" : "guest");
      } catch {
        if (!cancelled) setMemberState("guest");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isHomepage) return;
    // R125 W6 · scroll gate 400px · sticky CTA 在 primary CTA 滑出視窗後才出現。
    // R142 W7 · one-shot listener · 第一次 trigger 後 self-detach(INP 改善)。
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

  // 會員自己的儀表板 + 付費深度頁 + power-user form 頁不顯示
  if (
    pathname === "/founders" ||
    pathname === "/lab/custom" ||
    pathname.startsWith("/member")
  )
    return null;
  // 已登入(或還在確認)→ 不對已是會員的人推入會(per 會員介面鐵律)
  if (memberState !== "guest") return null;
  if (isHomepage && !scrolledPastHero) return null;

  // 登入後送回他正在看的運動(在 /soccer 看世界盃 → 回 /soccer · 不硬拉去棒球板)。
  const nextDest = pathname.startsWith("/soccer") ? "/soccer" : "/matches";

  return (
    <div
      role="region"
      aria-label="免費加入 ZONE 27 會員"
      data-print-hide="true"
      className="fixed bottom-0 inset-x-0 z-30 sm:hidden border-t border-gold/40 bg-ink/85 backdrop-blur-md"
      style={{
        // Apple HIG · safe-area on every edge for notched landscape。
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
      }}
    >
      <div className="flex items-stretch">
        <Link
          href={`/login?next=${nextDest}`}
          className="flex items-center justify-between gap-3 px-4 py-3 group flex-1 min-w-0"
          aria-label="免費加入會員 · 解鎖押注與引擎 · 跟機器正面比準度"
        >
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-mono text-gold text-[9px] tracking-[0.3em] leading-tight">
              免費加入 · 押注 + 跑引擎
            </span>
            <span className="font-mono text-bone text-[11px] tracking-[0.15em] leading-snug mt-0.5">
              跟一台公開機器正面比準度
            </span>
          </div>
          <span
            aria-hidden="true"
            className="shrink-0 px-3 py-2 bg-gold text-navy font-mono text-[10px] tracking-[0.25em] group-active:bg-gold-soft transition-colors"
          >
            免費加入 →
          </span>
        </Link>

        {/* 已是會員 → 登入(回訪會員的入口 · 不破壞主 CTA hierarchy)· 同樣帶回當前運動 */}
        <Link
          href={`/login?next=${nextDest}`}
          aria-label="已是會員 · 登入"
          className="shrink-0 min-h-[44px] border-l border-line/60 px-3 py-2 flex flex-col items-center justify-center group"
        >
          <span className="font-mono text-mute/70 group-active:text-gold text-[8px] tracking-[0.3em] leading-tight">
            已是會員
          </span>
          <span className="font-mono text-mute group-active:text-gold text-[10px] tracking-[0.2em] mt-0.5 transition-colors">
            登入
          </span>
        </Link>
      </div>
    </div>
  );
}
