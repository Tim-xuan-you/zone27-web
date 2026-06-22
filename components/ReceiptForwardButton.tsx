"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Match } from "@/lib/matches";
import { getCalibration, getEnginePctOnWinner } from "@/lib/matches";

// ── ZONE 27 · Receipt Forward Button ───────────────────
// R62 W-B · Bloomberg/power-user agent Ship #4 · Stratechery + Defector +
// The Athletic share-pattern translated to ZONE 27 brand IP。 之前 CopyLinkButton
// share URL alone · 這個 button share 整份 PLAIN-TEXT RECEIPT(match · engine
// pick · actual · verdict · card numbering · URL)。
//
// The receipt 本身 IS brand asset · 不是 URL · 是 ZONE 27 calibration honesty
// 物理 codify · Pokemon TCG「show off receipt」 mechanic 延伸 · screenshot-
// shareable artifact 升 plain-text-shareable artifact(可貼 LINE / SMS /
// Slack 不需圖檔 · 易 forwarded · 同 Stratechery「occasional forwarding
// to friends」 axiom)。
//
// 0 tracking · 0 UTM · 0 referral code · pure plain text。 同 [[zone27-
// disclosure-philosophy]] · 同 /privacy 0-tracker promise。
//
// Behavior:
//   - Mobile(Web Share API)· navigator.share({ text }) opens OS share sheet
//     · user picks LINE / Messages / etc · plain text inserted
//   - Desktop(no Web Share API)· navigator.clipboard.writeText fallback ·
//     visitor paste into chat manually
//   - Final fallback · window.prompt 顯示 raw text 讓 visitor 手動 copy
//
// Only renders when match.finalResult ingested(已 final · 有 verdict)·
// pre-game state 沒 receipt 可分享。
// ─────────────────────────────────────────────────────

function subscribeNoop() {
  return () => {};
}
function getShareApiSnapshot(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}
function getShareApiServerSnapshot(): boolean {
  return false;
}

function buildReceiptText(match: Match): string {
  const cal = getCalibration(match);
  const fr = match.finalResult;
  if (!fr || !cal) return "";

  const winnerName =
    fr.winner === "home"
      ? match.home.name
      : fr.winner === "away"
      ? match.away.name
      : "TIE";
  const enginePctOnWinner = getEnginePctOnWinner(match);
  const verdictLabel =
    cal === "proved"
      ? "✓ PROVED · ENGINE 命中"
      : cal === "diverged"
      ? "✕ DIVERGED · ENGINE 落空"
      : "= PUSH · 平局或無 favorite";

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/matches/${match.id}`
      : `https://zone27.com.tw/matches/${match.id}`;

  const lines = [
    `ZONE 27 ENGINE · ${match.home.name} vs ${match.away.name}`,
    `DATE · ${match.date}`,
    `ENGINE % ON WINNER · ${
      enginePctOnWinner !== null ? `${enginePctOnWinner}%` : "—"
    }`,
    `ACTUAL · ${fr.homeScore}-${fr.awayScore} · ${winnerName}${
      fr.winner !== "tie" ? " W" : ""
    }`,
    `VERDICT · ${verdictLabel}`,
    `CARD ${match.id.toUpperCase()} · CPBL SEASON 2026 · REPRINT POLICY 0`,
    "",
    url,
    "",
    "(plain text · 0 tracking · 0 UTM · per /privacy)",
  ];
  return lines.join("\n");
}

type Props = { match: Match };

export default function ReceiptForwardButton({ match }: Props) {
  const [phase, setPhase] = useState<"idle" | "done">("idle");
  // R166 W1 · Agent Q bug audit LOW #4 · async race guard for 2.5s "done→idle"
  // timer · same pattern as CopyLinkButton。
  const mountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  const scheduleIdle = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (mountedRef.current) setPhase("idle");
    }, 2500);
  };
  const hasShareApi = useSyncExternalStore(
    subscribeNoop,
    getShareApiSnapshot,
    getShareApiServerSnapshot,
  );

  async function handleForward() {
    const text = buildReceiptText(match);
    if (!text) return;

    // Try Web Share API first(mobile-friendly · one tap to LINE / iMessage)
    if (hasShareApi && navigator.share) {
      try {
        await navigator.share({
          title: "ZONE 27 ENGINE RECEIPT",
          text,
        });
        setPhase("done");
        scheduleIdle();
        return;
      } catch (e) {
        // User cancelled — don't fall back, just stay idle
        if (e instanceof Error && e.name === "AbortError") return;
        // Real failure — fall through to clipboard
      }
    }

    // Clipboard fallback(desktop · or browsers without share API)
    try {
      await navigator.clipboard.writeText(text);
      setPhase("done");
      scheduleIdle();
    } catch {
      window.prompt("Copy receipt:", text);
    }
  }

  // Only show when finalResult exists(有 verdict 才有 receipt 可分享)
  if (!match.finalResult) return null;

  const isDone = phase === "done";
  const idleLabel = hasShareApi ? "FORWARD RECEIPT" : "COPY RECEIPT";
  const doneLabel = hasShareApi ? "✓ FORWARDED" : "✓ COPIED";
  const ariaLabel = isDone
    ? hasShareApi
      ? "Receipt forwarded"
      : "Receipt copied to clipboard"
    : hasShareApi
    ? "Forward this engine receipt as plain text via LINE / Messages / other"
    : "Copy this engine receipt as plain text to clipboard";

  return (
    <button
      type="button"
      onClick={handleForward}
      aria-label={ariaLabel}
      className="inline-flex items-center gap-2 px-4 py-2 border border-gold/40 hover:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40 text-gold/85 hover:text-gold transition-colors font-mono text-[11px] tracking-[0.25em]"
    >
      <span aria-hidden="true">{isDone ? "✓" : "→"}</span>
      <span lang="en">{isDone ? doneLabel : idleLabel}</span>
    </button>
  );
}
