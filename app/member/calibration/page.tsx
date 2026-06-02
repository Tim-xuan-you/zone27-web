import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import CalibrationTierBadge from "@/components/CalibrationTierBadge";
import { createPageMetadata } from "@/lib/page-og";
import {
  getFinalizedMatches,
  type Match,
} from "@/lib/matches";
import { getSession } from "@/lib/supabase/server";
import { readFollowsFromMeta } from "@/lib/follows";

export const metadata = createPageMetadata({
  title: "引擎準度對照 · 您 vs 引擎 vs 實際",
  description:
    "可信度對照圖:引擎賽前說的機率(X 軸)對上實際發生的頻率(Y 軸),落在 45° 線上就是完美校準。引擎準不準,公開讓你自己看。",
  ogTitle: "引擎準度對照 · ZONE 27",
  ogDescription:
    "可信度對照圖 · 引擎準不準公開讓你自己看 · 言中跟落空一樣攤開",
  path: "/member/calibration",
});

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
            <p className="font-mono text-gold text-[10px] tracking-[0.45em]">
              / 引擎準度對照 · 你 vs 引擎 vs 實際
            </p>
            <span
              className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
                n === 0
                  ? "border-gold/60 text-gold shimmer glow-gold"
                  : "border-gold/60 text-gold"
              }`}
              title={
                mode === "personal"
                  ? `你追蹤的 ${n} 場已結算 · 你自己的準度`
                  : `${n} 場已結算 · 全站平均 · 賽後逐場登錄`
              }
            >
              {mode === "personal"
                ? n === 0
                  ? "你的 · 0 場(追蹤賽事 → 賽後落點)"
                  : `你的 · ${n} 場`
                : n === 0
                ? "全站 · 等第一場"
                : `全站 · ${n} 場`}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            照見自己判斷的{" "}
            <span className="text-gold">那面鏡子</span>
          </h1>
          <p className="mt-6 text-mute leading-relaxed max-w-2xl">
            這頁是一張{" "}
            <strong className="text-bone">準度對照圖</strong>
            · 引擎賽前說的成數(橫軸)對上實際真的中的成數(直軸)。
            完全準 = 落在 <span className="text-gold">45° 斜線</span>{" "}
            上 — 引擎說「六成」的那些場 · 真的就有六成贏。
          </p>
          <p className="mt-4 text-mute/85 leading-relaxed max-w-2xl">
            每個分析網站都給你看{" "}
            <span className="text-mute">別人</span>{" "}
            的數據(球隊數據、球員數據、聯盟平均)。
            ZONE 27 是<strong className="text-bone">唯一把你自己的準度攤開來給你看的</strong>。
          </p>
          <p className="mt-4 font-mono text-mute/80 text-[10px] tracking-[0.25em] leading-relaxed max-w-2xl">
            不是功能堆疊 · 是一面鏡子 —
            你看到自己跟引擎的對照,也看到引擎跟現實的對照。
          </p>
          <div className="mt-6">
            <ArticleMeta
              readingMin={3}
              sample={{ current: n, threshold: 30 }}
            />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── Round 53 W-A · CalibrationTierBadge · 7-tier epistemic
            discipline ladder · brand-pure Tetlock pattern · 0 social
            leaderboard · client-side localStorage only · per agent's
            anti-leaderboard guard · 永遠不在 /calibration public page。
            Tier 0 觀測者 N<10 · Tier 1 校準學徒 · Tier 2 守紀者 ·
            Tier 3 守紀者 II · Tier 4 超級守紀者(Tetlock top-2%)·
            Tier 5 27(brand-aligned 270 picks)· Tier 6 終身校準者。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4">
            / 你的準度級別 · 7 階 · 只有你自己看得到
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-3">
            你的準度級別
          </h2>
          <p className="text-mute/85 text-sm leading-relaxed mb-6">
            這跟玩運彩、報馬仔的排行榜本質不同 —
            我們排的是「<strong className="text-bone">你說的把握程度,跟實際結果有多吻合</strong>」,
            不是排「誰猜最準」(那是賭博排行榜的玩法)。 而且只有你自己看得到,
            不跟別人比。
          </p>
          <CalibrationTierBadge />
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── RELIABILITY DIAGRAM ──────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16">
          <ReliabilityDiagram bins={bins} n={n} mode={mode} />
          {n === 0 ? (
            <div className="mt-6 border border-dashed border-gold/30 bg-slate/30 p-6 sm:p-8 text-center">
              {mode === "personal" ? (
                <>
                  <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
                    你的 · 0 場 · 追蹤賽事 → 賽後落點
                  </p>
                  <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-3">
                    你已登入 · 但還沒追蹤任何已經結算的賽事 ·
                    所以這張圖還沒有點。 追蹤一場 → 賽後結果自動
                    落到這張圖上。
                  </p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <Link
                      href="/matches"
                      className="inline-block px-6 py-2.5 bg-gold text-navy font-mono text-[10px] tracking-[0.3em] hover:bg-gold-soft transition-colors"
                    >
                      → 今日賽事板 · 追蹤第一場
                    </Link>
                    <Link
                      href="/track-record"
                      className="inline-block px-6 py-2.5 border border-gold/50 text-gold font-mono text-[10px] tracking-[0.3em] hover:bg-gold/10 transition-colors"
                    >
                      → 引擎已結算的場
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-3">
                    全站 · 還沒有資料
                  </p>
                  <p className="text-mute text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-3">
                    引擎還沒結算任何一場。 沒登入看到的是全站平均 ·
                    登入後就變成你自己的對照圖。
                  </p>
                </>
              )}
            </div>
          ) : n < 30 ? (
            <div className="mt-6 border border-loss/30 bg-loss/5 p-5 sm:p-6">
              <p className="font-mono text-loss text-[10px] tracking-[0.35em] mb-2">
                ⚠ 資料還太少 · 目前 {n} 場 / 滿 30 場才算數
              </p>
              <p className="text-mute text-sm leading-relaxed">
                場數不到 30 之前,這張圖還看不出名堂 ·
                任何偏移都可能只是運氣、不是引擎的問題。
                完整算法見{" "}
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

        {/* ── HOW TO READ · Wave 8 COMPRESSED 6 steps → 4 ── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-8">
            / 怎麼看這張圖
          </p>
          <div className="space-y-5">
            <ReadingStep
              no="01"
              title="橫軸 · 引擎賽前看好的成數"
              body="一萬次模擬收斂後 · 賽前鎖定、不再改。"
            />
            <ReadingStep
              no="02"
              title="直軸 · 實際真的中的成數"
              body="同一個成數區間裡 · 看好的那隊真的贏的比例 · 由賽後比分算出。"
            />
            <ReadingStep
              no="03"
              title="45° 金線 = 完全準 · 在線上方 = 太保守 · 在線下方 = 太自信"
              body="點離這條線越遠 · 引擎在這個成數區間越需要校正。"
            />
            <ReadingStep
              no="04"
              title="點越大 = 這個區間累積的場數越多"
              body="同區間場數越多、點越大。 不到 10 場多半是運氣;滿 30 場才有統計意義。"
            />
          </div>
        </section>

        {/* ── DEEPEST CALL · Wave 8 COMPRESSED ──────
            原 4-paragraph elaboration 砍到 1 quote + 1 短句。 Brand statement
            soul 保留 · 「explainer 段落」全砍。 */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <blockquote className="border-l-2 border-gold pl-6 sm:pl-8 py-3">
            <p className="text-bone text-xl sm:text-2xl font-light tracking-tight leading-snug mb-4">
              不是功能堆疊 · 是一面{" "}
              <span className="text-gold">照見自己判斷的鏡子</span>。
            </p>
            <p className="text-mute text-sm sm:text-base leading-relaxed">
              別人給你的是別人的數據。 ZONE 27 讓你看到
              <strong className="text-bone">你自己</strong>的準度怎麼飄 —
              連你過度自信的地方都攤開。
            </p>
          </blockquote>
        </section>

        {/* ── PERSONAL VERSION TIMELINE ─────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6">
            / 全站 vs 你自己 · 兩層對照
          </p>
          <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
            這張圖的兩個階段
          </h2>
          <div className="space-y-5">
            <TimelineRow
              phase="現在 · 全站"
              status={n === 0 ? "還沒有資料 · 等第一場" : `${n} 場 · 累積中`}
              body={`所有 ZONE 27 公開預測 → 引擎的平均準度。 任何人都看得到 · 不用登入 · 算法公開。 ${
                n === 0
                  ? "第一個落點 · 統一 vs 富邦(2026-05-21)。"
                  : "賽後逐場登錄 · 任何一場都可以回查。"
              }`}
            />
            <TimelineRow
              phase="登入後 · 你自己"
              status="登入即啟用"
              body="你追蹤的賽事 → 你自己的準度怎麼飄。 同一張圖、同一套算法 · 只是換成你的資料。 Email + 密碼登入已上線 · 你這台裝置已追蹤的賽事會自動同步 · 你的個人對照圖從登入那天起跳。"
            />
            <TimelineRow
              phase="未來 · 還沒定"
              status="待拍板"
              body="要不要公開其他會員的準度 · 或排一個「最準會員」榜。 很有爭議 — 一邊是良性競爭,一邊是比慘比過頭。 先留著 · 不主動推。"
            />
          </div>
        </section>

        <FounderSignOff>
          <p>
            這頁今天還是<strong>一張空圖</strong> · 一場都還沒結算 ·
            我們連全站的準度圖都還畫不出來 · 更別說個人版。
            但這是<strong>故意的</strong> — 圖從零開始 · 第一個落點
            賽後才會出現 · 不回填、不假裝。
          </p>
          <p>
            個人版(你追蹤的賽事 · 你自己的準度)登入後就接上 ·
            同一張圖、同一套算法 · 只是換成你的資料。
            不用等「升級」 · 一直就是這樣設計的。
          </p>
          <p>
            這頁的存在不是為了比功能多 · 是要講一件事:
            <strong>ZONE 27 跟其他分析網站唯一的差別 ·
            就是這張對照圖。</strong> 我們不藏自己飄掉的地方 · 公開到你
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
              ← 回會員儀表板
            </Link>
            <Link
              href="/track-record"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              完整公開戰績 →
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
        <p className="font-mono text-gold text-[10px] tracking-[0.4em]">
          / 引擎說的 vs 實際發生
        </p>
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.3em] tabular">
          引擎 v0.2 · {mode === "personal" ? "你的" : "全站"} {n} 場
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
            引擎看好幾成
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
            實際中幾成
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
            完全準 · 45°
          </text>
        </svg>
      </div>
      <p className="mt-5 font-mono text-mute/70 text-[10px] tracking-[0.25em] text-center leading-relaxed">
        {n === 0 ? (
          <span>
            ↗ 金色虛線 = 完全準 · 空心點 = 還沒有資料
          </span>
        ) : (
          <span>
            ↗ 金色虛線 = 完全準 · 金色點 = 一個成數區間 · 點越大場數越多
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
