// ── ZONE 27 · MarketSplitBar ─────────────────────────────
// 全站 home/away 雙色市場分裂條的單一來源。 之前 4 處手刻(引擎開盤線 ×2 +
// 群眾市場線 ×2)各自漂移高度 / 金色透明度 / 接縫處理 → 收斂成一個元件。
//
// 兩個 variant 視覺層級「故意」分明 —— 解 CLAUDE.md 鐵律「引擎預測 vs 群眾預測
// 必須視覺/可信度分離」(同卡片若引擎線 + 群眾線並陳 · 兩條金條一眼分得出誰是誰):
//   · engine = 招牌 · 亮金 glow-gold + 羽化不確定接縫(這是機率不是鐵口的量化簽名)·
//              較粗 · 引擎平手(goldSide null)時兩邊都不上金(不硬塞一邊)。
//   · crowd  = 次要 · 暗金(gold/70)無光暈無接縫 · 較細 · 讀作「群眾的聲音 · 不是引擎開的盤」。
//
// home/away 兩邊寬度分開傳(不從 100-home 推)· 引擎線 home+away 可能 <100(平局
// residual 露成 bg-line · 誠實殘差)· 群眾線則 home+away=100。
// ─────────────────────────────────────────────────────

type Props = {
  /** 左半(home)寬度 0-100 */
  homePct: number;
  /** 右半(away)寬度 0-100 · 分開傳:引擎線兩者和可 <100(平局殘差) */
  awayPct: number;
  /** 哪一邊上金 · null = 兩邊都 mute(引擎開盤平手 · 不硬塞一邊) */
  goldSide: "home" | "away" | null;
  /** engine = 亮金+光暈+接縫(招牌)· crowd = 暗金細條無光暈(次要) */
  variant: "engine" | "crowd";
  /** 給螢幕閱讀器的描述 · 省略 = aria-hidden(外層 wrapper 已描述時用 · 避免巢狀 role=img) */
  ariaLabel?: string;
  className?: string;
};

export default function MarketSplitBar({
  homePct,
  awayPct,
  goldSide,
  variant,
  ariaLabel,
  className = "",
}: Props) {
  const isEngine = variant === "engine";
  const goldClass = isEngine ? "bg-gold glow-gold" : "bg-gold/70";
  const muteClass = isEngine ? "bg-mute/45" : "bg-mute/35";
  const heightClass = isEngine ? "h-2 sm:h-2.5" : "h-1.5";

  return (
    <div
      {...(ariaLabel
        ? { role: "img" as const, "aria-label": ariaLabel }
        : { "aria-hidden": true })}
      className={`relative ${heightClass} flex overflow-hidden rounded-full bg-line/50 ${className}`}
    >
      <div
        className={`h-full ${goldSide === "home" ? goldClass : muteClass}`}
        style={{ width: `${homePct}%` }}
      />
      <div
        className={`h-full ${goldSide === "away" ? goldClass : muteClass}`}
        style={{ width: `${awayPct}%` }}
      />
      {/* 不確定性接縫 · 兩邊機率交界羽化一道柔光 = 視覺上「這是機率,不是鐵口」·
          量化品牌簽名筆觸(UncertaintyStripe fan-chart 精神 · 條內迷你版)· 只 engine
          variant 帶 · 絕對定位 overlay · clip 在 bar 內 · 不佔高度、不擋點擊。 */}
      {isEngine && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 pointer-events-none"
          style={{
            left: `calc(${homePct}% - 7px)`,
            width: "14px",
            background:
              "linear-gradient(90deg, transparent, rgba(245,242,234,0.5), transparent)",
          }}
        />
      )}
    </div>
  );
}
