"use client";

import { useEffect, useState } from "react";
import { useMounted } from "@/lib/use-mounted";
import Link from "next/link";

// ── ZONE 27 · Tier Badge ────────────────────────────────
// R111 W2 · per agent locked-preview research Pattern 3 · Notion sidebar
// passive tier-status indicator · small badge showing current preview tier
// + chevron to /membership · no nag · no animation · no FOMO。
//
// 設計:
//   - 只當 localStorage zone27_preview_tier 有值才 render(designer
//     preview mode 才 surface · public visitor 看不到)
//   - 小巧 px-2 py-0.5 border + tier label · 點 link 到 /membership
//   - 同 Notion block-count meter + GitHub plan-badge pattern
//   - 0 tracking · 0 animation · 0 nag · pure passive indicator
//
// 不做 anti-pattern:
//   ✕ NO 「Upgrade now!」 prompt
//   ✕ NO countdown timer / animation
//   ✕ NO badge for non-preview-mode visitors(public visitor 不該看到 internal tier
//     state · 沒實際 auth · 顯示 tier badge 會 confused)
//   ✕ NO 「您的 tier: ANONYMOUS」 default state · 訪客沒登入也沒 preview · 不需 noise
//
// Mount: in Nav · between right-side items · only visible in preview mode。
// ─────────────────────────────────────────────────────

const STORAGE_KEY = "zone27_preview_tier";

const TIER_LABELS: Record<string, { label: string; href: string }> = {
  anonymous: { label: "ANON", href: "/membership" },
  free: { label: "FREE", href: "/membership" },
  "black-card": { label: "BLACK", href: "/membership/black-card" },
  founders27: { label: "FOUNDERS", href: "/founders" },
};

export default function TierBadge() {
  const [tier, setTier] = useState<string | null>(null);
  // R162 W1 · useMounted canonical hook · separated from localStorage side-effect
  const mounted = useMounted();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored in TIER_LABELS) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTier(stored);
      }
    } catch {
      // ignore
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        if (e.newValue && e.newValue in TIER_LABELS) {
          setTier(e.newValue);
        } else {
          setTier(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!mounted || !tier) return null;
  const meta = TIER_LABELS[tier];

  return (
    <Link
      href={meta.href}
      title={`Preview tier: ${meta.label} · click 看 ${meta.href} 詳情`}
      className="inline-flex items-center gap-1 px-2 py-0.5 border border-loss/40 font-mono text-loss/85 hover:text-loss hover:border-loss/60 text-[9px] tracking-[0.25em] tabular transition-colors"
    >
      <span aria-hidden="true">●</span>
      {meta.label}
    </Link>
  );
}
