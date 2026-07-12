import Link from "next/link";
import { visibleBriefs, briefShortDate } from "@/lib/briefs";
import { getTodayTaipei } from "@/lib/matches";

// ── ZONE 27 · 首頁「戰報」條 ─────────────────────────────────────────────
// Tim 2026-07-12「把戰前報擺在首頁 · 米其林指南 GO」:當天的刊當招牌 · 舊刊留在 /brief
// 摺疊。 同「今晚這桌」的誠實 staleness:本日沒出刊 → 老實標「最新一期 · M/D」,
// 不對舊刊喊「本日」。 🔴 graceful:一期都沒有 → 整條不渲染(守首頁極簡)。
// ─────────────────────────────────────────────────────
export default function HomepageBriefStrip() {
  const briefs = visibleBriefs();
  if (briefs.length === 0) return null;
  const today = getTodayTaipei();
  // 帶頭的一期 = 還沒開打裡最新出刊的(明天的場今晚就出 → 它才是最新鮮的一張紙);
  // 全是舊刊 → 最新一期老實標日期。visibleBriefs 已按期號新到舊,filter 後第一個即是。
  const upcoming = briefs.filter((b) => b.date >= today);
  const lead = upcoming[0] ?? briefs[0];
  const title =
    lead.date === today
      ? "本日戰報"
      : lead.date > today
        ? `最新戰報 · ${briefShortDate(lead)} 開打`
        : `最新戰報 · ${briefShortDate(lead)}`;
  return (
    <section className="w-full pt-2 pb-2">
      <Link
        href="/brief"
        aria-label={`${title} · NO.${lead.no} ${lead.sport}「${lead.matchup}」· 星星評價格不評輸贏 · 看整期`}
        className="block border border-gold/40 bg-gold/[0.04] hover:border-gold/70 hover:bg-gold/[0.07] transition-colors px-4 py-3 group"
      >
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="font-mono text-gold/80 text-sm shrink-0">
            ▤
          </span>
          <p className="text-bone text-sm leading-snug min-w-0 truncate">
            {title} · <span className="text-gold font-medium">NO.{lead.no}</span>{" "}
            {lead.sport}「{lead.matchup}」
            {upcoming.length > 1 && (
              <span className="text-mute/70"> +{upcoming.length - 1} 期</span>
            )}
          </p>
          <span className="ml-auto shrink-0 font-mono text-gold/80 group-hover:text-gold text-[10px] tracking-[0.25em]">
            看整期 →
          </span>
        </div>
        <p className="mt-1.5 font-mono text-mute/60 text-[10px] sm:text-[11px] tracking-[0.1em]">
          太貴的劃掉 · 值得花腦筋的留下 · 星星評價格,不評輸贏
        </p>
      </Link>
    </section>
  );
}
