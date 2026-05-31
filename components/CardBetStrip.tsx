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

// ── ZONE 27 · Card Bet Strip (R177 · Polymarket 化) ─────
// 首頁市場卡上的一鍵押 + 群眾市場線。 把押注從「點完整分析 → 進賽事頁 →
// 滑到 picker」(4 步)壓成「卡上直接押」(1 步)= Polymarket 核心體驗。
//
// 同一份 predictions 表(migration 0003 RPC)· 跟賽事頁 UserPredictionPicker
// 完全一致(押了兩處都顯示已鎖 · 一場一人一次 · server-enforced 不可改)。
// 精簡版:只有群眾線 + 一鍵押 · 完整 verdict / 海選說明留賽事頁。
// GRACEFUL:anon → 登入 CTA · 0 用戶 → 群眾線收起不佔空間 · RPC error → 不 crash。
// ─────────────────────────────────────────────────────

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
};

type Status = "loading" | "anonymous" | "open" | "locked";

export default function CardBetStrip({ matchId, homeName, awayName }: Props) {
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
          setStatus("anonymous");
          return;
        }
        const mine = await getMyPrediction(matchId);
        if (cancelled) return;
        setMyPick(mine);
        setStatus(mine ? "locked" : "open");
      } catch {
        if (!cancelled) setStatus("anonymous");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  const enter = async (pick: "home" | "away") => {
    setSaving(true);
    const res = await submitPrediction(matchId, pick);
    if (res.ok) {
      setMyPick(res.pick);
      setStatus("locked");
      const t = await getMatchTally(matchId); // refresh to include my pick
      setTally(t);
    } else if (res.reason === "already_predicted") {
      const mine = await getMyPrediction(matchId);
      setMyPick(mine);
      setStatus(mine ? "locked" : "open");
    } else if (res.reason === "not_logged_in") {
      setStatus("anonymous");
    }
    setSaving(false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-gold/15">
      {/* 群眾市場線 · 只在有人進場時顯示(冷啟動不佔空間)*/}
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

      {/* 一鍵押 */}
      {status === "loading" && (
        <div className="h-10 bg-line/20 animate-pulse rounded" aria-hidden="true" />
      )}
      {status === "anonymous" && (
        <Link
          href={`/login?next=${encodeURIComponent(`/matches/${matchId}`)}`}
          className="block text-center px-3 py-2.5 min-h-[40px] border border-gold/40 text-gold font-mono text-[10px] tracking-[0.25em] hover:bg-gold/10 transition-colors"
        >
          登入 · 一鍵進場 →
        </Link>
      )}
      {status === "open" && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => enter("home")}
            disabled={saving}
            className="px-2 py-2.5 min-h-[40px] border border-gold/40 text-bone hover:border-gold hover:bg-gold/10 font-mono text-[10px] tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            押 {homeName.slice(0, 4)}
          </button>
          <button
            type="button"
            onClick={() => enter("away")}
            disabled={saving}
            className="px-2 py-2.5 min-h-[40px] border border-gold/40 text-bone hover:border-gold hover:bg-gold/10 font-mono text-[10px] tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            押 {awayName.slice(0, 4)}
          </button>
        </div>
      )}
      {status === "locked" && myPick && (
        <p className="font-mono text-bone text-[11px] tracking-[0.15em] text-center py-1.5">
          ✓ 已押{" "}
          <span className="text-gold">
            {myPick === "home" ? homeName : awayName}
          </span>
          <span className="text-mute/50 text-[9px] ml-1.5">· 鎖定</span>
        </p>
      )}
    </div>
  );
}
