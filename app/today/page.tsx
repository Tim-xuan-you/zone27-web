import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import CardBetStrip from "@/components/CardBetStrip";
import DuelRecordStrip from "@/components/DuelRecordStrip";
import { selectTodayDuel, duelEngineSide } from "@/lib/daily-duel";
import {
  matches as allMatches,
  getFinalizedMatches,
  getMatchStartIso,
  getTodayTaipei,
} from "@/lib/matches";
import { getMlbAsMatches, getMlbFinalizedResults } from "@/lib/mlb-matches";
import { getTeamCrest } from "@/lib/identity";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /today · 今日一戰 · 你 vs 機器 ─────────────────────────────────────
// 留存命門(Tim 2026-06-27「玩一天就沒再來·留不住人」):球賽賽果慢、不規律 → 押完之後「明天」
// 沒有事等用戶回來。 解 = 一個每天非回來不可的固定地址:一天一題、賽前各自鎖死、隔天見真章、
// 留下一條「你連續幾天正面對機器」的紀錄(含贏含輸 · 一場沒躲)。 別人抄不走,因為沒有別人有
// 一台敢公開下注又會輸的誠實機器讓人天天挑戰。 0 新增 Tim 負擔(自動從既有開盤賽事選題)。
//
// 重用既有骨架:選題 lib/daily-duel · 下注 CardBetStrip(共享 predictions 表 · 先鎖後結 · 賽後
// 自動結算)· 連續天數 aggregateStreak。 v1 = 棒球型(CPBL+MLB);足球/網球/羽球/UFC 之後擴。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "今日一戰 · 你 vs 機器",
  description:
    "每天一題 · 賽前各自鎖死 · 隔天見真章。 站到一台賽前公開下注、而且會輸的誠實機器對面,看你比它準幾天。 含贏含輸、刪不掉、一場沒躲。",
  ogDescription: "今天這一題,你敢不敢站到機器對面?賽前鎖死、隔天見真章、含贏含輸。",
  path: "/today",
});

export const revalidate = 300; // 賽事 phase(賽前→開打)會變 · 5 分鐘刷一次 · CardBetStrip client 端再把開打的封盤

export default async function TodayPage() {
  // 今日一戰選題:棒球型賽事(CPBL 靜態 + MLB live)裡,今天還能賽前鎖死、機器有偏好的那一場。
  const mlbAll = await getMlbAsMatches();
  const duel = selectTodayDuel([...allMatches, ...mlbAll]);
  const engine = duel ? duelEngineSide(duel) : null;

  // 連續紀錄條評分用:已結算棒球勝方(CPBL + MLB)· 同 YourRecordStrip / 首頁口徑。
  const matchResults = [
    ...getFinalizedMatches().map((m) => ({
      id: m.id,
      finalWinner: m.finalResult?.winner ?? null,
      startISO: getMatchStartIso(m),
    })),
    ...(await getMlbFinalizedResults()),
  ];
  const todayTaipei = getTodayTaipei();

  const homeFav = engine?.side === "home";
  const awayFav = engine?.side === "away";
  const homeCrest = duel
    ? getTeamCrest(duel.home.name, duel.home.en, duel.league)
    : null;
  const awayCrest = duel
    ? getTeamCrest(duel.away.name, duel.away.en, duel.league)
    : null;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="today" />

      <main id="main" className="mx-auto max-w-xl w-full px-6 sm:px-10 pt-12 pb-24">
        {/* ── 標題 · 你 vs 機器 ─────────────────────────── */}
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
          / 今日一戰 · <span lang="en">TODAY&rsquo;S DUEL</span>
        </p>
        <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-none mb-5">
          你 <span className="text-gold">vs</span> 機器
        </h1>
        <p className="text-mute text-sm sm:text-base leading-relaxed mb-9">
          一天一題、賽前各自鎖死、隔天見真章。 重點不是輸贏 —— 是你敢不敢
          <span className="text-bone">站到這台機器對面</span>。 機器賽前就把它的一手鎖死、改不了;
          你也鎖一手,賽後自動對帳,贏輸都記在你刪不掉的帳本上。
        </p>

        {duel && engine ? (
          <>
            {/* ── 今日對決卡 ───────────────────────────── */}
            <div className="border border-gold/35 bg-slate/30 p-5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-mono text-gold/70 text-[9px] tracking-[0.3em] border border-gold/30 px-1.5 py-0.5">
                  {duel.league}
                </span>
                <span className="font-mono text-mute text-[10px] tracking-[0.2em] tabular shrink-0">
                  今天 {duel.startTime} 開賽
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    seed={duel.home.name}
                    glyph={homeCrest?.glyph}
                    color={homeCrest?.color}
                    size={30}
                  />
                  <span
                    className={`text-lg sm:text-xl font-light tracking-tight truncate ${
                      homeFav ? "text-gold" : "text-bone"
                    }`}
                  >
                    {duel.home.name}
                  </span>
                </span>
                <span className="font-mono text-mute/50 text-xs shrink-0">vs</span>
                <span className="flex items-center gap-2.5 min-w-0 justify-end">
                  <span
                    className={`text-lg sm:text-xl font-light tracking-tight truncate text-right ${
                      awayFav ? "text-gold" : "text-bone"
                    }`}
                  >
                    {duel.away.name}
                  </span>
                  <Avatar
                    seed={duel.away.name}
                    glyph={awayCrest?.glyph}
                    color={awayCrest?.color}
                    size={30}
                  />
                </span>
              </div>

              {/* 機器已鎖死的一手 · 賽前不翻牌(誠實:機器先攤、改不了)。 */}
              <p className="flex items-center gap-2 font-mono text-gold/85 text-[11px] tracking-[0.1em] leading-relaxed border-t border-gold/15 pt-3">
                <span aria-hidden="true" className="text-gold/70">▦</span>
                機器已鎖 <span className="text-gold tabular">{engine.name} {engine.pct}%</span> · 賽前不翻牌
              </p>

              {/* 你的一手:重用既有下注流(未登入→登入餌 · 已押→鎖定卡 · 開打→封盤)· 進共享帳本 + 賽後自動對帳。 */}
              <CardBetStrip
                matchId={duel.id}
                homeName={duel.home.name}
                awayName={duel.away.name}
                startISO={getMatchStartIso(duel)}
                engineHomePct={duel.home.winRate}
              />
            </div>

            {/* 你連續幾天正面對機器(登入且押過才顯 · 含贏含輸 · 一場沒躲)。 */}
            <DuelRecordStrip matchResults={matchResults} todayTaipei={todayTaipei} />

            <p className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.2em]">
              <Link
                href="/matches"
                className="text-mute hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                看今天其他場 →
              </Link>
              <Link
                href="/ladder"
                className="text-mute hover:text-gold underline-offset-4 hover:underline transition-colors"
              >
                上天梯看誰比機器準 →
              </Link>
            </p>
          </>
        ) : (
          <>
            {/* ── 今天沒有可對決的場 → 把「你的成績單」變主角(全站最特別 · 刪不掉 · 可外傳)·
                登入且押過才現(graceful 自隱)· 把死路翻成曬戰績的時刻。 ── */}
            <DuelRecordStrip
              matchResults={matchResults}
              todayTaipei={todayTaipei}
              hero
            />

            {/* 沒對決的說明降為次要(成績單之下)· 沒登入/沒戰績的人這張就是頁面主體 */}
            <div className="mt-6 border border-line/60 bg-slate/30 p-5">
              <p className="text-bone text-base sm:text-lg font-light leading-snug mb-2">
                今天沒有可對決的場。
              </p>
              <p className="text-mute text-sm leading-relaxed">
                可能是休賽日,或今天的場都已經開打(賽前才收對決,開打就封盤)。 明天這個時間再來，
                換你站到機器對面。
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-[0.2em]">
                <Link
                  href="/track-record"
                  className="text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
                >
                  看機器最近的判決 →
                </Link>
                <Link
                  href="/matches"
                  className="text-mute hover:text-gold underline-offset-4 hover:underline transition-colors"
                >
                  看賽事板 →
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
