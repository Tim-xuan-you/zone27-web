import { visibleBriefs, briefHref, briefShortDate } from "@/lib/briefs";
import { getTodayTaipei } from "@/lib/matches";

// ── ZONE 27 · 首頁主打:戰報頭版卡列 ─────────────────────────────────────
// Tim 2026-07-13「戰報要當網站主打」+ 同日「首頁很弱 · 沒感覺厲害在哪」(Polymarket GO):
// Polymarket 的厲害感 = 產品本身攤在首頁,不是形容詞。 卡片從「只有隊名的連結」升級成
// 「有頭條的一口」:每期的鉤子句(hook)直接印在卡上 —— 路過的人不用點進去,三秒就嚐到
// 這份報在賣什麼。 今天(含還沒開打)的刊攤頭版,最多三張;過刊收 /brief。
// 🔴 graceful:一期都沒有 → null;沒 hook 的舊刊只秀對戰(不硬編)。
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
            className="flex flex-col border border-gold/45 bg-gold/[0.05] hover:border-gold hover:bg-gold/[0.09] transition-colors px-5 py-4 group"
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
            {b.hook && (
              <p className="mt-2 text-gold/90 text-sm leading-snug">
                「{b.hook}」
              </p>
            )}
            <p className="mt-auto pt-3 font-mono text-gold/75 group-hover:text-gold text-[10px] tracking-[0.25em]">
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
