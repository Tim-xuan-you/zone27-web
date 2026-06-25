import Link from "next/link";
import Avatar from "@/components/Avatar";
import SoccerBetStrip from "@/components/SoccerBetStrip";
import SoccerMarketLines from "@/components/SoccerMarketLines";
import OverUnderStrip from "@/components/OverUnderStrip";
import EngineThreeWayBar from "@/components/EngineThreeWayBar";
import {
  toDisplayPercents,
  enginePickOf,
  deriveSoccerMarkets,
  type SoccerPrediction,
} from "@/lib/soccer/engine";
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

export default function SoccerMatchCard({ match }: { match: SoccerMatchPrediction }) {
  const { id, home, away, homeSeed, awaySeed, prediction, competitionName, dateISO, locked } = match;
  const ko = kickoffTPE(dateISO);

  // 註:鎖定 / 賽後對帳的信任故事在首頁旗幟 + 公開引擎戰績卡講(整體)· 不在每張卡badge —
  // 因為只有「進入鎖定窗(開賽前 2 天)」的場才鎖,逐卡badge 會「有的有有的沒有」看起來像 bug。
  return (
    // id 錨點:首頁世界盃 rail / 登入回跳用 #m-{id} 落地到這張卡(scroll-mt 避開固定 Nav)。
    <article
      id={`m-${id}`}
      className="scroll-mt-24 bg-slate/40 border border-line/60 p-4 sm:p-5 flex flex-col gap-3 transition-colors hover:border-gold/40"
    >
      {/* 競賽 + 開賽(台北) */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-gold/80 text-[9px] tracking-[0.3em]">
          {competitionName}
        </span>
        <span className="font-mono text-mute text-[9px] tracking-[0.25em] tabular shrink-0">
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

      {prediction ? (
        <Prediction home={home} away={away} prediction={prediction} />
      ) : (
        <p className="font-mono text-mute/80 text-[10px] tracking-[0.15em] leading-relaxed border-t border-line/40 pt-2.5">
          覆蓋建置中 · 這個聯賽的戰績還不夠讓引擎誠實開盤。 賭場什麼都敢開,我們只開算得出的。
        </p>
      )}

      {/* 三向押注(主勝/和/客勝)· 登入才能押 · 押了不可改 · 賽後逐場對帳(結算建置中)·
          locked = 這場有賽前鎖定線(押完給一張可外傳的單場收據連結) */}
      <SoccerBetStrip matchId={id} dateISO={dateISO} homeLabel={home} awayLabel={away} locked={locked} />

      {/* 大小分押注(看大/看小 2.5)· 引擎已算 · 跟「誰贏」分開記、不污染戰績 */}
      {prediction && (
        <MarketMount id={id} dateISO={dateISO} prediction={prediction} />
      )}

      {/* 進這場詳情 = 完整引擎(最可能比分 / 玩法視角)+ 討論 / 分析(R228 足球補到 CPBL 同級)*/}
      <Link
        href={`/soccer/${id}`}
        className="pt-1 flex items-baseline justify-end font-mono text-gold/70 hover:text-gold text-[10px] tracking-[0.3em] transition-colors"
      >
        完整分析 · 討論 →
      </Link>
    </article>
  );
}

// 玩法押注掛載:從引擎預測算大小分 2.5 的線 · 傳進可押的 strip(獨立一筆、不污染「誰贏」)。
//
// 🔴 永遠不開讓分(Tim 2026-06-23 拍板 · 別重加):0.5 讓分 = 「誰贏」的重複(主 -0.5 = 主隊贏,
//   跟三向那顆「看好主隊」一模一樣)· 而世界盃多為低比分,1.5+ 讓分又變成沒人押的死注 → 沒有一條
//   讓分線同時「不重複誰贏」又「真五五波」,所以乾脆不開。 既有的 ~ah05 押注(若有)仍在收據
//   唯讀結算(SoccerReceiptView · hideIfNoPick),DB 永不刪。 大小分(看大/看小)跟誰贏是真的兩個
//   問題(可猜對總分卻猜錯贏家)→ 保留。
function MarketMount({
  id,
  dateISO,
  prediction,
}: {
  id: string;
  dateISO: string;
  prediction: SoccerPrediction;
}) {
  const m = deriveSoccerMarkets(prediction.xgHome, prediction.xgAway, {
    totalLines: [2.5],
    handicapLines: [],
  });
  const ou = m.totals[0];
  return (
    <>
      {ou && (
        <OverUnderStrip
          matchId={id}
          dateISO={dateISO}
          overPct={ou.overPct}
          underPct={ou.underPct}
        />
      )}
    </>
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
  // 引擎看好哪個結果(主勝 / 和 / 客勝)→ 上金;其餘 mute。 上金的邊綁 enginePick(原始
  // 機率 argmax · 單一真相)· 不從展示%重算 → 金數字/金條與「引擎看好」永遠同源(近 50/50
  // 場不會四捨五入翻轉成金條跟文字打架)。
  const pick = enginePickOf(prediction);
  const homeGold = pick === "home";
  const drawGold = pick === "draw";
  const awayGold = pick === "away";
  // 真・膠著場(最高才 ≤38% · 三邊擠在四成內)= 引擎自己都拿不準 → 不是缺點,是把舞台讓給你:
  // 這種場你的獨家判斷(傷停/輪換/直覺)最值錢 = 打敗引擎、賺校準分的最好機會(你 vs 引擎)。
  const max = Math.max(d.homeWin, d.draw, d.awayWin);
  const tossup = max <= 38;

  return (
    <div className="border-t border-line/40 pt-2.5">
      {/* 三個數字(放大主角)· favored 上金 · 亂猜各 33% 的框架在首頁講過 · 金條長度直接秀領先 */}
      <div className="flex items-baseline justify-between mb-2 font-mono tabular">
        <Pct label={home} value={d.homeWin} gold={homeGold} align="left" />
        <Pct label="和局" value={d.draw} gold={drawGold} align="center" />
        <Pct label={away} value={d.awayWin} gold={awayGold} align="right" />
      </div>

      {/* 三段條 · 主勝 / 和 / 客勝(favored 亮金 glow + 羽化接縫 · 其餘 mute · 無紅綠 ·
          同首頁 rail / 收據 / 棒球 MarketSplitBar 的招牌引擎語彙) */}
      <EngineThreeWayBar
        homePct={d.homeWin}
        drawPct={d.draw}
        awayPct={d.awayWin}
        goldSide={pick}
      />

      {/* 預期進球(per-match 會變的真信號 · 取代每張都一樣的「最可能比分 1-1」模型常數)·
          「不是盤口 / 賽後對帳」已是首頁旗幟 + 封印戳,不在每張卡重複(刪廢話、字才放得大)。 */}
      <p className="mt-2.5 font-mono text-mute/70 text-[11px] tracking-[0.08em]">
        預期進球{" "}
        <span className="text-bone tabular text-[13px]">
          {prediction.xgHome.toFixed(1)}–{prediction.xgAway.toFixed(1)}
        </span>
      </p>

      {/* 賭徒熟悉的玩法視角(大小球 / 讓球 / 兩隊進球)· 從同一張比分表推 · 零盤口 ·
          視覺次要(招牌是上面那條亮金三向條)· 棒球「讓分 + 大小盤」的足球雙生。 */}
      <SoccerMarketLines prediction={prediction} />

      {/* 只有膠著場(最高 ≤38%)留一句挑釁:把無力感翻成「你的主場」。 其餘場不塞盲點清單
          (那是每張都一樣、大部分人不看的廢話 · 已併進首頁誠實旗幟)。 */}
      {tossup && (
        <div className="mt-2">
          <span className="inline-block font-mono text-[9px] tracking-[0.2em] text-gold/90 border border-gold/45 px-1.5 py-[3px] leading-none mb-1.5">
            膠著 · 最難一題
          </span>
          <p className="font-mono text-mute/70 text-[11px] tracking-[0.05em] leading-snug">
            三邊擠在四成內 · 引擎也拿不準 —— 這場
            <span className="text-bone/90">你的判斷最值錢</span>,換你開盤。
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
      <span className="text-mute/65 text-[10px] tracking-[0.1em] truncate max-w-[6rem]">
        {label.length > 6 ? label.slice(0, 6) : label}
      </span>
    </span>
  );
}
