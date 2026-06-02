import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import AnonCalibrationStrip from "@/components/AnonCalibrationStrip";
import { getFinalizedMatches, type Match } from "@/lib/matches";

export const metadata: Metadata = {
  title: "引擎自評 · ZONE 27 公開準不準",
  description:
    "ZONE 27 引擎自評。 引擎賽前說幾成 · 賽後實際中幾成 · 一張圖攤開讓你看。 我們公開自己準不準 · 明牌站不會這樣做 · 因為一公開就會暴露他們嘴上的勝率和實際差很多。",
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

export default function CalibrationPublicPage() {
  const finalized = getFinalizedMatches();
  const n = finalized.length;
  const bins = computeBins(finalized);

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p className="font-mono text-gold text-[10px] tracking-[0.45em]">
              / 引擎自評 · 公開我們準不準
            </p>
            <span
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                n === 0
                  ? "border-gold/60 text-gold shimmer glow-gold"
                  : "border-gold/60 text-gold"
              }`}
              title={`已結算 ${n} 場 · 賽後逐場登錄`}
            >
              {n === 0 ? "等第一場結算" : `已結算 ${n} 場`}
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
              <strong>每個拿明牌賺錢的網站都說自己多準</strong>{" "}
              · 沒有一家告訴你「說 70% 的時候、實際只中 67%」的那{" "}
              <span className="text-gold">3% 落差</span> ·
              因為一公開就露餡。
            </p>
            <p className="mt-3 text-mute text-base leading-relaxed">
              ZONE 27 公開。 這頁的數字 · 是我們欠你的一筆帳。
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

        {/* ── 引擎說的 vs 實際發生 ──────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-3">
            / 引擎說的 vs 實際發生
          </p>
          <p className="text-mute text-sm leading-relaxed mb-6 max-w-2xl">
            橫軸是引擎賽前看好的成數,直軸是實際真的中的成數。 點越靠近那條金色
            斜線,代表引擎「說幾成、就真的中幾成」· 越準。
          </p>
          <ReliabilityDiagram bins={bins} n={n} />
          {n === 0 ? (
            <div className="mt-6 border border-dashed border-gold/30 bg-slate/30 p-6 sm:p-8 text-center">
              <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
                還沒有資料 · 等第一場結算
              </p>
              <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                引擎還沒結算任何一場。 第一個落點 · 統一 vs 富邦
                (2026-05-21 新莊)。
              </p>
            </div>
          ) : n < 30 ? (
            <div className="mt-6 border border-loss/30 bg-loss/5 p-5 sm:p-6">
              <p className="font-mono text-loss text-[10px] tracking-[0.35em] mb-2">
                ⚠ 資料還太少 · 目前 {n} 場 / 滿 30 場才算數
              </p>
              <p className="text-mute text-sm leading-relaxed">
                場數不到 30 之前,這張圖還看不出名堂 · 任何偏移都可能只是運氣、
                不是引擎的問題。 完整算法見{" "}
                <Link
                  href="/methodology"
                  className="text-gold underline-offset-4 hover:underline"
                >
                  方法說明
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

        {/* ── 為什麼明牌站不敢做這頁 ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 為什麼明牌站不敢做這頁
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6 leading-tight">
            這頁,他們抄不走
          </h2>
          <div className="space-y-4 text-mute leading-relaxed">
            <p>
              玩運彩駐站名家自稱 55-59% 勝率 · LINE 老師自稱連勝八九場。
              沒有一家敢攤開這種對照圖 · 因為一攤開就露餡:
            </p>
            <ul className="space-y-2 pl-6">
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  嘴上「94% 勝率」· 實際只有 50-52% · 足足差了四十幾個百分點。
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  靠「連勝 X 天」行銷 · 輸的那幾週默默刪文、只截贏的那幾張 ·
                  挑著給你看的紀錄當然漂亮。
                </span>
              </li>
              <li className="flex gap-3 items-baseline">
                <span className="font-mono text-loss/80 text-[10px] tracking-[0.25em]">▸</span>
                <span>
                  靠賣明牌賺錢 · 一旦公開真實準度就砸自己招牌 · 所以永遠不公開。
                </span>
              </li>
            </ul>
            <p className="pt-2">
              <strong className="text-bone">ZONE 27 敢公開</strong>{" "}
              · 因為我們的訂閱費跟「引擎準不準」沒關係。 你贏你輸 · 我們都一樣。
              正因為賺錢方式跟「你有沒有贏」脫鉤 · 我們才敢這樣攤開 ·{" "}
              <span className="text-gold">這就是明牌站學不來的地方</span>。
            </p>
          </div>
        </section>

        {/* ── 你自己的準度在另一頁 ─────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 你自己的準度在另一頁
          </p>
          <div className="bg-slate/30 border border-line/60 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl text-bone font-light tracking-tight mb-4">
              這頁是 <span className="text-gold">引擎</span> 的準度 ·{" "}
              <span className="text-gold">你自己</span> 的在另一頁
            </h3>
            <p className="text-mute leading-relaxed mb-4">
              這頁是全站公開預測的平均 · 任何人都看得到 · 不用登入。
              你押過的那些場、你自己準不準,在{" "}
              <Link
                href="/member/calibration"
                className="text-gold underline-offset-4 hover:underline"
              >
                你的準度對照頁
              </Link>{" "}
              · 登入就看得到。 同一張圖、同一套算法 · 只是換成你的資料。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/login?next=/member/calibration"
                className="inline-block px-6 py-2.5 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
              >
                → 登入看你自己的準度
              </Link>
              <Link
                href="/methodology"
                className="inline-block px-6 py-2.5 border border-line/60 text-mute font-mono text-[10px] tracking-[0.3em] hover:text-gold hover:border-gold/40 transition-colors"
              >
                → 完整算法說明
              </Link>
            </div>
          </div>
        </section>

        <FounderSignOff>
          <p>
            這頁是 ZONE 27 最貴的一張信任憑證 · 因為公布它等於
            <strong>把自己攤在「準不準大家看得到」之下</strong>。
          </p>
          <p>
            我們公開自己準不準 · 一張圖就攤開 ·
            明牌站不會這樣做 — 因為一公開就會暴露他們嘴上的勝率和實際差很多。
          </p>
          <p>
            這頁的計算方式要改,得先在更新紀錄公告 30 天才動 · 不偷改。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/calibration" />

        {/* ── FINAL CTA ────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
            用結果說話 · 不是用行銷話術
          </p>
          <h3 className="text-3xl text-bone font-light tracking-tight">
            這頁不會消失 · 不會偷偷換掉 · 也不會藏起我們高估的地方。
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
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
          / 引擎說的 vs 實際發生
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular">
          引擎 v0.2 · 已 {n} 場
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
              ? "引擎準度對照圖 · 引擎說的成數對上實際中的成數 · 目前還沒有資料"
              : `引擎準度對照圖 · 已畫上 ${n} 場 · 引擎說的成數對上實際中的成數`
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
            引擎看好幾成
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
            實際中幾成
          </text>
        </svg>
      </div>
    </div>
  );
}
