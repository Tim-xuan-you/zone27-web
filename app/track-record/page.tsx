import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import {
  matches,
  getFinalizedMatches,
  getCalibration,
  getEnginePctOnWinner,
  getMatchDateIso,
  getTodayTaipei,
  type Match,
} from "@/lib/matches";
import { getMlbLockedMatches } from "@/lib/mlb-matches";
import SoccerEngineRecord from "@/components/SoccerEngineRecord";
import TennisEngineRecord from "@/components/TennisEngineRecord";
import BadmintonEngineRecord from "@/components/BadmintonEngineRecord";
import { gradeBadmintonEngine } from "@/lib/badminton/matches";
import AnalystPanel from "@/components/AnalystPanel";
import SportToggle from "@/components/SportToggle";
import SoccerPendingFrame from "@/components/SoccerPendingFrame";
import { getLockedSoccerPredictions } from "@/lib/soccer/locked";
import { createPageMetadata } from "@/lib/page-og";

// ── R201 · Tim dogfood「太複雜/太多廢話/沒人看/該有 MLB」→ 從 1250 行(TCG 卡 / build
// hash / 哲學框 / 創辦人三段告白 / 5 步評分 / 重複樣本警告)瘦成「一張刪不掉的跨聯盟含輸帳本」。
// 4-agent 設計 + 對抗式守護城河。 砍 ~450 行表演/後設層 · 誠實骨架一行不動。
//
// 🔴 LOAD-BEARING(砍了=變報馬仔 · 只瘦身不砍):① PROVED✓/DIVERGED✕ 等大等亮(含輸跟
//   命中同字級同框)② 含輸命中率(分母寫出來:proved/(proved+diverged))③ N<30「樣本還小」
//   老實標 ④ 含輸 LEDGER 表本身 ⑤ 引擎最自信兩場 一中一沒中 ⑥ 未補錄債務行。
// 🟢 MLB 併入(Musk:刪人為分離 · 同一引擎跨聯盟合計命中率 · 但保各聯盟「單獨仍<30」誠實標 ·
//   絕不因合計過30就熄滅警告 · 校準曲線仍各聯盟分開不污染)· getCalibration league-agnostic(同一把尺)·
//   用 getMlbLockedMatches(同步讀 JSON · 守 revalidate 不打 live API)。
// ─────────────────────────────────────────────────────
export const metadata: Metadata = createPageMetadata({
  title: "公開戰績 · PROVED + DIVERGED ledger",
  description:
    "ZONE 27 引擎所有預測賽後對帳(CPBL + MLB)· PROVED 跟 DIVERGED 等大等亮 — 不刪、不修飾、不過濾。含輸的命中率,分母攤出來給你看。",
  path: "/track-record",
});

// R211 · 86400→3600:SoccerEngineRecord 的開踢分流標籤讀 ISR 快照時鐘 · 世界盃
// 期間 1 天 ISR 會讓「未開賽 N」最久延遲 24h(誠實鐵律下不可接受)· 收緊到 1h。
export const revalidate = 3600;

// 跨聯盟挑「引擎押最重」用 · favorite = winRate 大的那邊有多高
const favPct = (m: Match) => Math.max(m.home.winRate, m.away.winRate);

export default function TrackRecordPage() {
  // 跨聯盟合併:CPBL(static matches)+ MLB(locked.json · 同步 · 守 ISR)· 新→舊。
  const cpblFinal = getFinalizedMatches();
  const mlbFinal = getMlbLockedMatches().filter((m) => m.finalResult);
  const finalized = [...cpblFinal, ...mlbFinal].sort(
    (a, b) => (getMatchDateIso(b) ?? "").localeCompare(getMatchDateIso(a) ?? "")
  );

  const proved = finalized.filter((m) => getCalibration(m) === "proved").length;
  const diverged = finalized.filter((m) => getCalibration(m) === "diverged").length;
  const push = finalized.filter((m) => getCalibration(m) === "push").length;
  const decided = proved + diverged;
  const provedPct = decided > 0 ? Math.round((proved / decided) * 100) : null;

  // 各聯盟單獨已結算場數 · 任一聯盟單獨 <30 → 續掛「樣本還小」老實標(絕不因合計過30偷熄)。
  const leagueDecided = (ms: Match[]) =>
    ms.filter(
      (m) => getCalibration(m) === "proved" || getCalibration(m) === "diverged"
    ).length;
  const cpblDecided = leagueDecided(cpblFinal);
  const mlbDecided = leagueDecided(mlbFinal);
  const eitherLeagueSmall = cpblDecided < 30 || mlbDecided < 30;

  // 引擎最自信的兩場 · 一中一沒中(跨聯盟挑 · 卡上標 league)
  const provedList = finalized.filter((m) => getCalibration(m) === "proved");
  const divergedList = finalized.filter((m) => getCalibration(m) === "diverged");
  const biggestHit = provedList.length
    ? provedList.reduce((a, b) => (favPct(b) > favPct(a) ? b : a))
    : null;
  const biggestMiss = divergedList.length
    ? divergedList.reduce((a, b) => (favPct(b) > favPct(a) ? b : a))
    : null;

  // 已結束但未補錄最終比分(CPBL)· 主動 surface gap = 誠實守則(LOAD-BEARING)。
  const todayTaipei = getTodayTaipei();
  const unfiledArchived = matches.filter((m) => {
    if (m.finalResult) return false;
    const iso = getMatchDateIso(m);
    return iso ? iso < todayTaipei : false;
  }).length;

  // 足球(三向 · 獨立帳本)· 給運動切換的足球 view + PENDING 尊嚴框(0 結算 = 結果還沒開始)
  const soccerPreds = getLockedSoccerPredictions();
  const soccerLocked = soccerPreds.length;
  const soccerDecided = soccerPreds.filter(
    (p) => p.verdict === "proved" || p.verdict === "diverged",
  ).length;

  // ── 棒球明細 view(進運動切換 · 預設顯示)· 六件誠實全在裡面:3-stat / 最自信兩場 /
  //    LEDGER 表 / 未補錄債務行(hero 的含輸率 + N<30 留在永遠可見層,不進 toggle)。 ──
  const baseballView = (
    <>
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-2 pb-2">
        <p lang="en" className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / 棒球 · CPBL + MLB · 同一把尺算對錯
        </p>
      </section>
      {/* HEADLINE STATS · 3-cell · PROVED/DIVERGED 等大等亮 */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-2 pb-16">
        <div className="grid grid-cols-3 gap-4 sm:gap-6 bg-slate/40 border border-line/70 p-6 sm:p-8">
          <LedgerStat label="PROVED · 引擎命中" value={String(proved)} tone="gold" />
          <LedgerStat label="DIVERGED · 引擎落空" value={String(diverged)} tone="loss" />
          <LedgerStat
            label="命中率 · 含輸一起算"
            value={provedPct === null ? "—" : `${provedPct}%`}
            tone={provedPct === null ? "mute" : "bone"}
          />
        </div>
        {push > 0 && (
          <p className="mt-3 font-mono text-mute/60 text-[10px] tracking-[0.25em]">
            · 另 {push} 場 PUSH(平局或 50/50 無 favorite · 不計入命中率分母)
          </p>
        )}
        {/* N<30 老實標 · 跟著它要標的「命中率」走(R279 從 hero 搬下來,跟數字同一處才不孤兒)。 */}
        {decided > 0 && eitherLeagueSmall && (
          <p className="mt-3 font-mono text-loss/80 text-[11px] tracking-[0.2em] leading-relaxed">
            ⚠ 樣本還小 · 各聯盟單獨都還沒滿 30 場(CPBL {cpblDecided} · MLB {mlbDecided})·
            這是方向命中率,不是機率校準 · 滿 30 場才算數。
          </p>
        )}
      </section>

      {/* 引擎最自信的兩場 · 一中一沒中 */}
      {biggestHit && biggestMiss && (
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
          <p lang="en" className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-2">
            / 引擎押最重的兩場
          </p>
          <p className="text-mute/85 text-sm leading-relaxed mb-6">
            一場對 · 一場錯 · 等大擺一起。
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <BiggestCallCard match={biggestHit} kind="proved" />
            <BiggestCallCard match={biggestMiss} kind="diverged" />
          </div>
        </section>
      )}

      {/* LEDGER · 含輸帳本(跨聯盟 · 新→舊 · 不刪不修飾) */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-3">
          / 帳本 · 最新在最上面 · 不刪不修飾
        </p>
        {finalized.length === 0 ? (
          <div className="border border-dashed border-gold/30 bg-slate/30 p-10 text-center">
            <p className="text-mute text-sm leading-relaxed max-w-md mx-auto">
              帳本等第一筆 · 不補登舊比賽、不挑好看的塞進來。
              從引擎第一場公開預測的比賽開始記。
            </p>
          </div>
        ) : (
          <div className="border border-line/70">
            <div
              className="hidden lg:grid grid-cols-[100px_1fr_120px_130px_100px_44px] gap-3 px-5 py-3 bg-slate/50 border-b border-line/60 font-mono text-mute text-[9px] tracking-[0.3em]"
              role="row"
            >
              <span lang="en">DATE · 聯盟</span>
              <span lang="en">MATCHUP · ENGINE PREDICTION</span>
              <span lang="en" className="text-right">FINAL</span>
              <span lang="en" className="text-right">ENGINE % ON WINNER</span>
              <span lang="en" className="text-right">VERDICT</span>
              <span className="sr-only">link</span>
            </div>
            {finalized.map((m) => (
              <LedgerRow key={m.id} match={m} />
            ))}
          </div>
        )}
        {unfiledArchived > 0 && (
          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚠ {unfiledArchived} 場 CPBL 已結束但未補錄最終比分 · 引擎預測已不可驗證 ·
            維持 ARCHIVED · 不會出現在此表。
          </p>
        )}
      </section>
    </>
  );

  // ── 足球明細 view(進運動切換)· 0 結算 → 上方 PENDING 尊嚴框(結果還沒開始)·
  //    下方 SoccerEngineRecord(三向引擎戰績 · 誠實段原封不動)。 ──
  const soccerView = (
    <>
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-2 pb-1">
        <p lang="en" className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / 足球 · 三向引擎戰績 · 跟棒球分開計(不混池)
        </p>
      </section>
      {soccerDecided === 0 && <SoccerPendingFrame locked={soccerLocked} />}
      <SoccerEngineRecord />
    </>
  );

  // ── 網球明細 view · 表面校正 Elo 兩向 · 跟棒球足球分開計(不混池)· R266 ──
  //    引擎沒開盤的場(傷退失真)不進戰績 · 賽果 Tim 賽後 curate(同棒球)。
  const tennisView = (
    <>
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-2 pb-1">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / 網球 · 表面校正 Elo · 跟棒球足球分開計(不混池)
        </p>
      </section>
      <TennisEngineRecord />
    </>
  );

  // ── 羽球明細 view · BWF 排名換算 Elo · 跟棒球足球網球分開計(不混池)· R279 ──
  //    有引擎活動(已對帳 or 待結算)才顯示該 tab(graceful · 0 活動不露空 tab)。
  const badmintonEng = gradeBadmintonEngine();
  const showBadminton = badmintonEng.n > 0 || badmintonEng.pending > 0;
  const badmintonView = (
    <>
      <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-2 pb-1">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
          / 羽球 · BWF 排名換算 Elo · 跟棒球足球網球分開計(不混池)
        </p>
      </section>
      <BadmintonEngineRecord />
    </>
  );

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="matches" />

      <main id="main">
        {/* ── HERO · 先給數字(含分母)· 不寫字解釋「我們多誠實」──────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-20 pb-10">
          {/* 🔴 R279 Tim canary 第二刀「52% 一定要出現?超亂超雜 · 要連國小生都想玩」→ 極簡:
              hero 只剩「一個好懂的挑戰 + 一句誠實鉤 + 一個按鈕」。 52%/143/命中率全搬到下方
              3-cell 帳本(本就在,誠實零損失)· 數字不在 hero 大吼。 國小生一眼懂、想點。 */}
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-5">
            / 公開戰績
          </p>
          <h1 className="text-4xl sm:text-6xl text-bone font-light tracking-tight max-w-3xl leading-tight">
            你,贏得了這台機器嗎?
          </h1>
          <p className="mt-6 text-mute text-base sm:text-lg leading-relaxed max-w-xl">
            它把每一場沒中的都留著給你看 —— <span className="text-bone">報明牌的不敢</span>。
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/matches"
              className="inline-flex items-center gap-2 font-mono text-gold/90 hover:text-gold text-[13px] tracking-[0.18em] border border-gold/40 hover:border-gold/70 hover:bg-gold/10 px-5 py-2.5 transition-colors"
            >
              挑一場 · 賽後跟它對帳 →
            </Link>
            <Link
              href="/calibration"
              className="font-mono text-mute/85 hover:text-gold text-[11px] tracking-[0.2em] underline-offset-4 hover:underline transition-colors"
            >
              它到底多準? →
            </Link>
          </div>
        </section>

        <div className="mx-auto max-w-5xl w-full px-6 sm:px-10">
          <div className="w-full h-px bg-line/60" />
        </div>

        {/* ── 運動切換(等寬 = 等尊嚴)· 棒球明細 / 足球明細 各占整個舞台 · 預設棒球 ──
            hero 的含輸命中率 + N<30 老實標留在上方永遠可見層(不進 toggle = 不藏誠實);
            這裡切換的只是「分運動明細」。 足球 0 結算 = 上方 PENDING 尊嚴框(不是底部空卡)。 */}
        <SportToggle
          baseball={baseballView}
          soccer={soccerView}
          tennis={tennisView}
          badminton={showBadminton ? badmintonView : undefined}
        />

        {/* ── 怎麼評分 · inline 1 行 ─────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-10">
          <p className="text-mute text-sm leading-relaxed">
            <span className="text-bone">怎麼評:</span>{" "}
            引擎賽前公開鎖定勝率 → 看好的那一邊(勝率 &gt; 50% 那邊)賽後贏 ={" "}
            <span className="text-gold">PROVED ✓</span>、輸 ={" "}
            <span className="text-loss/85">DIVERGED ✕</span>、平手或五五波 ={" "}
            <span className="text-mute">PUSH =</span>。 三者視覺等大 · 同一把尺算 CPBL 跟 MLB。{" "}
            <Link href="/how-we-grade" className="text-gold underline-offset-4 hover:underline">
              我們怎麼算贏輸 →
            </Link>
          </p>
        </section>

        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 text-center">
          <div className="flex justify-center">
            <CopyLinkButton
              label="把這份含輸帳本傳出去"
              doneLabel="已複製 · 貼給他"
              shareText="ZONE 27 引擎公開戰績:賽前鎖定的每一場預測 vs 賽後實際,命中、落空都等大掛著、刪不掉 —— 連輸的都認。 自己驗:"
              refTag="track-record-share"
            />
          </div>
        </section>

        {/* ── 分析師看法 · 人類賽道(R239)· 引擎是招牌 · 這條是旁邊的人(3 位平權分析師 ·
            引擎沒覆蓋的球由人賽前鎖定)· 同一套誠實規則 · graceful(沒鎖手 → 只介紹不掛空盒)。 */}
        <AnalystPanel />

        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <Link
            href="/matches"
            className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
          >
            ← 回到今日賽事板
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function LeagueTag({ league }: { league: string }) {
  return (
    <span
      lang="en"
      className={`font-mono text-[8px] tracking-[0.2em] px-1 py-0.5 border ${
        league === "MLB"
          ? "border-mute/40 text-mute/80"
          : "border-gold/30 text-gold/70"
      }`}
    >
      {league}
    </span>
  );
}

function LedgerStat({
  label,
  value,
  tone = "bone",
}: {
  label: string;
  value: string;
  tone?: "bone" | "gold" | "loss" | "mute";
}) {
  const toneColor = {
    bone: "text-bone",
    gold: "text-gold",
    loss: "text-loss",
    mute: "text-mute",
  }[tone];
  return (
    <div>
      <p className="font-mono text-mute text-[9px] sm:text-[10px] tracking-[0.3em] mb-2">
        {label}
      </p>
      <p className={`font-mono tabular tracking-tight text-2xl sm:text-3xl ${toneColor}`}>
        {value}
      </p>
    </div>
  );
}

// 引擎最自信的一場(命中 / 落空)· 等大等亮 · 只差顏色 · 加 league 標
function BiggestCallCard({
  match,
  kind,
}: {
  match: Match;
  kind: "proved" | "diverged";
}) {
  const fr = match.finalResult;
  if (!fr) return null;
  const homeFavored = match.home.winRate > match.away.winRate;
  const favoriteName = homeFavored ? match.home.name : match.away.name;
  const favoritePct = Math.max(match.home.winRate, match.away.winRate);
  const isHit = kind === "proved";
  const dateIso = getMatchDateIso(match) ?? "—";

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`block border p-5 sm:p-6 bg-slate/30 transition-colors ${
        isHit ? "border-gold/50 hover:border-gold" : "border-loss/50 hover:border-loss"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2 mb-4">
        <span
          className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
            isHit ? "border-gold text-gold" : "border-loss/70 text-loss"
          }`}
        >
          {isHit ? "✓ 最自信 · 命中" : "✕ 最自信 · 落空"}
        </span>
        <span className="flex items-center gap-2">
          <LeagueTag league={match.league} />
          <span className="font-mono text-mute text-[10px] tabular tracking-[0.2em]">
            {dateIso}
          </span>
        </span>
      </div>
      <p
        className={`font-mono tabular text-4xl font-light tracking-tight leading-none ${
          isHit ? "text-gold" : "text-loss"
        }`}
      >
        {favoritePct}
        <span className="text-lg opacity-60 ml-0.5">%</span>
      </p>
      <p className="text-bone text-sm leading-snug mt-3">
        引擎重壓{" "}
        <span className={isHit ? "text-gold" : "text-loss"}>{favoriteName}</span>
        {isHit ? " · 賽後對了" : " · 賽後卻輸了"}
      </p>
      <p className="font-mono text-mute text-[10px] tracking-[0.2em] mt-2 tabular">
        FINAL {fr.homeScore}:{fr.awayScore} ·{" "}
        {fr.winner === "home"
          ? match.home.en + " W"
          : fr.winner === "away"
            ? match.away.en + " W"
            : "TIE"}
      </p>
      <p className="font-mono text-gold/60 text-[10px] tracking-[0.3em] mt-4">
        看我們{isHit ? "押對" : "錯"}在哪 →
      </p>
    </Link>
  );
}

function LedgerRow({ match }: { match: Match }) {
  const cal = getCalibration(match);
  const enginePctOnWinner = getEnginePctOnWinner(match);
  const fr = match.finalResult;
  if (!fr || !cal) return null;

  const homeFavored = match.home.winRate > match.away.winRate;
  const favoriteName = homeFavored ? match.home.name : match.away.name;
  const dogName = homeFavored ? match.away.name : match.home.name;
  const favoritePct = Math.max(match.home.winRate, match.away.winRate);

  const verdictStyles = {
    proved: "text-gold border-gold",
    diverged: "text-loss border-loss/70",
    push: "text-mute border-mute/60",
  } as const;
  const verdictLabel = {
    proved: "✓ PROVED",
    diverged: "✕ DIVERGED",
    push: "= PUSH",
  } as const;
  const verdictColor =
    cal === "proved" ? "text-gold" : cal === "diverged" ? "text-loss" : "text-mute";

  const dateIso = getMatchDateIso(match) ?? "—";

  return (
    <>
      {/* ── DESKTOP · table row ── */}
      <div
        role="row"
        className="hidden lg:grid grid-cols-[100px_1fr_120px_130px_100px_44px] gap-3 px-5 py-4 border-b border-line/40 last:border-b-0 hover:bg-slate/40 transition-colors"
      >
        <span className="self-center">
          <span className="block font-mono text-mute text-xs tabular tracking-[0.05em]">
            {dateIso}
          </span>
          <span className="mt-1 inline-block">
            <LeagueTag league={match.league} />
          </span>
        </span>
        <div className="self-center">
          <p className="text-bone text-sm leading-snug">
            <span className="text-gold">{favoriteName}</span>
            <span className="text-mute mx-1.5 text-xs">被看好</span>
            <span className="text-mute text-xs">vs</span>{" "}
            <span className="text-mute">{dogName}</span>
          </p>
          <p className="font-mono text-mute text-[10px] tracking-[0.2em] mt-1 tabular">
            引擎 · {favoritePct}% / {100 - favoritePct}%
          </p>
        </div>
        <span className="font-mono text-bone text-base tabular self-center text-right">
          {fr.homeScore}:{fr.awayScore}
          <span className="block text-[9px] text-mute tracking-[0.2em] mt-0.5">
            {fr.winner === "home"
              ? `${match.home.en} W`
              : fr.winner === "away"
                ? `${match.away.en} W`
                : "TIE"}
          </span>
        </span>
        <span
          className={`font-mono tabular text-sm self-center text-right ${verdictColor}`}
        >
          {enginePctOnWinner !== null ? `${enginePctOnWinner}%` : "—"}
        </span>
        <span
          lang="en"
          className={`font-mono text-[10px] tracking-[0.25em] border px-2 py-1 self-center text-center ${verdictStyles[cal]}`}
        >
          {verdictLabel[cal]}
        </span>
        <Link
          href={`/matches/${match.id}`}
          className="self-center text-gold/70 hover:text-gold text-right font-mono text-[10px] tracking-[0.3em]"
          aria-label={`Full breakdown for ${favoriteName} vs ${dogName}`}
        >
          →
        </Link>
      </div>

      {/* ── MOBILE · stacked card ── */}
      <Link
        href={`/matches/${match.id}`}
        className="lg:hidden block px-5 py-5 border-b border-line/40 last:border-b-0 hover:bg-slate/40 transition-colors"
        aria-label={`Full breakdown for ${favoriteName} vs ${dogName}`}
      >
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <span className="flex items-center gap-2">
            <LeagueTag league={match.league} />
            <span className="font-mono text-mute text-[10px] tabular tracking-[0.2em]">
              {dateIso}
            </span>
          </span>
          <span
            lang="en"
            className={`font-mono text-[10px] tracking-[0.25em] border px-2 py-0.5 ${verdictStyles[cal]}`}
          >
            {verdictLabel[cal]}
          </span>
        </div>
        <p className="text-bone text-base leading-snug mb-2">
          <span className="text-gold">{favoriteName}</span>
          <span className="text-mute mx-1.5 text-[11px]">被看好</span>
          <span className="text-mute text-[11px]">vs</span>{" "}
          <span className="text-mute">{dogName}</span>
        </p>
        <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-line/40">
          <div>
            <p className="font-mono text-mute text-[9px] tracking-[0.25em] mb-1">ENGINE %</p>
            <p className="font-mono text-bone text-sm tabular">
              {favoritePct}% / {100 - favoritePct}%
            </p>
          </div>
          <div>
            <p className="font-mono text-mute text-[9px] tracking-[0.25em] mb-1">FINAL</p>
            <p className="font-mono text-bone text-sm tabular">
              {fr.homeScore}:{fr.awayScore}
              <span className="block text-[9px] text-mute mt-0.5">
                {fr.winner === "home"
                  ? `${match.home.en} W`
                  : fr.winner === "away"
                    ? `${match.away.en} W`
                    : "TIE"}
              </span>
            </p>
          </div>
          <div>
            <p className="font-mono text-mute text-[9px] tracking-[0.25em] mb-1">ON WINNER</p>
            <p className={`font-mono text-sm tabular ${verdictColor}`}>
              {enginePctOnWinner !== null ? `${enginePctOnWinner}%` : "—"}
            </p>
          </div>
        </div>
      </Link>
    </>
  );
}
