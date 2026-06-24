import Link from "next/link";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import TennisDrawCard from "@/components/TennisDrawCard";
import TennisRecordCard from "@/components/TennisRecordCard";
import { createPageMetadata } from "@/lib/page-og";
import { blendedRating } from "@/lib/tennis/engine";
import {
  drawGroups,
  drawCounts,
  gradeTennisEngine,
  tennisResults,
  tennisEnginePicks,
} from "@/lib/tennis/matches";
import {
  grassContenders,
  initials,
  type TennisPlayer,
  type TennisTier,
} from "@/lib/tennis/players";

// ── ZONE 27 · /tennis · 網球引擎逐場開盤(台灣運彩在賣的場 · v0.2)──────────────────
// CPBL 模式:從台灣運彩看板 curate 真實對戰(名字一字不改)· 引擎用「排名換算實力分」逐場
// 開盤(表面校正 Elo)· 只秀自己機率,絕不爬盤口、絕不顯示賠率。 隔離在 lib/tennis(不碰
// 棒球 / 足球)· 0 資料庫改動。
//
// 🔴 第一要務 = 誠實框架:網球熱門贏面高,引擎喊八九成大熱門不是神準,是網球本來就好預測;
//   賣點是校準。 第二:不硬開 —— 認不出 / 排名失真(傷退復出)/ 進行中 → 誠實標,不開假盤。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "網球 · 引擎逐場開盤",
  description:
    "台灣運彩在賣的每一場網球,我們的引擎用排名換算的實力分逐場開出勝率 —— 不是盤口。 網球熱門贏面天生高,我們賣的是誠實校準不是神準。 算不出的場(認不出 / 傷退失真 / 進行中)誠實標,不開假盤。",
  ogTitle: "網球 · 引擎逐場開盤 · ZONE 27",
  ogDescription: "運彩在賣的網球 · 引擎自己算的勝率 · 不是盤口 · 算不出的誠實不開",
  path: "/tennis",
});

// ISR · 1h(純讀 curate 資料 · 無外部 fetch · 與其餘運動看板一致)。
export const revalidate = 3600;

const TIER_LABEL: Record<TennisTier, string> = {
  elite: "頂尖",
  strong: "強",
  solid: "穩",
  darkhorse: "黑馬",
};

const SURFACE_LABEL: Record<string, string> = { grass: "草地", clay: "紅土", hard: "硬地" };

function grassRating(p: TennisPlayer): number {
  return Math.round(blendedRating(p.rating.overall, p.rating.grass));
}

function ContenderRow({ p, idx }: { p: TennisPlayer; idx: number }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-line/40 last:border-b-0">
      <span className="w-5 shrink-0 font-mono text-mute/50 text-[11px] tabular text-right">
        {idx + 1}
      </span>
      <Avatar seed={p.id} glyph={initials(p.en)} size={30} />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline gap-2 flex-wrap">
          <span className="text-bone text-base font-light tracking-tight truncate">{p.name}</span>
          <span className="font-mono text-gold/70 text-[8px] tracking-[0.2em] px-1.5 py-0.5 border border-gold/30 shrink-0">
            {TIER_LABEL[p.tier]}
          </span>
        </span>
        <span className="block text-mute/65 text-[11px] leading-snug mt-0.5 truncate">{p.read}</span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-mono text-gold text-base tabular leading-none">
          {grassRating(p)}
        </span>
        <span className="block font-mono text-mute/45 text-[8px] tracking-[0.2em] mt-1">草地戰力</span>
      </span>
    </div>
  );
}

export default function TennisPage() {
  const groups = drawGroups();
  // 結算完的場「收起來」:上方看板只留還沒完場的(可押 / 待開賽擺前面),完場的收進下方「已完場」區。
  const openGroups = groups
    .map((g) => ({ ...g, matches: g.matches.filter((m) => !m.finalResult) }))
    .filter((g) => g.matches.length > 0);
  const settledMatches = groups.flatMap((g) => g.matches.filter((m) => m.finalResult));
  const { total, lined } = drawCounts();
  const atp = grassContenders("atp");
  const wta = grassContenders("wta");
  // 公開戰績:引擎(賽前開盤 vs 賽果)+ 用戶對帳所需的賽果 / 引擎看好邊(賽果由 Tim 賽後 curate)。
  const eng = gradeTennisEngine();
  const results = tennisResults();
  const enginePicks = tennisEnginePicks();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="tennis" />
      <SportTabs active="tennis" />

      <main id="main">
        {/* ── HEADER ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-8">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">網球 · 引擎逐場開盤</p>
            <span className="font-mono text-gold/60 text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30">
              v0.2
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            我們<span className="text-gold">自己算</span>的勝率
          </h1>
          <p className="mt-4 text-mute text-sm leading-relaxed max-w-2xl">
            台灣運彩在賣的每一場網球 —— 溫網會外賽、草地熱身賽 —— 我們的引擎用
            <span className="text-bone">排名換算的實力分</span>逐場開出勝率(表面校正 Elo,
            跟 FiveThirtyEight、Tennis Abstract 同一套)。 <span className="text-bone">這不是盤口</span>。
          </p>

          {/* 🔴 誠實框架(本頁第一要務)— 校準不是準度 */}
          <div className="mt-5 border-l-2 border-gold/50 pl-4 text-mute text-[13px] sm:text-sm leading-relaxed max-w-2xl">
            <p>
              網球會<span className="text-bone">看起來比棒球準</span> —— 那不是我們變天才,是網球
              <span className="text-bone">本來就好預測</span>(一個人控制每一球、五盤三勝磨平運氣)。
              我們的考驗是<span className="text-gold">校準</span>:喊 70%,長期就該中 70%。
            </p>
          </div>

          {/* 覆蓋率誠實揭露 + 不硬開的紀律 */}
          <p className="mt-5 font-mono text-mute/60 text-[10px] tracking-[0.15em] leading-relaxed max-w-2xl">
            運彩在賣 <span className="text-bone tabular">{total}</span> 場 · 引擎開盤{" "}
            <span className="text-gold tabular">{lined}</span> 場。 認不出的球員、剛傷退復出排名失真的、
            進行中的,我們<span className="text-bone">誠實標出來、不開假盤</span> —— 賭場什麼都敢開,
            我們只開算得出的。 球員名稱用台灣運彩的。
          </p>
          <div className="mt-6 w-full h-px bg-line/60" />
        </section>

        {/* ── 真實賽程看板(依賽事分組)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
          <div className="space-y-10">
            {openGroups.map((g) => (
              <div key={`${g.tour}|${g.tournament}`}>
                <div className="flex items-baseline gap-3 mb-4 flex-wrap">
                  <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
                    {g.tournament}
                  </p>
                  <span className="font-mono text-mute/50 text-[9px] tracking-[0.2em]">
                    {g.tour.toUpperCase()} · {SURFACE_LABEL[g.surface] ?? g.surface} · {g.matches.length} 場
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {g.matches.map((m) => (
                    <TennisDrawCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 已完場 · 引擎逐場對帳(收起來 · 不擋上面可押的場)── */}
        {settledMatches.length > 0 && (
          <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
            <div className="flex items-baseline gap-3 mb-4 flex-wrap border-t border-line/50 pt-8">
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">已完場 · 引擎對帳</p>
              <span className="font-mono text-mute/50 text-[9px] tracking-[0.2em]">
                {settledMatches.length} 場 · 中沒中都掛
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {settledMatches.map((m) => (
                <TennisDrawCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        )}

        {/* ── 公開戰績:引擎 + 你(含輸 · 賽前鎖定 → 賽後對帳)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">
              引擎公開戰績 · 含輸
            </p>
            {eng.n > 0 ? (
              <p className="text-bone text-lg sm:text-xl font-light tracking-tight">
                <span className="text-gold tabular">{eng.rate}%</span> 準 ·{" "}
                <span className="text-gold tabular">✓{eng.hits}</span>{" "}
                <span className="text-loss tabular">✕{eng.misses}</span>
                <span className="text-mute/60 text-sm"> · {eng.n} 場已對帳</span>
                {eng.pending > 0 && (
                  <span className="text-mute/50 text-sm"> · {eng.pending} 場待結算</span>
                )}
              </p>
            ) : (
              <p className="text-mute text-sm leading-relaxed">
                引擎已對 <span className="text-bone tabular">{eng.pending}</span> 場開盤、賽前鎖死 ·
                <span className="text-bone"> 賽果建置中</span> —— 賽後逐場對帳,贏的輸的都會誠實掛在這。
                (網球賽果由我們手動 curate · 同棒球)
              </p>
            )}
            <p className="mt-2 font-mono text-mute/55 text-[9px] tracking-[0.12em] leading-snug">
              引擎當初看好哪邊、賽後中沒中 · 含輸照算 · 真正的尺是校準不是準度。
            </p>
          </div>
        </section>

        {/* 你的網球戰績(登入且押過才顯示 · client island · graceful) */}
        <TennisRecordCard
          results={results}
          enginePicks={enginePicks}
          wrapperClass="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8"
        />

        {/* ── 誰能捧盃 · 草地實力榜(奪冠熱門 · 與上方今日對戰分開)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8 pt-4 border-t border-line/50">
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-2">
            誰能捧盃 · 草地實力榜
          </h2>
          <p className="text-mute/70 text-[13px] leading-relaxed mb-6 max-w-2xl">
            上面是今天運彩在賣的場;這裡是引擎對<span className="text-bone">奪冠熱門</span>的草地戰力
            排序 —— 從公開排名 + 近年草地戰績種子化的<span className="text-bone">編輯估計值</span>
            (不是官方數據,隨真實賽果更新)。 引擎只看實力分:沒看臨場傷停 / 天氣 / 心理。
          </p>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">男單 · ATP</p>
              <div className="bg-slate/30 border border-line/60 px-4 sm:px-5">
                {atp.map((p, i) => (
                  <ContenderRow key={p.id} p={p} idx={i} />
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">女單 · WTA</p>
              <div className="bg-slate/30 border border-line/60 px-4 sm:px-5">
                {wta.map((p, i) => (
                  <ContenderRow key={p.id} p={p} idx={i} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 引擎方法 / 誠實註腳 ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6 max-w-2xl">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎怎麼算</p>
            <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
              每位球員一個由<span className="text-bone">現時世界排名換算</span>的實力分,加上表面校正,
              再用標準 Elo 邏輯函數算出兩人各自的勝率(每 400 分 ≈ 勝率 10 倍)。 純數學、攤得開、
              可重算 —— 沒有黑箱。 這是<span className="text-bone">排名換算的估計</span>,不是磨厚的
              戰績 Elo;隨真實賽果一場一場更新。
            </p>
            <p className="mt-3 text-mute/70 text-[12px] leading-relaxed">
              引擎只看排名:<span className="text-mute">沒看傷停、復出、臨場狀態</span> —— 那正是
              你的判斷比引擎值錢的地方(所以德雷珀、季米特洛夫這種剛復出的,我們不硬開)。
              我們不接受下注、不顯示盤口、不喊穩贏。 押注 / 收據 / 你 vs 引擎對帳 = 接著補上。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/calibration"
                className="font-mono text-gold/75 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
              >
                校準是什麼 · 喊 70% 真的中 70% 嗎 →
              </Link>
              <Link
                href="/soccer"
                className="font-mono text-mute/60 hover:text-gold text-[11px] tracking-[0.15em] underline-offset-4 hover:underline transition-colors"
              >
                看足球引擎開盤 →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
