import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { visibleBriefs, briefHref, briefShortDate, briefLabel, type BriefIssue } from "@/lib/briefs";
import { getTodayTaipei } from "@/lib/matches";
import { createPageMetadata } from "@/lib/page-og";

// ── ZONE 27 · /brief · 戰報(米其林式賽前評鑑)────────────────────────────────
// Tim 2026-07-12「米其林指南!GO · 當天的擺首頁 · 前一天或更之前的摺疊起來」。
// 定位:美食評論員的角度 —— 星星評「這張票的價格」,不評輸贏;每一期出刊後,
// 賽果自己會說話。 跟明牌站的分水嶺不在文筆,在「敢不敢讓你回去對帳」——
// 所以這頁角落永遠掛著公開戰績(指南為主 · 戰績為證,不刪、只退居保固書)。
//
// 版面:本日刊(date = 台北今天)當主打;沒有本日刊 → 最新一期老實標日期(同「今晚
// 這桌」staleness 精神 · 不對舊刊喊今天)。 過刊按日期摺疊(<details> · 零 JS)。
// 每期連到 A4 原版(public/briefs · 門店列印同一份 = 線上線下同一張紙,不做兩套)。
// ─────────────────────────────────────────────────────

export const metadata = createPageMetadata({
  title: "戰報 · 賽前評鑑",
  description:
    "ZONE 27 戰報:每天挑場,把運彩盤口一格一格攤開 —— 哪張票太貴、哪張票還有呼吸空間。 星星評的是價格,不是輸贏;每一期出刊後賽果自己會說話。 免費 · 歡迎店家整頁影印。",
  ogTitle: "ZONE 27 戰報 · 米其林式賽前評鑑",
  ogDescription:
    "星星評價格 · 不評輸贏 · 太貴的劃掉 · 值得花腦筋的留下 · 每一期賽後對得了帳 · 免費",
  path: "/brief",
  type: "article",
});

export const revalidate = 300;

export default function BriefPage() {
  const today = getTodayTaipei();
  const briefs = visibleBriefs();
  // 主打 = 今天的刊 + 還沒開打的刊(賽前出刊是常態:明天的場今晚就出 → 不能埋進過刊)。
  // 都沒有 → 最新一期當主打、老實標日期(不喊「本日」)。
  const upcoming = briefs.filter((b) => b.date >= today);
  const featured = upcoming.length > 0 ? upcoming : briefs.slice(0, 1);
  // 標籤誠實:主打裡有未來場 → 「最新出刊」;全是今天 → 「本日戰報」;只剩舊刊 → 「最新一期」。
  const featuredLabel =
    upcoming.length === 0
      ? "/ 最新一期"
      : featured.some((b) => b.date > today)
        ? "/ 最新出刊"
        : "/ 本日戰報";
  const featuredNos = new Set(featured.map((b) => b.no));
  const archive = briefs.filter((b) => !featuredNos.has(b.no));
  // 過刊按日期分組(新到舊)· 摺疊。
  const byDate = new Map<string, BriefIssue[]>();
  for (const b of archive) {
    if (!byDate.has(b.date)) byDate.set(b.date, []);
    byDate.get(b.date)!.push(b);
  }
  const dates = [...byDate.keys()].sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Nav />

      <main id="main">
        {/* ── HERO ── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pt-16 pb-8">
          <p className="font-mono text-gold text-[10px] tracking-[0.45em] mb-4">
            / 戰報 · THE PRE-MATCH BRIEF
          </p>
          <h1 className="text-3xl sm:text-4xl text-bone font-light tracking-tight leading-tight">
            星星評<span className="text-gold">價格</span> · 不評輸贏
          </h1>
          <div className="zone27-rule max-w-[280px] mt-5 mb-5" aria-hidden="true" />
          <p className="text-mute text-base leading-relaxed">
            每天挑場,把運彩的盤口一格一格攤開:<span className="text-bone">太貴的劃掉、
            值得花腦筋的留下</span> —— 像評鑑餐廳,不幫你點菜。 一天一期、賽前出刊、
            <span className="text-bone">出刊後不改一個字</span>。
          </p>
          {/* 引擎介紹依 Tim 拍板(2026-07-13):寫「世界統計過的勝率」· 不主打自家對帳。 */}
          <p className="mt-3 text-mute text-base leading-relaxed">
            我們用的是全世界通用的演算法(蒙地卡羅、Elo 這一類)—— 這類引擎賽前算單場,
            全世界統計的天花板大約 <span className="text-bone">5 成 7</span>。
            所以本報不賣神準,賣的是把每張票的<span className="text-bone">價格</span>看清楚。
          </p>
        </section>

        {/* ── 本日刊(或最新一期 · 老實標日期)── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-8">
          <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">
            {featuredLabel}
          </p>
          <ul className="list-none pl-0 m-0 space-y-3">
            {featured.map((b) => (
              <li key={b.no}>
                <a
                  href={briefHref(b)}
                  className="block border border-gold/45 bg-gold/[0.05] hover:border-gold hover:bg-gold/[0.09] transition-colors px-5 py-4 group"
                >
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="font-mono text-gold text-[10px] tracking-[0.3em]">
                      {briefLabel(b)}
                    </span>
                    <span className="font-mono text-mute/70 text-[10px] tracking-[0.2em]">
                      {b.sport} · {briefShortDate(b)}
                    </span>
                    <span className="ml-auto font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.25em] shrink-0">
                      看整期 →
                    </span>
                  </div>
                  <p className="mt-1.5 text-bone text-lg sm:text-xl font-light tracking-tight">
                    {b.matchup}
                  </p>
                  {b.hook && (
                    <p className="mt-1.5 text-gold/90 text-sm leading-snug">「{b.hook}」</p>
                  )}
                  {b.note && (
                    <p className="mt-0.5 font-mono text-mute/70 text-[10px] tracking-[0.2em]">
                      {b.note}
                    </p>
                  )}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2.5 font-mono text-mute/55 text-[10px] tracking-[0.15em] leading-relaxed">
            每期都是門店 A4 原版 —— 線上看的跟店裡印的是同一張紙 · 歡迎整頁影印
          </p>
          <p className="mt-1.5 font-mono text-mute/45 text-[10px] tracking-[0.1em] leading-relaxed">
            電文呼號怎麼讀:<span className="text-gold/60">Z27</span> · 運動(棒/足/籃/排)· 當年第幾天 · 當天第幾張 —— 看得懂的,都是內行。
          </p>
        </section>

        {/* ── 過刊(摺疊 · 要看的人再打開)── */}
        {dates.length > 0 && (
          <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-16">
            <p className="font-mono text-gold/70 text-[10px] tracking-[0.4em] mb-3">
              / 過刊 · {archive.length} 期
            </p>
            <div className="border-t border-line/40">
              {dates.map((d) => {
                const list = byDate.get(d)!;
                return (
                  <details key={d} className="border-b border-line/40 group">
                    <summary className="cursor-pointer list-none py-3 flex items-baseline gap-3 hover:text-gold transition-colors">
                      <span className="font-mono text-bone/85 text-sm tabular">
                        {briefShortDate(list[0])}
                      </span>
                      <span className="font-mono text-mute/60 text-[10px] tracking-[0.2em]">
                        {list.length} 期 · {[...new Set(list.map((b) => b.sport))].join(" · ")}
                      </span>
                      <span
                        aria-hidden="true"
                        className="ml-auto font-mono text-mute/50 text-[10px] group-open:rotate-90 transition-transform"
                      >
                        ▸
                      </span>
                    </summary>
                    <ul className="list-none pl-0 m-0 pb-3 space-y-1.5">
                      {list.map((b) => (
                        <li key={b.no}>
                          <a
                            href={briefHref(b)}
                            className="flex items-baseline gap-3 px-3 py-1.5 border border-line/50 hover:border-gold/40 hover:bg-gold/[0.04] transition-colors"
                          >
                            <span className="font-mono text-gold/70 text-[10px] tracking-[0.2em] shrink-0">
                              {briefLabel(b)}
                            </span>
                            <span className="font-mono text-mute/60 text-[10px] tracking-[0.15em] shrink-0">
                              {b.sport}
                            </span>
                            <span className="text-bone/90 text-sm truncate">{b.matchup}</span>
                            {b.note && (
                              <span className="font-mono text-gold/60 text-[9px] tracking-[0.15em] shrink-0">
                                {b.note}
                              </span>
                            )}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}
            </div>
          </section>
        )}

        {/* ── 底線(同 A4 底欄的誠實聲明 · 站上版)── */}
        <section className="mx-auto max-w-2xl w-full px-6 sm:px-10 pb-16">
          <p className="font-mono text-mute/55 text-[10px] tracking-[0.15em] leading-relaxed border-t border-line/40 pt-4">
            星星是價格評論,不是輸贏預測 · 本報不收博彩業者的廣告與贊助 · 不保證獲利 ·
            我們不是賭場、不接受下注 —— 本報負責把價看清楚,決定永遠在您手上。
            出刊後賽果自己會說話;引擎的每一場帳一直在{" "}
            <Link href="/track-record" className="text-mute/70 hover:text-gold underline-offset-4 hover:underline">
              公開戰績
            </Link>
            ,要查的人查得到。
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
