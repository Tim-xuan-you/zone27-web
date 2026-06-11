"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// ── ZONE 27 · Auth-aware membership nav CTA ───────────
// Round 32 W-D · 2026-05-22 · Tim founder-dogfood 2nd canary fire 同日:
// 「我已經登入了!結果我只是去看其他頁面,現在想回去會員裏頭,點擊
//  右上角(會員),跑到這裡幹嘛...回不去會員裡面的界面呀!」
//
// 解 Nav「會員 →」 button auth-aware gap:
//   - Anonymous → /membership(4-tier ladder overview · 公開 discovery)
//   - Logged-in → /member(personal dashboard · 已登入用戶 home)
//
// Client island pattern · Nav.tsx 是 server component / /login 是 client ·
// 不能 mix async server inside client tree(making Nav async breaks /login
// "use client" usage)。 此 client island 在 mount 後 probe session · 切換
// href + label · 影響面只在 1 個 button。
//
// FOUC trade-off:Anonymous SSR default · ~200ms 後 logged-in 切換。
// Logged-in user 200ms 內點到 /membership 仍 graceful(/membership 內也
// 有 link 到 /member preview · /member 認 session 變 dashboard)。 真實
// user 不會點這麼快。
//
// Label choice:「您的引擎」 用 brand-specific 詞(同 /member 自己 hero
// 「您的引擎時間軸」)· 不用 generic「儀表板/dashboard」。 brand IP「方法
// 公開 · 不用 SaaS 行話」 延伸。 同 R30 W7 axiom「越少 fields 越正式」
// 延伸 · session state 用 label 本身 carry · 不加 chip 不加 indicator。
//
// Variants:
//   - desktop · gold-outlined pill(less aggressive · Nav 同列其他 5 item)
//   - mobile · gold-filled pill(更顯眼 · 站在 mobile top bar 最右)
// ─────────────────────────────────────────────────────

type Variant = "desktop" | "mobile";

type Props = {
  /** True when current page is in the "founders/membership" family. */
  active?: boolean;
  variant?: Variant;
};

export default function MembershipNavCTA({
  active = false,
  variant = "desktop",
}: Props) {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  // R124 W1 · Tim 第四級 founder-dogfood fire · PREVIEW GOLD mode 但
  // 「會員 →」 跳 /membership ladder 不是 /member dashboard · designer dogfood
  // UX 應 mirror logged-in flow · fix · 也讀 localStorage zone27_preview_tier ·
  // 若 active = 視為 logged-in · label「您的引擎 (PREVIEW) →」 → /member。
  // 同 NavLoginCTA W1 pattern + storage event sync 跨 tab。
  const [previewActive, setPreviewActive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data.session) {
          setLoggedIn(true);
        }
      } catch {
        // Network blocked / Supabase down · stay anonymous · degrade silently
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // R124 W1 · localStorage preview tier detection · sync with PreviewModeBanner +
  // AdminTierSwitcher key · effect run on mount + storage event listener 跨 tab。
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

  // R124 W1 · PREVIEW tier active = treat as logged-in for routing purpose · per
  // dogfood UX mirror。 不影響真實 auth state(server-side /member 仍認 cookie)·
  // Tim 進 /member 看 anonymous preview content · 但 Nav 路徑 1-click 不再卡 /login。
  const effectiveLoggedIn = loggedIn || previewActive;

  // R199 · Tim「登入 + 會員 → 兩顆是同一件事 · 選一個就好」→ 收成單一 auth 鈕。
  // anon = 「登入」→ /login(該頁同時處理登入/註冊 · 直接到得了 = 守 R50「登入別藏」);
  // logged-in = 「您的引擎」→ /member。 NavLoginCTA(原本另一顆「登入」)已刪。
  // /membership(三層方案總覽)改由 Cmd-K + footer 進(同 Apple:右上是帳號不是定價)。
  const href = effectiveLoggedIn ? "/member" : "/login";
  // 登入後標「我的帳本」而非「您的引擎」——「您的引擎」讀起來像產品名,使用者不知道
  // 那是「回我自己的紀錄」。「我的帳本」對齊足球押完的「進你的帳本」+ 品牌「有帳本的玩運彩」。
  const label = previewActive
    ? "我的帳本 (PREVIEW)"
    : loggedIn
    ? "我的帳本"
    : "登入";
  const aria = previewActive
    ? "PREVIEW mode · /member dashboard preview · 同 dogfood mirror logged-in UX"
    : loggedIn
    ? "我的帳本 · /member 個人儀表板 · 已登入會員專屬"
    : "登入或註冊 · Email + 密碼 · 終身免費 · 0 tracking";

  if (variant === "mobile") {
    return (
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        aria-label={aria}
        className="px-3.5 py-3 bg-gold text-navy text-[10px] tracking-[0.22em] font-mono font-medium whitespace-nowrap hover:bg-gold-soft transition-colors"
      >
        {label} →
      </Link>
    );
  }

  // desktop
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      aria-label={aria}
      className={`font-mono text-[10px] sm:text-xs tracking-[0.22em] whitespace-nowrap transition-colors inline-flex items-center gap-1.5 ${
        active
          ? "px-3 py-1.5 border border-gold bg-gold/10 text-gold"
          : "px-3 py-1.5 border border-gold/50 text-gold hover:bg-gold/5 hover:border-gold"
      }`}
    >
      {label} →
    </Link>
  );
}
