import Link from "next/link";
import Avatar from "@/components/Avatar";
import type { PulseEvent } from "@/lib/pulse";

// ── ZONE 27 · 活動脈動 UI(中央對帳牆 · 只讀)──────────────────────────────
// 一面會動的牆:會員賽前鎖定 + 引擎結算,按時間流下來。 R210 設計、R226 有真人才建。
// 🔴 只讀廣播(無發言框 · 不是論壇)· 每格連那人的 /u 公開校準檔(熱鬧靠被看見的對帳)·
//   含輸照播(✕落空跟 ✓命中同權重 · loss 柔紅非紅綠)· 無 PnL/連勝/排名 · 無 emoji(✓✕= 例外)。
// ─────────────────────────────────────────────────────

// 事件時間 → 台北「M/D HH:mm」(鎖定帶時間)或「M/D」(結算只有日期)· 格式化的是事件時間戳
// (非 now)→ server component / ISR 下 deterministic · 無 hydration 風險。
function fmtTPE(iso: string, withTime: boolean): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  try {
    return new Intl.DateTimeFormat("zh-Hant", {
      timeZone: "Asia/Taipei",
      month: "numeric",
      day: "numeric",
      ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
    }).format(new Date(t));
  } catch {
    return "";
  }
}

export default function ActivityPulse({ events }: { events: PulseEvent[] }) {
  if (events.length === 0) return null;
  return (
    <ul className="divide-y divide-line/40 border-y border-line/40">
      {events.map((e, i) =>
        e.kind === "lock" ? (
          <li
            key={`l-${e.authorCode}-${e.matchId}-${i}`}
            className="flex items-start gap-3 py-3.5"
          >
            <Avatar seed={e.authorCode} size={28} />
            <div className="min-w-0 flex-1">
              <p className="text-bone text-sm leading-snug">
                <Link
                  href={`/u/${e.authorCode}`}
                  className="text-bone hover:text-gold underline-offset-4 hover:underline transition-colors"
                >
                  {e.handle}
                </Link>{" "}
                <span className="text-mute/70">賽前鎖定 · 看好</span>{" "}
                <span className="text-gold">{e.teamLabel}</span>
              </p>
              <p className="mt-0.5 font-mono text-mute/55 text-[10px] tracking-[0.12em]">
                {/* 棒球 → /matches/<id>(永遠在的單場頁)· 足球無單場頁,改連 /receipts/<id>
                    (賽前/進行中/已結算三階段都解析得到 · 不像 /soccer 只掛未開賽場會死捲動)。 */}
                <Link
                  href={
                    e.matchId.startsWith("fd-")
                      ? `/receipts/${e.matchId}`
                      : `/matches/${e.matchId}`
                  }
                  className="hover:text-gold transition-colors"
                >
                  {e.matchup}
                </Link>{" "}
                · {fmtTPE(e.whenISO, true)}
              </p>
            </div>
            <span className="font-mono text-gold/60 text-[9px] tracking-[0.25em] shrink-0 mt-1">
              鎖定
            </span>
          </li>
        ) : (
          <li
            key={`s-${e.matchId}-${i}`}
            className="flex items-start gap-3 py-3.5"
          >
            {/* 引擎標記 · 純 CSS 幾何方塊(無字型依賴)· 跟用戶頭像區隔開 */}
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-7 w-7 items-center justify-center border border-gold/40"
            >
              <span className="font-mono text-gold/80 text-[9px] tracking-[0.1em]">引擎</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-bone text-sm leading-snug">
                <span className="text-mute/70">引擎結算 ·</span>{" "}
                {e.verdict === "proved" ? (
                  <span className="text-gold">✓ 命中</span>
                ) : e.verdict === "diverged" ? (
                  <span className="text-loss/85">✕ 落空</span>
                ) : (
                  <span className="text-mute">= 平</span>
                )}
              </p>
              <p className="mt-0.5 font-mono text-mute/55 text-[10px] tracking-[0.12em]">
                <Link
                  href={`/receipts/${e.matchId}`}
                  className="hover:text-gold transition-colors"
                >
                  {e.matchup}
                </Link>{" "}
                · {fmtTPE(e.whenISO, false)}
              </p>
            </div>
            <span className="font-mono text-mute/45 text-[9px] tracking-[0.25em] shrink-0 mt-1">
              對帳
            </span>
          </li>
        ),
      )}
    </ul>
  );
}
