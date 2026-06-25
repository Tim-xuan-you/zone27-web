import Link from "next/link";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import TennisDrawCard from "@/components/TennisDrawCard";
import TennisRecordCard from "@/components/TennisRecordCard";
import TrackRecordStrip from "@/components/TrackRecordStrip";
import { createPageMetadata } from "@/lib/page-og";
import { blendedRating } from "@/lib/tennis/engine";
import {
  drawGroups,
  drawCounts,
  gradeTennisEngine,
  tennisResults,
  tennisEnginePicks,
  matchStartISO,
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

// ISR · 10 分鐘(純讀 curate 資料 · 無外部 fetch · 便宜)。 比其餘看板短:這是即時押注板 + 上方
//   「現在能押」用開賽時戳 vs 現在篩(見 isOpenForBet)→ 短 revalidate 讓「開打就下架」夠即時。
export const revalidate = 600;

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
      <span className="w-5 shrink-0 font-mono text-mute/80 text-[11px] tabular text-right">
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
        <span className="block font-mono text-mute/80 text-[8px] tracking-[0.2em] mt-1">草地戰力</span>
      </span>
    </div>
  );
}

export default function TennisPage() {
  const groups = drawGroups();
  // 🔴 兩態看板(R263 · 跟棒球/足球板一致:板上只擺「還能動作的場」)· 對應旅程「決定 → 看球」:
  //     ① 可押(賽前):還沒結算 + 還沒開打 → 上方,能鎖一手。
  //     ② 進行中(賽事進行中):還沒結算 + 已開打(或沒精確時戳的非結算場)→ 中間,賽前已封盤、
  //        但卡留著當「直播參考」(球員 + 引擎賽前判讀 + 你鎖的那手)· 比賽進行中正是最投入的時刻,
  //        這時抽掉卡 = 在高潮把舞台撤了。
  //     ③ 已完場 → 不留在板上(= 收據):掉出板,收進下方戰績條 → /track-record#tennis + /tennis/[id] 永久頁。
  // Server Component 逐請求讀現在時刻來分板(可押/進行中/掉出)· 刻意不 memo(每次 render 要新鮮時刻)
  //   → React Compiler 的 purity 規則對 server 端 request-time 讀取是誤報,明確標註豁免。
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  // 🔴 「進行中」有上限(R265):一場網球頂多打 ~5 小時,給 12h 寬限吸收延賽/晚開。 開打超過 12h
  //   還沒結算的場 = 不可能還在打 —— 多半是引擎/ESPN 認不出的場(溫網會外賽 Roehampton / 挑戰賽),
  //   官方賽果鏡像永遠補不到。 這種場若一直留在「進行中 · 賽事進行中」= 板上對著兩天前打完的球喊「直播中」,
  //   正好戳破誠實。 超過窗口仍沒結算 → 跟「已完場」一樣掉出板(不假裝直播);要對帳 Tim 賽後手 curate。
  const IN_PLAY_WINDOW_MS = 12 * 60 * 60 * 1000;
  type TMatch = (typeof groups)[number]["matches"][number];
  // 還沒開打(有明確未來開賽時戳)→ 可押(賽前)。 沒精確時戳的非結算場不算「賽前」(歸進行中/待對帳)。
  const isUpcoming = (m: TMatch) => {
    if (m.finalResult) return false;
    const iso = matchStartISO(m);
    if (!iso) return false;
    const t = Date.parse(iso);
    return !Number.isNaN(t) && t > now;
  };
  const inPlay = (m: TMatch) => {
    if (m.finalResult) return false;
    const iso = matchStartISO(m);
    if (!iso) return true; // 沒精確開賽時戳的非結算場 → 當「進行中/待對帳」(不消失 · 走地可參考)
    const t = Date.parse(iso);
    if (Number.isNaN(t)) return true;
    if (t > now) return false; // 還沒開打 → 可押(openGroups)
    return now - t <= IN_PLAY_WINDOW_MS; // 開打後 12h 內 = 進行中;超過仍沒結算 → 掉出板,不再假裝直播中
  };
  const openGroups = groups
    .map((g) => ({ ...g, matches: g.matches.filter(isUpcoming) }))
    .filter((g) => g.matches.length > 0);
  const liveMatches = groups.flatMap((g) => g.matches.filter(inPlay));
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
            <span className="text-bone">排名換算的實力分</span>逐場開出勝率。 <span className="text-bone">這不是盤口</span>。
          </p>

          {/* 🔴 誠實框架(本頁第一要務 · 防「看起來準=神準」誤讀)· R263 板上一句帶過 · 細節 → /engines#tennis */}
          <div className="mt-5 border-l-2 border-gold/50 pl-4 text-mute text-[13px] sm:text-sm leading-relaxed max-w-2xl">
            <p>
              網球<span className="text-bone">看起來準是因為好預測、不是神準</span> —— 真正的尺是<span className="text-gold">校準</span>。{" "}
              <Link href="/engines#tennis" className="text-gold/80 hover:text-gold underline-offset-4 hover:underline">
                怎麼算、活校準曲線 →
              </Link>
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

        {/* ── 進行中 · 賽事進行中(賽前已封盤 · 卡留著當直播參考 · 別在最投入時抽掉舞台)── */}
        {liveMatches.length > 0 && (
          <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
            <div className="flex items-baseline gap-3 mb-4 flex-wrap border-t border-line/50 pt-8">
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">進行中 · 賽事進行中</p>
              <span className="font-mono text-mute/50 text-[9px] tracking-[0.2em]">
                {liveMatches.length} 場 · 賽前已封盤 · 比賽中可參考 · 結算後進「已完場」
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {liveMatches.map((m) => (
                <TennisDrawCard key={m.id} match={m} />
              ))}
            </div>
          </section>
        )}

        {/* ── 已完場 → 不堆在板上(R263 · 跟棒球/足球一致:板 = 還能押 / 進行中;打完的是收據)──
            Tim「剩網球沒處理」:棒球板 settled 直接掉出(→ /track-record + permalink)、足球板只列未開賽 ·
            唯獨網球板原本還堆一整排「已完場」graveyard = 同一個「整本帳本上板」的毛病。 打完的場 =
            引擎收據 · 一律收進下方一行戰績條 → /track-record#tennis 逐場帳本 + 各場 /tennis/[id] 永久頁。
            Polymarket:看板擺還能動作的盤、不擺墳場。 */}

        {/* ── 公開戰績:引擎(glance strip → /track-record#tennis · 跟 /matches /soccer 同款同位)──
            R263 · 板上不再放整段帳本(那段= /track-record 網球頁的 TennisEngineRecord 同一份)·
            一行 chip 點進 /track-record 看完整逐場 · 全站三本帳一個家、各板一行 chip。 */}
        <TrackRecordStrip
          hits={eng.hits}
          misses={eng.misses}
          pending={eng.pending}
          href="/track-record#tennis"
          caption="網球熱門贏面天生高 · 看起來準是因為好預測,不是神準 —— 真正的尺是校準。"
        />

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

        {/* ── 引擎方法(一行 + 連進 /engines)· 誠實註腳 ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6 max-w-2xl">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎怎麼算</p>
            <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
              排名換算的實力分 + 表面校正 + 標準 Elo —— 純數學、攤得開、可重算。{" "}
              <Link
                href="/engines#tennis"
                className="text-gold underline-offset-4 hover:underline"
              >
                完整公式 + 活校準曲線在 /engines →
              </Link>
            </p>
            <p className="mt-3 text-mute/70 text-[12px] leading-relaxed">
              引擎只看排名:<span className="text-mute">沒看傷停、復出、臨場狀態</span> —— 那正是
              你的判斷比引擎值錢的地方(所以剛復出的我們不硬開)。 我們不接受下注、不顯示盤口、不喊穩贏。
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
