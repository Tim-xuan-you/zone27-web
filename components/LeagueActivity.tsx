import Link from "next/link";
import Avatar from "@/components/Avatar";
import { handleGlyph } from "@/lib/identity";
import type { LeagueLock } from "@/lib/leagues";

// ── ZONE 27 · 私人聯盟活動條 · 盟友最近鎖了什麼(R239)──────────────────────────
// 朋友剛加盟、還沒有人押滿 10 場分勝負時,天梯一片空(冷啟動)· 這條把「盟員最近的賽前鎖定」
// 串起來,盟一有人動就活 —— 跟全站 /pulse 牆同一套視覺,但只篩這群盟友(Strava segment「看
// 朋友在練什麼」式 · 跟天梯的「整季排名」是不同軸:這是「現在有人在動」)。
//
// 🔴 守紅線(同 /pulse):只播「賽前鎖定」這種真帳本事件 · 無 PnL / 連勝 / 排名 · 含和局照播 ·
//   每筆連那人的 /u 公開含輸校準檔(熱鬧靠被看見的對帳)。 自己那筆掛低調「你」標。
// server 元件 · 0 client state · 空 → 整條不渲染(交給天梯空狀態去 nudge · 守會員頁極簡)。
// ─────────────────────────────────────────────────────

// 事件時間 → 台北「M/D HH:mm」· 純算術手動格式化(非 Intl)· server / client 逐位元一致 ·
// 無 hydration 風險(同 ActivityPulse.fmtTPE · Asia/Taipei = 固定 UTC+8 無 DST)。
function fmtTPE(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const d = new Date(t + 8 * 60 * 60 * 1000);
  const mo = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${mo}/${day} ${hh}:${mm}`;
}

export default function LeagueActivity({
  events,
  viewerCode,
}: {
  events: LeagueLock[];
  viewerCode: string | null;
}) {
  if (events.length === 0) return null;

  return (
    <section className="mb-8">
      <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
        / 盟友最近鎖了什麼
      </p>
      <ul className="divide-y divide-line/40 border-y border-line/40 list-none pl-0 m-0">
        {events.map((e, i) => {
          const isYou = viewerCode != null && e.authorCode === viewerCode;
          // 頭像跟同頁天梯同一張臉:seed 用「#碼」、glyph 由 handle 推(同 LeagueStandings)。
          return (
            <li
              key={`${e.authorCode}-${e.matchId}-${i}`}
              className="flex items-start gap-3 py-3.5"
            >
              <Avatar
                seed={`#${e.authorCode}`}
                glyph={handleGlyph(e.handle)}
                size={28}
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-bone text-sm leading-snug">
                  <Link
                    href={`/u/${e.authorCode}`}
                    className={`underline-offset-4 hover:underline hover:text-gold transition-colors ${
                      isYou ? "text-gold" : "text-bone"
                    }`}
                  >
                    {e.handle}
                  </Link>{" "}
                  {isYou && (
                    <span className="font-mono text-[9px] tracking-[0.2em] px-1 py-px border border-gold/50 text-gold mr-0.5">
                      你
                    </span>
                  )}
                  <span className="text-mute/70">賽前鎖定 · 看好</span>{" "}
                  <span className="text-gold">{e.teamLabel}</span>
                </p>
                <p className="mt-0.5 font-mono text-mute/55 text-[10px] tracking-[0.12em]">
                  {/* 棒球 → /matches/<id>· 足球 → /receipts/<id>· 群眾盤 mkt-* → /markets#m-<id>·
                      網球 tn-* → /tennis/<id>· 羽球 bd-* → /badminton/<id>· UFC mma-* → /mma#m-<id>
                      (沒有 /matches/mkt-、/matches/tn- 等單場頁,直連會 404)· 同 /pulse 路由。 */}
                  <Link
                    href={
                      e.matchId.startsWith("fd-")
                        ? `/receipts/${e.matchId}`
                        : e.matchId.startsWith("mkt-")
                          ? `/markets#m-${e.matchId}`
                          : e.matchId.startsWith("tn-")
                            ? `/tennis/${e.matchId}`
                            : e.matchId.startsWith("bd-")
                              ? `/badminton/${e.matchId}`
                              : e.matchId.startsWith("mma-")
                                ? `/mma#m-${e.matchId}`
                                : `/matches/${e.matchId}`
                    }
                    className="hover:text-gold transition-colors"
                  >
                    {e.matchup}
                  </Link>{" "}
                  · {fmtTPE(e.whenISO)}
                </p>
              </div>
              <span className="font-mono text-gold/60 text-[9px] tracking-[0.25em] shrink-0 mt-1">
                鎖定
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
