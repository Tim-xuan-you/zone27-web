import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import {
  getFinalizedMatches,
  type Match,
} from "@/lib/matches";
import { getSession } from "@/lib/supabase/server";
import { readFollowsFromMeta } from "@/lib/follows";

export const metadata: Metadata = {
  title: "Calibration · 您的 epistemic mirror · ZONE 27",
  description:
    "Sabermetric reliability diagram · ZONE 27 是唯一發布會員自己 calibration drift 的高端棒球分析品牌。X 軸 = 引擎機率,Y 軸 = actual frequency,45° 線 = 完美校準。Pratfall + Costly Signaling brand IP 物理產出。N=0 從今晚 22:00+ 第一筆 cpbl-260521-01 ingest 起跳。",
};

// ── ZONE 27 · /member/calibration ──────────────────────
// Round 30 Wave 2B · 2026-05-21 evening · agent research deepest call。
//
//   「The dashboard isn't a feature stack. It's an epistemic mirror.」
//
// Reliability diagram(45° calibration plot)是 ZONE 27 結構上唯一能做
// 的「會員 own track record」visualization。 FanGraphs · Baseball Savant ·
// The Athletic 都 show OTHER PEOPLE 的 stats · 沒有任何一家 show「您
// 自己 follow 過的賽事的 calibration」。 ZONE 27 brand IP 結構上 default
// 就是 transparency + member data ownership · 這個 diagram 是 brand
// statement 的物理產出。
//
// 現在(N=0):empty scaffold + Pratfall waiting state · 不假裝 calibration
// 已有意義。 今晚 22:00+ Tim ingest cpbl-260521-01 finalResult → 第一個
// dot 落點。 Personal 版(您 follow 的賽事 · 您自己 drift)等 Phase 1 Q3
// auth + follow-list 上線後接 — 同 schema · 不需 migration。
//
// Routing: /member/calibration · 跟 /member · /membership · /admin 屬
// member-and-ops 群 · indexable · 28th visitor-discoverable route。
// ─────────────────────────────────────────────────────

export const revalidate = 86400; // re-evaluate daily · /track-record 同 cadence

type Bin = {
  centerPct: number;
  count: number;
  favoriteActualPct: number; // 0-100
};

// Bin the finalized matches into 10 buckets by engine probability on favorite.
// Center positions: 5, 15, 25, ..., 95(10-wide bins from 0-10, 10-20, ..., 90-100)。
function computeBins(finalized: Match[]): Bin[] {
  const buckets: Map<
    number,
    { favoriteWins: number; total: number }
  > = new Map();

  for (const m of finalized) {
    if (!m.finalResult) continue;
    const fr = m.finalResult;
    const enginePctFav = Math.max(m.home.winRate, m.away.winRate);
    if (enginePctFav < 50) continue; // shouldn't happen, but guard
    const binIndex = Math.min(Math.floor(enginePctFav / 10), 9); // 5..9 typically
    const centerPct = binIndex * 10 + 5;

    const homeFav = m.home.winRate >= m.away.winRate;
    const favoriteWon =
      (homeFav && fr.winner === "home") ||
      (!homeFav && fr.winner === "away");

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

export default async function CalibrationPage() {
  // Round 30 Wave 10 · Personal mode — agent W2B deepest call 終於完整
  // 交付。 Logged-in + has follows = render YOUR own drift(filter
  // finalized by follow-list)。 Anonymous = render GLOBAL aggregate。
  // 自動切換 · 同 SVG · 同 binning math · 不同 data subset。
  const session = await getSession();
  const followIds = readFollowsFromMeta(
    session?.user.user_metadata as Record<string, unknown> | undefined
  );
  const allFinalized = getFinalizedMatches();
  const mode: "personal" | "global" = session ? "personal" : "global";
  const finalized =
    mode === "personal"
      ? allFinalized.filter((m) => followIds.includes(m.id))
      : allFinalized;
  const n = finalized.length;
  const bins = computeBins(finalized);

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
              / CALIBRATION · 您的 epistemic mirror
            </p>
            <span
              lang="en"
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                n === 0
                  ? "border-gold/60 text-gold shimmer glow-gold"
                  : "border-gold/60 text-gold"
              }`}
              title={
                mode === "personal"
                  ? `您 follow 的 ${n} 場 finalized · 您 personal drift`
                  : `${n} 場 finalized · global aggregate · git commit 為準`
              }
            >
              {mode === "personal"
                ? n === 0
                  ? "✓ YOUR · N=0(follow 賽事 → 賽後落點)"
                  : `✓ YOUR · N=${n}`
                : n === 0
                ? "GLOBAL · WAITING · N=0"
                : `GLOBAL · N=${n}`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            您的 <span className="text-gold">epistemic mirror</span>{" "}
            · 引擎跟現實的可信對照
          </h1>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            這頁是{" "}
            <strong className="text-bone">sabermetric reliability diagram</strong>
            · 引擎賽前 say 的機率(x 軸)對上 actual frequency(y 軸)。
            完美 calibration = 落在 <span className="text-gold">45° 線</span>{" "}
            上 — 引擎 say 60% 的場 · 真的有 60% 機率 favorite win。
          </p>
          <p className="mt-4 text-mute/85 leading-relaxed max-w-2xl">
            每個高端 sports 分析平台都給您看{" "}
            <span className="text-mute">OTHER PEOPLE</span>{" "}
            的數據(team stats · player metrics · league averages)。
            ZONE 27 是<strong className="text-bone">唯一發布會員自己{" "}
            calibration drift 的</strong>。
          </p>
          <p className="mt-4 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
            這不是 feature stack · 是{" "}
            <strong className="text-bone">epistemic mirror</strong> —
            您看到自己跟引擎的對照 · 看到引擎跟現實的對照 · Pratfall +
            Costly Signaling 同時 fire。
          </p>
          <div className="mt-6">
            <ArticleMeta
              readingMin={3}
              sample={{ current: n, threshold: 30 }}
            />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── RELIABILITY DIAGRAM ──────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <ReliabilityDiagram bins={bins} n={n} mode={mode} />
          {n === 0 ? (
            <div className="mt-6 border border-dashed border-gold/30 bg-slate/30 p-6 sm:p-8 text-center">
              {mode === "personal" ? (
                <>
                  <p
                    lang="en"
                    className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
                  >
                    ✓ AUTH · YOUR N=0 · follow → 賽後落點
                  </p>
                  <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-3">
                    您已登入 · 但還沒 follow 任何已 finalized 的賽事 ·
                    所以 mirror 還沒有點。 follow 一場 → 賽後 verdict 自動
                    落這 diagram。
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/matches"
                      className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
                    >
                      → 今日賽事板 · follow 第一場
                    </Link>
                    <Link
                      href="/track-record"
                      className="inline-block px-6 py-2.5 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
                    >
                      → 引擎已 finalized 的場
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p
                    lang="en"
                    className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3"
                  >
                    SCAFFOLD · GLOBAL N=0
                  </p>
                  <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-3">
                    引擎還沒 finalized 任何場。 anon visitor 看 global aggregate ·
                    /login 後變 personal mirror。
                  </p>
                </>
              )}
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
                任何 drift 都可能是雜訊 · 不是引擎缺陷。
                完整 calibration math 見{" "}
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

        {/* ── HOW TO READ · Wave 8 COMPRESSED 6 steps → 4 ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8"
          >
            / HOW TO READ
          </p>
          <div className="space-y-5">
            <ReadingStep
              no="01"
              title="X 軸 · 引擎賽前 favorite 機率"
              body="10K Monte Carlo 收斂後 · 賽前鎖定不再改。"
            />
            <ReadingStep
              no="02"
              title="Y 軸 · actual frequency"
              body="同 x 軸區間 · favorite 真的贏的比例 · 從 cpbl 最終比分 derived。"
            />
            <ReadingStep
              no="03"
              title="45° 金線 = 完美 · 高於 = under-confident · 低於 = over-confident"
              body="點偏離 45° 越多 · 引擎這個機率區間越需 calibration。"
            />
            <ReadingStep
              no="04"
              title="點大小 = bin sample 數"
              body="同區間賽越多點越大。N<10 多是雜訊;N≥30 進統計顯著。"
            />
          </div>
        </section>

        {/* ── DEEPEST CALL · Wave 8 COMPRESSED ──────
            原 4-paragraph elaboration 砍到 1 quote + 1 短句。 Brand statement
            soul 保留 · 「explainer 段落」全砍。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <blockquote className="border-l-2 border-gold pl-6 sm:pl-8 py-3">
            <p className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-4">
              不是 feature stack · 是{" "}
              <span className="text-gold">epistemic mirror</span>。
            </p>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              別人給您 team stats / 別人的 archive。 ZONE 27 唯一 surface
              會員<strong className="text-bone">自己</strong>的 calibration drift —
              Pratfall + Costly Signaling 公開 bin diverged。
            </p>
          </blockquote>
        </section>

        {/* ── PERSONAL VERSION TIMELINE ─────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
          >
            / GLOBAL vs PERSONAL · 兩層 mirror
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            這個 diagram 演化的兩個 phase
          </h2>
          <div className="space-y-5">
            <TimelineRow
              phase="現在 / GLOBAL"
              status={n === 0 ? "EMPTY · 等今晚 22:00+ 第一筆" : `N=${n} · 累積中`}
              body={`所有 ZONE 27 公開預測 → 引擎 average calibration。 任何 visitor 都看得到 · 不需 auth · 對齊「方法公開」brand axiom。 ${
                n === 0
                  ? "今晚第一個 dot 落點 · cpbl-260521-01。"
                  : "git commit 為 source of truth · 任何 ingest 都可以回查。"
              }`}
            />
            <TimelineRow
              phase="Phase 1 Q3 / PERSONAL"
              status="等 auth 上線"
              body="您 follow 的賽事 → 您自己的 calibration drift。 同 schema · 同 SVG · 不同 data subset。 magic link auth 上線當天 · 您 localStorage 已有的 follow-list 自動 sync · 您的 personal mirror 從那天起跳。"
            />
            <TimelineRow
              phase="未來 / SOCIAL"
              status="UNRESOLVED · 待 Tim 拍板"
              body="是否 expose 其他會員 calibration · 或 leaderboard 排 most-calibrated members。 高度爭議 — 一方面是 healthy competition · 一方面是 Costly Signaling 走太遠變比慘。 留 brand decision · 不主動推。"
            />
          </div>
        </section>

        <FounderSignOff>
          <p>
            這頁今天是<strong>empty scaffold</strong> · N=0 ·
            我們連 platform 級 calibration 都還沒能畫 · 別說個人版。
            但這是<strong>設計</strong> — diagram 從 N=0 開始 · 第一個 dot
            今晚 22:00+ 落點 · 不 backfill 不假裝。
          </p>
          <p>
            個人版(您 follow 的賽事 · 您自己的 calibration drift)等 Phase 1
            Q3 auth 上線後接 · 同 SVG · 同 binning math · 只是 data subset
            不同。 不需 migration · 不需「升級」 · 一直就是這樣設計的。
          </p>
          <p>
            這個 page 的存在不是 features-arms-race · 是 brand IP statement:
            <strong>ZONE 27 跟其他高端 sports 分析品牌唯一的差別 ·
            就是這個 mirror。</strong> 我們不藏 drift · 我們把它公開到 visitor
            可以截圖嗆我們的程度。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/member/calibration" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/member"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← 回 /member 儀表板 preview
            </Link>
            <Link
              href="/track-record"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              完整 receipt ledger · /track-record →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// Inline SVG reliability diagram · no external deps · 0 cookies。
// 400x400 viewBox · scales responsive。 Renders 45° perfect-calibration
// line in gold · grid · axes · and either empty-bin ghosts(N=0)or
// real plotted bins(N≥1, dot size by sample count)。
function ReliabilityDiagram({
  bins,
  n,
  mode = "global",
}: {
  bins: Bin[];
  n: number;
  mode?: "personal" | "global";
}) {
  // SVG coordinate system: 400x400 with 40px left/bottom margin · 20px top/right
  // Plot area: x 40..380(340 wide) · y 360..20(340 tall)
  // Convert pct (0-100) → svg coord
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
          ENGINE v0.2 · {mode === "personal" ? "YOUR" : "GLOBAL"} N = {n}
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
          {/* ── Grid ── */}
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

          {/* ── Axes ── */}
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

          {/* ── 45° perfect calibration line ── */}
          <line
            x1={px(0)}
            y1={py(0)}
            x2={px(100)}
            y2={py(100)}
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* ── Empty bin placeholders(N=0)or real bins(N≥1) ── */}
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

          {/* ── Axis tick labels ── */}
          {[0, 50, 100].map((v) => (
            <g key={v}>
              <text
                x={px(v)}
                y={py(0) + 18}
                fontFamily="ui-monospace, monospace"
                fontSize="10"
                fill="rgba(138, 147, 168, 0.6)"
                textAnchor="middle"
              >
                {v}
              </text>
              <text
                x={px(0) - 8}
                y={py(v) + 4}
                fontFamily="ui-monospace, monospace"
                fontSize="10"
                fill="rgba(138, 147, 168, 0.6)"
                textAnchor="end"
              >
                {v}
              </text>
            </g>
          ))}

          {/* ── Axis labels ── */}
          <text
            x={px(50)}
            y={py(0) + 35}
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            fill="rgba(138, 147, 168, 0.85)"
            textAnchor="middle"
            letterSpacing="2"
          >
            ENGINE PROBABILITY %
          </text>
          <text
            x={px(0) - 30}
            y={py(50)}
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            fill="rgba(138, 147, 168, 0.85)"
            textAnchor="middle"
            letterSpacing="2"
            transform={`rotate(-90 ${px(0) - 30} ${py(50)})`}
          >
            ACTUAL FREQUENCY %
          </text>

          {/* ── Perfect-calibration line label ── */}
          <text
            x={px(72)}
            y={py(80)}
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fill="#D4AF37"
            letterSpacing="1.5"
          >
            PERFECT · 45°
          </text>
        </svg>
      </div>
      <p className="mt-5 font-mono text-mute/70 text-[10px] tracking-[0.25em] text-center leading-relaxed">
        {n === 0 ? (
          <span>
            ↗ 金色虛線 = 完美 calibration · empty dots = waiting first data
          </span>
        ) : (
          <span>
            ↗ 金色虛線 = 完美 calibration · 金色點 = bin · 大小 ∝ sample
          </span>
        )}
      </p>
    </div>
  );
}

function ReadingStep({
  no,
  title,
  body,
}: {
  no: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-5">
      <span className="font-mono text-gold/70 text-sm tabular w-8 pt-1">
        {no}
      </span>
      <div className="flex-1">
        <h4 className="text-bone text-base sm:text-lg font-light tracking-tight mb-2">
          {title}
        </h4>
        <p className="text-mute text-sm leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function TimelineRow({
  phase,
  status,
  body,
}: {
  phase: string;
  status: string;
  body: string;
}) {
  return (
    <div className="border-l-2 border-gold/40 pl-5 sm:pl-6">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-2">
        <p className="font-mono text-bone text-[11px] sm:text-xs tracking-[0.25em]">
          {phase}
        </p>
        <p className="font-mono text-gold text-[11px] sm:text-xs tracking-[0.3em]">
          {status}
        </p>
      </div>
      <p className="text-mute text-sm leading-relaxed">{body}</p>
    </div>
  );
}
