"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getMyPredictionsClient } from "@/lib/predictions-market";
import { aggregatePredictionStats, aggregateStreak } from "@/lib/predictions";

// ── ZONE 27 · 今日一戰 · 「你連續幾天正面對機器」紀錄條 ────────────────────────────
// 對決的留存鉤:重點不是今天輸贏,是「你連續幾天,敢正面站到這台機器對面」。 報馬仔只敢曬贏、
// 輸了刪文;這條數的是「你有種回來面對真相」的連續天數 —— 含贏含輸、一場沒躲。
//
// 🔴 紅線:數的是「連續應戰天數」(出席/紀律)不是「連勝」(連勝獎 = 賭場/虛榮紅線)。 連續斷了
//   只因為你某天沒來,不是因為你輸 —— 輸了照記、連續不斷。 口徑全走既有單一真相
//   aggregateStreak(連續下注台北日)+ aggregatePredictionStats(含輸命中)· 不另立計分。
//
// 為什麼 client island:/today 可被當每日固定地址,理應可 ISR / 快取;server 端讀登入態會把
// 某人的紀錄快取給所有人。 同 YourRecordStrip 漸進增強:未登入 / 沒押過 → 安靜不顯示(對決卡
// 自己的登入餌承載冷啟動,不疊第二顆 CTA)。
// ─────────────────────────────────────────────────────

type MatchResult = {
  id: string;
  finalWinner: "home" | "away" | "tie" | null;
  startISO?: string | null;
};

export default function DuelRecordStrip({
  matchResults,
  todayTaipei,
  hero = false,
}: {
  /** 已結算賽事勝方(靜態 · server 傳入)· 前端評分本人押注 · 同 YourRecordStrip */
  matchResults: MatchResult[];
  /** 台北「今天」YYYY-MM-DD(server 算 · 避免 client 時區漂移)· 連續天數的錨 */
  todayTaipei: string;
  /** hero=true · 沒有今日對決時把這張成績單變主角(全站最特別的東西:刪不掉、含輸、贏過機器)·
   *  把「沒戰場」的死路翻成「曬戰績」的時刻 + 可外傳。 預設 false = 維持原本低調紀錄條。 */
  hero?: boolean;
}) {
  const [data, setData] = useState<{
    proved: number;
    diverged: number;
    total: number;
    streak: number;
  } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: u } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!u.user) return; // 未登入 → 安靜不顯示(對決卡的登入餌承載)
        const map = await getMyPredictionsClient();
        if (cancelled) return;
        const stats = aggregatePredictionStats(map, matchResults);
        const streak = aggregateStreak(map, todayTaipei);
        setData({
          proved: stats.proved,
          diverged: stats.diverged,
          total: stats.total,
          streak: streak.current,
        });
      } catch {
        /* graceful · 不顯示 */
      } finally {
        if (!cancelled) setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchResults, todayTaipei]);

  // 抓取中 / 未登入 / 沒押過 → 不佔空間
  if (!ready || !data || data.total === 0) return null;

  const decided = data.proved + data.diverged;

  // ── hero 變體:沒今日對決時的主角 —— 把「19 勝 9 敗 · 一場沒躲」做大、做驕傲、可外傳。
  //    全站最特別的東西(刪不掉、含輸照掛、贏過機器),別再用 11 級灰字塞在空盒底下。 ──
  if (hero) {
    return (
      <div className="mt-8 border border-gold/45 bg-gold/[0.05] p-5 sm:p-6">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-2">
          今天沒有新戰場 —— 但這張成績單刪不掉
        </p>
        {decided > 0 ? (
          <>
            <p className="text-bone text-2xl sm:text-3xl font-light leading-tight">
              你 vs 機器 ·{" "}
              <span className="text-gold tabular">
                {data.proved} 勝 {data.diverged} 敗
              </span>
            </p>
            <p className="mt-2 font-mono text-mute/85 text-[12px] tracking-[0.1em] leading-relaxed">
              {decided} 場含輸對帳 · 一場沒躲
              {data.streak >= 1 && ` · 連續回來 ${data.streak} 天`} ·
              全台灣沒有一個老師敢給你看自己輸的單。
            </p>
          </>
        ) : (
          <p className="text-bone text-xl sm:text-2xl font-light leading-snug">
            你押了 <span className="text-gold tabular">{data.total}</span> 場 · 等賽後揭曉誰準
          </p>
        )}
        <Link
          href="/member"
          className="mt-4 inline-block font-mono text-gold/80 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline transition-colors"
        >
          這張刪不掉的成績單 · 拿去給人看 →
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 border-l-2 border-gold/60 pl-4 py-1">
      {data.streak >= 1 ? (
        <p className="text-bone text-base sm:text-lg font-light leading-snug">
          連續{" "}
          <span className="text-gold text-2xl sm:text-3xl tabular">{data.streak}</span>{" "}
          天正面對機器
        </p>
      ) : (
        <p className="text-bone text-base sm:text-lg font-light leading-snug">
          你的對機器紀錄 · <span className="text-mute">含贏含輸刪不掉</span>
        </p>
      )}
      {decided > 0 ? (
        <p className="mt-1 font-mono text-mute/85 text-[11px] tracking-[0.1em] tabular leading-relaxed">
          <span className="text-gold">{data.proved} 勝</span>{" "}
          <span className="text-loss/85">{data.diverged} 敗</span> · 一場沒躲
        </p>
      ) : (
        <p className="mt-1 font-mono text-mute/85 text-[11px] tracking-[0.1em] leading-relaxed">
          押了 {data.total} 場 · 等賽後揭曉誰準
        </p>
      )}
    </div>
  );
}
