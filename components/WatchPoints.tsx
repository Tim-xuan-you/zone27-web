import Link from "next/link";
import type { WatchPoint } from "@/lib/watch-points";

// ── ZONE 27 · 今日看點(區塊)─────────────────────────────────────────────────
// 純展示 · 同步 server component · 資料由頁面算好傳入(共用元件不 fetch · 房規)。
// 視覺:全站暗卡語法 · 實心金徽只給「最熱」一格(全站稀有度慣例 · 同 MiniMatchCard 最熱標)·
// 其餘走邊框徽。 誠實 footer:看點=有戲,不是保證誰贏(同操盤風格「風格≠準度」那行)。
// 0 個看點 → 整節不渲染(不攤空牆 · 不假裝熱鬧)。
// ─────────────────────────────────────────────────────

const BADGE_CLASS: Record<WatchPoint["reason"]["kind"], string> = {
  hot: "bg-gold text-navy",
  strong: "border border-gold/60 text-gold",
  tossup: "border border-gold/40 text-gold/80",
};

export default function WatchPoints({ points }: { points: WatchPoint[] }) {
  if (points.length === 0) return null;

  return (
    <section className="mt-10">
      <p className="font-mono text-mute/70 text-[10px] tracking-[0.45em] mb-3">
        / 今日看點 · <span lang="en">WHAT TO WATCH</span>
      </p>

      <ul className="flex flex-col gap-2.5">
        {points.map((p) => (
          <li key={p.id}>
            <Link
              href={p.href}
              className={`block border p-4 transition-colors ${
                p.reason.kind === "hot"
                  ? "border-gold/40 bg-slate/40 hover:border-gold/70"
                  : "border-line/60 bg-slate/30 hover:border-gold/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className={`font-mono text-[8px] tracking-[0.2em] px-1.5 py-0.5 shrink-0 ${BADGE_CLASS[p.reason.kind]}`}
                  >
                    {p.reason.badge}
                  </span>
                  <span className="font-mono text-mute/60 text-[9px] tracking-[0.15em] truncate">
                    {p.sport} · {p.league}
                  </span>
                </span>
                <span className="font-mono text-mute text-[10px] tracking-[0.15em] tabular shrink-0">
                  {p.startLabel} 開賽
                </span>
              </div>

              <p className="text-bone text-base font-light tracking-tight leading-snug mb-1.5">
                {p.matchup}
                <span className="ml-2.5 font-mono text-gold/70 text-[11px] tabular whitespace-nowrap">
                  {p.line}
                </span>
              </p>

              <p className="font-mono text-mute text-[10px] tracking-[0.08em] leading-relaxed">
                {p.reason.detail}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* 誠實 footer:策展≠保證 · 準不準去校準頁對帳(同「風格≠準度」紀律) */}
      <p className="mt-3 font-mono text-mute/55 text-[10px] tracking-[0.15em] leading-relaxed">
        看點 = 這場有戲 · 不是保證誰贏 —— 引擎準不準,
        <Link
          href="/calibration"
          className="underline underline-offset-4 hover:text-gold transition-colors"
        >
          對帳都公開
        </Link>
        。
      </p>
    </section>
  );
}
