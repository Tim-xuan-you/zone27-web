"use client";

import { useCallback, useEffect, useState } from "react";

// ── ZONE 27 · Preview Mode Banner ───────────────────────
// Round 36 W-D · Tim 14+ canary fire 後 founder dogfood question:
// 「我這個設計者 · 我要怎麼樣可以在各個付費程度裡面 · 隨意切換看各個
//  功能有沒有到位?」 brilliant designer dev tool requirement。
//
// Round 47 W-A · Tim post-R46 question canary fire「我還是不會!如何
// 切換自如?」 surface 了 R36 W-D banner UX gap:只有 cancel 沒有 inline
// switch · 每次切 tier 都要回 /admin。 修:
//   - Banner 加 inline 4-tier switch button row · 從任何 page 一鍵切換
//   - Keyboard shortcut Cmd+Shift+P · 從任何 page activate preview · 不
//     需 visit /admin
//   - 同 brand IP「方法公開」 designer tool 物理 codify
//
// 設計:
//   - localStorage-based client-side override · 0 server-side complexity
//   - 任何 page mount 後讀 localStorage · 若 preview tier 存在 顯示 banner
//   - Banner sticky-top · brand-pure loss/red 警告色 · explicit「您正在 preview」
//   - 4 inline tier-switch buttons · click 立即 reload to new tier
//   - Keyboard shortcut Cmd+Shift+P 從任何 page open preview(default 匿名訪客)
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

const TIERS: { value: string; label: string; price: string }[] = [
  { value: "anonymous", label: "匿名訪客", price: "NT$ 0" },
  { value: "free", label: "FREE", price: "NT$ 0" },
  { value: "black-card", label: "BLACK", price: "NT$ 299/月" },
  { value: "founders27", label: "FOUNDERS", price: "NT$ 2,700" },
];

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

  const handleSwitch = useCallback((newTier: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, newTier);
    } catch {
      return;
    }
    window.location.reload();
  }, []);

  const handleCancel = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setTier(null);
    window.location.reload();
  }, []);

  // Round 47 W-B · Keyboard shortcut Cmd+Shift+P · from any page activate
  // preview mode · default to anonymous tier · Tim 不需 visit /admin
  // shortcut chosen:Cmd+Shift+P · Chrome devtools 用 Cmd+Shift+I · 不衝突
  // brand IP:invisible to public · only Tim know shortcut · same axiom as
  // /admin noindex pattern from R29 W2。
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const modifier = e.metaKey || e.ctrlKey;
      if (modifier && e.shiftKey && (e.key === "P" || e.key === "p")) {
        e.preventDefault();
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored && stored in TIER_LABELS) {
            // Already active · cancel
            handleCancel();
          } else {
            // Not active · default to anonymous
            handleSwitch("anonymous");
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSwitch, handleCancel]);

  if (!mounted || !tier) return null;

  const label = TIER_LABELS[tier];

  return (
    <div
      role="banner"
      aria-label="您正在 preview tier mode · designer dev tool"
      className="bg-loss/10 border-b border-loss/50 px-3 sm:px-4 py-2"
    >
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        <p
          lang="en"
          className="font-mono text-loss/90 text-[10px] sm:text-[11px] tracking-[0.2em] tabular leading-relaxed"
        >
          ⚠ PREVIEW · 您正在以{" "}
          <strong className="text-loss">{label}</strong> 身份瀏覽
        </p>

        {/* R47 W-A · Inline 4-tier switch row · Tim 一鍵切換不需回 /admin */}
        <span
          aria-hidden="true"
          className="font-mono text-loss/40 text-[10px]"
        >
          ·
        </span>
        <div
          role="group"
          aria-label="切換 tier"
          className="flex items-center gap-1.5 flex-wrap"
        >
          {TIERS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => handleSwitch(t.value)}
              disabled={tier === t.value}
              aria-pressed={tier === t.value}
              className={`px-2 sm:px-2.5 py-1 min-h-[28px] font-mono text-[9px] sm:text-[10px] tracking-[0.18em] tabular border transition-colors ${
                tier === t.value
                  ? "border-loss/60 bg-loss/15 text-loss cursor-default"
                  : "border-loss/30 text-loss/80 hover:bg-loss/10 hover:text-loss hover:border-loss/50"
              }`}
              title={`切到 ${t.label} · ${t.price}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <span
          aria-hidden="true"
          className="font-mono text-loss/40 text-[10px]"
        >
          ·
        </span>
        <button
          type="button"
          onClick={handleCancel}
          className="font-mono text-loss/80 hover:text-loss text-[10px] sm:text-[11px] tracking-[0.2em] tabular underline underline-offset-4 hover:underline transition-colors"
        >
          ✕ 取消
        </button>
        <span
          lang="en"
          aria-hidden="true"
          className="hidden sm:inline font-mono text-loss/40 text-[9px] tracking-[0.2em] ml-1"
        >
          (or Cmd+Shift+P)
        </span>
      </div>
    </div>
  );
}
