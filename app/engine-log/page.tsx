import Link from "next/link";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FounderSignOff from "@/components/FounderSignOff";
import ArticleMeta from "@/components/ArticleMeta";
import RelatedReading from "@/components/RelatedReading";
import ReadingProgress from "@/components/ReadingProgress";
import {
  ENGINE_OPS_LOG,
  ENGINE_OPS_LOG_COUNT,
  getLatestEntry,
  type EngineOpsLogEntry,
  type EngineOpsEventType,
} from "@/lib/engine-log-entries";
// R120 W3 · Plausible plausible.io/plausible.io LIVE STATE pattern · per Agent A
// R120 highest-pick · Costly Signal Spence 1973 · publish numbers visitors can
// verify against external sources(git log · matches.ts · founders-stats.ts)。
import {
  getTodayMatches,
  getTrackRecordStats,
} from "@/lib/matches";
import {
  FOUNDERS_CLAIMED,
  FOUNDERS_TOTAL,
} from "@/lib/founders-stats";
import {
  LAST_SHIPPED_DATE_ISO,
  getDaysSinceLastShipped,
} from "@/lib/last-shipped";
import {
  COMMIT_SHA,
  COMMIT_PERMALINK,
  DEPLOYED_AT,
} from "@/lib/build-meta";

export const metadata: Metadata = {
  title: "/engine-log · Engine Operations Log · operational artifact spine",
  description:
    "Stripe Status 2012 + Cloudflare postmortem + Tailscale changelog pattern · ZONE 27 engine operational artifact surface · curated dated log of every engine re-run / receipt correction / input-staleness / methodology update · 「engine alive · someone on it」 signal · APPEND-ONLY per /audit S05 PRE-COMMIT clause · brand IP「方法公開」 物理 codify to operational layer。",
  openGraph: {
    title: "Engine Operations Log · ZONE 27",
    description:
      "Stripe Status pattern · dated operational log · brand IP operational artifact surface · APPEND-ONLY",
    type: "article",
    url: "/engine-log",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engine Operations Log · ZONE 27",
    description:
      "Stripe Status pattern · dated operational log · brand IP operational artifact surface · APPEND-ONLY",
  },
  alternates: {
    canonical: "/engine-log",
  },
};

// ── ZONE 27 · /engine-log · Engine Operations Log ──────
// R76 W-C · Agent A R76 SHIP A ★★★★★ · biggest invisible gap closure ·
// Stripe Status 2012(Amber Feng week-1 hire)+ Cloudflare Nov 2025
// postmortem + Anthropic Sept 2025 postmortem + Tailscale changelog
// dated-entries pattern · ZONE 27 had 46 routes describing the engine but
// NONE recording the engine's OPERATIONAL LIFE · this NEW route closes that
// structural gap pre-launch · operational artifact spine for all future
// trust events。
//
// The cognitive frame this opens(per Agent A R76 honest answer):
//   - When first paying member arrives at NT$ 2,700 · they ask silently
//     「is this engine still being run? when was the last re-run? what
//     changed?」
//   - Every R59-R75 ship has been TRUST GRAMMAR(/audit · /methodology ·
//     /track-record · /receipts · /transparency etc · all describing what
//     ZONE 27 IS)
//   - /engine-log is OPERATIONAL ARTIFACT(records what ZONE 27 DOES day-
//     to-day · the「engine alive · someone on it」 signal cannot fake)
//   - Stripe shipped status page in week 1 of being a company · BEFORE
//     first paying customer · because artifact-of-operation IS proof-of-
//     realness · marketing pages aren't
//
// Brand IP fit:
//   - per [[zone27-disclosure-philosophy]] · publishes weakness(re-runs
//     admitted not hidden)· same Pratfall axis as /track-record DIVERGED
//     等大 + /audit S05 PRE-COMMIT
//   - per [[feedback-zone27-pratfall-brand-ip]] · 「engine alive」 signal
//     Costly Signaling 100× per Spence 1973
//   - per /ethics commitment #5 · 7-day post-final ingest SLA · /engine-log
//     entries 物理 codify the SLA discharge events
//   - per /audit S05 PRE-COMMIT · append-only · same single-source pattern
//     as ENGINE_DIFF_BEACONS + NO_PUSH_INVENTORY + RECIPROCITY_LEDGER
//
// 不做 anti-pattern:
//   ✕ NO live uptime monitor / availability dashboard(static text only)
//   ✕ NO「subscribe to engine status digest」 CTA(violates 不打擾就是禮物)
//   ✕ NO push notification for new entries(per NoPushManifest R73 W-D)
//   ✕ NO public engine error count / error rate(per /privacy 0-telemetry)
//   ✕ NO blame / point-fingers grammar(Tim solo · errors are Tim errors)
// ─────────────────────────────────────────────────────

// R120 W3 · revalidate 86400 → 600 · LIVE STATE section depends on
// getTodayMatches() which is timezone-sensitive(Asia/Taipei midnight rollover)·
// 10-minute ISR keeps「TODAY · N 場」 accurate · 同 homepage + /matches cadence。
export const revalidate = 600;

const EVENT_TYPE_LABEL: Record<EngineOpsEventType, string> = {
  "engine-launch": "ENGINE LAUNCH",
  "engine-evolution": "ENGINE EVOLUTION",
  "receipt-ingest": "RECEIPT INGEST",
  "receipt-correction": "RECEIPT CORRECTION",
  "input-staleness": "INPUT STALENESS",
  "methodology-update": "METHODOLOGY UPDATE",
  "ops-log-meta": "OPS-LOG META",
};

const EVENT_TYPE_COLOR: Record<EngineOpsEventType, string> = {
  "engine-launch": "text-gold border-gold/60",
  "engine-evolution": "text-gold/85 border-gold/40",
  "receipt-ingest": "text-bone/85 border-line/60",
  "receipt-correction": "text-loss/85 border-loss/40",
  "input-staleness": "text-loss/85 border-loss/40",
  "methodology-update": "text-bone/85 border-line/60",
  "ops-log-meta": "text-mute/85 border-mute/40",
};

export default function EngineLogPage() {
  const latest = getLatestEntry();
  // Reverse for newest-first display(canonical for status pages · Stripe +
  // Cloudflare + Tailscale all newest-first)。 Lib stays ASCENDING canonical
  // append-only · render layer reverses。
  const entriesNewestFirst = [...ENGINE_OPS_LOG].reverse();
  // R120 W3 · LIVE STATE derived state · 全 sources public · 0 internal metric ·
  // 0 telemetry · server-rendered · 600s ISR · 同 Plausible/Berkshire pattern。
  const todayMatches = getTodayMatches();
  const stats = getTrackRecordStats();
  const daysSinceShipped = getDaysSinceLastShipped();

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div className="flex items-baseline gap-3 mb-4 flex-wrap section-reveal">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em]"
            >
              / ENGINE-LOG · OPERATIONAL ARTIFACT
            </p>
            <span
              lang="en"
              className="font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border border-gold/60 text-gold tabular"
              title={`${ENGINE_OPS_LOG_COUNT} entries · APPEND-ONLY · per /audit S05 PRE-COMMIT clause`}
            >
              {ENGINE_OPS_LOG_COUNT} ENTRIES · APPEND-ONLY
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight max-w-3xl">
            Engine Operations Log
          </h1>
          {/* Cold Gold Hairline · R54 W-C signature moat */}
          <div className="zone27-rule max-w-[260px] mt-5" aria-hidden="true" />
          <p className="editorial-dropcap mt-8 text-mute leading-relaxed max-w-2xl">
            Stripe Status 2012(Amber Feng week-1 hire · status page as brand
            artifact #1)+ Cloudflare 2025-11-18 postmortem + Tailscale
            changelog pattern · ZONE 27 engine operational artifact 開始。
            Every engine re-run · receipt correction · input-staleness ·
            methodology update · 公開 dated · APPEND-ONLY · 不藏 · 不假裝。
          </p>
          <p className="mt-4 text-mute/85 leading-relaxed max-w-2xl">
            Why this page exists: 當第一個 NT$ 2,700 paying member arrives ·
            他們 silently ask 「is this engine still being run? when was the
            last re-run? what changed?」 · 此 log IS the answer surface 不是
            marketing copy · 不是 narrative · 是{" "}
            <strong className="text-bone">
              「engine alive · someone on it」 mechanical signal
            </strong>{" "}
            · cannot fake · per Stripe Status 2012 brand artifact axiom。
          </p>
          {latest && (
            <div className="mt-6 bg-slate/40 border border-gold/30 px-5 py-4">
              <p
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.35em] mb-1.5"
              >
                ⚓ LATEST EVENT · {latest.date} ·{" "}
                {EVENT_TYPE_LABEL[latest.eventType]}
              </p>
              <p className="text-bone text-sm leading-relaxed">
                {latest.label}
              </p>
            </div>
          )}
          <div className="mt-6">
            <ArticleMeta readingMin={3} />
          </div>
        </section>

        <div className="mx-auto w-32 gold-line mb-12" />

        {/* ── LIVE STATE · R120 W3 · Agent A R120 highest-pick · Plausible
            plausible.io/plausible.io public-self-dashboard pattern · per Spence
            1973 Costly Signaling · 同 Berkshire 60-year letters summary-table
            top-of-page tradition · 不違反 /engine-log「NO live uptime monitor」
            anti-pattern 因 此 grid 為 server-rendered ISR-static · NOT
            real-time uptime · NOT availability SLA · 純 publicly-derivable
            counts(matches.ts + founders-stats.ts + git log + build env)·
            每個數字 visitor 可 git-clone repo 自己 verify · brand IP「方法公開」
            從 narrative 升 numeric。 R120 W5 · id="live-state" anchor 加 ·
            enable hash-link from Cmd-K + /receipts cross-link → numeric
            dashboard directly。 ─────────────────────────────── */}
        <section id="live-state" className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 scroll-mt-8">
          <div className="flex items-baseline gap-3 mb-6 flex-wrap">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em]"
            >
              / LIVE STATE · 600s ISR · 0 telemetry
            </p>
            <p
              lang="en"
              className="font-mono text-mute/70 text-[9px] tracking-[0.3em] tabular"
            >
              EVERY METRIC DERIVABLE FROM PUBLIC DATA
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StateCell
              label="TODAY"
              value={`${todayMatches.length}`}
              sub={todayMatches.length === 0 ? "今日無 CPBL" : "場 CPBL"}
            />
            <StateCell
              label="FINALIZED"
              value={`${stats.total}`}
              sub="場 進 ledger"
            />
            <StateCell
              label="✓ PROVED"
              value={`${stats.proved}`}
              accent="gold"
              sub="side 預測中"
            />
            <StateCell
              label="✕ DIVERGED"
              value={`${stats.diverged}`}
              accent="loss"
              sub="side 預測未中"
            />
            <StateCell
              label="0 HIDDEN"
              value="0"
              accent="gold"
              sub="100% published"
            />
            <StateCell
              label="FOUNDERS"
              value={`${FOUNDERS_CLAIMED}/${FOUNDERS_TOTAL}`}
              sub={`${FOUNDERS_TOTAL - FOUNDERS_CLAIMED} 席 永不再開`}
            />
            <StateCell
              label="LAST SHIPPED"
              value={LAST_SHIPPED_DATE_ISO}
              sub={
                daysSinceShipped === 0
                  ? "今天"
                  : daysSinceShipped === 1
                  ? "1 天前"
                  : `${daysSinceShipped} 天前`
              }
            />
            <StateCell
              label="BUILD"
              value={COMMIT_SHA}
              sub={DEPLOYED_AT}
              href={COMMIT_PERMALINK}
            />
          </div>
          <p className="mt-6 font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed">
            ⚓ Plausible「plausible.io/plausible.io」 + Berkshire summary table
            pattern · 每個 cell value 直接 derive 自 public source · git clone
            zone27-web 自己 reproduce · 無內部 metric · 無 ad tracker · 無 user
            telemetry · per /audit S05 PRE-COMMIT clause 同 axis。
          </p>
        </section>

        {/* ── LOG ENTRIES · newest-first ──────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12">
          <div className="flex items-baseline gap-3 mb-6 flex-wrap">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.4em]"
            >
              / LOG ENTRIES · {ENGINE_OPS_LOG_COUNT} TOTAL · NEWEST FIRST
            </p>
            <p
              lang="en"
              className="font-mono text-mute/70 text-[9px] tracking-[0.3em] tabular"
            >
              APPEND-ONLY · /AUDIT S05 PRE-COMMIT
            </p>
          </div>
          <ol className="space-y-5">
            {entriesNewestFirst.map((entry, idx) => (
              <LogEntry key={`${entry.date}-${idx}`} entry={entry} />
            ))}
          </ol>
        </section>

        {/* ── HOW THIS LOG WORKS ─────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-12 border-t border-line/40 pt-12">
          <p
            lang="en"
            className="font-mono text-gold text-[10px] tracking-[0.4em] mb-4"
          >
            / HOW THIS LOG WORKS · 4 binding rules
          </p>
          <ol className="space-y-3 text-mute text-sm leading-relaxed">
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                01
              </span>
              <span className="flex-1">
                <strong className="text-bone">APPEND-ONLY</strong> · 每筆 entry
                date 是 physical truth · 修改任 entry 需 30 天前{" "}
                <Link
                  href="/changelog"
                  className="text-gold/85 hover:text-gold underline-offset-4 hover:underline"
                >
                  /changelog
                </Link>{" "}
                公告。
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                02
              </span>
              <span className="flex-1">
                <strong className="text-bone">NEVER delete</strong> · 若 event
                reverted · add NEW reverse entry · 不刪 commit history · per
                Stripe Status 2012 + Cloudflare 2025 postmortem template。
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                03
              </span>
              <span className="flex-1">
                <strong className="text-bone">NO BLAME GRAMMAR</strong> · Tim
                solo founder · errors are Tim errors · 不 assign blame · per
                Anthropic 2025-09 postmortem style(community feedback:trust
                is spent on COMMUNICATION SPEED not BLAME)。
              </span>
            </li>
            <li className="flex gap-3 items-baseline">
              <span
                lang="en"
                className="font-mono text-gold/85 text-[10px] tracking-[0.3em] tabular shrink-0"
              >
                04
              </span>
              <span className="flex-1">
                <strong className="text-bone">CITE PHYSICAL TRUTH</strong> ·
                每 entry MUST 引用 receipt-id 或 methodology section 或 commit
                SHA 或 /now journal entry · 不 inline marketing。
              </span>
            </li>
          </ol>
        </section>

        <FounderSignOff>
          <p>
            Stripe Status 2012 · Amber Feng week-1 hire(Stripe 第一位 員工)·
            shipped status page BEFORE 第一個 paying customer · 因為
            operational artifact IS the proof-of-realness · marketing pages
            aren&rsquo;t。 ZONE 27 採同 axis at Year-Zero。
          </p>
          <p>
            這個 log 不 dynamic · 不 monitoring · 不 ping engine uptime · 不發
            push · 不收 email digest subscribe。 純 static dated text · per
            Tailscale Changelog + Linear Now-Next-Later horizon-language pattern。
          </p>
          <p>
            APPEND-ONLY · 修改任 entry 需 30 天前 /changelog 公告 · 違反 = brand
            信用 collapse。
          </p>
        </FounderSignOff>

        <RelatedReading currentPath="/engine-log" />

        {/* ── BACK ─────────────────────────────────── */}
        <section className="mx-auto max-w-3xl w-full px-6 sm:px-10 pb-24 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/audit"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              ← /audit · 完整 model report
            </Link>
            <Link
              href="/track-record"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /track-record · 受 ledger →
            </Link>
            <Link
              href="/changelog"
              className="font-mono text-mute hover:text-gold text-[10px] tracking-[0.4em] transition-colors"
            >
              /changelog · git history →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────

// R120 W3 · LIVE STATE numeric cell · brand-pure dark-navy + cold-gold + bone
// · 4-row vertical typography(label · value · sub)· optional href for BUILD
// linking to GitHub commit · 0 deps · 0 JS · 0 client-side。
function StateCell({
  label,
  value,
  sub,
  accent = "default",
  href,
}: {
  label: string;
  value: string;
  sub?: string;
  /** Visual emphasis · "gold" for positive signals · "loss" for honest negatives */
  accent?: "default" | "gold" | "loss";
  /** Optional external link · used for BUILD SHA → GitHub commit */
  href?: string;
}) {
  const valueColor =
    accent === "gold"
      ? "text-gold"
      : accent === "loss"
      ? "text-loss/85"
      : "text-bone";
  const borderColor =
    accent === "gold"
      ? "border-gold/40"
      : accent === "loss"
      ? "border-loss/40"
      : "border-line/50";

  const inner = (
    <div className={`border ${borderColor} bg-slate/30 p-3 sm:p-4 h-full`}>
      <p
        lang="en"
        className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1.5"
      >
        {label}
      </p>
      <p className={`font-mono ${valueColor} text-xl sm:text-2xl tabular leading-none`}>
        {value}
      </p>
      {sub && (
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.2em] mt-1.5 tabular">
          {sub}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:opacity-90 transition-opacity"
        aria-label={`${label} · ${value} · ${sub ?? ""} · 開 GitHub`}
      >
        {inner}
      </a>
    );
  }
  return inner;
}

function LogEntry({ entry }: { entry: EngineOpsLogEntry }) {
  const typeColor = EVENT_TYPE_COLOR[entry.eventType];
  const typeLabel = EVENT_TYPE_LABEL[entry.eventType];

  return (
    <li className="border border-line/50 bg-slate/30 p-5 sm:p-6">
      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        <p
          lang="en"
          className={`font-mono text-[10px] tracking-[0.3em] tabular px-2 py-0.5 border ${typeColor}`}
        >
          {typeLabel}
        </p>
        <p className="font-mono text-mute text-[10px] tracking-[0.3em] tabular">
          {entry.date}
        </p>
        {entry.receiptId && (
          <p className="font-mono text-gold/70 text-[9px] tracking-[0.25em] tabular">
            ⌗ {entry.receiptId}
          </p>
        )}
      </div>
      <h3 className="text-bone text-base sm:text-lg font-light tracking-tight mb-2 leading-snug">
        {entry.label}
      </h3>
      <p className="text-mute text-sm leading-relaxed">{entry.detail}</p>
      <div className="mt-3 pt-3 border-t border-line/30 flex items-baseline gap-3 flex-wrap">
        {entry.href && (
          <Link
            href={entry.href}
            className="font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline"
          >
            → {entry.href}
          </Link>
        )}
        {entry.receiptId && (
          <Link
            href={`/receipts/${entry.receiptId}`}
            className="font-mono text-gold/85 hover:text-gold text-[10px] tracking-[0.25em] underline-offset-4 hover:underline"
          >
            → /receipts/{entry.receiptId}
          </Link>
        )}
      </div>
    </li>
  );
}
