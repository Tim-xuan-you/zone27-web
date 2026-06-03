"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// ── ZONE 27 · Auth-aware Nav LOGIN CTA ────────────────
// Round 50 W-B · 2026-05-22 evening · Tim 26+ canary fire(高情緒 push):
//   「進入會員系統不是很簡單嗎? 不就是輸入帳號密碼進入? 為何這麼簡單的
//    事情, 我們網站辦不到?」
//
// Root cause(per Round 3 註解 in Nav.tsx · 9 個月 lag bug):
//   Round 3 (Apple-minimalism)移除 disabled「登入」 button · 因為當時
//   /login 還沒 ship · disabled button = choice paradox。 Round 30 W5
//   (2026-05-20)/login ship LIVE · 但 Nav 沒人回來 re-add LOGIN entry。
//   訪客現在唯一進 /login 的路:
//     - Cmd+K 找「login」(輕度 user 不知 Cmd+K 存在)
//     - Footer 滑到底 →「會員儀表板預覽」(name 不像「登入」 entry)
//     - URL 直接打 /login(不可能)
//
// Apple/Stripe/Linear/Vercel 標準:Nav 右上角永久「Sign in」 button 不論
// page。 此 component 物理 codify 這個標準。
//
// Auth-aware behavior:
//   - Anonymous(no session)→ 渲染「登入」 mono chip 跳 /login
//   - Logged-in(session exists)→ 不渲染(MembershipNavCTA 已切「您的引擎 →」
//     跳 /member · 不需重複 entry)
//
// FOUC trade-off · 同 MembershipNavCTA pattern:
//   - Anonymous SSR default · ~200ms 後若 logged-in 從 DOM 移除
//   - 真實 logged-in user 200ms 內看到「登入」 button 再消失 = grace ·
//     不擋功能(因為他點下去也只是進 /login · /login 偵測 session 直接
//     redirect 到 /member · 不損失 0)
//
// Variant:
//   - desktop · mono chip 樣式(Nav 右上方一致 MembershipNavCTA outline)
//   - mobile · 第 1 row 主 bar · MembershipNavCTA 左邊
//
// Brand IP fired:
//   - 「方法公開」 延伸到 navigation IA · 不躲 login button
//   - Anti-Apple-anti-pattern(Apple 自己也有「Sign in」 button 永久 visible
//     · Apple-minimalism ≠ 隱藏 essential entry)
//   - Founder dogfood canary 第 1 次就 trust 即修(per [[feedback-founder-
//     dogfood-canary]] R32 W-C lesson 同 pattern)
// ─────────────────────────────────────────────────────

type Variant = "desktop" | "mobile";

type Props = {
  variant?: Variant;
};

type SessionState = "loading" | "anonymous" | "logged_in";

export default function NavLoginCTA({ variant = "desktop" }: Props) {
  const [session, setSession] = useState<SessionState>("loading");
  // R124 W1 · Tim 第四級 founder-dogfood fire · PREVIEW FOUNDER mode 但
  // 看到「登入」 button · click 跳 /login · 卡在 register form · 看不到
  // /member。 fix · 也讀 localStorage zone27_preview_tier · 若 active = 視為
  // logged_in for Nav purposes · NavLoginCTA hides · MembershipNavCTA 切「您的
  // 引擎 →」 → /member。 brand IP「不躲 essential entry」 守 · 但 designer
  // dogfood mode 應 mirror logged-in UX 不混淆。
  const [previewActive, setPreviewActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        setSession(data.session ? "logged_in" : "anonymous");
      } catch {
        // Network blocked · Supabase down · degrade to anonymous · safer
        if (!cancelled) setSession("anonymous");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // R124 W1 · localStorage preview tier detection · sync with PreviewModeBanner +
  // AdminTierSwitcher zone27_preview_tier key · 同 storage event listener pattern
  // 跨 tab sync · effect run on mount + storage event。
  useEffect(() => {
    const check = () => {
      try {
        const tier = window.localStorage.getItem("zone27_preview_tier");
        setPreviewActive(!!tier);
      } catch {
        setPreviewActive(false);
      }
    };
    check();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "zone27_preview_tier") check();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Round 56 W-B · Agent B Ship #1 fix · CLS HIGH on homepage 之前 · logged-in
  // 從「登入」 button → null 造成 layout shift · 改 render invisible placeholder
  // 保持 same size · reserve slot regardless of auth state · CLS -0.05~-0.10。
  // R124 W1 · PREVIEW tier active 也 hide(視為 logged-in for Nav · 同 dogfood
  // UX mirror logged-in flow)· 同 invisible placeholder 維持 CLS-safe。
  if (session === "logged_in" || previewActive) {
    return (
      <span
        aria-hidden="true"
        className="font-mono text-[10px] sm:text-xs tracking-[0.22em] whitespace-nowrap invisible"
      >
        登入
      </span>
    );
  }

  // SSR default + anonymous · both render the LOGIN button(hydration-stable)
  const aria = "登入或註冊 · Email + 密碼 · 終身免費 · 0 tracking";

  if (variant === "mobile") {
    return (
      <Link
        href="/login"
        aria-label={aria}
        className="px-3 py-3 border border-gold/50 text-gold text-[10px] tracking-[0.22em] font-mono whitespace-nowrap hover:bg-gold/5 hover:border-gold transition-colors"
      >
        登入
      </Link>
    );
  }

  // desktop
  return (
    <Link
      href="/login"
      aria-label={aria}
      className="font-mono text-[10px] sm:text-xs tracking-[0.22em] whitespace-nowrap text-mute hover:text-gold transition-colors"
    >
      登入
    </Link>
  );
}
