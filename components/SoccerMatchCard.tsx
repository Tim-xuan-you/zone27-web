import Avatar from "@/components/Avatar";
import SoccerBetStrip from "@/components/SoccerBetStrip";
import { toDisplayPercents, type SoccerPrediction } from "@/lib/soccer/engine";
import type { SoccerMatchPrediction } from "@/lib/soccer/football-data";
import { getNationalCode } from "@/lib/soccer/teams";

// ── ZONE 27 · 足球賽事卡(勝/平/負 三向 · 非棒球兩向)──────────────
// 足球跟棒球結構不同:有「平手」→ 三向開盤(主勝 / 和 / 客勝)。 顯示「我們引擎
// 自己算的機率」,絕不顯示盤口。 引擎看好那邊上金色;和局與弱邊 mute(守暗金品牌 ·
// 無紅綠對撞)。 戰績不足的場誠實標「覆蓋建置中」不硬開假盤。
// ─────────────────────────────────────────────────────

// UTC ISO → 台北「MM/DD HH:mm」(全站時區一致)。 deterministic(固定字串)= ISR-safe。
function kickoffTPE(iso: string): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const tpe = new Date(t + 8 * 3600 * 1000); // UTC+8
  const mm = String(tpe.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(tpe.getUTCDate()).padStart(2, "0");
  const hh = String(tpe.getUTCHours()).padStart(2, "0");
  const mi = String(tpe.getUTCMinutes()).padStart(2, "0");
  return `${mm}/${dd} ${hh}:${mi}`;
}

// ISO → 台北「M/D」(封印戳日期)。 deterministic = ISR-safe。
function stampDate(iso: string | null): string {
  if (!iso) return "";
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  const tpe = new Date(t + 8 * 3600 * 1000);
  return `${tpe.getUTCMonth() + 1}/${tpe.getUTCDate()}`;
}

export default function SoccerMatchCard({ match }: { match: SoccerMatchPrediction }) {
  const { id, home, away, homeSeed, awaySeed, prediction, competitionName, dateISO, locked, lockedAt } =
    match;
  const ko = kickoffTPE(dateISO);
  const sealed = locked && Boolean(prediction);
  const stamp = stampDate(lockedAt);

  return (
    <article
      className={`bg-slate/40 border p-4 sm:p-5 flex flex-col gap-3 transition-colors hover:border-gold/40 ${
        sealed ? "border-gold/30" : "border-line/60"
      }`}
    >
      {/* 競賽 + 開賽(台北) */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-gold/80 text-[9px] tracking-[0.3em]">
          {competitionName}
        </span>
        <span className="font-mono text-mute text-[9px] tracking-[0.25em] tabular">
          {ko} <span className="text-mute/50">TPE</span>
        </span>
      </div>

      {/* 兩隊 · 隊徽(seed 顏色秒認隊)+ 名字 */}
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 min-w-0">
          <Avatar seed={homeSeed} glyph={getNationalCode(homeSeed) ?? undefined} size={22} />
          <span className="text-bone text-sm font-light tracking-tight truncate">{home}</span>
        </span>
        <span className="font-mono text-mute/50 text-[10px] shrink-0">vs</span>
        <span className="flex items-center gap-1.5 min-w-0 justify-end">
          <span className="text-bone text-sm font-light tracking-tight truncate text-right">{away}</span>
          <Avatar seed={awaySeed} glyph={getNationalCode(awaySeed) ?? undefined} size={22} />
        </span>
      </div>

      {/* 封印戳:這條線開賽前就鎖死、改不了(我們的 Polymarket 信任武器 · 賽後對比才砸得下來)*/}
      {sealed && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[8.5px] tracking-[0.25em] text-gold/90 border border-gold/45 px-1.5 py-[3px] leading-none">
            賽前鎖定 · {stamp}
          </span>
          <span className="font-mono text-mute/55 text-[8.5px] tracking-[0.18em] leading-none">
            開賽前寫死、改不了 · 賽後逐場對帳
          </span>
        </div>
      )}

      {prediction ? (
        <Prediction home={home} away={away} prediction={prediction} />
      ) : (
        <p className="font-mono text-mute/60 text-[10px] tracking-[0.15em] leading-relaxed border-t border-line/40 pt-2.5">
          覆蓋建置中 · 這個聯賽的戰績還不夠讓引擎誠實開盤。 賭場什麼都敢開,我們只開算得出的。
        </p>
      )}

      {/* 三向押注(主勝/和/客勝)· 登入才能押 · 押了不可改 · 賽後逐場對帳(結算建置中) */}
      <SoccerBetStrip matchId={id} dateISO={dateISO} homeLabel={home} awayLabel={away} />
    </article>
  );
}

function Prediction({
  home,
  away,
  prediction,
}: {
  home: string;
  away: string;
  prediction: SoccerPrediction;
}) {
  const d = toDisplayPercents(prediction);
  // 引擎看好哪個結果(主勝 / 和 / 客勝)→ 上金;其餘 mute。
  const max = Math.max(d.homeWin, d.draw, d.awayWin);
  const homeGold = d.homeWin === max;
  const drawGold = d.draw === max && !homeGold;
  const awayGold = d.awayWin === max && !homeGold && !drawGold;
  const top = prediction.topScores[0];

  return (
    <div className="border-t border-line/40 pt-2.5">
      {/* 三個數字 */}
      <div className="flex items-baseline justify-between mb-1.5 font-mono tabular">
        <Pct label={home} value={d.homeWin} gold={homeGold} align="left" />
        <Pct label="和局" value={d.draw} gold={drawGold} align="center" />
        <Pct label={away} value={d.awayWin} gold={awayGold} align="right" />
      </div>

      {/* 三段條 · 主勝 / 和 / 客勝(favored 金 · 其餘 mute · 無紅綠) */}
      <div className="flex h-1.5 w-full overflow-hidden rounded-sm bg-ink/60" aria-hidden="true">
        <span style={{ width: `${d.homeWin}%` }} className={homeGold ? "bg-gold" : "bg-mute/40"} />
        <span style={{ width: `${d.draw}%` }} className={drawGold ? "bg-gold" : "bg-mute/25"} />
        <span style={{ width: `${d.awayWin}%` }} className={awayGold ? "bg-gold" : "bg-mute/40"} />
      </div>

      {/* 最可能比分 + 誠實小字 */}
      {top && (
        <p className="mt-2 font-mono text-mute/55 text-[9px] tracking-[0.12em] leading-snug">
          最可能比分 <span className="text-mute/80 tabular">{top.home}-{top.away}</span> ·
          引擎自己算的機率,不是盤口 · 賽後逐場對帳
        </p>
      )}
      {/* 盲點揭露(538/Savant 式)· 把引擎看不到的攤在下注點 = 報馬仔黑箱的反面 */}
      <p className="mt-1.5 font-mono text-mute/40 text-[9px] tracking-[0.1em] leading-snug">
        引擎沒看到:傷停 · 紅黃牌停賽 · 陣容輪換 · 天候 —— 我們攤開,讓你自己加權
      </p>
    </div>
  );
}

function Pct({
  label,
  value,
  gold,
  align,
}: {
  label: string;
  value: number;
  gold: boolean;
  align: "left" | "center" | "right";
}) {
  const alignCls =
    align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center";
  return (
    <span className={`flex flex-col ${alignCls} gap-0.5 min-w-0`}>
      <span className={`text-lg sm:text-xl font-light ${gold ? "text-gold" : "text-mute"}`}>
        {value}
        <span className="text-[10px] opacity-60">%</span>
      </span>
      <span className="text-mute/55 text-[8px] tracking-[0.15em] truncate max-w-[6rem]">
        {label.length > 6 ? label.slice(0, 6) : label}
      </span>
    </span>
  );
}
