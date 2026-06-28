import Link from "next/link";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import MarketSplitBar from "@/components/MarketSplitBar";
import { createPageMetadata } from "@/lib/page-og";
import {
  BASKETBALL_GAMES,
  drawCounts,
  drawLine,
  gradeBasketballEngine,
  lineable,
  type BasketballGame,
} from "@/lib/basketball/matches";

// ── ZONE 27 · /basketball · 籃球效率引擎逐場開盤(運彩在賣的場 · v0.1)──────────────────
// 新運動擴張(承棒球/足球/網球/羽球/UFC)· Tim 2026-06-28 拍板:籃球是「非-Elo 真引擎」的答案
//(效率模型真比 Elo 準 · 見 lib/basketball/engine)。 v0.1 = WNBA 練兵(NBA 休季,開打前首發)·
// 純讀不接押注(同羽球當初:押注 + personal 五面下一波接,不留幽靈 pending)。
//
// 🔴 第一要務 = 誠實框架:籃球比棒球好預測(回合多→變異小),但沒有神準 —— 一場照樣翻盤,賣校準。
//   第二 = 米其林克制:查不到隊伍數據 → 不硬開,誠實標「算不出」· 照樣是真賽事。 名字用運彩的。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "籃球 · 引擎逐場開盤",
  description:
    "台灣運彩在賣的籃球,我們用效率模型(每場淨得分 + 主場 → 勝率)逐場開盤 —— 不是 Elo、更不是盤口。 籃球比棒球好預測,但沒有神準,我們賣的是誠實校準。 查不到數據的隊誠實標、不開假盤。",
  ogTitle: "籃球 · 引擎逐場開盤 · ZONE 27",
  ogDescription: "運彩在賣的籃球 · 效率模型自己算的勝率 · 不是 Elo 不是盤口 · 賣校準不賣鐵口",
  path: "/basketball",
});

export const revalidate = 3600;

export default function BasketballPage() {
  const { shown, lined } = drawCounts();
  const eng = gradeBasketballEngine();
  const upcoming = BASKETBALL_GAMES.filter((g) => !g.finalResult);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="basketball" />
      <SportTabs active="basketball" />

      <main id="main">
        {/* ── HEADER ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-8">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">籃球 · 引擎逐場開盤</p>
            <span className="font-mono text-gold/60 text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30">
              v0.1 · WNBA
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            我們<span className="text-gold">自己算</span>的勝率
          </h1>
          <p className="mt-4 text-mute text-sm leading-relaxed max-w-2xl">
            台灣運彩在賣的籃球,我們用<span className="text-bone">效率模型</span>(每隊每場淨得分 + 主場
            → 預期分差 → 勝率)逐場開盤。 <span className="text-bone">不是 Elo、更不是盤口</span> ——
            是我們自己算、敢攤開對帳的數字。
          </p>

          {/* 🔴 誠實框架(本頁第一要務) */}
          <div className="mt-5 border-l-2 border-gold/50 pl-4 text-mute text-[13px] sm:text-sm leading-relaxed max-w-2xl">
            <p>
              籃球一場 ~100 個回合,勝負是<span className="text-bone">分差磨出來的</span> —— 所以看
              「淨得分」的效率模型<span className="text-gold">真的比 Elo 準</span>(這也是為什麼我們籃球
              不用 Elo)。 它比棒球好預測,但<span className="text-bone">一樣沒有神準</span>:強隊單場
              照樣翻盤。 我們賣的不是「很準」,是<span className="text-bone">敢公開到底準幾成</span>。{" "}
              <Link href="/calibration" className="text-gold/80 hover:text-gold underline-offset-4 hover:underline">
                校準是什麼 →
              </Link>
            </p>
          </div>

          {/* 覆蓋率誠實揭露 + 米其林克制 */}
          <p className="mt-5 font-mono text-mute/60 text-[10px] tracking-[0.15em] leading-relaxed max-w-2xl">
            運彩在賣的場我們只放<span className="text-bone">敢負責的</span> ——
            目前桌上 <span className="text-bone tabular">{shown}</span> 場,
            其中 <span className="text-gold tabular">{lined}</span> 場兩隊都查得到效率數據、開得出引擎線,
            查不到的隊<span className="text-bone">誠實標「算不出」</span>。 隊伍淨得分是
            <span className="text-bone">真實賽季得失分換算的估計值</span>(非官方數據)· 隨賽果更新。
            打完的場移到下方帳本對帳(不佔看板)。 v0.1 是 WNBA 練兵 · NBA 開打前首發。
          </p>
          <div className="mt-6 w-full h-px bg-line/60" />
        </section>

        {/* ── 真實賽程看板(只列還沒打完的)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
          {upcoming.length > 0 ? (
            <>
              <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">WNBA</p>
                <span className="font-mono text-mute/50 text-[9px] tracking-[0.2em]">台北時間</span>
              </div>
              {/* 唯讀訊號(稽核:沒 bet 鈕的卡可能讓習慣押注的人找不到入口)· 誠實講清楚 v0.1 只看開盤。 */}
              <p className="font-mono text-mute/55 text-[10px] tracking-[0.12em] leading-relaxed mb-4 max-w-2xl">
                先看引擎自己怎麼開盤 —— v0.1 還沒接押注。 你押一手 + 進你刪不掉的戰績,下一波接上(同羽球當初)。
              </p>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {upcoming.map((g) => (
                  <GameCard key={g.id} game={g} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-mute text-sm leading-relaxed max-w-2xl">
              這一批的場都打完了 —— 賽果與引擎對帳都在下方帳本。 下一批運彩開賣再上架。
            </p>
          )}
        </section>

        {/* ── 引擎戰績(含輸照掛 · 第一場結算就誠實長出來 · 同羽球兩段式)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6 max-w-2xl">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎公開戰績</p>
            {eng.n > 0 ? (
              <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
                引擎已對帳 <span className="text-gold tabular">{eng.n}</span> 場 ·{" "}
                <span className="text-gold tabular">✓{eng.hits}</span>{" "}
                <span className="text-loss/85 tabular">✕{eng.misses}</span>
                {eng.rate !== null && (
                  <>
                    {" "}· <span className="text-bone tabular">{eng.rate}%</span>
                  </>
                )}
                {eng.pending > 0 && <> · 另 {eng.pending} 場待結算</>}。{" "}
                <span className="text-bone">命中落空都掛、刪不掉</span>,跟其他運動分開算。
                籃球比棒球好預測,但<span className="text-bone">場數還少、這數字還會跳</span>。
              </p>
            ) : (
              <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
                引擎已賽前開盤 <span className="text-gold tabular">{eng.pending}</span> 場 ——
                還沒有一場結算。 第一場打完就逐場對帳、<span className="text-bone">命中落空都掛、刪不掉</span>,
                跟棒球 / 足球 / 網球 / 羽球 / UFC <span className="text-bone">分開算</span>(各運動各自一本帳)。
              </p>
            )}
          </div>
        </section>

        {/* ── 引擎怎麼算(誠實註腳 + 連 /calibration)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6 max-w-2xl">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎怎麼算</p>
            <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
              每隊一個<span className="text-bone">「淨得分」</span>(平均每場對上聯盟平均贏/輸幾分)·
              對戰時:<span className="text-bone">預期分差 = 主隊淨得分 − 客隊淨得分 + 主場優勢</span>,
              再用單場分差的常態分布換算成勝率。 🔴 分差標準差綁在真實單場變異(~11 分)上 ——
              所以再大的實力差也<span className="text-bone">不會喊到 9 成多</span>(籃球單場本來就會翻)。
            </p>
            <p className="mt-3 text-mute/70 text-[12px] leading-relaxed">
              淨得分是<span className="text-mute">真實賽季得失分換算的估計值(非官方數據)</span>,隨賽果更新。
              引擎只看效率:<span className="text-mute">沒看傷停、背靠背、輪換</span> —— 那正是你的判斷比
              引擎值錢的地方。 我們不接受下注、不顯示盤口、不喊穩贏。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/calibration"
                className="font-mono text-gold/75 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
              >
                校準是什麼 · 喊 63% 真的中 63% 嗎 →
              </Link>
              <Link
                href="/matches"
                className="font-mono text-mute/60 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
              >
                看棒球引擎開盤 →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── 單場卡(讀-only v0.1 · 引擎線或誠實「算不出」)──────────────────────────
function GameCard({ game }: { game: BasketballGame }) {
  const line = drawLine(game);
  const canLine = lineable(game);
  const favName =
    line && line.pick === "home" ? game.home.zh : line ? game.away.zh : null;
  const favPct = line ? Math.max(line.homeWin, line.awayWin) : null;

  return (
    <div className="border border-line/60 bg-slate/30 p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-gold/70 text-[9px] tracking-[0.3em] border border-gold/30 px-1.5 py-0.5">
          {game.league}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.2em] tabular shrink-0">
          {game.time} 開賽
        </span>
      </div>

      {/* 客 @ 主(籃球慣例:客隊在前) */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-bone text-base sm:text-lg font-light tracking-tight truncate">
          {game.away.zh}
        </span>
        <span className="font-mono text-mute/50 text-[10px] shrink-0">@</span>
        <span className="text-bone text-base sm:text-lg font-light tracking-tight truncate text-right">
          {game.home.zh}
        </span>
      </div>
      <p className="font-mono text-mute/45 text-[9px] tracking-[0.2em] mb-3">客 · 主(有主場優勢)</p>

      {canLine && line ? (
        <>
          {/* 🔴 排版 = 客在左、主在右(籃球慣例 · 同上方隊名順序)。 MarketSplitBar 是「位置性」的
              (homePct = 左半寬、awayPct = 右半寬、goldSide "home"=左/"away"=右)→ 故意把客隊勝率餵左半、
              主隊勝率餵右半、金色給引擎看好那隊(落在對的那一側)。 ⚠️ 別「修正」成 homePct=homeWin —
              那會讓金條跟上方隊名左右對不上(稽核假陽性 · 2026-06-28 已肉眼驗 render 正確:金條永遠在被看好那隊那側)。 */}
          <MarketSplitBar
            homePct={line.awayWin}
            awayPct={line.homeWin}
            goldSide={line.pick === "away" ? "home" : "away"}
            variant="engine"
          />
          <p className="mt-2 font-mono text-gold/85 text-[11px] tracking-[0.1em] leading-relaxed">
            引擎看好 <span className="text-gold tabular">{favName} {favPct}%</span> · 效率換算 · 非盤口
          </p>
        </>
      ) : (
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.12em] leading-relaxed border-t border-line/40 pt-3">
          有一隊我們查不到效率數據 —— 不硬開假盤(誠實「算不出」)。
        </p>
      )}
    </div>
  );
}
