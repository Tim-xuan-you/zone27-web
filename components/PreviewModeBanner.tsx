"use client";

import { useEffect, useState } from "react";

// ── ZONE 27 · Preview Mode Banner ───────────────────────
// Round 36 W-D · Tim 14+ canary fire 後 founder dogfood question:
// 「我這個設計者 · 我要怎麼樣可以在各個付費程度裡面 · 隨意切換看各個
//  功能有沒有到位?」 brilliant designer dev tool requirement。
//
// 設計:
//   - localStorage-based client-side override · 0 server-side complexity
//   - 任何 page mount 後讀 localStorage · 若 preview tier 存在 顯示 banner
//   - Banner sticky-top · brand-pure loss/red 警告色 · explicit「您正在 preview」
//   - Click cancel → clear localStorage + reload · 立即回真實 session
//
// 心理 hook:
//   - Visual reminder · Tim 全程知「我在 preview mode」 · 不會誤把 mockup
//     當 real production state
//   - Honest disclosure · 同 brand IP「方法公開」延伸到 designer tool 本身
//
// 限制:
//   - localStorage 不影響 server-rendered content(/member 等 server component
//     仍讀真實 session)
//   - Effect 只在 client-side tier-aware components(AdminTierSwitcher
//     reading localStorage · PaidTierLockedGrid 等可選增 hook)
//   - Phase 2 可升 cookie-based 讓 server-side 也 honor preview tier
//
// 同 R34 W-D Nav 會員 button auth-aware client island pattern · 0 server
// async complexity · 同 client tree compatible。
// ─────────────────────────────────────────────────────

const STORAGE_KEY = "zone27_preview_tier";

const TIER_LABELS: Record<string, string> = {
  anonymous: "匿名訪客",
  free: "FREE TIER",
  "black-card": "BLACK CARD",
  founders27: "Founders 27",
};

export default function PreviewModeBanner() {
  const [tier, setTier] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored in TIER_LABELS) {
        setTier(stored);
      }
    } catch {
      // localStorage blocked · 不擋 · 不顯示 banner
    }

    // Listen for changes from other tabs / sliders
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next = e.newValue;
        if (next && next in TIER_LABELS) {
          setTier(next);
        } else {
          setTier(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!mounted || !tier) return null;

  const label = TIER_LABELS[tier];

  const handleCancel = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setTier(null);
    window.location.reload();
  };

  return (
    <div
      role="banner"
      aria-label="您正在 preview tier mode · designer dev tool"
      className="bg-loss/10 border-b border-loss/50 px-4 py-2 text-center"
    >
      <p
        lang="en"
        className="font-mono text-loss/90 text-[10px] sm:text-xs tracking-[0.2em] tabular leading-relaxed"
      >
        ⚠ PREVIEW MODE · 您正在以{" "}
        <strong className="text-loss">{label}</strong> 身份瀏覽
        <button
          type="button"
          onClick={handleCancel}
          className="ml-3 underline underline-offset-4 hover:text-loss transition-colors"
        >
          ✕ 取消 · 回真實 session
        </button>
      </p>
    </div>
  );
}
