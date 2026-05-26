"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  COMMAND_ITEMS,
  COMMAND_GROUP_ORDER,
  filterCommandItems,
  type CommandItem,
} from "@/lib/command-palette-data";

// ── ZONE 27 · Command Palette ──────────────────────────
// Premium-tier navigation primitive. Cmd-K / Ctrl-K opens a
// modal with hand-curated visitor-discoverable routes searchable in one place.
// Arrow keys navigate · Enter opens · Esc closes.
// (/admin · noindex Tim-ops preview · intentionally NOT indexed here.)
// R68 W-A added /founders/apply (Patek-style application)。
// R69 W-A+W-B added /founders/first-five-minutes (onboarding) +
//   /founders/from-one-current-founder (Substack empty scaffold)。
// R95 W2 · Hick's Law compression · COMMAND_ITEMS.length 為 canonical source
//   (currently 43 hand-curated entries · R143 W2 加 /interact canonical brand
//   IP defense surface · R119 W4 36 · R120 W5 37 · R122 W1 38 · R128 W2 39 ·
//   R137 W3 42 · R143 W2 43 · secondary routes accessed via /transparency
//   aggregator + Footer + parent-page cross-links)。
//
// Design principles (per [[zone27-disclosure-philosophy]]):
//   - No external deps (no cmdk · no fuse.js · no telemetry)
//   - Plain substring filter on COMMAND_ITEMS array(canonical count)
//   - No recently-used / personalization (would require tracking)
//   - No hidden ranking · alphabetical-within-group · group-order
//     is editorial (entry → engine → brand → trust → tools)
//   - Visible to keyboard + screen reader + mobile (tap open)
//   - Brand chrome: navy panel + cold-gold border + Geist Mono shortcuts
//
// Reference inspiration: Linear / Vercel / Raycast Cmd-K patterns,
// stripped to the brand-pure minimum.
// ─────────────────────────────────────────────────────

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Element to return focus to on close — captured before open.
  // Keyboard users rely on this · without it focus drops to document.body
  // and Tab navigation restarts from the top of the page (jarring).
  const triggerRef = useRef<HTMLElement | null>(null);
  const router = useRouter();

  // ── Filtered + grouped items ──
  const filtered = useMemo(() => filterCommandItems(query), [query]);
  // Flat array for arrow-key navigation across groups
  const flat = filtered;

  // ── Open / close handlers ──
  const open = useCallback(() => {
    // Capture the currently-focused element so we can restore on close.
    // Skip if focus is already inside this palette (re-open during open).
    if (typeof document !== "undefined") {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active !== document.body) {
        triggerRef.current = active;
      }
    }
    setIsOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Restore focus on the element that opened the palette · keyboard
    // continuity. Defer to next frame so React unmounts modal first.
    if (triggerRef.current) {
      const target = triggerRef.current;
      requestAnimationFrame(() => target.focus());
      triggerRef.current = null;
    }
  }, []);

  // ── Global keyboard shortcut · ⌘K / Ctrl-K ──
  // Note: we intentionally preventDefault on Cmd/Ctrl+K everywhere,
  // including inside `<input>` / `<textarea>`. This swallows Chrome's
  // default address-bar focus shortcut · ZONE 27 owns this key on
  // its own pages (per power-user palette convention · Linear /
  // Vercel / Raycast all do this). External sites are unaffected
  // since this listener only lives within zone27-web.vercel.app.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, open, close]);

  // ── Focus input + lock body scroll on open ──
  useEffect(() => {
    if (isOpen) {
      // Defer focus to next tick so the input is mounted
      requestAnimationFrame(() => inputRef.current?.focus());
      // Lock body scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // selectedIndex is reset in the query change handler below
  // (not via useEffect — React 19 react-hooks/set-state-in-effect rule
  // catches cascading-render anti-pattern · the reset belongs at the
  // event source, not as a downstream effect).

  // ── Scroll selected into view ──
  useEffect(() => {
    if (!isOpen) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-cmd-index="${selectedIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex, isOpen]);

  // ── Listen for custom global event so external triggers (e.g.
  //    Nav chip click) can open the palette without managing state. ──
  useEffect(() => {
    const handler = () => open();
    document.addEventListener("zone27:open-palette", handler);
    return () => document.removeEventListener("zone27:open-palette", handler);
  }, [open]);

  // ── Execute selected item ──
  const execute = useCallback(
    (item: CommandItem) => {
      close();
      if (item.external) {
        window.open(item.path, "_blank", "noopener,noreferrer");
      } else {
        router.push(item.path);
      }
    },
    [close, router]
  );

  // ── Input keyboard handlers ──
  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flat.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = flat[selectedIndex];
        if (item) execute(item);
      }
    },
    [flat, selectedIndex, execute]
  );

  if (!isOpen) return null;

  // ── Render ──
  // Build a Map of group → items in encounter order, then iterate
  // COMMAND_GROUP_ORDER so empty groups render nothing while groups
  // with matches appear in editorial sequence.
  const byGroup = new Map<string, { items: CommandItem[]; offsets: number[] }>();
  flat.forEach((item, i) => {
    const entry = byGroup.get(item.group);
    if (entry) {
      entry.items.push(item);
      entry.offsets.push(i);
    } else {
      byGroup.set(item.group, { items: [item], offsets: [i] });
    }
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette · 全站快搜"
      className="fixed inset-0 z-50 backdrop-blur-md bg-ink/70 flex items-start justify-center pt-[8vh] sm:pt-[12vh] px-4 animate-fade-in"
      onMouseDown={(e) => {
        // Click outside panel closes
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        className="w-full max-w-2xl bg-navy border border-gold/40 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.6),0_0_60px_-12px_rgba(212,175,55,0.15)] animate-cmd-pop"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ── Input row ── */}
        <div className="border-b border-line/60 px-4 sm:px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="font-mono text-gold/80 text-[10px] tracking-[0.35em] hidden sm:inline"
            >
              ⌘K
            </span>
            <span
              aria-hidden="true"
              className="font-mono text-gold/80 text-[10px] tracking-[0.35em] sm:hidden"
            >
              ⌕
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={onInputKeyDown}
              placeholder="搜尋頁面 · 工具 · 文件 · 球員..."
              className="flex-1 bg-transparent text-bone placeholder:text-mute/60 outline-none text-base sm:text-lg font-light"
              aria-label="Command palette search input"
              aria-controls="cmd-listbox"
              aria-activedescendant={
                flat[selectedIndex] ? `cmd-item-${selectedIndex}` : undefined
              }
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={close}
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.25em] px-2 py-1 border border-line/60 hover:border-gold/40 transition-colors"
              aria-label="Close command palette"
            >
              ESC
            </button>
          </div>
          {/* Round 9 a11y: aria-live for screen readers · announces
              filter result count without visible UI clutter. */}
          <span role="status" aria-live="polite" className="sr-only">
            {flat.length} 個結果
          </span>
        </div>

        {/* ── Results list ── */}
        <div
          ref={listRef}
          id="cmd-listbox"
          role="listbox"
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {flat.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="font-mono text-mute text-[11px] tracking-[0.3em] mb-2">
                NO MATCHES
              </p>
              <p className="text-mute text-sm">
                搜尋「<span className="text-gold">{query}</span>」找不到結果。
                試試「manifesto」「audit」「founder」「lab」「公開戰績」。
              </p>
            </div>
          ) : (
            COMMAND_GROUP_ORDER.map((group) => {
              const bucket = byGroup.get(group);
              if (!bucket) return null;
              return (
                <div key={group} className="mb-2 last:mb-0">
                  <p
                    lang="en"
                    className="font-mono text-mute text-[9px] tracking-[0.3em] px-5 pt-3 pb-2 uppercase"
                  >
                    {group}
                  </p>
                  <ul role="presentation">
                    {bucket.items.map((item, j) => {
                      const flatIndex = bucket.offsets[j] ?? 0;
                      const selected = flatIndex === selectedIndex;
                      return (
                        <li key={item.path} role="presentation">
                          <button
                            type="button"
                            role="option"
                            id={`cmd-item-${flatIndex}`}
                            data-cmd-index={flatIndex}
                            aria-selected={selected}
                            onClick={() => execute(item)}
                            onMouseEnter={() => setSelectedIndex(flatIndex)}
                            className={`w-full text-left px-5 py-2.5 flex items-baseline gap-3 transition-colors ${
                              selected
                                ? "bg-gold/10 text-bone"
                                : "text-mute hover:bg-slate/40"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${
                                selected
                                  ? "bg-gold glow-gold"
                                  : "bg-mute/30"
                              } translate-y-[-2px]`}
                            />
                            <span className="flex-1 min-w-0">
                              <span
                                className={`block text-sm sm:text-base leading-snug ${
                                  selected ? "text-bone" : "text-bone/85"
                                }`}
                              >
                                {item.label}
                              </span>
                              <span
                                lang="en"
                                className={`block font-mono text-[10px] tracking-[0.2em] mt-0.5 ${
                                  /* R142 W3 · a11y contrast fix · text-mute/70
                                     on Cmd-K bg-slate 計算 ≈ 3.4:1 FAILS WCAG
                                     1.4.3 AA 4.5:1 · kicker text 是 information-
                                     bearing route path · 升 to text-mute/85 ·
                                     selected state(text-gold/80)contrast 已 OK 保留。 */
                                  selected ? "text-gold/80" : "text-mute/85"
                                }`}
                              >
                                {item.kicker}
                                {item.external && (
                                  <span className="ml-2 opacity-80">↗</span>
                                )}
                              </span>
                            </span>
                            {selected && (
                              <span
                                lang="en"
                                aria-hidden="true"
                                className="font-mono text-gold/70 text-[10px] tracking-[0.25em] flex-shrink-0"
                              >
                                ↵
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer hint row ── */}
        <div className="border-t border-line/60 px-4 sm:px-5 py-2.5 flex items-center justify-between gap-3 text-[10px] font-mono text-mute tracking-[0.22em]">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5">
              <kbd className="border border-line/60 px-1.5 py-0.5 text-[9px] tracking-normal">
                ↑↓
              </kbd>
              <span className="hidden sm:inline">選擇</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="border border-line/60 px-1.5 py-0.5 text-[9px] tracking-normal">
                ↵
              </kbd>
              <span className="hidden sm:inline">開啟</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="border border-line/60 px-1.5 py-0.5 text-[9px] tracking-normal">
                ESC
              </kbd>
              <span className="hidden sm:inline">關閉</span>
            </span>
            {/* R62 W-D · g-mode discoverability hint · Linear/GitHub power-user
                grammar · 訪客 close palette 後可直接 g+m / g+t / g+l jump · 不必
                每次重開 Cmd-K · per Bloomberg/power-user agent Ship #1 axiom。 */}
            <span className="hidden md:flex items-center gap-1.5">
              <kbd className="border border-gold/40 text-gold/85 px-1.5 py-0.5 text-[9px] tracking-normal">
                G
              </kbd>
              <span className="text-gold/85">+</span>
              <kbd className="border border-gold/40 text-gold/85 px-1.5 py-0.5 text-[9px] tracking-normal">
                M/T/L/F/A
              </kbd>
              <span className="text-mute/70">直接跳</span>
            </span>
          </div>
          <span lang="en" className="text-mute/70">
            {flat.length} / {COMMAND_ITEMS.length}
          </span>
        </div>
      </div>
    </div>
  );
}
