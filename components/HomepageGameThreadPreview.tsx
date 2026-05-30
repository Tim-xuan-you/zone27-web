import Link from "next/link";
import type { Match } from "@/lib/matches";

// ── ZONE 27 · HomepageGameThreadPreview ─────────────────
// R149 origin · Tim 8-fire explicit「(賽事討論室)大家都可以看到! 到底在哪裡?」
// · prominent homepage section · 1-click 進 /matches/[gameId]#game-thread。
//
// R174 Polymarket pivot UPDATE · Tim 拍板「打開:免費看 + 天梯名次發言」·
// 此 preview 從「BLACK CARD-gated mockup」reframe 成「OPEN · 免費看 · 登入發言」·
// 對齊 components/GameThread.tsx(real · migration 0004)· 不再付費牆 · 不再
// 假 mockup posts(真實討論串可能是空的 · 下方是「範例」說明格式 · 非假冒真人)。
// ─────────────────────────────────────────────────────

type Props = {
  /** First today match · GameThread linked to this gameId · null when 0 matches */
  match: Match | null;
};

export default function HomepageGameThreadPreview({ match }: Props) {
  // Use first today match if available · else default to most recent finalized
  // game as fallback so 賽事討論室 entry always visible(per Tim 8-fire demand)。
  const gameId = match?.id ?? "cpbl-260526-01";
  const homeName = match?.home.name ?? "味全龍";
  const awayName = match?.away.name ?? "中信兄弟";

  return (
    <section
      aria-label="Homepage 賽事討論室 entry · OPEN · 免費看 · 登入發言"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10"
    >
      <div className="bg-slate/40 border-2 border-gold/40 p-5 sm:p-7">
        {/* ── HEADER ──────────────────────────────────── */}
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-baseline gap-3">
            <span aria-hidden="true" className="text-xl text-gold leading-none">
              💬
            </span>
            <p
              lang="en"
              className="font-mono text-gold text-[11px] sm:text-xs tracking-[0.4em]"
            >
              賽事討論室 · OPEN
            </p>
          </div>
          <span
            lang="en"
            className="font-mono text-gold text-[9px] tracking-[0.3em] tabular px-1.5 py-0.5 border border-gold/50"
            title="免費看 · 登入就能發言 · 不必付費"
          >
            免費看
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight mb-3">
          {homeName} vs {awayName} 賽事討論
        </h3>

        <p className="text-mute text-sm leading-relaxed mb-5">
          免費看 · 登入就能發言(不必付費)· 一場一篇 · 200 字以內 · 發言掛上您的
          海選天梯名次 · Tim 親手 moderate。
        </p>

        {/* ── 範例 · 說明這裡發什麼(非假冒真人 · 真實討論串在內頁)── */}
        <article className="bg-navy/40 border border-line/60 p-4 mb-5">
          <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
            <span className="font-mono text-mute/70 text-[10px] tracking-[0.3em]">
              範例 · 這種討論
            </span>
            <span className="font-mono text-mute/55 text-[9px] tracking-[0.25em]">
              海選天梯 · /ladder
            </span>
          </div>
          <p className="text-mute text-sm leading-relaxed">
            蔣鋐 ERA 1.49 球路控得很穩 · 兄弟若想贏要靠中繼壓制 · 阿部雄大
            雖然 13.1 IP 樣本小但 ERA 0.68 elite small-sample · 真實水準等
            30+ IP 才能評估。
          </p>
        </article>

        {/* ── BIG CTA ─────────────────────────────────── */}
        <div className="text-center">
          <Link
            href={`/matches/${gameId}#game-thread`}
            className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-gold text-navy font-mono text-xs sm:text-sm tracking-[0.3em] hover:bg-gold-soft transition-colors"
            aria-label="進賽事討論室 · 免費看 · 登入發言"
          >
            → 進賽事討論室 · 免費看 · 登入發言
          </Link>
        </div>

        {/* ── footnote ────────────────────────────────── */}
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed text-center mt-5 pt-4 border-t border-line/30">
          ⚓ 不靠付費 · 靠信用 ——{" "}
          <Link
            href="/ladder"
            className="text-gold/80 hover:text-gold underline-offset-4 hover:underline transition-colors"
          >
            海選天梯
          </Link>{" "}
          名次越高 · 發言越有份量 · 自帶測謊器
        </p>
      </div>
    </section>
  );
}
