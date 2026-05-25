"use client";

// ── ZONE 27 · Anonymous Pick Widget ─────────────────────
// Round 45 W-B · Agent L DEEPEST sharp call · client component on
// /matches/[gameId] · per [[feedback-no-waiting-rule]] iron rule。
//
// Mount BEFORE engine output reveal · invite anonymous visitor to commit
// a pick before seeing the engine number · IKEA effect · 訪客 invested
// 個人 calibration vs engine over time · WITHOUT auth / email / cookies。
//
// 3 states(discriminated union mount flag per R40 W-G + R43 W-B pattern):
//   1. NOT_PICKED · 2 buttons(home / away)+ skip ↓ explicit
//   2. PICKED_PRE_REVEAL · 您 picked X · engine 在下方 · 賽後對照
//   3. REVEALED · 您 picked X · engine picked Y · actual Z · ✓PROVED / ✕DIVERGED
//
// brand IP 全 ✓:
//   - 0 gating · 「skip」 button always present · visitor never forced
//   - 0 cookies / 0 server / 0 PII · 純 localStorage zone27_anon_picks_v1
//   - per [[zone27-disclosure-philosophy]] · S06 key 公開 in /audit
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 球迷
//     pick before reveal = fan-grammar value(同 LINE/dcard 球迷 share
//     預測 native culture)
//   - per Pratfall + Costly Signaling · 訪客自己 PROVED/DIVERGED 跟
//     engine 同 reliability discipline
//
// 跟 UserPredictionPicker(logged-in version)區別:
//   - UserPredictionPicker writes to Supabase user_metadata
//   - AnonPickWidget writes to localStorage
//   - 兩 widget 共存 on /matches/[gameId] · UserPredictionPicker 在
//     logged-in flow · AnonPickWidget 在 pre-engine-reveal pre-flow
//   - 兩個 widget 目標不同:UserPredictionPicker = 「您已登入會員 track
//     record」 · AnonPickWidget = 「先 pick 再 peek engine」 IKEA loop
// ─────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAnonPickForMatch,
  pushAnonPick,
  formatPickedSince,
  type AnonPick,
} from "@/lib/anon-picks";
import type { Match } from "@/lib/matches";

type Props = {
  match: Match;
};

// R69 W-C audit F13 fix · error field added to WidgetState discriminated
// union · window.alert() blocking dialog → inline role="alert" aria-live
// region · matches LensFocusVote R69 + WaitlistForm R56 W-A pattern ·
// 同 a11y discipline · 不再 blocking keyboard navigation · brand-consistent。
type WidgetState =
  | { mounted: false }
  | {
      mounted: true;
      pick: AnonPick | null;
      /** Storage write error · displayed inline via role=alert · null when no error */
      error: string | null;
    };

export default function AnonPickWidget({ match }: Props) {
  const [state, setState] = useState<WidgetState>({ mounted: false });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({
      mounted: true,
      pick: getAnonPickForMatch(match.id),
      error: null,
    });
  }, [match.id]);

  // SSR-safe: render skeleton during SSR
  if (!state.mounted) {
    return (
      <article className="bg-slate/30 border border-line/40 p-4 sm:p-5 min-h-[120px]">
        <p
          lang="en"
          className="font-mono text-mute/60 text-[10px] tracking-[0.35em]"
        >
          / EPISTEMIC GYM · loading...
        </p>
      </article>
    );
  }

  const homeFav = match.home.winRate >= match.away.winRate;
  const enginePickedSide: "home" | "away" = homeFav ? "home" : "away";
  const engineConfidence = Math.max(match.home.winRate, match.away.winRate);
  const finalResult = match.finalResult;

  // ── STATE 1 · NOT_PICKED ──────────────────────────────
  if (!state.pick) {
    const handlePick = (side: "home" | "away") => {
      // Round 54 W-A · Agent 2 #7 fix · check pushAnonPick result · 不
      // silent loss · 若 quota / disabled localStorage · surface inline
      // error · 不假裝 saved。 brand IP「方法公開 · 不藏 broken state」
      // 物理 codify。
      // R69 W-C audit F13 fix · window.alert → inline error state · 同
      // LensFocusVote pattern + WaitlistForm R56 W-A a11y discipline。
      const result = pushAnonPick({
        matchId: match.id,
        pickedSide: side,
        enginePickedSide,
        engineConfidence,
      });
      if (!result.ok) {
        const msg =
          result.reason === "quota_exceeded"
            ? "localStorage 滿了 · pick 未存 · 清些瀏覽器資料再試"
            : result.reason === "disabled"
            ? "localStorage 被瀏覽器停用(可能私密模式)· pick 無法存"
            : "Pick 存取錯誤 · 請重試";
        setState({ mounted: true, pick: state.pick, error: msg });
        return;
      }
      // Re-read after write to update widget state · clear any prior error
      setState({
        mounted: true,
        pick: getAnonPickForMatch(match.id),
        error: null,
      });
    };

    return (
      <article className="bg-slate/40 border border-gold/40 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <p className="font-mono text-gold text-[11px] sm:text-xs tracking-[0.25em]">
            你選哪邊?
          </p>
          <span
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            0 AUTH · 0 SERVER
          </span>
        </div>
        <p className="text-bone text-base sm:text-lg leading-relaxed mb-4">
          先選一邊 · AI 等下告訴你它怎麼想 · 賽後對賬 ·{" "}
          <span className="text-gold">你 own 個人 track record vs 引擎</span>。
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <button
            type="button"
            onClick={() => handlePick("home")}
            className="px-4 py-3 sm:py-4 min-h-[44px] border border-gold/40 bg-slate/50 hover:bg-gold/10 hover:border-gold text-bone hover:text-gold font-mono text-xs tracking-[0.25em] transition-colors"
          >
            <span className="block text-[10px] text-mute/70 tracking-[0.3em] mb-1">
              HOME · 我選
            </span>
            <span className="block text-base">{match.home.name}</span>
          </button>
          <button
            type="button"
            onClick={() => handlePick("away")}
            className="px-4 py-3 sm:py-4 min-h-[44px] border border-gold/40 bg-slate/50 hover:bg-gold/10 hover:border-gold text-bone hover:text-gold font-mono text-xs tracking-[0.25em] transition-colors"
          >
            <span className="block text-[10px] text-mute/70 tracking-[0.3em] mb-1">
              AWAY · 我選
            </span>
            <span className="block text-base">{match.away.name}</span>
          </button>
        </div>
        {/* R69 W-C audit F13 fix · inline error region role="alert" aria-live · NOT
            window.alert blocking dialog · WCAG 2.1 SC 4.1.3 Status Messages compliance ·
            同 LensFocusVote R69 + WaitlistForm R56 W-A pattern。 */}
        <div
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          className="min-h-[1.25rem] mb-2"
        >
          {state.error && (
            <p className="font-mono text-loss text-[11px] tracking-[0.2em] leading-relaxed">
              ✕ {state.error}
            </p>
          )}
        </div>
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em] leading-relaxed">
          ⚓ 不 pick 也可以 · 直接滾下方看 engine · 此 widget 是 optional ·
          「不打擾就是禮物」 axiom 守。{" "}
          <Link
            href="/audit"
            className="text-gold/70 hover:text-gold underline-offset-4 hover:underline"
          >
            storage key 公開 /audit S06
          </Link>
        </p>
      </article>
    );
  }

  // ── STATE 2 · PICKED · pre-reveal (no finalResult yet) ─
  if (!finalResult) {
    const yourSide = state.pick.pickedSide;
    const yourTeam = yourSide === "home" ? match.home : match.away;
    const engineTeam = enginePickedSide === "home" ? match.home : match.away;
    const agreeWithEngine = yourSide === enginePickedSide;

    return (
      <article className="bg-slate/40 border border-gold/40 glow-soft p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.35em]"
          >
            ✓ EPISTEMIC GYM · 您 picked
          </p>
          <span
            lang="en"
            className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
          >
            LOCKED · LOCAL ONLY
          </span>
        </div>
        {/* R119 W2 · Cialdini & Trope 1976 commitment-consistency surface ·
            Agent A R119 SHIP 2 highest-priority finding · pre-existing widget
            silently hides the temporal anchor of prior commitment on return
            visits · adding visible「您 X 天前 picked」 brings commitment back
            into conscious view · foot-in-the-door psychology loop fires every
            return visit · 同 lib/last-shipped.ts Zajonc Mere Exposure pattern
            but applied to private localStorage commitment(0 broadcast · 0
            social proof · pure visitor-self temporal anchor)。 */}
        <p className="mb-3 font-mono text-mute/80 text-[10px] tracking-[0.25em]">
          您 {formatPickedSince(state.pick.pickedAt)} 鎖定 · 賽果尚未公布
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="border border-gold/60 bg-gold/10 p-3">
            <p
              lang="en"
              className="font-mono text-gold/90 text-[9px] tracking-[0.3em] mb-1"
            >
              您 PICKED
            </p>
            <p className="text-bone text-lg">{yourTeam.name}</p>
            <p
              lang="en"
              className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1"
            >
              {yourSide === "home" ? "HOME" : "AWAY"} · 您 locked
            </p>
          </div>
          <div className="border border-line/60 bg-slate/40 p-3">
            <p
              lang="en"
              className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1"
            >
              ENGINE PICKED
            </p>
            <p className="text-mute text-lg">{engineTeam.name}</p>
            <p
              lang="en"
              className="font-mono text-mute/70 text-[10px] tracking-[0.22em] mt-1"
            >
              {enginePickedSide === "home" ? "HOME" : "AWAY"} · {engineConfidence}% confidence
            </p>
          </div>
        </div>
        <p className="text-mute text-sm leading-relaxed">
          {agreeWithEngine ? (
            <>
              ✓ 您跟引擎一致 ·{" "}
              <strong className="text-bone">
                若 {yourTeam.name} 真贏 · 兩邊都 PROVED · 您 + engine 都加分
              </strong>{" "}
              · 若輸 · 兩邊都 DIVERGED · 對等收據。
            </>
          ) : (
            <>
              ⚔ 您跟引擎不同 ·{" "}
              <strong className="text-bone">
                只有一邊會 PROVED · 賽後分曉 · 累積 N≥30 後您 vs engine{" "}
                Brier 對照可比較
              </strong>{" "}
              · 結果回到此 widget 自動 update。
            </>
          )}
        </p>
        <p className="mt-3 font-mono text-mute/70 text-[9px] tracking-[0.25em]">
          🔒 您的 pick 只在您裝置 · ZONE 27 看不到 · /calibration 個人 strip
          只在您裝置 render。
        </p>
      </article>
    );
  }

  // ── STATE 3 · REVEALED (finalResult exists) ─────────────
  const yourSide = state.pick.pickedSide;
  const yourTeam = yourSide === "home" ? match.home : match.away;
  const engineTeam = enginePickedSide === "home" ? match.home : match.away;
  const actualWinnerSide = finalResult.winner;
  const actualWinnerTeam =
    actualWinnerSide === "home"
      ? match.home
      : actualWinnerSide === "away"
      ? match.away
      : null;

  const yourVerdict =
    actualWinnerSide === "tie"
      ? "push"
      : yourSide === actualWinnerSide
      ? "proved"
      : "diverged";
  const engineVerdict =
    actualWinnerSide === "tie"
      ? "push"
      : enginePickedSide === actualWinnerSide
      ? "proved"
      : "diverged";

  const verdictMeta: Record<
    "proved" | "diverged" | "push",
    { icon: string; label: string; color: string }
  > = {
    proved: { icon: "✓", label: "PROVED", color: "text-gold" },
    diverged: { icon: "✕", label: "DIVERGED", color: "text-loss/85" },
    push: { icon: "▪", label: "PUSH", color: "text-mute" },
  };

  return (
    <article className="bg-slate/50 border border-gold/60 glow-soft p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em]"
        >
          ⚡ EPISTEMIC GYM · 賽後對照
        </p>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          REVEALED · LOCAL ONLY
        </span>
      </div>
      {/* R119 W2 · Cialdini & Trope 1976 commitment-consistency on REVEALED state ·
          strongest psychological frame: 「您 X 天前 commit · 結果現在揭曉」 ·
          temporal distance between commitment and outcome ↑ commitment weight ·
          Festinger 1957 cognitive dissonance reduction · 訪客自己親 verify
          自己 prediction 對引擎 · 不靠 ZONE 27 自說自話。 */}
      <p className="mb-4 font-mono text-mute/80 text-[10px] tracking-[0.25em]">
        您 {formatPickedSince(state.pick.pickedAt)} 鎖定 · 結果已揭曉
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="border border-line/60 bg-slate/40 p-3">
          <p
            lang="en"
            className={`font-mono text-[9px] tracking-[0.3em] mb-1 ${verdictMeta[yourVerdict].color}`}
          >
            {verdictMeta[yourVerdict].icon} 您 {verdictMeta[yourVerdict].label}
          </p>
          <p className="text-bone text-base">{yourTeam.name}</p>
          <p
            lang="en"
            className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1"
          >
            您 picked {yourSide.toUpperCase()}
          </p>
        </div>
        <div className="border border-line/60 bg-slate/40 p-3">
          <p
            lang="en"
            className={`font-mono text-[9px] tracking-[0.3em] mb-1 ${verdictMeta[engineVerdict].color}`}
          >
            {verdictMeta[engineVerdict].icon} ENGINE {verdictMeta[engineVerdict].label}
          </p>
          <p className="text-bone text-base">{engineTeam.name}</p>
          <p
            lang="en"
            className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1"
          >
            engine picked {enginePickedSide.toUpperCase()} · {engineConfidence}%
          </p>
        </div>
        <div className="border border-line/60 bg-slate/40 p-3">
          <p
            lang="en"
            className="font-mono text-gold/90 text-[9px] tracking-[0.3em] mb-1"
          >
            🏆 ACTUAL
          </p>
          <p className="text-bone text-base">
            {actualWinnerTeam ? actualWinnerTeam.name : "Tie"}
          </p>
          <p
            lang="en"
            className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1"
          >
            {finalResult.homeScore} : {finalResult.awayScore}
          </p>
        </div>
      </div>
      <p className="text-mute text-xs leading-relaxed">
        <strong className="text-bone">
          {yourVerdict === engineVerdict
            ? yourVerdict === "proved"
              ? "兩邊都 PROVED · 您 + engine 同 reliability"
              : yourVerdict === "diverged"
              ? "兩邊都 DIVERGED · 對等 miss"
              : "兩邊都 PUSH · tie 不算"
            : yourVerdict === "proved"
            ? "您 PROVED · engine DIVERGED · 您贏 engine 這場"
            : "engine PROVED · 您 DIVERGED · engine 贏 您這場"}
        </strong>{" "}
        · 累積後{" "}
        <Link
          href="/calibration"
          className="text-gold underline-offset-4 hover:underline"
        >
          /calibration
        </Link>{" "}
        會 surface 您 vs engine 個人 strip(只在您裝置 render)。
      </p>
      {/* R59 W-A · Agent C Ship #2 · BLACK CARD CTA inside the highest-intent
          anonymous Lens moment · 您 just 個人下注 + 賽後對照 完成 IKEA-effect
          retention loop · NOW is the empirically-strongest conversion second
          · 5% creator 抽成 + voting 是「您剛剛 just experienced」 的 natural
          ladder。 mute / underline / non-modal / 不 lock scroll · 純 inline
          line · brand-pure。 */}
      <p className="mt-4 pt-3 border-t border-line/30 font-mono text-mute/70 text-[10px] sm:text-[11px] tracking-[0.18em] leading-relaxed">
        想 voting 引擎 v0.3 / v0.4 + 5% creator 抽成 →{" "}
        <Link
          href="/membership/black-card"
          className="text-gold/85 hover:text-gold underline-offset-4 hover:underline transition-colors"
        >
          BLACK CARD · NT$ 1,500/season →
        </Link>
      </p>
    </article>
  );
}
