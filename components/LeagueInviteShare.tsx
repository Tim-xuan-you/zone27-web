"use client";

import { useState } from "react";

// ── ZONE 27 · 聯盟邀請分享(client)──────────────────────────────────
// 顯示邀請碼 + 一鍵分享「加入連結」(/member/leagues?join=CODE)· 帶招募鉤子。
// 🔴 分享的是「加入連結」不是這頁(這頁 member-gated · 非盟員會撞牆)· 手機 Web Share → 桌機剪貼簿。
// ─────────────────────────────────────────────────────

export default function LeagueInviteShare({
  inviteCode,
  leagueName,
}: {
  inviteCode: string;
  leagueName: string;
}) {
  const [done, setDone] = useState(false);

  function joinUrl(): string {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://zone27-web.vercel.app";
    return `${origin}/member/leagues?join=${encodeURIComponent(inviteCode)}`;
  }

  async function share() {
    const url = joinUrl();
    const text = `來加入我的預測盟「${leagueName}」· 整季比誰最會讀球(免費 · 賽前鎖死、連輸都掛):`;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "ZONE 27 · 私人預測聯盟", text, url });
        return;
      } catch (e) {
        if (e instanceof Error && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setDone(true);
      setTimeout(() => setDone(false), 2200);
    } catch {
      window.prompt("複製這個邀請連結:", `${text}\n${url}`);
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setDone(true);
      setTimeout(() => setDone(false), 2200);
    } catch {
      window.prompt("邀請碼:", inviteCode);
    }
  }

  return (
    <div className="border border-gold/30 bg-gold/[0.04] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <p className="font-mono text-gold/80 text-[9px] tracking-[0.35em] mb-1">
            邀請碼 · 傳給朋友就能加入
          </p>
          <button
            type="button"
            onClick={copyCode}
            aria-label={`複製邀請碼 ${inviteCode}`}
            className="font-mono text-bone text-2xl sm:text-3xl tracking-[0.3em] tabular hover:text-gold transition-colors"
          >
            {inviteCode}
          </button>
        </div>
        <button
          type="button"
          onClick={share}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 bg-gold text-navy font-mono text-[11px] tracking-[0.2em] hover:bg-gold-soft transition-colors"
        >
          {done ? "已複製 · 貼給朋友" : "分享加入連結 →"}
        </button>
      </div>
    </div>
  );
}
