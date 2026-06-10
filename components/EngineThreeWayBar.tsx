// ── ZONE 27 · EngineThreeWayBar ──────────────────────────
// 全站足球三向(主勝 / 和 / 客勝)引擎開盤條的單一來源。 之前 3 處手刻(首頁世界盃
// rail + SoccerMatchCard + SoccerReceiptView)各自一條 `h-1.5 bg-ink/60` 扁平無光暈版
// → 收斂成一個元件,並對齊棒球 MarketSplitBar 的 engine 招牌語彙(亮金 glow-gold +
// 羽化不確定接縫 = 「這是機率不是鐵口」的量化簽名 · 較粗 · rounded-full)。
//
// 🔴 上金的邊由 `goldSide`(引擎看好邊 · 來自原始機率 argmax 的 enginePick)決定,
//    不從「展示整數百分比」重算 —— 修掉近 50/50 場「金條高亮邊 ≠『引擎看好 X』文字」
//    四捨五入翻轉那個誠信瑕疵(金條與文字永遠同源)。
// 段寬仍用展示百分比(兩邊都 50% 時兩段等寬 = 誠實)。 守暗金:無紅綠、無 emoji。
// ─────────────────────────────────────────────────────

type Side = "home" | "draw" | "away";

export default function EngineThreeWayBar({
  homePct,
  drawPct,
  awayPct,
  goldSide,
  className = "",
}: {
  homePct: number;
  drawPct: number;
  awayPct: number;
  /** 引擎看好邊(enginePick)· 決定哪一段鍍金,不從展示%重算 */
  goldSide: Side;
  className?: string;
}) {
  const seg = (side: Side, pct: number) => (
    <div
      className={`h-full ${goldSide === side ? "bg-gold glow-gold" : "bg-mute/40"}`}
      style={{ width: `${pct}%` }}
    />
  );
  return (
    <div
      aria-hidden="true"
      className={`relative h-2 sm:h-2.5 flex overflow-hidden rounded-full bg-ink/60 ${className}`}
    >
      {seg("home", homePct)}
      {seg("draw", drawPct)}
      {seg("away", awayPct)}
      {/* 兩道羽化接縫(機率交界處柔光)· 同 MarketSplitBar engine 簽名 · 不佔高度、不擋點擊 */}
      <Seam left={homePct} />
      <Seam left={homePct + drawPct} />
    </div>
  );
}

function Seam({ left }: { left: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-y-0 pointer-events-none"
      style={{
        left: `calc(${left}% - 7px)`,
        width: "14px",
        background:
          "linear-gradient(90deg, transparent, rgba(245,242,234,0.5), transparent)",
      }}
    />
  );
}
