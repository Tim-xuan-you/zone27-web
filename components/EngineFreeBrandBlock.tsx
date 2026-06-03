import Link from "next/link";

// ── ZONE 27 · Engine Free Brand Block ──────────────────
// Universal brand-axiom block shown on engine pages (/lab, /lab/custom).
// Answers the two questions visitors silently ask when first using the
// engine:
//   1. "Why is this free? Shouldn't it be paid?"
//   2. "Won't unlimited usage burden the server?"
//
// Pre-empts those doubts with the architectural truth (engine runs on
// the visitor's CPU, ZONE 27 server does zero compute per sim) and the
// monetization inversion (we sell identity via GOLD, not the
// tool).
//
// Used in both /lab and /lab/custom so the brand axiom appears at the
// entry point AND on the power-user variant. Single source of truth
// per [[zone27-monetization-philosophy]] memory. Algorithm Step 3
// (SIMPLIFY): extracted from /lab/custom inline so the message lives
// in one place and stays consistent.
// ─────────────────────────────────────────────────────

export default function EngineFreeBrandBlock() {
  return (
    <div className="mt-10 max-w-xl mx-auto pt-6 border-t border-line/40">
      <p
        lang="en"
        className="font-mono text-gold/80 text-[10px] tracking-[0.32em] mb-3"
      >
        ENGINE · FREE · UNLIMITED · RUNS IN YOUR BROWSER
      </p>
      <p className="text-mute text-sm leading-relaxed mb-3">
        您點 RUN,「萬象」引擎在
        <span className="text-bone font-medium">您本機 CPU</span>
        {" "}跑 10,000 次,ZONE 27 伺服器一行運算都不做 —{" "}
        <Link
          href="/audit"
          className="text-gold hover:text-gold-soft transition-colors"
        >
          詳見 /audit Section 04 ENVIRONMENTAL IMPACT
        </Link>
        (碳排 &lt; 0.1g / sim)。
      </p>
      <p className="text-mute text-sm leading-relaxed">
        因為架構零邊際成本,所以沒有 paywall 也沒有 rate limit。
        我們靠{" "}
        <Link
          href="/founders"
          className="text-gold hover:text-gold-soft transition-colors"
        >
          GOLD 會員
        </Link>
        {" "}與 BLACK CPBL 季票社群運作 —— 工具給每個人,身分留給入會的人。
      </p>
    </div>
  );
}
