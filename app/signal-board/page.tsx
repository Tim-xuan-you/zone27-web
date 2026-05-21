import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RelatedReading from "@/components/RelatedReading";
import { getTodayAndFutureMatches, type Match } from "@/lib/matches";

export const metadata: Metadata = {
  title: "Signal Board — 今日量化早報",
  description:
    "Bloomberg-style 每日量化研究早報。今日 CPBL 引擎覆蓋場次的信心評等、edge 強度、AI 模型評語、操盤焦點建議。",
};

// Re-render hourly so the "today" framing updates as time passes —
// even with hardcoded match data, the date stamp stays current.
// When the cron auto-pull is wired (v0.28+), this drops to revalidate=60
// or becomes fully dynamic.
export const revalidate = 3600;

// Data stamp for the currently shown matches. Hardcoded until the
// daily MLB-Stats-API + CPBL ingestion cron is wired. The page surfaces
// this via the FRESHNESS row so visitors can see the gap honestly.
const DATA_STAMP = "2026-05-19";

function getTaipeiTodayParts(): { year: string; month: string; day: string; iso: string } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Taipei",
  }).formatToParts(now);
  const year = parts.find((p) => p.type === "year")?.value ?? "2026";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const day = parts.find((p) => p.type === "day")?.value ?? "01";
  return { year, month, day, iso: `${year}-${month}-${day}` };
}

function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(`${fromISO}T00:00:00+08:00`).getTime();
  const to = new Date(`${toISO}T00:00:00+08:00`).getTime();
  return Math.max(0, Math.round((to - from) / (24 * 60 * 60 * 1000)));
}

// ── Confidence tiers ──────────────────────────────────
type Tier = "high" | "moderate" | "neutral";

function classifyMatch(m: Match): Tier {
  const edge = Math.abs(m.home.winRate - m.away.winRate);
  if (edge >= 20 && m.aiConfidence >= 65) return "high";
  if (edge >= 10 || m.aiConfidence >= 60) return "moderate";
  return "neutral";
}

const TIER_LABEL: Record<Tier, { en: string; zh: string; color: string }> = {
  high: { en: "HIGH CONFIDENCE", zh: "高信心", color: "text-gold border-gold" },
  moderate: {
    en: "MODERATE",
    zh: "中等信心",
    color: "text-gold/70 border-gold/40",
  },
  neutral: { en: "NEUTRAL", zh: "中性", color: "text-mute border-line/60" },
};

// ── Auto-generated "WHY" editorial ────────────────────
function whyEditorial(m: Match): string {
  const homeFav = m.home.winRate > m.away.winRate;
  const fav = homeFav ? m.home : m.away;
  const dog = homeFav ? m.away : m.home;
  const favName = fav.pitcher.name;
  const dogName = dog.pitcher.name;

  const k9Diff = parseFloat(fav.pitcher.k9) - parseFloat(dog.pitcher.k9);
  const eraDiff = parseFloat(dog.pitcher.era) - parseFloat(fav.pitcher.era);
  const whipDiff =
    parseFloat(dog.pitcher.whip) - parseFloat(fav.pitcher.whip);

  if (k9Diff >= 1.5) {
    return `${favName} 的 K/9 ${fav.pitcher.k9} 顯著高於 ${dogName} 的 ${dog.pitcher.k9},壓制力直接撕開機率分布。`;
  }
  if (eraDiff >= 0.5) {
    return `ERA 差距(${dog.pitcher.era} vs ${fav.pitcher.era})指向 ${fav.name} 的明顯防守優勢。`;
  }
  if (whipDiff >= 0.15) {
    return `WHIP 差距 ${whipDiff.toFixed(2)} 指向 ${favName} 對局面的控制力。`;
  }
  return `數據相當接近 — 兩位投手 K/9 與 ERA 差距僅 ${k9Diff.toFixed(
    1
  )} / ${eraDiff.toFixed(2)},模型輸出處於灰色地帶。`;
}

export default function SignalBoardPage() {
  // Round 11: same lifecycle filter as /matches. Past matches with
  // finalResult roll off the "今日早報" view · stay on /track-record.
  const today = getTodayAndFutureMatches();
  const { year, month, day, iso: todayISO } = getTaipeiTodayParts();
  const heroDate = `${year} · ${month} · ${day}`;
  const dataAgeDays = daysBetween(DATA_STAMP, todayISO);
  const isStale = dataAgeDays >= 1;

  // Aggregate stats
  const tiers = today.map((m) => ({ match: m, tier: classifyMatch(m) }));
  const highCount = tiers.filter((t) => t.tier === "high").length;
  const moderateCount = tiers.filter((t) => t.tier === "moderate").length;
  const neutralCount = tiers.filter((t) => t.tier === "neutral").length;

  // Find strongest and weakest — undefined-safe when array is empty
  // (defense against future schema migration / empty-data states)
  const sorted = [...today].sort(
    (a, b) =>
      Math.abs(b.home.winRate - b.away.winRate) -
      Math.abs(a.home.winRate - a.away.winRate)
  );
  const strongest = sorted[0];
  const weakest = sorted.length > 1 ? sorted[sorted.length - 1] : undefined;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pt-20 pb-10">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-6">
          <div>
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <p className="font-mono text-gold text-[10px] tracking-[0.45em]">
                每日量化早報
              </p>
              <span className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/30 text-gold/70">
                示範資料
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight tabular">
              {heroDate}
            </h1>
          </div>
          <div className="text-right space-y-1">
            <p
              lang="en"
              className="font-mono text-mute text-[10px] tracking-[0.3em]"
            >
              {isStale ? "⚠ FRESHNESS · STALE" : "● FRESHNESS · CURRENT"}
            </p>
            <p
              lang="en"
              className="font-mono text-bone text-[10px] tracking-[0.25em] tabular"
            >
              DATA STAMP · {DATA_STAMP}
              {isStale && (
                <>
                  {" · "}
                  <span className="text-loss">{dataAgeDays}d OLD</span>
                </>
              )}
            </p>
            <p
              lang="en"
              className="font-mono text-mute/70 text-[9px] tracking-[0.25em]"
            >
              AUTO-CRON · PENDING v0.28
            </p>
          </div>
        </div>

        <p className="text-mute leading-relaxed max-w-xl">
          每日量化研究早報。今日 CPBL 引擎覆蓋場次的信心評等、
          edge 強度、模型評語、操盤焦點建議 ——
          一個畫面決定要看哪場、要研究哪一隊。
        </p>
      </section>

      <div className="mx-auto max-w-5xl w-full px-6 sm:px-10 mb-12">
        <div className="w-full h-px bg-line/60" />
      </div>

      {/* ── TOP STATS BAR ────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 bg-slate/40 border border-line/70 p-6 sm:p-8">
          <BoardStat label="LIVE MATCHES" value={String(today.length)} />
          <BoardStat
            label="HIGH CONFIDENCE"
            value={String(highCount)}
            accent={highCount > 0}
          />
          <BoardStat label="MODERATE" value={String(moderateCount)} />
          <BoardStat label="NEUTRAL / FADE" value={String(neutralCount)} />
        </div>
      </section>

      {/* ── SIGNAL ROWS ──────────────────────────── */}
      <section className="mx-auto max-w-5xl w-full px-6 sm:px-10 pb-16">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-8">
          / TODAY&apos;S SIGNALS — RANKED BY EDGE
        </p>
        <div className="space-y-6">
          {sorted.map((m) => {
            const tier = classifyMatch(m);
            return <SignalRow key={m.id} match={m} tier={tier} />;
          })}
        </div>
      </section>

      {/* ── EDITORIAL FOCUS ──────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-16 border-t border-line/40 pt-12">
        <p className="font-mono text-gold/70 text-[10px] tracking-[0.35em] mb-6">
          / EDITORIAL FOCUS
        </p>

        <div className="bg-slate/60 border border-line/70 p-8 space-y-6">
          {strongest ? (
            <FocusItem
              label="STRONGEST EDGE TODAY"
              match={strongest}
              note={`+${Math.abs(strongest.home.winRate - strongest.away.winRate)} PP · 模型信心 ${strongest.aiConfidence}/100`}
            />
          ) : (
            <p className="font-mono text-mute text-xs tracking-[0.25em] text-center py-4">
              無排定賽事 · 編輯焦點待補
            </p>
          )}
          {weakest && (
            <>
              <div className="w-full h-px bg-line/40" />
              <FocusItem
                label="WEAKEST SIGNAL"
                match={weakest}
                note={`僅 +${Math.abs(weakest.home.winRate - weakest.away.winRate)} PP · 模型信心 ${weakest.aiConfidence}/100 — 接近 coin flip`}
              />
            </>
          )}
        </div>

        <p className="font-mono text-mute text-[10px] tracking-[0.25em] mt-6">
          BRIEF 由演算法每日自動生成 · 非預測保證 · 詳見{" "}
          <Link
            href="/methodology"
            className="text-gold underline-offset-4 hover:underline"
          >
            /methodology
          </Link>
        </p>
      </section>

      <RelatedReading currentPath="/signal-board" />

      {/* ── FINAL CTA ────────────────────────────── */}
      <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-16 text-center border-t border-line/40">
        <p className="font-mono text-gold text-[10px] tracking-[0.4em] mb-6">
          BUILT FOR THOSE WHO READ THE BRIEF.
        </p>
        <h3 className="text-3xl text-bone font-light tracking-tight">
          想自己跑這些 sims?
        </h3>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/lab"
            className="px-8 py-3 border border-gold text-gold text-xs tracking-[0.3em] hover:bg-gold hover:text-navy transition-colors"
          >
            進入實驗室 →
          </Link>
          <Link
            href="/founders"
            className="px-8 py-3 bg-gold text-navy text-xs tracking-[0.3em] hover:bg-gold-soft transition-colors"
          >
            加入等候名單 →
          </Link>
        </div>
      </section>

      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

function BoardStat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="font-mono text-mute text-[9px] sm:text-[10px] tracking-[0.3em] mb-2">
        {label}
      </p>
      <p
        className={`font-mono tabular tracking-tight text-2xl sm:text-3xl ${
          accent ? "text-gold" : "text-bone"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function SignalRow({ match, tier }: { match: Match; tier: Tier }) {
  const tierInfo = TIER_LABEL[tier];
  const edge = Math.abs(match.home.winRate - match.away.winRate);
  const homeFav = match.home.winRate > match.away.winRate;

  return (
    <article
      className={`bg-slate/40 border ${
        tier === "high" ? "border-gold/50" : "border-line/70"
      } p-6 sm:p-8`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
        <div className="flex items-baseline gap-3">
          <span
            className={`font-mono text-[9px] tracking-[0.3em] px-2 py-1 border ${tierInfo.color}`}
          >
            {tierInfo.en}
          </span>
          <span className="font-mono text-mute text-[10px] tracking-[0.25em]">
            {match.league} · {match.startTime}
          </span>
        </div>
        <Link
          href={`/matches/${match.id}`}
          className="font-mono text-gold text-[10px] tracking-[0.3em] hover:opacity-80"
        >
          完整分析 →
        </Link>
      </div>

      {/* Teams + win rates */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-6">
        <div>
          <p className="text-bone text-xl sm:text-2xl font-light tracking-tight">
            {match.home.name}
          </p>
          <p className="font-mono text-gold/60 text-[10px] tracking-[0.25em] mt-1">
            {match.home.en} · HOME
          </p>
        </div>
        <span className="font-mono text-mute/60 text-sm tracking-[0.3em]">
          VS
        </span>
        <div className="text-right">
          <p className="text-bone text-xl sm:text-2xl font-light tracking-tight">
            {match.away.name}
          </p>
          <p className="font-mono text-gold/60 text-[10px] tracking-[0.25em] mt-1">
            {match.away.en} · AWAY
          </p>
        </div>
      </div>

      {/* Win rates + edge */}
      <div className="flex items-baseline justify-between mb-4">
        <span
          className={`font-mono tabular text-3xl sm:text-4xl ${
            homeFav ? "text-gold" : "text-mute"
          }`}
        >
          {match.home.winRate}
          <span className="text-base opacity-60 ml-0.5">%</span>
        </span>
        <span
          className={`font-mono tabular text-3xl sm:text-4xl ${
            !homeFav ? "text-gold" : "text-mute"
          }`}
        >
          {match.away.winRate}
          <span className="text-base opacity-60 ml-0.5">%</span>
        </span>
      </div>

      {/* Bar */}
      <div className="relative h-[2px] bg-line/80 mb-6">
        <div
          className="absolute top-0 left-0 h-full bg-gold glow-gold"
          style={{ width: `${match.home.winRate}%` }}
        />
        <div
          className="absolute -top-1 h-[10px] w-px bg-gold/80"
          style={{ left: `${match.home.winRate}%` }}
        />
      </div>

      {/* Edge + Confidence */}
      <div className="grid grid-cols-2 gap-4 mb-5 pb-5 border-b border-line/40">
        <div>
          <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">
            EDGE
          </p>
          <p className="font-mono text-gold text-xl tabular">+{edge} PP</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-mute text-[9px] tracking-[0.3em] mb-1">
            MODEL CONFIDENCE
          </p>
          <p className="font-mono text-bone text-xl tabular">
            {match.aiConfidence}
            <span className="text-xs text-mute ml-1">/ 100</span>
          </p>
        </div>
      </div>

      {/* WHY editorial */}
      <div>
        <p className="font-mono text-gold/60 text-[9px] tracking-[0.3em] mb-2">
          WHY
        </p>
        <p className="text-mute text-sm leading-relaxed">
          {whyEditorial(match)}
        </p>
      </div>
    </article>
  );
}

function FocusItem({
  label,
  match,
  note,
}: {
  label: string;
  match: Match;
  note: string;
}) {
  const homeFav = match.home.winRate > match.away.winRate;
  return (
    <div>
      <p className="font-mono text-gold/70 text-[10px] tracking-[0.3em] mb-2">
        {label}
      </p>
      <Link
        href={`/matches/${match.id}`}
        className="block group"
      >
        <p className="text-bone text-lg sm:text-xl font-light tracking-tight group-hover:text-gold transition-colors">
          {homeFav ? match.home.name : match.away.name}
          <span className="text-mute mx-2 text-sm">vs</span>
          {homeFav ? match.away.name : match.home.name}
        </p>
        <p className="text-mute text-sm mt-1">{note}</p>
      </Link>
    </div>
  );
}
