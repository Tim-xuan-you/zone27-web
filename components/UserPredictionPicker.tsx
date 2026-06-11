"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  getMatchTally,
  getMyPrediction,
  getMyPredictionsClient,
  submitPrediction,
  CROWD_LINE_MIN,
  type MarketTally,
} from "@/lib/predictions-market";
import { matchHasStarted } from "@/lib/matches";
import MarketSplitBar from "@/components/MarketSplitBar";

// 上天梯門檻(同 /ladder · CalibrationIdentityCard ROOKIE_MIN)· 押滿 10 場上榜。
const LADDER_MIN = 10;

// ── ZONE 27 · 進場預測 / Market Predict ─────────────────
// 一場比賽唯一的押注 widget。 R188(2026-06-03 · Tim 拍板「要註冊才能押」)·
// 押注要登入(免費會員)。 拿掉免登入 localStorage 押注 —— 一手存瀏覽器、刪了
// 就沒、爬不了榜的注不算數(玩運彩匿名老師的病)。 登入後押進共享 predictions
// 表(0003 RPC · 一場一人一次 · server 鎖死不可改)· 餵群眾線 + 海選天梯。
// 押了不可改(先鎖後結 · 防賽後補登)· 0 金錢 0 賭注 · 純精神預測(法律唯一
// 紅線 = 真錢對賭 · 本市場不碰)。 **看(群眾線)免費 · 押要登入。**
// ─────────────────────────────────────────────────────

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
  /** 引擎開盤偏好的一邊 · null = 引擎無偏好(50/50)· 用於「對照引擎」 framing */
  engineFavorite: "home" | "away" | null;
  /** Final result if ingested · 控制 verdict 顯示 + 鎖進場 */
  finalWinner?: "home" | "away" | "tie" | null;
  /** 開賽 instant ISO · 開賽後關閉押注(先鎖後結 · 防賽後補登)· 缺則 fail-open */
  startISO?: string | null;
};

type Auth = "loading" | "logged-out" | "member";

export default function UserPredictionPicker({
  matchId,
  homeName,
  awayName,
  engineFavorite,
  finalWinner,
  startISO,
}: Props) {
  const [auth, setAuth] = useState<Auth>("loading");
  const [myPick, setMyPick] = useState<"home" | "away" | null>(null);
  const [tally, setTally] = useState<MarketTally | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 先鎖後結:已開賽即封盤(client 端算 · effect 內 · 無 hydration 風險)
  const [started, setStarted] = useState(false);
  // soul R209 · 本人累計押注場數 · 給「離上天梯還差 N 場」進度鉤(graceful · null = 不顯示)
  const [myTotal, setMyTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cancelled) setStarted(matchHasStarted(startISO));
      // 1) 先定登入狀態 · getSession 讀本地 session(不卡網路)→ 押注按鈕/閘門
      //    立刻出現,不被下面的群眾線網路抓取拖住。
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (data.session) {
          const mine = await getMyPrediction(matchId);
          if (cancelled) return;
          setMyPick(mine);
          setAuth("member");
          // 累計押注場數(給上天梯進度)· 不阻擋押注動作 · 錯誤回 {} → null 隱藏
          const all = await getMyPredictionsClient();
          if (!cancelled) setMyTotal(Object.keys(all).length);
        } else {
          setAuth("logged-out");
        }
      } catch {
        if (!cancelled) setAuth("logged-out");
      }
      // 2) 群眾線公開 · 不分登入 · 另外抓不阻擋押注動作
      const t = await getMatchTally(matchId);
      if (!cancelled) setTally(t);
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, startISO]);

  // 會員押注 · Supabase
  const enterMember = async (pick: "home" | "away") => {
    setSaving(true);
    setError(null);
    const res = await submitPrediction(matchId, pick);
    if (res.ok) {
      setMyPick(res.pick);
      // refresh 群眾線 + 本人累計場數 · re-fetch 取準確值(不靠樂觀 +1 · 防跨分頁/裝置
      // 的 out-of-band 押注漂移、也修「初次抓取失敗→基數錯」)。
      const [t, all] = await Promise.all([
        getMatchTally(matchId),
        getMyPredictionsClient(),
      ]);
      setTally(t);
      setMyTotal(Object.keys(all).length);
    } else if (res.reason === "already_predicted") {
      const mine = await getMyPrediction(matchId);
      setMyPick(mine);
    } else if (res.reason === "not_logged_in") {
      setAuth("logged-out");
    } else {
      setError("押注沒送出 · 請重試,或到 /login 重新登入");
    }
    setSaving(false);
  };

  const locked = auth === "member" && myPick !== null;
  // 封盤 = 已結算 OR 已開賽(先鎖後結 · 防賽後補登)· 已押的人仍看得到自己那手
  const closed = !!finalWinner || started;
  const loginHref = `/login?next=${encodeURIComponent(`/matches/${matchId}`)}`;

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

      {/* 群眾市場線 · 所有人都看得到(看免費)*/}
      <CrowdLine tally={tally} homeName={homeName} awayName={awayName} />

      {/* 會員賽後判決 · 峰終時刻(Kahneman peak-end)· 猜中給份量感 */}
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
              className="mt-2 block font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
            >
              把這一手寫成分析 · 賽後準度自動掛上 →
            </a>
          )}
          {/* soul R209 #8 · 分享收據(贏輸都可分享 = Pratfall · 主動邀請非分享獎勵)·
              帶到這場的單場收據(賽前鎖定 + 賽後對帳,改不了)*/}
          <Link
            href={`/receipts/${matchId}`}
            className="mt-2 block font-mono text-mute/70 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
          >
            把這張收據給朋友看 →
          </Link>
        </div>
      )}

      {/* 動作區 */}
      <div className="mt-3">
        {auth === "loading" && (
          <p className="font-mono text-mute/50 text-[10px] tracking-[0.3em]">
            載入中...
          </p>
        )}

        {/* 已封盤 · 不可進場(不分登入)· 已結算 vs 已開賽 不同說法 */}
        {auth !== "loading" && closed && !locked && (
          <p className="font-mono text-mute/85 text-[10px] tracking-[0.25em] leading-relaxed">
            {finalWinner
              ? "此場已結束 · 已無法押注(先鎖後結 · 防賽後補登)"
              : "此場已開賽 · 已封盤 · 押注賽前才收(先鎖後結 · 防賽後補登)"}
          </p>
        )}

        {/* 沒登入 + 未封盤 → 押要先成為免費會員 */}
        {auth === "logged-out" && !closed && (
          <>
            <Link
              href={loginHref}
              className="block text-center px-4 py-3 min-h-[44px] bg-gold text-navy font-mono text-[11px] tracking-[0.2em] hover:bg-gold-soft transition-colors"
            >
              免費加入 → 押這場
            </Link>
            <p className="mt-2 font-mono text-mute/60 text-[9px] tracking-[0.2em] leading-relaxed text-center">
              押一手 · 賽後看你跟引擎誰準 —— 免費會員,每一手都算進你的公開戰績(含輸、刪不掉)。
            </p>
          </>
        )}

        {/* 會員 + 未封盤 + 未押 → 押 · 引擎無偏好(50/50)時兩邊都標「引擎也難分」
            (不硬塞一邊當「同側/相反」= 校準誠實品牌不在這留接縫)*/}
        {auth === "member" && !locked && !closed && (
          <div className="grid grid-cols-2 gap-2">
            <PickButton
              label={`押 ${homeName.slice(0, 5)}`}
              mark={engineMark("home", engineFavorite)}
              disabled={saving}
              onClick={() => enterMember("home")}
            />
            <PickButton
              label={`押 ${awayName.slice(0, 5)}`}
              mark={engineMark("away", engineFavorite)}
              disabled={saving}
              onClick={() => enterMember("away")}
            />
          </div>
        )}

        {/* 會員已押 → locked */}
        {locked && myPick && (
          <p className="font-mono text-bone text-sm tracking-[0.15em]">
            ✓ 你押了{" "}
            <span className="text-gold">
              {myPick === "home" ? homeName : awayName}
            </span>
            <span className="text-mute/60 text-[10px] ml-2">· 已鎖定 · 不可改</span>
          </p>
        )}
      </div>

      {/* 押完接下一步 · 峰值不斷頭(Kahneman peak-end)· 押完最熱那刻接「下一場」迴路。
          soul R209 #7 · 加「離上天梯還差 N 場」進度鉤(對帳紀律進度,非賭場連押獎勵)。 */}
      {locked && (
        <div className="mt-3 space-y-1.5">
          {myTotal !== null && myTotal >= 1 && myTotal < LADDER_MIN ? (
            <p className="text-center font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
              你押了 <span className="text-bone tabular">{myTotal}</span> 場 · 再{" "}
              <span className="text-gold tabular">{LADDER_MIN - myTotal}</span> 場 · 就上
              <Link
                href="/ladder"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                天梯(新秀)
              </Link>
            </p>
          ) : myTotal !== null && myTotal >= LADDER_MIN ? (
            <p className="text-center font-mono text-mute/70 text-[10px] tracking-[0.2em] leading-relaxed">
              你已滿 <span className="text-gold tabular">{LADDER_MIN}</span> 場 · 已在
              <Link
                href="/ladder"
                className="text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                天梯
              </Link>
              上 —— 繼續把準度做厚
            </p>
          ) : null}
          {/* 鎖完最該去的地方 = 看它被結算的那一頁(同足球押完導「進你的帳本」)·
              修「棒球押完只導天梯/下一場、卻沒路回到顯示這手的 /member」這個動線斷頭。 */}
          <Link
            href="/member"
            className="block text-center font-mono text-gold hover:underline text-[11px] tracking-[0.2em] underline-offset-4 transition-colors"
          >
            進你的帳本 · 看你 vs 引擎 →
          </Link>
          <Link
            href="/matches"
            className="block text-center font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
          >
            {finalWinner ? "去押下一場 →" : "押下一場 · 看其他賽事 →"}
          </Link>
        </div>
      )}

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
        ▸ 你的預測自動進公開戰績 · 準度累積上{" "}
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
        群眾市場 · 還沒人押這場 · 第一手是你的 ▸
      </p>
    );
  }
  // 樣本太小 → 只報實際人數,不畫百分比 bar。 N=1 畫「100% 押 X」=
  // 拿一個人假裝是「大盤共識」(報馬仔手法)· 跟全站樣本紀律自打臉。
  if (tally.total < CROWD_LINE_MIN) {
    return (
      <div className="font-mono text-[10px] tracking-[0.2em] leading-relaxed">
        <p className="text-mute/85">
          目前 <span className="text-bone tabular">{tally.total}</span> 人押了 ·{" "}
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
      aria-label={`群眾市場線 · ${homePct}% 押 ${homeName} · ${awayPct}% 押 ${awayName} · 共 ${tally.total} 人押了`}
    >
      <div className="flex items-baseline justify-between mb-1.5 font-mono text-[10px] tracking-[0.22em] tabular gap-2 flex-wrap">
        <span className="text-gold">
          {homePct}% 押 {homeName.slice(0, 4)}
        </span>
        <span className="text-mute/70">{tally.total} 人押了</span>
        <span className="text-mute">
          {awayPct}% 押 {awayName.slice(0, 4)}
        </span>
      </div>
      <MarketSplitBar
        homePct={homePct}
        awayPct={awayPct}
        goldSide="home"
        variant="crowd"
      />
      <p className="mt-1 font-mono text-mute/50 text-[10px] tracking-[0.3em] text-center">
        群眾市場線
      </p>
    </div>
  );
}

/** 這一邊相對引擎開盤的位置 · 引擎無偏好(null)→ 兩邊都「引擎也難分」(誠實) */
function engineMark(
  side: "home" | "away",
  favorite: "home" | "away" | null
): string {
  if (favorite === null) return "引擎也難分";
  return side === favorite ? "引擎同側" : "與引擎相反";
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
      <span className="block text-[10px] opacity-70 mt-1 tracking-[0.15em]">
        {mark}
      </span>
    </button>
  );
}
