"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { readAnonPicks } from "@/lib/anon-picks";
import {
  computeCalibrationState,
  CALIBRATION_TIERS,
  type CalibrationState,
} from "@/lib/calibration-tiers";

// ── ZONE 27 · Calibration Tier Badge ────────────────────
// Round 53 W-A · Tim asked「會員分級 · 獎章 · 等級」 question · agent
// research synthesize → brand-pure 7-tier epistemic discipline system。 此
// component 是 visitor-facing surface · 渲染在 /member/calibration personal
// mode only(per agent's anti-leaderboard guard · 永遠不在 public surface
// /calibration global page)。
//
// brand IP fire:
//   - per [[zone27-disclosure-philosophy]] · tier 算法公開 · 不藏 black box
//   - per Pratfall(Aronson 1966)· badge 附帶 honest「您 X% bucket 過自信
//     Y pp」 line · 不藏 over-confidence · 直接 show drift
//   - per [[feedback-zone27-audience-fans-not-engineers]] · 「校準學徒」
//     「守紀者」 fan-grammar · 不 engineering-grammar「Tier 1」 「Level 5」
//   - per Hanus & Fox 2015 · 純 private localStorage mirror · NO social
//     leaderboard · 不違反 11「永遠不做」 第 2 條 engagement gamification
//   - per Tetlock 2015 Superforecaster pattern · 「您 vs 5,000 forecasters」
//     context · brand IP「方法公開」 延伸到 personal calibration layer
//
// SSR-safe(typeof window guard via readAnonPicks)· hydration-safe
// (discriminated union mount pattern from R40 W-G · R45 W-B)。
// ─────────────────────────────────────────────────────

type MountState =
  | { mounted: false }
  | { mounted: true; state: CalibrationState };

// Round 54 W-A · Agent 2 #1 fix · stale closure / cross-tab sync · subscribe
// to localStorage `storage` event AND a custom in-tab event(window dispatches
// it from AnonPickWidget after pushAnonPick / updatePickOutcome)so tier badge
// re-derives whenever picks change · 不只 mount-once stale。
const PICKS_CHANGE_EVENT = "zone27:anon-picks-changed";

export default function CalibrationTierBadge() {
  const [mountState, setMountState] = useState<MountState>({ mounted: false });

  useEffect(() => {
    function refresh() {
      const picks = readAnonPicks();
      const state = computeCalibrationState(picks);
      setMountState({ mounted: true, state });
    }
    refresh();
    // Cross-tab sync · localStorage write in another tab fires `storage` here
    function onStorage(e: StorageEvent) {
      if (e.key === null || e.key === "zone27_anon_picks_v1") refresh();
    }
    window.addEventListener("storage", onStorage);
    // Same-tab sync · custom event fired by AnonPickWidget after push/update
    window.addEventListener(PICKS_CHANGE_EVENT, refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(PICKS_CHANGE_EVENT, refresh);
    };
  }, []);

  if (!mountState.mounted) {
    // SSR placeholder · same height as badge to avoid layout shift
    // Round 56 W-B · Agent B Ship #1 reinforce · min-h-[240px] better matches
    // Observer state actual height(rendered N<10 badge ~240px tall + body)
    return (
      <div
        className="bg-slate/30 border border-line/60 px-5 py-6 min-h-[240px]"
        aria-hidden="true"
      />
    );
  }

  const { state } = mountState;
  const { tier, nFinalized, pratfallBin } = state;

  // 還沒夠場數 · 誠實說「還不作數」· 不假裝
  if (tier.id === 0) {
    return (
      <div className="bg-slate/40 border border-line/70 p-5 sm:p-6">
        <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-3">
          你的準度級別
        </p>
        <h3 className="text-2xl text-bone font-light tracking-tight mb-2">
          {tier.name} · 還沒開始累積
        </h3>
        <p className="text-mute/85 text-sm leading-relaxed mb-4">
          {tier.description}
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em]">
          再{" "}
          <span className="text-gold">{Math.max(0, 10 - nFinalized)}</span>{" "}
          場結算 · 就進下一級「校準學徒」
        </p>
        <p className="mt-4 text-mute/70 text-xs leading-relaxed">
          想開始累積?{" "}
          <Link
            href="/matches"
            className="text-gold underline-offset-4 hover:underline"
          >
            去市場看板選一場 CPBL
          </Link>
          {" "}· 不用註冊 · 只存這台裝置 · 不傳伺服器
        </p>
      </div>
    );
  }

  // 已上級 · 等級 + 結算場數 + 誠實的「最容易高估的地方」+ 下一級
  const tierClass = tier.id >= 4 ? "border-gold/60 bg-gold/5 glow-soft" : "border-gold/40 bg-slate/40";
  const tierColor = tier.id >= 4 ? "text-gold" : "text-bone";
  const nextTier = tier.id < 6 ? CALIBRATION_TIERS[tier.id + 1] : null;

  return (
    <div className={`border p-5 sm:p-6 ${tierClass}`} role="status">
      <p className="font-mono text-gold/85 text-[10px] tracking-[0.3em] mb-3">
        你的準度級別 · 已結算 {nFinalized} 場
      </p>
      <h3 className={`text-2xl sm:text-3xl font-light tracking-tight mb-4 ${tierColor}`}>
        {tier.name}
      </h3>

      {/* 誠實照出最容易高估自己的地方 · 不藏 */}
      {pratfallBin && (
        <div className="bg-loss/[0.06] border-l-2 border-loss/40 px-4 py-3 mb-5">
          <p className="text-bone text-[13px] tracking-wide mb-1.5">
            你最容易{pratfallBin.errorPp > 0 ? "高估" : "低估"}自己的地方
          </p>
          <p className="text-mute/90 text-[13px] leading-relaxed">
            引擎開盤落在{" "}
            <strong className="text-bone">{pratfallBin.range}</strong>{" "}
            的那些場 · 你押中的比例是{" "}
            <strong className="text-bone tabular">{pratfallBin.observed.toFixed(0)}%</strong>{" "}
            ·{" "}
            <span className={pratfallBin.errorPp > 0 ? "text-loss/85" : "text-gold/85"}>
              比帳面{pratfallBin.errorPp > 0 ? "低" : "高"}了{" "}
              {Math.abs(pratfallBin.errorPp).toFixed(0)} 個百分點
            </span>
            。 連這個我們都照實顯示。
          </p>
        </div>
      )}

      {/* 這一級代表什麼 · 球迷白話 */}
      <p className="text-mute/90 text-[13px] sm:text-sm leading-relaxed mb-4">
        {tier.description}
      </p>

      {/* 下一級 */}
      {nextTier && (
        <div className="pt-4 border-t border-line/40">
          <p className="text-mute/85 text-[13px] leading-relaxed">
            下一級「<strong className="text-bone">{nextTier.name}</strong>」· 還需累積到{" "}
            <strong className="text-bone tabular">{nextTier.nMin}</strong> 場結算
            {nextTier.brierMax !== null && <>,而且你說的把握要更貼近結果</>}。
          </p>
        </div>
      )}

      {/* 只有自己看得到 · 不上排行榜 */}
      <p className="mt-4 pt-4 border-t border-line/40 text-mute/60 text-[11px] leading-relaxed">
        這個級別只有你自己看得到 · 只存這台裝置 · 不跟別人比、也不會上任何排行榜。
      </p>
    </div>
  );
}
