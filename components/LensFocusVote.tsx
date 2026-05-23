"use client";

// ── ZONE 27 · Lens Focus Vote Widget ────────────────────
// R67 W-A · Agent R66 psychology synthesize ship #1 deferred · per
// [[feedback-no-waiting-rule]] default ship NOW · Cialdini & Trope 1976
// commitment-consistency 物理 codify。
//
// Mount BEFORE /02 LENS CANVAS hub on /matches/[gameId] · invite訪客
// 1-tap pre-commit「您認為哪個 lens 對今晚這場最 matter」 · 後 visitor
// read through lens canvas 帶 own commitment 對比 · 比起 cold scroll ·
// IKEA effect + commitment-consistency 同時 fire。
//
// 2 states · SSR-safe discriminated union mount pattern(同 AnonPick
// 結構):
//   1. NOT_VOTED · 6 lens chips + 「先別選 ↓」 skip
//   2. VOTED · 您 picked X · 7-lens canvas 已標紅圈 + 「重選 →」 toggle
//
// brand IP 全 ✓:
//   - 0 gating · skip 隨時可達 · 不打擾就是禮物 axiom 守
//   - 0 cookies / 0 server / 0 PII · 純 localStorage(per /audit S06)
//   - 「您 picked X」 widget renders post-vote · 不 leaderboard / 不
//     show「X% voters chose park factor」 live feed(violates 「不做」
//     #5 FOMO counter spirit + brand IP「方法公開 · 不裝 social proof」)
//   - 0 reward animation · 0 「您答對了」 dopamine · 純 pre-commit
//     + post-explore self-audit · 倒置 gambling 心理 loop
//
// 跟 AnonPickWidget 區別:
//   - AnonPickWidget = 您 pick which TEAM wins(home/away · binary)
//   - LensFocusVote = 您 pick which LENS decides this game(angle · 6-way)
//   - 兩個 widget 共存 · 不衝突 · 一前一後形成 commitment ladder:
//       1. pre-engine-reveal: AnonPick(team-level)
//       2. pre-lens-canvas: LensFocusVote(angle-level)
//       3. post-canvas: visitor explores 7 lenses with both commitments
//          mentally active · Cialdini-foot-in-the-door pattern
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getLensFocusVoteForMatch,
  pushLensFocusVote,
  type LensFocusVote,
  type LensId,
  LENS_OPTIONS,
} from "@/lib/lens-focus-votes";

type Props = {
  matchId: string;
};

type WidgetState =
  | { mounted: false }
  | { mounted: true; vote: LensFocusVote | null };

export default function LensFocusVote({ matchId }: Props) {
  const [state, setState] = useState<WidgetState>({ mounted: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ mounted: true, vote: getLensFocusVoteForMatch(matchId) });
  }, [matchId]);

  // SSR-safe skeleton(per AnonPick R45 W-B pattern · R68 W-D audit F11
  // CLS fix · min-h-[420px] matches NOT_VOTED state actual height(6
  // buttons in 2-3 col grid + intro + footer · 沒 CLS jitter on slow
  // connections when state hydrates)。
  if (!state.mounted) {
    return (
      <article className="bg-slate/30 border border-line/40 p-4 sm:p-5 min-h-[420px]">
        <p
          lang="en"
          className="font-mono text-mute/60 text-[10px] tracking-[0.35em]"
        >
          / LENS FOCUS · loading...
        </p>
      </article>
    );
  }

  const handleVote = (lens: LensId) => {
    const result = pushLensFocusVote({ matchId, votedLens: lens });
    if (!result.ok) {
      const msg =
        result.reason === "quota_exceeded"
          ? "localStorage 滿了 · vote 未存 · 清些瀏覽器資料再試"
          : result.reason === "disabled"
            ? "localStorage 被瀏覽器停用(可能私密模式)· vote 無法存"
            : "Vote 存取錯誤 · 請重試";
      if (typeof window !== "undefined") {
        window.alert(msg);
      }
      return;
    }
    setState({ mounted: true, vote: getLensFocusVoteForMatch(matchId) });
  };

  const handleReset = () => {
    // Re-vote 是 OK(idempotent overwrite)· null state 引導重選 1 個
    // lens · 不刪 localStorage 直接覆寫 next click。 此 button 透明
    // 顯示「您現在可以重選」 intent · brand IP「不藏 reversibility」 axiom。
    setState({ mounted: true, vote: null });
  };

  // ── STATE 1 · NOT_VOTED ──────────────────────────────
  if (!state.vote) {
    return (
      <article className="bg-slate/40 border border-gold/40 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.35em]"
          >
            🔭 LENS FOCUS · pre-canvas pre-commit
          </p>
          <span
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            ANON · localStorage · 0 auth
          </span>
        </div>
        <p className="text-bone text-sm sm:text-base leading-relaxed mb-4">
          下方有 6 個獨立 lens · 您認為{" "}
          <span className="text-gold">哪一個</span>{" "}
          對今晚這場最 matter?{" "}
          <span className="text-mute">先點 1 個 · 再往下滾</span> ·
          IKEA effect + commitment-consistency = 您 reading lens 帶 own bet
          mentally active。
        </p>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mb-3">
          {LENS_OPTIONS.map((lens) => (
            <li key={lens.id}>
              <button
                type="button"
                onClick={() => handleVote(lens.id)}
                className="w-full min-h-[44px] px-3 py-2 sm:py-3 border border-gold/40 bg-slate/50 hover:bg-gold/10 hover:border-gold text-left transition-colors group"
                aria-label={`Vote ${lens.enLabel} as most-decisive lens for this game`}
              >
                <span className="block font-mono text-gold/80 group-hover:text-gold text-[9px] tracking-[0.3em] mb-1 transition-colors">
                  / {lens.code}
                </span>
                <span className="block font-mono text-bone group-hover:text-gold text-[11px] tracking-[0.2em] transition-colors">
                  {lens.enLabel}
                </span>
                <span className="block text-mute group-hover:text-bone text-[12px] mt-1 transition-colors">
                  {lens.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em] leading-relaxed">
          ⚓ 不 vote 也可以 · 直接滾下方 7-lens canvas · 此 widget 是
          optional · 您 vote 只在您裝置 · 不傳 server · 沒 leaderboard ·
          不顯示「X% 訪客選 park factor」 social proof。{" "}
          <Link
            href="/audit#section-06"
            className="text-gold/70 hover:text-gold underline-offset-4 hover:underline"
          >
            storage key 公開 /audit S06
          </Link>
        </p>
      </article>
    );
  }

  // ── STATE 2 · VOTED ────────────────────────────────
  // R68 W-D audit F6 fix · role="status" + aria-live="polite" 在外層
  // article · WCAG 2.1 SC 4.1.3 Status Messages compliance · 螢幕閱讀器
  // 使用者 vote 後立即被通知 widget 已更新(NEW content 「您 voted」)·
  // 同 WaitlistForm role="alert" pattern · 但 vote 是 success 非 error
  // 故用 role="status" 更精確。
  const voted = LENS_OPTIONS.find((l) => l.id === state.vote!.votedLens)!;

  return (
    <article
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="bg-slate/40 border border-gold/60 glow-soft p-4 sm:p-5"
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em]"
        >
          ✓ LENS FOCUS · 您 voted
        </p>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          LOCKED · LOCAL ONLY
        </span>
      </div>
      <div className="border border-gold/60 bg-gold/10 p-3 sm:p-4 mb-4">
        <p
          lang="en"
          className="font-mono text-gold/90 text-[9px] tracking-[0.3em] mb-1"
        >
          / {voted.code} · YOU PICKED
        </p>
        <p className="font-mono text-bone text-lg sm:text-xl tracking-[0.15em]">
          {voted.enLabel}
        </p>
        <p className="text-mute text-sm mt-1">{voted.label}</p>
      </div>
      <p className="text-mute text-sm leading-relaxed mb-3">
        往下滾看 6-lens canvas ·{" "}
        <strong className="text-bone">
          看 your bet 是否跟 reading 體驗一致
        </strong>{" "}
        · 賽後 ledger ingest 後此 widget 不 update · 純 pre-canvas commitment
        artifact · 不 retroactively grade。
      </p>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleReset}
          className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.3em] underline-offset-4 hover:underline transition-colors"
        >
          重選 / RE-VOTE →
        </button>
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em] leading-relaxed">
          🔒 純您裝置 · 0 server · 0 PII ·{" "}
          <Link
            href="/audit#section-06"
            className="text-gold/70 hover:text-gold underline-offset-4 hover:underline"
          >
            /audit S06
          </Link>
        </p>
      </div>
    </article>
  );
}
