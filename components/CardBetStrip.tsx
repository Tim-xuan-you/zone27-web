"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import {
  getMatchTally,
  getMyPrediction,
  submitPrediction,
  setPredictionConfidence,
  setPredictionRationale,
  CROWD_LINE_MIN,
  type MarketTally,
} from "@/lib/predictions-market";
import { matchHasStarted } from "@/lib/matches";
import MarketSplitBar from "@/components/MarketSplitBar";
import ConfidencePicker from "@/components/ConfidencePicker";
import RationalePicker from "@/components/RationalePicker";

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
  /** 引擎開盤的主隊勝率 % · 給「引擎 vs 群眾共識線」對照(Polymarket 招牌)· 缺則不顯示對照 */
  engineHomePct?: number;
};

type Status = "loading" | "logged-out" | "open" | "locked" | "closed";

export default function CardBetStrip({
  matchId,
  homeName,
  awayName,
  startISO,
  engineHomePct,
}: Props) {
  const [status, setStatus] = useState<Status>("loading");
  const [myPick, setMyPick] = useState<"home" | "away" | null>(null);
  const [tally, setTally] = useState<MarketTally | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 樂觀 UI(同 SoccerBetStrip 房規):點下瞬間翻「已鎖」=感知 0 延遲 · 但誠實:server 確認前
  // 只說「鎖定中…」不亮「不可改」/ 不發光 / 不出帳本連結;確認後才定局。 失敗乾淨回滾。
  const [pending, setPending] = useState(false);
  // 信心值只在「剛押完這一刻」追問(declare-at-lock · reload 不再問)。
  const [justPicked, setJustPicked] = useState(false);

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
    // 點擊瞬間重驗開賽:mount 時算的 started 不會自己更新(手機分頁隔天喚醒 ·
    // 殭屍分頁)→ 開賽後按下去會送出晚押 · 結算端雖會剔除但用戶看到的是黑洞。
    if (matchHasStarted(startISO)) {
      setStatus("closed");
      return;
    }
    // 樂觀:先翻「已鎖(鎖定中…)」→ 確認卡立刻出現 = 感知 0 延遲 · 背景送 RPC。
    const prev = status;
    setError(null);
    setMyPick(pick);
    setStatus("locked");
    setPending(true);
    setSaving(true);
    const res = await submitPrediction(matchId, pick);
    if (res.ok) {
      setMyPick(res.pick);
      setPending(false); // server 確認 → 才亮「不可改」+ 帳本連結 + 發光
      setJustPicked(true); // 剛押完 → 追問「幾成把握」(校準大師)
      const t = await getMatchTally(matchId);
      setTally(t);
    } else if (res.reason === "already_predicted") {
      const mine = await getMyPrediction(matchId);
      setMyPick(mine);
      setStatus(mine ? "locked" : "open");
      setPending(false);
    } else if (res.reason === "not_logged_in") {
      // 回滾:沒登入 → 退回登入餌(不假裝鎖成功)。
      setMyPick(null);
      setPending(false);
      setStatus("logged-out");
    } else {
      // 回滾:RPC error / invalid → 退回可押 + 誠實報錯(不留假的「已鎖」· 防假成功陷阱 42702 家族)。
      setMyPick(null);
      setPending(false);
      setStatus(prev === "locked" ? "open" : prev);
      setError("押注沒送出 · 請再試一次");
    }
    setSaving(false);
  };

  // 賽前可外傳收據(R220)· 只 CPBL 有(MLB 賽前收據暫緩)· 避免 /receipts 404 死連結。
  const cpbl = matchId.startsWith("cpbl-");

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
          {/* 引擎 vs 群眾共識線(Polymarket 招牌)· 哪裡群眾跟模型不同調 = 最有看頭的訊號。
              🔴 純資訊、不喊押(誠實:我們秀差距,不叫你跟單)· graceful:engineHomePct 缺 → 不顯示。
              已在「滿 CROWD_LINE_MIN 人」的 block 內 → 0/小樣本自動躲(不拿幾個人假裝共識)。 */}
          {typeof engineHomePct === "number" &&
            (() => {
              const d = tally.homePct! - engineHomePct;
              const same = Math.abs(d) < 3;
              return (
                <p className="mt-1 font-mono text-mute/60 text-[9px] tracking-[0.12em] tabular leading-snug">
                  引擎 <span className="text-gold/80">{engineHomePct}%</span> · 群眾{" "}
                  <span className="text-bone/80">{tally.homePct}%</span>
                  {same
                    ? " · 群眾與引擎同調"
                    : d > 0
                      ? ` · 群眾更看好 ${homeName.slice(0, 4)}（+${d}）`
                      : ` · 群眾更看好 ${awayName.slice(0, 4)}（+${-d}）`}
                </p>
              );
            })()}
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
        <p className="text-center py-1.5 font-mono text-mute/85 text-[9px] tracking-[0.2em] leading-relaxed">
          已開賽 · 封盤 · 押注賽前才收
        </p>
      )}

      {/* 沒登入 → 押注要先成為免費會員(看免費 · 押要登入)。 在「決策點」講清楚遊戲
          規則:看引擎開盤免費,押一手才要登入(免費)· 賽後對帳算進你的公開戰績。
          原本只有一顆「免費加入」鈕、沒講為什麼 = 整個產品的核心邏輯在第一眼隱形。 */}
      {status === "logged-out" && (
        <>
          <p className="mb-1.5 text-center font-mono text-mute/55 text-[9px] tracking-[0.12em] leading-snug">
            看開盤免費 · 押一手要登入(免費)· 賽後對帳進你的公開戰績
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(`/matches/${matchId}`)}`}
            className="block text-center px-3 py-2.5 min-h-[40px] border border-gold/40 text-gold hover:bg-gold/10 hover:border-gold font-mono text-[10px] tracking-[0.15em] transition-colors"
          >
            免費加入 → 押這場
          </Link>
        </>
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
        <div
          className={`text-center py-2.5 px-2 border border-gold/40 bg-gold/5 enter-fade-up rounded-sm ${
            pending ? "" : "glow-soft"
          }`}
        >
          {/* 誠實:server 確認前只說「鎖定中…」· 不發光 · 不亮「不可改」(樂觀 UI 不假裝定局)。 */}
          <p className="font-mono text-mute/55 text-[8px] tracking-[0.3em] mb-1">
            {pending ? "鎖定中…" : "✓ 已鎖定 · 不可改"}
          </p>
          <p className="font-mono text-gold text-base sm:text-lg tracking-[0.08em] leading-none mb-1.5">
            押 {myPick === "home" ? homeName : awayName}
          </p>
          {/* 校準大師:押完那刻追問「幾成把握」(只此刻問 · declare-at-lock)· 左對齊不被卡片置中壓扁。 */}
          {!pending && justPicked && (
            <div className="text-left mt-1">
              <ConfidencePicker matchId={matchId} submit={setPredictionConfidence} />
              <RationalePicker matchId={matchId} submit={setPredictionRationale} />
            </div>
          )}
          {/* 帳本連結 + 賽前可外傳收據(R220)等 server 確認後才出(未存前進去看不到這手)。 */}
          {!pending && (
            <div className="flex flex-col items-center gap-1.5">
              {/* 押下那一刻 = 最想曬的時候(病毒槓桿)· CPBL 給一張現在就能外傳的賽前收據
                  (賽前鎖死、改不了)· 非 CPBL 不掛(避免 /receipts 404 死連結)。 */}
              {cpbl && (
                <Link
                  href={`/receipts/${matchId}`}
                  className="inline-flex items-center gap-1.5 min-h-[36px] font-mono text-gold/90 hover:text-gold text-[10px] tracking-[0.2em] border border-gold/40 hover:border-gold/70 hover:bg-gold/10 px-2.5 py-1.5 transition-colors"
                >
                  ▸ 外傳這手 · 賽前鎖定收據 →
                </Link>
              )}
              <Link
                href="/member"
                className="inline-block font-mono text-gold/70 hover:text-gold text-[9px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
              >
                看你 vs 引擎 →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
