"use client";

import { useState } from "react";

// ── ZONE 27 · Copy Link Button ─────────────────────────
// Indie-stealth distribution lever. Since SEO is frozen and
// social is frozen, the only growth channel is private-DM share.
// Make the URL itself the share unit (Pieter Levels pattern).
//
// Used on /audit and /methodology — the two pages most worth
// sharing in a private DM with friends or colleagues.
//
// Brand-consistent style: mono 11px uppercase, line border, gold hover.
//
// Channel attribution (NOT individual tracking):
//   If `refTag` is provided, the copied URL gets `?ref=<refTag>` appended.
//   When the next visitor lands on the page and fills the WaitlistForm,
//   the DB stores `source = <refTag>`. Aggregated across many shares,
//   this tells Tim WHICH share channels actually convert — without
//   identifying any individual.
// ─────────────────────────────────────────────────────

type CopyLinkButtonProps = {
  // Optional channel-attribution tag appended as ?ref=<refTag>
  // Pass something like "reserve-001" or "audit-share".
  refTag?: string;
};

export default function CopyLinkButton({ refTag }: CopyLinkButtonProps = {}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (typeof window === "undefined") return;
    let url = window.location.href;
    if (refTag) {
      try {
        const u = new URL(url);
        u.searchParams.set("ref", refTag);
        url = u.toString();
      } catch {
        // Malformed location — fall through to plain href
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Link copied to clipboard" : "Copy page link to clipboard"}
      className="inline-flex items-center gap-2 px-4 py-2 border border-line/60 hover:border-gold/60 text-mute hover:text-gold transition-colors font-mono text-[11px] tracking-[0.25em] uppercase"
    >
      <span aria-hidden="true">{copied ? "✓" : "⌁"}</span>
      <span lang="en">{copied ? "Copied" : "Copy Link"}</span>
    </button>
  );
}
