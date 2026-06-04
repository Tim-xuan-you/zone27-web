import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { createPageMetadata } from "@/lib/page-og";
import { fetchRelevantMlb, type MlbGame } from "@/lib/mlb";
import MlbEngineRecord from "@/components/MlbEngineRecord";
import mlbLocked from "@/lib/mlb-locked.json";
import { getCreatorPostCounts } from "@/lib/creator-posts-server";

export const metadata = createPageMetadata({
  title: "今日 MLB 賽程 — 即時資料來自 MLB 官方 API",
  description:
    "MLB 美國職棒今日全部賽程 · 即時資料來自 MLB Stats API · 每 10 分鐘更新 · 台北時區顯示。",
  ogTitle: "今日 MLB 賽程 · ZONE 27",
  ogDescription:
    "MLB 今日賽程 · MLB Stats API · 每 10 分鐘 ISR · 台北時區",
  path: "/matches/mlb",
});

// Force this page to use ISR cache from lib/mlb's revalidate setting
export const revalidate = 600;

export default async function MlbMatchesPage() {
  // R194 · 抓昨天+今天兩天(修時區漏掉 live 的洞)· 排序:進行中 → 即將 → 最近結束
  // (最近結束只留 6 張,不堆昨天一整排死卡)。
  const all = await fetchRelevantMlb();
  const liveGames = all.filter((g) => g.state === "live");
  const upcoming = all
    .filter((g) => g.state === "preview" || g.state === "other")
    .sort((a, b) => a.startUTC.localeCompare(b.startUTC));
  const recentFinals = all
    .filter((g) => g.state === "final")
    .sort((a, b) => b.startUTC.localeCompare(a.startUTC))
    .slice(0, 6);
  const games = [...liveGames, ...upcoming, ...recentFinals];

  // R194 · gamePk → 賽前鎖定的引擎勝率%(lib/mlb-locked.json · GitHub Action 賽前鎖、
  // 留時間戳)。 已結束的場用「當初鎖的那個數字」對真實比分判 ✓/✗ = 跟 CPBL 一樣
  // 賽後對帳 · 誠信純正(不是賽後拿即時重算的數字假裝賽前就猜中)。
  const lockedByPk = new Map<number, number>();
  for (const p of (mlbLocked.predictions ?? []) as {
    gamePk?: number;
    engineWinHomePct?: number;
  }[]) {
    if (typeof p.gamePk === "number" && typeof p.engineWinHomePct === "number") {
      lockedByPk.set(p.gamePk, p.engineWinHomePct);
    }
  }
  // 每場分析篇數(key = mlb-{gamePk})· 看板標「N 篇分析」+ 點進去看/買(跟單入口)。
  const analysisCounts = await getCreatorPostCounts();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HEADER ──────────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-10">
        <div className="flex items-baseline gap-3 mb-3 flex-wrap">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
            MLB 賽事板 · 進行中 / 今晚 / 最近
          </p>
          {liveGames.length > 0 ? (
            <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-win text-win shimmer">
              ● {liveGames.length} 場進行中
            </span>
          ) : (
            <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-win/40 text-win">
              即時資料
            </span>
          )}
        </div>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            美國職棒大聯盟
            <span className="text-mute text-2xl sm:text-3xl ml-3">
              · {games.length} 場
            </span>
          </h1>
          <p className="font-mono text-mute text-xs tracking-[0.25em]">
            台北時區 · 進行中比分每 10 分鐘更新(不秒跳)
          </p>
        </div>
        <p className="mt-3 font-mono text-mute text-[10px] tracking-[0.25em]">
          資料來源:MLB Stats API(官方公開、完全免費) ·
          ZONE 27 不修改任何原始資料
        </p>
        {/* R197 Tim de-BETA:MLB 跟 CPBL 同一套引擎 · 拿掉「驗證夠才開盤」閘門 framing
            (蒙地卡羅是全世界在用的方法 · 不需要我們「測30場驗證」)· 棒球就是棒球 ·
            MLB first-class(賽前鎖定、賽後對帳、同 CPBL)。 supersedes R185 閘門框架。 */}
        <p className="mt-4 text-mute text-sm sm:text-[15px] leading-relaxed max-w-2xl">
          <strong className="text-bone">棒球就是棒球 —— MLB 跟 CPBL 用同一套引擎。</strong>{" "}
          一樣賽前鎖定開盤線、賽後對真實比分結算、落空照掛不刪。 即時比分每 10 分鐘更新(不秒跳)。{" "}
          <Link
            href="/matches"
            className="text-gold/90 hover:text-gold underline-offset-4 hover:underline whitespace-nowrap"
          >
            也看今日 CPBL →
          </Link>
        </p>
        <div className="mt-6 w-full h-px bg-line/60" />
      </section>

      {/* ── MLB 引擎自動盤戰績(賽前鎖定 + 賽後對帳 · 同 CPBL 一套引擎)── */}
      <MlbEngineRecord />

      {/* ── EMPTY STATE ─────────────────────── */}
      {games.length === 0 ? (
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-20">
          <div className="bg-slate/40 border border-line/60 p-12 text-center">
            <p className="font-mono text-mute text-xs tracking-[0.25em] mb-4">
              MLB API · 今日無排定賽事
            </p>
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
              可能是季外、明星週、或目前美國時間還沒進入比賽日。
              <br />
              台灣晚上看 MLB 通常會在隔天清晨抓到比賽,可以稍後再來看看。
            </p>
            <Link
              href="/matches"
              className="inline-block mt-8 font-mono text-gold text-[10px] tracking-[0.3em] hover:opacity-80"
            >
              ← 回到 CPBL 賽事板
            </Link>
          </div>
        </section>
      ) : (
        /* ── GAMES GRID ──────────────────────── */
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-20">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {games.map((g) => (
              <MlbCard
                key={g.gamePk}
                game={g}
                lockedPct={lockedByPk.get(g.gamePk)}
                analysisCount={analysisCounts[`mlb-${g.gamePk}`] ?? 0}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── BACK LINK ───────────────────────── */}
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-20 text-center border-t border-line/40 pt-12">
        <Link
          href="/matches"
          className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
        >
          ← 回到 CPBL 賽事板
        </Link>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── MlbCard ───────────────────────────────────────────
// R80 · Per /integrity rule #12 binding(R80 加 · CPBL-only-forever scope
// · NEVER predict MLB)· R48 W-B engine pick surface(ENGINE NOW row +
// VERDICT row + SIMULATE CTA)全部 removed · 此 card 從「prediction with
// disclaimer」 改為「pure schedule + final score viewer · 0 engine surface」
// · lib/mlb.ts 仍 compute engineWinHomePct + verdict + simulateUrl 為 latent
// fields(R81+ deeper refactor remove)· 此 round 只 stop rendering 確保
// brand redline 完全 honor。 enginePickHome / favoriteTeam / favoriteWinPct
// 計算 變數 全 removed(unused)· 同 axis as Patek 不做 Apple Watch。
function MlbCard({
  game,
  lockedPct,
  analysisCount = 0,
}: {
  game: MlbGame;
  lockedPct?: number;
  analysisCount?: number;
}) {
  const stateClass = STATE_COLOR[game.state];
  const live = game.live;
  // R194 · 進行中帶局數(死卡變活卡)· 即時比分救回 = Polymarket「數字會動」誠實版。
  const stateLabel =
    game.state === "live" && live
      ? `進行中 · ${live.inning} 局${live.half}`
      : STATE_LABEL[game.state];

  return (
    <article className="bg-slate/60 border border-line/70 hover:border-gold/40 transition-colors p-5 flex flex-col">
      {/* meta */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border whitespace-nowrap ${stateClass} ${
              game.state === "live" ? "shimmer" : ""
            }`}
          >
            {stateLabel}
          </span>
          {/* 有分析 = 金色 chip · 一眼看出哪場有大神可跟單(抽傭入口)*/}
          {analysisCount > 0 && (
            <span
              aria-label={`這場有 ${analysisCount} 篇創作者分析可看`}
              className="font-mono text-[9px] tracking-[0.2em] px-1.5 py-0.5 border border-gold/60 text-gold tabular whitespace-nowrap"
            >
              {analysisCount} 篇分析
            </span>
          )}
        </div>
        <span className="font-mono text-mute text-[10px] tracking-[0.25em] tabular whitespace-nowrap">
          台北 {compactMlbDate(game.dateTaipei)} {game.startTaipei}
        </span>
      </div>

      {/* teams · 比分:進行中用即時、賽後用最終(同一個 slot) */}
      <div className="space-y-3 mb-4">
        <TeamRow
          label="AWAY"
          team={game.away}
          score={live?.away ?? game.finalScore?.away}
        />
        <TeamRow
          label="HOME"
          team={game.home}
          score={live?.home ?? game.finalScore?.home}
        />
      </div>

      {/* R194 · 即時比分時效標(只在進行中)· 乾淨講事實 · 不替自己辯解 */}
      {live && (
        <p className="mb-3 font-mono text-mute/50 text-[9px] tracking-[0.18em]">
          ▸ 比分 · 約 10 分鐘前更新(MLB 官方)
        </p>
      )}

      {/* R194 · 賽後對帳:用「賽前鎖定」的引擎勝率對真實比分判 ✓/✗ = 跟 CPBL 一樣
          引擎準不準照掛。 誠信:只認賽前鎖過的數字(沒鎖的誠實說沒鎖、不裝)。 */}
      {game.state === "final" && game.finalScore && (
        <MlbEngineVerdict
          lockedPct={lockedPct}
          finalScore={game.finalScore}
          homeName={game.home.zhName}
          awayName={game.away.zhName}
        />
      )}

      {/* venue + 點進詳情(看/買分析、押注)· R199 補:MLB 板卡本來點不進去(舊 schedule
          viewer 遺留)· Tim「用戶看到有分析想跟單卻點不進去買」→ 加詳情連結=抽傭入口。 */}
      <div className="pt-3 mt-auto border-t border-line/40 flex items-center justify-between gap-2">
        <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em] truncate">
          {game.venue}
        </span>
        <Link
          href={`/matches/mlb-${game.gamePk}`}
          aria-label={
            analysisCount > 0
              ? `看這場 ${analysisCount} 篇分析 + 押注`
              : "看完整分析 + 押注"
          }
          className={`shrink-0 font-mono text-[10px] tracking-[0.25em] transition-colors hover:text-gold ${
            analysisCount > 0 ? "text-gold" : "text-gold/70"
          }`}
        >
          {analysisCount > 0 ? `看 ${analysisCount} 篇分析 →` : "完整分析 →"}
        </Link>
      </div>
    </article>
  );
}

// ── 賽後對帳 · 引擎準不準(用 lib/mlb-locked.json 賽前鎖定的數字)──────
// 誠信核心:只認「賽前鎖過、留時間戳」的預測對真實比分判 ✓/✗(不是賽後拿即時
// 重算的數字假裝賽前就猜中 = 那才是報馬仔挑窗)。 引擎沒鎖的場誠實說沒鎖。
// 落空照掛、永不刪(同 CPBL + /calibration 紀律)。
function MlbEngineVerdict({
  lockedPct,
  finalScore,
  homeName,
  awayName,
}: {
  lockedPct?: number;
  finalScore: { home: number; away: number };
  homeName: string;
  awayName: string;
}) {
  if (lockedPct === undefined) {
    return (
      <p className="mb-3 font-mono text-mute/45 text-[9px] tracking-[0.18em] leading-relaxed">
        ▸ 引擎沒鎖這場(賽前沒抓到先發投手數據)
      </p>
    );
  }
  const tie = finalScore.home === finalScore.away;
  const noLine = lockedPct === 50; // 賽前 50/50 = 引擎沒押一邊
  const favHome = lockedPct > 50;
  const favPct = Math.max(lockedPct, 100 - lockedPct);
  const favName = (favHome ? homeName : awayName).slice(0, 4);
  const homeWon = finalScore.home > finalScore.away;
  const proved = !tie && !noLine && homeWon === favHome;

  if (tie || noLine) {
    return (
      <p className="mb-3 font-mono text-mute text-[10px] tracking-[0.2em]">
        = {tie ? "平手 · 無勝負" : "引擎沒押(賽前 50/50)"}
      </p>
    );
  }
  return (
    <p
      className={`mb-3 font-mono text-[10px] tracking-[0.2em] leading-relaxed ${
        proved ? "text-gold" : "text-loss/85"
      }`}
    >
      {proved ? "✓ 引擎命中" : "✕ 引擎落空"} · 賽前{" "}
      <span className="tabular">{favPct}%</span> 看好 {favName}
    </p>
  );
}

function TeamRow({
  label,
  team,
  score,
}: {
  label: "HOME" | "AWAY";
  team: MlbGame["home"];
  /** 得分 · 進行中=即時、賽後=最終(同一個 slot · undefined=賽前不顯示) */
  score?: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-3 min-w-0">
          <span className="font-mono text-gold/60 text-[9px] tracking-[0.25em] shrink-0 w-10">
            {label}
          </span>
          <span className="text-bone text-base truncate">{team.zhName}</span>
          <span className="font-mono text-mute text-[10px] tracking-[0.2em] shrink-0">
            {team.abbr}
          </span>
        </div>
        <div className="flex items-baseline gap-2 shrink-0">
          {score !== undefined && (
            <span className="font-mono text-gold text-base tabular font-light">
              {score}
            </span>
          )}
          <span className="font-mono text-mute/70 text-xs tabular">
            {team.wins}-{team.losses}
          </span>
        </div>
      </div>
      {/* Probable pitcher row */}
      {team.probablePitcher && (
        <p className="font-mono text-mute text-[10px] tracking-[0.2em] mt-1 pl-[3.25rem] flex items-baseline gap-2">
          <span className="text-bone/80 normal-case">
            {team.probablePitcher.fullName}
          </span>
          {team.probablePitcher.era !== "—" && (
            <span className="text-gold/60 tabular">
              ERA {team.probablePitcher.era}
            </span>
          )}
        </p>
      )}
    </div>
  );
}

// ── State badge styling ──────────────────────────────
const STATE_LABEL: Record<MlbGame["state"], string> = {
  preview: "即將開打",
  live: "進行中",
  final: "已結束",
  other: "—",
};

const STATE_COLOR: Record<MlbGame["state"], string> = {
  preview: "border-mute/60 text-mute/80",
  live: "border-win text-win",
  final: "border-line text-mute",
  other: "border-line text-mute",
};

// CPBL 卡同款:把 dateTaipei「2026 · 05 · 20」壓成「05/20」放卡頭(跨日不搞混)。
function compactMlbDate(dateStr: string): string {
  const parts = dateStr.split("·").map((s) => s.trim());
  return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : dateStr;
}
