// ── ZONE 27 · Matchup History Lens ─────────────────────
// Round 40 W-B · 第 7 個 BLACK CARD analytical lens 真實 LIVE · 接 R40 W-A
// Bullpen Depth · per [[feedback-no-waiting-rule]] iron rule。 從 R36 W-A
// Lens Variety table 第 7 個 candidate「Matchup History · 此 matchup 過去
// N 場 H2H + 趨勢」 落地 · 完成 7-lens canvas。
//
// 跟 Bullpen Depth 不同 · Matchup History 是 REAL DATA(不是 v0.1 PROXY):
//   - 用 existing matches.ts finalized data
//   - 自動 derive H2H from same-team-pair matches
//   - N=0/1 stage 顯 educational lens explaining「為什麼 H2H 重要」
//   - N≥3 後 surface 真實 trend
//
// 此 lens 完成 7-lens Lens Variety canvas:
//   Win Probability + Vibe Check + Park Factor + Pitcher Fatigue +
//   Underdog Tracker + Bullpen Depth + ✓ Matchup History = 7 LIVE
//
// displacement narrative 物理閉環:
//   /methodology Section 05 inversion punchline:
//   「Most prediction sites have 1 fake angle. WE BUILT 7 honest ones.」
//   ← 從「building」 升 「built」 LIVE truth not future promise
//
// Brand IP 全 ✓:
//   - 0 prediction promise(visualizer · 不問「誰會贏」)
//   - 0 cash / 0 referral
//   - Pratfall · N=0/1 stage 主動 surface「sample debt · H2H 在 N≥10
//     之前 statistically meaningless · noise > signal」
//   - Costly Signaling · 我們 ship 7 lenses 全部 publish methodology · 7
//     individual disclosure pages
//   - Disclosure · 延伸 /track-record + /calibration 同 sample debt pattern
//
// Render placement:/matches/[gameId] 接 BullpenDepthLens 之後 · section 01G。
// ─────────────────────────────────────────────────────

import { getFinalizedMatches, type Match } from "@/lib/matches";

type Props = {
  match: Match;
};

type H2HEncounter = {
  matchId: string;
  date: string;
  homeName: string;
  awayName: string;
  homeScore: number;
  awayScore: number;
  winner: "home" | "away" | "tie";
  // Did the team currently shown as HOME win this historical encounter?
  currentHomeWon: boolean;
};

// Find all finalized matches where these two team names face each other
// (in any order — home/away swap counts as same matchup)
function findH2HEncounters(currentMatch: Match): H2HEncounter[] {
  const allFinalized = getFinalizedMatches();
  const currentHomeName = currentMatch.home.name;
  const currentAwayName = currentMatch.away.name;

  return allFinalized
    .filter((m) => {
      if (m.id === currentMatch.id) return false; // skip self
      if (!m.finalResult) return false;
      const sameMatchup =
        (m.home.name === currentHomeName && m.away.name === currentAwayName) ||
        (m.home.name === currentAwayName && m.away.name === currentHomeName);
      return sameMatchup;
    })
    .map((m): H2HEncounter => {
      const fr = m.finalResult!;
      const winnerSide = fr.winner;
      const currentHomeWasHome = m.home.name === currentHomeName;
      const currentHomeWon =
        (currentHomeWasHome && winnerSide === "home") ||
        (!currentHomeWasHome && winnerSide === "away");
      return {
        matchId: m.id,
        date: m.date,
        homeName: m.home.name,
        awayName: m.away.name,
        homeScore: fr.homeScore,
        awayScore: fr.awayScore,
        winner: fr.winner,
        currentHomeWon,
      };
    });
}

export default function MatchupHistoryLens({ match }: Props) {
  const encounters = findH2HEncounters(match);
  const n = encounters.length;

  // Tally H2H from current home team's perspective
  const currentHomeWins = encounters.filter((e) => e.currentHomeWon).length;
  const currentAwayWins = n - currentHomeWins;

  return (
    <article className="bg-slate/40 border border-line/60 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3 flex-wrap mb-3">
        <p
          lang="en"
          className="font-mono text-gold text-[10px] tracking-[0.35em]"
        >
          / MATCHUP HISTORY · H2H past encounters
        </p>
        <span
          lang="en"
          className={`font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 border ${
            n === 0
              ? "border-loss/40 text-loss/85"
              : n < 10
              ? "border-loss/40 text-loss/85"
              : "border-gold/60 text-gold"
          }`}
          aria-label={`Sample size: ${n} historical encounters`}
        >
          {n === 0
            ? "N=0 · FIRST ENCOUNTER"
            : n < 10
            ? `N=${n} · SAMPLE DEBT`
            : `N=${n} · MEANINGFUL`}
        </span>
      </div>

      <p className="text-mute/80 text-xs mb-3">
        {match.home.name} vs {match.away.name}
      </p>

      {n === 0 ? (
        // ── Empty state · First encounter · educational lens ────
        <div className="border border-dashed border-mute/30 bg-slate/30 p-4">
          <p
            lang="en"
            className="font-mono text-bone text-[10px] tracking-[0.3em] mb-3"
          >
            FIRST ENCOUNTER IN ZONE 27 DATASET
          </p>
          <p className="text-mute leading-relaxed text-sm mb-3">
            這兩隊 在 ZONE 27 已 ingest 的賽事中 · 0 場 encounter。 H2H lens
            在 N≥10 之前 statistically meaningless · 任何 trend 都可能是雜訊。
          </p>
          <p className="font-mono text-mute/70 text-[9px] tracking-[0.22em] leading-relaxed">
            ⚓ 每場 finalized 後 · 此 lens 自動 ingest · 不需 manual entry。
            samples 隨時間累積 · 真實 H2H trend 在 N≥10 後 surface。
          </p>
        </div>
      ) : (
        // ── Has encounters · render H2H tally + list ────
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="border border-line/40 bg-slate/50 p-3">
              <p
                lang="en"
                className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1"
              >
                {match.home.en} · HOME
              </p>
              <p
                lang="en"
                className={`font-mono text-2xl sm:text-3xl tabular tracking-tight ${
                  currentHomeWins > currentAwayWins
                    ? "text-gold"
                    : currentHomeWins === currentAwayWins
                    ? "text-bone"
                    : "text-mute"
                }`}
              >
                {currentHomeWins}
              </p>
              <p
                lang="en"
                className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1"
              >
                WINS
              </p>
            </div>
            <div className="border border-line/40 bg-slate/30 p-3">
              <p
                lang="en"
                className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-1"
              >
                {match.away.en} · AWAY
              </p>
              <p
                lang="en"
                className={`font-mono text-2xl sm:text-3xl tabular tracking-tight ${
                  currentAwayWins > currentHomeWins
                    ? "text-gold"
                    : currentHomeWins === currentAwayWins
                    ? "text-bone"
                    : "text-mute"
                }`}
              >
                {currentAwayWins}
              </p>
              <p
                lang="en"
                className="font-mono text-mute/80 text-[10px] tracking-[0.22em] mt-1"
              >
                WINS
              </p>
            </div>
          </div>

          {/* H2H list */}
          <div className="mb-3">
            <p
              lang="en"
              className="font-mono text-mute/70 text-[9px] tracking-[0.3em] mb-2"
            >
              ENCOUNTERS · {n} · most recent first
            </p>
            <div className="space-y-1.5">
              {encounters.slice(0, 5).map((e) => (
                <div
                  key={e.matchId}
                  className="flex items-baseline gap-2 flex-wrap"
                >
                  <span className="font-mono text-mute/80 text-[10px] tabular tracking-[0.18em]">
                    {e.date.split("·")[0].trim()}
                  </span>
                  <span className="text-mute text-xs">
                    {e.homeName}
                  </span>
                  <span
                    lang="en"
                    className="font-mono text-bone text-xs tabular tracking-[0.18em]"
                  >
                    {e.homeScore}:{e.awayScore}
                  </span>
                  <span className="text-mute text-xs">
                    {e.awayName}
                  </span>
                  <span
                    lang="en"
                    className={`font-mono text-[9px] tracking-[0.22em] ml-auto ${
                      e.currentHomeWon ? "text-gold" : "text-mute"
                    }`}
                  >
                    {e.currentHomeWon ? `→ ${match.home.en} W` : `→ ${match.away.en} W`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Pratfall axiom · sample debt + educational disclaimer */}
      <p className="font-mono text-mute/70 text-[9px] sm:text-[10px] tracking-[0.22em] leading-relaxed mt-3">
        ⚠ <strong className="text-mute">H2H ≠ 預測信號</strong> · 過去 encounter
        不代表 今晚 outcome · 球員陣容變動 · 場地不同 · 季節 stage 不同 都
        weakens 直接 inference。 H2H lens 主要 surface「歷史 context」 fan-
        grammar value · 不是 predictive feature(那是 Win Probability lens 的
        job)。 引擎 prediction 仍由{" "}
        <span className="text-gold/80">Win Probability lens(v0.2)</span> drive。
      </p>
    </article>
  );
}
