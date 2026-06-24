import Link from "next/link";
import Nav from "@/components/Nav";
import SportTabs from "@/components/SportTabs";
import Footer from "@/components/Footer";
import Avatar from "@/components/Avatar";
import TennisMatchCard from "@/components/TennisMatchCard";
import { createPageMetadata } from "@/lib/page-og";
import { blendedRating } from "@/lib/tennis/engine";
import {
  grassContenders,
  getTennisPlayer,
  initials,
  type TennisPlayer,
  type TennisTier,
} from "@/lib/tennis/players";

// ── ZONE 27 · /tennis · 溫布頓 2026 草地引擎(網球 vertical v0.1 · 唯讀看板)──────
// 多運動覆蓋的下一塊:網球。 引擎 = 表面校正 Elo(Sackmann / FiveThirtyEight 業界標準)·
// 隔離在 lib/tennis(不碰棒球 / 足球)· 0 資料庫改動。 v0.1 = 草地實力榜 + 引擎示範對戰;
// 真正的對戰盤等 6/26 籤表出爐後逐場鎖定(同棒球 Tim 親手 curate)。 押注 / 收據 = Wave 2。
//
// 🔴 本頁第一要務 = 誠實框架:網球冷門少、熱門贏面高,引擎會喊八九成大熱門 —— 那不是我們
//   神準,是網球本來就好預測。 賣點是校準(喊 70% 真的中 70%),不是準度。 球員實力分是
//   公開排名 + 近況種子化的編輯估計(揭露)· 已剔除確定傷退者(阿爾卡拉斯 / 姆博科)。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "網球 · 草地引擎",
  description:
    "溫布頓 2026 · 我們自己的推演引擎用「表面校正 Elo」算出草地勝率 —— 不是盤口。 網球熱門贏面天生高,我們賣的是誠實校準不是神準:喊 70% 就該中 70%。 賽前鎖定、賽後對帳、不接受下注。",
  ogTitle: "網球 · 溫布頓草地引擎 · ZONE 27",
  ogDescription:
    "溫網 2026 · 引擎自己算的草地勝率 · 不是盤口 · 賣校準不賣神準",
  path: "/tennis",
});

// ISR · 1h(純讀種子分 · 無外部 fetch · 與其餘運動看板一致)。
export const revalidate = 3600;

const TIER_LABEL: Record<TennisTier, string> = {
  elite: "頂尖",
  strong: "強",
  solid: "穩",
  darkhorse: "黑馬",
};

// 顯示用的草地混合分(整數)· 與引擎算勝率用的同一個 blendedRating(零 drift)。
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
        <span className="block text-mute/65 text-[11px] leading-snug mt-0.5 truncate">
          {p.read}
        </span>
      </span>
      <span className="shrink-0 text-right">
        <span className="block font-mono text-gold text-base tabular leading-none">
          {grassRating(p)}
        </span>
        <span className="block font-mono text-mute/45 text-[8px] tracking-[0.2em] mt-1">
          草地戰力
        </span>
      </span>
    </div>
  );
}

function ContenderBoard({ title, players }: { title: string; players: TennisPlayer[] }) {
  return (
    <div>
      <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-2">{title}</p>
      <div className="bg-slate/30 border border-line/60 px-4 sm:px-5">
        {players.map((p, i) => (
          <ContenderRow key={p.id} p={p} idx={i} />
        ))}
      </div>
    </div>
  );
}

export default function TennisPage() {
  const atp = grassContenders("atp");
  const wta = grassContenders("wta");

  // 引擎示範對戰(草地實力分怎麼變成勝率)· 明確標「示範 · 非已排定對戰」· guard undefined。
  const sinner = getTennisPlayer("sinner");
  const djokovic = getTennisPlayer("djokovic");
  const rybakina = getTennisPlayer("rybakina");
  const sabalenka = getTennisPlayer("sabalenka");
  const menDemo = sinner && djokovic ? { a: sinner, b: djokovic } : null;
  const womenDemo = rybakina && sabalenka ? { a: rybakina, b: sabalenka } : null;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav active="tennis" />
      <SportTabs active="tennis" />

      <main id="main">
        {/* ── HEADER ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pt-16 pb-8">
          <div className="flex items-baseline gap-3 mb-3 flex-wrap">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">
              溫布頓 2026 · 草地引擎
            </p>
            <span className="font-mono text-gold/60 text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30">
              v0.1
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight">
            我們<span className="text-gold">自己算</span>的草地勝率
          </h1>
          <p className="mt-4 text-mute text-sm leading-relaxed max-w-2xl">
            這不是莊家的盤口 —— 是我們的引擎用<span className="text-bone">表面校正實力分(Elo)</span>
            自己算出來的草地勝率。 方法跟全世界在用的 FiveThirtyEight、Tennis Abstract 同一套,
            我們只是把它<span className="text-bone">攤開、對帳、連輸都認</span>。
          </p>

          {/* 🔴 誠實框架(本頁第一要務 · 防「看起來神準」誤讀)— 校準不是準度 */}
          <div className="mt-5 border-l-2 border-gold/50 pl-4 text-mute text-[13px] sm:text-sm leading-relaxed max-w-2xl">
            <p>
              網球會<span className="text-bone">看起來比棒球準</span> —— 但那不是我們突然變天才。
              是網球<span className="text-bone">本來就好預測</span>:一個人控制每一球、五盤三勝把運氣磨平、
              強弱差距大。 引擎會誠實喊出八九成的大熱門,因為它們<span className="text-bone">真的有八九成</span>。
            </p>
            <p className="mt-2">
              我們的考驗從來不是準度,是<span className="text-gold">校準</span>:喊 70%,長期就該中 70%,
              不是 85% 也不是 55%。 賽後我們會把每一手攤在校準圖上自己驗。
            </p>
          </div>

          {/* 現況誠實說明:籤表未出 + 傷退剔除(costly signal:不會上場的人我們不列) */}
          <p className="mt-5 font-mono text-mute/60 text-[10px] tracking-[0.15em] leading-relaxed max-w-2xl">
            溫網主賽 6/29 開打 · 籤表 6/26 出爐。 現在先給你草地實力榜 —— 對戰盤等籤表落地後
            逐場鎖定(同棒球:親手 curate、賽前鎖死、賽後對帳)。 頭號種子辛納衛冕、史瓦特克女單衛冕;
            阿爾卡拉斯(手腕)、姆博科(膝)傷退 —— 不會上場的人我們不列。
          </p>
          <div className="mt-6 w-full h-px bg-line/60" />
        </section>

        {/* ── 引擎示範對戰(草地實力分 → 勝率 · 明確標示範)── */}
        {(menDemo || womenDemo) && (
          <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-10">
            <div className="flex items-baseline gap-3 mb-2 flex-wrap">
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em]">引擎示範對戰</p>
            </div>
            <p className="text-mute/70 text-[13px] leading-relaxed mb-4 max-w-2xl">
              草地實力分怎麼變成勝率,直接看 —— <span className="text-bone">這不是已排定的對戰</span>,
              是引擎的示範。 真正的對戰盤等籤表出爐後逐場鎖定。
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {menDemo && (
                <TennisMatchCard
                  a={menDemo.a}
                  b={menDemo.b}
                  surface="grass"
                  label="示範 · 男單"
                  sublabel="草地 · 五盤三勝"
                />
              )}
              {womenDemo && (
                <TennisMatchCard
                  a={womenDemo.a}
                  b={womenDemo.b}
                  surface="grass"
                  label="示範 · 女單"
                  sublabel="草地 · 三盤兩勝"
                />
              )}
            </div>
          </section>
        )}

        {/* ── 草地實力榜(我們的種子分 · 編輯估計 · 隨戰績更新)── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-8">
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-2">
            草地實力榜
          </h2>
          <p className="text-mute/70 text-[13px] leading-relaxed mb-6 max-w-2xl">
            這是引擎的<span className="text-bone">草地戰力分</span>排序 —— 從公開世界排名 + 近年草地
            戰績種子化的<span className="text-bone">編輯估計值</span>(不是官方數據,會隨溫網真實賽果一場
            一場更新)。 引擎只看實力分:<span className="text-bone">沒看臨場傷停 / 天氣 / 心理</span>
            —— 那是你的判斷比引擎值錢的地方。
          </p>
          <div className="grid gap-8 lg:grid-cols-2">
            <ContenderBoard title="男單 · ATP" players={atp} />
            <ContenderBoard title="女單 · WTA" players={wta} />
          </div>
        </section>

        {/* ── 引擎方法 / 誠實註腳 ── */}
        <section className="mx-auto max-w-6xl w-full px-6 sm:px-10 pb-24">
          <div className="bg-slate/30 border border-line/60 p-5 sm:p-6 max-w-2xl">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">引擎怎麼算</p>
            <p className="text-mute text-[13px] sm:text-sm leading-relaxed">
              每位球員一個<span className="text-bone">總分</span>加一個<span className="text-bone">草地分</span>,
              對戰時把兩者各半混合,再用標準 Elo 邏輯函數算出兩人各自的勝率(每 400 分 ≈ 勝率 10 倍)。
              草地分高於總分 = 該球員草地相對更強(大發球手);低於 = 草地相對弱(紅土型)。
              全程純數學、攤得開、可重算 —— 沒有黑箱。
            </p>
            <p className="mt-3 text-mute/70 text-[12px] leading-relaxed">
              v0.1 先開草地實力榜與示範對戰;對戰盤、賽前鎖定、可外傳收據、你 vs 引擎的對帳,
              接著補上。 我們<span className="text-mute">不接受下注、不顯示盤口、不喊穩贏</span>。
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
