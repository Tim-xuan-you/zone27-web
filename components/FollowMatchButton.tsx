"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getMyFollows, toggleFollow } from "@/lib/follows";

// ── ZONE 27 · Follow Match Button ──────────────────────
// Round 30 Wave 6 · 2026-05-21 · first unlock feature。
//
// Renders 3 states based on auth + follow:
//   1. Loading       · 初始 mount · 讀 session(spinner)
//   2. Not logged in · render 「→ 登入解鎖 follow」連結到 /login(以
//                     matchId 帶 next param · 登入後回此場)
//   3. Logged in     · render 「★ Follow」 toggle button · 點切換
//
// Brand pure: gold-bordered + Geist Mono · followed state filled-gold ·
// unfollowed state outline。 No hover juice · no toast popup(per
// disclosure axiom — 不誇大每個 click)。
//
// Failure mode: 寄 error 用 inline message · 不 throw · 不 alert。 同
// WaitlistForm aria-live pattern。
// ─────────────────────────────────────────────────────

type Status =
  | { kind: "loading" }
  | { kind: "anonymous" }
  | { kind: "ready"; following: boolean }
  | { kind: "toggling"; previous: boolean }
  | { kind: "error"; message: string; following: boolean };

export default function FollowMatchButton({ matchId }: { matchId: string }) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data, error } = await supabase.auth.getSession();
        if (cancelled) return;
        if (error || !data.session) {
          setStatus({ kind: "anonymous" });
          return;
        }
        const follows = await getMyFollows();
        if (cancelled) return;
        setStatus({
          kind: "ready",
          following: follows.includes(matchId),
        });
      } catch {
        if (!cancelled) setStatus({ kind: "anonymous" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  async function handleToggle() {
    if (status.kind !== "ready" && status.kind !== "error") return;
    const prev = status.following;
    setStatus({ kind: "toggling", previous: prev });
    try {
      const next = await toggleFollow(matchId);
      setStatus({ kind: "ready", following: next });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "unknown_error";
      setStatus({ kind: "error", message, following: prev });
    }
  }

  if (status.kind === "loading") {
    return (
      <span
        aria-hidden="true"
        className="inline-flex items-center gap-2 font-mono text-mute/60 text-[10px] tracking-[0.3em] py-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-mute/50 shimmer" />
        FOLLOW · 載入中
      </span>
    );
  }

  if (status.kind === "anonymous") {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(`/matches/${matchId}`)}`}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold/80 font-mono text-[10px] tracking-[0.3em] hover:bg-gold/5 hover:border-gold/70 transition-colors"
        title="登入 FREE TIER 會員 · magic link 1 分鐘"
      >
        ★ 登入解鎖 FOLLOW
      </Link>
    );
  }

  const isToggling = status.kind === "toggling";
  const following =
    status.kind === "ready" || status.kind === "error"
      ? status.following
      : status.previous;
  const error = status.kind === "error" ? status.message : null;

  return (
    <div className="inline-flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isToggling}
        aria-pressed={following}
        className={`inline-flex items-center gap-2 px-4 py-3 sm:py-2 min-h-[44px] sm:min-h-[36px] font-mono text-[10px] tracking-[0.3em] transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
          following
            ? "bg-gold text-navy hover:bg-gold-soft"
            : "border border-gold text-gold hover:bg-gold/10"
        }`}
        title={
          following
            ? "您 follow 這場 · 賽後 receipt 落您 /member"
            : "Follow 這場 · 賽後 receipt 自動進您 /member"
        }
      >
        {isToggling ? "● 處理中" : following ? "★ FOLLOWED" : "☆ FOLLOW"}
      </button>
      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="font-mono text-loss text-[10px] tracking-[0.2em] leading-snug max-w-[200px]"
        >
          ✕ {error}
        </p>
      )}
    </div>
  );
}
