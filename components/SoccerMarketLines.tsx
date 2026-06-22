import { deriveSoccerMarkets, type SoccerPrediction } from "@/lib/soccer/engine";

// ── ZONE 27 · 足球玩法機率(大小球 / 讓球 / 兩隊進球)──────────────────────
// 賭徒看足球,腦袋裝的是「大小球 2.5 大還小?」「讓 1.5 球守不守得住?」——不是 xG。
// 棒球卡已有「讓分 + 大小盤」(MatchSimulator)· 這是它的足球雙生,擺在世界盃賽事卡上。
//
// 數字全從預測自帶的 λ 重建「跟主/和/客同一張」Dixon-Coles 比分表推導(deriveSoccerMarkets)·
// 與卡片上的勝/平/負 % 同源、零 drift。 視覺刻意「次要、安靜」:招牌是上面那條亮金三向條,
// 這裡是補充讀數(領先側上金、另一側 mute · 無 glow bar · 不跟招牌搶眼)。
//
// 🔴 守線:純機率陳述(.5 線 → 互補加總 100)· 不接莊家盤口、不轉賠率、不出「押這邊」。
//   「0 盤口」做成招牌印記(同棒球「0 ODDS」)—— 把「我們不秀盤口」這條限制翻成品牌驕傲。
// ─────────────────────────────────────────────────────

export default function SoccerMarketLines({
  prediction,
}: {
  prediction: SoccerPrediction;
}) {
  // 大小球 + 讓球都升級成可押的 strip(OverUnderStrip / HandicapStrip · 在卡片下方)·
  // 這裡只留唯讀的「兩隊進球」引擎讀數 —— 避免同一玩法在卡上出現兩次、且不同線值打架(R257 稽核)。
  const m = deriveSoccerMarkets(prediction.xgHome, prediction.xgAway);

  return (
    <div className="mt-2.5 pt-2.5 border-t border-line/40">
      <div className="flex items-baseline justify-between mb-1.5">
        <p className="font-mono text-mute/70 text-[9px] tracking-[0.3em]">
          / 玩法機率
        </p>
        <p
          className="font-mono text-mute/45 text-[8px] tracking-[0.3em]"
          title="從引擎同一張比分機率表推導 · 不接任何莊家盤口"
        >
          0 盤口
        </p>
      </div>

      <ul
        aria-label="玩法機率 · 我們引擎算的機率"
        className="space-y-1 list-none pl-0 m-0"
      >
        <MarketRow
          label="兩隊進球"
          aLabel="是"
          aPct={m.bttsYesPct}
          bLabel="否"
          bPct={m.bttsNoPct}
        />
      </ul>

      <p className="font-mono text-mute text-[10px] tracking-[0.2em] leading-relaxed mt-1.5">
        ▸ 我們引擎算的機率 · <span className="text-mute">不是賠率</span>
      </p>
    </div>
  );
}

// 一列玩法:左=名稱(+線)· 右=兩個互補機率 · 數字大的那邊上金(視線自然落在較可能的結果)。
function MarketRow({
  label,
  line,
  aLabel,
  aPct,
  bLabel,
  bPct,
}: {
  label: string;
  line?: string;
  aLabel: string;
  aPct: number;
  bLabel: string;
  bPct: number;
}) {
  return (
    <li className="grid grid-cols-[5.5rem_1fr_1fr] gap-2 items-baseline">
      <span className="font-mono text-mute/75 text-[10px] tracking-[0.12em] truncate">
        {label}
        {line ? <span className="text-mute/45"> {line}</span> : null}
      </span>
      <MarketSide side={aLabel} pct={aPct} lead={aPct >= bPct} />
      <MarketSide side={bLabel} pct={bPct} lead={bPct > aPct} />
    </li>
  );
}

// 單側機率 · 領先側上金、另一側 mute(同棒球 MatchSimulator 的玩法讀數語彙 · 無 glow bar)。
function MarketSide({
  side,
  pct,
  lead,
}: {
  side: string;
  pct: number;
  lead: boolean;
}) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span
        className={`font-mono text-[10px] tracking-[0.2em] ${
          lead ? "text-bone/90" : "text-mute/50"
        }`}
      >
        {side}
      </span>
      <span
        className={`font-mono tabular text-[13px] ${lead ? "text-gold" : "text-mute"}`}
      >
        {pct}
        <span className="text-[9px] opacity-60">%</span>
      </span>
    </span>
  );
}
