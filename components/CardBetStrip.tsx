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
import { matchHasStarted } from "@/lib/matches";
import MarketSplitBar from "@/components/MarketSplitBar";

// ── ZONE 27 · Card Bet Strip ─────────────────────────────
// 首頁 / 賽事列表市場卡上的一鍵押 + 群眾市場線。
//
// R188(2026-06-03 · Tim 拍板「要註冊才能押」)· 押注一律要登入(免費會員)。
// 拿掉舊的免登入 localStorage 押注 —— 一手存在瀏覽器、刪一下就沒、爬不了榜的
// 「注」不算數(那正是玩運彩匿名老師的病)。 登入後每一手從第一手就是真戰績:
// 進共享 predictions 表(0003 RPC · 一場一人一次 · server 鎖死不可改)· 餵群眾
// 線 + 海選天梯。 **看(群眾線)免費 · 押(下注)要登入。**
// ─────────────────────────────────────────────────────

type Props = {
  matchId: string;
  homeName: string;
  awayName: string;
  /** 開賽 instant ISO · 開賽後封盤(先鎖後結 · 防賽後補登)· 缺則 fail-open */
  startISO?: string | null;
};

type Status = "loading" | "logged-out" | "open" | "locked" | "closed";

export default function CardBetStrip({
  matchId,
  homeName,
  awayName,
  startISO,
}: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [myPick, setMyPick] = useState<"home" | "away" | null>(null);
  const [tally, setTally] = useState<MarketTally | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // 先鎖後結:已開賽即封盤(client 端算 · effect 內 · 無 hydration 風險)·
      // 已押的人仍看得到自己那手(locked 優先於 closed)。
      const started = matchHasStarted(startISO);
      // 1) 先定押注狀態 · getSession 讀本地 session(不卡網路)→ 押注閘門/按鈕
      //    立刻出現,不被下面的群眾線網路抓取拖住(原本 await tally 在前會卡 skeleton)。
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled) return;
        if (!data.session) {
          setStatus(started ? "closed" : "logged-out");
        } else {
          const mine = await getMyPrediction(matchId);
          if (cancelled) return;
          setMyPick(mine);
          setStatus(mine ? "locked" : started ? "closed" : "open");
        }
      } catch {
        if (!cancelled) setStatus(started ? "closed" : "logged-out");
      }
      // 2) 群眾線另外抓 · 慢就慢 · 不阻擋押注動作
      const t = await getMatchTally(matchId);
      if (!cancelled) setTally(t);
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId, startISO]);

  // 會員押注 · Supabase(server 端 getUser 再驗一次身分)
  const enterMember = async (pick: "home" | "away") => {
    setSaving(true);
    setError(null);
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
      setStatus("logged-out");
    } else {
      // RPC error / invalid · 不靜默吞掉 —— 誠實報錯讓用戶重試(同 UserPredictionPicker)·
      // 防「按了沒反應、卻以為押到了」的假成功陷阱(42702 家族)。
      setError("押注沒送出 · 請再試一次");
    }
    setSaving(false);
  };

  return (
    <div className="mt-3 pt-3 border-t border-gold/15">
      {/* 群眾市場線 · 看免費 · 滿門檻才畫百分比(不拿小樣本假裝共識)*/}
      {tally && tally.total >= CROWD_LINE_MIN && tally.homePct !== null && (
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
          <MarketSplitBar
            homePct={tally.homePct}
            awayPct={100 - tally.homePct}
            goldSide="home"
            variant="crowd"
          />
        </div>
      )}

      {/* 樣本太小 · 只報人數不畫滿格 bar */}
      {tally && tally.total > 0 && tally.total < CROWD_LINE_MIN && (
        <p className="mb-2 font-mono text-mute/70 text-[9px] tracking-[0.18em]">
          <span className="text-bone tabular">{tally.total}</span> 人押了 · 滿{" "}
          {CROWD_LINE_MIN} 人成形市場線 ▸
        </p>
      )}

      {/* 登入後沒人押 · 冷啟動鉤子(第一手是你的)*/}
      {tally && tally.total === 0 && status === "open" && (
        <p className="mb-2 font-mono text-gold/70 text-[9px] tracking-[0.2em]">
          還沒人押這場 · 第一手是你的 ▸
        </p>
      )}

      {status === "loading" && (
        <div className="h-10 skeleton rounded" aria-hidden="true" />
      )}

      {/* 已開賽 · 封盤(先鎖後結)· 群眾線仍看得到 · 只是不再收新押注 */}
      {status === "closed" && (
        <p className="text-center py-1.5 font-mono text-mute/60 text-[9px] tracking-[0.2em] leading-relaxed">
          已開賽 · 封盤 · 押注賽前才收
        </p>
      )}

      {/* 沒登入 → 押注要先成為免費會員(看免費 · 押要登入)*/}
      {status === "logged-out" && (
        <Link
          href={`/login?next=${encodeURIComponent(`/matches/${matchId}`)}`}
          className="block text-center px-3 py-2.5 min-h-[40px] border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold font-mono text-[10px] tracking-[0.15em] transition-colors"
        >
          登入免費註冊 → 押這場
        </Link>
      )}

      {/* 已登入未押 · 一鍵押 */}
      {status === "open" && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => enterMember("home")}
            disabled={saving}
            className="px-2 py-2.5 min-h-[40px] border border-gold/40 text-bone hover:border-gold hover:bg-gold/10 font-mono text-[10px] tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            押 {homeName.slice(0, 4)}
          </button>
          <button
            type="button"
            onClick={() => enterMember("away")}
            disabled={saving}
            className="px-2 py-2.5 min-h-[40px] border border-gold/40 text-bone hover:border-gold hover:bg-gold/10 font-mono text-[10px] tracking-[0.15em] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            押 {awayName.slice(0, 4)}
          </button>
        </div>
      )}

      {/* 押注失敗 · 誠實報錯(不靜默)· role=alert 讓螢幕閱讀器也讀到 */}
      {status === "open" && error && (
        <p
          role="alert"
          className="mt-2 text-center font-mono text-loss/90 text-[9px] tracking-[0.15em]"
        >
          {error}
        </p>
      )}

      {/* 已押 · 鎖定 = 峰終時刻(Kahneman peak-end · 押下那刻 endowment 最高)·
          把確認做成視覺高潮:glow-soft 金卡 + 隊名放大上金 + enter-fade-up ·
          原本只是 9px 灰字像腳註,浪費了全漏斗最高張力那一刻 · 再接往自己戰績的線。 */}
      {status === "locked" && myPick && (
        <div className="text-center py-2.5 px-2 border border-gold/40 bg-gold/5 glow-soft enter-fade-up rounded-sm">
          <p className="font-mono text-mute/55 text-[8px] tracking-[0.3em] mb-1">
            ✓ 已鎖定 · 不可改
          </p>
          <p className="font-mono text-gold text-base sm:text-lg tracking-[0.08em] leading-none mb-1.5">
            押 {myPick === "home" ? homeName : awayName}
          </p>
          <Link
            href="/member"
            className="inline-block font-mono text-gold/70 hover:text-gold text-[9px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
          >
            看你 vs 引擎 →
          </Link>
        </div>
      )}
    </div>
  );
}
