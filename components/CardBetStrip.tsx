"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  getMatchTally,
  getMyPrediction,
  submitPrediction,
  type MarketTally,
} from "@/lib/predictions-market";
import { getAnonPickForMatch, pushAnonPick } from "@/lib/anon-picks";

// ── ZONE 27 · Card Bet Strip (R177 · Polymarket 化) ─────
// 首頁市場卡上的一鍵押 + 群眾市場線。 把押注從「點完整分析 → 進賽事頁 →
// 滑到 picker」(4 步)壓成「卡上直接押」(1 步)= Polymarket 核心體驗。
//
// 兩條腿,同一個動作(跟賽事頁 UserPredictionPicker 完全一致):
//   · 還沒登入 → 押在這台裝置(localStorage · 0 註冊)· 一秒 own 一手
//   · 已登入 → 押進共享 predictions 表(0003 RPC · 餵群眾線)· 一場一人一次
// GRACEFUL:0 用戶 → 群眾線收起 · RPC error → 不 crash。
// ─────────────────────────────────────────────────────

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
  /** 引擎賽前看好哪邊(home ≥ away)· 存進本地 pick 供賽後對照 */
  engineHomePicked: boolean;
  /** 引擎對 favorite 的把握度(0-100)*/
  engineConfidence: number;
};

type Status = "loading" | "anon-open" | "anon-locked" | "open" | "locked";

export default function CardBetStrip({
  matchId,
  homeName,
  awayName,
  engineHomePicked,
  engineConfidence,
}: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [myPick, setMyPick] = useState<"home" | "away" | null>(null);
  const [tally, setTally] = useState<MarketTally | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const t = await getMatchTally(matchId);
      if (!cancelled) setTally(t);
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (!data.session) {
          const local = getAnonPickForMatch(matchId);
          setMyPick(local ? local.pickedSide : null);
          setStatus(local ? "anon-locked" : "anon-open");
          return;
        }
        const mine = await getMyPrediction(matchId);
        if (cancelled) return;
        setMyPick(mine);
        setStatus(mine ? "locked" : "open");
      } catch {
        if (cancelled) return;
        const local = getAnonPickForMatch(matchId);
        setMyPick(local ? local.pickedSide : null);
        setStatus(local ? "anon-locked" : "anon-open");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  // 會員 · Supabase
  const enterMember = async (pick: "home" | "away") => {
    setSaving(true);
    const res = await submitPrediction(matchId, pick);
    if (res.ok) {
      setMyPick(res.pick);
      setStatus("locked");
      const t = await getMatchTally(matchId);
      setTally(t);
    } else if (res.reason === "already_predicted") {
      const mine = await getMyPrediction(matchId);
      setMyPick(mine);
      setStatus(mine ? "locked" : "open");
    } else if (res.reason === "not_logged_in") {
      const local = getAnonPickForMatch(matchId);
      setMyPick(local ? local.pickedSide : null);
      setStatus(local ? "anon-locked" : "anon-open");
    }
    setSaving(false);
  };

  // 訪客 · localStorage(0 註冊)
  const enterLocal = (pick: "home" | "away") => {
    const res = pushAnonPick({
      matchId,
      pickedSide: pick,
      enginePickedSide: engineHomePicked ? "home" : "away",
      engineConfidence,
    });
    if (res.ok) {
      setMyPick(pick);
      setStatus("anon-locked");
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gold/15">
      {/* 群眾市場線 · 有人進場時顯示 */}
      {tally && tally.total > 0 && tally.homePct !== null && (
        <div
          role="img"
          aria-label={`群眾市場線 · ${tally.homePct}% 押 ${homeName} · ${tally.total} 人進場`}
          className="mb-2"
        >
          <div className="flex items-baseline justify-between mb-1 font-mono text-[9px] tracking-[0.2em] tabular text-mute">
            <span className="text-gold">
              {tally.homePct}% 群眾押 {homeName.slice(0, 4)}
            </span>
            <span>{tally.total} 人</span>
          </div>
          <div className="relative h-1.5 flex overflow-hidden rounded-full bg-line/50">
            <div
              className="h-full bg-gold/70"
              style={{ width: `${tally.homePct}%` }}
            />
            <div
              className="h-full bg-mute/35"
              style={{ width: `${100 - tally.homePct}%` }}
            />
          </div>
        </div>
      )}

      {/* 冷啟動鉤子 · 還沒人押時,把空盤翻成「第一手是你的」邀請 */}
      {tally &&
        tally.total === 0 &&
        (status === "open" || status === "anon-open") && (
          <p className="mb-2 font-mono text-gold/70 text-[9px] tracking-[0.2em]">
            還沒人押這場 · 第一手是你的 ▸
          </p>
        )}

      {/* 一鍵押 */}
      {status === "loading" && (
        <div className="h-10 bg-line/20 animate-pulse rounded" aria-hidden="true" />
      )}
      {(status === "open" || status === "anon-open") && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              status === "open" ? enterMember("home") : enterLocal("home")
            }
            disabled={saving}
            className="px-2 py-2.5 min-h-[40px] border border-gold/40 text-bone hover:border-gold hover:bg-gold/10 font-mono text-[10px] tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            押 {homeName.slice(0, 4)}
          </button>
          <button
            type="button"
            onClick={() =>
              status === "open" ? enterMember("away") : enterLocal("away")
            }
            disabled={saving}
            className="px-2 py-2.5 min-h-[40px] border border-gold/40 text-bone hover:border-gold hover:bg-gold/10 font-mono text-[10px] tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            押 {awayName.slice(0, 4)}
          </button>
        </div>
      )}
      {status === "anon-open" && (
        <p className="mt-1.5 font-mono text-mute/55 text-[9px] tracking-[0.18em] text-center">
          不用註冊 · 先押著
        </p>
      )}
      {(status === "locked" || status === "anon-locked") && myPick && (
        <div className="text-center py-1.5">
          <p className="font-mono text-bone text-[11px] tracking-[0.15em]">
            ✓ 已押{" "}
            <span className="text-gold">
              {myPick === "home" ? homeName : awayName}
            </span>
            <span className="text-mute/50 text-[9px] ml-1.5">
              {status === "anon-locked" ? "· 存這裝置" : "· 鎖定"}
            </span>
          </p>
          {status === "anon-locked" && (
            <Link
              href={`/login?next=/matches/${matchId}`}
              className="inline-block mt-1 font-mono text-gold/70 hover:text-gold text-[9px] tracking-[0.18em] underline-offset-4 hover:underline transition-colors"
            >
              登入 → 存成永久戰績、進群眾市場 ▸
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
