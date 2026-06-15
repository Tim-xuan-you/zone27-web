import type { MomentumReversal, ReversalLeg } from "@/lib/momentum-reversal";

// ── ZONE 27 · 氣勢反轉證物卡(/calibration · R239)──────────────────────────────
// 「不用我們講理論,看最近這兩場」—— 同兩隊、隔幾天、贏家完全換邊。 固定 A/B 兩欄:
// 金色(贏家)在兩列之間從一邊跳到另一邊 = 一眼看見「氣勢」翻盤。 守暗金:無紅綠 · 贏=金/骨白 ·
// 輸=mute。 🔴 不主張我們預測到(純官方賽果 · 見 lib/momentum-reversal.ts 誠實紅線)。
// ─────────────────────────────────────────────────────

function Leg({
  leg,
  teamA,
  teamB,
  label,
}: {
  leg: ReversalLeg;
  teamA: string;
  teamB: string;
  label: string;
}) {
  const aWin = leg.winner === "A";
  return (
    <div>
      <p className="font-mono text-mute/55 text-[10px] tracking-[0.2em] mb-1.5">
        {label}
      </p>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
        <span
          className={`text-right text-base sm:text-lg font-light tracking-tight ${
            aWin ? "text-bone" : "text-mute/65"
          }`}
        >
          {teamA}
        </span>
        <span className="font-mono tabular text-2xl sm:text-3xl font-light whitespace-nowrap">
          <span className={aWin ? "text-gold" : "text-mute/55"}>{leg.aScore}</span>
          <span className="text-mute/40 mx-2">:</span>
          <span className={!aWin ? "text-gold" : "text-mute/55"}>{leg.bScore}</span>
        </span>
        <span
          className={`text-left text-base sm:text-lg font-light tracking-tight ${
            !aWin ? "text-bone" : "text-mute/65"
          }`}
        >
          {teamB}
        </span>
      </div>
    </div>
  );
}

export default function MomentumReversalExhibit({
  reversal,
}: {
  reversal: MomentumReversal;
}) {
  const { teamA, teamB, daysApart, later, earlier } = reversal;
  return (
    <div className="bg-slate/30 border border-line/60 p-5 sm:p-8">
      <p className="font-mono text-gold/80 text-[10px] tracking-[0.3em] mb-5">
        / 同兩隊 · 隔 {daysApart} 天 · 完全相反
      </p>

      {/* 較近那場放上面(recency)· 較早放下面 · 金色贏家在兩列間換邊 */}
      <Leg leg={later} teamA={teamA} teamB={teamB} label={later.monthDay} />

      <div className="flex items-center gap-3 my-3.5">
        <div className="flex-1 h-px bg-line/40" />
        <span className="font-mono text-gold/70 text-[9px] tracking-[0.25em]">
          完全相反
        </span>
        <div className="flex-1 h-px bg-line/40" />
      </div>

      <Leg leg={earlier} teamA={teamA} teamB={teamB} label={earlier.monthDay} />

      <p className="mt-6 pt-5 border-t border-line/40 text-mute leading-relaxed text-sm sm:text-[15px]">
        {teamA} 前一場才{" "}
        <span className="text-bone">
          {earlier.aScore}:{earlier.bScore}
        </span>{" "}
        贏,隔 {daysApart} 天、同樣兩隊,換 {teamB}{" "}
        <span className="text-bone">
          {later.bScore}:{later.aScore}
        </span>{" "}
        贏回去。 昨天的結果,對今天幾乎沒有預測力 —— 任何在中間叫你「跟氣勢、壓{" "}
        {teamA}」的,這一場讓你賠光。{" "}
        <span className="text-gold">
          這就是為什麼沒有「神準」這種引擎,只有逐場攤開的校準。
        </span>
      </p>
    </div>
  );
}
