import Link from "next/link";
import type { Metadata } from "next";
import { PRODUCT_VERSION } from "@/lib/build-meta";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyLinkButton from "@/components/CopyLinkButton";
import RelatedReading from "@/components/RelatedReading";
import ReadingProgress from "@/components/ReadingProgress";

export const metadata: Metadata = {
  title: "Coverage — 我們覆蓋哪些賽事 · 為什麼不覆蓋全部",
  description:
    "ZONE 27 不覆蓋每一場可下注的比賽,只覆蓋引擎可以誠實計算的比賽。完整公開:作用中的聯盟、追蹤但未啟用的賽事、你建議想看 Tim 親手讀的賽事、我們永遠不會覆蓋的(博彩平台清單)。",
};

// /coverage — Coverage Manifesto · 4th trust-artifact joining /audit + /methodology + /privacy。

type StatusKey = "READY" | "HAND_CURATED" | "DEMO" | "AVAILABLE" | "PENDING" | "NEVER";

const STATUS_STYLE: Record<StatusKey, string> = {
  READY:
    "text-gold border-gold/60 bg-gold/5",
  HAND_CURATED:
    "text-gold border-gold/50 bg-gold/5",
  DEMO:
    "text-bone border-bone/60 bg-bone/5",
  AVAILABLE:
    "text-mute border-mute/40 bg-mute/5",
  PENDING:
    "text-mute border-mute/30",
  NEVER:
    "text-loss border-loss/40 bg-loss/5",
};

function StatusBadge({ status, label }: { status: StatusKey; label?: string }) {
  return (
    <span
      lang="en"
      className={`inline-flex items-center px-2 py-0.5 border font-mono text-[10px] tracking-[0.18em] ${STATUS_STYLE[status]}`}
    >
      {label ?? status}
    </span>
  );
}

type LeagueRow = {
  code: string;
  zh: string;
  source: string;
  sampleNote: string;
  status: StatusKey;
  statusLabel?: string;
};

const ACTIVE_LEAGUES: LeagueRow[] = [
  {
    code: "MLB",
    zh: "美國職棒大聯盟",
    source: "statsapi.mlb.com · 官方公開 API",
    sampleNote: "全季 ~2,430 場 · 投手 N 普遍 ≥ 15",
    status: "READY",
  },
  {
    code: "CPBL",
    zh: "中華職棒",
    source: "stats.cpbl.com.tw · 官方公開資料 · 由 Tim 親手讀過每一場 + 寫進引擎",
    sampleNote: "目標 ~240 場/年 · 創辦人親自 curate · 自動化等規模到時啟動",
    status: "HAND_CURATED",
    statusLabel: "HAND-CURATED",
  },
];

export default function CoveragePage() {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />
      <ReadingProgress />

      <main id="main">
        <article className="mx-auto max-w-3xl w-full px-6 sm:px-10 pt-20 pb-12">
          <div
            lang="en"
            className="print-only mb-6 pb-3 border-b border-line/60 font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            <div className="flex justify-between gap-4">
              <span>ZONE 27 — COVERAGE LEDGER {PRODUCT_VERSION}</span>
              <span>PRINTED · zone27-web.vercel.app/coverage</span>
            </div>
          </div>

          {/* ── HEADER ──────────────────────────────── */}
          <header className="pb-10 border-b border-line/60">
            <p
              lang="en"
              className="font-mono text-gold text-[10px] tracking-[0.45em] mb-6"
            >
              COVERAGE LEDGER
            </p>
            <h1 className="text-4xl sm:text-5xl text-bone font-light tracking-tight leading-[1.1] mb-6">
              我們覆蓋哪些賽事 ·{" "}
              <span className="text-mute">為什麼不覆蓋全部</span>
            </h1>

            <p className="text-bone text-lg sm:text-xl leading-relaxed mb-6 border-l-2 border-gold/60 pl-5 sm:pl-6 max-w-2xl">
              目前涵蓋 CPBL + MLB + 部分足球 · 親手挑 · 會擴。
            </p>
          </header>

          {/* ── ACTIVE LEAGUES ─────────────────────── */}
          <section className="py-12 border-b border-line/40 section-reveal">
            <p lang="en" className="font-mono text-mute text-[10px] tracking-[0.45em] mb-4">
              ACTIVE LEAGUES
            </p>
            <h2 className="text-2xl sm:text-3xl text-bone font-light tracking-tight mb-6">
              引擎已就緒,資料流動中
            </h2>
            <LeagueTable rows={ACTIVE_LEAGUES} />
          </section>

          {/* ── FINAL CTA / SHARE ─────────────────────── */}
          <section className="py-12">
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/matches"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gold text-navy hover:bg-gold-soft transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                看今日賽事 →
              </Link>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-5 py-3 border border-line/60 hover:border-gold/60 text-mute hover:text-gold transition-colors font-mono text-[11px] tracking-[0.3em]"
              >
                加入會員
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-line/40">
              <CopyLinkButton refTag="coverage-share" />
            </div>
          </section>

          <RelatedReading currentPath="/coverage" />
        </article>
      </main>

      <Footer />
    </div>
  );
}

function LeagueTable({ rows }: { rows: LeagueRow[] }) {
  return (
    <div className="border border-line/40 divide-y divide-line/30">
      {rows.map((row) => (
        <div
          key={row.code}
          className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6"
        >
          <div className="sm:w-32 shrink-0">
            <p lang="en" className="font-mono text-gold text-sm tracking-[0.22em] mb-1">
              {row.code}
            </p>
            <p className="text-mute text-xs">{row.zh}</p>
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-bone text-sm leading-relaxed">{row.source}</p>
            <p className="text-mute text-xs leading-relaxed">{row.sampleNote}</p>
          </div>

          <div className="shrink-0">
            <StatusBadge status={row.status} label={row.statusLabel} />
          </div>
        </div>
      ))}
    </div>
  );
}
