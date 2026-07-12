import { visibleBriefs, briefHref, briefShortDate } from "@/lib/briefs";
import { getTodayTaipei } from "@/lib/matches";

// ── ZONE 27 · 首頁主打:戰報頭版卡列 ─────────────────────────────────────
// Tim 2026-07-13「戰報要當網站主打 · 首頁一點都不明顯」:從一條槓升格為 hero 本體。
// 米其林指南封面邏輯:今天(含還沒開打)的刊攤在頭版,最多三張;過刊收 /brief。
// 🔴 graceful:一期都沒有 → null(hero 文案照立 · 卡列消失不留洞)。
export default function HomepageBriefHero() {
  const briefs = visibleBriefs();
  if (briefs.length === 0) return null;
  const today = getTodayTaipei();
  const upcoming = briefs.filter((b) => b.date >= today);
  const featured = (upcoming.length > 0 ? upcoming : briefs.slice(0, 1)).slice(0, 3);
  const more = (upcoming.length > 0 ? upcoming.length : briefs.length) - featured.length;
  return (
    <div className="mt-9 mx-auto max-w-3xl w-full text-left">
      <div className={`grid gap-3 ${featured.length >= 2 ? "sm:grid-cols-2" : ""} ${featured.length >= 3 ? "lg:grid-cols-3" : ""}`}>
        {featured.map((b) => (
          <a
            key={b.no}
            href={briefHref(b)}
            className="block border border-gold/45 bg-gold/[0.05] hover:border-gold hover:bg-gold/[0.09] transition-colors px-5 py-4 group"
          >
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="font-mono text-gold text-[10px] tracking-[0.3em]">NO.{b.no}</span>
              <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em]">
                {b.sport} · {b.date === today ? "本日" : `${briefShortDate(b)} 開打`}
              </span>
            </div>
            <p className="mt-1.5 text-bone text-lg font-light tracking-tight leading-snug">
              {b.matchup}
            </p>
            <p className="mt-2 font-mono text-gold/75 group-hover:text-gold text-[10px] tracking-[0.25em]">
              看整期 →
            </p>
          </a>
        ))}
      </div>
      {more > 0 && (
        <p className="mt-2 text-center font-mono text-mute/60 text-[10px] tracking-[0.2em]">
          還有 {more} 期在指南裡
        </p>
      )}
    </div>
  );
}
