"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  getMatchTally,
  getMyPrediction,
  submitPrediction,
  CROWD_LINE_MIN,
  type MarketTally,
} from "@/lib/predictions-market";
import {
  getAnonPickForMatch,
  pushAnonPick,
  updatePickOutcome,
  formatPickedSince,
  type AnonPick,
} from "@/lib/anon-picks";

// ── ZONE 27 · 進場預測 / Market Predict ─────────────────
// 一場比賽唯一的押注 widget。 兩條腿,同一個動作「押一邊」:
//
//   1. 還沒登入 → 押在「這台裝置」(localStorage · 0 註冊 · 0 伺服器)。
//      訪客第一秒就能 own 一手 · 賽後回來看自己跟引擎誰準。 登入不是
//      門檻 · 是「把這一手存進永久戰績 + 進群眾市場 + 爬天梯」的升級。
//   2. 已登入 → 押進共享的 predictions 表(migration 0003 RPC · RLS-locked ·
//      一場一人一次 · server-enforced 不可改)· 餵群眾市場線 + 海選天梯。
//
// 為什麼分兩條腿:群眾市場線要防灌票 · 只能算真帳號;個人「你 vs 引擎」
// 迴路不需要帳號就能成立。 押了都不可改(先鎖後結 · 防賽後補登)· 0 金錢
// 0 賭注 · 純精神預測(法律唯一紅線 = 真錢對賭 · 本市場不碰)。
//
// 沒登入的人押完 · CalibrationTierBadge / 個人準度 strip 會自動同步
// (pushAnonPick / updatePickOutcome 會 dispatch zone27:anon-picks-changed)。
// GRACEFUL:RPC 掛了 / 表還沒建 → 群眾線收起不 crash。
// ─────────────────────────────────────────────────────

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
  /** Pre-game engine pick(home/away ≥50%)· 用於「對照引擎」 framing */
  engineHomePicked: boolean;
  /** 引擎對 favorite 的把握度(0-100)· 存進本地 pick 供賽後對照 */
  engineConfidence: number;
  /** Final result if ingested · 控制 verdict 顯示 + 鎖進場 */
  finalWinner?: "home" | "away" | "tie" | null;
};

type Auth = "loading" | "anon" | "member";

export default function UserPredictionPicker({
  matchId,
  homeName,
  awayName,
  engineHomePicked,
  engineConfidence,
  finalWinner,
}: Props) {
  const [auth, setAuth] = useState<Auth>("loading");
  const [myPick, setMyPick] = useState<"home" | "away" | null>(null); // 會員 · Supabase
  const [anonPick, setAnonPick] = useState<AnonPick | null>(null); // 訪客 · localStorage
  const [tally, setTally] = useState<MarketTally | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loadAnon = () => {
      let p = getAnonPickForMatch(matchId);
      // 賽果出爐後,把判決寫回本地 pick(idempotent)· 之後天梯/準度才算得到
      if (p && finalWinner && p.verdict === null) {
        updatePickOutcome(matchId, finalWinner);
        p = getAnonPickForMatch(matchId);
      }
      if (!cancelled) {
        setAnonPick(p);
        setAuth("anon");
      }
    };
    (async () => {
      const t = await getMatchTally(matchId); // 群眾線公開 · 不分登入
      if (!cancelled) setTally(t);
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session) {
          const mine = await getMyPrediction(matchId);
          if (cancelled) return;
          setMyPick(mine);
          setAuth("member");
        } else {
          loadAnon();
        }
      } catch {
        loadAnon();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, finalWinner]);

  // 會員押注 · Supabase
  const enterMember = async (pick: "home" | "away") => {
    setSaving(true);
    setError(null);
    const res = await submitPrediction(matchId, pick);
    if (res.ok) {
      setMyPick(res.pick);
      const t = await getMatchTally(matchId); // refresh 含自己這一手
      setTally(t);
    } else if (res.reason === "already_predicted") {
      const mine = await getMyPrediction(matchId);
      setMyPick(mine);
    } else if (res.reason === "not_logged_in") {
      setAuth("anon");
      setAnonPick(getAnonPickForMatch(matchId));
    } else {
      setError("進場失敗 · 請重試,或到 /login 重新登入");
    }
    setSaving(false);
  };

  // 訪客押注 · localStorage(0 註冊)
  const enterLocal = (pick: "home" | "away") => {
    setError(null);
    const res = pushAnonPick({
      matchId,
      pickedSide: pick,
      enginePickedSide: engineHomePicked ? "home" : "away",
      engineConfidence,
    });
    if (!res.ok) {
      setError(
        res.reason === "quota_exceeded"
          ? "瀏覽器空間滿了 · 這一手沒存到 · 清點資料再試"
          : res.reason === "disabled"
          ? "瀏覽器停用了本機儲存(可能是無痕模式)· 這一手沒法存"
          : "存取出錯 · 請重試"
      );
      return;
    }
    setAnonPick(getAnonPickForMatch(matchId));
  };

  const locked = auth === "member" && myPick !== null;
  const anonLocked = auth === "anon" && anonPick !== null;

  return (
    <div className="mt-4 bg-gold/5 border border-gold/40 px-4 py-3">
      <div className="flex items-baseline justify-between flex-wrap gap-2 mb-3">
        <p className="font-mono text-gold text-[10px] tracking-[0.35em]">
          押一邊 · 你看好誰
        </p>
        <span className="font-mono text-mute/60 text-[9px] tracking-[0.25em]">
          點數玩法 · 0 金錢 · 押了不可改
        </span>
      </div>

      {/* 群眾市場線 · 所有人都看得到 */}
      <CrowdLine tally={tally} homeName={homeName} awayName={awayName} />

      {/* 會員賽後判決 · 峰終時刻(Kahneman peak-end)· 猜中給份量感,不是一行小字 */}
      {finalWinner && myPick && finalWinner !== "tie" && (
        <div
          className={`mt-3 border px-4 py-3 ${
            myPick === finalWinner
              ? "border-gold/60 bg-gold/10 glow-soft"
              : "border-loss/40 bg-loss/5"
          }`}
        >
          <p
            className={`font-mono text-base sm:text-lg tracking-[0.15em] ${
              myPick === finalWinner ? "text-gold" : "text-loss/80"
            }`}
          >
            {myPick === finalWinner ? "✓ 你猜中了" : "✕ 這次沒中"}
          </p>
          {myPick === finalWinner && (
            <a
              href="#say"
              className="mt-2 inline-block font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
            >
              把這一手寫成分析 · 賽後準度自動掛上 →
            </a>
          )}
        </div>
      )}

      {/* 訪客賽後判決 · 你 vs 引擎(本地 pick)*/}
      {finalWinner && anonPick && (
        <AnonVerdict
          anonPick={anonPick}
          finalWinner={finalWinner}
          homeName={homeName}
          awayName={awayName}
        />
      )}

      {/* 動作區 */}
      <div className="mt-3">
        {auth === "loading" && (
          <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em]">
            載入中...
          </p>
        )}

        {/* ── 會員 ── */}
        {auth === "member" && !locked && !finalWinner && (
          <div className="grid grid-cols-2 gap-2">
            <PickButton
              label={`押 ${homeName.slice(0, 5)}`}
              mark={engineHomePicked ? "引擎同側" : "與引擎相反"}
              disabled={saving}
              onClick={() => enterMember("home")}
            />
            <PickButton
              label={`押 ${awayName.slice(0, 5)}`}
              mark={!engineHomePicked ? "引擎同側" : "與引擎相反"}
              disabled={saving}
              onClick={() => enterMember("away")}
            />
          </div>
        )}
        {auth === "member" && !locked && finalWinner && (
          <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em]">
            此場已結束 · 已無法進場(先鎖後結 · 防賽後補登)
          </p>
        )}
        {locked && myPick && (
          <p className="font-mono text-bone text-sm tracking-[0.15em]">
            ✓ 你已進場:押{" "}
            <span className="text-gold">
              {myPick === "home" ? homeName : awayName}
            </span>
            <span className="text-mute/60 text-[10px] ml-2">· 已鎖定 · 不可改</span>
          </p>
        )}

        {/* ── 訪客 · 免登入押在這台裝置 ── */}
        {auth === "anon" && !anonLocked && !finalWinner && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <PickButton
                label={`押 ${homeName.slice(0, 5)}`}
                mark={engineHomePicked ? "引擎同側" : "與引擎相反"}
                disabled={saving}
                onClick={() => enterLocal("home")}
              />
              <PickButton
                label={`押 ${awayName.slice(0, 5)}`}
                mark={!engineHomePicked ? "引擎同側" : "與引擎相反"}
                disabled={saving}
                onClick={() => enterLocal("away")}
              />
            </div>
            <p className="mt-2 font-mono text-mute/60 text-[9px] tracking-[0.2em]">
              不用註冊 · 先押著,賽後回來看你跟引擎誰準
            </p>
          </>
        )}
        {auth === "anon" && !anonLocked && finalWinner && (
          <p className="font-mono text-mute/60 text-[10px] tracking-[0.25em]">
            此場已結束 · 已無法進場(先鎖後結 · 防賽後補登)
          </p>
        )}
        {anonLocked && anonPick && !finalWinner && (
          <div>
            <p className="font-mono text-bone text-sm tracking-[0.15em]">
              ✓ 你押了{" "}
              <span className="text-gold">
                {anonPick.pickedSide === "home" ? homeName : awayName}
              </span>
              <span className="text-mute/60 text-[10px] ml-2">
                · {formatPickedSince(anonPick.pickedAt)} · 只存這台裝置
              </span>
            </p>
            <Link
              href={`/login?next=${encodeURIComponent(`/matches/${matchId}`)}`}
              className="mt-2 inline-block font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
            >
              登入 → 存進永久戰績 · 進群眾市場 · 爬天梯
            </Link>
          </div>
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
        ▸ 登入後你的預測自動進公開戰績 · 準度累積上{" "}
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

// ── 訪客賽後判決 · 你 vs 引擎 ────────────────────────────
function AnonVerdict({
  anonPick,
  finalWinner,
  homeName,
  awayName,
}: {
  anonPick: AnonPick;
  finalWinner: "home" | "away" | "tie";
  homeName: string;
  awayName: string;
}) {
  const teamName = (side: "home" | "away") => (side === "home" ? homeName : awayName);
  const youHit = finalWinner !== "tie" && anonPick.pickedSide === finalWinner;
  const engineHit =
    finalWinner !== "tie" && anonPick.enginePickedSide === finalWinner;

  // 一句話總結你跟引擎這場誰準
  const headline =
    finalWinner === "tie"
      ? "平局 · 這場不算"
      : youHit && engineHit
      ? "你跟引擎都猜中了"
      : youHit && !engineHit
      ? "你猜中 · 引擎沒中 · 這場你贏引擎"
      : !youHit && engineHit
      ? "引擎猜中 · 你沒中 · 這場引擎贏你"
      : "你跟引擎都沒中";

  return (
    <div className="mt-3 border-t border-gold/20 pt-3">
      <p className="font-mono text-gold/80 text-[9px] tracking-[0.3em] mb-2">
        賽果出爐 · 你 {formatPickedSince(anonPick.pickedAt)} 押的
      </p>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="border border-line/60 bg-slate/40 p-2.5">
          <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mb-1">
            你押
          </p>
          <p className="text-bone text-sm">{teamName(anonPick.pickedSide)}</p>
          <p
            className={`font-mono text-[11px] tracking-[0.15em] mt-1 ${
              youHit ? "text-gold" : "text-loss/80"
            }`}
          >
            {finalWinner === "tie" ? "—" : youHit ? "✓ 中" : "✕ 沒中"}
          </p>
        </div>
        <div className="border border-line/60 bg-slate/40 p-2.5">
          <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mb-1">
            引擎押
          </p>
          <p className="text-bone text-sm">{teamName(anonPick.enginePickedSide)}</p>
          <p
            className={`font-mono text-[11px] tracking-[0.15em] mt-1 ${
              engineHit ? "text-gold" : "text-loss/80"
            }`}
          >
            {finalWinner === "tie" ? "—" : engineHit ? "✓ 中" : "✕ 沒中"}
          </p>
        </div>
      </div>
      <p className="text-bone text-sm leading-relaxed">{headline}</p>
      <p className="font-mono text-mute/55 text-[9px] tracking-[0.2em] mt-2 leading-relaxed">
        押的紀錄只存這台裝置 · 登入就能跨裝置累積、上海選天梯。
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
        群眾市場 · 尚無人進場 · 登入後你可以是第一個 ▸
      </p>
    );
  }
  // 樣本太小 → 只報實際人數,不畫百分比 bar。 N=1 畫「100% 押 X」=
  // 拿一個人假裝是「大盤共識」(報馬仔手法)· 跟全站樣本紀律自打臉。
  if (tally.total < CROWD_LINE_MIN) {
    return (
      <div className="font-mono text-[10px] tracking-[0.2em] leading-relaxed">
        <p className="text-mute/85">
          目前 <span className="text-bone tabular">{tally.total}</span> 人進場 ·{" "}
          <span className="text-gold/90 tabular">{tally.homeCount}</span> 押{" "}
          {homeName.slice(0, 4)} ·{" "}
          <span className="text-mute tabular">{tally.awayCount}</span> 押{" "}
          {awayName.slice(0, 4)}
        </p>
        <p className="text-mute/50 text-[9px] tracking-[0.22em] mt-1">
          滿 {CROWD_LINE_MIN} 人才畫群眾市場線 —— 不拿幾個人假裝是大盤。
        </p>
      </div>
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
