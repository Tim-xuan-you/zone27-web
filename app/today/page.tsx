import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import CardBetStrip from "@/components/CardBetStrip";
import SoccerBetStrip from "@/components/SoccerBetStrip";
import TennisBetStrip from "@/components/TennisBetStrip";
import BadmintonBetStrip from "@/components/BadmintonBetStrip";
import MmaBetStrip from "@/components/MmaBetStrip";
import BasketballBetStrip from "@/components/BasketballBetStrip";
import DuelRecordStrip from "@/components/DuelRecordStrip";
import WatchPoints from "@/components/WatchPoints";
import {
  selectTodayDuel,
  duelEngineSide,
  duelStartLabel,
  DUEL_SPORT_LABEL,
  type TodayDuel,
} from "@/lib/daily-duel";
import { selectWatchPoints } from "@/lib/watch-points";
import { getMatchHeat } from "@/lib/match-heat";
import { getEngineConviction } from "@/lib/conviction";
import { matches as allMatches, getTodayTaipei } from "@/lib/matches";
import { getMlbAsMatches } from "@/lib/mlb-matches";
import { getTeamCrest } from "@/lib/identity";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /today · 今日一戰 · 你 vs 機器 ─────────────────────────────────────
// 留存命門(Tim 2026-06-27「玩一天就沒再來·留不住人」):球賽賽果慢、不規律 → 押完之後「明天」
// 沒有事等用戶回來。 解 = 一個每天非回來不可的固定地址:一天一題、賽前各自鎖死、隔天見真章、
// 留下一條「你連續幾天正面對機器」的紀錄(含贏含輸 · 一場沒躲)。 別人抄不走,因為沒有別人有
// 一台敢公開下注又會輸的誠實機器讓人天天挑戰。 0 新增 Tim 負擔(自動從既有開盤賽事選題)。
//
// R293 · 六運動版:選題 lib/daily-duel 跨六運動(棒球休賽日對決落到籃/足/羽/網/格鬥 · 應戰
// 儀式不斷)· 下注掛各運動自己的既有元件(pick 語意不同 · 共享 predictions 表 · 先鎖後結 ·
// 賽後自動結算)· 連續天數 aggregateStreak 跨運動(押哪個運動都算應戰)。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "今日一戰 · 你 vs 機器",
  description:
    "每天一題 · 賽前各自鎖死 · 隔天見真章。 站到一台賽前公開下注、而且會輸的誠實機器對面,看你比它準幾天。 含贏含輸、刪不掉、一場沒躲。",
  ogDescription: "今天這一題,你敢不敢站到機器對面?賽前鎖死、隔天見真章、含贏含輸。",
  path: "/today",
});

export const revalidate = 300; // 賽事 phase(賽前→開打)會變 · 5 分鐘刷一次 · 下注元件 client 端再把開打的封盤

/** 對決卡兩欄顯示(順序 = 各運動下注元件的按鈕順序:籃球客先 · 其餘主/a 先)。 */
function duelSides(duel: TodayDuel): {
  left: { name: string; seed: string; glyph?: string; color?: string };
  right: { name: string; seed: string; glyph?: string; color?: string };
} {
  switch (duel.sport) {
    case "baseball": {
      const m = duel.match;
      const hc = getTeamCrest(m.home.name, m.home.en, m.league);
      const ac = getTeamCrest(m.away.name, m.away.en, m.league);
      return {
        left: { name: m.home.name, seed: m.home.name, glyph: hc?.glyph, color: hc?.color },
        right: { name: m.away.name, seed: m.away.name, glyph: ac?.glyph, color: ac?.color },
      };
    }
    case "soccer":
      return {
        left: { name: duel.homeName, seed: duel.homeSeed },
        right: { name: duel.awayName, seed: duel.awaySeed },
      };
    case "basketball":
      // 籃球慣例:客在前(同看板卡 + 下注鈕順序)
      return {
        left: { name: duel.awayName, seed: duel.awaySeed },
        right: { name: duel.homeName, seed: duel.homeSeed },
      };
    default:
      // 網球 / 羽球 / 格鬥:a 先 b 後(同看板 + 下注鈕順序)
      return {
        left: { name: duel.aName, seed: duel.aName },
        right: { name: duel.bName, seed: duel.bName },
      };
  }
}

export default async function TodayPage() {
  // 今日一戰選題:六運動裡「還能賽前鎖死、機器有偏好」的那一場(棒球當日制 · 其餘接下來 24h)。
  const mlbAll = await getMlbAsMatches();
  const duel = selectTodayDuel([...allMatches, ...mlbAll]);
  const engine = duel ? duelEngineSide(duel) : null;

  // 今日看點:對決之外「今天還值得盯哪幾場」(六運動 · 最多 3 場 · 每場一句真材料理由)。
  // 對決那場排除(它已是主秀)· 熱度 RPC 任何錯 → 空(graceful · 同 match-heat 設計)。
  const heat = await getMatchHeat();
  const watchPoints = selectWatchPoints({
    baseball: [...allMatches, ...mlbAll],
    heat,
    excludeId: duel?.id ?? null,
  });

  // 連續紀錄條的賽果對帳走 /api/duel-results(client 端登入且押過才抓)——
  // 4,500+ 列一本帳塞進這頁 HTML 會讓每個訪客吞 400KB+(mobile-first 鐵律)。
  const todayTaipei = getTodayTaipei();

  const sides = duel ? duelSides(duel) : null;
  const leftFav = !!(engine && sides && engine.name === sides.left.name);
  const rightFav = !!(engine && sides && engine.name === sides.right.name);

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

        {duel && engine && sides ? (
          <>
            {/* ── 今日對決卡 ───────────────────────────── */}
            <div className="border border-gold/35 bg-slate/30 p-5">
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="font-mono text-gold/70 text-[9px] tracking-[0.3em] border border-gold/30 px-1.5 py-0.5">
                  {duel.sport === "baseball"
                    ? duel.league
                    : `${DUEL_SPORT_LABEL[duel.sport]} · ${duel.league}`}
                </span>
                <span className="font-mono text-mute text-[10px] tracking-[0.2em] tabular shrink-0">
                  {duelStartLabel(duel.startISO, todayTaipei)} 開賽
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    seed={sides.left.seed}
                    glyph={sides.left.glyph}
                    color={sides.left.color}
                    size={30}
                  />
                  <span
                    className={`text-lg sm:text-xl font-light tracking-tight truncate ${
                      leftFav ? "text-gold" : "text-bone"
                    }`}
                  >
                    {sides.left.name}
                  </span>
                </span>
                <span className="font-mono text-mute/50 text-xs shrink-0">vs</span>
                <span className="flex items-center gap-2.5 min-w-0 justify-end">
                  <span
                    className={`text-lg sm:text-xl font-light tracking-tight truncate text-right ${
                      rightFav ? "text-gold" : "text-bone"
                    }`}
                  >
                    {sides.right.name}
                  </span>
                  <Avatar
                    seed={sides.right.seed}
                    glyph={sides.right.glyph}
                    color={sides.right.color}
                    size={30}
                  />
                </span>
              </div>

              {/* 機器已鎖死的一手 · 賽前不翻牌(誠實:機器先攤、改不了)· 足球附三向真實線。 */}
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-gold/85 text-[11px] tracking-[0.1em] leading-relaxed border-t border-gold/15 pt-3">
                <span aria-hidden="true" className="text-gold/70">▦</span>
                <span>
                  機器已鎖 <span className="text-gold tabular">{engine.name} {engine.pct}%</span> · {getEngineConviction(engine.pct).label} · 賽前不翻牌
                </span>
                {duel.sport === "soccer" && (
                  <span className="text-mute/60 tabular">
                    主 {duel.pcts.homeWin} · 和 {duel.pcts.draw} · 客 {duel.pcts.awayWin}
                  </span>
                )}
              </p>

              {/* 你的一手:掛該運動自己的既有下注流(未登入→登入餌 · 已押→鎖定卡 · 開打→封盤)·
                  全走共享 predictions 表 + 賽後自動對帳(pick 語意各運動自己管 · 不硬轉)。 */}
              {duel.sport === "baseball" ? (
                <CardBetStrip
                  matchId={duel.id}
                  homeName={duel.match.home.name}
                  awayName={duel.match.away.name}
                  startISO={duel.startISO}
                  engineHomePct={duel.match.home.winRate}
                  returnTo="/today"
                  challenge
                />
              ) : duel.sport === "soccer" ? (
                <SoccerBetStrip
                  matchId={duel.id}
                  dateISO={duel.startISO}
                  homeLabel={duel.homeName}
                  awayLabel={duel.awayName}
                  locked
                  returnTo="/today"
                  challenge
                />
              ) : duel.sport === "basketball" ? (
                <BasketballBetStrip
                  gameId={duel.id}
                  startISO={duel.startISO}
                  homeLabel={duel.homeName}
                  awayLabel={duel.awayName}
                  returnTo="/today"
                  challenge
                />
              ) : duel.sport === "tennis" ? (
                <TennisBetStrip
                  matchId={duel.id}
                  startISO={duel.startISO}
                  aLabel={duel.aName}
                  bLabel={duel.bName}
                  returnTo="/today"
                  challenge
                />
              ) : duel.sport === "badminton" ? (
                <BadmintonBetStrip
                  matchId={duel.id}
                  startISO={duel.startISO}
                  aLabel={duel.aName}
                  bLabel={duel.bName}
                  returnTo="/today"
                  challenge
                />
              ) : (
                <MmaBetStrip
                  matchId={duel.id}
                  startISO={duel.startISO}
                  aLabel={duel.aName}
                  bLabel={duel.bName}
                  returnTo="/today"
                  challenge
                />
              )}
            </div>

            {/* 你連續幾天正面對機器(登入且押過才顯 · 含贏含輸 · 一場沒躲 · 六運動同一條)。 */}
            <DuelRecordStrip todayTaipei={todayTaipei} />

            {/* 對決之外,今天還值得盯哪幾場(0 場 → 整節自隱)。 */}
            <WatchPoints points={watchPoints} />

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
            <DuelRecordStrip todayTaipei={todayTaipei} hero />

            {/* 沒對決的說明降為次要(成績單之下)· 沒登入/沒戰績的人這張就是頁面主體 */}
            <div className="mt-6 border border-line/60 bg-slate/30 p-5">
              <p className="text-bone text-base sm:text-lg font-light leading-snug mb-2">
                今天沒有可對決的場。
              </p>
              <p className="text-mute text-sm leading-relaxed">
                六個運動都沒有還能賽前鎖死的場 —— 可能是休賽空窗,或接下來的場都已經開打
                (賽前才收對決,開打就封盤)。 明天這個時間再來,換你站到機器對面。
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

            {/* 沒有對決 ≠ 今天沒戲:六運動裡還有值得盯的場(0 場 → 整節自隱)。 */}
            <WatchPoints points={watchPoints} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
