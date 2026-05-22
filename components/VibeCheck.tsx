// ── ZONE 27 · Vibe Check Lens ──────────────────────────
// Round 37 W-B · 第 1 個 BLACK CARD analytical lens 真實 LIVE ship · 不
// scaffold mode · per [[feedback-no-waiting-rule]] iron rule「任何現在能
// 做就做 · 不等 Q3」。
//
// 從 R36 W-A Lens Variety table 第 2 個 candidate 落地真實:
//   - 用 existing match.home.recent + match.away.recent 5-場戰績 array
//   - 純 data viz · 不假 prediction accuracy promise
//   - 「hot hand fallacy」 educational disclaimer(Tversky / Gilovich 1985)
//   - brand IP「方法公開」 延伸:cite academic source · publish methodology
//
// Brand IP 全 ✓:
//   - 0 prediction promise(visualizer not predictor · 同 Lens Variety axiom)
//   - 0 cash · 0 referral · 0 social transfer
//   - Pratfall · 公開「連勝 ≠ 下一場必贏 · 連敗 ≠ 必輸」 educational angle
//   - 0「自研理論包裝」 · cite Tversky/Gilovich 1985 verifiable academic paper
//
// Render placement:/matches/[gameId] hero 下方 · 2 teams 各 render 一次
// (home + away parallel)。 BLACK CARD-gated 是 future · 現在 free render
// 因 currently no functional auth tier gating(per /membership/black-card
// 月卡手動 LIVE 但無自動 gating · Tim 親手 onboard 觀察 actual paid user)。
// ─────────────────────────────────────────────────────

type RecentResult = "W" | "L";

type Props = {
  teamName: string;
  recent: RecentResult[];
};

export default function VibeCheck({ teamName, recent }: Props) {
  const wins = recent.filter((r) => r === "W").length;
  const losses = recent.length - wins;

  // Detect current streak(consecutive same results from end)
  let currentStreak = 0;
  let streakType: RecentResult | null = null;
  if (recent.length > 0) {
    streakType = recent[recent.length - 1];
    for (let i = recent.length - 1; i >= 0; i--) {
      if (recent[i] === streakType) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Vibe classification(descriptive · not predictive)
  let vibe: "hot" | "cold" | "neutral" = "neutral";
  if (wins >= 4) vibe = "hot";
  else if (losses >= 4) vibe = "cold";

  const vibeMeta = {
    hot: {
      icon: "🔥",
      label: "HOT STREAK",
      color: "text-gold shimmer",
    },
    cold: {
      icon: "❄",
      label: "COLD STREAK",
      color: "text-loss/80",
    },
    neutral: {
      icon: "⚪",
      label: "MIXED",
      color: "text-mute",
    },
  }[vibe];

  return (
    <article className="bg-slate/40 border border-line/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em]"
        >
          / VIBE CHECK · {teamName}
        </p>
        <span
          lang="en"
          className="font-mono text-mute/70 text-[9px] tracking-[0.3em]"
        >
          LENS · LIVE
        </span>
      </div>

      <div className="flex items-baseline gap-3 mb-3 flex-wrap">
        {/* 5-dot streak visualization · gold = WIN · hollow = LOSS */}
        <div
          className="flex gap-1.5"
          role="img"
          aria-label={`近 ${recent.length} 場戰績 ${wins}-${losses}`}
        >
          {recent.map((r, i) => (
            <span
              key={i}
              className={`inline-block w-3 h-3 rounded-full ${
                r === "W"
                  ? "bg-gold glow-soft"
                  : "border border-mute/50 bg-transparent"
              }`}
              title={r === "W" ? "WIN" : "LOSS"}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Vibe label */}
        <span
          lang="en"
          className={`font-mono text-[10px] tracking-[0.3em] ${vibeMeta.color}`}
        >
          {vibeMeta.icon} {vibeMeta.label}
        </span>

        {/* Current streak chip(if ≥2 consecutive) */}
        {currentStreak >= 2 && streakType && (
          <span className="font-mono text-bone text-[10px] tracking-[0.25em] tabular border border-line/60 px-1.5 py-0.5">
            連{currentStreak}{streakType === "W" ? "勝" : "敗"}
          </span>
        )}
      </div>

      <p className="text-mute text-xs sm:text-sm leading-relaxed">
        近 {recent.length} 場戰績 ·{" "}
        <span className="font-mono text-bone tabular">
          {wins}W-{losses}L
        </span>
        。
      </p>

      {/* Pratfall axiom · 「hot hand fallacy」 educational disclaimer */}
      <p className="mt-3 font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.22em] leading-relaxed">
        ⚠ <strong className="text-mute">Hot Hand Fallacy</strong>(Tversky /
        Gilovich 1985)· 連勝 ≠ 下一場必贏 · 連敗 ≠ 必輸 · 純 descriptive
        vibe lens · 不是 prediction signal · 引擎 prediction 仍由{" "}
        <span className="text-gold/80">Win Probability lens(v0.2)</span> drive。
      </p>
    </article>
  );
}
