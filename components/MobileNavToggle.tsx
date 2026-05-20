"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ── ZONE 27 · Mobile Nav Toggle ───────────────────────
// Client component that owns the hamburger overlay state.
// Server-rendered Nav.tsx renders us on small screens (sm:hidden)
// while the inline desktop nav stays on sm+ screens.
//
// Two affordances on mobile:
//   - Primary CTA "創始會員 →" (gold pill) — always visible
//   - Hamburger ≡ — opens full-screen overlay with all nav items
//     + trust-artifact links (/audit, /methodology, /coverage, /faq)
// ─────────────────────────────────────────────────────

type NavItem = {
  key: string;
  href: string;
  label: string;
  badge?: string;
};

type Props = {
  items: NavItem[];
  active?: string;
  className?: string;
};

const TRUST_LINKS: { href: string; label: string }[] = [
  { href: "/audit", label: "Model Report · 全部假設公開" },
  { href: "/methodology", label: "完整工程白皮書" },
  { href: "/coverage", label: "覆蓋範圍 · 我們做哪些賽事" },
  { href: "/faq", label: "14 題誠實掃雷" },
];

export default function MobileNavToggle({
  items,
  active,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock body scroll while overlay is open so visitors don't accidentally
  // scroll the page beneath. Cleanup restores normal behaviour.
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Close on ESC for keyboard users.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <Link
          href="/founders"
          onClick={close}
          aria-current={active === "founders" ? "page" : undefined}
          className="px-3 py-1.5 bg-gold text-navy text-[10px] tracking-[0.22em] font-mono font-medium whitespace-nowrap hover:bg-gold-soft transition-colors"
        >
          創始會員
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          aria-controls="mobile-nav-overlay"
          className="w-10 h-10 inline-flex items-center justify-center border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
        >
          <span
            className="font-mono text-base leading-none"
            aria-hidden="true"
          >
            {open ? "✕" : "≡"}
          </span>
        </button>
      </div>

      {open && (
        <div
          id="mobile-nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="主選單"
          className="fixed inset-0 z-50 overflow-y-auto"
          style={{
            // Inline solid background — Tailwind 4 + @theme inline + opacity
            // modifier (bg-navy/95) was rendering transparent in production,
            // making the nav items visually merge with the blurred body
            // beneath. Inline rgba is the bulletproof fix.
            backgroundColor: "rgba(15, 26, 46, 0.97)",
          }}
        >
          <div className="relative px-6 pt-8 pb-16 max-w-md mx-auto min-h-full">
            <div className="flex items-center justify-between mb-10">
              <Link
                href="/"
                onClick={close}
                aria-label="ZONE 27 home"
                lang="en"
                className="flex items-center gap-3"
              >
                <span className="font-mono text-gold text-lg tracking-[0.22em] font-medium">
                  ZONE
                </span>
                <span className="font-mono text-bone text-lg tracking-[0.22em] font-medium">
                  27
                </span>
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="關閉選單"
                className="w-10 h-10 inline-flex items-center justify-center border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
              >
                <span
                  className="font-mono text-base leading-none"
                  aria-hidden="true"
                >
                  ✕
                </span>
              </button>
            </div>

            <p
              lang="en"
              className="font-mono text-gold/80 text-[10px] tracking-[0.45em] mb-5"
            >
              NAVIGATION
            </p>

            <div className="flex flex-col">
              {items.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={close}
                  aria-current={active === item.key ? "page" : undefined}
                  className={`py-4 border-b border-line/40 font-mono tracking-[0.2em] flex items-center justify-between ${
                    active === item.key ? "text-gold" : "text-bone"
                  }`}
                >
                  <span className="text-base">{item.label}</span>
                  {item.badge && (
                    <span
                      lang="en"
                      className="px-1.5 py-0.5 text-[9px] tracking-[0.15em] border border-gold/40 text-gold font-mono"
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-10 pt-6 border-t border-line/40">
              <p
                lang="en"
                className="font-mono text-mute text-[10px] tracking-[0.45em] mb-3"
              >
                TRUST ARTIFACTS
              </p>
              {TRUST_LINKS.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={close}
                  className="block py-3 text-mute hover:text-gold text-sm transition-colors"
                >
                  <span
                    lang="en"
                    className="font-mono text-mute/60 text-[10px] tracking-[0.2em] mr-2"
                  >
                    {it.href}
                  </span>
                  {it.label}
                </Link>
              ))}
            </div>

            <p
              lang="en"
              className="font-mono text-mute/60 text-[9px] tracking-[0.3em] mt-12 text-center"
            >
              ZONE 27 · WE DON&apos;T GUESS · WE COMPUTE
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
