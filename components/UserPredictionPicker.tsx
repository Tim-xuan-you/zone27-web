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

// ── ZONE 27 · 進場預測 / Market Predict ─────────────────
// The play-money prediction market mechanic, backed by the shared
// `predictions` table (migration 0003) via SECURITY DEFINER RPCs.
//
// Replaces the old user_metadata-based picker (Round 31 W-W1). Why the
// rewrite (kept the same props, so it's drop-in on /matches/[gameId]):
//   1. CROWD MARKET LINE. user_metadata can't aggregate across users;
//      the shared table can → live「N 人進場 · X% 押主隊」crowd %.
//   2. SECURITY. Writes go through submit_prediction RPC (RLS-locked),
//      not a client-trusted user_metadata blob (closes the audit P1-C/D
//      gap for predictions).
//   3. INTEGRITY. One pick per match · IMMUTABLE (server-enforced) =
//      先鎖後結 · anti-cheat. No "change my pick" after the fact.
//      法律唯一紅線 = 真錢對賭 / 抽賭注傭(per memory legal-redline) ·
//      本市場 0 金錢 0 賭注 · 不碰紅線。 pick = home/away · 押了不可改 ·
//      你的紀錄餵公開戰績 + 海選天梯(/ladder)。
//   4. REWARDS. /rewards 的「PROVED 點數 → 換小獎」是無賭注 skill 兌換
//      (≠賭博 · 灰色可做)· 跟本市場分離:這裡只記準度上天梯,不在這
//      頁談兌獎,避免「押注=賭」的視覺聯想。
//
// Degrades gracefully: anon → login CTA (still sees the public crowd
// line); RPC error / table not yet applied → crowd line reads empty,
// no crash.
// ─────────────────────────────────────────────────────

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
  /** Pre-game engine pick(home/away ≥50%)· 用於「對照引擎」 framing */
  engineHomePicked: boolean;
  /** Final result if ingested · 控制 verdict 顯示 + 鎖進場 */
  finalWinner?: "home" | "away" | "tie" | null;
};

type Status = "loading" | "anonymous" | "open" | "locked";

export default function UserPredictionPicker({
  matchId,
  homeName,
  awayName,
  engineHomePicked,
  finalWinner,
}: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [myPick, setMyPick] = useState<"home" | "away" | null>(null);
  const [tally, setTally] = useState<MarketTally | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Crowd line is public — load it regardless of auth.
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
    setError(null);
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
    } else {
      setError("進場失敗 · 請重試,或到 /login 重新登入");
    }
    setSaving(false);
  };

  return (
    <div className="mt-4 bg-gold/5 border border-gold/40 px-4 py-3">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
        <p className="font-mono text-gold text-[10px] tracking-[0.35em]">
          進場預測 · 市場
        </p>
        <span className="font-mono text-mute/60 text-[9px] tracking-[0.25em]">
          點數玩法 · 0 金錢 · 押了不可改
        </span>
      </div>

      {/* Crowd market line */}
      <CrowdLine tally={tally} homeName={homeName} awayName={awayName} />

      {/* Verdict when the game is final */}
      {finalWinner && myPick && finalWinner !== "tie" && (
        <p
          className={`mt-3 font-mono text-sm tracking-[0.2em] ${
            myPick === finalWinner ? "text-gold" : "text-loss/80"
          }`}
        >
          {myPick === finalWinner ? "✓ 您 PROVED · 猜對了" : "✕ 您 DIVERGED · 猜錯了"}
        </p>
      )}

      {/* Action zone */}
      <div className="mt-3">
        {status === "loading" && (
          <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em]">
            載入中...
          </p>
        )}

        {status === "anonymous" && (
          <Link
            href={`/login?next=${encodeURIComponent(`/matches/${matchId}`)}`}
            className="inline-block px-4 py-2 bg-gold text-navy font-mono text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            → 登入後進場預測
          </Link>
        )}

        {status === "open" && !finalWinner && (
          <div className="grid grid-cols-2 gap-2">
            <PickButton
              label={`押 ${homeName.slice(0, 5)}`}
              mark={engineHomePicked ? "引擎同側" : "與引擎相反"}
              disabled={saving}
              onClick={() => enter("home")}
            />
            <PickButton
              label={`押 ${awayName.slice(0, 5)}`}
              mark={!engineHomePicked ? "引擎同側" : "與引擎相反"}
              disabled={saving}
              onClick={() => enter("away")}
            />
          </div>
        )}

        {status === "open" && finalWinner && (
          <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em]">
            此場已結束 · 已無法進場(先鎖後結 · 防賽後補登)
          </p>
        )}

        {status === "locked" && myPick && (
          <p className="font-mono text-bone text-sm tracking-[0.15em]">
            ✓ 您已進場:押{" "}
            <span className="text-gold">
              {myPick === "home" ? homeName : awayName}
            </span>
            <span className="text-mute/60 text-[10px] ml-2">· 已鎖定 · 不可改</span>
          </p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="font-mono text-loss text-[10px] tracking-[0.25em] mt-2"
        >
          ⚠ {error}
        </p>
      )}

      <p className="font-mono text-mute/55 text-[9px] tracking-[0.25em] mt-3 leading-relaxed">
        ▸ 您的預測自動進公開戰績 · 準度累積上{" "}
        <Link
          href="/ladder"
          className="text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
        >
          海選天梯
        </Link>
        (新秀 → 神諭)· 0 金錢 · 0 兌獎 · 純精神預測。
      </p>
    </div>
  );
}

// ── Crowd market line ───────────────────────────────────
function CrowdLine({
  tally,
  homeName,
  awayName,
}: {
  tally: MarketTally | null;
  homeName: string;
  awayName: string;
}) {
  if (!tally || tally.total === 0 || tally.homePct === null) {
    return (
      <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em]">
        群眾市場 · 尚無人進場 · 您可以是第一個 ▸
      </p>
    );
  }
  const homePct = tally.homePct;
  const awayPct = 100 - homePct;
  return (
    <div
      role="img"
      aria-label={`群眾市場線 · ${homePct}% 押 ${homeName} · ${awayPct}% 押 ${awayName} · 共 ${tally.total} 人進場`}
    >
      <div className="flex items-baseline justify-between mb-1.5 font-mono text-[10px] tracking-[0.22em] tabular gap-2 flex-wrap">
        <span className="text-gold">
          {homePct}% 押 {homeName.slice(0, 4)}
        </span>
        <span className="text-mute/70">{tally.total} 人進場</span>
        <span className="text-mute">
          {awayPct}% 押 {awayName.slice(0, 4)}
        </span>
      </div>
      <div className="relative h-2 flex overflow-hidden rounded-full bg-line/50">
        <div className="h-full bg-gold/80" style={{ width: `${homePct}%` }} />
        <div className="h-full bg-mute/40" style={{ width: `${awayPct}%` }} />
      </div>
      <p className="mt-1 font-mono text-mute/50 text-[8px] tracking-[0.3em] text-center">
        群眾市場線 · CROWD LINE
      </p>
    </div>
  );
}

function PickButton({
  label,
  mark,
  disabled,
  onClick,
}: {
  label: string;
  mark: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-2.5 min-h-[44px] border border-gold/40 text-bone hover:border-gold hover:bg-gold/10 font-mono text-[11px] tracking-[0.2em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="block">{label}</span>
      <span className="block text-[8px] opacity-60 mt-1 tracking-[0.15em]">
        {mark}
      </span>
    </button>
  );
}
