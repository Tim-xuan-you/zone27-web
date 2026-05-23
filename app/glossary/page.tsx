import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import { createPageMetadata } from "@/lib/page-og";

export const metadata = createPageMetadata({
  title: "Glossary — 27 種棒球進階數據 + 5 個 Z27 LEXICON",
  description:
    "為什麼 K/9 比三振次數重要?WHIP 為什麼是投手的金線?27 個你必須懂的進階指標 + 5 個 ZONE 27 自創 LEXICON · 白話拆解 · CPBL 看球必備辭典。",
  ogTitle: "Glossary · 27 industry stats + 5 Z27 LEXICON · ZONE 27",
  ogDescription:
    "27 個進階數據 + 5 個 ZONE 27 自創 LEXICON · CPBL 看球必備辭典 · 白話拆解",
  path: "/glossary",
});

type Stat = {
  abbr: string;
  enFull: string;
  zh: string;
  body: string;
  /** 聯盟均值 / 頂級數值對照 */
  bench?: string;
  /** ZONE 27 視角:這個指標如何影響我們的 AI 模型 */
  note?: string;
};

const PITCHING: Stat[] = [
  {
    abbr: "ERA",
    enFull: "Earned Run Average",
    zh: "防禦率",
    body: "投手每 9 局所失自責分。最古老也最常被引用的投手指標,但因為失分受守備、運氣影響,單獨看會誤判實力。",
    bench: "League: ~4.30 · Elite: <3.00",
    note: "ZONE 27 把 ERA 當成排序工具,但模型實際信任 K/9 + BB/9 + HR/9。",
  },
  {
    abbr: "WHIP",
    enFull: "Walks + Hits per Inning Pitched",
    zh: "每局獲准上壘",
    body: "投手每一局讓多少打者上壘(被安打 + 保送)。比 ERA 更純粹反映投手控制力。",
    bench: "League: ~1.30 · Elite: <1.05",
  },
  {
    abbr: "K/9",
    enFull: "Strikeouts per 9 Innings",
    zh: "每九局三振率",
    body: "投手 9 局能拿下多少三振。直接反映壓制力,是 ZONE 27 Lab 引擎的核心參數。",
    bench: "League: ~8.5 · Elite: >10.0",
    note: "Lab v0.2 用 K/9 ÷ 38 推導每打席被三振的機率。",
  },
  {
    abbr: "BB/9",
    enFull: "Walks per 9 Innings",
    zh: "每九局保送率",
    body: "投手 9 局送出多少四壞。低 = 控球好;高 = 容易爆炸。",
    bench: "League: ~3.0 · Elite: <2.0",
    note: "影響 Lab 模擬中保送與滿壘保送強制得分的頻率。",
  },
  {
    abbr: "HR/9",
    enFull: "Home Runs per 9 Innings",
    zh: "每九局被全壘打數",
    body: "投手 9 局被打多少 HR。被一發解決,還是壘上有人時被掃光,差很多。",
    bench: "League: ~1.0 · Elite: <0.7",
    note: "HR 在 Lab 模擬中能瞬間清空壘上,影響爆炸性失分。",
  },
  {
    abbr: "K/BB",
    enFull: "Strikeout-to-Walk Ratio",
    zh: "三振保送比",
    body: "拿到一個三振要送幾個保送。最簡潔反映「投手品質 vs 控球品質」的單一指標。",
    bench: "League: ~2.8 · Elite: >5.0",
  },
  {
    abbr: "FIP",
    enFull: "Fielding Independent Pitching",
    zh: "投手獨立防禦率",
    body: "只看投手能控制的事:三振、保送、全壘打。把守備與運氣從 ERA 中剝離後的真實實力。",
    bench: "League: ~4.30 · Elite: <3.20",
  },
  {
    abbr: "xERA",
    enFull: "Expected ERA",
    zh: "期望防禦率",
    body: "用擊球初速 + 角度推算「應該被打成怎樣」,而不是「實際被打成怎樣」。剝除運氣後的真實 ERA。",
    bench: "League: ~4.30 · Elite: <3.20",
  },
  {
    abbr: "ERA+",
    enFull: "ERA Plus (Adjusted ERA)",
    zh: "標準化防禦率",
    body: "把 ERA 標準化為 100 = 聯盟均值。120 = 比平均好 20%;80 = 比平均差 20%。可跨年代比較。",
    bench: "Average: 100 · Elite: >130",
  },
  {
    abbr: "xFIP",
    enFull: "Expected FIP",
    zh: "期望 FIP",
    body: "FIP 的變體,把 HR/9 用聯盟均值代替(因為 HR/FB 率波動很大)。預測明年 FIP 比今年 FIP 還準。",
    bench: "League: ~4.30 · Elite: <3.50",
  },
];

const BATTING: Stat[] = [
  {
    abbr: "AVG",
    enFull: "Batting Average",
    zh: "打擊率",
    body: "安打 ÷ 打數。最古老的打擊指標,但忽略保送與長打。0.300 在棒球文化中是分水嶺。",
    bench: "League: ~.260 · Elite: >.300",
  },
  {
    abbr: "OBP",
    enFull: "On-Base Percentage",
    zh: "上壘率",
    body: "(安打+保送+觸身) ÷ 打席。比 AVG 更準確反映打者的進攻價值。Moneyball 就是靠這個翻身。",
    bench: "League: ~.330 · Elite: >.380",
  },
  {
    abbr: "SLG",
    enFull: "Slugging Percentage",
    zh: "長打率",
    body: "壘打數 ÷ 打數。1 壘安打 = 1 壘打數,HR = 4 壘打數。反映打者的火力。",
    bench: "League: ~.420 · Elite: >.500",
  },
  {
    abbr: "OPS",
    enFull: "On-Base Plus Slugging",
    zh: "上壘加長打率",
    body: "OBP + SLG。用一個數字粗略反映打者的綜合進攻價值。早期 Sabermetrics 的革命指標。",
    bench: "League: ~.750 · Elite: >.900",
  },
  {
    abbr: "OPS+",
    enFull: "OPS Plus",
    zh: "標準化 OPS",
    body: "把 OPS 標準化為 100 = 聯盟均值。150 = 比平均好 50%。可跨年代比較。",
    bench: "Average: 100 · Elite: >140",
  },
  {
    abbr: "ISO",
    enFull: "Isolated Power",
    zh: "純長打率",
    body: "SLG - AVG。打者「除了打安打,還有多少額外火力」的指標。HR-heavy 打者 ISO 會很高。",
    bench: "League: ~.160 · Elite: >.230",
  },
  {
    abbr: "BABIP",
    enFull: "Batting Average on Balls in Play",
    zh: "場內安打率",
    body: "排除 HR 與三振後,「球被打進場內變成安打的比率」。極高或極低代表運氣成分。",
    bench: "League: ~.300 · 異常: <.250 或 >.350",
  },
  {
    abbr: "wOBA",
    enFull: "Weighted On-Base Average",
    zh: "加權上壘率",
    body: "OPS 的進化版。給保送、單打、二壘安打、HR 各自不同權重,加總後用 OBP 量綱表達。最準確的單數字打擊指標之一。",
    bench: "League: ~.320 · Elite: >.380",
  },
  {
    abbr: "wRC+",
    enFull: "Weighted Runs Created Plus",
    zh: "加權創造分數+",
    body: "把 wOBA 換算成「比聯盟平均創造多少分」並標準化。100 = 平均;150 = 多創造 50% 的分數。",
    bench: "Average: 100 · Elite: >140",
  },
  {
    abbr: "K%",
    enFull: "Strikeout Rate",
    zh: "三振率",
    body: "打者被三振的百分比。揮空多 = 被識破的速度快。低 K% 通常代表選球功夫。",
    bench: "League: ~22% · Elite: <18%",
  },
];

// ── ZONE 27 自有詞彙(Round 13 新增) ──────────────
// Defines terms ZONE 27 coined or specifically uses with our own
// semantic loading. These are NOT industry-standard sabermetrics
// (those live in PITCHING / BATTING / ADVANCED above) — these are
// the words our trust artifacts depend on, defined here so the
// vocabulary is owned. Visitors arguing using OUR terms market
// the brand for free (FanGraphs pattern · "the site that owns
// vocabulary owns the discourse").
//
// Brand IP per [[zone27-disclosure-philosophy]]: every term cited
// across /audit · /methodology · /track-record · /matches/[gameId]
// has a canonical definition here · no hidden vocabulary.
const Z27_LEXICON: Stat[] = [
  {
    abbr: "PROVED",
    enFull: "Engine Verdict · Favorite Won",
    zh: "引擎言中",
    body: "賽前引擎指向的 favorite(winRate > 50%)在實際比賽中獲勝。記入 /track-record ledger 一行,gold 標記。51% PROVED 仍是 PROVED,但 ledger 會顯示「僅 51%→WIN」讓視覺權重誠實反映 confidence。",
    bench: "視覺權重等同 DIVERGED · 不過濾、不修飾、不重新加權",
    note: "Calibration verdict 三種之一(其他:DIVERGED · PUSH)。",
  },
  {
    abbr: "DIVERGED",
    enFull: "Engine Verdict · Favorite Lost",
    zh: "引擎落空",
    body: "賽前引擎指向的 favorite 在實際比賽中輸了。等大等亮列入 /track-record · loss color 標記 · 永遠不刪。引擎方向落空是品牌 IP 的物理產出 — 不藏 miss 是 disclosure philosophy 的具體 demonstration。",
    bench: "視覺權重等同 PROVED · 不藏不修飾",
    note: "/track-record 存在的核心理由 · 「方法公開」物理證據。",
  },
  {
    abbr: "PUSH",
    enFull: "Engine Verdict · Tie or No Favorite",
    zh: "平手或無 favorite",
    body: "兩種情境:(a) 實際比賽平局(罕見;CPBL/MLB 鮮少出現)(b) 引擎輸出剛好 50/50,無 favorite 可驗證。Mute color 標記,不算 PROVED 也不算 DIVERGED — verdict 二元 binary 之外的第三狀態。",
    bench: "罕見 · 視覺權重最低",
  },
  {
    abbr: "SAMPLE DEBT",
    enFull: "Sample Size Below Statistical Threshold",
    zh: "樣本債",
    body: "ZONE 27 自有詞彙。N < 30 時,PROVED rate 受 sample bias 影響大,任何百分比皆需打折判讀。/track-record 顯示「樣本債警告」直到累積 N≥30。這個詞框住「我們知道我們的樣本還不夠 — 但會誠實計數累進」的承諾,而非藏 metric 直到 statistically safe 才公開。",
    bench: "解除門檻 · N ≥ 30",
    note: "Bill James 1985 sabermetrics 文化 · 從不掩飾樣本不足。",
  },
  {
    abbr: "RECEIPT",
    enFull: "Final Score Ingestion · Engine Receipt",
    zh: "引擎收據",
    body: "賽後實際比分被 Tim 親手截圖 + 寫入 lib/matches.ts finalResult · 觸發 /track-record ledger 新增一行 + /matches/[gameId] 顯示 ENGINE RECEIPT 區塊 + HeroLiveCard badge 切換為 PROVED/DIVERGED。完整流程詳見 docs/MANUAL-ONBOARDING.md FINAL SCORE INGEST 5-step。",
    bench: "Tim 一人手工 · 不外包 · 不自動化(per coverage philosophy)",
    note: "/track-record 物理產出 · 每場一張 receipt。",
  },
];

const ADVANCED: Stat[] = [
  {
    abbr: "WAR",
    enFull: "Wins Above Replacement",
    zh: "球員綜合價值",
    body: "如果用一個「板凳替補」取代這個球員,球隊一年會少贏幾場。終極比較尺。",
    bench: "Starter: ~2 · All-Star: >4 · MVP: >7",
  },
  {
    abbr: "PR",
    enFull: "Plate Discipline",
    zh: "本壘板紀律",
    body: "打者在好球帶內外的揮棒選擇 — Swing% · Chase% · Contact% · Whiff% 四維。MLB Statcast 完整公開,CPBL 目前未公開此維度。",
    note: "Lab 路線圖:當 CPBL 開始公開 PR 資料 → 接入打席結果機率矩陣。",
  },
  {
    abbr: "EV",
    enFull: "Exit Velocity",
    zh: "擊球初速",
    body: "球離開球棒的瞬間速度。> 95 mph 視為「強擊」,跟長打率高度相關。",
    bench: "League: ~88 mph · Elite avg: >92 mph",
  },
  {
    abbr: "LA",
    enFull: "Launch Angle",
    zh: "擊球角度",
    body: "球離開球棒的垂直角度。HR 甜蜜區在 25°-35°,過低變滾地、過高變高飛。",
    bench: "HR sweet spot: 25°-35°",
  },
  {
    abbr: "Spin",
    enFull: "Spin Rate",
    zh: "球路轉速",
    body: "投手球路的轉數(rpm)。直球轉速高 = 看起來會浮起來,變化球轉速影響落差。MLB Statcast 提供;CPBL 暫未公開。",
    bench: "Fastball avg: ~2,300 rpm · Elite: >2,500",
    note: "Lab 路線圖(aspirational):加入投手機率推導 — 待 CPBL 公開資料時上路。",
  },
  {
    abbr: "Barrel%",
    enFull: "Barrel Percentage",
    zh: "完美擊球率",
    body: "EV + LA 同時落在最佳區間的擊球比率。Barrel 一打中,期望打擊率超過 .500,長打率超過 1.500。",
    bench: "League: ~7% · Elite: >12%",
  },
  {
    abbr: "Pythag",
    enFull: "Pythagorean Win %",
    zh: "Pythagorean 期望勝率",
    body: "Bill James 公式 · 勝率 = 得分² / (得分² + 失分²)。預期勝率 vs 實際勝率落差大,代表有運氣成分。",
    note: "Lab 引擎輸出可與此公式對照(目前 reader 自行對照,未自動嵌入)。",
  },
];

const ALL_GROUPS = [
  { key: "pitching", label: "PITCHING", zh: "投手", stats: PITCHING },
  { key: "batting", label: "BATTING", zh: "打者", stats: BATTING },
  { key: "advanced", label: "ADVANCED · STATCAST", zh: "進階指標", stats: ADVANCED },
  // Round 13 brand-IP amplification (Agent A #4 · FanGraphs glossary moat
  // pattern): proprietary terms get their own group at the bottom · doesn't
  // touch the "27 種" branding (industry stats stay at 27) · gives ZONE 27-
  // coined vocabulary a canonical home. Fans arguing using OUR words market
  // the brand for free.
  {
    key: "z27-lexicon",
    label: "Z27 LEXICON",
    zh: "ZONE 27 自有詞彙",
    stats: Z27_LEXICON,
  },
] as const;

export default function GlossaryPage() {
  // Industry stats (27) intentionally separate from Z27 LEXICON so the
  // "27 種" branding stays integer-perfect. Lexicon is additive,
  // appears as 4th group below, not in the headline count.
  const industryTotal = PITCHING.length + BATTING.length + ADVANCED.length;
  const z27Total = Z27_LEXICON.length;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12 text-center">
        <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
          GLOSSARY · {industryTotal} STATS + {z27Total} Z27 LEXICON
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-light leading-[1.1] tracking-tight text-bone">
          <span className="text-gold tabular">27</span>{" "}
          種你必須懂的
          <br />
          進階棒球數據
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-mute leading-relaxed">
          為什麼 K/9 比三振次數重要?WHIP 為什麼是投手的金線?
          每個進階指標都用白話拆解,並附上聯盟平均與頂級數值對照。
        </p>
        <p className="mt-4 max-w-xl mx-auto font-mono text-gold/70 text-[10px] tracking-[0.3em]">
          27 STATS · 27 OUTS · 27 IS THE LANGUAGE OF PRECISION
        </p>
        <p className="mt-5 max-w-xl mx-auto font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
          + {z27Total} 個 ZONE 27 自有詞彙(PROVED · DIVERGED · PUSH · SAMPLE DEBT · RECEIPT)
          <span className="block mt-1">
            <a href="#z27-lexicon" className="text-gold hover:underline">
              直接跳到 Z27 LEXICON →
            </a>
          </span>
        </p>
      </section>

      <div className="mx-auto w-32 gold-line mb-12" />

      {/* ── TABLE OF CONTENTS ────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
        <div className="grid sm:grid-cols-3 gap-4">
          {ALL_GROUPS.map((g) => (
            <a
              key={g.key}
              href={`#${g.key}`}
              className="block p-5 border border-line/70 hover:border-gold/60 transition-colors group"
            >
              <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mb-2 group-hover:text-gold transition-colors">
                {g.label}
              </p>
              <p className="text-bone text-base font-light tracking-tight">
                {g.zh}
              </p>
              <p className="font-mono text-mute text-xs tabular mt-2">
                {g.stats.length} 個指標 →
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* ── GROUPS ───────────────────────────────── */}
      {ALL_GROUPS.map((g, gi) => (
        <section
          key={g.key}
          id={g.key}
          className={`mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 pt-10 scroll-mt-20 ${
            gi > 0 ? "border-t border-line/40" : ""
          }`}
        >
          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-mono text-gold/70 text-[10px] tracking-[0.35em]">
              / {String(gi + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-mute text-[10px] tracking-[0.35em]">
              {g.label}
            </span>
          </div>
          <h2 className="text-3xl text-bone font-light tracking-tight mb-2">
            {g.zh}
          </h2>
          <p className="font-mono text-mute text-xs tracking-[0.25em] mb-10">
            {g.stats.length} STATS
          </p>

          <div className="space-y-8">
            {g.stats.map((s) => (
              <StatEntry key={s.abbr} stat={s} />
            ))}
          </div>
        </section>
      ))}

      <RelatedReading currentPath="/glossary" />

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          NOW YOU READ THE NUMBERS.
        </p>
        <h3 className="text-3xl text-bone font-light tracking-tight">
          回到 Lab 親手跑一場
        </h3>
        <Link
          href="/lab"
          className="inline-block mt-10 px-12 py-4 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors font-medium"
        >
          進入實驗室 →
        </Link>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// Convert "K/9" → "k-9", "OPS+" → "ops-plus", "wRC+" → "wrc-plus", "K%" → "k-pct"
// for use as URL anchors that match lib/stat-definitions.ts slugs.
function anchorize(abbr: string): string {
  return abbr
    .toLowerCase()
    .replace(/%/g, "-pct")
    .replace(/\+/g, "-plus")
    .replace(/\//g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Sub-component: single stat card ────────────────────
function StatEntry({ stat }: { stat: Stat }) {
  return (
    <div
      id={anchorize(stat.abbr)}
      className="border-l-2 border-gold/30 pl-5 sm:pl-6 py-1 scroll-mt-24"
    >
      <div className="flex items-baseline flex-wrap gap-3 mb-2">
        <span className="font-mono text-gold tabular text-2xl tracking-tight">
          {stat.abbr}
        </span>
        <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
          {stat.enFull}
        </span>
      </div>
      <h3 className="text-xl text-bone font-light tracking-tight mb-3">
        {stat.zh}
      </h3>
      <p className="text-mute text-sm sm:text-base leading-relaxed mb-3">
        {stat.body}
      </p>
      {stat.bench && (
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.25em] tabular mb-1">
          ▸ {stat.bench}
        </p>
      )}
      {stat.note && (
        <p className="text-mute/70 text-xs italic mt-2">
          ZONE 27 視角:{stat.note}
        </p>
      )}
    </div>
  );
}
