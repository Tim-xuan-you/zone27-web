"use client";

import { useEffect, useState } from "react";
import {
  CPBL_TEAMS,
  getMyTeam,
  setMyTeam,
  getTeamById,
  type CpblTeamId,
} from "@/lib/teams";

// ── ZONE 27 · Team Pick Panel ───────────────────────────
// Round 31 W-N · Critic-hardening agent (W-G ONE deepest call) finally
// shipped。 球迷 grammar 從「對球迷說話」 升「對你(這個富邦球迷)
// 說話」 · 0 cookie / 0 server / 0 PII / 0 GA · 純 localStorage z27_team。
//
// brand IP fits:
// - Pratfall · 主動承認「對球迷說話」是空話 · 真正修法 = personalize
// - Costly Signaling · 「我是富邦球迷」是 free declaration · 不需付費
// - 0 tracking · localStorage 在您 browser · 我們 server 看不到
// - homepage = ONE thing axiom respected · picker 不在 homepage hero ·
//   只在 /track-record + /matches/[gameId] inline · 不破首頁 minimalism
//
// 設計:
// - 未選:「您支持哪隊?」 + 6 個 button + 「不選 · 看全聯盟」
// - 已選:「您支持 {team}」 + 「變更 ↓」 toggle 重新 picker
// - hover 變 picker · click 即儲存 (no submit step · low friction)
//
// SSR safe:server render 是「您支持哪隊?」 default · client hydrate
// 後讀 localStorage 更新 · 避免 hydration mismatch · 用 mounted flag。
// ─────────────────────────────────────────────────────

type Props = {
  /** Variant: "header" (compact inline) | "section" (larger callout) */
  variant?: "header" | "section";
  /** Optional callback when team changes(for parent re-render) */
  onChange?: (team: CpblTeamId | null) => void;
  className?: string;
};

export default function TeamPickPanel({
  variant = "header",
  onChange,
  className = "",
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [myTeamId, setMyTeamId] = useState<CpblTeamId | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    // SSR-safe hydration · localStorage only exists post-mount · canonical
    // pattern that React 19 strict rule overflags(同 CmdKTrigger 處理)。
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setMyTeamId(getMyTeam());
  }, []);

  // SSR-safe render: show placeholder until client hydrate
  if (!mounted) {
    return (
      <div
        className={`font-mono text-mute/50 text-[10px] tracking-[0.3em] ${className}`}
        aria-hidden="true"
      >
        {variant === "header" ? "我看 ___" : "您支持哪隊?載入中"}
      </div>
    );
  }

  const myTeam = getTeamById(myTeamId);

  const handlePick = (id: CpblTeamId | null) => {
    setMyTeamId(id);
    setMyTeam(id);
    setPickerOpen(false);
    onChange?.(id);
  };

  if (variant === "section") {
    return (
      <div
        className={`bg-slate/40 border border-gold/30 p-5 sm:p-6 ${className}`}
      >
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
        >
          / 我看 ___ · CPBL TEAM PICK
        </p>
        {myTeam ? (
          <>
            <p className="text-bone text-base mb-3">
              您支持 <span className="text-gold font-semibold">{myTeam.name}</span> ·
              整站 personal narrative 自動對齊。
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPickerOpen(!pickerOpen)}
                className="px-3 py-1.5 border border-line/60 hover:border-gold/60 text-mute hover:text-gold font-mono text-[10px] tracking-[0.3em] transition-colors"
              >
                變更 ↓
              </button>
              <button
                type="button"
                onClick={() => handlePick(null)}
                className="px-3 py-1.5 border border-loss/30 hover:border-loss/60 text-loss/80 hover:text-loss font-mono text-[10px] tracking-[0.3em] transition-colors"
              >
                清除 ✕
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-mute text-sm mb-3 leading-relaxed">
              選一隊 · ZONE 27 對「你(這個富邦球迷)」 說話 · 不對「球迷」 說話。
              <span className="text-mute/60 ml-2">0 cookie · 0 server · 0 PII · 純 localStorage。</span>
            </p>
            <button
              type="button"
              onClick={() => setPickerOpen(!pickerOpen)}
              className="px-4 py-2 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
            >
              {pickerOpen ? "收起 ↑" : "選您支持的球隊 →"}
            </button>
          </>
        )}
        {pickerOpen && <TeamPickerButtons onPick={handlePick} myTeamId={myTeamId} />}
      </div>
    );
  }

  // header variant · compact inline
  return (
    <div className={`inline-flex items-center gap-2 flex-wrap ${className}`}>
      {myTeam ? (
        <>
          <span className="font-mono text-mute text-[10px] tracking-[0.3em]">
            您支持
          </span>
          <button
            type="button"
            onClick={() => setPickerOpen(!pickerOpen)}
            className="font-mono text-gold hover:text-gold-soft text-[11px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
            title="點變更球隊 · 或清除"
          >
            {myTeam.short} ↓
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setPickerOpen(!pickerOpen)}
          className="font-mono text-mute/80 hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
          title="選您支持的隊 · 整站 personalize · 0 cookie"
        >
          我看 ___ ↓
        </button>
      )}
      {pickerOpen && (
        <div className="mt-2 sm:mt-0 sm:ml-3 basis-full sm:basis-auto">
          <TeamPickerButtons
            onPick={handlePick}
            myTeamId={myTeamId}
            compact
          />
        </div>
      )}
    </div>
  );
}

function TeamPickerButtons({
  onPick,
  myTeamId,
  compact = false,
}: {
  onPick: (id: CpblTeamId | null) => void;
  myTeamId: CpblTeamId | null;
  compact?: boolean;
}) {
  return (
    <div
      className={`mt-3 flex flex-wrap ${compact ? "gap-1.5" : "gap-2"}`}
      role="group"
      aria-label="選您支持的 CPBL 球隊"
    >
      {CPBL_TEAMS.map((t) => {
        const selected = t.id === myTeamId;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onPick(t.id)}
            className={`px-3 py-1.5 border font-mono text-[10px] tracking-[0.25em] transition-colors ${
              selected
                ? "border-gold bg-gold/10 text-gold"
                : "border-line/60 text-mute hover:border-gold/50 hover:text-bone"
            }`}
          >
            <span aria-hidden="true" className="mr-1.5 font-bold tracking-tight">
              {t.initial}
            </span>
            {t.short}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onPick(null)}
        className={`px-3 py-1.5 border border-mute/30 text-mute/70 hover:border-mute/60 hover:text-mute font-mono text-[10px] tracking-[0.25em] transition-colors ${
          myTeamId === null ? "border-mute/60 text-mute" : ""
        }`}
      >
        全聯盟 · 不選
      </button>
    </div>
  );
}
