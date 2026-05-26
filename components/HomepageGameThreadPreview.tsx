import Link from "next/link";
import type { Match } from "@/lib/matches";

// ── ZONE 27 · HomepageGameThreadPreview ─────────────────
// R149 W1 · Tim 8-fire explicit「(賽事討論室)大家都可以看到! 到底在哪裡?
// 可以直接出現在首頁 可以讓人簡易點擊?」 · /matches/[gameId] 30-sec scroll
// 太深 buried · ship NEW BIG visible homepage section · GameThread mockup
// preview + prominent「→ 看完整 賽事討論室」 CTA · brand IP minimum-violation
// preserved per R148 6 constraints · 自由 tier 可讀(scaffold preview) ·
// BLACK CARD-gated 可發言。
//
// Placement on homepage · 顯式 visible · NOT buried in inline strip ·
// 同 HeroLiveCard prominence axis · 大字 readable preview · 1 mockup post
// 顯示 球迷 grammar 範例 · big CTA button 不是 inline link · 訪客 0-click 看到 ·
// 1-click 進 /matches/[gameId]#game-thread 看 full scaffold + 3 mockup posts。
//
// Component structure:
//   1. Header · 💬 賽事討論室 · TODAY {match.id} · BLACK CARD-gated R148 NEW
//   2. Status pill · ⏳ PRE-LAUNCH Q3 2026 · explicit pratfall
//   3. 1 mockup post · 顯示 球迷 grammar 範例(蔣鋐 ERA 1.49 etc)
//   4. Big CTA · 「→ 看完整 賽事討論室 + 3 mockup posts」 link 到
//      /matches/[gameId]#game-thread
//   5. Brand IP footnote · 「6 constraints + 自由可讀 + BLACK CARD 可發言」
//      explicit · per R148 minimum-violation principle
//
// 8-fire pattern resolution:
//   per [[feedback-founder-dogfood-canary]] 8-fire = explicit demand for
//   prominent placement · per [[feedback-zone27-mobile-first]] homepage ≤ 3
//   viewports trade-off for Tim explicit demand · per [[feedback-no-waiting-rule]]
//   ship NOW · per Pratfall axiom 公開「讀 free · 發言 paid」 brand IP
//   constraint visible at homepage layer。
// ─────────────────────────────────────────────────────

type Props = {
  /** First today match · GameThread linked to this gameId · null when 0 matches */
  match: Match | null;
};

export default function HomepageGameThreadPreview({ match }: Props) {
  // Use first today match if available · else default to most recent finalized
  // game as fallback so 賽事討論室 preview always visible(per Tim 8-fire
  // explicit demand「大家都可以看到」 即使 0 today matches state)。
  const gameId = match?.id ?? "cpbl-260526-01";
  const homeName = match?.home.name ?? "味全龍";
  const awayName = match?.away.name ?? "中信兄弟";

  return (
    <section
      aria-label="Homepage GameThread Preview · BLACK CARD-gated 賽事討論室 prominent visible"
      className="mx-auto max-w-3xl w-full px-6 sm:px-10 py-10"
    >
      <div className="bg-slate/40 border-2 border-gold/40 p-5 sm:p-7">
        {/* ── HEADER · big visible 賽事討論室 callout ───── */}
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
          <div className="flex items-baseline gap-3">
            <span aria-hidden="true" className="text-xl text-gold leading-none">
              💬
            </span>
            <p
              lang="en"
              className="font-mono text-gold text-[11px] sm:text-xs tracking-[0.4em]"
            >
              賽事討論室 · BLACK CARD-gated
            </p>
          </div>
          <span
            lang="en"
            className="font-mono text-loss/85 text-[9px] tracking-[0.3em] tabular px-1.5 py-0.5 border border-loss/40"
            title="PRE-LAUNCH Q3 2026 · scaffold LIVE · form 待 BLACK CARD payment ready"
          >
            ⏳ R149 NEW
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl text-bone font-light tracking-tight leading-tight mb-3">
          {homeName} vs {awayName} 賽事討論
        </h3>

        <p className="text-mute text-sm leading-relaxed mb-5">
          BLACK CARD 訂閱者 1-post per game · 200 字以內 · 球迷 grammar(0 betting)·
          24hr 自動 archive · Tim 親手 moderate。
        </p>

        {/* ── MOCKUP POST · 1 sample 球迷 grammar ────── */}
        <article className="bg-navy/40 border border-line/60 p-4 mb-5">
          <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
            <span className="flex items-baseline gap-3">
              <span className="font-mono text-bone text-[10px] tracking-[0.3em]">
                球迷 #042
              </span>
              <span className="font-mono text-mute/70 text-[9px] tracking-[0.3em]">
                · 中信兄弟
              </span>
            </span>
            <span className="font-mono text-mute/60 text-[9px] tracking-[0.25em] tabular">
              MOCKUP · 球迷 grammar 範例
            </span>
          </div>
          <p className="text-mute text-sm leading-relaxed">
            蔣鋐 ERA 1.49 球路控得很穩 · 兄弟若想贏要靠中繼壓制 · 阿部雄大
            雖然 13.1 IP 樣本小但 ERA 0.68 elite small-sample · 真實水準等
            30+ IP 才能評估。
          </p>
        </article>

        {/* ── BIG CTA · 直接 click 看 full scaffold ─── */}
        <div className="text-center">
          <Link
            href={`/matches/${gameId}#game-thread`}
            className="inline-block px-6 sm:px-8 py-3 sm:py-3.5 bg-gold text-navy font-mono text-xs sm:text-sm tracking-[0.3em] hover:bg-gold-soft transition-colors"
            aria-label="看完整 賽事討論室 + 3 mockup posts · per R148 BLACK CARD-gated scaffold"
          >
            → 看完整 賽事討論室 + 3 mockup posts
          </Link>
        </div>

        {/* ── Brand IP footnote · 自由可讀 + BLACK CARD 可發言 ── */}
        <p className="font-mono text-mute/70 text-[10px] tracking-[0.25em] leading-relaxed text-center mt-5 pt-4 border-t border-line/30">
          ⚓ 自由 tier 可讀 · BLACK CARD 訂閱者 NT$ 1,500/season 可發言 · per
          R148 minimum-violation · iron rule 1 narrowed + 11 hold
        </p>
      </div>
    </section>
  );
}
