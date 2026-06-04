"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getMyPredictionsClient } from "@/lib/predictions-market";
import { aggregatePredictionStats } from "@/lib/predictions";

// ── ZONE 27 · 你 vs 引擎 · 登入後個人戰績條 ──────────────────
// R189(2026-06-03)· 取代死掉的 AnonCalibrationStrip(首頁)+ LadderPosition
// (天梯)。 R188 註冊閘門拿掉免登入押注後,舊的 localStorage 匿名戰績整串成
// 死碼(zone27_anon_picks_v1 沒人再寫)。 這支改讀 DB:
//   · 押注一律登入 → 進共享 predictions 表(0003)→ get_my_predictions(0006)
//   · 同 /member 的 aggregatePredictionStats 評分 · 單一真相來源 · 不重算
//
// 為什麼 client-side render:首頁 + /ladder 是 ISR 靜態快取(revalidate),
// server 端讀 per-user 登入態會把某個人的資料快取給所有人。 所以讓頁面維持
// 靜態 · 這支在 hydrate 後才抓本人資料填上 —— 同舊匿名版的漸進增強模式,只是
// 資料源從 localStorage 換成 DB。
//
// 顯示規則(極簡 · 不對訪客喊話):
//   · 沒登入 / 抓取失敗 → 不顯示(乾淨 · 看板/頁面 body 自己接冷啟動)
//   · 登入但 0 押注 → 不顯示(會員自己的介面不重複喊「去押第一注」)
//   · 登入且押過 → 顯示「你 vs 引擎」· 這才是回訪的靈魂鉤子
//
// matchResults 由 server 端頁面把「已結算賽事的勝方」當 prop 傳進來(靜態
// 資料 · 無隱私問題)· 評分在前端跑 · 未結算的押注自動算 pending。
// ─────────────────────────────────────────────────────

const ROOKIE_MIN = 10; // 上「新秀」門檻 · 同 /member · /ladder

type MatchResult = { id: string; finalWinner: "home" | "away" | "tie" | null; startISO?: string | null };

type Stats = ReturnType<typeof aggregatePredictionStats>;

type Props = {
  /** "home" · 首頁市場看板上方的回訪鉤子 · "ladder" · 天梯上的個人進度 */
  variant: "home" | "ladder";
  /** 已結算賽事的勝方(靜態)· 前端用來評分本人押注 */
  matchResults: MatchResult[];
};

export default function YourRecordStrip({ variant, matchResults }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        // getUser(JWT 驗證)· 不用 getSession(只讀 cookie)· 同全站 trust path 慣例
        const { data } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!data.user) return; // 沒登入 → 安靜不顯示
        const map = await getMyPredictionsClient();
        if (cancelled) return;
        setStats(aggregatePredictionStats(map, matchResults));
      } catch {
        // 安靜降級 · 不顯示
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchResults]);

  // 還在抓 / 沒登入 / 沒押過 → 不佔空間
  if (!ready || !stats || stats.total === 0) return null;

  return variant === "home" ? (
    <HomeStrip stats={stats} />
  ) : (
    <LadderStrip stats={stats} />
  );
}

// ── 首頁變體 · 市場看板上方一條 · 回訪先看到自己跟引擎誰準 ──────
function HomeStrip({ stats }: { stats: Stats }) {
  const decided = stats.proved + stats.diverged;
  return (
    <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-8">
      <Link
        href="/member"
        className="flex items-center justify-between gap-4 border border-gold/30 bg-slate/30 hover:bg-slate/40 hover:border-gold/50 transition-colors p-4 sm:p-5 group"
      >
        <div className="min-w-0">
          <p className="font-mono text-gold/90 text-[10px] tracking-[0.35em] mb-1.5">
            你 vs 引擎
          </p>
          <p className="text-bone text-sm leading-snug">
            你押了 <span className="font-mono text-gold tabular">{stats.total}</span> 場
            {decided > 0 && (
              <>
                {" "}· <span className="font-mono text-gold tabular">✓{stats.proved}</span>{" "}
                <span className="font-mono text-loss/85 tabular">✕{stats.diverged}</span>
              </>
            )}
            {stats.pending > 0 && (
              <span className="text-mute/70"> · {stats.pending} 場在場上</span>
            )}
          </p>
        </div>
        <div className="text-right shrink-0">
          {stats.accuracy !== null ? (
            <>
              <span className="font-mono text-gold text-3xl sm:text-4xl font-light tracking-tight tabular">
                {stats.accuracy}
                <span className="text-lg opacity-60">%</span>
              </span>
              <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mt-0.5 group-hover:text-gold/70 transition-colors">
                你的準度 · 看明細 →
              </p>
            </>
          ) : (
            <>
              <span className="font-mono text-gold text-3xl sm:text-4xl font-light tracking-tight tabular">
                {stats.total}
                <span className="text-lg opacity-60"> 手</span>
              </span>
              <p className="font-mono text-mute/60 text-[9px] tracking-[0.25em] mt-0.5 group-hover:text-gold/70 transition-colors">
                在場上 · 等賽後揭曉 →
              </p>
            </>
          )}
        </div>
      </Link>
    </section>
  );
}

// ── 天梯變體 · 你現在的位置 · 真實進度(取代舊的靜態「虛位以待」)──────
function LadderStrip({ stats }: { stats: Stats }) {
  const decided = stats.proved + stats.diverged;
  const toRookie = Math.max(0, ROOKIE_MIN - stats.total);
  const pct = Math.min(100, Math.round((stats.total / ROOKIE_MIN) * 100));

  return (
    <div className="mb-10 border border-gold/40 bg-slate/30 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <p className="font-mono text-gold/90 text-[10px] tracking-[0.3em]">
          你現在的位置
        </p>
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.25em]">
          押了 <span className="text-bone tabular">{stats.total}</span> 場
          {decided > 0 && (
            <>
              {" "}
              · <span className="text-gold tabular">✓{stats.proved}</span>{" "}
              <span className="text-loss/85 tabular">✕{stats.diverged}</span>
              {stats.accuracy !== null && (
                <> · 準度 <span className="text-gold tabular">{stats.accuracy}%</span></>
              )}
            </>
          )}
        </p>
      </div>
      {/* 進度條 · 離新秀還差幾場(門檻 10 · 同 /member)*/}
      <div className="relative h-1.5 rounded-full bg-line/50 overflow-hidden mb-2">
        <div className="h-full bg-gold/80" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-bone text-sm leading-relaxed">
        {toRookie > 0 ? (
          <>
            還差 <span className="text-gold tabular">{toRookie}</span> 場 · 你就上
            <span className="text-gold">「新秀」</span>,正式登上公開天梯。
          </>
        ) : (
          <>
            你已達<span className="text-gold">新秀</span>門檻 ——
            接下來那個月得贏過引擎才升得上去。
          </>
        )}
      </p>
      <Link
        href="/member"
        className="mt-2 inline-block font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
      >
        在儀表板看你的完整準度 ▸
      </Link>
    </div>
  );
}
