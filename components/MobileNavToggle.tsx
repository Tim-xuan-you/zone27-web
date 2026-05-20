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
  { href: "/audit", label: "Model Report" },
  { href: "/methodology", label: "方法論" },
  { href: "/coverage", label: "覆蓋範圍" },
  { href: "/faq", label: "常見問題" },
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
          <div className="relative px-8 pt-10 pb-20 max-w-md mx-auto min-h-full">
            {/* ── HEADER · breathing single row ─────────── */}
            <div className="flex items-center justify-between mb-16">
              <Link
                href="/"
                onClick={close}
                aria-label="ZONE 27 home"
                lang="en"
                className="flex items-center gap-3"
              >
                <span className="font-mono text-gold text-xl tracking-[0.22em] font-medium">
                  ZONE
                </span>
                <span className="font-mono text-bone text-xl tracking-[0.22em] font-medium">
                  27
                </span>
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label="關閉選單"
                className="w-11 h-11 inline-flex items-center justify-center border border-gold/40 text-gold hover:bg-gold/10 transition-colors"
              >
                <span
                  className="font-mono text-lg leading-none"
                  aria-hidden="true"
                >
                  ✕
                </span>
              </button>
            </div>

            {/* ── PRIMARY NAV · magazine-grade typography ──
                Each item is a big breathing target (text-3xl)
                in Sans (Geist), not Mono — readable, premium,
                tap-friendly. Gold accent reserved for the
                active page; founders gets a star bullet so the
                primary CTA stands out without screaming. */}
            <nav aria-label="主導覽">
              <ul className="flex flex-col gap-1">
                {items.map((item) => {
                  const isActive = active === item.key;
                  const isFounders = item.key === "founders";
                  return (
                    <li key={item.key}>
                      <Link
                        href={item.href}
                        onClick={close}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex items-baseline justify-between py-5 text-3xl font-light tracking-tight transition-colors ${
                          isActive
                            ? "text-gold"
                            : isFounders
                              ? "text-gold/95 hover:text-gold"
                              : "text-bone hover:text-gold"
                        }`}
                      >
                        <span className="flex items-baseline gap-3">
                          {isFounders && (
                            <span
                              aria-hidden="true"
                              className="text-gold text-xl"
                            >
                              ★
                            </span>
                          )}
                          {item.label}
                        </span>
                        <span className="inline-flex items-center gap-3">
                          {item.badge && (
                            <span
                              lang="en"
                              className="px-1.5 py-0.5 text-[10px] tracking-[0.15em] border border-gold/40 text-gold font-mono"
                            >
                              {item.badge}
                            </span>
                          )}
                          <span
                            aria-hidden="true"
                            className="text-gold/40 text-2xl font-light"
                          >
                            →
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* ── TRUST ROW · simple inline strip, no /path uglies ── */}
            <div className="mt-16 pt-8 border-t border-line/40">
              <p
                lang="en"
                className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-5"
              >
                TRANSPARENCY
              </p>
              <ul className="flex flex-col gap-1">
                {TRUST_LINKS.map((it) => (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      onClick={close}
                      className="block py-3 text-mute hover:text-gold text-base transition-colors"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── BRAND TAGLINE — closing the menu like the site footer ── */}
            <div className="mt-20 text-center">
              <p
                lang="en"
                className="font-mono text-gold/60 text-[10px] tracking-[0.45em]"
              >
                WE DON&apos;T GUESS
                <br />
                WE COMPUTE
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
