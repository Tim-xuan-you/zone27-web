import { visibleBriefs, briefHref, briefShortDate, briefLabel } from "@/lib/briefs";
import { getTodayTaipei } from "@/lib/matches";

// ── ZONE 27 · 首頁主打:戰報頭版「大數字」卡列 ─────────────────────────────
// Tim 2026-07-13「首頁超級雜 · 都是字 · 沒人想看 · 門面竟然趕客」(Polymarket 門面):
// 前一版卡是「隊名 + 一行 hook」= 還是字。 這版讓每張卡由該期的**海報級大數字**領頭
// (48 分 · 53% · 4.5 分)—— 就是 A4 報頭下那個 3 秒鉤子搬上首頁。 像 Polymarket 每張
// 市場磚由一個大百分比領頭:眼睛先吃到數字,不是段落。 一行 hook 給懸念,隊名縮小當註腳。
// 🔴 graceful:一期都沒有 → null;沒 bigNum 的舊刊退回隊名領頭(不硬編數字)。
export default function HomepageBriefHero() {
  const briefs = visibleBriefs();
  if (briefs.length === 0) return null;
  const today = getTodayTaipei();
  const upcoming = briefs.filter((b) => b.date >= today);
  const featured = (upcoming.length > 0 ? upcoming : briefs.slice(0, 1)).slice(0, 3);
  const more = (upcoming.length > 0 ? upcoming.length : briefs.length) - featured.length;
  return (
    <div className="mt-10 mx-auto max-w-3xl w-full">
      <div className={`grid gap-3 text-left ${featured.length >= 2 ? "sm:grid-cols-2" : ""} ${featured.length >= 3 ? "lg:grid-cols-3" : ""}`}>
        {featured.map((b) => (
          <a
            key={b.no}
            href={briefHref(b)}
            className="flex flex-col border border-gold/40 bg-gold/[0.04] hover:border-gold hover:bg-gold/[0.08] transition-colors px-5 pt-4 pb-4 group"
          >
            <div className="flex items-baseline gap-2 font-mono text-mute/60 text-[10px] tracking-[0.25em]">
              <span className="text-gold/70">{briefLabel(b)}</span>
              <span>{b.sport}</span>
              <span className="ml-auto">{b.date === today ? "本日" : briefShortDate(b)}</span>
            </div>

            {/* 海報級大數字 = 視覺錨(3 秒鉤子 · 取代一牆字) */}
            {b.bigNum ? (
              <p className="mt-3 mb-1 leading-none">
                <span className="font-mono text-gold text-[52px] sm:text-[60px] font-light tracking-tight tabular">
                  {b.bigNum}
                </span>
                {b.bigNumUnit && (
                  <span className="font-mono text-gold/60 text-lg ml-1">{b.bigNumUnit}</span>
                )}
              </p>
            ) : (
              <p className="mt-3 mb-1 text-bone text-xl font-light tracking-tight leading-snug">
                {b.matchup}
              </p>
            )}

            {b.hook && (
              <p className="text-bone/90 text-sm leading-snug">{b.hook}</p>
            )}

            {b.bigNum && (
              <p className="mt-2 text-mute/70 text-xs leading-snug">{b.matchup}</p>
            )}

            <p className="mt-auto pt-3 font-mono text-gold/70 group-hover:text-gold text-[10px] tracking-[0.25em]">
              看整期 →
            </p>
          </a>
        ))}
      </div>
      {more > 0 && (
        <p className="mt-3 text-center font-mono text-mute/55 text-[10px] tracking-[0.2em]">
          + 還有 {more} 期在指南裡
        </p>
      )}
    </div>
  );
}
