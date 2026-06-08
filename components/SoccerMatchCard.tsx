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

// 鎖定領先天數(開賽 − 鎖定)。 把「6/8 鎖一場 6/14 的賽」講成「開賽前 6 天就寫死」——
// 早鎖是承諾的力道、不是錯(越早鎖、賽後對比越重)。 deterministic = ISR-safe。
function leadDays(lockedAt: string | null, kickoffISO: string): number | null {
  if (!lockedAt || !kickoffISO) return null;
  const l = Date.parse(lockedAt);
  const k = Date.parse(kickoffISO);
  if (Number.isNaN(l) || Number.isNaN(k)) return null;
  return Math.max(0, Math.round((k - l) / 86400000));
}

export default function SoccerMatchCard({ match }: { match: SoccerMatchPrediction }) {
  const { id, home, away, homeSeed, awaySeed, prediction, competitionName, dateISO, locked, lockedAt } =
    match;
  const ko = kickoffTPE(dateISO);
  const sealed = locked && Boolean(prediction);
  const lead = leadDays(lockedAt, dateISO);

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

      {/* 兩隊 · 隊徽(seed 顏色秒認隊)+ 名字(放大 · 主角) */}
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 min-w-0">
          <Avatar seed={homeSeed} glyph={getNationalCode(homeSeed) ?? undefined} size={26} />
          <span className="text-bone text-base font-light tracking-tight truncate">{home}</span>
        </span>
        <span className="font-mono text-mute/50 text-[10px] shrink-0">vs</span>
        <span className="flex items-center gap-2 min-w-0 justify-end">
          <span className="text-bone text-base font-light tracking-tight truncate text-right">{away}</span>
          <Avatar seed={awaySeed} glyph={getNationalCode(awaySeed) ?? undefined} size={26} />
        </span>
      </div>

      {/* 封印戳:一行 · 早鎖是力道不是錯(開賽前 N 天就寫死、改不了)· Polymarket 信任武器 */}
      {sealed && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[8.5px] tracking-[0.25em] text-gold/90 border border-gold/45 px-1.5 py-[3px] leading-none">
            賽前鎖定
          </span>
          <span className="font-mono text-mute/55 text-[8.5px] tracking-[0.18em] leading-none">
            {lead !== null ? `開賽前 ${lead} 天就寫死 · 改不了` : "開賽前寫死 · 改不了"}
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
  // 真・膠著場(最高才 ≤38% · 三邊擠在四成內)= 引擎自己都拿不準 → 不是缺點,是把舞台讓給你:
  // 這種場你的獨家判斷(傷停/輪換/直覺)最值錢 = 打敗引擎、賺校準分的最好機會(你 vs 引擎)。
  const tossup = max <= 38;

  return (
    <div className="border-t border-line/40 pt-2.5">
      {/* 三個數字 · favored 那格掛「比亂猜 +N」錨點(把 41% 從「<50% 像丟銅板」重新錨在
          三選一亂猜的 33% 上 → 讀成「比亂猜高 8 分」的真實領先 · 心理學參考點重設) */}
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

      {/* 預期進球(per-match 會變的真信號 · 取代每張都一樣的「最可能比分 1-1」模型常數)·
          「不是盤口 / 賽後對帳」已是首頁旗幟 + 封印戳,不在每張卡重複(刪廢話、字才放得大)。 */}
      <p className="mt-2 font-mono text-mute/60 text-[10px] tracking-[0.1em]">
        預期進球{" "}
        <span className="text-bone tabular text-[11px]">
          {prediction.xgHome.toFixed(1)}–{prediction.xgAway.toFixed(1)}
        </span>
      </p>
      {/* 只有膠著場(最高 ≤38%)留一句挑釁:把無力感翻成「你的主場」。 其餘場不塞盲點清單
          (那是每張都一樣、大部分人不看的廢話 · 已併進首頁誠實旗幟)。 */}
      {tossup && (
        <div className="mt-1.5">
          <span className="inline-block font-mono text-[8.5px] tracking-[0.2em] text-gold/90 border border-gold/45 px-1.5 py-[3px] leading-none mb-1.5">
            膠著 · 最難一題
          </span>
          <p className="font-mono text-mute/60 text-[10px] tracking-[0.08em] leading-snug">
            三邊擠在四成內 · 引擎也拿不準 —— 這場
            <span className="text-bone/85">你的判斷最值錢</span>,換你開盤。
          </p>
        </div>
      )}
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
      {/* 只在 favored 那格 · 把絕對數字錨在「三選一亂猜 33%」上 = 比亂猜高幾分的真領先 */}
      {gold && value > 33 && (
        <span className="font-mono text-gold/70 text-[8px] tracking-[0.08em] leading-none whitespace-nowrap">
          比亂猜 +{value - 33}
        </span>
      )}
    </span>
  );
}
