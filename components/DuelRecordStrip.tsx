"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getMySportPicksClient } from "@/lib/predictions-market";
import {
  aggregateSportStats,
  aggregateStreak,
  isLatePick,
  taipeiDayOf,
  type SportResultRow,
} from "@/lib/predictions";
import { machineVoice, type DuelH2H } from "@/lib/machine-voice";

// ── ZONE 27 · 今日一戰 · 「你連續幾天正面對機器」紀錄條 ────────────────────────────
// 對決的留存鉤:重點不是今天輸贏,是「你連續幾天,敢正面站到這台機器對面」。 報馬仔只敢曬贏、
// 輸了刪文;這條數的是「你有種回來面對真相」的連續天數 —— 含贏含輸、一場沒躲。
//
// R293 · 跨運動:對決擴成六運動 → 應戰天數也一起跨(押哪個運動都算「今天有站到機器對面」)。
//   reader 走 getMySportPicksClient(六運動前綴)· 對帳走 aggregateSportStats + 跨運動賽果
//   一本帳(/api/duel-results · 登入且押過才抓 —— 4,500+ 列塞 HTML 會炸 mobile payload)。
//   🔴 不碰棒球 allowlist(校準身分那本)。
//
// 🔴 紅線:數的是「連續應戰天數」(出席/紀律)不是「連勝」(連勝獎 = 賭場/虛榮紅線)。 連續斷了
//   只因為你某天沒來,不是因為你輸 —— 輸了照記、連續不斷。 口徑全走既有單一真相
//   aggregateStreak(連續下注台北日)+ aggregateSportStats(含輸命中)· 不另立計分。
//
// 為什麼 client island:/today 可被當每日固定地址,理應可 ISR / 快取;server 端讀登入態會把
// 某人的紀錄快取給所有人。 同 YourRecordStrip 漸進增強:未登入 / 沒押過 → 安靜不顯示(對決卡
// 自己的登入餌承載冷啟動,不疊第二顆 CTA)。
//
// R295 · 機器嘴:隔天回來,機器對「你最近一場已結算的單」開一句口(它贏乾嗆 · 你贏認帳 ·
// 同邊/雙偏各有話 · 缺席 ≥3 天先冷一句)。 台詞單一真相 lib/machine-voice(這裡不造句)·
// 只在 compact 變體渲染 —— hero = 今天沒對決,「今天的一戰還開著」那批句會說謊(誠實鐵律)。
// ─────────────────────────────────────────────────────

/** 兩個台北日(YYYY-MM-DD)的日差(to - from)· 不合法回 null(純算術 · 無時區轉換)。 */
function dayGap(fromYmd: string, toYmd: string): number | null {
  const p = (s: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : NaN;
  };
  const a = p(fromYmd);
  const b = p(toYmd);
  if (Number.isNaN(a) || Number.isNaN(b)) return null;
  return Math.round((b - a) / 86_400_000);
}

export default function DuelRecordStrip({
  todayTaipei,
  hero = false,
}: {
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
  const [voice, setVoice] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: u } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!u.user) return; // 未登入 → 安靜不顯示(對決卡的登入餌承載)
        const map = await getMySportPicksClient();
        if (cancelled) return;
        if (Object.keys(map).length === 0) return; // 沒押過 → 不顯示 · 也不抓賽果(省流量)
        // 跨運動賽果一本帳走 API(4,500+ 列 · 塞 HTML 會讓每個訪客吞 400KB+)·
        // 只有走到這裡(登入且押過)才抓 · 抓壞 → 退回只顯示應戰天數(streak 只看下注日)。
        let results: SportResultRow[] = [];
        try {
          const res = await fetch("/api/duel-results");
          if (res.ok) {
            const json = (await res.json()) as unknown;
            if (Array.isArray(json)) results = json as SportResultRow[];
          }
        } catch {
          /* graceful · 賽果抓不到 → 勝敗行自然缺 · 應戰天數照顯 */
        }
        if (cancelled) return;
        const stats = aggregateSportStats(map, results);
        const streak = aggregateStreak(map, todayTaipei);

        // ── 機器嘴(R295):缺席 ≥3 天先冷一句(發牌員記得你哪天沒來);否則對「最近一場
        //    已結算的誰贏押注」開口(玩法 ~ 不進 · 先鎖後結同 aggregate 口徑)。 缺輸入 →
        //    machineVoice 回 null = 安靜(寧缺不空嗆)。 ──
        let line: string | null = null;
        let lastDay: string | null = null;
        for (const p of Object.values(map)) {
          const d = taipeiDayOf(p.ts);
          if (d && (!lastDay || d > lastDay)) lastDay = d;
        }
        const gap = lastDay ? dayGap(lastDay, todayTaipei) : null;
        if (gap !== null && gap >= 3) {
          line = machineVoice({ kind: "lapsed", days: gap });
        } else {
          const byId = new Map(results.map((r) => [r.id, r]));
          const h2h: DuelH2H = { n: 0, engineHits: 0, userHits: 0 };
          let latest: { key: number; pick: string; r: SportResultRow } | null = null;
          for (const [id, p] of Object.entries(map)) {
            if (id.includes("~")) continue; // 玩法不進機器嘴(嘴只對「誰贏」的對決開口)
            const r = byId.get(id);
            if (!r) continue; // 未結算 / 推局
            if (isLatePick(p.ts, r.startISO)) continue; // 開賽後補登不計(同 aggregate)
            if (r.enginePick) {
              h2h.n++;
              if (r.enginePick === r.winner) h2h.engineHits++;
              if (p.pick === r.winner) h2h.userHits++;
            }
            const key = Date.parse(r.startISO ?? p.ts) || 0;
            if (!latest || key > latest.key) latest = { key, pick: p.pick, r };
          }
          if (latest) {
            const userHit = latest.pick === latest.r.winner;
            const eng = latest.r.enginePick;
            if (eng) {
              const engineHit = eng === latest.r.winner;
              line = machineVoice({
                kind: "settled",
                matchId: latest.r.id,
                outcome:
                  engineHit && !userHit
                    ? "machineWon"
                    : userHit && !engineHit
                      ? "userWon"
                      : userHit && engineHit
                        ? "bothHit"
                        : "bothMissed",
                h2h,
              });
            } else {
              // 賽果沒帶機器那手(graceful)→ 只講你自己的命中/落空
              line = machineVoice({
                kind: "settledSolo",
                matchId: latest.r.id,
                hit: userHit,
              });
            }
          }
        }
        setVoice(line);

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
  }, [todayTaipei]);

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
      {/* 機器嘴(R295):它贏乾嗆 · 你贏認帳 · 一律引你自己帳本上的事實(lib/machine-voice)。 */}
      {voice && (
        <p className="mt-2 font-mono text-bone/75 text-[11px] tracking-[0.05em] leading-relaxed">
          <span aria-hidden="true" className="text-gold/60">▦</span> 「{voice}」
        </p>
      )}
    </div>
  );
}
