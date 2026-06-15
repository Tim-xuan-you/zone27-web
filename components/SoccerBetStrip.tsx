"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { matchHasStarted } from "@/lib/matches";
import {
  getMySoccerPrediction,
  getSoccerTally,
  submitSoccerPrediction,
  setSoccerConfidence,
  setSoccerRationale,
  crowdPercents,
  SOCCER_CROWD_MIN,
  type SoccerPick,
  type SoccerTally,
} from "@/lib/soccer/predictions";
import ConfidencePicker from "@/components/ConfidencePicker";
import RationalePicker from "@/components/RationalePicker";

// ── ZONE 27 · 足球三向押注條 ──────────────────────────────
// 主勝 / 和 / 客勝。 押了不可改(先鎖後結)· 登入才能押(R188)· 開賽後鎖手。
// 純精神預測 = 遊戲 · 0 金額。 賽後自動掛準/不準進你的足球準度(跟棒球分開算)。
// 守暗金品牌:選中上金 · 其餘 mute · 無紅綠。
// ─────────────────────────────────────────────────────

type State = "loading" | "anon" | "open" | "picked" | "started";

export default function SoccerBetStrip({
  matchId,
  dateISO,
  homeLabel,
  awayLabel,
  locked = false,
  returnTo = "/soccer",
}: {
  matchId: string;
  dateISO: string;
  homeLabel: string;
  awayLabel: string;
  /** 這場是否有「賽前鎖定線」(= 有單場收據可外傳)· 沒鎖的場不掛收據連結(避免 404 死連結) */
  locked?: boolean;
  /** 未登入「登入就能押」的回跳基底(預設 /soccer · 群眾盤 /markets 傳自己 → 登入後落回原卡) */
  returnTo?: string;
}) {
  const [state, setState] = useState<State>("loading");
  const [pick, setPick] = useState<SoccerPick | null>(null);
  const [tally, setTally] = useState<SoccerTally | null>(null);
  const [saving, setSaving] = useState(false);
  const [kickedOff, setKickedOff] = useState(false);
  // 樂觀 UI:點下那刻就翻「已鎖」(感知 0 延遲 · 體育/預測站房規)· 但**誠實**:server 確認前
  // 只說「鎖定中…」不假裝刪不掉;確認後才亮「✓ 賽前鎖定 · 刪不掉」+ 收據連結。 失敗回滾 + 一行輕提示。
  const [pending, setPending] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  // 信心值只在「剛押完這一刻」追問(declare conviction at lock time · reload 不再問)。
  const [justPicked, setJustPicked] = useState(false);

  // 開賽瞬間自動鎖手(即使分頁一直開著沒重整)· 只對 24h 內的場設「一次性」timer(不輪詢 ·
  // 省資源)。 已開賽的場走 0ms timer(setState 只在 timer callback 裡 · 不在 render/effect
  // 本體讀時鐘 → 無 purity / 無同步 setState 連鎖)。 >24h 的殭屍分頁由 choose() 點擊時重驗兜底。
  useEffect(() => {
    const t = Date.parse(dateISO);
    if (Number.isNaN(t)) return;
    const ms = t - Date.now();
    if (ms > 24 * 3600 * 1000) return;
    const id = setTimeout(() => setKickedOff(true), Math.max(ms, 0));
    return () => clearTimeout(id);
  }, [dateISO]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // effect 內讀時鐘(house style 同 CardBetStrip)· mount 當下 kickedOff 必為 false
      // (timer 還沒 fire),所以不讀 kickedOff(deps 才乾淨)· 開賽中的封盤由 render displayState 算。
      const startedNow = matchHasStarted(dateISO);
      getSoccerTally(matchId).then((t) => {
        if (!cancelled) setTally(t);
      });
      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user) {
          // 已開賽就不掛「登入就能押」的餌(登入後也押不了 = 釣魚)· 直接顯示封盤。
          setState(startedNow ? "started" : "anon");
          return;
        }
        const mine = await getMySoccerPrediction(matchId);
        if (cancelled) return;
        if (mine) {
          setPick(mine);
          setState("picked");
        } else {
          setState(startedNow ? "started" : "open");
        }
      } catch {
        if (!cancelled) setState(startedNow ? "started" : "anon");
      }
    })();
    return () => {
      cancelled = true;
    };
    // kickedOff 刻意不在依賴:開賽瞬間不重跑 loader(否則會覆蓋剛確認的 picked 卡)·
    // 封盤改在 render 用 displayState 算。 開賽前的時鐘判斷在 effect 內讀(mount 當下)夠用。
  }, [matchId, dateISO]);

  const choose = async (p: SoccerPick) => {
    if (saving) return;
    // 點擊瞬間重驗開賽(殭屍分頁兜底:>24h 沒 timer、或手機分頁喚醒)· server 端
    // 0018 尚無時間閘 → 這裡是先鎖後結的最後一道顯示層防線。
    if (matchHasStarted(dateISO)) {
      setKickedOff(true);
      setState("started");
      return;
    }
    // 樂觀:先翻「已鎖(鎖定中…)」→ 收據島/迷你收據立刻出現 = 感知 0 延遲。 背景送 RPC。
    const prev = state;
    setErrMsg(null);
    setPick(p);
    setState("picked");
    setPending(true);
    setSaving(true);
    const res = await submitSoccerPrediction(matchId, p);
    if (res.ok) {
      setPending(false); // server 確認 → 才亮「刪不掉」+ 收據連結
      setJustPicked(true); // 剛押完 → 追問「幾成把握」(校準大師)
      getSoccerTally(matchId).then(setTally);
    } else if (res.reason === "already_predicted") {
      // 已存在(冪等)→ 以 server 那筆為準(可能跟樂觀的不同 · 雖 UI 已擋重複)。
      const mine = await getMySoccerPrediction(matchId);
      if (mine) setPick(mine);
      setPending(false);
      getSoccerTally(matchId).then(setTally);
    } else if (res.reason === "not_logged_in") {
      // 回滾:沒登入 → 退回登入餌(不假裝鎖成功)。
      setPick(null);
      setPending(false);
      setState("anon");
    } else {
      // 回滾:其餘錯誤 → 退回原狀 + 一行輕提示(不留假的「已鎖」)。
      setPick(null);
      setPending(false);
      setState(prev === "picked" ? "open" : prev);
      setErrMsg("沒鎖成功 · 再試一次");
    }
    setSaving(false);
  };

  // 開賽後封盤改「render 時算」(不再讓 loader effect 在開賽瞬間重跑覆蓋狀態 = 把剛確認的押注卡
  // 連同信心追問打回封盤的迴歸 bug)。 🔴「已押」永遠優先:開賽不蓋掉已鎖的確認卡。
  // open/anon + 開賽(kickedOff 由一次性 timer 翻)→ 顯示封盤;picked → 永遠顯示 picked。
  const displayState: State =
    state === "picked"
      ? "picked"
      : kickedOff && (state === "open" || state === "anon")
        ? "started"
        : state;

  return (
    <div className="mt-3 pt-2.5 border-t border-line/40">
      {/* 螢幕報讀器:賽前鎖定成功的常駐 polite 播報區(此 root 永遠在 DOM → 內容由空
          變成確認句時可靠播報)· 看不見畫面的人靠這一句聽見「押下那刻」(R238)。 */}
      <div role="status" aria-live="polite" className="sr-only">
        {displayState === "picked" && pick && !pending
          ? `賽前鎖定 · 你押了 ${
              pick === "home" ? homeLabel : pick === "away" ? awayLabel : "和局"
            } · 刪不掉`
          : ""}
      </div>
      {displayState === "loading" && (
        <p className="font-mono text-mute/40 text-[9px] tracking-[0.3em]">···</p>
      )}

      {displayState === "anon" && (
        // 撞牆點做成「清楚可點的引導」(金框 + ≥44px 可點區)· 不照搬棒球整片實心金底
        // (一頁多張卡會壓過引擎 % 這個刻意 hero)· next 帶 #m-{matchId} → 登入後落回這張卡。
        <Link
          href={`/login?next=${encodeURIComponent(`${returnTo}#m-${matchId}`)}`}
          className="flex items-center justify-between gap-2 border border-gold/40 px-3 py-2.5 min-h-[44px] hover:border-gold/70 hover:bg-gold/5 transition-colors group"
        >
          <span className="font-mono text-gold/75 text-[11px] tracking-[0.15em]">
            ▸ 登入就能押這場(免費 · 押了鎖死、賽後對帳)
          </span>
          <span className="font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.25em] shrink-0">
            登入 →
          </span>
        </Link>
      )}

      {(displayState === "open" || displayState === "started") && (
        <>
          <p
            className={`font-mono text-[10px] tracking-[0.2em] mb-1.5 ${
              displayState === "started" ? "text-mute/60" : "text-gold/80"
            }`}
          >
            {displayState === "started" ? "已開賽 · 封盤 · 押注賽前才收" : "你押哪邊?(押了不可改)"}
          </p>
          <div className="flex items-stretch gap-1.5">
            <BetBtn label={`看好 ${homeLabel.slice(0, 5)}`} disabled={displayState === "started" || saving} onClick={() => choose("home")} />
            <BetBtn label="和局" disabled={displayState === "started" || saving} onClick={() => choose("draw")} />
            <BetBtn label={`看好 ${awayLabel.slice(0, 5)}`} disabled={displayState === "started" || saving} onClick={() => choose("away")} />
          </div>
          {/* 押注當下就講清楚怎麼算贏(同棒球詳情頁結算規格的精神 · 卡級一行版)·
              世界盃淘汰賽:延長賽 / PK 不影響我們開的 90 分鐘 1X2 線 → 押下前就講明。 */}
          <p className="mt-1.5 font-mono text-mute/55 text-[9px] tracking-[0.12em] leading-snug">
            以 90 分鐘正規賽結果對帳 · 延長賽 / PK 不計
          </p>
          {/* 樂觀 UI 回滾 → 輕提示(不彈窗 · 不洗版)。 */}
          {errMsg && (
            <p
              role="alert"
              className="mt-1.5 font-mono text-loss/80 text-[9px] tracking-[0.15em]"
            >
              {errMsg}
            </p>
          )}
        </>
      )}

      {/* 押下那一刻 = 全漏斗最高張力(Kahneman peak-end + endowment)· 不再只是一行灰字。
          把它做成「迷你收據」:賽前鎖死、刪不掉、這是你帳本第一筆 → 接往你的戰績。
          守紅線:暗金、無 emoji、無動畫(用既有 enter-fade-up)。 */}
      {displayState === "picked" && pick && (
        <div className="enter-fade-up border border-gold/40 bg-gold/5 px-3 py-2.5">
          {/* 誠實:server 確認前只說「鎖定中…」· 確認後才亮「刪不掉」(樂觀 UI 不假裝已成定局)。 */}
          <p className="font-mono text-mute/55 text-[8px] tracking-[0.3em] mb-1">
            {pending ? "鎖定中…" : "✓ 賽前鎖定 · 刪不掉"}
          </p>
          <p className="text-gold text-sm sm:text-base font-light tracking-tight leading-none">
            你押了 {pick === "home" ? homeLabel : pick === "away" ? awayLabel : "和局"}
          </p>
          {/* 校準大師:押完那刻追問「幾成把握」(只此刻問 · server 確認後 · declare-at-lock)。 */}
          {!pending && justPicked && (
            <>
              <ConfidencePicker matchId={matchId} submit={setSoccerConfidence} />
              <RationalePicker matchId={matchId} submit={setSoccerRationale} />
            </>
          )}
          {/* 收據連結 / 帳本連結等 server 確認後才出(收據島讀的是 server 那筆 · 未存前出來會空)。 */}
          {!pending && (
            <>
              {/* 押下那一刻 = 最想曬的時候(病毒槓桿)· 有賽前鎖定線的場給一張現在就能外傳的單場
                  收據(賽前鎖死、改不了)。 沒鎖定線的場不掛(避免 /receipts 404 死連結)。 */}
              {locked && (
                <Link
                  href={`/receipts/${matchId}`}
                  className="mt-2 inline-flex items-center gap-1.5 min-h-[36px] font-mono text-gold/90 hover:text-gold text-[10px] tracking-[0.2em] border border-gold/40 hover:border-gold/70 hover:bg-gold/10 px-2.5 py-1.5 transition-colors"
                >
                  ▸ 外傳這手 · 賽前鎖定收據 →
                </Link>
              )}
              <div className="mt-2 flex items-center justify-between gap-2 flex-wrap">
                <span className="font-mono text-mute/55 text-[9px] tracking-[0.15em]">
                  賽後逐場對帳 · 連輸的都留著
                </span>
                <Link
                  href="/member"
                  className="font-mono text-gold/70 hover:text-gold text-[9px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors shrink-0"
                >
                  進你的帳本 →
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      <CrowdLine tally={tally} homeLabel={homeLabel} awayLabel={awayLabel} state={displayState} />
    </div>
  );
}

function BetBtn({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 px-2 py-2.5 min-h-[40px] font-mono text-[10px] tracking-[0.1em] border border-gold/40 text-bone hover:border-gold hover:bg-gold/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
    >
      {label}
    </button>
  );
}

function CrowdLine({
  tally,
  homeLabel,
  awayLabel,
  state,
}: {
  tally: SoccerTally | null;
  homeLabel: string;
  awayLabel: string;
  state: State;
}) {
  // 登入未押、還沒人押 → 冷啟動鉤子(第一手是你的)· 同棒球 CardBetStrip。 其餘狀態 N=0 不顯示。
  if (!tally || tally.total === 0) {
    if (state === "open") {
      return (
        <p className="mt-2 font-mono text-gold/70 text-[9px] tracking-[0.2em]">
          群眾市場 · 還沒人押這場 · 第一手是你的 ▸
        </p>
      );
    }
    return null;
  }
  if (tally.total < SOCCER_CROWD_MIN) {
    return (
      <p className="mt-2 font-mono text-mute/45 text-[9px] tracking-[0.15em]">
        {tally.total} 人押了 · 滿 {SOCCER_CROWD_MIN} 人才畫群眾市場線 —— 不拿幾個人假裝是大盤
      </p>
    );
  }
  const p = crowdPercents(tally);
  return (
    <p className="mt-2 font-mono text-mute/55 text-[9px] tracking-[0.12em] tabular">
      群眾:{homeLabel.slice(0, 4)} {p.home}% · 和 {p.draw}% ·{" "}
      {awayLabel.slice(0, 4)} {p.away}%{" "}
      <span className="text-mute/40">({tally.total} 人)</span>
    </p>
  );
}
