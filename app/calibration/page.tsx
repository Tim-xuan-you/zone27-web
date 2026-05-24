import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import ReproducibilityReceipt from "@/components/ReproducibilityReceipt";
import AnonCalibrationStrip from "@/components/AnonCalibrationStrip";
import { getFinalizedMatches, type Match } from "@/lib/matches";

export const metadata: Metadata = {
  title: "Checking Our Work · ZONE 27 engine self-grading",
  description:
    "FiveThirtyEight 「Checking Our Work」 pattern · ZONE 27 引擎自評。 引擎賽前 say X% · 賽後 actual win-rate Y% · Brier score + reliability diagram + coin-flip baseline 對照。 玩運彩+報馬仔 永遠 ship 不出來這頁 · 因為一 publish 等於暴露 50-52% realized rate vs 94% stated「勝率」。 brand IP「方法公開」 物理 highest signal。",
};

// ── ZONE 27 · /calibration ──────────────────────────────
// Round 39 W-A · Agent A R38 DEEPEST sharp call ship · 從 R38 deferred
// list 取出 · per [[feedback-no-waiting-rule]] 鐵律「不等 Q3 · 任何現在
// 能做就做」。
//
// FiveThirtyEight「Checking Our Work」 pattern · public engine self-
// grading page · 不 gated · 不需 login · 任何 visitor 都看得到。
//
// 跟 /member/calibration 的差別:
//   - /member/calibration · personal mode (登入後 follow filter) ·
//     epistemic mirror framing · 您自己的 drift
//   - /calibration · public · ENGINE self-grading framing · ALL ZONE 27
//     公開 predictions · Brier score(NEW)· coin-flip baseline 對照(NEW)·
//     founder voice opening
//
// Brier score 公式 · Tetlock currency:
//   B = (1/N) Σ (forecast_probability - outcome)²
//   · outcome = 1 if favorite won · 0 if upset
//   · 0 = perfect · 0.25 = coin-flip baseline · 1 = perfectly wrong
//
// brand IP 物理 codify:
//   - displacement battle 對 玩運彩+報馬仔 fought on **realized outputs** ·
//     不是 static trust claims。 first-mover advantage 永久。
//   - 玩運彩 / 報馬仔 / FanGraphs / Pinnacle / Action Network 都從不公布
//     calibration · 因為公布等於 expose 50-52% realized rate vs 94%
//     stated「勝率」。 structurally 不可 copy。
//   - Tetlock 證明(Brier score 論文 2014-2018)「outcome accountability
//     alone improves forecaster accuracy by ~25%」 · 不只 marketing artifact ·
//     是 engine-improvement forcing function。
//
// Pratfall + Costly Signaling + Disclosure 三 axiom 同時 fire:
//   - Pratfall · 公開 over-confidence delta · 「我們欠你的差距」
//   - Costly Signaling · structurally non-copyable by tipster sites
//   - Disclosure · 延伸 /audit 公開 model → 公開 model accuracy 物理
//
// Routing: /calibration · public · 35th visitor-discoverable route。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // re-evaluate daily · /track-record cadence

type Bin = {
  centerPct: number;
  count: number;
  favoriteActualPct: number; // 0-100
};

// Bin finalized matches by engine probability on favorite(10-wide bins)。
// Center positions: 5, 15, ..., 95(10-wide bins from 0-10, 10-20, ..., 90-100)。
function computeBins(finalized: Match[]): Bin[] {
  const buckets: Map<number, { favoriteWins: number; total: number }> = new Map();

  for (const m of finalized) {
    if (!m.finalResult) continue;
    const fr = m.finalResult;
    const enginePctFav = Math.max(m.home.winRate, m.away.winRate);
    if (enginePctFav < 50) continue;
    const binIndex = Math.min(Math.floor(enginePctFav / 10), 9);
    const centerPct = binIndex * 10 + 5;

    const homeFav = m.home.winRate >= m.away.winRate;
    const favoriteWon =
      (homeFav && fr.winner === "home") || (!homeFav && fr.winner === "away");

    if (!buckets.has(centerPct))
      buckets.set(centerPct, { favoriteWins: 0, total: 0 });
    const b = buckets.get(centerPct)!;
    b.total++;
    if (favoriteWon) b.favoriteWins++;
  }

  return Array.from(buckets.entries())
    .map(
      ([centerPct, { favoriteWins, total }]): Bin => ({
        centerPct,
        count: total,
        favoriteActualPct: (favoriteWins / total) * 100,
      })
    )
    .sort((a, b) => a.centerPct - b.centerPct);
}

// ── Brier score · Tetlock currency · NEW in /calibration ────
// 0 = perfect · 0.25 = coin-flip baseline · 1 = perfectly wrong
// 對 engine performance 比 win-rate 更 informative · 因為 win-rate
// 不考慮 confidence level · Brier penalizes over-confidence。
function computeBrierScore(finalized: Match[]): number | null {
  if (finalized.length === 0) return null;

  let sumSquaredError = 0;
  let n = 0;

  for (const m of finalized) {
    if (!m.finalResult) continue;
    const fr = m.finalResult;
    const homeFav = m.home.winRate >= m.away.winRate;
    const engineFavProb = Math.max(m.home.winRate, m.away.winRate) / 100;
    const favoriteWon =
      (homeFav && fr.winner === "home") || (!homeFav && fr.winner === "away");
    const outcome = favoriteWon ? 1 : 0;
    sumSquaredError += (engineFavProb - outcome) ** 2;
    n++;
  }

  return n > 0 ? sumSquaredError / n : null;
}

const COIN_FLIP_BRIER = 0.25;

export default function CalibrationPublicPage() {
  const finalized = getFinalizedMatches();
  const n = finalized.length;
  const bins = computeBins(finalized);
  const brier = computeBrierScore(finalized);

  // Brier verdict band(only meaningful at N>=30)
  let brierVerdict: "better-than-coin-flip" | "coin-flip-tier" | "worse" | null = null;
  if (brier !== null && n >= 30) {
    if (brier < COIN_FLIP_BRIER - 0.01) brierVerdict = "better-than-coin-flip";
    else if (brier < COIN_FLIP_BRIER + 0.01) brierVerdict = "coin-flip-tier";
    else brierVerdict = "worse";
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / CHECKING OUR WORK · 引擎自評公開
            </p>
            <span
              lang="en"
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                n === 0
                  ? "border-gold/60 text-gold shimmer glow-gold"
                  : "border-gold/60 text-gold"
              }`}
              title={`${n} 場 finalized · git commit 為 source of truth`}
            >
              {n === 0 ? "WAITING · N=0" : `ENGINE · N=${n}`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl leading-[1.1]">
            我們的引擎{" "}
            <span className="text-gold">在說 70%</span> 的時候 ·
            <br className="hidden sm:inline" /> 實際上贏多少?
          </h1>

          {/* Founder voice opening · Tim 親手姿態 · NOT institutional voice */}
          <div className="mt-8 border-l-2 border-gold/60 pl-5 sm:pl-6 py-2 max-w-2xl">
            <p className="text-bone text-lg sm:text-xl leading-relaxed">
              <strong>每個高端 sports 分析平台都告訴您 model 多準</strong>{" "}
              · 沒有一家告訴您「say 70% 時實際贏 67%」的{" "}
              <span className="text-gold">3% over-confidence delta</span> ·
              因為公布等於暴露。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              ZONE 27 公開。 這頁的數字 · 是我們欠您的 receipts。
            </p>
          </div>

          <div className="mt-6">
            <ArticleMeta
              readingMin={4}
              sample={{ current: n, threshold: 30 }}
            />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── BRIER SCORE · Tetlock currency · NEW in /calibration ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 01 · BRIER SCORE · TETLOCK CURRENCY
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="border border-gold/60 bg-slate/40 p-5 sm:p-6 glow-soft">
              <p
                lang="en"
                className="font-mono text-gold/90 text-[9px] tracking-[0.3em] mb-2"
              >
                ENGINE v0.2 · BRIER
              </p>
              <p className="font-mono text-gold text-4xl sm:text-5xl tabular tracking-tight font-light">
                {brier === null ? "—" : brier.toFixed(3)}
              </p>
              <p className="font-mono text-mute text-[10px] tracking-[0.22em] mt-2">
                {n === 0
                  ? "等今晚 22:30+ 第一筆 ingest"
                  : n < 30
                  ? `N = ${n} of 30 · SAMPLE DEBT`
                  : brierVerdict === "better-than-coin-flip"
                  ? "引擎 outperforms coin-flip"
                  : brierVerdict === "coin-flip-tier"
                  ? "引擎 ≈ coin-flip · 還沒展現 edge"
                  : "引擎 underperforms coin-flip · 公開 audit"}
              </p>
            </div>
            <div className="border border-line/40 bg-slate/20 p-5 sm:p-6">
              <p
                lang="en"
                className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-2"
              >
                NULL · COIN-FLIP BASELINE
              </p>
              <p className="font-mono text-mute text-4xl sm:text-5xl tabular tracking-tight font-light">
                {COIN_FLIP_BRIER.toFixed(3)}
              </p>
              <p className="font-mono text-mute/70 text-[10px] tracking-[0.22em] mt-2">
                0 信息 · 永遠 say 50% · 不會錯也不會對的 baseline
              </p>
            </div>
          </div>
          <p className="text-mute text-sm leading-relaxed mb-3">
            <strong className="text-bone">Brier score</strong>(Tetlock 2014-2018)
            = mean squared error · 機率 vs outcome。
            <span className="font-mono text-gold/80">0</span> = 完美 ·{" "}
            <span className="font-mono text-mute">0.25</span> = coin-flip baseline ·{" "}
            <span className="font-mono text-loss">1</span> = perfectly wrong。
          </p>

          {/* Round 42 W-B · Reproducibility Receipt · Agent H #4 ship ·
              specific git commit + data as-of + seed + N · 每個 published
              number 都 auditable 至 git revision · per IJCAI 2026 standard。 */}
          <div className="mb-3">
            <ReproducibilityReceipt
              seed={null}
              dataAt="2026-05-21"
              n={n}
              fileLink="https://github.com/Tim-xuan-you/zone27-web/blob/main/app/calibration/page.tsx"
            />
          </div>
          <p className="text-mute/85 text-sm leading-relaxed">
            比 win-rate 更 informative · 因為 win-rate 不考慮 confidence level ·
            Brier penalizes <strong className="text-bone">over-confidence</strong>。
            引擎 say 95% 結果輸 = 比 say 55% 結果輸 多扣分。
          </p>
        </section>

        {/* ── RELIABILITY DIAGRAM ──────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 02 · RELIABILITY DIAGRAM · 引擎機率 vs 實際頻率
          </p>
          <ReliabilityDiagram bins={bins} n={n} />
          {n === 0 ? (
            <div className="mt-6 border border-dashed border-gold/30 bg-slate/30 p-6 sm:p-8 text-center">
              <p
                lang="en"
                className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
              >
                SCAFFOLD · ENGINE N=0
              </p>
              <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                引擎還沒 finalized 任何場。 第一個 dot 落點 · cpbl-260521-01
                (今晚 22:30+ TPE)。
              </p>
            </div>
          ) : n < 30 ? (
            <div className="mt-6 border border-loss/30 bg-loss/5 p-5 sm:p-6">
              <p
                lang="en"
                className="font-mono text-loss text-[10px] tracking-[0.35em] mb-2"
              >
                ⚠ SAMPLE DEBT · N = {n} of 30
              </p>
              <p className="text-mute text-sm leading-relaxed">
                Reliability diagram 在 N≥30 之前 statistically meaningless ·
                任何 drift 都可能是雜訊 · 不是引擎缺陷。 完整 calibration math 見{" "}
                <Link
                  href="/methodology"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  /methodology
                </Link>
                。
              </p>
            </div>
          ) : null}
        </section>

        {/* ── R45 W-E · Agent L DEEPEST · Anonymous Calibration Strip
            Visitor 個人 picks vs engine track record · client-render only ·
            0 server-side · ZONE 27 看不到 individual data · per disclosure
            axiom storage key zone27_anon_picks_v1 公開 in /audit S06。
            Only renders when localStorage has picks · progressive enhancement。 */}
        <AnonCalibrationStrip variant="calibration" />

        {/* ── DISPLACEMENT MISSION · what tipster sites can't ship ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 03 · WHY 玩運彩 + 報馬仔 CAN&apos;T SHIP THIS PAGE
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            這頁 structurally 不可 copy
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              玩運彩 駐站名家 9 位 · 自稱 55-59% 勝率。 報馬仔 LINE 老師 ·
              自稱 8-9 連勝。 沒有一家 publish reliability diagram · 因為
              publish 等於暴露:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  Stated「94% 勝率」 vs realized 50-52% = 42pp over-confidence
                  delta · Brier score &gt; 0.4(比 coin-flip 還差)
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  Streak-based marketing(連勝 X 天)+ survivorship bias · 失敗
                  週次刪文 + 贏家截圖 · retroactive curation 不可 calibration
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  Pay-for-pick model · 報酬 incentive structure 跟 calibration
                  反向 · 公布 calibration = 自殺商業模式
                </span>
              </li>
            </ul>
            <p className="pt-2">
              <strong className="text-bone">ZONE 27 structurally 可以 publish</strong>{" "}
              · 因為 BLACK CARD NT$ 1,500/season + Founders 27 NT$ 2,700 終身 ·
              訂閱費 不 depend on 引擎是否準。 您贏您輸 ZONE 27 都一樣賺。
              這個 incentive alignment 是 displacement mission 的{" "}
              <span className="text-gold">structural moat</span>。
            </p>
          </div>
        </section>

        {/* ── PERSONAL VERSION CROSS-LINK ─────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / 04 · 您 own drift · /member/calibration
          </p>
          <div className="bg-slate/30 border border-line/60 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight mb-4">
              這頁是 <span className="text-gold">global</span> 引擎自評 ·{" "}
              <span className="text-gold">personal</span> 在另一頁
            </h3>
            <p className="text-mute leading-relaxed mb-4">
              這頁 = ALL ZONE 27 公開預測 averaged · 任何 visitor 都看得到 ·
              不需 auth。 您 follow 過的賽事 own drift 在{" "}
              <Link
                href="/member/calibration"
                className="text-gold underline-offset-4 hover:underline"
              >
                /member/calibration
              </Link>{" "}
              · 需 Email + 密碼 登入。 同 SVG · 同 binning math · 不同 data subset。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login?next=/member/calibration"
                className="inline-block px-6 py-2.5 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
              >
                → 登入看您 own drift
              </Link>
              <Link
                href="/methodology"
                className="inline-block px-6 py-2.5 border border-line/60 text-mute font-mono text-[10px] tracking-[0.3em] hover:text-gold hover:border-gold/40 transition-colors"
              >
                → /methodology Brier math
              </Link>
            </div>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這頁是 ZONE 27 最 expensive 的 trust artifact · 因為公布等於
            <strong>把自己暴露在 outcome accountability 之下</strong>。
          </p>
          <p>
            FiveThirtyEight 2020 publish「Checking Our Work」 · 變成所有
            probabilistic journalism 學術 cite 的 reference。 ZONE 27 採同
            pattern · 但更具體 · 加 Brier score + coin-flip baseline 對照 ·
            玩運彩+報馬仔 結構上無法 copy。
          </p>
          <p>
            修改此頁的計算邏輯需 30 天 /changelog 公告 · 同 /audit S05
            PRE-COMMIT pattern · Costly Signaling 100×。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/calibration" />

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6"
          >
            OUTCOME ACCOUNTABILITY · NOT MARKETING.
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight">
            這頁不會消失 · 不會 silently rotate · 不會藏 over-confidence。
          </h3>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// Inline SVG reliability diagram · same math as /member/calibration
// (Round 30 W2B agent deepest call)· copied here intentionally instead
// of import → public page is independently shippable + auditable · 不
// share local state · 不 share component complexity edge cases。 將來
// 若 extract 為 shared <ReliabilityDiagram /> component · 同時 refactor
// /member/calibration 來 import。
function ReliabilityDiagram({ bins, n }: { bins: Bin[]; n: number }) {
  // SVG coordinate system: 400x400 with 40px left/bottom margin · 20px top/right
  const px = (pct: number) => 40 + (pct / 100) * 340;
  const py = (pct: number) => 360 - (pct / 100) * 340;

  return (
    <div className="bg-slate/30 border border-line/60 p-5 sm:p-8">
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.4em]"
        >
          / SABERMETRIC RELIABILITY DIAGRAM
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular">
          ENGINE v0.2 · GLOBAL N = {n}
        </p>
      </div>
      <div className="aspect-square max-w-md mx-auto">
        <svg
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          role="img"
          aria-label={
            n === 0
              ? "Reliability diagram scaffold: predicted probability vs actual frequency, currently empty (N=0)"
              : `Reliability diagram: ${n} finalized matches plotted, engine vs actual frequency`
          }
        >
          {/* Grid */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={px(0)}
                y1={py(v)}
                x2={px(100)}
                y2={py(v)}
                stroke="rgba(138, 147, 168, 0.12)"
                strokeWidth="1"
              />
              <line
                x1={px(v)}
                y1={py(0)}
                x2={px(v)}
                y2={py(100)}
                stroke="rgba(138, 147, 168, 0.12)"
                strokeWidth="1"
              />
            </g>
          ))}
          {/* Axes */}
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(100)}
            y2={py(0)}
            stroke="rgba(138, 147, 168, 0.6)"
            strokeWidth="1"
          />
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(0)}
            y2={py(100)}
            stroke="rgba(138, 147, 168, 0.6)"
            strokeWidth="1"
          />
          {/* 45° perfect calibration line */}
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(100)}
            y2={py(100)}
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Bins */}
          {n === 0
            ? [55, 65, 75, 85].map((v) => (
                <circle
                  key={v}
                  cx={px(v)}
                  cy={py(v)}
                  r="3"
                  fill="none"
                  stroke="rgba(138, 147, 168, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              ))
            : bins.map((b) => {
                const radius = Math.min(3 + b.count * 1.5, 12);
                return (
                  <circle
                    key={b.centerPct}
                    cx={px(b.centerPct)}
                    cy={py(b.favoriteActualPct)}
                    r={radius}
                    fill="#D4AF37"
                    fillOpacity={0.85}
                    stroke="#0F1A2E"
                    strokeWidth="1"
                  />
                );
              })}
          {/* Axis tick labels */}
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <text
                x={px(v)}
                y={py(0) + 18}
                fontSize="10"
                fontFamily="monospace"
                fill="rgba(138, 147, 168, 0.85)"
                textAnchor="middle"
              >
                {v}%
              </text>
              <text
                x={px(0) - 8}
                y={py(v) + 3}
                fontSize="10"
                fontFamily="monospace"
                fill="rgba(138, 147, 168, 0.85)"
                textAnchor="end"
              >
                {v}%
              </text>
            </g>
          ))}
          {/* Axis labels */}
          <text
            x={px(50)}
            y={py(0) + 36}
            fontSize="9"
            fontFamily="monospace"
            fill="rgba(212, 175, 55, 0.85)"
            textAnchor="middle"
            letterSpacing="0.18em"
          >
            ENGINE FAVORITE %
          </text>
          <text
            x={px(0) - 32}
            y={py(50)}
            fontSize="9"
            fontFamily="monospace"
            fill="rgba(212, 175, 55, 0.85)"
            textAnchor="middle"
            letterSpacing="0.18em"
            transform={`rotate(-90 ${px(0) - 32} ${py(50)})`}
          >
            ACTUAL %
          </text>
        </svg>
      </div>
    </div>
  );
}
